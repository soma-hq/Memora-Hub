// Constants & types
import type { ProjectStatusValue, ProjectPriorityValue, RelationStatusValue } from "@/constants";
import { ProjectPriorityLabel, ProjectStatusLabel, RelationStatusLabel } from "@/constants";

export type { ProjectStatusValue, ProjectPriorityValue, RelationStatusValue };

// Re-export labels for consumer convenience
export { ProjectStatusLabel, ProjectPriorityLabel, RelationStatusLabel };
// Re-export variant maps from design system
export { projectStatusVariant, projectPriorityVariant } from "@/core/design/states";
export { projectPriorityVariant as priorityVariant } from "@/core/design/states";

export const priorityLabel = ProjectPriorityLabel;
export const PROJECT_PRIORITIES = Object.keys(ProjectPriorityLabel) as ProjectPriorityValue[];

/** Member assigned to a project */
export interface ProjectMember {
	userId: string;
	name: string;
	role: string;
	avatar?: string;
}

/** Task counts breakdown for a project */
export interface ProjectTasks {
	total: number;
	done: number;
	inProgress: number;
	todo: number;
}

// Project Relation Types

/** Task relation linked to a project */
export interface ProjectTask {
	id: string;
	status: RelationStatusValue;
	description: string;
	assignee: string;
	deadline: string;
	platforms: string[];
}

/** Communication relation linked to a project */
export interface ProjectCommunication {
	id: string;
	status: RelationStatusValue;
	description: string;
	assignee: string;
	postDate: string;
	platforms: string[];
}

/** Content relation linked to a project */
export interface ProjectContent {
	id: string;
	status: RelationStatusValue;
	description: string;
	assignee: string;
	deadline: string;
	platforms: string[];
}

/** Creation relation linked to a project */
export interface ProjectCreation {
	id: string;
	status: RelationStatusValue;
	description: string;
	assignee: string;
	deadline: string;
	links: string[];
}

/** Idea relation linked to a project */
export interface ProjectIdea {
	id: string;
	thoughtBy: string;
	status: RelationStatusValue;
	description: string;
}

/** All relation data for a project */
export interface ProjectRelations {
	tasks: ProjectTask[];
	communications: ProjectCommunication[];
	contents: ProjectContent[];
	creations: ProjectCreation[];
	ideas: ProjectIdea[];
}

// Project Timeline

/** Types of actions logged in the project timeline */
export type TimelineAction =
	| "description_added"
	| "description_modified"
	| "description_removed"
	| "deadline_added"
	| "deadline_modified"
	| "deadline_removed"
	| "priority_added"
	| "priority_modified"
	| "priority_removed"
	| "responsible_added"
	| "responsible_modified"
	| "responsible_removed"
	| "assistant_added"
	| "assistant_removed"
	| "communication_validated"
	| "project_created"
	| "status_changed"
	| "relation_added"
	| "relation_removed";

/** Single entry in the project timeline */
export interface TimelineEntry {
	id: string;
	action: TimelineAction;
	timestamp: string;
	user: string;
	description: string;
	metadata?: Record<string, string>;
}

// Core Project Entity

/** Core project entity with all display data */
export interface Project {
	id: string;
	name: string;
	emoji: string;
	description: string;
	status: ProjectStatusValue;
	priority: ProjectPriorityValue;
	startDate: string;
	endDate: string;
	responsible: ProjectMember;
	assistants: ProjectMember[];
	members: ProjectMember[];
	tasks: ProjectTasks;
	progress: number;
	color?: string;
	relations: ProjectRelations;
	timeline: TimelineEntry[];
	completedAt?: string;
}

/** Steps in the project creation wizard */
export type WizardStep = "title" | "description" | "deadline" | "priority" | "responsible" | "assistants";

/** All wizard steps in order */
export const WIZARD_STEPS: WizardStep[] = ["title", "description", "deadline", "priority", "responsible", "assistants"];

/** Form data for creating or editing a project */
export interface ProjectFormData {
	name: string;
	emoji?: string;
	description: string;
	status: ProjectStatusValue;
	priority?: ProjectPriorityValue;
	startDate: string;
	endDate: string;
	responsible?: ProjectMember;
	assistants?: ProjectMember[];
	members: ProjectMember[];
}

/** Available project view modes */
export type ProjectViewMode = "grid" | "kanban";
