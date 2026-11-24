---
name: complete-milestone
description: Close a milestone: all phases done and no open human checks, cleanup round on changed or oversized scripts, breaker QA, producer vision check and decision merge, [AI] placeholder and ai-made listing, git tag, marketing question.
argument-hint: "<milestone id>"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

Milestone: $ARGUMENTS.

1. Preconditions from `.gamedev/roadmap.md` and `.gamedev/human-checks.md`: every phase `done`; no line in human-checks.md for its phases; `done_when.agent` of the milestone met (run or inspect each). Any miss: stop with the list and the command that fixes it (`/gg:review`, `/gg:next`).
2. `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check all .` must PASS on the whole project.
3. Review and cleanup candidates: `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check cleanup .` lists scripts changed since their `cleaned_at`, scripts over the size limits and unused functions. Spawn `gg:gg-reviewer` in milestone mode with project root, milestone id and that candidate list. `fail` → spawn `gg:gg-planner` for a fix plan `<id>-fix-<n>`, report, stop with `/gg:execute <fix plan>`.
4. Cleanup round. The reviewer reported `trim` findings: spawn `gg:gg-planner` with "cleanup plan <id> from these findings: <trim findings>". It writes `.gamedev/plans/<id>-cleanup/<id>-cleanup-01.md`: shorter code with the same behavior, no contract change, no new files; it does not read the scripts again. Then as in `/gg:execute` for one plan: check out, `gg:gg-developer`, `gg:gg-reviewer` on the plan's commits, one fix round, check in. A file checked out by another session stays out of the round. Finally `gg:gg-manager`: "set cleaned_at <HEAD>: <every candidate the reviewer read>", also those without findings. Then `gg-check all .` again; FAIL → blocker.
5. Spawn `gg:gg-qa` in milestone mode (persona: breaker) with all contracts of the milestone, its `done_when`, the main scene, the Godot binary and the vision text. It runs after the cleanup, so it also covers the shortened code. A `fail` or a `contradicted` vision line → fix plan as in 3, stop.
6. `done_when.human` of the milestone confirmed by the human now (AskUserQuestion, one at a time). A miss: stop with the list.
7. Spawn `gg:gg-producer` with "milestone check <id>". Show its answer. `drift`: ask the human whether to accept, add a phase, or stop.
8. Decision merge: spawn `gg:gg-producer` with "decision merge <id>". Show the proposed groups in one AskUserQuestion (multi-select: which merges to apply). For each chosen group, `gg:gg-manager`: "record decisions <id>: <merged line> supersedes <ids>".
9. `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check aimarks .`: list `[AI]` placeholders and ai-made entries without `replaced_by`. Information only; the human decides when to replace.
10. `gg:gg-manager`: "set milestone <id> done; commit state <id>". Tag: `git tag -a <id> -m "<milestone name>"`.
11. Ask once: "Anything from this milestone for marketing or a devlog?" A non-empty answer → `gg:gg-manager` "note marketing <text>".
12. Report: tag, cleanup (files read, files shortened), producer verdict, decisions merged, open `[AI]` count.
Last line, always, also after a blocker: `State saved. /clear is safe. Next: `/gg:discuss <next milestone>` or `/gg:next``.
