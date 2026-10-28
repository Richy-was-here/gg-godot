---
name: discuss
description: Grill-me interview on the project, a milestone or a phase. One question at a time with a recommendation, checkpoint every eight answers, decision log at the end written to decisions.md and into roadmap or vision.
argument-hint: "project | <milestone id> | <phase id>"
allowed-tools: Read, Write, Edit, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root" to every agent you spawn; agents find templates, rules and bin/ there.

Target: $ARGUMENTS. Read `.gamedev/vision.md`, `.gamedev/decisions.md`, and the target's entry in `.gamedev/roadmap.md`. For a phase also read existing contracts of its subsystems.

Interview rules
- Walk every branch of the decision tree once; resolve dependencies between decisions in order.
- One question per message, with your recommended answer and the reason in one sentence. Wait for the answer.
- Look up facts yourself (files, docs via `gg:gg-researcher`); ask only for decisions.
- Every eight answers: a compact checkpoint (decided, open branches, position) and the choice: continue, stop with a decision log, or hand over.
- Never start building.

Scope of questions
- project: the vision fields (pillars, scope_out, core loop, feel, platform, constraints) and the milestone cut and order. No system questions.
- milestone: the system as a whole: which subsystems, how they interact, phase cut and `depends_on`, each phase's `done_when` split into agent / human, what a player can do after it. No detail values.
- phase: one area in detail: `done_when` sharpened, contract guarantees and error behavior, values, UI needs (ui-spec required?), creative text placeholders, risks that need a `/gg:prototype` first.
- A question that belongs one level deeper is written down as "open for /gg:discuss <target>" and not asked.

Closing
- Decision log: one line per decision, `decided / why`, plus open points.
- Append each decision to `.gamedev/decisions.md` as `D-NN | date | scope | decision | supersedes`. A decision that replaces an older one names it in `supersedes`; the old line is kept.
- project: update the changed vision fields; write the milestone list into `roadmap.md`.
- milestone: write the phases with `goal`, `depends_on`, `done_when` into `roadmap.md`.
- phase: update its `done_when`; a UI need without `ui-spec.md` creates `ui-spec.md` from the template now, filled from the answers.
- Roadmap writes go through `gg:gg-manager` so the lock is held.
- Last line: the next command (`/gg:plan <phase>` or `/gg:discuss <next target>`).
