import { NextRequest, NextResponse } from "next/server";
import { RecruitmentService } from "@/services/RecruitmentService";
import { AuthService } from "@/services/AuthService";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const { status } = body;
	if (!status) return NextResponse.json({ error: "status requis" }, { status: 400 });
	await RecruitmentService.updateOfferStatus(id, status, currentUser.id);
	return NextResponse.json({ success: true });
}
