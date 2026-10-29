# gg — Godot game-development workflow plugin for Claude Code

Single source of truth for the plugin. Commands, roles, templates and hooks are derived from this file. Rationale lives in the decision log at the end, nowhere else.

## 1. Principles

- Human in the loop: visuals, audio and feel are judged by the human. Agents verify only what agents can verify.
- Nothing enters the plugin that the human has not decided or explicitly accepted.
- One source of truth per fact. Reference, never copy. No progress prose. No examples in project documents.
- Documents only when needed, always from a template. A template is a field list, one line per field.
- Subagents read only what their task needs.
- Scripts carry at most two header comment lines (purpose, responsibility), placed where conventions.md puts the doc comment. Explanations belong in documents.
- Agents write files with the Write and Edit tools, never with shell redirection (heredocs break on Windows).
- Official Godot guidelines for the project's Godot version plus software-engineering practice for scalability and correctability.
- No tooling outside Godot in the game project except justified exceptions. One-off tests and tools live under `tests/qa/` and are deleted after use; a tool that stays useful is kept, indexed and recorded in decisions.md.
- A command that fails twice with the same output is not run a third time; the agent stops and reports.
- Logging uses `push_error` / `push_warning`; `print` is debug output and fails verify.
- Text written by or for the plugin uses plain declarative sentences: no metaphors, no lists of three for effect, no "not X but Y" constructions, no bold lead-ins; a claim carries a number or an example or is left out.
- Subsystems are developed as isolated as possible.
- Creative in-game text (dialogue, notes, lore) is placeholder only, marked `[AI]` inside the text. Factual text (UI labels, tooltips, system messages) is plain, unmarked. AI-made graphics and sounds are tracked in `ai-made.md`.
- Code, comments and documents are English. In-game text is in the game's language.

## 2. Project layout

```
<project>/
  .gamedev/
    vision.md          created by new-project
    roadmap.md         created by new-project
    decisions.md       created by new-project
    index.md           created by new-project; split into index/<subsystem>.md above 150 lines
    status.md          created by new-project; fixed fields, overwritten
    conventions.md     created by new-project from official Godot docs for the project's version
    ui-spec.md         created before the first phase with visible UI
    ai-made.md         created at the first AI-made asset; read on request only
    notes.md           created at the first note (marketing / idea); read on request only
    plans/<phase>/<plan>.md
    contracts/<subsystem>.md
    config.md          godot_bin, test_dir, shared_files
    .lock/             mkdir-based lock for roadmap.md and index.md writes
  tests/qa/            QA throwaway tests; empty after verify
```

`.gamedev/` is listed in `.gdignore`-style exclusion by containing an empty `.gdignore` file so the Godot editor does not scan it.

## 3. Documents

Field lists in `templates/`. Rules:

- vision — fields: name, pitch, genre, perspective, platform, core_loop, feel, pillars, scope_out, constraints, references, notes. Produced from any input (chat, interviews, grill-me, user stories, art, videos as references, comparable games as the aspect meant). Covers all input, contains no contradictions (resolved by asking), is unambiguous and non-redundant. `notes` is the only prose field and is used only for the unusual.
- roadmap — goal; milestones with id, name, depends_on, status, done_when (agent / human); phases with id, name, goal, depends_on, status, session, done_when (agent / human). Status lives here, nowhere else. Milestones are numbered for direction; `depends_on` decides what may run in parallel.
- decisions — D-NN, date, scope (project | milestone | phase id), decision, supersedes. Never deleted; superseded entries are marked.
- index — one line per file: path, kind (script | scene | resource | doc | other), subsystem, checked_out_by, checked_out_at. No descriptions.
- status — active phases (one block per session): phase, plan, task, last_done, next_step; open human checks; blockers. Overwritten at every check-in.
- plan — phase, plan, wave, depends_on, files, decisions, contracts, objective, tasks (name, files, action, verify, done), human_checks. `action` contains no code blocks. `verify` is a command or check an agent can run; otherwise it belongs in `human_checks`.
- contract — name, subsystem, purpose, interface (one line per public function and signal), guarantees, error_behavior, dependencies, not_included.
- conventions — one rule per line, derived from the official Godot documentation matching the version in `project.godot`, plus `pitfalls` (at most 20 known traps of that version from docs and GitHub issues); refreshed with `new-project --conventions` after a version change, which `status` detects. Plugin-wide rules in `rules/plugin-rules.md` are not copied here.
- ui-spec — style, palette, typography, layout rules, components, motion, sound cues. Changeable at any time.
- ai-made — path, kind (sprite | sound | music | other), created, replaced_by.
- notes — date, kind (marketing | idea), line.
- config — godot_bin, godot_version, test_dir, allowed_warnings, shared_files.

## 4. Roles

