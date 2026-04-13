import type { RoleId } from "@/core/config/roles";
import { ROLE_HIERARCHY, isHigherRole as roleIsHigher, GENERIC_ROLE_LEVELS } from "@/core/config/roles";
import type { Role } from "@/core/config/roles";
import type { Permission, Module, Capability } from "@/core/config/capabilities";
import { hasPermission, hasModuleAccess } from "./capabilityMap";

// Minimal user shape required for permission guards
export interface GuardUser {
	id: string;
	name: string;
	email: string;
	roleId: RoleId;
	entityAccess: string[];
}

/**
 * Check if a user can access a specific entity
 * @param user - User to check
 * @param entityId - Target entity ID
 * @returns True if the user can access the entity
 */
export function canAccessEntity(user: GuardUser, entityId: string): boolean {
	if (user.entityAccess.includes("*")) return true;
	return user.entityAccess.includes(entityId);
}

/**
 * Check if a user can access a specific module based on their role
 * @param user - User to check
 * @param module - Target module
 * @returns True if the user's role grants module access
 */
export function canAccessModule(user: GuardUser, module: Module): boolean {
	return hasModuleAccess(user.roleId, module);
}

/**
 * Check if a user can perform a specific action on a module.
 * @param user - User to check
 * @param module - Target module
 * @param action - Permission action (view, create, edit, delete, manage)
 * @returns True if the user can perform the action
 */
export function canPerformAction(user: GuardUser, module: Module, action: Permission): boolean {
	return hasPermission(user.roleId, module, action);
}

/**
 * Check if roleA is strictly higher than roleB in the hierarchy.
 * @param roleA - First role ID
 * @param roleB - Second role ID
 * @returns True if roleA outranks roleB
 */
export function isHigherRole(roleA: RoleId, roleB: RoleId): boolean {
	return roleIsHigher(roleA, roleB);
}

/**
 * Check if user is owner (highest level in hierarchy).
 * @param user - User to check
 * @returns True if user has the owner role
 */
export function isOwner(user: GuardUser): boolean {
	return user.roleId === "owner";
}

/**
 * Check if user is at least Marsha Teams level (manages all entities).
 * @param user - User to check
 * @returns True if user is owner or marsha_teams
 */
export function isAdmin(user: GuardUser): boolean {
	return ROLE_HIERARCHY[user.roleId] >= ROLE_HIERARCHY["marsha_teams"];
}

/**
 * Check if a user can manage another user (must have higher role).
 * @param actor - User performing the action
 * @param target - User being managed
 * @returns True if actor can manage target
 */
export function canManageUser(actor: GuardUser, target: GuardUser): boolean {
	// Owner can manage everyone
	if (actor.roleId === "owner") return true;
	// Cannot manage self through this check
	if (actor.id === target.id) return false;
	// Must have strictly higher role
	return roleIsHigher(actor.roleId, target.roleId);
}

/**
 * Check if a user can access the admin panel.
 * Only owner role has admin access.
 * @param user - User to check
 * @returns True if user can access admin
 */
export function canAccessAdmin(user: GuardUser): boolean {
	return hasModuleAccess(user.roleId, "admin");
}

/**
 * Check full authorization: entity access + module access + action permission.
 * @param user - User to check
 * @param entityId - Target entity ID
 * @param module - Target module
 * @param action - Permission action
 * @returns True if all three checks pass
 */
export function isAuthorized(user: GuardUser, entityId: string, module: Module, action: Permission): boolean {
	return canAccessEntity(user, entityId) && canPerformAction(user, module, action);
}

/**
 * Check if a user can perform a capability
 * @param user - User to check
 * @param groupId - Target group/entity ID
 * @param capability - Capability descriptor { module, action }
 * @returns True if the user has both entity access and the required permission
 */
export function canDo(user: GuardUser, groupId: string, capability: Capability): boolean {
	return canAccessEntity(user, groupId) && canPerformAction(user, capability.module, capability.action);
}

/**
 * Check if a user has at least the required generic role level within a group
 * @param user - User to check
 * @param groupId - Target group/entity ID
 * @param role - Generic role name
 * @returns True if the user's role level
 */
export function hasMinRole(user: GuardUser, groupId: string, role: Role): boolean {
	if (!canAccessEntity(user, groupId)) return false;
	const requiredLevel = GENERIC_ROLE_LEVELS[role];
	return ROLE_HIERARCHY[user.roleId] >= requiredLevel;
}

/**
 * Check if a user is an owner of any entity
 * @param user - User to check
 * @returns True if the user holds the owner role
 */
export function isOwnerOfAny(user: GuardUser): boolean {
	return user.roleId === "owner";
}
