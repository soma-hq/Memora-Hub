import { CAPABILITIES } from "@/core/config/capabilities";
import { canDo, hasMinRole, isOwnerOfAny } from "@/core/permissions/guards";
import type { UserWithAccess } from "@/core/permissions/roleMap";
import { UserRoles } from "@/constants";
import type { Role } from "@/core/config/roles";

const C = CAPABILITIES;

/**
 * Check if user can view groups list
 * @param user - Authenticated user with access data
 * @param groupId - Target group ID
 * @returns True if user has groups:view capability
 */
export function canViewGroups(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.GROUPS_VIEW);
}

/**
 * Check if user can create a new group
 * @param user - Authenticated user with access data
 * @returns True if user is Owner in at least one group
 */
export function canCreateGroup(user: UserWithAccess): boolean {
	return isOwnerOfAny(user);
}

/**
 * Check if user can edit a group
 * @param user - Authenticated user with access data
 * @param groupId - Target group ID
 * @returns True if user has groups:edit capability
 */
export function canEditGroup(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.GROUPS_EDIT);
}

/**
 * Check if user can delete a group
 * @param user - Authenticated user with access data
 * @param groupId - Target group ID
 * @returns True if user has groups:delete capability
 */
export function canDeleteGroup(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.GROUPS_DELETE);
}

/**
 * Check if user can manage group members
 * @param user - Authenticated user with access data
 * @param groupId - Target group ID
 * @returns True if user is at least Admin in the group
 */
export function canManageMembers(user: UserWithAccess, groupId: string): boolean {
	return hasMinRole(user, groupId, UserRoles.Admin as Role);
}
