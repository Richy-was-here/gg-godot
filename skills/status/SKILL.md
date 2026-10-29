---
name: status
description: Show the project state: status.md, open check-outs, phases that may run in parallel.
allowed-tools: Read, Bash, Agent
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

1. Print `.gamedev/status.md`.
2. Run `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check index .` and print only the `checked out:` lines and the index mismatches.
3. Spawn `gg:gg-manager` with "parallel" and print its answer.
4. Compare `godot_version` in `.gamedev/conventions.md` with `config/features` in `project.godot`. On mismatch print: "conventions are for <a>, project is <b>: run /gg:new-project --conventions".
5. One line: the recommended next command.
No prose beyond that.
