---
name: verify
description: Verify a phase: blind QA per contract, then the nine hard gates. Human checks are collected into status.md, failures become a fix plan. Nothing passes on a warning.
argument-hint: "<phase id>"
allowed-tools: Read, Bash, Grep, Glob, Agent
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

Phase: $ARGUMENTS. Godot binary and `test_dir` from `.gamedev/config.md`. Plans: `.gamedev/plans/<phase>/*.md`.

1. Touched files: union of `files.new` and `files.modified` over the phase's plans. Contracts: union of `contracts`.
2. QA (gate 4). For each contract, spawn `gg:gg-qa` with: the contract text (read it and pass it verbatim), project root, Godot binary, `tests/qa/`, the scene or class to instantiate (from the contract's interface or the plan's files), and a persona rotated from: skeptical player, speedrunner, completionist, confused newcomer. Keep each report. A QA run that could not execute (guard refusal, Godot error, missing contract) is a FAIL of gate 4 with that reason; it is never skipped.
3. Gates 1, 2, 3, 7, 9, 6: `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check all . <touched files>`. Gate 7 also requires `tests/qa/` to hold only `.gdignore`.
4. Gate 5 (decisions): for every `D-NN` in the plans' `decisions`, confirm a commit or diff hunk of this phase realizes it (`git log --grep` by plan id, then the diff). An unrealized decision fails the gate.
5. Gate 8 (done_when): every `agent` criterion of the phase in `roadmap.md` is checked by running the check it names or by inspecting the result; every `human` criterion is collected.
6. Result
   - All gates PASS: `gg:gg-manager`: "set phase <id> done; add human checks <phase>: <the phase's `human` criteria from roadmap.md, unchanged>; next_step = <next phase or '/gg:review'>". Report: gates, QA summary, human checks waiting (count).
   - Any FAIL: spawn `gg:gg-planner` with "write fix plan <phase>-fix-<n> from this verify report: <findings>", then report the gate table and the fix plan id. Called from `/gg:autonomous`: do that once; a second FAIL is a blocker and goes to `gg:gg-manager` as "blocker <gate> <symptom>; <phase>".
7. Delete nothing yourself; QA cleans `tests/qa/`, the fix plan deletes leftovers.

Report format: one line per gate `GATE n <name>: PASS|FAIL — <first finding>`, then QA per contract `pass|fail`, then the count of human checks added.
Last line, always, also after a blocker: `State saved. /clear is safe. Next: `/gg:review`, `/gg:next`, or `/gg:execute <fix plan id>` then `/gg:verify <phase>` again`.
