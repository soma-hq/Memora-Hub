import { NextRequest, NextResponse } from "next/server";
import { LogService } from "@/services/LogService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { searchParams } = new URL(request.url);
	const limit = parseInt(searchParams.get("limit") ?? "50", 10);
	const userId = searchParams.get("userId");
	if (userId) {
		const logs = await LogService.getByUser(userId, limit);
		return NextResponse.json({ logs });
	}
	const logs = await LogService.getRecent(limit);
	return NextResponse.json({ logs });
}
