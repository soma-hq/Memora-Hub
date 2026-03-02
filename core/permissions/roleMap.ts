import type { RoleId } from "@/core/config/roles";
import { ROLE_HIERARCHY, ROLE_BY_ID } from "@/core/config/roles";

/** User entity membership with role and entity access */
export interface UserWithAccess {
	id: string;
	name: string;
	email: string;
	roleId: RoleId;
	entityAccess: string[];
}

/**
 * Get the user's role definition object.
 * @param user - User with role data
 * @returns The role definition or undefined if invalid
 */
export function getUserRole(user: UserWithAccess) {
	return ROLE_BY_ID[user.roleId];
}

/**
 * Get all entities the user can access.
 * Returns ["*"] for users with wildcard access (e.g., Marsha Teams, Owner).
 * @param user - User with entity access data
 * @returns Array of accessible entity IDs
 */
export function getAccessibleEntities(user: UserWithAccess): string[] {
	return [...user.entityAccess];
}

/**
 * Check if user has wildcard access (all entities).
 * @param user - User with entity access data
 * @returns True if user has ["*"] access
 */
export function hasWildcardAccess(user: UserWithAccess): boolean {
	return user.entityAccess.includes("*");
}

/**
 * Check if user has at least the given role level.
 * @param user - User with role data
 * @param minRoleId - Minimum required role ID
 * @returns True if user's role level >= min role level
 */
export function hasMinimumRole(user: UserWithAccess, minRoleId: RoleId): boolean {
	return ROLE_HIERARCHY[user.roleId] >= ROLE_HIERARCHY[minRoleId];
}

/**
 * Compare two users by role level.
 * @param userA - First user
 * @param userB - Second user
 * @returns Positive if A > B, negative if A < B, 0 if equal
 */
export function compareRoles(userA: UserWithAccess, userB: UserWithAccess): number {
	return ROLE_HIERARCHY[userA.roleId] - ROLE_HIERARCHY[userB.roleId];
}

/**
 * Check if a user is a member of a specific group (has entity access).
 * Users with wildcard access ["*"] are members of all groups.
 * @param user - User with entity access data
 * @param groupId - Target group/entity ID
 * @returns True if the user can access the group
 */
export function isMemberOfGroup(user: UserWithAccess, groupId: string): boolean {
	if (user.entityAccess.includes("*")) return true;
	return user.entityAccess.includes(groupId);
}
