---
name: new-project
description: Onboard a Godot project into gg. Consolidates any input into a vision, runs the vision interview, creates roadmap, decisions, index, status, conventions and config under .gamedev/. Works for new and existing projects.
argument-hint: "[text, file paths, or nothing] [--conventions]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Agent, AskUserQuestion, WebFetch
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root", together with the session id (see `/gg:resume`), to every agent you spawn; agents find templates, rules and bin/ there.

Templates: `${CLAUDE_PLUGIN_ROOT}/templates/`. Field names are used unchanged. No examples, no prose except `vision.notes`.

1. Preconditions
   - `--conventions` given: skip to step 7.
   - `.gamedev/status.md` exists: stop, "already onboarded; use /gg:status".
   - `project.godot` missing: ask whether to create a minimal one (name, Godot version, main scene later) or stop.
   - Read the Godot version from `project.godot` (`config/features`).
   - `run/main_scene` missing: ask which scene is the main scene, or create an empty `scenes/main.tscn` (root Node2D or Node3D as the vision says) and set it. The load gate needs it.
   - `git rev-parse` fails: ask to run `git init`; gg needs commits.

2. Input
   - Collect: $ARGUMENTS, attached files, `README*`, `docs/`, and for existing GSD or buildomator projects `.planning/` and `.gsd/` (read once during onboarding; no command reads them later).
   - Nothing found: ask the human for input in any form (chat, user stories, references, "a game like X" meaning which aspect).
   - Videos cannot be read: record them in `references` with the human's one-line description.

3. Vision draft
   - Fill `vision.md` from the input. Every statement of the input is covered by a field or deliberately dropped with the human's consent.
   - Contradictions and ambiguities: ask one at a time with AskUserQuestion, with your recommendation. Do not resolve them silently.
   - "A game like X": record the aspect meant, not X alone.
   - Write the draft to `.gamedev/vision.md`.

4. Vision interview
   - Run the `/gg:discuss project` procedure on the draft. Decisions land in `.gamedev/decisions.md` (D-01 …, scope `project`). Update the vision fields the interview changed. The interview ends with the milestones, their order and `depends_on`.
   - Offer once (AskUserQuestion): "Look up similar games?" On yes, spawn `gg:gg-researcher` with the vision's genre, core_loop and references: "List 3 to 5 released games closest to this vision: name, year, platform, one sentence on what it shares with the vision, link." Print the answer in chat. Write nothing; the human adds anything worth keeping with `/gg:note idea`.

5. Roadmap
   - Write `roadmap.md`: `goal` from the vision; milestones with `done_when` split into agent / human. Phases are added by `/gg:discuss <milestone>`; add them now only if the interview produced them.
   - Existing project: set `status: done` on milestones and phases the old planning documents or the code prove finished. Present this derived state to the human for confirmation before writing it.

6. Index
   - List every `*.gd`, `*.tscn`, `*.tres`, `*.gdshader` outside `.godot/`, `addons/`, `.gamedev/`. Assign `subsystem` from directory names; ask only when the structure gives no answer. Documents under `.gamedev/` are indexed as `doc`. One line per file. Above 150 lines, split per subsystem as `index/<subsystem>.md` and keep one line per index file in `index.md`.

7. Conventions
   - Spawn `gg:gg-researcher`: "Return the conventions list for Godot <version>: GDScript style guide, project organization, scene organization, signals vs references, resources and data, autoloads from the official documentation; plus `pitfalls`: known traps of this version (at most 20, one line each) from the official docs and the Godot GitHub issues. One rule per line, grouped by the sections of this template: <conventions template>. Cite at most 5 source URLs: the doc pages most rules come from, plus the Godot GitHub issues link when pitfalls cite issue numbers. Give the exact doc version."
   - Write `conventions.md` from the answer. `project_specific` stays empty unless the human adds rules now.
   - `--conventions`: run only this step, keeping `project_specific`; used after a Godot version change.

8. Config and status
   - `config.md`: `godot_bin` (`which godot` or ask), `godot_version`, `test_dir: tests/qa`, `shared_files` (project.godot, autoload scripts found in `[autoload]`, input map files).
   - `status.md` and `human-checks.md` from the templates, `active` empty.
   - Create `.gamedev/.gdignore` (empty) and `tests/qa/.gdignore` (empty). Add `.gamedev/.lock/` to `.gitignore`.
   - Offer once (AskUserQuestion): add permission rules to `.claude/settings.local.json` so agents run without prompts: `Bash(git *)`, `Bash(<godot_bin> *)`, `Bash(gg-check *)`, `Bash(gg-lock *)`, `Bash(*/bin/gg-check *)`, `Bash(*/bin/gg-lock *)`, `Bash(rm tests/qa/*)`. Without them every agent Bash call asks; `/gg:autonomous` cannot run unattended.
   - Commit: `git add .gamedev .gitignore tests/qa/.gdignore` then `git commit -m "gg: onboarding"`.

9. Existing project only
   - Ask whether `.planning/` and `.gsd/` may be deleted now that their content is in `.gamedev/`. Delete only on yes.

10. Report in four lines: files created, milestones, index size, Godot version.
Last line, always, also after a blocker: `State saved. /clear is safe. Next: `/gg:discuss <first milestone>``.
