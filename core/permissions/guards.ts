import type { Role } from "@/core/config/roles";
import { ROLE_HIERARCHY } from "@/core/config/roles";
import type { Capability } from "@/core/config/capabilities";
import { UserRoles } from "@/constants";
import { roleHasCapability } from "./capabilityMap";
import { getRoleForGroup } from "./roleMap";
import type { UserWithAccess } from "./roleMap";


/**
 * Checks if a user can perform a capability in a specific group
 * @param user - User with group access data
 * @param groupId - Target group ID
 * @param capability - Capability to check
 * @returns True if the user has the required capability
 */
export function canDo(user: UserWithAccess, groupId: string, capability: Capability): boolean {
	const role = getRoleForGroup(user, groupId);
	if (!role) return false;
	return roleHasCapability(role, capability);
}

/**
 * Checks if user has at least the minimum role in a group
 * @param user - User with group access data
 * @param groupId - Target group ID
 * @param minRole - Minimum required role
 * @returns True if user meets or exceeds the minimum role
 */
export function hasMinRole(user: UserWithAccess, groupId: string, minRole: Role): boolean {
	const role = getRoleForGroup(user, groupId);
	if (!role) return false;
	return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minRole];
}

/**
 * Checks if user is owner of any group
 * @param user - User with group access data
 * @returns True if user has Owner role in at least one group
 */
export function isOwnerOfAny(user: UserWithAccess): boolean {
	return user.groupMemberships.some((m) => m.role === UserRoles.Owner);
}

/**
 * Checks if user is admin or above in the specified group
 * @param user - User with group access data
 * @param groupId - Target group ID
 * @returns True if user is Admin or higher
 */
export function isAdminOrAbove(user: UserWithAccess, groupId: string): boolean {
	return hasMinRole(user, groupId, UserRoles.Admin as Role);
}
