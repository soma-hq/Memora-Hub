"use client";

// Components
import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { planningEventTypeVariantMap, planningEventTypeLabels } from "../types";
import type { PlanningEvent } from "../types";


/** Props for the EventCard component */
interface EventCardProps {
	event: PlanningEvent;
	canEdit?: boolean;
	onEdit?: (event: PlanningEvent) => void;
	onDelete?: (eventId: string) => void;
	className?: string;
}

/**
 * Formats a date string to a full French weekday locale format
 * @param dateStr - ISO date string
 * @returns Formatted date string
 */
function formatEventDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/**
 * Planning event card with type badge, schedule, and edit/delete actions
 * @param props - Component props
 * @param props.event - Planning event data to display
 * @param props.canEdit - Whether edit and delete actions are available
 * @param props.onEdit - Callback to edit the event
 * @param props.onDelete - Callback to delete the event by ID
 * @param props.className - Additional CSS classes
 * @returns Event card with info and optional action buttons
 */
export function EventCard({ event, canEdit = false, onEdit, onDelete, className }: EventCardProps) {
	// Render
	return (
		<Card padding="sm" hover className={className}>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">{event.title}</h4>
						<Badge variant={planningEventTypeVariantMap[event.type]} showDot>
							{planningEventTypeLabels[event.type]}
						</Badge>
						{!event.isPublic && <Icon name="lock" size="xs" className="flex-shrink-0 text-gray-400" />}
					</div>

					<div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
						<span className="flex items-center gap-1">
							<Icon name="calendar" size="xs" />
							{formatEventDate(event.date)}
						</span>
						<span className="flex items-center gap-1">
							<Icon name="clock" size="xs" />
							{event.startTime} — {event.endTime}
						</span>
						{event.location && (
							<span className="flex items-center gap-1">
								<Icon name="location" size="xs" />
								{event.location}
							</span>
						)}
					</div>

					{event.description && (
						<p className="mt-2 line-clamp-2 text-xs text-gray-400 dark:text-gray-500">
							{event.description}
						</p>
					)}
				</div>

				{canEdit && (
					<div className="flex flex-shrink-0 items-center gap-1">
						<button
							onClick={() => onEdit?.(event)}
							className={cn(
								"flex h-7 w-7 items-center justify-center rounded-md",
								"text-gray-400 hover:bg-gray-100 hover:text-gray-600",
								"dark:hover:bg-gray-700 dark:hover:text-gray-300",
								"transition-all duration-200",
							)}
						>
							<Icon name="edit" size="xs" />
						</button>
						<button
							onClick={() => onDelete?.(event.id)}
							className={cn(
								"flex h-7 w-7 items-center justify-center rounded-md",
								"hover:bg-error-50 hover:text-error-600 text-gray-400",
								"dark:hover:bg-error-900/20 dark:hover:text-error-400",
								"transition-all duration-200",
							)}
						>
							<Icon name="delete" size="xs" />
						</button>
					</div>
				)}
			</div>
		</Card>
	);
}
