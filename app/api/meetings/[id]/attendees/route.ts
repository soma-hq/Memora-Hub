import { NextRequest, NextResponse } from "next/server";
import { MeetingService } from "@/services/MeetingService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const meeting = await MeetingService.getById(id);
	if (!meeting) return NextResponse.json({ error: "Reunion introuvable" }, { status: 404 });
	return NextResponse.json({ attendees: meeting.attendees });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const { userId } = body;
	if (!userId) return NextResponse.json({ error: "userId requis" }, { status: 400 });
	await MeetingService.addAttendee(id, userId);
	return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const { userId } = body;
	if (!userId) return NextResponse.json({ error: "userId requis" }, { status: 400 });
	await MeetingService.removeAttendee(id, userId);
	return NextResponse.json({ success: true });
}
