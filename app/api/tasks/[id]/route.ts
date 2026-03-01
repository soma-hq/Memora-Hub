import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/services/TaskService";
import { AuthService } from "@/services/AuthService";
import { updateTaskSchema } from "@/lib/validators/schemas";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const task = await TaskService.getById(id);
	if (!task) return NextResponse.json({ error: "Tache introuvable" }, { status: 404 });
	return NextResponse.json(task);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const parsed = updateTaskSchema.safeParse(body);
	if (!parsed.success)
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	const task = await TaskService.getById(id);
	if (!task) return NextResponse.json({ error: "Tache introuvable" }, { status: 404 });
	const updated = await TaskService.update(id, parsed.data, currentUser.id);
	return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const task = await TaskService.getById(id);
	if (!task) return NextResponse.json({ error: "Tache introuvable" }, { status: 404 });
	await TaskService.delete(id, currentUser.id);
	return NextResponse.json({ success: true });
}
