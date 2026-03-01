import { NextRequest, NextResponse } from "next/server";
import { GroupService } from "@/services/GroupService";
import { AuthService } from "@/services/AuthService";
import { updateGroupSchema } from "@/lib/validators/schemas";

/**
 * GET /api/groups/[id] - Get a group by ID
 * @param request - Incoming request
 * @param params - Route params containing group ID
 * @returns JSON response with group data
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	// Verify authentication
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	}

	const { id } = await params;

	// Fetch group
	const group = await GroupService.getById(id);
	if (!group) {
		return NextResponse.json({ error: "Groupement introuvable" }, { status: 404 });
	}

	return NextResponse.json(group);
}

/**
 * PUT /api/groups/[id] - Update a group
 * @param request - Request with partial group update data in body
 * @param params - Route params containing group ID
 * @returns JSON response with updated group
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
	const parsed = updateGroupSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	}

	// Check target group exists
	const targetGroup = await GroupService.getById(id);
	if (!targetGroup) {
		return NextResponse.json({ error: "Groupement introuvable" }, { status: 404 });
	}

	// Update group
	const group = await GroupService.update(id, parsed.data, currentUser.id);

	return NextResponse.json(group);
}

/**
 * DELETE /api/groups/[id] - Delete a group
 * @param request - Incoming request
 * @param params - Route params containing group ID
 * @returns JSON response confirming deletion
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	// Verify authentication
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	}

	const { id } = await params;

	// Check target group exists
	const targetGroup = await GroupService.getById(id);
	if (!targetGroup) {
		return NextResponse.json({ error: "Groupement introuvable" }, { status: 404 });
	}

	// Delete group
	await GroupService.delete(id, currentUser.id);

	return NextResponse.json({ success: true });
}
