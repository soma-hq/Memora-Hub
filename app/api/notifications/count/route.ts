import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/services/NotificationService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const count = await NotificationService.countUnread(currentUser.id);
	return NextResponse.json({ count });
}
