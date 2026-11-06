---
name: next
description: Advance one logical step: discuss what is not yet discussed, plan the next phase (stop for review), execute it, verify it, close it. Refuses to complete a milestone while human checks are open.
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Read `.gamedev/status.md` and `.gamedev/roadmap.md`. Session id: see `/gg:resume`. Decide the single next step and run that command's procedure:

1. `blockers` non-empty → show them, stop.
2. An active phase for this session with a plan in progress → `/gg:resume`.
3. An active phase whose plans exist but are not all built → `/gg:execute <phase>`.
4. An active phase, all plans built, not verified → `/gg:verify <phase>`.
5. An active phase with a fix plan not built → `/gg:execute <fix plan>`, then `/gg:verify`.
6. No active phase for this session:
   - the project's `discussion` is `none` or `paused` → `/gg:discuss project`.
   - a milestone with all phases `done` and `status: active`: if `open_human_checks` lists any of its phases with a count above 0 → say "run /gg:review first", stop; else → say "run /gg:complete-milestone <id>", stop.
   - else the lowest milestone that is not `done` and whose `depends_on` are all `done`. Its `discussion` is not `done` → `/gg:discuss <milestone>`.
   - else in that milestone the lowest `planned` phase whose `depends_on` are all `done`. Its `discussion` is `paused`, or it has no `done_when` → `/gg:discuss <phase>`. Else → `/gg:plan <phase>`, which stops after planning.
   - A missing `discussion` field counts as `done` when a milestone has phases or a phase has `done_when`, else as `none`.
7. Nothing left → "roadmap complete".

Print the step you chose in one line before running it.
Last line, always, also after a blocker: the last line of the procedure you ran; when you ran none, `State saved. /clear is safe. Next: <the command you named>`.
