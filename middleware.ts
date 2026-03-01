import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


/** Routes accessible without authentication */
const PUBLIC_ROUTES = ["/login", "/a2f", "/onboarding"];

/** Routes that redirect authenticated users to the hub */
const REDIRECT_IF_AUTH = ["/login"];

/**
 * Handles authentication redirects for all matched routes.
 * @param request - Incoming Next.js request
 * @returns {NextResponse} Redirect or passthrough response
 */
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const sessionToken = request.cookies.get("memora-session")?.value;

	// Allow public routes, redirect from login if already authenticated
	if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
		if (sessionToken && REDIRECT_IF_AUTH.some((route) => pathname.startsWith(route))) {
			return NextResponse.redirect(new URL("/hub/default", request.url));
		}
		return NextResponse.next();
	}

	// Redirect unauthenticated users to login with return path
	if (!sessionToken) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

/** Route matcher excluding API, static assets, and public files */
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon|logos|avatar|banners|.*\\..*$).*)"],
};
