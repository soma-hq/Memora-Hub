import { NextRequest, NextResponse } from "next/server";
import { SearchService } from "@/services/SearchService";
import { AuthService } from "@/services/AuthService";

export async function GET(request: NextRequest) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q");
	if (!query || query.length < 2) return NextResponse.json({ error: "Requete trop courte" }, { status: 400 });
	const [users, projects, tasks, meetings, groups] = await Promise.all([
		SearchService.searchUsers(query),
		SearchService.searchProjects(query),
		SearchService.searchTasks(query),
		SearchService.searchMeetings(query),
		SearchService.searchGroups(query),
	]);
	return NextResponse.json({ users, projects, tasks, meetings, groups });
}
