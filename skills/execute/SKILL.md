---
name: execute
description: Build the plans of a phase (or one plan) wave by wave: check-out, developer, reviewer, check-in. Sequential by default; "faster" or autonomous mode runs disjoint plans of a wave in parallel.
argument-hint: "<phase id | plan id> [faster]"
allowed-tools: Read, Bash, Grep, Glob, Agent, AskUserQuestion
---
Plugin root: `${CLAUDE_PLUGIN_ROOT}`. Pass it as "plugin root" to every agent you spawn; agents find templates, rules and bin/ there.

Target: first token of $ARGUMENTS (`M1-P2` = whole phase, `M1-P2-01` = one plan). Mode: `faster` present or called by `/gg:autonomous` → parallel; else sequential. Godot binary: `godot_bin` in `.gamedev/config.md`. Session id: see `/gg:resume`.

1. Spawn `gg:gg-manager`: "waves <phase>". It returns waves and, inside each wave, groups of plans that may run in parallel.
2. Skip plans whose every task already has a commit `<plan id>: <task>` in `git log` (resumed phase).
3. For each wave in order; inside a wave, each group one after another; inside a group all plans at once if parallel, else one after another:
   a. `gg:gg-manager`: "check out <plan file> for session <sid>". A refusal (file held, shared file conflict) moves the plan to the next group; a second refusal is a blocker.
   b. Record `git rev-parse HEAD` as the plan's start commit.
   c. `gg:gg-developer` with: project root, plan path, checked-out file set, Godot binary, plugin root.
   d. The developer reports "stopped": a missing file → manager checks it out and the developer continues once; a contract problem or a tool outside Godot → stop the whole run, show the report, ask the human.
   e. `gg:gg-reviewer` with: project root, plan id, plan path, commit range `<start>..HEAD`.
   f. Reviewer `fail`: `gg:gg-developer` once more with the findings as tasks ("fix: <finding>", same files, same commit rule), then the reviewer again. Still `fail`: stop, show findings, ask the human.
   g. `gg:gg-manager`: "check in <plan id>; add human_checks of the plan to status; next_step = <next plan or '/gg:verify <phase>'>".
4. After the last wave: run `bash ${CLAUDE_PLUGIN_ROOT}/bin/gg-check load .`. A FAIL is shown as a blocker before anything else.
5. Report in at most eight lines: plans built, commits, review verdicts, blockers. Last line: `/gg:verify <phase>`.

Rules
- The main context never reads source files or plan bodies; it routes reports. Reading is the agents' job.
- Never `git add` anything yourself. Commits are the developer's.
- One retry per failure kind, then the human.
