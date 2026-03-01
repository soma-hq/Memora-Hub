import { NextRequest, NextResponse } from "next/server";
import { GroupService } from "@/services/GroupService";
import { AuthService } from "@/services/AuthService";
import { createGroupSchema } from "@/lib/validators/schemas";

/**
 * GET /api/groups - List groups paginated
 * @param request - Request with optional page and pageSize query params
 * @returns JSON response with groups array and pagination metadata
 */
export async function GET(request: NextRequest) {
	// Verify authentication
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	}

	// Extract pagination parameters
	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get("page") ?? "1", 10);
	const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);

	// Fetch paginated groups
	const result = await GroupService.getAll(page, pageSize);

	return NextResponse.json(result);
}

/**
 * POST /api/groups - Create a new group
 * @param request - Request with group creation data in body
 * @returns JSON response with created group or validation error
 */
export async function POST(request: NextRequest) {
	// Verify authentication
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	}

	// Parse request body
	const body = await request.json();

	// Validate input
	const parsed = createGroupSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	}

	// Create group
	const group = await GroupService.create(parsed.data, currentUser.id);

	return NextResponse.json(group, { status: 201 });
}
