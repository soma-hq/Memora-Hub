import type { RoleId } from "@/core/config/roles";
import type { Permission, Module } from "@/core/config/capabilities";
import type { GuardUser } from "@/core/permissions/guards";
import { canPerformAction, canAccessEntity, canManageUser, isOwner, isAdmin } from "@/core/permissions/guards";

/**
 * Check if user can view the users list.
 * @param user - Authenticated user
 * @returns True if user has personnel:view permission
 */
export function canViewUsers(user: GuardUser): boolean {
	return canPerformAction(user, "personnel", "view");
}

/**
 * Check if user can create new users.
 * @param user - Authenticated user
 * @returns True if user has personnel:create permission
 */
export function canCreateUser(user: GuardUser): boolean {
	return canPerformAction(user, "personnel", "create");
}

/**
 * Check if user can edit another user.
 * Users can always edit their own profile.
 * @param user - Authenticated user
 * @param targetUserId - ID of the user to edit
 * @returns True if user can edit the target
 */
export function canEditUser(user: GuardUser, targetUserId: string): boolean {
	if (user.id === targetUserId) return true;
	return canPerformAction(user, "personnel", "edit");
}

/**
 * Check if user can delete another user.
 * Cannot delete self. Requires personnel:delete permission.
 * @param user - Authenticated user
 * @param targetUserId - ID of the user to delete
 * @returns True if user can delete the target
 */
export function canDeleteUser(user: GuardUser, targetUserId: string): boolean {
	if (user.id === targetUserId) return false;
	return canPerformAction(user, "personnel", "delete");
}

/**
 * Check if user can manage roles (assign/change roles).
 * Only admin-level users (owner, marsha_teams) can manage roles.
 * @param user - Authenticated user
 * @returns True if user can manage roles
 */
export function canManageRoles(user: GuardUser): boolean {
	return isAdmin(user);
}

/**
 * Check if user can access the owner-only admin panel.
 * @param user - Authenticated user
 * @returns True if user is Owner
 */
export function canAccessUsersPanel(user: GuardUser): boolean {
	return isOwner(user);
}

/**
 * Check if user can manage a target user (role, access, entities).
 * Actor must have strictly higher role than target.
 * @param actor - User performing the action
 * @param target - User being managed
 * @returns True if actor can manage target
 */
export function canManageTargetUser(actor: GuardUser, target: GuardUser): boolean {
	return canManageUser(actor, target);
}

/**
 * Check if user can modify entity access for another user.
 * Requires owner or marsha_teams role.
 * @param user - Authenticated user
 * @returns True if user can modify entity access
 */
export function canModifyEntityAccess(user: GuardUser): boolean {
	return isAdmin(user);
}
