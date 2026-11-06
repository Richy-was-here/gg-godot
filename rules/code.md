# code rules
# Read by gg-developer, gg-reviewer and gg-planner. Rules the official Godot docs do not cover.
- Script header: at most two comment lines (purpose, responsibility), placed where conventions.md puts the doc comment. Explanations go to .gamedev/ documents.
- Logging goes through `push_error` / `push_warning`. `print` is debug output and fails verify.
- Creative in-game text is placeholder only and contains the literal marker `[AI]`. Factual text is plain.
- Every AI-made graphic or sound gets a line in .gamedev/ai-made.md in the same commit.
- Commit per task; `git add` with explicit paths from the plan only; message `<plan id>: <task name>`.
- Write only files checked out to you. A needed file that is not checked out: stop and report.
- A contract that does not fit: stop and report. Never change a contract as a developer.
- One-off tests and tools live only under `tests/qa/` and are deleted in the same plan that created them. A test that stays is listed in the index and in decisions.md.
- English in code and comments. In-game text in the game's language.
