---
name: research
description: One engine question answered from the official Godot docs for the project's version, with sources, in chat. Writes nothing.
argument-hint: "<question>"
allowed-tools: Read, Agent
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

Read `godot_version` from `.gamedev/config.md`. Spawn `gg:gg-researcher` with the version and "$ARGUMENTS". Print its answer unchanged. If the answer calls for a decision in this project, say so in one line and name the target to discuss (`/gg:discuss <target>`). Research results are not written to decisions.md.
