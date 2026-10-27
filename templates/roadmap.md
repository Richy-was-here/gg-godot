# roadmap
goal: <end state of the project, one sentence, from vision>
milestones:
  - id: M1
    name: <name>
    depends_on: []
    status: planned | active | done
    done_when:
      agent:
        - <criterion an agent can check>
      human:
        - <criterion the human checks>
    phases:
      - id: M1-P1
        name: <name>
        goal: <one sentence>
        depends_on: []
        status: planned | active | done
        session: <session id while active, else empty>
        done_when:
          agent:
            - <criterion>
          human:
            - <criterion>
