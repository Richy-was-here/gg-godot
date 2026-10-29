---
name: undo
description: Revert a plan or a whole phase by its commits (plan-id prefixes), after a dependency check. Asks before touching history.
argument-hint: "<plan id | phase id>"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

Target: $ARGUMENTS.

1. Commits: `git log --format='%h %s' | grep -E '^[0-9a-f]+ <target>(-[0-9]+)?:'` (a phase id matches all its plans). None → stop.
2. Dependents: plans in `.gamedev/plans/` whose `depends_on` names the target and that have commits of their own. List them; reverting the target without them breaks the tree. Ask: revert target only | revert with dependents | cancel.
3. Working tree must be clean (`git status --porcelain` empty). Otherwise stop.
4. `git revert --no-edit <hashes newest first>`. A conflict: `git revert --abort`, report, stop.
5. `gg:gg-manager`: set the affected plans' status back (phase `active`, remove `done`), clear stale check-outs, `next_step = /gg:execute <phase>` or `/gg:plan <phase>`. Index lines for files that no longer exist are removed by the manager.
6. Report: reverted commits, phase state.
Last line, always, also after a blocker: `State saved. /clear is safe. Next: the `next_step` set in step 5`.
