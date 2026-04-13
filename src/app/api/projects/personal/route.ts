import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/services/ProjectService";
import { AuthService } from "@/services/AuthService";
import { resolveAuthorizedGroupId } from "@/lib/server/entity-scope";

/**
 * GET /api/projects/personal
 * Returns projects for the authenticated user, scoped to the requested group.
 */
export async function GET(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });

	const { searchParams } = new URL(request.url);
	const groupId = searchParams.get("groupId");
	if (!groupId) return NextResponse.json({ error: "groupId requis" }, { status: 400 });

	const resolvedGroupId = resolveAuthorizedGroupId(currentUser, groupId);
	if (!resolvedGroupId) return NextResponse.json({ error: "Acces refuse" }, { status: 403 });

	const projects = await ProjectService.getByUserAndGroup(currentUser.id, resolvedGroupId);
	return NextResponse.json({ projects });
}
