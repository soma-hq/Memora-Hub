import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/UserService";
import { AuthService } from "@/services/AuthService";
import { createUserSchema } from "@/lib/validators/schemas";

/**
 * GET /api/users - List users paginated
 * @param request - Request with optional page and pageSize query params
 * @returns JSON response with users array and pagination metadata
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

	// Fetch paginated users
	const result = await UserService.getAll(page, pageSize);

	return NextResponse.json(result);
}

/**
 * POST /api/users - Create a new user
 * @param request - Request with user creation data in body
 * @returns JSON response with created user or validation error
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
	const parsed = createUserSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	}

	// Check email uniqueness
	const existing = await UserService.getByEmail(parsed.data.email);
	if (existing) {
		return NextResponse.json({ error: "Cet email est deja utilise" }, { status: 409 });
	}

	// Create user
	const user = await UserService.create(parsed.data, currentUser.id);

	return NextResponse.json(user, { status: 201 });
}
