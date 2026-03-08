import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/cookies";

// Routes accessible without authentication
const PUBLIC_ROUTES = ["/login", "/a2f", "/onboarding"];

// Routes that redirect authenticated users to the hub
const REDIRECT_IF_AUTH = ["/login"];

/**
 * Applies security headers to a response.
 */
function withSecurityHeaders(response: NextResponse): NextResponse {
	// Basic protection
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-XSS-Protection", "1; mode=block");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

	// HTTPS enforcement (production only)
	if (process.env.NODE_ENV === "production") {
		response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
	}

	// Cross-Origin isolation
	response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
	response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

	// Content Security Policy
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob:",
		"font-src 'self' data:",
		"connect-src 'self' https:",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
	].join("; ");
	response.headers.set("Content-Security-Policy", csp);

	return response;
}

/**
 * Lightweight JWT validation for middleware (Edge-safe).
 * We only check token format + expiration to prevent redirect loops.
 */
function isSessionTokenFresh(token?: string): boolean {
	if (!token) return false;

	const parts = token.split(".");
	if (parts.length !== 3) return false;

	try {
		const payloadRaw = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const paddedPayload = payloadRaw.padEnd(Math.ceil(payloadRaw.length / 4) * 4, "=");
		const payload = JSON.parse(atob(paddedPayload)) as { exp?: number };
		if (typeof payload.exp !== "number") return true;
		return payload.exp * 1000 > Date.now();
	} catch {
		return false;
	}
}

/**
 * Handles authentication and applies security headers.
 * @param request - Incoming Next.js request
 * @returns {NextResponse} Redirect or passthrough response
 */
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
	const hasValidSession = isSessionTokenFresh(sessionToken);

	/**
	 * Clear stale session cookie.
	 * @param response - Response to mutate
	 * @returns Response with cleaned cookie state
	 */
	const clearInvalidSessionCookie = (response: NextResponse): NextResponse => {
		if (sessionToken && !hasValidSession) {
			response.cookies.delete(SESSION_COOKIE_NAME);
		}
		return response;
	};

	// Allow public routes, redirect from login if already authenticated
	if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
		if (hasValidSession && REDIRECT_IF_AUTH.some((route) => pathname.startsWith(route))) {
			return clearInvalidSessionCookie(NextResponse.redirect(new URL("/hub", request.url)));
		}
		return withSecurityHeaders(clearInvalidSessionCookie(NextResponse.next()));
	}

	// Redirect unauthenticated users to login with return path
	if (!hasValidSession) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return clearInvalidSessionCookie(NextResponse.redirect(loginUrl));
	}

	return withSecurityHeaders(clearInvalidSessionCookie(NextResponse.next()));
}

// Route matcher excluding API, static assets, and public files
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon|logos|avatar|banners|.*\\..*$).*)"],
};
