import { NextRequest, NextResponse } from "next/server";
import { MeetingService } from "@/services/MeetingService";
import { AuthService } from "@/services/AuthService";
import { createMeetingSchema } from "@/lib/validators/schemas";

export async function GET(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { searchParams } = new URL(request.url);
	const groupId = searchParams.get("groupId");
	if (!groupId) return NextResponse.json({ error: "groupId requis" }, { status: 400 });
	const page = parseInt(searchParams.get("page") ?? "1", 10);
	const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
	const result = await MeetingService.getByGroup(groupId, page, pageSize);
	return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const body = await request.json();
	const { groupId, ...data } = body;
	if (!groupId) return NextResponse.json({ error: "groupId requis" }, { status: 400 });
	const parsed = createMeetingSchema.safeParse(data);
	if (!parsed.success)
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	const meeting = await MeetingService.create(groupId, parsed.data, currentUser.id);
	return NextResponse.json(meeting, { status: 201 });
}
