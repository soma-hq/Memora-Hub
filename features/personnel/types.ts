// Constants & types
import type { BadgeVariant } from "@/core/design/states";
import type { TaskStatusValue, TaskPriorityValue, AbsenceAcknowledgmentStatusValue } from "@/constants";
import { TaskStatusLabel, TaskPriorityLabel, AbsenceAcknowledgmentStatusLabel } from "@/constants";
import { taskStatusVariant, taskPriorityVariant } from "@/core/design/states";


// Re-export centralized types for convenience
export type AbsenceStatus = AbsenceAcknowledgmentStatusValue;
export type TaskStatus = TaskStatusValue;
export type TaskPriority = TaskPriorityValue;

/** Possible planning event types */
export type PlanningEventType = "meeting" | "monthly" | "personal" | "other";

/** Possible project statuses (personnel-specific) */
export type ProjectStatus = "active" | "paused" | "completed" | "cancelled";

/** Absence request entity */
export interface Absence {
	id: string;
	startDate: string;
	endDate: string;
	reason: string;
	status: AbsenceStatus;
	submittedAt: string;
	respondedAt?: string;
	respondedBy?: string;
}

/** Calendar planning event entity */
export interface PlanningEvent {
	id: string;
	title: string;
	description?: string;
	date: string;
	startTime: string;
	endTime: string;
	type: PlanningEventType;
	isPublic: boolean;
	authorId: string;
	authorName: string;
	location?: string;
}

/** Project assigned to a user */
export interface PersonalProject {
	id: string;
	name: string;
	description: string;
	progress: number;
	status: ProjectStatus;
	role: string;
	deadline?: string;
}

/** Task assigned to a user */
export interface PersonalTask {
	id: string;
	title: string;
	projectName?: string;
	priority: TaskPriority;
	status: TaskStatus;
	dueDate?: string;
	assignedBy?: string;
}

/** Badge variant mapping for absence acknowledgment statuses */
export const absenceStatusVariantMap: Record<AbsenceStatus, BadgeVariant> = {
	pending: "warning",
	received: "info",
	acknowledged: "success",
};

/** Badge variant mapping for planning event types */
export const planningEventTypeVariantMap: Record<PlanningEventType, BadgeVariant> = {
	meeting: "primary",
	monthly: "info",
	personal: "success",
	other: "neutral",
};

/** Localized labels for planning event types */
export const planningEventTypeLabels: Record<PlanningEventType, string> = {
	meeting: "Réunion",
	monthly: "Mensuelle",
	personal: "Personnel",
	other: "Autre",
};

/** Badge variant mapping for project statuses */
export const projectStatusVariantMap: Record<ProjectStatus, BadgeVariant> = {
	active: "success",
	paused: "warning",
	completed: "primary",
	cancelled: "error",
};

/** Localized labels for project statuses */
export const projectStatusLabels: Record<ProjectStatus, string> = {
	active: "Actif",
	paused: "En pause",
	completed: "Terminé",
	cancelled: "Annulé",
};

// Re-export centralized variant maps
export const taskPriorityVariantMap = taskPriorityVariant;
export const taskPriorityLabels = TaskPriorityLabel;
export const taskStatusVariantMap = taskStatusVariant;
export const taskStatusLabels = TaskStatusLabel;
export const absenceStatusLabels = AbsenceAcknowledgmentStatusLabel;

// Ordered arrays for iteration
export const ABSENCE_STATUSES: AbsenceStatus[] = ["pending", "received", "acknowledged"];
export const PLANNING_EVENT_TYPES: PlanningEventType[] = ["meeting", "monthly", "personal", "other"];
export const PROJECT_STATUSES: ProjectStatus[] = ["active", "paused", "completed", "cancelled"];
export const TASK_PRIORITIES: TaskPriority[] = ["high", "medium", "low"];
export const TASK_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

/** Calendar item types for the unified planning view */
export type UnifiedItemType = "meeting" | "deadline" | "personal" | "task" | "event";

/** Data source for a unified planning item */
export type UnifiedItemSource = "planning" | "meeting" | "project" | "task";

/** Unified calendar item combining events from multiple data sources */
export interface UnifiedPlanningItem {
	id: string;
	title: string;
	date: string;
	startTime: string;
	endTime: string;
	type: UnifiedItemType;
	source: UnifiedItemSource;
}
