"use server";

import { revalidatePath } from "next/cache";
import { GroupService } from "@/services/GroupService";
import { AuthService } from "@/services/AuthService";
import { createGroupSchema, updateGroupSchema } from "@/lib/validators/schemas";
import type { CreateGroupFormData, UpdateGroupFormData } from "@/lib/validators/schemas";

/** Standard action result */
export interface ActionResult {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
}

/**
 * Creates a new group
 * @param formData - Group creation fields
 * @returns Action result with created group data
 */
export async function createGroupAction(formData: CreateGroupFormData): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Validate input
	const parsed = createGroupSchema.safeParse(formData);
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0]?.message ?? "Donnees invalides" };
	}

	// Create group via service
	const group = await GroupService.create(parsed.data, currentUser.id);

	// Revalidate cached pages
	revalidatePath("/groups");

	return { success: true, data: { id: group.id } };
}

/**
 * Updates an existing group
 * @param groupId - Target group ID
 * @param formData - Partial group update fields
 * @returns Action result with update status
 */
export async function updateGroupAction(groupId: string, formData: UpdateGroupFormData): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Validate input
	const parsed = updateGroupSchema.safeParse(formData);
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0]?.message ?? "Donnees invalides" };
	}

	// Check target group exists
	const targetGroup = await GroupService.getById(groupId);
	if (!targetGroup) {
		return { success: false, error: "Groupement introuvable" };
	}

	// Update via service
	await GroupService.update(groupId, parsed.data, currentUser.id);

	// Revalidate cached pages
	revalidatePath("/groups");

	return { success: true };
}

/**
 * Deletes a group
 * @param groupId - Target group ID
 * @returns Action result with deletion status
 */
export async function deleteGroupAction(groupId: string): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Check target group exists
	const targetGroup = await GroupService.getById(groupId);
	if (!targetGroup) {
		return { success: false, error: "Groupement introuvable" };
	}

	// Delete via service
	await GroupService.delete(groupId, currentUser.id);

	// Revalidate cached pages
	revalidatePath("/groups");

	return { success: true };
}

/**
 * Adds a member to a group
 * @param groupId - Target group ID
 * @param userId - User to add
 * @param role - Role to assign
 * @returns Action result
 */
export async function addGroupMemberAction(groupId: string, userId: string, role: string): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Add member via service
	await GroupService.addMember(groupId, userId, role, currentUser.id);

	// Revalidate cached pages
	revalidatePath("/groups");

	return { success: true };
}

/**
 * Removes a member from a group
 * @param groupId - Target group ID
 * @param userId - User to remove
 * @returns Action result
 */
export async function removeGroupMemberAction(groupId: string, userId: string): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Remove member via service
	await GroupService.removeMember(groupId, userId, currentUser.id);

	// Revalidate cached pages
	revalidatePath("/groups");

	return { success: true };
}

/**
 * Updates a member role in a group
 * @param groupId - Target group ID
 * @param userId - Target user ID
 * @param role - New role
 * @returns Action result
 */
export async function updateMemberRoleAction(groupId: string, userId: string, role: string): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Update role via service
	await GroupService.updateMemberRole(groupId, userId, role, currentUser.id);

	// Revalidate cached pages
	revalidatePath("/groups");

	return { success: true };
}

/**
 * Get a single group by ID
 * @param groupId - Target group ID
 * @returns Action result with group data
 */
export async function getGroupAction(groupId: string): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Fetch group via service
	const group = await GroupService.getById(groupId);
	if (!group) {
		return { success: false, error: "Groupement introuvable" };
	}

	return { success: true, data: group as unknown as Record<string, unknown> };
}

/**
 * Get all groups paginated
 * @param page - Page number
 * @param pageSize - Groups per page
 * @returns Action result with groups list and pagination
 */
export async function getGroupsAction(page = 1, pageSize = 20): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Fetch paginated groups via service
	const result = await GroupService.getAll(page, pageSize);

	return { success: true, data: result as unknown as Record<string, unknown> };
}
