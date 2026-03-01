"use client";

// Components
import { Card, Badge, Icon, AvatarGroup } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Meeting } from "../types";
import { meetingTypeVariant } from "../types";


/** Props for the MeetingCard component */
interface MeetingCardProps {
	meeting: Meeting;
	onClick?: (meeting: Meeting) => void;
	className?: string;
}

/**
 * Meeting card with type badge, schedule, location, and participant avatars
 * @param props - Component props
 * @param props.meeting - Meeting data to display
 * @param props.onClick - Callback when the card is clicked
 * @param props.className - Additional CSS classes
 * @returns Meeting summary card
 */
export function MeetingCard({ meeting, onClick, className }: MeetingCardProps) {
	// Computed
	const { title, date, startTime, endTime, location, type, participants, isOnline } = meeting;

	const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
		weekday: "short",
		day: "numeric",
		month: "short",
	});

	// Render
	return (
		<Card hover padding="md" className={cn("flex flex-col gap-3", className)} onClick={() => onClick?.(meeting)}>
			<div className="flex items-start justify-between gap-3">
				<h3 className="line-clamp-2 text-sm leading-snug font-semibold text-gray-900 dark:text-white">
					{title}
				</h3>
				<Badge variant={meetingTypeVariant[type]} className="shrink-0">
					{type}
				</Badge>
			</div>

			<div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
				<span className="flex items-center gap-1.5">
					<Icon name="calendar" size="xs" className="text-gray-400" />
					{formattedDate}
				</span>
				<span className="flex items-center gap-1.5">
					<Icon name="clock" size="xs" className="text-gray-400" />
					{startTime} - {endTime}
				</span>
			</div>

			<div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
				<Icon
					name={isOnline ? "attach" : "location"}
					size="xs"
					className={cn(isOnline ? "text-info-500" : "text-gray-400")}
				/>
				<span className={cn(isOnline && "text-info-600 dark:text-info-400")}>{location}</span>
				{isOnline && (
					<span className="bg-info-50 text-info-600 dark:bg-info-900/30 dark:text-info-400 ml-1 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium">
						En ligne
					</span>
				)}
			</div>

			{participants.length > 0 && (
				<div className="flex items-center justify-between border-t border-gray-100 pt-1 dark:border-gray-700">
					<AvatarGroup
						users={participants.map((p) => ({ name: p.name, src: p.avatar ?? null }))}
						max={4}
						size="xs"
					/>
					<span className="text-[11px] text-gray-400 dark:text-gray-500">
						{participants.length} participant{participants.length > 1 ? "s" : ""}
					</span>
				</div>
			)}
		</Card>
	);
}
