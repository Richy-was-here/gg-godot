---
name: discuss
description: Grill-me interview on the project, a milestone or a phase. One question at a time with a recommendation; questions of another level or with a derivable answer are not asked; facts are looked up first. Checkpoint every eight answers. Decisions are recorded by gg-manager.
argument-hint: "<milestone id> | <phase id> | project"
allowed-tools: Read, Write, Edit, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

Target: $ARGUMENTS, one of `M<n>`, `M<n>-P<n>` or `project`; nothing else is accepted. Decision scope: `P` for the project, else the target id.

Start
1. Read `.gamedev/vision.md` and the target's entry in `.gamedev/roadmap.md` (for the project: `goal`, `discussion`, `open_questions`, the milestone list). From `.gamedev/decisions.md` read only the lines whose id starts with `P-D-`, `<milestone>-D-` or `<phase>-D-` of the target and whose `superseded_by` is `-` (grep). For a phase also read existing contracts of its subsystems.
2. The target's `discussion` is `done` and its `open_questions` is empty: print "<target> is already discussed: <n> decisions." Ask once (AskUserQuestion): change a decision (which one) | nothing, continue. A chosen decision: discuss only its branch; the result supersedes it; go to Closing. Nothing: stop with the last line, `Next` chosen by the `/gg:next` procedure. A missing `discussion` field counts as `done` when a milestone has phases or a phase has `done_when`, else as `none`.
3. `discussion: paused` or `open_questions` not empty: start with the open questions. Branches the read decisions already settle are not asked again.

Before each question. A question is asked only when all three checks pass.
- Level: it belongs to the target's level (see Scope). A question of a deeper level goes to that target's `open_questions` (to this target's own when the deeper target does not exist yet) and is not asked.
- Derivable: its answer does not follow from the vision, a read decision, conventions.md or the existing code, and more than one answer is sensible. A derivable answer is not asked; it is listed under "derived" at the next checkpoint for the human to confirm or correct in one step.
- Facts: every engine or tool fact the recommendation depends on is checked first, in the files or with `gg:gg-researcher`. A recommendation never rests on a fact still to be looked up.

Interview rules
- Walk every remaining branch of the decision tree once; resolve dependencies between decisions in order.
- One question per AskUserQuestion call, with your recommended answer and its reason in one sentence. A turn of this command never ends on a question in plain text.
- The interview runs in the human's language. Everything written to documents is English.
- Every eight answers: a compact checkpoint (decided, derived for confirmation, open branches) and the choice: continue | pause.
- Never start building.

Scope of questions
- project: the vision fields (pillars, scope_out, core loop, feel, platform, constraints) and the milestone cut and order. No system questions.
- milestone: the system as a whole: which subsystems, how they interact, phase cut and `depends_on`, each phase's `done_when` split into agent / human, what a player can do after it. No detail values.
- phase: one area in detail: `done_when` sharpened, contract guarantees and error behavior, values, UI needs (ui-spec required?), creative text placeholders, risks that need a `/gg:prototype` first.
- `done_when`: look, sound, feel and fun are always `human`. An `agent` criterion names a check an agent can run.

Pause (chosen at a checkpoint, or the human stops)
- Record what is decided as in Closing. The remaining branches become the target's `open_questions` (one line each, at most 80 characters, English) and its `discussion` is set to `paused`.

Closing
- One `gg:gg-manager` call with the session id containing, in this order: "record decisions <scope>: <one line per decision, English, at most 200 characters; a line that replaces an older decision ends with `supersedes <id>`>"; the roadmap writes (project: milestone list with `discussion: none`; milestone: phases with `goal`, `depends_on`, `done_when`, `discussion: none`; phase: its `done_when`); "set open questions" for this target and for every deeper target that received questions; "set discussion <target> done" (or `paused`); "commit state <target>".
- project: update the changed vision fields in `vision.md` yourself.
- phase: a UI need without `ui-spec.md` creates `ui-spec.md` from the template now, filled from the answers.
- Then print the decision log: one line per decision, `id | decided | why`. `why` is the human's own reason, or "recommendation accepted" when the human chose the recommendation without a reason of their own. Then the open questions and where they went.
- Last line, always, also after a pause or a blocker: `State saved. /clear is safe. Next: <command>`. After a pause the command is `/gg:discuss <target>`; otherwise the command the `/gg:next` procedure picks from the updated roadmap. The target just finished is never named again.
