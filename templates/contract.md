# contract
name: <subsystem name>
subsystem: <index subsystem key>
purpose: <one sentence>
interface:
  - <func_name(args) -> return>
  - <signal signal_name(args)>
guarantees:
  - <invariant that always holds>
error_behavior:
  - <input or state> -> <return, signal, or nothing>
dependencies: [<subsystems used>]
not_included:
  - <explicitly not this subsystem's job>
