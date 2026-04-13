import { NextRequest, NextResponse } from "next/server";
import { TrainingService } from "@/services/TrainingService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const training = await TrainingService.getById(id);
	if (!training) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
	return NextResponse.json(training);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const training = await TrainingService.getById(id);
	if (!training) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
	const updated = await TrainingService.update(id, body, currentUser.id);
	return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const training = await TrainingService.getById(id);
	if (!training) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
	await TrainingService.delete(id, currentUser.id);
	return NextResponse.json({ success: true });
}
