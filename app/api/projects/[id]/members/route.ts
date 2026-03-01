import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/services/ProjectService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const project = await ProjectService.getById(id);
	if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
	return NextResponse.json({ members: project.members });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const { userId, role } = body;
	if (!userId) return NextResponse.json({ error: "userId requis" }, { status: 400 });
	await ProjectService.addMember(id, userId, role ?? "member");
	return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const { userId } = body;
	if (!userId) return NextResponse.json({ error: "userId requis" }, { status: 400 });
	await ProjectService.removeMember(id, userId);
	return NextResponse.json({ success: true });
}
