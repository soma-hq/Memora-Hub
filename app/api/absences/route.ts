import { NextRequest, NextResponse } from "next/server";
import { AbsenceService } from "@/services/AbsenceService";
import { AuthService } from "@/services/AuthService";
import { createAbsenceSchema } from "@/lib/validators/schemas";
import { getAllowedEntityIds, resolveAuthorizedEntityId } from "@/lib/server/entity-scope";

export async function GET(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get("page") ?? "1", 10);
	const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
	const status = searchParams.get("status") ?? undefined;
	const userId = searchParams.get("userId");
	const requestedEntity = searchParams.get("entityId");
	const allowedEntityIds = getAllowedEntityIds(currentUser);

	let scopedEntityIds = allowedEntityIds;
	if (requestedEntity) {
		const resolvedEntity = resolveAuthorizedEntityId(currentUser, requestedEntity);
		if (!resolvedEntity) return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
		scopedEntityIds = [resolvedEntity];
	}

	if (userId) {
		const absences = await AbsenceService.getByUser(userId, status, scopedEntityIds ?? undefined);
		return NextResponse.json({ absences });
	}
	const result = await AbsenceService.getAll(page, pageSize, status, scopedEntityIds ?? undefined);
	return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const body = await request.json();
	const parsed = createAbsenceSchema.safeParse(body);
	if (!parsed.success)
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	const absence = await AbsenceService.create(currentUser.id, parsed.data);
	return NextResponse.json(absence, { status: 201 });
}
