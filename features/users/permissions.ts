import type { Capability } from "@/core/config/capabilities";
import { CAPABILITIES } from "@/core/config/capabilities";
import { canDo, hasMinRole, isOwnerOfAny } from "@/core/permissions/guards";
import type { UserWithAccess } from "@/core/permissions/roleMap";
import { UserRoles } from "@/constants";
import type { Role } from "@/core/config/roles";

const C = CAPABILITIES;

/**
 * Check if user can view the users list
 * @param user - Authenticated user with access data
 * @param groupId - Target group ID
 * @returns True if user has users:view capability
 */
export function canViewUsers(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.USERS_VIEW);
}

/**
 * Check if user can create a new user
 * @param user - Authenticated user with access data
 * @param groupId - Target group ID
 * @returns True if user has users:create capability
 */
export function canCreateUser(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.USERS_CREATE);
}

/**
 * Check if user can edit another user
 * @param user - Authenticated user with access data
 * @param groupId - Target group ID
 * @param targetUserId - ID of the user to edit
 * @returns True if user has users:edit or is editing self
 */
export function canEditUser(user: UserWithAccess, groupId: string, targetUserId: string): boolean {
	// Users can always edit their own profile
	if (user.id === targetUserId) return true;
	return canDo(user, groupId, C.USERS_EDIT);
}

/**
 * Check if user can delete another user
 * @param user - Authenticated user with access data
 * @param groupId - Target group ID
 * @param targetUserId - ID of the user to delete
 * @returns True if user has users:delete and is not deleting self
 */
export function canDeleteUser(user: UserWithAccess, groupId: string, targetUserId: string): boolean {
	// Cannot delete self
	if (user.id === targetUserId) return false;
	return canDo(user, groupId, C.USERS_DELETE);
}

/**
 * Check if user can manage roles (assign/change roles)
 * @param user - Authenticated user with access data
 * @param groupId - Target group ID
 * @returns True if user is at least Admin in the group
 */
export function canManageRoles(user: UserWithAccess, groupId: string): boolean {
	return hasMinRole(user, groupId, UserRoles.Admin as Role);
}

/**
 * Check if user can access the owner-only users panel
 * @param user - Authenticated user with access data
 * @returns True if user is Owner in at least one group
 */
export function canAccessUsersPanel(user: UserWithAccess): boolean {
	return isOwnerOfAny(user);
}
