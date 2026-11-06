// gg-stop.js — Stop hook: after a /gg: command the reply must end with the state line. Reads the hook JSON on stdin.
// Fails open: any read or parse problem lets the stop through. Blocks once; stop_hook_active prevents a loop.
const fs = require("fs");
const path = require("path");

const EXEMPT = new Set(["help", "status", "research"]);
const LINE = "State saved. /clear is safe. Next:";
const MAX = 4 * 1024 * 1024;

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

function readTail(file) {
  const size = fs.statSync(file).size;
  const fd = fs.openSync(file, "r");
  const len = Math.min(size, MAX);
  const buf = Buffer.alloc(len);
  fs.readSync(fd, buf, 0, len, size - len);
  fs.closeSync(fd);
  return buf.toString("utf8");
}

const promptText = (e) => {
  if (e.type !== "user" || e.isMeta || !e.message) return null;
  const c = e.message.content;
  if (typeof c === "string") return c;
  if (!Array.isArray(c) || c.some((b) => b.type === "tool_result")) return null;
  const t = c.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  return t || null;
};

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  try {
    const j = JSON.parse(raw);
    if (j.stop_hook_active || !j.transcript_path) process.exit(0);
    if (!findRoot(j.cwd || process.cwd())) process.exit(0);
    const entries = readTail(j.transcript_path).split("\n").map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    let at = -1, prompt = null;
    for (let i = entries.length - 1; i >= 0; i--) { prompt = promptText(entries[i]); if (prompt !== null) { at = i; break; } }
    if (at < 0) process.exit(0);
    const m = /<command-name>\/?gg:([a-z-]+)<\/command-name>/.exec(prompt) || /^\s*\/gg:([a-z-]+)/.exec(prompt);
    if (!m || EXEMPT.has(m[1])) process.exit(0);
    let last = null;
    for (let i = entries.length - 1; i > at; i--) {
      const e = entries[i];
      if (e.type !== "assistant" || !e.message || !Array.isArray(e.message.content)) continue;
      const t = e.message.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
      if (t.trim()) { last = t; break; }
    }
    if (last === null) process.exit(0);
    const lines = last.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const final = (lines.pop() || "").replace(/^[`*>\s]+/, "");
    if (final.startsWith(LINE)) process.exit(0);
    process.stdout.write(JSON.stringify({
      decision: "block",
      reason: "gg: a /gg:" + m[1] + " turn ends with the line `" + LINE + " <one /gg: command>` in English, unchanged, as the last line (rules/session.md). " +
        "If the command is not finished, ask the next question with AskUserQuestion instead of ending the turn. If state was not saved yet, save it first.",
    }));
    process.exit(0);
  } catch { process.exit(0); }
});
