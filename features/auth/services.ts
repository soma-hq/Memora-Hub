// Services & Managers
import { AuthService } from "@/services/AuthService";


/**
 * Authenticates a user with email and password
 * @param email - User email address
 * @param password - Plain text password
 * @returns User object or null if credentials are invalid
 */
export async function authenticateUser(email: string, password: string) {
	return AuthService.authenticateUser(email, password);
}

/**
 * Registers a new user in the system
 * @param data - User registration data including email, password, name, and optional role
 * @returns Newly created user object
 */
export async function registerUser(data: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role?: "Owner" | "Admin" | "Manager" | "Collaborator" | "Guest";
}) {
	return AuthService.registerUser(data);
}

/**
 * Changes a user password after verifying the current one
 * @param userId - Unique user identifier
 * @param currentPassword - Current password for verification
 * @param newPassword - New password to set
 * @returns True if password was changed successfully
 */
export async function changeUserPassword(
	userId: string,
	currentPassword: string,
	newPassword: string,
): Promise<boolean> {
	return AuthService.changePassword(userId, currentPassword, newPassword);
}
