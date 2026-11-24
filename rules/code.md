# code rules
# Read by gg-developer, gg-reviewer and gg-planner. Rules the official Godot docs do not cover.
- Script header: at most two comment lines (purpose, responsibility), placed where conventions.md puts the doc comment. Explanations go to .gamedev/ documents.
- A prepared extension point gets exactly one comment line at the spot, `# API: <subsystem>.<name>`, and a `prepared` entry with the same name in the subsystem's contract. The explanation stands only in the contract. When the extension is built, the marker goes and the entry moves to `interface`.
- Code that a task replaces is deleted in the same task. No old version stays beside the new one, commented out or not.
- New files only at the paths the plan names; those lie inside the `folders` of config.md.
- Logging goes through `push_error` / `push_warning`. `print` is debug output and fails verify.
- Creative in-game text is placeholder only and contains the literal marker `[AI]`. Factual text is plain.
- Every AI-made graphic or sound gets a line in .gamedev/ai-made.md in the same commit.
- Commit per task; `git add` with explicit paths from the plan only; message `<plan id>: <task name>`.
- Write only files checked out to you. A needed file that is not checked out: stop and report.
- A contract that does not fit: stop and report. Never change a contract as a developer.
- One-off tests and tools live only under `tests/qa/` and are deleted in the same plan that created them. A test that stays is listed in the index and in decisions.md.
- English in code and comments. In-game text in the game's language.
