"use client";

// React
import { useMemo } from "react";
import { generateBriefing } from "./utils/briefing-engine";
import type { IconName } from "@/core/design/icons";
import type { BriefingData } from "./utils/briefing-engine";
import { MOCK_USERS, MOCK_PROJECTS, MOCK_TASKS, MOCK_MEETINGS, MOCK_ABSENCES } from "./mock-data";

// Re-export mock data and briefing types for consumer convenience
export { MOCK_USERS, MOCK_PROJECTS, MOCK_TASKS, MOCK_MEETINGS, MOCK_ABSENCES };
export type { BriefingData, BriefingItem, ScheduleItem, ActionItem } from "./utils/briefing-engine";

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Generates a personal assistant briefing for the given user.
 * Uses coherent mock data tied to test accounts.
 * @param userId - The user ID to generate a briefing for
 * @returns Briefing data for the dashboard
 */
export function useDashboardBriefing(userId: string): BriefingData {
	return useMemo(
		() =>
			generateBriefing(userId, {
				users: MOCK_USERS,
				projects: MOCK_PROJECTS,
				tasks: MOCK_TASKS,
				meetings: MOCK_MEETINGS,
				absences: MOCK_ABSENCES,
			}),
		[userId],
	);
}

// Legacy hooks (kept for backward compatibility)

/** Dashboard stat with display metadata */
export interface DashboardStat {
	label: string;
	value: number;
	icon: IconName;
	iconColor: string;
	trend: "up" | "down" | "neutral";
	change: string;
	sparkline: number[];
}

/** Dashboard activity entry for the feed */
export interface DashboardActivity {
	id: string;
	action: string;
	subject: string;
	time: string;
	actor: string;
	icon: IconName;
}

/**
 * Provides dashboard stats for the overview widgets.
 * @returns Dashboard stats object keyed by category
 */
export function useDashboardStats() {
	const stats = useMemo(
		() => ({
			projects: {
				label: "Projets actifs",
				value: MOCK_PROJECTS.filter((p) => p.status === "in_progress").length,
				icon: "folder" as IconName,
				iconColor: "text-primary-500",
				trend: "up" as const,
				change: "+1",
				sparkline: [1, 2, 2, 3, 3],
			},
			tasks: {
				label: "Taches en cours",
				value: MOCK_TASKS.filter((t) => t.status === "in_progress").length,
				icon: "tasks" as IconName,
				iconColor: "text-info-500",
				trend: "up" as const,
				change: "+2",
				sparkline: [3, 4, 3, 5, 4],
			},
			meetings: {
				label: "Reunions cette semaine",
				value: MOCK_MEETINGS.length,
				icon: "calendar" as IconName,
				iconColor: "text-warning-500",
				trend: "neutral" as const,
				change: "0",
				sparkline: [3, 4, 5, 4, 5],
			},
			members: {
				label: "Membres actifs",
				value: MOCK_USERS.filter((u) => u.status === "active").length,
				icon: "users" as IconName,
				iconColor: "text-success-500",
				trend: "up" as const,
				change: "+2",
				sparkline: [8, 8, 9, 10, 10],
			},
		}),
		[],
	);

	return { stats, isLoading: false };
}

/**
 * Provides recent activity entries for the dashboard activity feed.
 * @returns Array of recent activity entries
 */
export function useDashboardActivity() {
	const activities: DashboardActivity[] = useMemo(
		() => [
			{
				id: "act-001",
				action: "a termine",
				subject: "Mettre a jour les bots AutoMod",
				time: "Il y a 2h",
				actor: "Antwo",
				icon: "check-circle" as IconName,
			},
			{
				id: "act-002",
				action: "a cree",
				subject: "Entretien recrutement Michou",
				time: "Il y a 3h",
				actor: "Flo",
				icon: "calendar" as IconName,
			},
			{
				id: "act-003",
				action: "a commente",
				subject: "Refonte Discord Inoxtag",
				time: "Il y a 5h",
				actor: "Kevin",
				icon: "message-circle" as IconName,
			},
			{
				id: "act-004",
				action: "a demarre",
				subject: "Formations Discord Academy",
				time: "Hier",
				actor: "Shiny",
				icon: "play" as IconName,
			},
			{
				id: "act-005",
				action: "a valide l'absence de",
				subject: "Benji (03 mars)",
				time: "Hier",
				actor: "Candice",
				icon: "check" as IconName,
			},
			{
				id: "act-006",
				action: "a rejoint",
				subject: "le projet Doigby S2",
				time: "Il y a 2j",
				actor: "Andrew",
				icon: "user-plus" as IconName,
			},
		],
		[],
	);

	return { activities, isLoading: false };
}
