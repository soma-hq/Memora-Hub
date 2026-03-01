import { NextRequest, NextResponse } from "next/server";
import { MeetingService } from "@/services/MeetingService";
import { AuthService } from "@/services/AuthService";
import { updateMeetingSchema } from "@/lib/validators/schemas";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const meeting = await MeetingService.getById(id);
	if (!meeting) return NextResponse.json({ error: "Reunion introuvable" }, { status: 404 });
	return NextResponse.json(meeting);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const parsed = updateMeetingSchema.safeParse(body);
	if (!parsed.success)
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	const meeting = await MeetingService.getById(id);
	if (!meeting) return NextResponse.json({ error: "Reunion introuvable" }, { status: 404 });
	const updated = await MeetingService.update(id, parsed.data, currentUser.id);
	return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const meeting = await MeetingService.getById(id);
	if (!meeting) return NextResponse.json({ error: "Reunion introuvable" }, { status: 404 });
	await MeetingService.delete(id, currentUser.id);
	return NextResponse.json({ success: true });
}
