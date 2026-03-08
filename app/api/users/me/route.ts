import { NextResponse } from "next/server";
import { AuthService } from "@/services/AuthService";

/**
 * GET /api/users/me - Return the currently authenticated user.
 */
export async function GET() {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	}

	return NextResponse.json({ user: currentUser });
}