| Agent | Model | Reads | Writes | Tools |
|---|---|---|---|---|
| gg-manager | sonnet | index, roadmap, status, config | index, roadmap, status, notes, lock | Read, Write, Edit, Bash, Glob, Grep, Task |
| gg-producer | opus | vision, roadmap, decisions | nothing | Read, Grep, Glob |
| gg-planner | opus | vision, roadmap, decisions, index, contracts, conventions; files as needed | plans, contracts, decisions | Read, Write, Edit, Glob, Grep, Task |
| gg-researcher | sonnet | web, Godot docs | nothing | WebSearch, WebFetch, Read |
| gg-developer | sonnet | its plan, its contracts, its checked-out files, conventions | its checked-out files only | Read, Write, Edit, Bash, Glob, Grep, Task |
| gg-reviewer | opus | the diff, contracts, conventions | nothing | Read, Bash, Grep, Glob |
| gg-qa | sonnet | one contract | tests/qa/ only | Write, Bash (allowlist in the plugin PreToolUse hook `bin/gg-qa-guard`: writes under tests/qa/, Bash only Godot runs and ls/cat/rm/mkdir on tests/qa/ paths; acts only when `agent_type` is gg-qa) |

Rules:
- Only gg-manager writes roadmap, index and status. Only gg-planner writes contracts and plans. Only the human (via gg-manager) changes the vision.
- gg-developer commits with explicit paths from its plan, never the whole tree. Commit message starts with the plan id.
- gg-qa has no access to code or documents. Its test scene or script lives in `tests/qa/`, runs headless, and is deleted after verify. Every QA run hunts for exploits: boundary values, rapid repeats, wrong call order, empty inputs, state combinations. At milestone end QA runs the whole system against all contracts and compares observed behavior with the vision text it is handed; the reviewer then reads the whole codebase against conventions and contracts. Persona is rotated by `verify` per contract (skeptical player, speedrunner, completionist, confused newcomer); the report format is fixed: steps, expected, actual.
- gg-researcher returns its answer to the caller with sources. It writes no document. Findings that are decisions go to decisions.md via the caller; rules for all projects go to the plugin.
- gg-producer is called on every feature request outside the roadmap and at every milestone completion. It measures against `pillars` and `scope_out`. The human has the last word.

## 5. Commands (`/gg:`)

| Command | Does | Stops for human |
|---|---|---|
| new-project | Onboarding: vision from input, roadmap, decisions, index, status, conventions, config; existing code is indexed; old planning docs read once; offers a list of similar games after the interview (chat only) | contradictions in input; confirmation of the derived state; similar-games offer |
| discuss `<project|milestone|phase>` | grill-me on the target; writes decisions; scope by target: project = vision and milestone cut, milestone = the system as a whole, phase = one area in detail; deeper questions are deferred | every question |
| plan `<phase>` | gg-planner: plans, contracts, waves, decision coverage | never |
| execute `<phase|plan>` | gg-manager checks out; gg-developer builds; gg-reviewer reads the diff; check-in | reviewer failure after one retry |
| verify `<phase>` | gg-qa per contract, then the nine gates; collects human checks; failures become a fix plan | never (reports) |
| next | next logical step; stops after plan; refuses to complete a milestone with open human checks | after plan; open human checks at milestone end |
| autonomous `<goal>` | runs discuss-less plan → execute → verify to the goal; collects human checks; waves run in parallel | decision needed; blocker after one retry |
| review | human verdict on collected human checks; failures become tasks | every item |
| complete-milestone | gg-qa in milestone mode (all contracts, main scene, vision; persona breaker), gg-reviewer in milestone mode (whole codebase against conventions and contracts), gg-producer vision check; `[AI]` and ai-made listing; git tag; marketing question | open human checks; drift; marketing question |
| feature `<wish>` | gg-producer verdict; on acceptance: decision + roadmap entry | always |
| quick `<task>` | planner and developer in one; check-out/in; reviewer | never |
| debug `<symptom>` | gg-developer with error entry point; check-out/in | never |
| prototype `<idea>` | throwaway scene or branch; human plays; decision; deletion | human verdict |
| research `<question>` | gg-researcher; answer in chat | never |
| undo `<plan|phase>` | reverts the commits of a plan or phase by plan id, with dependency check | confirmation |
| note `<marketing|idea>` `<text>` | appends to notes.md | never |
| status | prints status, open check-outs, what may run in parallel | never |
| resume | re-enters from status.md after compaction or a new session | never |
| help | lists commands | never |

Parallel execution: default in autonomous; in manual mode on the instruction "faster". Only plans with disjoint file sets; files listed in `config.shared_files` are never parallel.

## 6. Mechanics

Check-out / check-in
- gg-manager checks out a plan's file set in index.md before spawning gg-developer, records who and when. Check-in after the developer returns.
- Orphaned check-outs: older than 6 hours with no matching active phase in status.md are released by gg-manager after `git status` shows no uncommitted change in those files; otherwise reported.
- Shared files (`config.shared_files`, default: project.godot, autoloads, input map) are touched only by gg-manager or strictly sequentially.

Locking
- Every write to roadmap.md and index.md is wrapped in `gg-lock acquire` / `gg-lock release` (atomic mkdir; a lock older than 10 minutes is broken). Wait up to 30 s, then report.

