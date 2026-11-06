# config
godot_bin: <path or "godot">
godot_version: <x.y>
test_dir: tests/qa
allowed_warnings:
  - <substring of an accepted Godot warning line; empty by default>
allowed_external:
  - <program name outside Godot the human allowed, then its decision id; empty by default>
shared_files:
  - project.godot
  - <autoload scripts>
  - <input map files>
