/** Centralized cookie configuration for the session cookie */

export const SESSION_COOKIE_NAME = "memora-session";

export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const SESSION_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict" as const,
	maxAge: SESSION_DURATION_SECONDS,
	path: "/",
};
