import { agents } from "./agents.js";

/**
 * OpenCode plugin that registers the Autopilot agent suite
 * (autopilot + planner + backend + frontend + review).
 *
 * Compatible with the hooks-based plugin API (config hook).
 * For full-fidelity permissions, you can also copy ./agents/*.md to
 * ~/.config/opencode/agents/ (see README).
 */
export const AutopilotPlugin = async (_input, options = {}) => {
  const override = options.override === true;
  const only = Array.isArray(options.agents) ? new Set(options.agents) : null;

  return {
    async config(cfg) {
      cfg.agent = cfg.agent || {};
      for (const [name, def] of Object.entries(agents)) {
        if (only && !only.has(name)) continue;
        if (override || !cfg.agent[name]) cfg.agent[name] = { ...def };
      }
    },
  };
};

export default AutopilotPlugin;
