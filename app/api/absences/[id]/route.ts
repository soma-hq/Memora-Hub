import { NextRequest, NextResponse } from "next/server";
import { AbsenceService } from "@/services/AbsenceService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const absence = await AbsenceService.getById(id);
	if (!absence) return NextResponse.json({ error: "Absence introuvable" }, { status: 404 });
	return NextResponse.json(absence);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const absence = await AbsenceService.getById(id);
	if (!absence) return NextResponse.json({ error: "Absence introuvable" }, { status: 404 });
	await AbsenceService.delete(id, currentUser.id);
	return NextResponse.json({ success: true });
}
