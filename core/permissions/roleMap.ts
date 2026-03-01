import type { Role } from "@/core/config/roles";
import { ROLE_HIERARCHY } from "@/core/config/roles";


export interface GroupMembership {
	groupId: string;
	groupName: string;
	role: Role;
}

export interface UserWithAccess {
	id: string;
	name: string;
	email: string;
	globalRole?: Role;
	groupMemberships: GroupMembership[];
}

/**
 * Gets the user's role for a specific group
 * @param user - User with group access data
 * @param groupId - Target group ID
 * @returns The user's role in that group, or null if not a member
 */
export function getRoleForGroup(user: UserWithAccess, groupId: string): Role | null {
	const membership = user.groupMemberships.find((m) => m.groupId === groupId);
	return membership?.role ?? null;
}

/**
 * Gets all groups where the user has at least the given role
 * @param user - User with group access data
 * @param minRole - Minimum required role
 * @returns Memberships meeting the minimum role threshold
 */
export function getGroupsWithRole(user: UserWithAccess, minRole: Role): GroupMembership[] {
	const minLevel = ROLE_HIERARCHY[minRole];
	return user.groupMemberships.filter((m) => ROLE_HIERARCHY[m.role] >= minLevel);
}

/**
 * Checks if user is member of a specific group
 * @param user - User with group access data
 * @param groupId - Target group ID
 * @returns True if user belongs to the group
 */
export function isMemberOfGroup(user: UserWithAccess, groupId: string): boolean {
	return user.groupMemberships.some((m) => m.groupId === groupId);
}
