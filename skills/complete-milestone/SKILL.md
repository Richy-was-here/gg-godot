---
name: complete-milestone
description: Close a milestone: all phases done and no open human checks, producer vision check, [AI] placeholder and ai-made listing, git tag, marketing question.
argument-hint: "<milestone id>"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root" to every agent you spawn; agents find templates, rules and bin/ there.

Milestone: $ARGUMENTS.

1. Preconditions from `.gamedev/roadmap.md` and `.gamedev/status.md`: every phase `done`; no `open_human_checks` for its phases; `done_when.agent` of the milestone met (run or inspect each); `done_when.human` confirmed by the human now (AskUserQuestion, one at a time). Any miss: stop with the list and the command that fixes it (`/gg:review`, `/gg:next`).
2. `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check all .` must PASS on the whole project.
3. Spawn `gg:gg-producer` with "milestone check <id>". Show its answer. `drift`: ask the human whether to accept, add a phase, or stop.
4. `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check aimarks .`: list `[AI]` placeholders and ai-made entries without `replaced_by`. Information only; the human decides when to replace.
5. `gg:gg-manager`: "set milestone <id> done". Tag: `git tag -a <id> -m "<milestone name>"`.
6. Ask once: "Anything from this milestone for marketing or a devlog?" A non-empty answer → `gg:gg-manager` "note marketing <text>".
7. Report: tag, producer verdict, open `[AI]` count, next command (`/gg:discuss <next milestone>` or `/gg:next`).
