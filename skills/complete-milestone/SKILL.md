---
name: complete-milestone
description: Close a milestone: all phases done and no open human checks, producer vision check, [AI] placeholder and ai-made listing, git tag, marketing question.
argument-hint: "<milestone id>"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

Milestone: $ARGUMENTS.

1. Preconditions from `.gamedev/roadmap.md` and `.gamedev/human-checks.md`: every phase `done`; no line in human-checks.md for its phases; `done_when.agent` of the milestone met (run or inspect each); `done_when.human` confirmed by the human now (AskUserQuestion, one at a time). Any miss: stop with the list and the command that fixes it (`/gg:review`, `/gg:next`).
2. `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check all .` must PASS on the whole project.
3. Spawn `gg:gg-qa` in milestone mode (persona: breaker) with all contracts of the milestone, its `done_when`, the main scene, the Godot binary and the vision text. A `fail` or a `contradicted` vision line → spawn `gg:gg-planner` for a fix plan `<id>-fix-<n>`, report, stop with `/gg:execute <fix plan>`.
4. Spawn `gg:gg-reviewer` in milestone mode with project root and milestone id. `fail` → fix plan as in 3, stop.
5. Spawn `gg:gg-producer` with "milestone check <id>". Show its answer. `drift`: ask the human whether to accept, add a phase, or stop.
6. `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check aimarks .`: list `[AI]` placeholders and ai-made entries without `replaced_by`. Information only; the human decides when to replace.
7. `gg:gg-manager`: "set milestone <id> done". Tag: `git tag -a <id> -m "<milestone name>"`.
8. Ask once: "Anything from this milestone for marketing or a devlog?" A non-empty answer → `gg:gg-manager` "note marketing <text>".
9. Report: tag, producer verdict, open `[AI]` count.
Last line, always, also after a blocker: `State saved. /clear is safe. Next: `/gg:discuss <next milestone>` or `/gg:next``.
