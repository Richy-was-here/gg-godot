---
name: review
description: Your verdict on collected human checks (look, sound, feel). Each item: ok or a described failure; failures become a fix plan. Milestones cannot complete while items are open.
argument-hint: "[phase id]"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root" to every agent you spawn; agents find templates, rules and bin/ there.

1. Read `open_human_checks` from `.gamedev/status.md`, filtered by $ARGUMENTS if given. Empty: say so, stop.
2. Tell the human how to see each item (scene to run, command, where to look) in one line per item.
3. Ask one item at a time with AskUserQuestion: options `ok`, `fail`, `later`. On `fail`, ask for the failure in one line.
4. After the last item:
   - `ok` items: `gg:gg-manager` removes them from `open_human_checks`.
   - `fail` items: spawn `gg:gg-planner` with "write fix plan <phase>-fix-<n> from these human findings: <list>"; manager removes the items and sets `next_step = /gg:execute <fix plan>`.
   - `later` items stay.
5. Report: ok / fail / later counts, fix plan id if any, next command.
