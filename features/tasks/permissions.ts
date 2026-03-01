import { CAPABILITIES } from "@/core/config/capabilities";
import { canDo, hasMinRole } from "@/core/permissions/guards";
import type { UserWithAccess } from "@/core/permissions/roleMap";
import { UserRoles } from "@/constants";
import type { Role } from "@/core/config/roles";

const C = CAPABILITIES;

/**
 * Check if user can view tasks
 */
export function canViewTasks(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TASKS_VIEW);
}

/**
 * Check if user can create tasks
 */
export function canCreateTask(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TASKS_CREATE);
}

/**
 * Check if user can edit a task
 */
export function canEditTask(user: UserWithAccess, groupId: string, assigneeId?: string, userId?: string): boolean {
	// Assignee can always edit their own task
	if (assigneeId && userId && assigneeId === userId) return true;
	return canDo(user, groupId, C.TASKS_EDIT);
}

/**
 * Check if user can delete a task
 */
export function canDeleteTask(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TASKS_DELETE);
}

/**
 * Check if user can assign tasks to other members
 */
export function canAssignTask(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TASKS_ASSIGN);
}

/**
 * Check if user can manage subtasks
 */
export function canManageSubtasks(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TASKS_MANAGE_SUBTASKS);
}

/**
 * Check if user can change task status
 */
export function canChangeTaskStatus(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TASKS_CHANGE_STATUS);
}

/**
 * Check if user can change task priority
 */
export function canChangeTaskPriority(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TASKS_CHANGE_PRIORITY);
}

/**
 * Check if user can view all tasks
 */
export function canViewAllTasks(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TASKS_VIEW_ALL);
}

/**
 * Check if user can export tasks
 */
export function canExportTasks(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TASKS_EXPORT);
}
