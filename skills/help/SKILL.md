---
name: help
description: List gg commands and the workflow in one screen.
allowed-tools: Read
---
Print exactly this, nothing more:

gg — Godot workflow. Docs live in .gamedev/. Spec: ${CLAUDE_PLUGIN_ROOT}/SPEC.md

Start
  /gg:new-project [input]        onboard; vision from your input, roadmap, index, conventions
  /gg:discuss project|M1|M1-P1   grill-me on the target; decisions -> decisions.md
Loop
  /gg:next                       next step; stops after planning for your review
  /gg:plan M1-P1                 plans, contracts, waves for a phase
  /gg:execute M1-P1 [faster]     build plans: developer + reviewer; "faster" = parallel waves
  /gg:verify M1-P1               QA per contract + nine gates; human checks collected
  /gg:review                     your verdict on collected human checks
  /gg:complete-milestone M1      producer check, [AI] list, git tag
  /gg:autonomous M1|M1-P3        run to the goal; stops only for decisions or blockers
Side paths
  /gg:quick <task>               small task with check-out, reviewer, commit
  /gg:debug <symptom>            developer with an error entry point
  /gg:feature <wish>             producer verdict against the vision, then your call
  /gg:prototype <idea>           throwaway scene; you play; decide; delete
  /gg:research <question>        one answer from the Godot docs, with sources
  /gg:undo M1-P1 | M1-P1-02      revert a phase or plan by its commits
  /gg:note marketing|idea <text> append to notes.md
State
  /gg:status                     status, check-outs, what may run in parallel
  /gg:resume                     continue from status.md after compaction or restart
