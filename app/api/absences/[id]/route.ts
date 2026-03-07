import { NextRequest, NextResponse } from "next/server";
import { AbsenceService } from "@/services/AbsenceService";
import { AuthService } from "@/services/AuthService";
import { canAccessEntityId } from "@/lib/server/entity-scope";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const absence = await AbsenceService.getById(id);
	if (!absence) return NextResponse.json({ error: "Absence introuvable" }, { status: 404 });
	if (!absence.user?.entity || !canAccessEntityId(currentUser, absence.user.entity)) {
		return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
	}
	return NextResponse.json(absence);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const absence = await AbsenceService.getById(id);
	if (!absence) return NextResponse.json({ error: "Absence introuvable" }, { status: 404 });
	if (!absence.user?.entity || !canAccessEntityId(currentUser, absence.user.entity)) {
		return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
	}
	await AbsenceService.delete(id, currentUser.id);
	return NextResponse.json({ success: true });
}
