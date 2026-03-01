import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/services/TaskService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const task = await TaskService.getById(id);
	if (!task) return NextResponse.json({ error: "Tache introuvable" }, { status: 404 });
	return NextResponse.json({ subtasks: task.subtasks });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const { title } = body;
	if (!title) return NextResponse.json({ error: "title requis" }, { status: 400 });
	const subtask = await TaskService.addSubtask(id, title);
	return NextResponse.json(subtask, { status: 201 });
}
