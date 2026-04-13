import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/services/TaskService";
import { AuthService } from "@/services/AuthService";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	const body = await request.json();
	const { assigneeId } = body;
	if (!assigneeId) return NextResponse.json({ error: "assigneeId requis" }, { status: 400 });
	const task = await TaskService.update(id, { assigneeId }, currentUser.id);
	return NextResponse.json(task);
}
