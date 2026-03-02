"use client";

import { ChevronRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import { StyledEmptyState, SectionHeaderBanner } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { ActionItem } from "../utils/briefing-engine";

// Urgency styling

const URGENCY_STYLES: Record<
	ActionItem["urgency"],
	{ border: string; badge: string; badgeText: string; label: string }
> = {
	urgent: {
		border: "border-l-red-500",
		badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
		badgeText: "Urgent",
		label: "Urgent",
	},
	soon: {
		border: "border-l-amber-400",
		badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
		badgeText: "Bientot",
		label: "Bientot",
	},
	later: {
		border: "border-l-gray-300 dark:border-l-gray-600",
		badge: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
		badgeText: "Plus tard",
		label: "Plus tard",
	},
};

/** Props for the PendingActions component */
interface PendingActionsProps {
	items: ActionItem[];
}

/**
 * Displays action items that need the user's attention.
 * @param {PendingActionsProps} props - Component props
 * @param {ActionItem[]} props.items - Action items to display
 * @returns {JSX.Element} Pending actions widget
 */

export function PendingActions({ items }: PendingActionsProps) {
	const urgentCount = items.filter((i) => i.urgency === "urgent").length;

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
			{/* Header */}
			<SectionHeaderBanner icon="alert" title="Actions en attente" accentColor="rose">
				{urgentCount > 0 && (
					<span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
						{urgentCount} urgent{urgentCount > 1 ? "s" : ""}
					</span>
				)}
			</SectionHeaderBanner>

			{/* Empty state */}
			{items.length === 0 && (
				<StyledEmptyState
					icon="alert"
					title="Aucune action en attente"
					description="Tout est à jour, rien ne requiert votre attention."
				/>
			)}

			{/* Action items */}
			{items.length > 0 && (
				<div className="space-y-2">
					{items.map((item) => {
						const style = URGENCY_STYLES[item.urgency];

						return (
							<div
								key={item.id}
								className={cn(
									"group flex items-center gap-3 rounded-xl border border-l-4 bg-white p-3 transition-all duration-200",
									"hover:-translate-y-0.5 hover:shadow-md",
									"dark:border-gray-700 dark:bg-gray-800/60",
									style.border,
								)}
							>
								{/* Content */}
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
									{item.dueDate && (
										<div className="mt-0.5 flex items-center gap-1">
											<ClockIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
											<span className="text-xs text-gray-400 dark:text-gray-500">
												{item.dueDate}
											</span>
										</div>
									)}
								</div>

								{/* Urgency badge */}
								<span
									className={cn(
										"flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
										style.badge,
									)}
								>
									{style.badgeText}
								</span>

								{/* Link arrow */}
								{item.link && (
									<div className="flex-shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
										<ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
