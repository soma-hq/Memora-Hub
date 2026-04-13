import { NextRequest, NextResponse } from "next/server";
import { TrainingService } from "@/services/TrainingService";
import { AuthService } from "@/services/AuthService";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	try {
		await TrainingService.enroll(id, currentUser.id);
		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 400 });
	}
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	await TrainingService.unenroll(id, currentUser.id);
	return NextResponse.json({ success: true });
}
