---
name: debug
description: Fix a bug from a symptom: reproduce headless, locate, fix within checked-out files, reviewer, commit. Contract-affecting fixes are handed to the planner instead.
argument-hint: "<symptom, error text, or steps>"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

Symptom: $ARGUMENTS. Session id: see `/gg:resume`.

1. Reproduce: `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check load .` and, if the symptom names a scene, run it headless with `--quit-after 5`. Keep the first error lines.
2. Locate the files from the error output and `grep` of the named identifiers (file names only; do not read bodies in the main context). Spawn `gg:gg-manager` to check out that set for plan id `DBG-<date>-<slug>`.
3. `gg:gg-developer` with: the symptom, the error output, the checked-out set, the instruction "find the cause, fix it in these files, add no test that outlives the commit, commit as `DBG-<date>-<slug>: <cause>`".
4. The developer reports a contract problem or files outside the set: check in, stop, recommend `/gg:quick` or `/gg:discuss <phase>`.
5. `gg:gg-reviewer` on the commit range; one fix round.
6. `gg:gg-manager`: check in. If the cause was a wrong guarantee in a contract, append a decision `D-NN | date | <phase of the subsystem> | <guarantee corrected> | -` and tell the human the planner must update the contract.
7. Report: cause, commit, files, follow-up if any.
Last line, always, also after a blocker: `State saved. /clear is safe. Next: `/gg:next` or the follow-up command`.
