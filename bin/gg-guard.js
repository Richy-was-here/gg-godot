// gg-guard.js — PreToolUse hook for gg projects. Reads the hook JSON on stdin; exit 2 blocks the call.
// Enforces the gg-qa allowlist, rules/shell.md for every agent and the .gamedev/ layout of rules/documents.md.
const fs = require("fs");
const path = require("path");

const BLOCKED = new Set(["python", "python2", "python3", "py", "pip", "pip3", "node", "npm", "npx", "deno", "bun",
  "perl", "ruby", "php", "powershell", "pwsh", "cscript", "wscript"]);
const SCRIPT_EXT = /\.(py|pyw|js|mjs|cjs|ts|ps1|rb|pl|php|vbs)$/;
const WRAPPERS = new Set(["env", "command", "exec", "nohup", "time", "sudo", "nice", "timeout", "xargs", "start", "call"]);
const LAYOUT = [/^vision\.md$/, /^roadmap\.md$/, /^decisions\.md$/, /^index\.md$/, /^index\/[^/]+\.md$/, /^status\.md$/,
  /^human-checks\.md$/, /^conventions\.md$/, /^ui-spec\.md$/, /^ai-made\.md$/, /^notes\.md$/, /^config\.md$/,
  /^\.gdignore$/, /^plans\/[^/]+\/[^/]+\.md$/, /^contracts\/[^/]+\.md$/, /^\.lock\//];
const NULL_TARGETS = /^(\/dev\/null|\/dev\/stdout|\/dev\/stderr|nul)$/i;

const slash = (p) => String(p || "").replace(/\\/g, "/").replace(/^\/([A-Za-z])\//, "$1:/");
const isAbs = (p) => p.startsWith("/") || /^[A-Za-z]:\//.test(p);
const base = (t) => slash(t).split("/").pop().toLowerCase().replace(/\.(exe|cmd|bat)$/, "");
const block = (msg) => { process.stderr.write("gg-guard: " + msg + "\n"); process.exit(2); };

function normPath(p) {
  const parts = [];
  for (const s of p.split("/")) {
    if (s === "" && parts.length) continue;
    if (s === ".") continue;
    if (s === "..") { if (parts.length > 1) parts.pop(); continue; }
    parts.push(s);
  }
  return parts.join("/");
}

function findRoot(cwd) {
  let dir = cwd;
  for (let i = 0; i < 12 && dir; i++) {
    try { if (fs.statSync(path.join(dir, ".gamedev")).isDirectory()) return dir; } catch { /* not here */ }
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return null;
}

function allowedExternal(root) {
  const set = new Set();
  let txt = "";
  try { txt = fs.readFileSync(path.join(root, ".gamedev", "config.md"), "utf8"); } catch { return set; }
  let inList = false;
  for (const line of txt.split(/\r?\n/)) {
    if (/^allowed_external:/.test(line)) { inList = true; continue; }
    if (inList && /^\S/.test(line)) break;
    const m = inList && /^\s+-\s+([^\s<][^\s]*)/.exec(line);
    if (m) set.add(base(m[1]));
  }
  return set;
}

function matchParen(s, open) {
  let depth = 0;
  for (let k = open; k < s.length; k++) {
    const ch = s[k];
    if (ch === "'") { const e = s.indexOf("'", k + 1); if (e < 0) return s.length; k = e; continue; }
    if (ch === "(") depth++;
    else if (ch === ")") { depth--; if (depth === 0) return k; }
  }
  return s.length;
}

// Splits a shell command into segments of words, collecting file redirections, heredocs and command substitutions.
function lex(cmd) {
  const out = { segs: [], redirects: [], heredoc: false, subs: [] };
  let words = [], cur = "", has = false, i = 0;
  const n = cmd.length;
  const endWord = () => { if (has) words.push(cur); cur = ""; has = false; };
  const endSeg = () => { endWord(); if (words.length) out.segs.push(words); words = []; };
  while (i < n) {
    const c = cmd[i];
    if (c === "'") { const j = cmd.indexOf("'", i + 1); const e = j < 0 ? n : j; cur += cmd.slice(i + 1, e); has = true; i = e + 1; continue; }
    if (c === '"') {
      let j = i + 1;
      while (j < n && cmd[j] !== '"') {
        if (cmd[j] === "\\" && j + 1 < n) { cur += cmd[j + 1]; j += 2; continue; }
        if (cmd[j] === "$" && cmd[j + 1] === "(") { const k = matchParen(cmd, j + 1); out.subs.push(cmd.slice(j + 2, k)); j = k + 1; continue; }
        if (cmd[j] === "`") { const k = cmd.indexOf("`", j + 1); const e = k < 0 ? n : k; out.subs.push(cmd.slice(j + 1, e)); j = e + 1; continue; }
        cur += cmd[j]; j++;
      }
      has = true; i = j + 1; continue;
    }
    if (c === "\\" && i + 1 < n) { if (cmd[i + 1] !== "\n") { cur += cmd[i + 1]; has = true; } i += 2; continue; }
    if (c === "$" && cmd[i + 1] === "(") { const k = matchParen(cmd, i + 1); out.subs.push(cmd.slice(i + 2, k)); cur += "$()"; has = true; i = k + 1; continue; }
    if (c === "`") { const k = cmd.indexOf("`", i + 1); const e = k < 0 ? n : k; out.subs.push(cmd.slice(i + 1, e)); has = true; i = e + 1; continue; }
    if (c === "#" && !has) { const k = cmd.indexOf("\n", i); i = k < 0 ? n : k; continue; }
    if (c === " " || c === "\t" || c === "\r") { endWord(); i++; continue; }
    if (c === "\n" || c === ";" || c === "&" || c === "|" || c === "(" || c === ")") { endSeg(); i++; continue; }
    if (c === "<") {
      endWord();
      if (cmd.startsWith("<<<", i)) { i += 3; continue; }
      if (cmd.startsWith("<<", i)) { out.heredoc = true; i += 2; continue; }
      i++; continue;
    }
    if (c === ">") {
      if (has && /^\d+$/.test(cur)) { cur = ""; has = false; } else endWord();
      let j = i + 1;
      if (cmd[j] === ">") j++;
      if (cmd[j] === "&") { j++; while (j < n && /[0-9-]/.test(cmd[j])) j++; i = j; continue; }
      if (cmd[j] === "|") j++;
      while (j < n && (cmd[j] === " " || cmd[j] === "\t")) j++;
      let t = "";
      while (j < n && !/[\s;&|()<>]/.test(cmd[j])) {
        if (cmd[j] === '"' || cmd[j] === "'") { const k = cmd.indexOf(cmd[j], j + 1); const e = k < 0 ? n : k; t += cmd.slice(j + 1, e); j = e + 1; }
        else { t += cmd[j]; j++; }
      }
      out.redirects.push(t);
      i = j; continue;
    }
    cur += c; has = true; i++;
  }
  endSeg();
  return out;
}

const RULE = " (rules/shell.md). Read with Read/Grep/Glob, change files with Write/Edit, run logic in Godot; otherwise stop and report. Do not retry in another form.";

function checkShell(cmd, allowed, depth) {
  if (depth > 4) return null;
  const lx = lex(cmd);
  if (lx.heredoc) return "heredocs (<<) are not allowed" + RULE;
  for (const t of lx.redirects) if (!NULL_TARGETS.test(t)) return "redirection into a file (> " + t + ") is not allowed" + RULE;
  for (const s of lx.subs) { const r = checkShell(s, allowed, depth + 1); if (r) return r; }
  for (const w of lx.segs) {
    let k = 0;
    while (k < w.length) {
      const tok = w[k], b = base(tok);
      if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(tok)) { k++; continue; }
      if (WRAPPERS.has(b)) {
        k++;
        while (k < w.length && (w[k].startsWith("-") || /^[A-Za-z_][A-Za-z0-9_]*=/.test(w[k]) || (b === "timeout" && /^\d/.test(w[k])))) k++;
        continue;
      }
      if (b === "cmd") { k++; while (k < w.length && /^\/[a-z]$/i.test(w[k])) k++; continue; }
      break;
    }
    if (k >= w.length) continue;
    const head = base(w[k]);
    const args = w.slice(k + 1);
    if (["bash", "sh", "zsh", "dash"].includes(head)) {
      const ci = args.indexOf("-c");
      if (ci >= 0 && args[ci + 1] !== undefined) { const r = checkShell(args[ci + 1], allowed, depth + 1); if (r) return r; }
      continue;
    }
    if (allowed.has(head)) continue;
    if (BLOCKED.has(head)) return head + " is not allowed in a gg project" + RULE;
    if (SCRIPT_EXT.test(head)) return "running " + head + " is not allowed in a gg project" + RULE;
    if (head === "sed" && args.some((a) => /^-[a-zA-Z]*i/.test(a) || a.startsWith("--in-place"))) return "sed -i is not allowed" + RULE;
    if ((head === "awk" || head === "gawk") && args.some((a, j) => a === "-i" && /inplace/.test(args[j + 1] || ""))) return "awk -i inplace is not allowed" + RULE;
    if (head === "tee") return "tee writes files and is not allowed" + RULE;
  }
  return null;
}

function gamedevRel(file, cwd, root) {
  let f = slash(file);
  if (!isAbs(f)) f = slash(cwd).replace(/\/+$/, "") + "/" + f;
  f = normPath(f);
  const prefix = normPath(slash(root)) + "/.gamedev/";
  const ci = /^[A-Za-z]:\//.test(f) || process.platform === "win32";
  const a = ci ? f.toLowerCase() : f, b = ci ? prefix.toLowerCase() : prefix;
  return a.startsWith(b) ? f.slice(prefix.length) : null;
}

function qaGuard(tool, input) {
  const norm = (p) => slash(p).replace(/^[A-Za-z]:/, "");
  const inQa = (p) => { const x = norm(p).replace(/^res:\/\//, "/"); return /(^|\/)tests\/qa\//.test(x) && !/(^|\/)\.\.(\/|$)/.test(x); };
  if (/^(Write|Edit|MultiEdit|NotebookEdit)$/.test(tool)) {
    if (inQa(input.file_path || "")) return;
    block("gg-qa may write only under tests/qa/ (got: " + (input.file_path || "") + ")");
  }
  if (tool === "Bash") {
    const cmd = norm(input.command || "");
    const parts = cmd.split(/\s*(?:&&|\|\||;|\|)\s*/).map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      const tokens = part.match(/"[^"]*"|'[^']*'|\S+/g) || [];
      const head = (tokens[0] || "").replace(/^["']|["']$/g, "");
      const rest = tokens.slice(1).map((t) => t.replace(/^["']|["']$/g, ""));
      if (/godot/i.test(head)) {
        if (rest.some((t) => /\.\./.test(t))) block("'..' is not allowed in a Godot run");
        continue;
      }
      if (/^(ls|cat|rm|mkdir)$/.test(head)) {
        const paths = rest.filter((t) => !t.startsWith("-"));
        if (paths.length && paths.every((t) => inQa(t) && !/\.\./.test(t))) continue;
        block(head + " is allowed for gg-qa only on paths under tests/qa/");
      }
      block("command not allowed for gg-qa: " + part.slice(0, 80));
    }
  }
}

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let j;
  try { j = JSON.parse(raw); } catch { process.exit(0); }
  const tool = String(j.tool_name || "");
  const input = j.tool_input || {};
  if (/(^|:)gg-qa$/.test(String(j.agent_type || ""))) { qaGuard(tool, input); process.exit(0); }
  const cwd = j.cwd || process.cwd();
  const root = findRoot(cwd);
  if (!root) process.exit(0);
  if (tool === "Bash") {
    const r = checkShell(String(input.command || ""), allowedExternal(root), 0);
    if (r) block(r);
    process.exit(0);
  }
  if (/^(Write|Edit|MultiEdit|NotebookEdit)$/.test(tool)) {
    const rel = gamedevRel(input.file_path || input.notebook_path || "", cwd, root);
    if (rel !== null && !LAYOUT.some((re) => re.test(rel))) {
      block(".gamedev/ holds only the documents of the SPEC layout; " + rel + " is not one of them. Put the content into the document that owns it, or leave it out.");
    }
  }
  process.exit(0);
});
