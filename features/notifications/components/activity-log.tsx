"use client";

import { useMemo } from "react";
import { Icon, Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { useActivityStore } from "@/store/activity.store";
import type { ActivityLevel } from "@/store/activity.store";
import type { IconName } from "@/core/design/icons";
import type { BadgeVariant } from "@/core/design/states";


/** UI configuration per activity level */
const levelConfig: Record<ActivityLevel, { icon: IconName; color: string; badge: BadgeVariant; label: string }> = {
	success: {
		icon: "success",
		color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
		badge: "success",
		label: "Succes",
	},
	error: {
		icon: "error",
		color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
		badge: "error",
		label: "Erreur",
	},
	warning: {
		icon: "warning",
		color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
		badge: "warning",
		label: "Attention",
	},
	info: {
		icon: "info",
		color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
		badge: "info",
		label: "Info",
	},
};

/**
 * French relative time string
 * @param timestamp - ISO timestamp string
 * @returns Relative time string
 */

function formatRelativeTime(timestamp: string): string {
	const now = new Date();
	const date = new Date(timestamp);
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60000);
	const diffH = Math.floor(diffMin / 60);
	const diffD = Math.floor(diffH / 24);

	if (diffMin < 1) return "A l'instant";
	if (diffMin < 60) return `Il y a ${diffMin} min`;
	if (diffH < 24) return `Il y a ${diffH}h`;
	if (diffD === 1) return "Hier";
	if (diffD < 7) return `Il y a ${diffD}j`;
	return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

/**
 * Group entries by date
 * @param entries - Entries with timestamps
 * @returns Date-grouped entries
 */

function groupByDate(entries: { timestamp: string }[]): { label: string; items: typeof entries }[] {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const groups: Record<string, typeof entries> = {};

	for (const entry of entries) {
		const date = new Date(entry.timestamp);
		date.setHours(0, 0, 0, 0);

		let label: string;
		if (date.getTime() === today.getTime()) label = "Aujourd'hui";
		else if (date.getTime() === yesterday.getTime()) label = "Hier";
		else label = date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

		if (!groups[label]) groups[label] = [];
		groups[label].push(entry);
	}

	return Object.entries(groups).map(([label, items]) => ({ label, items }));
}

/** Props for the ActivityLog component */
interface ActivityLogProps {
	className?: string;
	maxItems?: number;
}

/**
 * Chronological activity feed
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.maxItems - Max entries to show
 * @returns Activity feed
 */

export function ActivityLog({ className, maxItems }: ActivityLogProps) {
	// State
	const { entries, clearEntries } = useActivityStore();

	// Computed
	const displayedEntries = maxItems ? entries.slice(0, maxItems) : entries;
	const grouped = useMemo(() => groupByDate(displayedEntries), [displayedEntries]);

	if (entries.length === 0) {
		return (
			<div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
					<Icon name="clock" size="lg" className="text-gray-400" />
				</div>
				<p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">Aucune activite recente</p>
				<p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
					Les actions effectuees dans l&apos;application apparaitront ici.
				</p>
			</div>
		);
	}

	// Render
	return (
		<div className={cn("space-y-4", className)}>
			{entries.length > 5 && (
				<div className="flex justify-end px-3">
					<button
						onClick={clearEntries}
						className="text-xs text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
					>
						Effacer l&apos;historique
					</button>
				</div>
			)}

			{grouped.map((group) => (
				<div key={group.label}>
					<div className="mb-1 px-3 py-1.5">
						<span className="text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
							{group.label}
						</span>
					</div>

					<div className="relative space-y-0.5">
						{group.items.map((entry) => {
							const e = entry as (typeof entries)[0];
							const config = levelConfig[e.level];

							return (
								<div
									key={e.id}
									className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
								>
									<div
										className={cn(
											"flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
											config.color,
										)}
									>
										<Icon name={config.icon} size="sm" />
									</div>

									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-2">
											<p className="text-sm font-medium text-gray-800 dark:text-gray-200">
												{e.message}
											</p>
											{e.source && (
												<Badge
													variant="neutral"
													showDot={false}
													className="shrink-0 text-[10px]"
												>
													{e.source}
												</Badge>
											)}
										</div>

										{e.detail && (
											<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
												{e.detail}
											</p>
										)}

										<div className="mt-1 flex items-center gap-2">
											<Icon name="clock" size="xs" className="text-gray-300 dark:text-gray-600" />
											<span className="text-[11px] text-gray-400 dark:text-gray-500">
												{formatRelativeTime(e.timestamp)}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
