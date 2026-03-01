"use client";

// React
import { useMemo } from "react";
import { generateBriefing } from "./utils/briefing-engine";
import type { IconName } from "@/core/design/icons";
import type { BriefingData } from "./utils/briefing-engine";
import type { UserProfile } from "@/features/users/types";
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";
import type { Meeting } from "@/features/meetings/types";
import type { Absence } from "@/features/absences/types";


// Re-export briefing types for consumer convenience
export type { BriefingData, BriefingItem, ScheduleItem, ActionItem } from "./utils/briefing-engine";

// Briefing hook

/**
 * Generates a personal assistant briefing for the given user.
 * Returns an empty briefing until real data source is connected.
 * @param userId - The user ID to generate a briefing for
 * @returns Briefing data for the dashboard
 */
export function useDashboardBriefing(userId: string): BriefingData {
	const users: UserProfile[] = [];
	const projects: Project[] = [];
	const tasks: Task[] = [];
	const meetings: Meeting[] = [];
	const absences: Absence[] = [];

	return useMemo(
		() => generateBriefing(userId, { users, projects, tasks, meetings, absences }),
		[userId, users, projects, tasks, meetings, absences],
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
 * Returns zero values until real data source is connected.
 * @returns Dashboard stats object keyed by category
 */
export function useDashboardStats() {
	const stats = useMemo(
		() => ({
			projects: {
				label: "Projets actifs",
				value: 0,
				icon: "folder" as IconName,
				iconColor: "text-primary-500",
				trend: "neutral" as const,
				change: "0",
				sparkline: [] as number[],
			},
			tasks: {
				label: "Taches en cours",
				value: 0,
				icon: "tasks" as IconName,
				iconColor: "text-info-500",
				trend: "neutral" as const,
				change: "0",
				sparkline: [] as number[],
			},
			meetings: {
				label: "Reunions cette semaine",
				value: 0,
				icon: "calendar" as IconName,
				iconColor: "text-warning-500",
				trend: "neutral" as const,
				change: "0",
				sparkline: [] as number[],
			},
			members: {
				label: "Membres actifs",
				value: 0,
				icon: "users" as IconName,
				iconColor: "text-success-500",
				trend: "neutral" as const,
				change: "0",
				sparkline: [] as number[],
			},
		}),
		[],
	);

	return { stats, isLoading: false };
}

/**
 * Provides recent activity entries for the dashboard activity feed.
 * Returns empty array until real data source is connected.
 * @returns Array of recent activity entries
 */
export function useDashboardActivity() {
	const activities: DashboardActivity[] = useMemo(() => [], []);

	return { activities, isLoading: false };
}
