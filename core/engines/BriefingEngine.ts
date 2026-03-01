import { DatabaseManager } from "@/managers/DatabaseManager";


export interface BriefingPayload {
	activeProjects: number;
	dueTasks: number;
	upcomingMeetings: number;
	pendingAbsences: number;
	recentLogs: number;
}

export class BriefingEngine {
	/**
	 * Generates a consolidated briefing for a group and user
	 * @param groupId - The group to generate briefing for
	 * @param userId - The user requesting the briefing
	 * @returns Aggregated briefing payload
	 */
	static async generate(groupId: string, userId: string): Promise<BriefingPayload> {
		// Fetch data in parallel from DatabaseManager
		const [projects, tasks, meetings, absences, logs] = await Promise.all([
			DatabaseManager.findProjectsByGroup(groupId),
			DatabaseManager.findTasksByUser(userId),
			DatabaseManager.findMeetingsByGroup(groupId),
			DatabaseManager.findAbsencesByUser(userId),
			DatabaseManager.findRecentLogs(10),
		]);

		const now = new Date();
		return {
			activeProjects: projects.filter((p) => p.status === "in_progress").length,
			dueTasks: tasks.filter((t) => t.status !== "done" && t.dueDate && new Date(t.dueDate) <= now).length,
			upcomingMeetings: meetings.filter((m) => new Date(m.date) >= now).length,
			pendingAbsences: absences.filter((a) => a.status === "pending").length,
			recentLogs: logs.length,
		};
	}
}