Two sessions
- Shared working directory. A session claims a phase by setting `status: active` and `session` in roadmap.md under the lock. Two sessions never share a phase. Index check-outs carry the session id.

Handoff
- status.md is always current at claim and check-in. A SessionStart hook (startup, resume, compact) prints status.md and the session id into context. `/gg:resume` continues from it.

Commits
- One commit per task, paths explicit, message `<phase>-<plan>: <task name>`. gg-manager commits `.gamedev/` changes as `<id>: state` after claim, after planning and at check-in; nothing else touches `.gamedev/` in git.
- `undo` selects commits by the plan id prefix.

Verify gates (all hard)
1. Project loads headless without errors or warnings; a main scene must be set; warnings listed under `allowed_warnings` in config.md are accepted
2. All scripts parse
3. No stubs in touched files: empty bodies, `pass`-only functions, TODO/FIXME
4. QA report present with no open failure; a QA run that could not execute is a FAIL, never a skip
5. Every decision assigned to the phase is traceable in the diff
6. All check-outs of the phase are checked in; index matches the file system
7. One-off tests and tools are deleted; `tests/qa/` is empty; any other file under `tests/` is listed in the index
8. Roadmap `done_when` (agent side) all met; human side listed to the human
9. No artifacts: unreferenced files, debug prints, commented-out code, temp files, unused signals and exports in touched files

Autonomous
- Input: a goal (milestone or phase id). Runs plan → execute → verify per phase. Human checks are collected, not awaited.
- Stops before the goal only for: a decision (contract change, decisions conflict, producer flags vision deviation), a blocker remaining after one retry.
- Morning report: phases done, open human checks, stop reason.

Change management
- Decisions are superseded, never deleted.
- Contracts are changed only by gg-planner. A developer that needs a contract change stops and reports.
- Scope growth goes through gg-producer to the human.

## 7. Decision log

| # | Decided | Why |
|---|---|---|
| 1 | Real Claude Code plugin, installed once | Workflow updates reach all projects |
| 2 | New and existing projects; existing read once, not converted | No GSD format carried along |
| 3 | Hidden `.gamedev/`, documents only from templates (field lists) | Tokens; human rarely edits |
| 4 | English artifacts, game text in game language | Tokens; Godot docs are English |
| 5 | Onboarding creates the minimum set; rest on demand | Create only what is needed |
| 6 | Index line: path, kind, subsystem, check-out; no description; split at 150 lines | Script header is the description |
| 7 | Status: fixed fields, overwritten, no history | History is in git |
| 8 | QA: throwaway test against contract, headless, deleted; no code/doc access | Black box, not pre-filtered |
| 9 | Seven roles; debug and quick are commands | Roles are permission differences |
| 10 | Planner, producer, reviewer on opus; others sonnet; nothing smaller | Decisions and last net large; errors propagate |
| 11 | Nine hard verify gates | Warnings are not read |
| 12 | autonomous: human sets goal; human checks collected; stop only for decision or blocker after one retry | Night runs must deliver |
| 13 | Manual mode stops after plan | Whoever watches shall see |
| 14 | Parallel in autonomous and on instruction; disjoint file sets only; shared files never | Check-out makes it checkable |
| 15 | Prefix `/gg:`, 19 commands | Fifteen core (note absorbs note-marketing) + undo, prototype, review, help |
| 16 | Change management: supersede decisions; contracts planner-only; scope growth via producer | Keeps QA testing a valid contract |
| 17 | Contract fields incl. error_behavior and not_included | Prevents QA false alarms |
| 18 | Plan after buildomator: tasks with verify/done; no code in action | Verification per task |
| 19 | Roadmap carries status; milestones numbered but depends_on-parallel | One source for plan and state |
| 20 | Vision fields fixed; `notes` prose only for the unusual; no `open` | Producer measures against pillars and scope_out |
| 21 | Conventions per project from official Godot docs for the project version, fetched at onboarding | Always the current rule set |
| 22 | `review` command; milestone cannot complete with open human checks | Human plays when they want; no unassignable pile |
| 23 | Two sessions: shared directory, phase claim in roadmap, lock on roadmap/index writes | No scene merges |
| 24 | Build in three stages against a throwaway project: core, operations, existing projects | Learn where breaking is free |

Settled during build: commit message prefix = plan id (for undo); QA runs in `verify`, not in `execute`, so one independent run per cycle instead of two; QA persona rotated by `verify`; handoff = status printed by a SessionStart hook (startup/resume/compact) instead of a PreCompact writer, because status is already current at every check-in; deterministic gates live in `bin/gg-check` (one call instead of a dozen greps per verify); plugin helpers live in `bin/`, which Claude Code puts on PATH, and agents receive the plugin root from the calling skill because `${CLAUDE_PLUGIN_ROOT}` is substituted only in skills.

## 8. Build stages

1. Core: templates, roles, new-project (new projects), discuss, plan, execute, verify, next, status, resume, help, hook, scripts.
2. Operations: autonomous, waves + lock, undo, review, complete-milestone, feature, research, note, prototype, debug, quick.
3. Existing projects: index from code, old planning docs read once.
