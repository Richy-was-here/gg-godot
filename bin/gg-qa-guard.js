// gg-qa-guard.js — PreToolUse hook logic for the gg-qa subagent. Reads the hook JSON on stdin.
// Allowlist: Write/Edit only under tests/qa/; Bash only Godot runs and ls/cat/rm/mkdir inside tests/qa/. Exit 2 blocks.
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let j;
  try { j = JSON.parse(raw); } catch { process.exit(0); }
  const agent = String(j.agent_type || "");
  if (!/(^|:)gg-qa$/.test(agent)) process.exit(0);
  const tool = String(j.tool_name || "");
  const input = j.tool_input || {};
  const norm = (p) => String(p).replace(/\\/g, "/").replace(/^[A-Za-z]:/, "");
  const inQa = (p) => /(^|\/)tests\/qa\//.test(norm(p).replace(/^res:\/\//, "/"));
  const block = (msg) => { process.stderr.write("gg-qa: " + msg + "\n"); process.exit(2); };

  if (/^(Write|Edit|MultiEdit|NotebookEdit)$/.test(tool)) {
    if (inQa(input.file_path || "")) process.exit(0);
    block("may write only under tests/qa/ (got: " + (input.file_path || "") + ")");
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
        block(head + " is allowed only on paths under tests/qa/");
      }
      block("command not allowed: " + part.slice(0, 80));
    }
    process.exit(0);
  }
  process.exit(0);
});
