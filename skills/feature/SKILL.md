---
name: feature
description: Propose a feature outside the roadmap. The producer judges it against the vision; you decide; acceptance writes a decision and a roadmap entry.
argument-hint: "<wish>"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

1. Spawn `gg:gg-producer` with "feature verdict: $ARGUMENTS". Show the verdict unchanged.
2. Ask the human: accept now | accept later | reject | adjust (then describe).
3. accept now / later: one `gg:gg-manager` call: "record decisions <scope>: <feature, one line, English>" (scope `P` for a new milestone, `M<n>` for a phase added to milestone M<n>); add a milestone (or a phase to the named milestone) with `depends_on`, `status: planned`, `discussion: none`, placed after the current milestone for "later"; commit state. Recommend `/gg:discuss <new id>`.
4. reject: `gg:gg-manager` "note idea <wish> — rejected: <producer reason>" so it is not lost.
5. The producer's verdict is never edited. Your decision is recorded, not argued.
Last line, always, also after a blocker: `State saved. /clear is safe. Next: `/gg:discuss <new id>` or `/gg:next``.
