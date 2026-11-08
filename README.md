# OpenCode Autopilot

A **separately installable** [OpenCode](https://opencode.ai/) agent suite that runs a disciplined delivery pipeline: **plan → implement → review → verify**.

> **F.R.I.D.A.Y** (`autopilot`) orchestrates the work. It coordinates specialized subagents and reports evidence — it does **not** write code directly.

## Agent Suite

| Agent | Mode | Role |
|---|---|---|
| `autopilot` (**F.R.I.D.A.Y**) | primary | Orchestrates the full pipeline end-to-end |
| `planner` | subagent (read-only) | Explores the codebase and returns an execution plan |
| `backend` | subagent | Implements API/data/logic changes for a scoped step |
| `frontend` | subagent | Implements UI/state/style changes for a scoped step |
| `review` | subagent (read-only) | Reviews diffs for correctness, scope, and regressions |

## Installation

Install this suite **once**, then reuse it across projects.

### Option A — Plugin (recommended for separate install)

Add it to your OpenCode config:

- **Global:** `~/.config/opencode/opencode.jsonc`
- **Project:** `opencode.jsonc`

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    "github:Teeraphat2104/opencode-autopilot"
  ]
}
```

With options:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    {
      "package": "github:Teeraphat2104/opencode-autopilot",
      "options": {
        "override": false,
        "agents": ["autopilot", "planner", "backend", "frontend", "review"]
      }
    }
  ]
}
```

| Option | Type | Default | Description |
|---|---|---|---|
| `override` | `boolean` | `false` | Replace existing agent definitions with the same names |
| `agents` | `string[]` | all | Register only the selected agents |

> **Note:** The plugin registers agents via the OpenCode `config` hook. If you need the most faithful reproduction of the original agent-file permissions (e.g., subagent resource rules), use **Option B**.

### Option B — Manual agent files (full fidelity)

Copy the bundled Markdown agent definitions into your OpenCode agents directory.

**Windows (PowerShell)**
```powershell
Copy-Item .\agents\*.md $env:USERPROFILE\.config\opencode\agents\ -Force
```

**macOS / Linux**
```bash
cp ./agents/*.md ~/.config/opencode/agents/
```

Canonical source: [`agents/`](./agents/)

## Usage

1. In OpenCode, select **`autopilot`** (F.R.I.D.A.Y) as your primary agent.
2. Describe your goal (feature, bug fix, or refactor).
3. Autopilot will:
   - produce a scoped plan via `planner`,
   - dispatch implementation via `backend` / `frontend`,
   - review the combined changes via `review`,
   - run verification commands and report evidence.

## How It Works

```text
Request
  └─ autopilot (F.R.I.D.A.Y)
       ├─ planner      → execution plan, files, verify commands
       ├─ backend      → scoped API/data/logic changes
       ├─ frontend     → scoped UI/state/style changes
       ├─ review       → findings + verdict
       └─ verify/report → command evidence, risks, next step
```

## Package Contents

| Path | Purpose |
|---|---|
| `src/index.js` | OpenCode plugin entry (config hook) |
| `src/agents.js` | Agent definitions used by the plugin |
| `agents/*.md` | Canonical agent Markdown files (manual install/reference) |
| `package.json` | Package metadata and plugin export |

## Repository

- GitHub: https://github.com/Teeraphat2104/opencode-autopilot

## License

UNLICENSED — add a license before publishing/distributing as needed.
