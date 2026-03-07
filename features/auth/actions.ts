"use server";

// Next.js
import { redirect } from "next/navigation";
import { AuthService } from "@/services/AuthService";
import { verifyA2FCode } from "@/core/security/a2f.service";
import { loginSchema } from "@/lib/validators/schemas";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { nanoid } from "nanoid";

/** Result of an authentication action */
export interface AuthActionResult {
	success: boolean;
	error?: string;
	requireA2F?: boolean;
}

/**
 * Authenticates a user via email and password
 * @param formData - Login credentials containing email and password
 * @returns Action result with success status and optional A2F requirement
 */
export async function loginAction(formData: { email: string; password: string }): Promise<AuthActionResult> {
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
 * Verifies a 2FA code for the current session
 * @param code - The 6-digit verification code
 * @returns Action result with success status
 */
export async function verifyA2FAction(code: string): Promise<AuthActionResult> {
	if (!code || code.length !== 6) {
		return { success: false, error: "Le code doit contenir 6 chiffres" };
	}

	const session = await AuthService.getSession();
	if (!session) {
		return { success: false, error: "Session expirée, veuillez vous reconnecter" };
	}

	const isValid = await verifyA2FCode(session.userId, code);
	if (!isValid) {
		return { success: false, error: "Code A2F invalide" };
	}

	return { success: true };
}

/**
 * Enables A2F for a list of accounts (temporary dev helper)
 * @param emails - Account emails to enable A2F for
 * @returns Action result with success status
 */
export async function enableA2FForEmailsAction(emails: string[]): Promise<AuthActionResult> {
	if (process.env.NODE_ENV === "production") {
		return { success: false, error: "Action indisponible en production" };
	}

	if (!Array.isArray(emails) || emails.length === 0) {
		return { success: false, error: "Aucun compte fourni" };
	}

	const normalizedEmails = [...new Set(emails.map((email) => email.toLowerCase().trim()).filter(Boolean))];
	if (normalizedEmails.length === 0) {
		return { success: false, error: "Emails invalides" };
	}

	const result = await prisma.user.updateMany({
		where: { email: { in: normalizedEmails } },
		data: { a2fEnabled: true },
	});

	if (result.count === 0) {
		return { success: false, error: "Aucun utilisateur trouve" };
	}

	return { success: true };
}

/**
 * Returns the authenticated user's ID from the current session
 * @returns User ID string or null if unauthenticated
 */
export async function getCurrentUserIdAction(): Promise<string | null> {
	const session = await AuthService.getSession();
	return session?.userId ?? null;
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

/** Payload for the onboarding form submission */
export interface OnboardingPayload {
	pseudo: string;
	prenom: string;
	nom: string;
	email: string;
	password: string;
	telephone?: string;
	dateNaissance?: string;
	langues: string[];
	anniversaire: boolean;
	discordId?: string;
	discordUsername?: string;
	twitter?: string;
	instagram?: string;
	twitch?: string;
	youtube?: string;
}

/** Result of the onboarding submission */
export interface OnboardingActionResult {
	success: boolean;
	error?: string;
	userId?: string;
}

/**
 * Creates a new user from the onboarding form, adds them to the main Squad,
 * and creates an authenticated session
 * @param data - Collected onboarding form data
 * @returns Action result with success status
 */
export async function submitOnboardingAction(data: OnboardingPayload): Promise<OnboardingActionResult> {
	// Validate required fields
	if (!data.email?.trim() || !data.password?.trim() || !data.pseudo?.trim()) {
		return { success: false, error: "Champs obligatoires manquants" };
	}

	if (data.password.length < 8) {
		return { success: false, error: "Le mot de passe doit contenir au moins 8 caractères" };
	}

	// Check email uniqueness
	const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase().trim() } });
	if (existing) {
		return { success: false, error: "Cet email est déjà utilisé" };
	}

	const hashedPwd = await hashPassword(data.password);
	const userId = nanoid(21);
	const email = data.email.toLowerCase().trim();

	// Create user
	const user = await prisma.user.create({
		data: {
			id: userId,
			email,
			password: hashedPwd,
			firstName: data.prenom.trim(),
			lastName: data.nom.trim(),
			pseudo: data.pseudo.trim(),
			role: "Collaborator",
			status: "active",

			// Profile
			phone: data.telephone?.trim() || null,
			birthdate: data.dateNaissance || null,
			birthdayWish: data.anniversaire,
			languages: data.langues,

			// Discord
			discordId: data.discordId?.trim() || null,
			discordUsername: data.discordUsername?.trim() || null,

			// Social
			socialTwitter: data.twitter?.trim() || null,
			socialTwitch: data.twitch?.trim() || null,
			socialYoutube: data.youtube?.trim() || null,
			socialInstagram: data.instagram?.trim() || null,

			// Organisation — Marsha Academy (Division 0)
			entity: "bazalthe",
			team: "Marsha Academy",
			division: 0,
			roleId: "momentum_talent",
			entityAccess: ["bazalthe"],
			arrivalDate: new Date().toISOString().split("T")[0],
		},
	});

	// Add to main Squad (grp-bazalthe)
	await prisma.groupMember.create({
		data: {
			userId: user.id,
			groupId: "grp-bazalthe",
			role: "Collaborator",
		},
	});

	// Auto-login: create authenticated session
	await createSession(user.id, user.email, user.role);

	return { success: true, userId: user.id };
}
