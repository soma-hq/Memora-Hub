import { NextRequest, NextResponse } from "next/server";
import { TrainingService } from "@/services/TrainingService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { searchParams } = new URL(request.url);
	const groupId = searchParams.get("groupId");
	if (!groupId) return NextResponse.json({ error: "groupId requis" }, { status: 400 });
	const page = parseInt(searchParams.get("page") ?? "1", 10);
	const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
	const result = await TrainingService.getByGroup(groupId, page, pageSize);
	return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const body = await request.json();
	const { groupId, title, description, category, instructorName, startDate, endDate, maxParticipants, materials } =
		body;
	if (!groupId || !title || !description || !category || !instructorName || !startDate || !endDate) {
		return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
	}
	const training = await TrainingService.create(
		{ groupId, title, description, category, instructorName, startDate, endDate, maxParticipants, materials },
		currentUser.id,
	);
	return NextResponse.json(training, { status: 201 });
}
