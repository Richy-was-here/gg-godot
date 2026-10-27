---
name: resume
description: Continue work from status.md after a compaction, a restart or a new session.
allowed-tools: Read, Bash, Grep, Agent
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root" to every agent you spawn; agents find templates, rules and bin/ there.

Session id: the `session=` value printed by the gg hook at session start; if none was printed, create one as `date +%Y%m%d-%H%M%S` and use it for the rest of this session.

1. Read `.gamedev/status.md`. If `active` is empty: say so and run the `/gg:next` procedure.
2. For the active block of this session (or the only block): read the plan file named there.
3. `git log --oneline | grep "^[0-9a-f]* <plan id>:"` lists finished tasks of that plan. Tasks of the plan not in that list are open.
4. If the plan's files are still checked out to this session: spawn `gg:gg-developer` with the plan, the open tasks, the checked-out set, the Godot binary from `.gamedev/config.md`. Then continue with the `/gg:execute` procedure from the reviewer step for that plan.
5. If nothing is checked out: continue with `/gg:next`.
6. Blockers listed in status.md are shown to the human before anything else.
