import { NextRequest, NextResponse } from "next/server";
import { RecruitmentService } from "@/services/RecruitmentService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const candidates = await RecruitmentService.getCandidatesByOffer(id);
	return NextResponse.json({ candidates });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const { name, email, avatar, userId, notes } = body;
	if (!name || !email) return NextResponse.json({ error: "name et email requis" }, { status: 400 });
	const candidate = await RecruitmentService.addCandidate(
		{ offerId: id, name, email, avatar, userId, notes },
		currentUser.id,
	);
	return NextResponse.json(candidate, { status: 201 });
}
