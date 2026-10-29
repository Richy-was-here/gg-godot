---
name: review
description: Your verdict on collected human checks (look, sound, feel). Each item: ok or a described failure; failures become a fix plan. Milestones cannot complete while items are open.
argument-hint: "[phase id]"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

1. Read `.gamedev/human-checks.md`, filtered by $ARGUMENTS if given, `open` lines first, then `later`. Empty: say so, stop.
2. Tell the human how to see each item (scene to run, command, where to look) in one line per item.
3. Ask one item at a time with AskUserQuestion: options `ok`, `fail`, `later`. On `fail`, ask for the failure in one line.
4. After the last item:
   - `ok` items: `gg:gg-manager` "resolve human checks <lines>".
   - `fail` items: spawn `gg:gg-planner` with "write fix plan <phase>-fix-<n> from these human findings: <list>"; manager resolves the items and sets `next_step = /gg:execute <fix plan>`.
   - `later` items: `gg:gg-manager` "defer human checks <lines>". The criterion text is never changed or prefixed.
5. Report: ok / fail / later counts, fix plan id if any.
Last line, always, also after a blocker: `State saved. /clear is safe. Next: `/gg:execute <fix plan>` or `/gg:next``.
