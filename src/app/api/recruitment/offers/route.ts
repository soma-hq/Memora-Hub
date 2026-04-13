import { NextRequest, NextResponse } from "next/server";
import { RecruitmentService } from "@/services/RecruitmentService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { searchParams } = new URL(request.url);
	const groupId = searchParams.get("groupId");
	if (!groupId) return NextResponse.json({ error: "groupId requis" }, { status: 400 });
	const page = parseInt(searchParams.get("page") ?? "1", 10);
	const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
	const result = await RecruitmentService.getOffersByGroup(groupId, page, pageSize);
	return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const body = await request.json();
	const { groupId, title, description, department, location, contractType, requirements } = body;
	if (!groupId || !title || !description || !department || !location || !contractType) {
		return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
	}
	const offer = await RecruitmentService.createOffer(
		{ groupId, title, description, department, location, contractType, requirements },
		currentUser.id,
	);
	return NextResponse.json(offer, { status: 201 });
}
