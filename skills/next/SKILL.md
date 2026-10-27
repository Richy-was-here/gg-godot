---
name: next
description: Advance one logical step: pick the next phase, plan it (stop for review), execute it, verify it, close it. Refuses to complete a milestone while human checks are open.
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Read `.gamedev/status.md` and `.gamedev/roadmap.md`. Session id: see `/gg:resume`. Decide the single next step and run that command's procedure:

1. `blockers` non-empty → show them, stop.
2. An active phase for this session with a plan in progress → `/gg:resume`.
3. An active phase whose plans exist but are not all built → `/gg:execute <phase>`.
4. An active phase, all plans built, not verified → `/gg:verify <phase>`.
5. An active phase with a fix plan not built → `/gg:execute <fix plan>`, then `/gg:verify`.
6. No active phase for this session:
   - a milestone with all phases `done` and `status: active`: if `open_human_checks` contains any of its phases → say "run /gg:review first", stop; else → say "run /gg:complete-milestone <id>", stop.
   - else the lowest planned phase whose `depends_on` are all `done` and whose milestone is `active` or has all `depends_on` done. Phase has no `done_when` yet → `/gg:discuss <phase>` first. Else → `/gg:plan <phase>`, which stops after planning.
7. Nothing left → "roadmap complete".

Print the step you chose in one line before running it. After the step, print the next command.
