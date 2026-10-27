# Good Games Godot Workflow (gg-godot)

gg is a Claude Code plugin for building Godot 4 games. It adds seven agent roles (manager, producer, planner, researcher, developer, reviewer, QA), a roadmap of milestones and phases, file check-out between agents, nine verification gates and an unattended mode. The human decides what is built and judges look, sound and feel; the agents plan, build, review and test.

gg descends from [GSD](https://github.com/open-gsd/get-shit-done-redux) and [buildomator](https://github.com/buildomator/buildomator). It keeps their plan → execute → verify cycle and loads about 2 % of their instruction text (48 KB against 2.5 MB).

Status: version 0.1. The verification gates and the planner are tested. The execute and verify commands are being tested on real projects now. Report problems as issues.

## What it does

- `/gg:new-project` reads any input you give it (chat, user stories, references, an existing codebase) and writes one vision document, then interviews you until the vision has no contradictions. A producer agent checks every later feature request against it.
- The roadmap holds milestones and phases. Each phase has `done_when` criteria, split into what an agent can check and what only you can judge.
- The planner writes a contract per subsystem. A QA agent tests the subsystem against that contract with a throwaway headless script. The QA agent has no access to the code or the documents.
- `/gg:verify` runs nine gates: the project loads headless, all scripts parse, no stubs, QA passed, every decision is traceable in the diff, the file index is consistent, no leftover test files, phase criteria met, no dead code or debug prints. A warning fails the gate.
- Files are checked out to a plan before an agent writes them. Plans with disjoint file sets run in parallel; shared files such as `project.godot` and autoloads never do. Two Claude Code sessions can work on one project.
- `/gg:autonomous` runs phases unattended to a goal you set. It collects everything that needs your judgement and stops only for a decision or a blocker. `/gg:review` takes your verdicts afterwards.
- Creative in-game text is written as a placeholder marked `[AI]`. AI-made graphics and sounds are listed in one file so you can replace them later.

## Compared with

| | [gg-godot](https://github.com/Richy-was-here/gg-godot) | [buildomator](https://github.com/buildomator/buildomator) | [cc-godot](https://github.com/zate/cc-godot) |
|---|---|---|---|
| Scope | Godot 4, from vision to release | any software | Godot, project setup and running the game |
| Commands | 19 | 86 | 8 |
| Instruction text | 48 KB | 2.5 MB | 124 KB |
| Project state | 5 plain files in `.gamedev/` | MCP server, memdir, markdown | one design document |
| Verification | 9 gates, blind QA per contract | conversational acceptance test, drift scan | run the game |
| Unattended runs | yes, to a goal; stops for decisions | yes | no |

Sizes are the bytes of each plugin's skills, agents, workflows, templates and references on 2026-10-27. cc-godot's size is mostly scene and UI templates and reference text; gg-godot fetches conventions and known pitfalls for the project's Godot version at onboarding instead of embedding them.

## Install

Inside a Claude Code session:

```
/plugin marketplace add Richy-was-here/gg-godot
/plugin install gg@gg-marketplace
/reload-plugins
```

Local development: `claude --plugin-dir /path/to/gg-godot`.

Requirements: Godot 4.x on PATH (or `godot_bin` in `.gamedev/config.md`), git. Godot 4 only.

## Start

```
/gg:new-project          onboard a new or existing Godot project
/gg:discuss M1           interview on the first milestone; phases and criteria go into the roadmap
/gg:next                 one step forward; stops after planning so you can read the plan
/gg:autonomous M1        the whole milestone unattended
/gg:review               your verdicts on collected human checks
/gg:help                 all 19 commands
```

All project documents live in `.gamedev/` inside your project, hidden from the Godot editor by a `.gdignore` file. Each document follows a fixed field list. An agent reads only the documents its task needs.

## Permissions

Agents run `git`, the Godot binary and the plugin helpers `gg-check` and `gg-lock` through Bash. `/gg:new-project` offers to write the allow rules into `.claude/settings.local.json`. Without them every call asks for permission and `/gg:autonomous` cannot run unattended.

## Contributing

Read `SPEC.md` before proposing a change. It lists every design decision and the reason for it.

## Support

If gg saves you time: [buymeacoffee.com/un_garrison](https://buymeacoffee.com/un_garrison)

## Credits

Workflow ideas from GSD by TÂCHES and buildomator by Jasper Nuyens. Built with Claude Code.

## License

MIT

---

*Written with assistance of Claude Fable 5.1.*
