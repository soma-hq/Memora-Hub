import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/services/NotificationService";
import { AuthService } from "@/services/AuthService";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	await NotificationService.markAsRead(id);
	return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { id } = await params;
	await NotificationService.delete(id);
	return NextResponse.json({ success: true });
}
