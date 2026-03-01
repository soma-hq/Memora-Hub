import { prisma } from "@/lib/prisma";
import { LogService } from "@/services/LogService";
import { LogAction, UserStatus, UserRoles } from "@/constants";
import type { UserRole } from "@/constants";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession, getSession, getCurrentUser } from "@/lib/auth/session";


/** Authentication and session service */
export class AuthService {
	/**
	 * Authenticate user credentials
	 * @param email User email
	 * @param password Password to verify
	 * @returns User without password, or null
	 */

	static async authenticateUser(email: string, password: string) {
		// Query user by email with required fields
		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				password: true,
				firstName: true,
				lastName: true,
				role: true,
				status: true,
				a2fEnabled: true,
			},
		});

		// Validate user exists
		if (!user) return null;

		// Validate user account is active
		if (user.status !== UserStatus.Active) return null;

		// Verify the provided password against the stored hash
		const isValid = await verifyPassword(password, user.password);
		if (!isValid) return null;

		// Log the successful authentication
		await LogService.log(LogAction.Login, "user", user.id, user.id);

		// Return user data excluding the password field
		const { password: _, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}

	/**
	 * Register a new user
	 * @param data Registration fields
	 * @returns User without password
	 */

	static async registerUser(data: {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
		role?: UserRole;
	}) {
		// Hash the plain text password for secure storage
		const hashedPassword = await hashPassword(data.password);

		// Insert the new user into database
		const user = await prisma.user.create({
			data: {
				email: data.email,
				password: hashedPassword,
				firstName: data.firstName,
				lastName: data.lastName,
				role: data.role || UserRoles.Collaborator,
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				status: true,
				createdAt: true,
			},
		});

		// Log the user creation
		await LogService.log(LogAction.Create, "user", user.id);

		return user;
	}

	/**
	 * Change user password
	 * @param userId User ID
	 * @param currentPassword Current password
	 * @param newPassword New password
	 * @returns True if changed, false otherwise
	 */

	static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
		// Retrieve current password hash
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { password: true },
		});

		// Validate user exists
		if (!user) return false;

		// Verify current password matches stored hash
		const isValid = await verifyPassword(currentPassword, user.password);
		if (!isValid) return false;

		// Hash and persist the new password
		const hashedPassword = await hashPassword(newPassword);
		await prisma.user.update({
			where: { id: userId },
			data: { password: hashedPassword },
		});

		// Log the password change
		await LogService.log(LogAction.Update, "user", userId, userId, "password_changed");

		return true;
	}

	/**
	 * Create user session
	 * @param userId User ID
	 * @param role User role
	 */

	static createSession = createSession;

	/**
	 * Get current session
	 * @returns Session or null
	 */

	static getSession = getSession;

	/**
	 * Delete current session
	 */

	static deleteSession = deleteSession;

	/**
	 * Get current user
	 * @returns Current user with memberships or null
	 */

	static getCurrentUser = getCurrentUser;

	/**
	 * Log out user
	 * @param userId User ID
	 */

	static async logout(userId?: string) {
		// Log the logout action if user is identified
		if (userId) {
			await LogService.log(LogAction.Logout, "user", userId, userId);
		}

		// Destroy the active session
		await deleteSession();
	}
}
