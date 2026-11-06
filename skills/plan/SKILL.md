---
name: plan
description: Plan one phase: claim it, spawn the planner, show plans, contracts, waves and uncovered decisions, then stop for review.
argument-hint: "<phase id> [--auto]"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

Phase: first token of $ARGUMENTS. Session id: see `/gg:resume`.

1. In `.gamedev/roadmap.md`: the phase exists, its `depends_on` are `done`, its `status` is `planned` or `active` for this session. Otherwise stop with the reason.
2. Spawn `gg:gg-manager`: "claim phase <id> for session <sid>".
3. Spawn `gg:gg-planner` with: project root, phase id, plugin root. The planner reads what it needs itself.
4. The planner reports open questions or uncovered decisions: ask the human one question at a time (AskUserQuestion), then `gg:gg-manager` "record decisions <phase id>: <the answers as decision lines, English>", then spawn the planner again with "update plans for <phase> with decisions <ids>".
5. The planner reports "ui-spec needed": run the `/gg:discuss <phase>` closing step for the UI, then return to 3.
6. `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check docs . <plan and contract files of this phase>`. FAIL: spawn the planner once with "fix docs: <findings>", run the check again; a second FAIL is a blocker.
7. `gg:gg-manager`: "commit state <phase>" (plans and contracts).
8. Show: plan ids with wave and file count, contracts written or changed, `human_checks` collected. Point to `.gamedev/plans/<phase>/`.
9. Stop. Last line, always, also after a blocker: `State saved. /clear is safe. Next: `/gg:execute <phase>` or `/gg:next``. With `--auto` (used by `/gg:autonomous`) continue directly into `/gg:execute <phase>` instead.
