"use server";

import { revalidatePath } from "next/cache";
import { UserService } from "@/services/UserService";
import { AuthService } from "@/services/AuthService";
import { createUserSchema, updateUserSchema } from "@/lib/validators/schemas";
import type { CreateUserFormData, UpdateUserFormData } from "@/lib/validators/schemas";
import type { UserStatusValue } from "@/constants";

/** Standard action result */
export interface ActionResult {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
}

/**
 * Creates a new user
 * @param formData - User creation fields
 * @returns Action result with created user data
 */
export async function createUserAction(formData: CreateUserFormData): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Validate input
	const parsed = createUserSchema.safeParse(formData);
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0]?.message ?? "Donnees invalides" };
	}

	// Check email uniqueness
	const existing = await UserService.getByEmail(parsed.data.email);
	if (existing) {
		return { success: false, error: "Cet email est deja utilise" };
	}

	// Create user via service
	const user = await UserService.create(parsed.data, currentUser.id);

	// Revalidate cached pages
	revalidatePath("/users");

	return { success: true, data: { id: user.id } };
}

/**
 * Updates an existing user
 * @param userId - Target user ID
 * @param formData - Partial user update fields
 * @returns Action result with update status
 */
export async function updateUserAction(userId: string, formData: UpdateUserFormData): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Validate input
	const parsed = updateUserSchema.safeParse(formData);
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0]?.message ?? "Donnees invalides" };
	}

	// Check target user exists
	const targetUser = await UserService.getById(userId);
	if (!targetUser) {
		return { success: false, error: "Utilisateur introuvable" };
	}

	// Check email uniqueness if email is being changed
	if (parsed.data.email && parsed.data.email !== targetUser.email) {
		const existing = await UserService.getByEmail(parsed.data.email);
		if (existing) {
			return { success: false, error: "Cet email est deja utilise" };
		}
	}

	// Update via service
	await UserService.update(userId, parsed.data, currentUser.id);

	// Revalidate cached pages
	revalidatePath("/users");
	revalidatePath(`/profile`);

	return { success: true };
}

/**
 * Deletes a user
 * @param userId - Target user ID
 * @returns Action result with deletion status
 */
export async function deleteUserAction(userId: string): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Prevent self-deletion
	if (currentUser.id === userId) {
		return { success: false, error: "Impossible de supprimer votre propre compte" };
	}

	// Check target user exists
	const targetUser = await UserService.getById(userId);
	if (!targetUser) {
		return { success: false, error: "Utilisateur introuvable" };
	}

	// Delete via service
	await UserService.delete(userId, currentUser.id);

	// Revalidate cached pages
	revalidatePath("/users");

	return { success: true };
}

/**
 * Updates user status (active/inactive)
 * @param userId - Target user ID
 * @param status - New status value
 * @returns Action result with status update
 */
export async function updateUserStatusAction(userId: string, status: UserStatusValue): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Check target user exists
	const targetUser = await UserService.getById(userId);
	if (!targetUser) {
		return { success: false, error: "Utilisateur introuvable" };
	}

	// Update status via service
	await UserService.updateStatus(userId, status, currentUser.id);

	// Revalidate cached pages
	revalidatePath("/users");

	return { success: true };
}

/**
 * Get a single user by ID
 * @param userId - Target user ID
 * @returns Action result with user data
 */
export async function getUserAction(userId: string): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Fetch user via service
	const user = await UserService.getById(userId);
	if (!user) {
		return { success: false, error: "Utilisateur introuvable" };
	}

	return { success: true, data: user as unknown as Record<string, unknown> };
}

/**
 * Get all users paginated
 * @param page - Page number
 * @param pageSize - Users per page
 * @returns Action result with users list and pagination
 */
export async function getUsersAction(page = 1, pageSize = 20): Promise<ActionResult> {
	// Verify session
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	// Fetch paginated users via service
	const result = await UserService.getAll(page, pageSize);

	return { success: true, data: result as unknown as Record<string, unknown> };
}
