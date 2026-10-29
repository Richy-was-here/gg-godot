# status
active:
  - session: <session id>
    phase: <phase id>
    plan: <plan id or empty>
    task: <task name or empty>
    last_done: <plan or phase id> <status word from roadmap.md>
    next_step: </gg: command with its argument>
open_human_checks:
  - <phase id> <count of open lines in human-checks.md>
blockers:
  - <tool or gate> <symptom, at most six words>; <ids affected>; <D-NN when a phase was closed despite it>
