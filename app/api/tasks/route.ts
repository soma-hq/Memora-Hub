import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/services/TaskService";
import { AuthService } from "@/services/AuthService";
import { createTaskSchema } from "@/lib/validators/schemas";

export async function GET(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { searchParams } = new URL(request.url);
	const projectId = searchParams.get("projectId");
	const assigneeId = searchParams.get("assigneeId");
	const status = searchParams.get("status");
	const page = parseInt(searchParams.get("page") ?? "1", 10);
	const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
	if (projectId) {
		const result = await TaskService.getByProject(projectId, page, pageSize);
		return NextResponse.json(result);
	}
	if (assigneeId) {
		const tasks = await TaskService.getByAssignee(assigneeId, status ?? undefined);
		return NextResponse.json({ tasks });
	}
	const tasks = await TaskService.getByAssignee(currentUser.id, status ?? undefined);
	return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const body = await request.json();
	const parsed = createTaskSchema.safeParse(body);
	if (!parsed.success)
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	const task = await TaskService.create(currentUser.id, parsed.data);
	return NextResponse.json(task, { status: 201 });
}
