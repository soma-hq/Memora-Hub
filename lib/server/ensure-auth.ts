import { AuthService } from "@/services/AuthService";

// Standard error returned when user is not authenticated
export const AUTH_ERROR = { success: false as const, error: "Non authentifié" };

export async function ensureAuth() {
	return AuthService.getCurrentUser();
}
