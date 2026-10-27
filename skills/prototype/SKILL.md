---
name: prototype
description: Try an idea as a throwaway scene before planning it: build fast outside the roadmap, you play it, decide, then it is deleted and the decision recorded.
argument-hint: "<idea to feel out>"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root" to every agent you spawn; agents find templates, rules and bin/ there.

Idea: $ARGUMENTS. Branch: `proto/<slug>` from the current commit.

1. `git switch -c proto/<slug>`.
2. Spawn `gg:gg-developer` with: "prototype under `prototypes/<slug>/` only; one scene runnable from the editor; ignore conventions except header lines; no contract; commit as `PROTO-<slug>: <what>`". No check-out: the branch isolates it.
3. Tell the human how to run it (scene path, `godot --path . res://prototypes/<slug>/<scene>.tscn`). Wait.
4. Ask: keep direction | drop | iterate (then one more developer round, back to 3).
5. Record: append `D-NN | date | project | prototype <slug>: <verdict in one line> | -` to `.gamedev/decisions.md` on `main`.
6. `git switch main` and `git branch -D proto/<slug>`. Nothing from the prototype is merged; what is kept is the decision, and the planner builds it properly in a phase.
7. Report: verdict, decision id, next command (`/gg:feature` or `/gg:discuss <phase>`).
