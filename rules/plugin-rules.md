# plugin rules
# Rules the official Godot docs do not cover. Loaded by developer, reviewer and planner.
- Script header: at most two comment lines (purpose, responsibility). Explanations go to .gamedev/ documents.
- No tooling outside Godot in the game project (no Python, Node, shell helpers) unless a decision in decisions.md justifies it.
- One-off tests and tools are deleted in the same plan that created them. A tool that stays useful is kept and recorded in decisions.md.
- Creative in-game text is placeholder only and contains the literal marker `[AI]`. Factual text is plain.
- Every AI-made graphic or sound gets a line in .gamedev/ai-made.md in the same commit.
- Commit per task; `git add` with explicit paths from the plan only; message `<plan id>: <task name>`.
- Write only files checked out to you. A needed file that is not checked out: stop and report.
- A contract that does not fit: stop and report. Never change a contract as a developer.
- No code blocks in plan actions. No examples in documents. No progress prose anywhere.
- Documents only from templates in `${CLAUDE_PLUGIN_ROOT}/templates/`. Field names unchanged.
- English in code, comments and documents. In-game text in the game's language.
