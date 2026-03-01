"use server";

import { revalidatePath } from "next/cache";
import { ProjectService } from "@/services/ProjectService";
import { TaskService } from "@/services/TaskService";
import { AuthService } from "@/services/AuthService";
import { createProjectSchema } from "@/lib/validators/schemas";
import type { CreateProjectFormData } from "@/lib/validators/schemas";

/** Standard action result */
export interface ActionResult {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
}

/**
 * Creates a new project in a group
 * @param groupId - Parent group ID
 * @param formData - Project creation fields
 * @returns Action result with created project data
 */
export async function createProjectAction(groupId: string, formData: CreateProjectFormData): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const parsed = createProjectSchema.safeParse(formData);
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0]?.message ?? "Donnees invalides" };
	}

	const project = await ProjectService.create(groupId, currentUser.id, parsed.data);

	revalidatePath(`/hub/${groupId}/projects`);

	return { success: true, data: { id: project.id } };
}

/**
 * Updates an existing project
 * @param projectId - Target project ID
 * @param formData - Partial project update fields
 * @returns Action result
 */
export async function updateProjectAction(
	projectId: string,
	formData: Partial<CreateProjectFormData>,
): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const targetProject = await ProjectService.getById(projectId);
	if (!targetProject) {
		return { success: false, error: "Projet introuvable" };
	}

	await ProjectService.update(projectId, formData, currentUser.id);

	revalidatePath(`/hub/${targetProject.groupId}/projects`);

	return { success: true };
}

/**
 * Deletes a project
 * @param projectId - Target project ID
 * @returns Action result
 */
export async function deleteProjectAction(projectId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const targetProject = await ProjectService.getById(projectId);
	if (!targetProject) {
		return { success: false, error: "Projet introuvable" };
	}

	await ProjectService.delete(projectId, currentUser.id);

	revalidatePath(`/hub/${targetProject.groupId}/projects`);

	return { success: true };
}

/**
 * Adds a member to a project
 * @param projectId - Target project ID
 * @param userId - User to add
 * @param role - Member role
 * @returns Action result
 */
export async function addProjectMemberAction(
	projectId: string,
	userId: string,
	role = "member",
): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	await ProjectService.addMember(projectId, userId, role);

	return { success: true };
}

/**
 * Removes a member from a project
 * @param projectId - Target project ID
 * @param userId - User to remove
 * @returns Action result
 */
export async function removeProjectMemberAction(projectId: string, userId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	await ProjectService.removeMember(projectId, userId);

	return { success: true };
}

/**
 * Get a single project by ID
 */
export async function getProjectAction(projectId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const project = await ProjectService.getById(projectId);
	if (!project) {
		return { success: false, error: "Projet introuvable" };
	}

	return { success: true, data: project as unknown as Record<string, unknown> };
}

/**
 * Get projects by group paginated
 */
export async function getProjectsAction(groupId: string, page = 1, pageSize = 20): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const result = await ProjectService.getByGroup(groupId, page, pageSize);

	return { success: true, data: result as unknown as Record<string, unknown> };
}

/**
 * Updates a project status
 * @param projectId - Target project ID
 * @param status - New status value
 * @returns Action result
 */
export async function updateProjectStatusAction(projectId: string, status: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const project = await ProjectService.getById(projectId);
	if (!project) return { success: false, error: "Projet introuvable" };
	await ProjectService.update(projectId, { status: status as never }, currentUser.id);
	revalidatePath(`/hub/${project.groupId}/projects`);
	return { success: true };
}

/**
 * Archives a project
 * @param projectId - Target project ID
 * @returns Action result
 */
export async function archiveProjectAction(projectId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const project = await ProjectService.getById(projectId);
	if (!project) return { success: false, error: "Projet introuvable" };
	await ProjectService.update(projectId, { status: "archived" as never }, currentUser.id);
	revalidatePath(`/hub/${project.groupId}/projects`);
	return { success: true };
}

/**
 * Get task status counts for a project
 * @param projectId - Target project ID
 * @returns Action result with status counts
 */
export async function getProjectStatsAction(projectId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const counts = await TaskService.getStatusCounts(projectId);
	return { success: true, data: counts as unknown as Record<string, unknown> };
}

/**
 * Get members of a project
 * @param projectId - Target project ID
 * @returns Action result with members
 */
export async function getProjectMembersAction(projectId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const project = await ProjectService.getById(projectId);
	if (!project) return { success: false, error: "Projet introuvable" };
	return { success: true, data: { members: project.members } as unknown as Record<string, unknown> };
}

/**
 * Get projects for the current user
 * @returns Action result with user projects
 */
export async function getProjectsByUserAction(): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const projects = await ProjectService.getByUser(currentUser.id);
	return { success: true, data: { projects } as unknown as Record<string, unknown> };
}
