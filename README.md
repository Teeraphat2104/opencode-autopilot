# opencode-autopilot

Separately installable **OpenCode Autopilot** agent suite:

- `autopilot` (primary, F.R.I.D.A.Y) — orchestrates plan → implement → review
- `planner` (subagent, read-only) — codebase exploration and execution plan
- `backend` (subagent) — API/data/logic implementation
- `frontend` (subagent) — UI/state/style implementation
- `review` (subagent, read-only) — diff review for correctness/scope/regressions

This package is designed to be installed **separately** from your projects, so you can reuse the same autopilot workflow anywhere.

## Install

### Option A — OpenCode plugin (separate install)

Add the package to your OpenCode config (`~/.config/opencode/opencode.jsonc` for global, or `opencode.jsonc` in a project):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    "github:Teeraphat2104/opencode-autopilot"
    // or, when published/installed locally:
    // "opencode-autopilot",
    // { "package": "opencode-autopilot", "options": { "override": false } }
  ]
}
```

Plugin options:
- `override` (boolean, default `false`): replace existing agent definitions with the same names.
- `agents` (string[], optional): only register selected agents, e.g. `["autopilot","planner","backend","frontend","review"]`.

> Note: the plugin injects agents via the OpenCode `config` hook. For the most faithful reproduction of the original agent-file permissions/behavior, use Option B.

### Option B — Manual agent files (full fidelity)

Copy the bundled agent definitions into your OpenCode agents directory:

```powershell
# Windows (PowerShell)
Copy-Item .\agents\*.md $env:USERPROFILE\.config\opencode\agents\ -Force
```

```bash
# macOS/Linux
cp ./agents/*.md ~/.config/opencode/agents/
```

Source files: [`agents/`](./agents/)

## Usage

1. Select the **`autopilot`** (F.R.I.D.A.Y) agent as your primary agent in OpenCode.
2. Give it a goal (feature, fix, refactor). It will:
   - plan (via `planner`),
   - dispatch implementation (via `backend`/`frontend`),
   - review (via `review`),
   - run verification and report evidence.

The orchestrator is designed to never write code directly; it coordinates subagents and verifies results.

## Package contents

- `src/index.js` — OpenCode plugin entry (config hook)
- `src/agents.js` — agent definitions used by the plugin
- `agents/*.md` — canonical agent markdown files (manual install/reference)

## License

UNLICENSED (set a license before publishing if needed).
