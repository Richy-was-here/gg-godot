# shell rules
# Read by gg-developer and gg-manager; printed into every session. Enforced by the gg-guard hook.
- No interpreter or runtime outside Godot in any Bash call, inline or from a file: no python, py, node, npm, perl, ruby, powershell. Exception: a program listed under `allowed_external` in config.md, which only the human adds, together with a decision. The plugin's own bin/ helpers are not affected.
- Create and change files with the Write and Edit tools only: no redirection into files, no heredocs, no `tee`, no `sed -i`. Read files with Read, Grep and Glob.
- No command that waits for input or runs without end. Godot runs are headless and end by themselves (`--quit`, `--quit-after <n>`, or a script that calls `quit()`).
- A command that fails twice with the same output is not run a third time: stop and report.
- A call blocked by gg-guard is not retried in another form; stop and report.
