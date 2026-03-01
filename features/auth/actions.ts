"use server";

// Next.js
import { redirect } from "next/navigation";
import { AuthService } from "@/services/AuthService";
import { loginSchema } from "@/lib/validators/schemas";


/** Result of an authentication action */
export interface ActionResult {
	success: boolean;
	error?: string;
	requireA2F?: boolean;
}

/**
 * Authenticates a user via email and password
 * @param formData - Login credentials containing email and password
 * @returns Action result with success status and optional A2F requirement
 */
export async function loginAction(formData: { email: string; password: string }): Promise<ActionResult> {
	// Validate input
	const parsed = loginSchema.safeParse(formData);
	if (!parsed.success) {
		return { success: false, error: "Donnees invalides" };
	}

	const { email, password } = parsed.data;

	// Authenticate via service
	const user = await AuthService.authenticateUser(email, password);
	if (!user) {
		return { success: false, error: "Email ou mot de passe incorrect" };
	}

	// Check if A2F is required
	if (user.a2fEnabled) {
		await AuthService.createSession(user.id, user.email, user.role);
		return { success: true, requireA2F: true };
	}

	// Create full session
	await AuthService.createSession(user.id, user.email, user.role);

	return { success: true };
}

/**
 * Logs out the current user and redirects to login page
 * @returns Nothing, redirects to /login
 * @throws Redirects via Next.js redirect
 */
export async function logoutAction(): Promise<void> {
	const session = await AuthService.getSession();
	await AuthService.logout(session?.userId);
	redirect("/login");
}
