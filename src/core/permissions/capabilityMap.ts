import type { RoleId } from "@/core/config/roles";
import type { Permission, Module } from "@/core/config/capabilities";
import { ALL_PERMISSIONS, READ_WRITE_PERMISSIONS, ALL_MODULES } from "@/core/config/capabilities";

/**
 * Discord-style capability map.
 * Maps each role to its allowed permissions per module.
 * "manage" implicitly grants all other permissions on that module.
 */
export const CAPABILITY_MAP: Record<RoleId, Partial<Record<Module, Permission[]>>> = {
	// Owner: manage ALL modules (absolute control)
	owner: Object.fromEntries(ALL_MODULES.map((m) => [m, ALL_PERMISSIONS])) as Record<Module, Permission[]>,

	// Marsha Teams: manage all modules except admin
	marsha_teams: Object.fromEntries(
		ALL_MODULES.map((m) => [m, m === "admin" ? ([] as Permission[]) : ALL_PERMISSIONS]),
	) as Record<Module, Permission[]>,

	// Legacy Resp Live: view+create+edit on twitch, youtube, tasks, projects, meetings, personnel, logs + absences, groups (view), notifications
	legacy_resp_live: {
		moderation_twitch: READ_WRITE_PERMISSIONS,
		moderation_youtube: READ_WRITE_PERMISSIONS,
		tasks: READ_WRITE_PERMISSIONS,
		projects: READ_WRITE_PERMISSIONS,
		meetings: READ_WRITE_PERMISSIONS,
		personnel: READ_WRITE_PERMISSIONS,
		logs: READ_WRITE_PERMISSIONS,
		absences: READ_WRITE_PERMISSIONS,
		groups: ["view"] as Permission[],
		notifications: ["view"] as Permission[],
	},

	// Legacy Resp Discord: view+create+edit on discord, tasks, projects, meetings, personnel, logs + absences, groups (view), notifications
	legacy_resp_discord: {
		moderation_discord: READ_WRITE_PERMISSIONS,
		tasks: READ_WRITE_PERMISSIONS,
		projects: READ_WRITE_PERMISSIONS,
		meetings: READ_WRITE_PERMISSIONS,
		personnel: READ_WRITE_PERMISSIONS,
		logs: READ_WRITE_PERMISSIONS,
		absences: READ_WRITE_PERMISSIONS,
		groups: ["view"] as Permission[],
		notifications: ["view"] as Permission[],
	},

	// Legacy Resp Polyvalent: view+create+edit on polyvalent, tasks, projects, meetings, personnel, logs + absences, groups (view), notifications
	legacy_resp_polyvalent: {
		moderation_polyvalent: READ_WRITE_PERMISSIONS,
		tasks: READ_WRITE_PERMISSIONS,
		projects: READ_WRITE_PERMISSIONS,
		meetings: READ_WRITE_PERMISSIONS,
		personnel: READ_WRITE_PERMISSIONS,
		logs: READ_WRITE_PERMISSIONS,
		absences: READ_WRITE_PERMISSIONS,
		groups: ["view"] as Permission[],
		notifications: ["view"] as Permission[],
	},

	// Momentum & Talent: view+create+edit on momentum, talent, tasks + recruitment, training, notifications (view)
	momentum_talent: {
		momentum: READ_WRITE_PERMISSIONS,
		talent: READ_WRITE_PERMISSIONS,
		tasks: READ_WRITE_PERMISSIONS,
		recruitment: READ_WRITE_PERMISSIONS,
		training: READ_WRITE_PERMISSIONS,
		notifications: ["view"] as Permission[],
	},
};

/**
 * Check if a role has a specific permission on a module.
 * "manage" permission on a module implicitly includes all other permissions.
 * @param roleId - Role to check
 * @param module - Target module
 * @param permission - Permission action to verify
 * @returns True if the role has the permission
 */
export function hasPermission(roleId: RoleId, module: Module, permission: Permission): boolean {
	const rolePerms = CAPABILITY_MAP[roleId];
	if (!rolePerms) return false;

	const modulePerms = rolePerms[module];
	if (!modulePerms || modulePerms.length === 0) return false;

	// "manage" grants all permissions
	if (modulePerms.includes("manage")) return true;

	return modulePerms.includes(permission);
}

/**
 * Check if a role has any access to a module (at least "view").
 * @param roleId - Role to check
 * @param module - Target module
 * @returns True if the role can access the module
 */
export function hasModuleAccess(roleId: RoleId, module: Module): boolean {
	const rolePerms = CAPABILITY_MAP[roleId];
	if (!rolePerms) return false;

	const modulePerms = rolePerms[module];
	return !!modulePerms && modulePerms.length > 0;
}

/**
 * Get all permissions a role has on a module.
 * If "manage" is present, returns all permissions.
 * @param roleId - Role to check
 * @param module - Target module
 * @returns Array of permissions for the role on the module
 */
export function getPermissionsForModule(roleId: RoleId, module: Module): Permission[] {
	const rolePerms = CAPABILITY_MAP[roleId];
	if (!rolePerms) return [];

	const modulePerms = rolePerms[module];
	if (!modulePerms || modulePerms.length === 0) return [];

	// "manage" means all permissions
	if (modulePerms.includes("manage")) return [...ALL_PERMISSIONS];

	return [...modulePerms];
}

/**
 * Get all modules a role has access to.
 * @param roleId - Role to check
 * @returns Array of modules the role can access
 */
export function getAccessibleModules(roleId: RoleId): Module[] {
	return ALL_MODULES.filter((m) => hasModuleAccess(roleId, m));
}
