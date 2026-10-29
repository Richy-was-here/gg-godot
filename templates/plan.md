# plan
phase: <phase id>
plan: <phase id>-<NN>
wave: <1..n>
depends_on: [<plan ids>]
files:
  new: [<paths>]
  modified: [<paths>]
decisions: [<D-NN>]
contracts: [<subsystem names created or changed>]
objective: <one sentence>
tasks:
  - name: <imperative, short>
    files: [<paths>]
    action: <directive, no code blocks, no rationale>
    verify: <command or check an agent can run>
    done: <measurable end state>
human_checks:
  - <criterion only the human can judge, at most 80 characters>
