"use client";

// Components
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { TimelineEntry, TimelineAction } from "../types";
import type { IconName } from "@/core/design/icons";


interface ProjectTimelineProps {
	timeline: TimelineEntry[];
}

/** Icon mapping for timeline action types */
const ACTION_ICON: Record<TimelineAction, IconName> = {
	project_created: "plus",
	description_added: "document",
	description_modified: "edit",
	description_removed: "close",
	deadline_added: "calendar",
	deadline_modified: "calendar",
	deadline_removed: "close",
	priority_added: "flag",
	priority_modified: "flag",
	priority_removed: "close",
	responsible_added: "profile",
	responsible_modified: "profile",
	responsible_removed: "close",
	assistant_added: "users",
	assistant_removed: "close",
	communication_validated: "check",
	status_changed: "sparkles",
	relation_added: "folder",
	relation_removed: "close",
};

/** Color mapping for timeline action categories */
const ACTION_COLOR: Record<string, string> = {
	added: "bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-500",
	modified: "bg-info-100 text-info-600 dark:bg-info-900/30 dark:text-info-500",
	removed: "bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-500",
	validated: "bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-500",
	created: "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-500",
	changed: "bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-500",
};

/**
 * Determines the action color category from a timeline action string.
 * @param {TimelineAction} action - Timeline action type
 * @returns {string} CSS class string for the action color
 */
function getActionColor(action: TimelineAction): string {
	if (action.includes("removed")) return ACTION_COLOR.removed;
	if (action.includes("modified")) return ACTION_COLOR.modified;
	if (action.includes("added")) return ACTION_COLOR.added;
	if (action.includes("validated")) return ACTION_COLOR.validated;
	if (action.includes("created")) return ACTION_COLOR.created;
	if (action.includes("changed")) return ACTION_COLOR.changed;
	return ACTION_COLOR.created;
}

/**
 * Vertical chronological timeline showing all project activity logs.
 * @param {ProjectTimelineProps} props - Timeline entries sorted by most recent
 * @returns {JSX.Element} Vertical timeline component
 */
export function ProjectTimeline({ timeline }: ProjectTimelineProps) {
	// Sort by timestamp descending (most recent first)
	const sorted = [...timeline].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

	if (sorted.length === 0) {
		return (
			<div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 py-12 dark:border-gray-600">
				<p className="text-sm text-gray-400 dark:text-gray-500">Aucune activite enregistree</p>
			</div>
		);
	}

	// Render
	return (
		<div className="relative">
			{/* Vertical line */}
			<div className="absolute top-0 left-4 h-full w-px bg-gray-200 dark:bg-gray-700" />

			<div className="space-y-4">
				{sorted.map((entry) => {
					const icon = ACTION_ICON[entry.action] ?? "info";
					const colorClass = getActionColor(entry.action);

					return (
						<div key={entry.id} className="relative flex gap-4 pl-1">
							{/* Icon circle */}
							<div
								className={cn(
									"relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
									colorClass,
								)}
							>
								<Icon name={icon} size="xs" />
							</div>

							{/* Content */}
							<div className="min-w-0 flex-1 pb-1">
								<p className="text-sm text-gray-700 dark:text-gray-200">{entry.description}</p>
								<div className="mt-1 flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500">
									<span className="flex items-center gap-1">
										<Icon name="profile" size="xs" />
										{entry.user}
									</span>
									<span>
										{new Date(entry.timestamp).toLocaleDateString("fr-FR", {
											day: "numeric",
											month: "short",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</div>

								{/* Metadata tags */}
								{entry.metadata && (
									<div className="mt-1.5 flex flex-wrap gap-1">
										{Object.entries(entry.metadata).map(([key, value]) => (
											<span
												key={key}
												className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] text-gray-600 dark:bg-gray-700 dark:text-gray-300"
											>
												{key}: {value}
											</span>
										))}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
