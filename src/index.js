import { agents } from "./agents.js";

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

const mergePermission = (base, extra) => {
  if (!isObj(extra)) return base;
  const out = isObj(base) ? { ...base } : {};
  for (const [k, v] of Object.entries(extra)) {
    if (isObj(v) && isObj(out[k])) out[k] = { ...out[k], ...v };
    else out[k] = v;
  }
  return out;
};

const pickAgentOverride = (options, name) => {
  const out = {};
  const perms = isObj(options.permissions) ? options.permissions[name] : undefined;
  const rules = isObj(options.permissionRules) ? options.permissionRules[name] : undefined;
  const perAgent = isObj(options.agentConfig) ? options.agentConfig[name] : undefined;
  if (isObj(perms)) out.permission = perms;
  if (Array.isArray(rules)) out.permissions = rules;
  if (isObj(perAgent)) {
    if (isObj(perAgent.permission)) out.permission = perAgent.permission;
    if (Array.isArray(perAgent.permissions)) out.permissions = perAgent.permissions;
    for (const [k, v] of Object.entries(perAgent)) {
      if (k !== "permission" && k !== "permissions") out[k] = v;
    }
  }
  return out;
};

/**
 * OpenCode plugin that registers the Autopilot agent suite
 * (autopilot + planner + backend + frontend + review).
 *
 * Compatible with the hooks-based plugin API (config hook).
 * For full-fidelity permissions, you can also copy ./agents/*.md to
 * ~/.config/opencode/agents/ (see README).
 *
 * Options:
 * - override: boolean
 * - agents: string[] (filter)
 * - permissions: { [agent]: PermissionObject } (v1 permission map)
 * - permissionRules: { [agent]: Rule[] } (extended permissions/action rules)
 * - agentConfig: { [agent]: Partial<AgentConfig> } (per-agent overrides)
 */
export const AutopilotPlugin = async (_input, options = {}) => {
  const override = options.override === true;
  const applyPermissions = options.applyPermissions === true;
  const only = Array.isArray(options.agents) ? new Set(options.agents) : null;

  return {
    async config(cfg) {
      cfg.agent = cfg.agent || {};
      for (const [name, baseDef] of Object.entries(agents)) {
        if (only && !only.has(name)) continue;
        const extra = pickAgentOverride(options, name);
        const hasPermExtra = !!(extra.permission || extra.permissions || (isObj(options.agentConfig) && options.agentConfig[name]));

        if (!override && cfg.agent[name]) {
          if (applyPermissions && hasPermExtra) {
            const cur = cfg.agent[name];
            if (isObj(extra.permission)) cur.permission = mergePermission(cur.permission, extra.permission);
            if (Array.isArray(extra.permissions)) cur.permissions = extra.permissions;
            if (isObj(options.agentConfig) && isObj(options.agentConfig[name])) {
              for (const [k, v] of Object.entries(options.agentConfig[name])) {
                if (k !== "permission" && k !== "permissions") cur[k] = v;
              }
            }
          }
          continue;
        }

        const next = { ...baseDef, ...extra };
        if (baseDef.permission || extra.permission) {
          next.permission = mergePermission(baseDef.permission, extra.permission);
        }
        if (Array.isArray(extra.permissions)) next.permissions = extra.permissions;
        else if (Array.isArray(baseDef.permissions)) next.permissions = baseDef.permissions;

        cfg.agent[name] = next;
      }
    },
  };
};

export default AutopilotPlugin;
