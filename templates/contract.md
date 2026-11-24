# contract
# one entry per line, at most 160 characters; reasons belong in decisions.md
name: <subsystem name>
subsystem: <index subsystem key>
purpose: <one sentence>
interface:
  - <func_name(args) -> return>
  - <signal signal_name(args)>
prepared:
  - <name>: <what will connect here later; the code carries "# API: <subsystem>.<name>" at the spot>
guarantees:
  - <invariant that always holds>
error_behavior:
  - <input or state> -> <return, signal, or nothing>
dependencies: [<subsystems used>]
not_included:
  - <explicitly not this subsystem's job>
