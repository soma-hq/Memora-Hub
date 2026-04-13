import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/services/ProjectService";
import { AuthService } from "@/services/AuthService";
import { updateProjectSchema } from "@/lib/validators/schemas";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const project = await ProjectService.getById(id);
	if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
	return NextResponse.json(project);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const parsed = updateProjectSchema.safeParse(body);
	if (!parsed.success)
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	const project = await ProjectService.getById(id);
	if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
	const updated = await ProjectService.update(id, parsed.data, currentUser.id);
	return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const project = await ProjectService.getById(id);
	if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
	await ProjectService.delete(id, currentUser.id);
	return NextResponse.json({ success: true });
}
