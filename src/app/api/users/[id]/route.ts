import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/UserService";
import { AuthService } from "@/services/AuthService";
import { updateUserSchema } from "@/lib/validators/schemas";

/**
 * GET /api/users/[id] - Get a user by ID
 * @param request - Incoming request
 * @param params - Route params containing user ID
 * @returns JSON response with user data
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	// Verify authentication
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	}

	const { id } = await params;

	// Fetch user
	const user = await UserService.getById(id);
	if (!user) {
		return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
	}

	return NextResponse.json(user);
}

/**
 * PUT /api/users/[id] - Update a user
 * @param request - Request with partial user update data in body
 * @param params - Route params containing user ID
 * @returns JSON response with updated user
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	// Verify authentication
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	}

	const { id } = await params;

	// Parse request body
	const body = await request.json();

	// Validate input
	const parsed = updateUserSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	}

	// Check target user exists
	const targetUser = await UserService.getById(id);
	if (!targetUser) {
		return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
	}

	// Check email uniqueness if email is being changed
	if (parsed.data.email && parsed.data.email !== targetUser.email) {
		const existing = await UserService.getByEmail(parsed.data.email);
		if (existing) {
			return NextResponse.json({ error: "Cet email est deja utilise" }, { status: 409 });
		}
	}

	// Update user
	const user = await UserService.update(id, parsed.data, currentUser.id);

	return NextResponse.json(user);
}

/**
 * DELETE /api/users/[id] - Delete a user
 * @param request - Incoming request
 * @param params - Route params containing user ID
 * @returns JSON response confirming deletion
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	// Verify authentication
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	}

	const { id } = await params;

	// Prevent self-deletion
	if (currentUser.id === id) {
		return NextResponse.json({ error: "Impossible de supprimer votre propre compte" }, { status: 403 });
	}

	// Check target user exists
	const targetUser = await UserService.getById(id);
	if (!targetUser) {
		return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
	}

	// Delete user
	await UserService.delete(id, currentUser.id);

	return NextResponse.json({ success: true });
}
