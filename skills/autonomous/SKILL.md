---
name: autonomous
description: Run unattended to a goal (milestone or phase id): plan, execute with parallel waves, verify, next phase. Human checks are collected, not awaited. Stops only for a decision or a blocker that survives one retry.
argument-hint: "<milestone id | phase id>"
allowed-tools: Read, Bash, Grep, Glob, Agent
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

Goal: $ARGUMENTS. Session id: see `/gg:resume`. Mode flags for the procedures you call: `plan --auto`, `execute faster`, verify in autonomous mode.

Loop until the goal's `status` is `done` or a stop condition holds:
1. Pick the next phase as in `/gg:next` step 6, restricted to phases inside the goal (the phase itself, or phases of the milestone). A phase with no `done_when` is a stop condition (decision needed: run `/gg:discuss <phase>`).
2. `/gg:plan <phase> --auto` → `/gg:execute <phase> faster` → `/gg:verify <phase>`.
3. Verify FAIL: execute the fix plan once, verify again. Second FAIL: stop condition (blocker).
4. Phase done: continue. Milestone done: do not run `/gg:complete-milestone`; that needs the human.

Stop conditions, each ends the run immediately with the report below:
- a decision: planner reports uncovered decisions or open questions; a developer reports a contract problem; `/gg:feature`-type scope change appears; ui-spec missing
- a blocker: reviewer or QA fails twice, `gg-check load` fails after a fix plan, a check-out refused twice, lock busy
- the goal is reached

Never ask the human during the run. Never write to vision.md or decisions.md yourself. Never run complete-milestone.

Final report:
- phases done: ids with plan counts
- human checks waiting: count per phase from `status.md` (`/gg:review` shows them)
- stop reason: goal reached | decision: <question> | blocker: <what>
A blocker goes to `gg:gg-manager` as "blocker <tool or gate> <symptom>; <ids>". `next_step` in status.md is the command named below, nothing else.
Last line, always, also after a blocker: `State saved. /clear is safe. Next: <the command for the stop reason: `/gg:review`, `/gg:discuss <id>`, or the failed command again>`.
