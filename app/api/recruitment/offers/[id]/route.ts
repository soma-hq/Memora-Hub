import { NextRequest, NextResponse } from "next/server";
import { RecruitmentService } from "@/services/RecruitmentService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const offer = await RecruitmentService.getOfferById(id);
	if (!offer) return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
	return NextResponse.json(offer);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const offer = await RecruitmentService.getOfferById(id);
	if (!offer) return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
	const updated = await RecruitmentService.updateOffer(id, body, currentUser.id);
	return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const offer = await RecruitmentService.getOfferById(id);
	if (!offer) return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
	await RecruitmentService.deleteOffer(id, currentUser.id);
	return NextResponse.json({ success: true });
}
