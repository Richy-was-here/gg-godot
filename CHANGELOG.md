# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Before 1.0.0, a minor version may contain breaking changes.

## [Unreleased]

## [0.2.0] - 2026-11-06

### Added
- `bin/gg-guard` PreToolUse hook for gg projects. It blocks interpreters and runtimes outside Godot in Bash calls (python, py, node, npm, perl, ruby, powershell and scripts with their extensions), redirection into files, heredocs, `tee` and `sed -i`, and writes to files in `.gamedev/` outside the SPEC layout. Exceptions are listed under `allowed_external` in config.md.
- `bin/gg-stop` Stop hook. A `/gg:` command whose reply does not end with `State saved. /clear is safe. Next: <command>` is sent back once.
- Gate 10 `gg-check docs`: layout, decision format and supersede links, line limits, blocker form, duplicate human checks, roadmap status consistency, English documents.
- Roadmap fields `discussion` (none | paused | done) and `open_questions` for the project, each milestone and each phase.
- Field `superseded_by` in decisions.md.
- Field `allowed_external` in config.md.
- Line limits: decision 200 characters, contract line 160, status line 120, human check and open question 80.

### Changed
- Breaking: decision ids carry their scope, `P-D-NN`, `M<n>-D-NN` or `M<n>-P<n>-D-NN`, numbered per scope. decisions.md lines have five fields: id, date, decision, supersedes, superseded_by. Lines in the old `D-NN` format are reported by gate 10 and not checked.
- Breaking: `rules/plugin-rules.md` is split by reader into `rules/code.md`, `shell.md`, `documents.md` and `session.md`.
- Only gg-manager writes decisions.md. It assigns ids under the lock, which now also covers decisions.md, and runs `gg-check docs` once at the end of each request.
- discuss asks a question only if it belongs to the target's level, its answer cannot be derived from vision, decisions, conventions or code, and the facts behind the recommendation are checked. Derived answers are confirmed at the checkpoint. Questions for deeper levels go to that target's `open_questions`. A target already discussed offers to change one decision instead of starting again.
- next routes by `discussion`: project, then milestone, then phase.
- planner and discuss read decisions.md by id prefix instead of reading the whole file.
- The session start hook also prints the session, shell and document rules.
- `bin/gg-qa-guard` is replaced by `bin/gg-guard`, which keeps the gg-qa allowlist.

### Fixed
- next, resume and note did not end with the state line.
- discuss and next offered a finished discussion again.
- Parallel sessions could assign the same decision id.
- Superseded decisions were not marked, because the discuss skill did not say to mark them.

## [0.1.2] - 2026-10-29

### Changed
- conventions.md cites at most 5 source URLs.
- status.md fields have a fixed form; blockers are written as tool or gate, symptom and ids, with a decision id when a phase was closed despite a blocker.
- Human-check criteria moved from status.md to human-checks.md; status.md keeps a count per phase; a criterion has at most 80 characters.
- All state-changing commands end with `State saved. /clear is safe. Next: <command>`, also after a blocker.
- gg-manager sets a milestone active on the first phase claim and refuses status text that does not fit a field.
- gg-lock takes the session id; only the holder can release the lock.

## [0.1.1] - 2026-10-29

### Added
- QA guard as an allowlist with Windows paths; milestone QA and whole-codebase review; exploit hunting in QA; `allowed_warnings` in config.md; main-scene check in the load gate.
- Similar-games offer after onboarding; discuss scope per target.

### Changed
- Files are written only with the Write and Edit tools; header comment placement follows conventions.md.
- A missing QA run fails verify; one-off tests are confined to `tests/qa/`; a command that fails twice is not run a third time.

### Fixed
- The `.gd` extension had been renamed to `.gg` in gg-check, new-project and gg-qa, so gates passed without checking anything.

## [0.1.0] - 2026-10-27

### Added
- First release: seven agent roles, 19 commands, roadmap with milestones and phases, file check-out and check-in, nine verify gates, unattended mode.

[Unreleased]: https://github.com/Richy-was-here/gg-godot/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Richy-was-here/gg-godot/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/Richy-was-here/gg-godot/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Richy-was-here/gg-godot/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Richy-was-here/gg-godot/releases/tag/v0.1.0
