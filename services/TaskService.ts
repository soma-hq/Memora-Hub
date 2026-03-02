import { prisma } from "@/lib/prisma";
import { LogService } from "@/services/LogService";
import { LogAction, TaskStatus, TaskPriority } from "@/constants";
import type { CreateTaskFormData } from "@/lib/validators/schemas";

/** Service responsible for task and subtask CRUD operations */
export class TaskService {
	/**
	 * Get task by ID
	 * @param id Task ID
	 * @returns Task with relations, or null
	 */

	static async getById(id: string) {
		// Query task with all related entities
		return prisma.task.findUnique({
			where: { id },
			include: {
				assignee: { select: { id: true, firstName: true, lastName: true, avatar: true } },
				createdBy: { select: { id: true, firstName: true, lastName: true } },
				project: { select: { id: true, name: true, groupId: true } },
				subtasks: true,
			},
		});
	}

	/**
	 * Get tasks by project
	 * @param projectId Project ID
	 * @param page Page number
	 * @param pageSize Tasks per page
	 * @returns Paginated tasks and count
	 */

	static async getByProject(projectId: string, page = 1, pageSize = 20) {
		// Calculate offset for pagination
		const skip = (page - 1) * pageSize;

		// Execute task query and count in parallel
		const [tasks, total] = await Promise.all([
			prisma.task.findMany({
				where: { projectId },
				skip,
				take: pageSize,
				include: {
					assignee: { select: { id: true, firstName: true, lastName: true, avatar: true } },
					subtasks: true,
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.task.count({ where: { projectId } }),
		]);

		return { tasks, total, page, pageSize };
	}

	/**
	 * Get tasks by assignee
	 * @param assigneeId Assignee user ID
	 * @param status Optional status filter
	 * @returns Tasks with project info
	 */

	static async getByAssignee(assigneeId: string, status?: string) {
		// Query tasks filtered by assignee and optional status
		return prisma.task.findMany({
			where: {
				assigneeId,
				...(status && { status: status as never }),
			},
			include: {
				project: { select: { id: true, name: true, groupId: true } },
				subtasks: true,
			},
			orderBy: { updatedAt: "desc" },
		});
	}

	/**
	 * Create a new task
	 * @param createdById Creator user ID
	 * @param input Task creation data
	 * @returns Created task object
	 */

	static async create(createdById: string, input: CreateTaskFormData) {
		// Insert the task record with defaults
		const task = await prisma.task.create({
			data: {
				title: input.title,
				description: input.description,
				projectId: input.projectId,
				assigneeId: input.assigneeId || null,
				createdById,
				status: (input.status as never) || TaskStatus.Todo,
				priority: (input.priority as never) || TaskPriority.Medium,
				dueDate: input.dueDate ? new Date(input.dueDate) : null,
			},
		});

		// Log the task creation
		await LogService.log(LogAction.Create, "task", task.id, createdById);

		return task;
	}

	/**
	 * Update a task
	 * @param id Task ID
	 * @param input Partial update data
	 * @param performedBy Actor user ID
	 * @returns Updated task object
	 */

	static async update(id: string, input: Partial<CreateTaskFormData>, performedBy?: string) {
		// Apply partial update with conditional field mapping
		const task = await prisma.task.update({
			where: { id },
			data: {
				...(input.title !== undefined && { title: input.title }),
				...(input.description !== undefined && { description: input.description }),
				...(input.assigneeId !== undefined && { assigneeId: input.assigneeId || null }),
				...(input.status !== undefined && { status: input.status as never }),
				...(input.priority !== undefined && { priority: input.priority as never }),
				...(input.dueDate !== undefined && { dueDate: input.dueDate ? new Date(input.dueDate) : null }),
			},
		});

		// Log the task update
		await LogService.log(LogAction.Update, "task", id, performedBy);

		return task;
	}

	/**
	 * Delete à task
	 * @param id Task ID
	 * @param performedBy Actor user ID
	 */

	static async delete(id: string, performedBy?: string) {
		// Remove the task record
		await prisma.task.delete({ where: { id } });

		// Log the task deletion
		await LogService.log(LogAction.Delete, "task", id, performedBy);
	}

	/**
	 * Update task status
	 * @param id Task ID
	 * @param status New status value
	 * @param performedBy Actor user ID
	 * @returns Updated task object
	 */

	static async updateStatus(id: string, status: string, performedBy?: string) {
		// Update the task status
		const task = await prisma.task.update({
			where: { id },
			data: { status: status as never },
		});

		// Log the status change with details
		await LogService.log(LogAction.Update, "task", id, performedBy, `status:${status}`);

		return task;
	}

	/**
	 * Toggle subtask completion
	 * @param subtaskId Subtask ID
	 * @returns Subtask or null
	 */

	static async toggleSubtask(subtaskId: string) {
		// Retrieve the current subtask state
		const subtask = await prisma.subtask.findUnique({ where: { id: subtaskId } });
		if (!subtask) return null;

		// Invert the done flag and persist
		return prisma.subtask.update({
			where: { id: subtaskId },
			data: { done: !subtask.done },
		});
	}

	/**
	 * Add a subtask
	 * @param taskId Parent task ID
	 * @param title Title of the subtask
	 * @returns Created subtask object
	 */

	static async addSubtask(taskId: string, title: string) {
		// Insert the subtask record
		return prisma.subtask.create({
			data: { taskId, title },
		});
	}

	/**
	 * Delete à subtask
	 * @param subtaskId Subtask ID
	 */

	static async deleteSubtask(subtaskId: string) {
		// Remove the subtask record
		await prisma.subtask.delete({ where: { id: subtaskId } });
	}

	/**
	 * Update a subtask title
	 * @param subtaskId Subtask ID
	 * @param title New title
	 * @returns Updated subtask object
	 */

	static async updateSubtaskTitle(subtaskId: string, title: string) {
		return prisma.subtask.update({
			where: { id: subtaskId },
			data: { title },
		});
	}

	/**
	 * Get task status counts
	 * @param projectId Project ID
	 * @returns Status-to-count map
	 */

	static async getStatusCounts(projectId: string) {
		// Aggregate tasks by status
		const tasks = await prisma.task.groupBy({
			by: ["status"],
			where: { projectId },
			_count: true,
		});

		// Transform grouped results into a status-to-count map
		return tasks.reduce(
			(acc, t) => {
				acc[t.status] = t._count;
				return acc;
			},
			{} as Record<string, number>,
		);
	}

	/**
	 * Get tasks by group (through projects)
	 * @param groupId Group ID
	 * @param page Page number
	 * @param pageSize Tasks per page
	 * @returns Paginated tasks and count
	 */

	static async getByGroup(groupId: string, page = 1, pageSize = 20) {
		const skip = (page - 1) * pageSize;

		const [tasks, total] = await Promise.all([
			prisma.task.findMany({
				where: { project: { groupId } },
				skip,
				take: pageSize,
				include: {
					assignee: { select: { id: true, firstName: true, lastName: true, avatar: true } },
					project: { select: { id: true, name: true, groupId: true } },
					subtasks: true,
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.task.count({ where: { project: { groupId } } }),
		]);

		return { tasks, total, page, pageSize };
	}

	/**
	 * Get overdue tasks (past due date, not done/archived)
	 * @param groupId Optional group ID filter
	 * @returns Overdue tasks with project info
	 */

	static async getOverdue(groupId?: string) {
		return prisma.task.findMany({
			where: {
				dueDate: { lt: new Date() },
				status: { notIn: ["done", "done"] },
				...(groupId && { project: { groupId } }),
			},
			include: {
				assignee: { select: { id: true, firstName: true, lastName: true, avatar: true } },
				project: { select: { id: true, name: true, groupId: true } },
			},
			orderBy: { dueDate: "asc" },
		});
	}

	/**
	 * Bulk update task statuses
	 * @param taskIds Array of task IDs
	 * @param status New status value
	 * @param performedBy Actor user ID
	 * @returns Count of updated tasks
	 */

	static async bulkUpdateStatus(taskIds: string[], status: string, performedBy?: string) {
		const result = await prisma.task.updateMany({
			where: { id: { in: taskIds } },
			data: { status: status as never },
		});

		await LogService.log(LogAction.Update, "task", taskIds.join(","), performedBy, `bulk-status:${status}`);

		return result.count;
	}
}
