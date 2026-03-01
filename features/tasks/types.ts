// Constants & types
import type { TaskStatusValue, TaskPriorityValue } from "@/constants";

export type { TaskStatusValue, TaskPriorityValue };

// Re-export labels for consumer convenience
export { TaskStatusLabel, TaskPriorityLabel } from "@/constants";
// Re-export variant maps from design system
export { taskStatusVariant as statusVariantMap, taskPriorityVariant as priorityVariantMap } from "@/core/design/states";


/** Subtask within a parent task */
export interface Subtask {
	id: string;
	title: string;
	done: boolean;
}

/** Person assigned to a task */
export interface TaskAssignee {
	userId: string;
	name: string;
	avatar?: string;
}

/** Core task entity */
export interface Task {
	id: string;
	title: string;
	description?: string;
	status: TaskStatusValue;
	priority: TaskPriorityValue;
	assignee: TaskAssignee;
	dueDate?: string;
	projectId?: string;
	projectName?: string;
	subtasks?: Subtask[];
	createdAt: string;
}

/** Form data for creating or editing a task */
export interface TaskFormData {
	title: string;
	description: string;
	status: TaskStatusValue;
	priority: TaskPriorityValue;
	assignee: string;
	dueDate: string;
	projectId: string;
}
