---
name: quick
description: Small, well-defined task without a phase: one agent plans and builds it, files are checked out and in, the reviewer reads the diff, one commit per task.
argument-hint: "<task>"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

Task: $ARGUMENTS. Session id: see `/gg:resume`. Godot binary from `.gamedev/config.md`.

1. Spawn `gg:gg-planner` with "quick plan: <task>. One plan file `.gamedev/plans/quick/Q-<date>-<slug>.md`, at most 4 files, no new contract unless unavoidable; if the task changes a contract or touches more, report 'not quick'". "not quick" → tell the human to use `/gg:feature` or `/gg:discuss`.
2. `gg:gg-manager`: check out the plan's files.
3. `gg:gg-developer` with the plan; then `gg:gg-reviewer` on `<start>..HEAD`; one fix round as in `/gg:execute`.
4. `gg:gg-manager`: check in; `next_step` unchanged.
5. Report in three lines: commits, review verdict, files.
Last line, always, also after a blocker: `State saved. /clear is safe. Next: the `next_step` from status.md`.
