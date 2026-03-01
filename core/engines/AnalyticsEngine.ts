import { DatabaseManager } from "@/managers/DatabaseManager";


export interface DateRange {
	start: Date;
	end: Date;
}

export interface AnalyticsPayload {
	totalProjects: number;
	activeProjects: number;
	totalTasks: number;
	completedTasks: number;
	taskCompletionRate: number;
	totalMeetings: number;
	totalAbsences: number;
	pendingAbsences: number;
}

export class AnalyticsEngine {
	/**
	 * Computes aggregated metrics for a group over a date range
	 * @param groupId - The group to compute metrics for
	 * @param range - Date range for the computation period
	 * @returns Aggregated analytics payload
	 */
	static async compute(groupId: string, range: DateRange): Promise<AnalyticsPayload> {
		const [projects, meetings] = await Promise.all([
			DatabaseManager.findProjectsByGroup(groupId),
			DatabaseManager.findMeetingsByGroup(groupId),
		]);

		// Collect all tasks from projects
		let totalTasks = 0;
		let completedTasks = 0;
		for (const project of projects) {
			const tasks = await DatabaseManager.findTasksByProject(project.id);
			totalTasks += tasks.length;
			completedTasks += tasks.filter((t) => t.status === "done").length;
		}

		const filteredMeetings = meetings.filter((m) => {
			const d = new Date(m.date);
			return d >= range.start && d <= range.end;
		});

		const pendingAbsences = await DatabaseManager.findPendingAbsences();

		return {
			totalProjects: projects.length,
			activeProjects: projects.filter((p) => p.status === "in_progress").length,
			totalTasks,
			completedTasks,
			taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
			totalMeetings: filteredMeetings.length,
			totalAbsences: pendingAbsences.length, // simplified
			pendingAbsences: pendingAbsences.length,
		};
	}
}
