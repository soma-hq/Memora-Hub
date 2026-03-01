import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/services/TaskService";
import { AuthService } from "@/services/AuthService";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; subtaskId: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { subtaskId } = await params;
	const body = await request.json();
	if (body.done !== undefined) {
		const subtask = await TaskService.toggleSubtask(subtaskId);
		if (!subtask) return NextResponse.json({ error: "Sous-tache introuvable" }, { status: 404 });
		return NextResponse.json(subtask);
	}
	return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; subtaskId: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { subtaskId } = await params;
	await TaskService.deleteSubtask(subtaskId);
	return NextResponse.json({ success: true });
}
