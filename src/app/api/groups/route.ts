import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GroupService } from "@/services/GroupService";
import { AuthService } from "@/services/AuthService";
import { createGroupSchema } from "@/lib/validators/schemas";
import { getAllowedGroupIds, hasGlobalEntityAccess } from "@/lib/server/entity-scope";
import { normalizeRoleTemplates } from "@/core/config/entity-blueprint";
import type { Module } from "@/core/config/capabilities";

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
	const skip = (page - 1) * pageSize;

	if (!hasGlobalEntityAccess(currentUser)) {
		const allowedGroupIds = getAllowedGroupIds(currentUser) ?? [];
		const [groups, total] = await Promise.all([
			prisma.group.findMany({
				where: { id: { in: allowedGroupIds } },
				skip,
				take: pageSize,
				include: {
					_count: { select: { members: true, projects: true } },
					members: {
						select: {
							user: {
								select: { roleId: true },
							},
						},
					},
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.group.count({ where: { id: { in: allowedGroupIds } } }),
		]);

		const normalized = groups.map((group) => ({
			...group,
			legacyMembersCount: group.members.filter((member) => (member.user.roleId ?? "").startsWith("legacy_"))
				.length,
		}));

		return NextResponse.json({ groups: normalized, total, page, pageSize });
	}

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

	if (!hasGlobalEntityAccess(currentUser)) {
		return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
	}

	// Parse request body
	const body = await request.json();

	// Validate input
	const parsed = createGroupSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	}

	const normalizedRoleTemplates = normalizeRoleTemplates(
		(parsed.data.roleTemplates ?? []).map((template) => ({
			key: template.key,
			label: template.label,
			modules: template.modules.filter(Boolean) as Module[],
		})),
	);
	const group = await GroupService.create({ ...parsed.data, roleTemplates: normalizedRoleTemplates }, currentUser.id);

	return NextResponse.json(group, { status: 201 });
}
