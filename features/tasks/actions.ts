"use server";

import { revalidatePath } from "next/cache";
import { TaskService } from "@/services/TaskService";
import { AuthService } from "@/services/AuthService";
import { createTaskSchema } from "@/lib/validators/schemas";
import type { CreateTaskFormData } from "@/lib/validators/schemas";

/** Standard action result */
export interface ActionResult {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
}

/**
 * Creates a new task
 * @param formData - Task creation fields
 * @returns Action result with created task data
 */
export async function createTaskAction(formData: CreateTaskFormData): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const parsed = createTaskSchema.safeParse(formData);
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0]?.message ?? "Donnees invalides" };
	}

	const task = await TaskService.create(currentUser.id, parsed.data);

	revalidatePath("/tasks");

	return { success: true, data: { id: task.id } };
}

/**
 * Updates an existing task
 * @param taskId - Target task ID
 * @param formData - Partial task update fields
 * @returns Action result
 */
export async function updateTaskAction(taskId: string, formData: Partial<CreateTaskFormData>): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const targetTask = await TaskService.getById(taskId);
	if (!targetTask) {
		return { success: false, error: "Tache introuvable" };
	}

	await TaskService.update(taskId, formData, currentUser.id);

	revalidatePath("/tasks");

	return { success: true };
}

/**
 * Deletes a task
 * @param taskId - Target task ID
 * @returns Action result
 */
export async function deleteTaskAction(taskId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const targetTask = await TaskService.getById(taskId);
	if (!targetTask) {
		return { success: false, error: "Tache introuvable" };
	}

	await TaskService.delete(taskId, currentUser.id);

	revalidatePath("/tasks");

	return { success: true };
}

/**
 * Updates task status
 * @param taskId - Target task ID
 * @param status - New status value
 * @returns Action result
 */
export async function updateTaskStatusAction(taskId: string, status: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	await TaskService.updateStatus(taskId, status, currentUser.id);

	revalidatePath("/tasks");

	return { success: true };
}

/**
 * Toggles a subtask completion state
 * @param subtaskId - Target subtask ID
 * @returns Action result
 */
export async function toggleSubtaskAction(subtaskId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const result = await TaskService.toggleSubtask(subtaskId);
	if (!result) {
		return { success: false, error: "Sous-tache introuvable" };
	}

	return { success: true };
}

/**
 * Adds a subtask to a task
 * @param taskId - Parent task ID
 * @param title - Subtask title
 * @returns Action result
 */
export async function addSubtaskAction(taskId: string, title: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const subtask = await TaskService.addSubtask(taskId, title);

	return { success: true, data: { id: subtask.id } };
}

/**
 * Deletes a subtask
 * @param subtaskId - Target subtask ID
 * @returns Action result
 */
export async function deleteSubtaskAction(subtaskId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	await TaskService.deleteSubtask(subtaskId);

	return { success: true };
}

/**
 * Get a single task by ID
 */
export async function getTaskAction(taskId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const task = await TaskService.getById(taskId);
	if (!task) {
		return { success: false, error: "Tache introuvable" };
	}

	return { success: true, data: task as unknown as Record<string, unknown> };
}

/**
 * Get tasks by project paginated
 */
export async function getTasksByProjectAction(projectId: string, page = 1, pageSize = 20): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const result = await TaskService.getByProject(projectId, page, pageSize);

	return { success: true, data: result as unknown as Record<string, unknown> };
}

/**
 * Assigns a task to a user
 * @param taskId - Target task ID
 * @param assigneeId - User to assign
 * @returns Action result
 */
export async function assignTaskAction(taskId: string, assigneeId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	await TaskService.update(taskId, { assigneeId }, currentUser.id);
	revalidatePath("/tasks");
	return { success: true };
}

/**
 * Updates task priority
 * @param taskId - Target task ID
 * @param priority - New priority value
 * @returns Action result
 */
export async function updateTaskPriorityAction(taskId: string, priority: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	await TaskService.update(taskId, { priority: priority as never }, currentUser.id);
	revalidatePath("/tasks");
	return { success: true };
}

/**
 * Get tasks by assignee with optional status filter
 * @param assigneeId - Optional assignee user ID (defaults to current user)
 * @param status - Optional status filter
 * @returns Action result with tasks
 */
export async function getTasksByAssigneeAction(assigneeId?: string, status?: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const tasks = await TaskService.getByAssignee(assigneeId ?? currentUser.id, status);
	return { success: true, data: { tasks } as unknown as Record<string, unknown> };
}

/**
 * Get task status counts for a project
 * @param projectId - Target project ID
 * @returns Action result with status counts
 */
export async function getTaskStatsAction(projectId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const counts = await TaskService.getStatusCounts(projectId);
	return { success: true, data: counts as unknown as Record<string, unknown> };
}

/**
 * Updates a subtask title
 * @param subtaskId - Target subtask ID
 * @param title - New title
 * @returns Action result
 */
export async function updateSubtaskTitleAction(subtaskId: string, title: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	await TaskService.updateSubtaskTitle(subtaskId, title);
	return { success: true };
}
