# document rules
# Read by gg-manager, gg-planner and gg-producer; printed into every session. Checked by `gg-check docs` and the gg-guard hook.
- `.gamedev/` holds only the documents of the SPEC layout; no drafts, reports or extra notes beside them.
- Documents only from templates in `<plugin root>/templates/`. Field names unchanged. One entry per line.
- Documents are English, also when the conversation runs in another language. In-game text in the game's language.
- No examples and no progress prose in documents. What happened is in the git history; measurements are in QA reports.
- Line limits: decision 200 characters, contract line 160, status line 120, human check and open question 80.
- No code blocks in plan actions. No reasons in contract lines.

Decisions
- A line is recorded only if an agent without it would build something different. Answers that confirm the vision, a convention or an existing decision are not recorded; derived answers the human confirmed are not recorded either.
- Not decisions: measurements, incidents, process notes, and values or guarantees that already stand in a contract.
- The level must fit the scope. `P`: vision, pillars, milestone cut and order, project-wide technical choices. `M<n>`: the subsystems, how they interact, the phase cut, what belongs to which milestone. `M<n>-P<n>`: choices inside one area that no contract or plan states yet.
- Ids are `<scope>-D-NN`, numbered per scope from 01. Only gg-manager writes decisions.md and assigns the ids.
- A decision that replaces others names them in `supersedes` (ids separated by commas); gg-manager sets `superseded_by` on each old line in the same write. Decisions are never deleted.
