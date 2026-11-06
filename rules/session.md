# session rules
# Printed into every session by the gg start hook. A project decision does not override a rule in rules/; only the exceptions a rule names are allowed.
- Every gg command except help, status and research ends with the line `State saved. /clear is safe. Next: <command>`: in English, unchanged, as the last line, also after a pause or a blocker. `<command>` is exactly one `/gg:` command; where a skill lists several, the one that applies. The gg stop hook checks it.
- A gg command asks the human with AskUserQuestion. Its turn does not end on a question in plain text.
