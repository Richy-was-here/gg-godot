---
name: autonomous
description: Run unattended to a goal (milestone or phase id): plan, execute with parallel waves, verify, next phase. Human checks are collected, not awaited. Stops only for a decision or a blocker that survives one retry.
argument-hint: "<milestone id | phase id>"
allowed-tools: Read, Bash, Grep, Glob, Agent
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root" to every agent you spawn; agents find templates, rules and bin/ there.

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

Final report (also written by `gg:gg-manager` into `status.md` `next_step` as one line):
- phases done: ids with plan counts
- human checks waiting: numbered, grouped by phase (`/gg:review`)
- stop reason: goal reached | decision: <question> | blocker: <what>
- next command
