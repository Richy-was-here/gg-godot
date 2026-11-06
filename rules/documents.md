# document rules
# Read by gg-manager and gg-planner; printed into every session. Checked by `gg-check docs` and the gg-guard hook.
- `.gamedev/` holds only the documents of the SPEC layout; no drafts, reports or extra notes beside them.
- Documents only from templates in `<plugin root>/templates/`. Field names unchanged. One entry per line.
- Documents are English, also when the conversation runs in another language. In-game text in the game's language.
- No examples and no progress prose in documents. What happened is in the git history; measurements are in QA reports.
- Line limits: decision 200 characters, contract line 160, status line 120, human check and open question 80.
- No code blocks in plan actions. No reasons in contract lines.
- A decision fixes a contract, a value or threshold, a behavior, a scope or an order. Measurements, incidents and process notes are not decisions and are not recorded.
- Decision ids are `<scope>-D-NN` with scope `P` (project), `M<n>` (milestone) or `M<n>-P<n>` (phase), numbered per scope from 01. Only gg-manager writes decisions.md and assigns the ids.
- A decision that replaces another names it in `supersedes`; gg-manager sets `superseded_by` on the old line in the same write. Decisions are never deleted.
