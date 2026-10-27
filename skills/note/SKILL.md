---
name: note
description: Append a marketing or idea note to .gamedev/notes.md. Read only on request.
argument-hint: "marketing|idea <text>"
allowed-tools: Agent
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root" to every agent you spawn; agents find templates, rules and bin/ there.

Kind: first token of $ARGUMENTS (`marketing` or `idea`; anything else → ask which). Spawn `gg:gg-manager` with "note <kind> <rest>". Confirm in one line.
