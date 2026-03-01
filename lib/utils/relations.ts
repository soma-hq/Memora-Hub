// Constants & types
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";
import type { Meeting } from "@/features/meetings/types";
import type { AbsenceMode } from "@/features/absences/absence-mode";


/**
 * Retrieves tasks that belong to a project based on project relations
 * @param project - Project to look up related tasks for
 * @param allTasks - All available tasks to search through
 * @returns Array of tasks related to the project
 */
export function getTasksForProject(project: Project, allTasks: Task[]): Task[] {
	if (!project.relations?.tasks || project.relations.tasks.length === 0) return [];
	const taskIdSet = new Set(project.relations.tasks.map((t) => t.id));
	return allTasks.filter((task) => taskIdSet.has(task.id));
}

/**
 * Retrieves meetings related to a project
 * @param _project - Project to look up related meetings for
 * @param _allMeetings - All available meetings to search through
 * @returns Array of meetings related to the project (currently empty as ProjectRelations has no meetings)
 */
export function getMeetingsForProject(_project: Project, _allMeetings: Meeting[]): Meeting[] {
	return [];
}

/**
 * Checks whether a user can be mentioned based on their absence mode
 * @param absenceMode - Current absence mode of the user
 * @returns True if the user can be mentioned
 */
export function canMentionUser(absenceMode: AbsenceMode): boolean {
	return absenceMode !== "complete";
}

/**
 * Checks whether a user can be assigned tasks based on their absence mode
 * @param absenceMode - Current absence mode of the user
 * @returns True if the user can be assigned tasks
 */
export function canAssignUser(absenceMode: AbsenceMode): boolean {
	return absenceMode !== "complete";
}

/**
 * Returns projects where the specified user is a member
 * @param userName - Name of the user to search for
 * @param allProjects - All available projects
 * @returns Projects where the user is a member
 */
export function getProjectsForUser(userName: string, allProjects: Project[]): Project[] {
	return allProjects.filter((project) => project.members.some((m) => m.name === userName));
}

/**
 * Counts incomplete tasks related to a project
 * @param project - Project to check
 * @param allTasks - All tasks in the system
 * @returns Number of incomplete tasks for this project
 */
export function countPendingTasks(project: Project, allTasks: Task[]): number {
	const projectTasks = getTasksForProject(project, allTasks);
	return projectTasks.filter((task) => task.status !== "done").length;
}

/**
 * Checks if a project has any upcoming meetings
 * @param project - Project to check
 * @param allMeetings - All meetings in the system
 * @returns True if the project has at least one future meeting
 */
export function hasUpcomingMeetings(project: Project, allMeetings: Meeting[]): boolean {
	const projectMeetings = getMeetingsForProject(project, allMeetings);
	const now = new Date();
	return projectMeetings.some((meeting) => new Date(meeting.date) > now);
}
