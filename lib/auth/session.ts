// External libraries
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { signToken, verifyToken } from "@/lib/auth/jwt";
import type { JwtPayload } from "@/lib/auth/jwt";


const SESSION_COOKIE = "memora-session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Creates a new session for a user and sets the session cookie
 * @param userId - Unique user identifier
 * @param email - User email address
 * @param role - User role
 * @returns Session JWT token
 */
export async function createSession(userId: string, email: string, role: string): Promise<string> {
	const token = signToken({ userId, email, role });
	const sessionId = nanoid();

	// Persist session in database
	await prisma.session.create({
		data: {
			id: sessionId,
			userId,
			token,
			expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
		},
	});

	// Set secure HTTP-only cookie
	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: SESSION_DURATION_MS / 1000,
		path: "/",
	});

	return token;
}

/**
 * Retrieves and validates the current session from cookies
 * @returns JWT payload or null if no valid session exists
 */
export async function getSession(): Promise<JwtPayload | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE)?.value;

	if (!token) return null;

	const payload = verifyToken(token);
	if (!payload) return null;

	// Validate session exists in database and is not expired
	const session = await prisma.session.findUnique({
		where: { token },
	});

	if (!session || session.expiresAt < new Date()) {
		if (session) {
			await prisma.session.delete({ where: { id: session.id } });
		}
		return null;
	}

	return payload;
}

/**
 * Deletes the current session and clears the session cookie
 */
export async function deleteSession(): Promise<void> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE)?.value;

	if (token) {
		await prisma.session.deleteMany({ where: { token } });
	}

	cookieStore.delete(SESSION_COOKIE);
}

/**
 * Retrieves the currently authenticated user with group memberships
 * @returns User object with groups or null if not authenticated
 */
export async function getCurrentUser() {
	const session = await getSession();
	if (!session) return null;

	const user = await prisma.user.findUnique({
		where: { id: session.userId },
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			avatar: true,
			role: true,
			status: true,
			a2fEnabled: true,
			createdAt: true,
			groupMemberships: {
				include: {
					group: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
		},
	});

	return user;
}
