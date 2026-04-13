import { CAPABILITIES } from "@/core/config/capabilities";
import { canDo, hasMinRole } from "@/core/permissions/guards";
import type { UserWithAccess } from "@/core/permissions/roleMap";
import { isMemberOfGroup } from "@/core/permissions/roleMap";
import { UserRoles } from "@/constants";
import type { Role } from "@/core/config/roles";

const C = CAPABILITIES;

/**
 * Check if user can view projects in a group
 */
export function canViewProjects(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.PROJECTS_VIEW);
}

/**
 * Check if user can create projects in a group
 */
export function canCreateProject(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.PROJECTS_CREATE);
}

/**
 * Check if user can edit a project
 */
export function canEditProject(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.PROJECTS_EDIT);
}

/**
 * Check if user can delete a project
 */
export function canDeleteProject(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.PROJECTS_DELETE);
}

/**
 * Check if user can manage project members
 */
export function canManageProjectMembers(user: UserWithAccess, groupId: string): boolean {
	return hasMinRole(user, groupId, UserRoles.Manager as Role);
}

/**
 * Check if user can archive a project
 */
export function canArchiveProject(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.PROJECTS_ARCHIVE);
}

/**
 * Check if user can view project statistics
 */
export function canViewProjectStats(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.PROJECTS_VIEW_STATS);
}

/**
 * Check if user can export a project
 */
export function canExportProject(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.PROJECTS_EXPORT);
}
