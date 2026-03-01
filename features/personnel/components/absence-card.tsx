"use client";

// Components
import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { AbsenceTimeline } from "./absence-timeline";
import { absenceStatusVariantMap } from "../types";
import type { Absence } from "../types";


/** Props for the AbsenceCard component */
interface AbsenceCardProps {
	absence: Absence;
	compact?: boolean;
	className?: string;
}

/**
 * Formats a date range as a localized French string
 * @param start - Range start ISO date
 * @param end - Range end ISO date
 * @returns Formatted date range string
 */
function formatDateRange(start: string, end: string): string {
	const startDate = new Date(start);
	const endDate = new Date(end);
	const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
	return `${startDate.toLocaleDateString("fr-FR", opts)} — ${endDate.toLocaleDateString("fr-FR", opts)}`;
}

/**
 * Formats a date string to full French locale format
 * @param dateStr - ISO date string
 * @returns Formatted date string
 */
function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Calculates the number of calendar days between two dates
 * @param start - Range start ISO date
 * @param end - Range end ISO date
 * @returns Number of days (inclusive)
 */
function getDayCount(start: string, end: string): number {
	const startDate = new Date(start);
	const endDate = new Date(end);
	const diff = endDate.getTime() - startDate.getTime();
	return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Absence request card with optional compact mode and status timeline
 * @param props - Component props
 * @param props.absence - Absence data to display
 * @param props.compact - Whether to use a compact layout
 * @param props.className - Additional CSS classes
 * @returns Absence card with date range, status, and timeline
 */
export function AbsenceCard({ absence, compact = false, className }: AbsenceCardProps) {
	// Computed
	const days = getDayCount(absence.startDate, absence.endDate);

	if (compact) {
		// Render
		return (
			<Card padding="sm" className={cn("opacity-80", className)}>
				<div className="flex items-center justify-between gap-3">
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<Icon name="calendar" size="xs" className="flex-shrink-0 text-gray-400" />
							<span className="truncate text-sm text-gray-600 dark:text-gray-300">
								{formatDateRange(absence.startDate, absence.endDate)}
							</span>
							<span className="text-xs text-gray-400">({days}j)</span>
						</div>
						<p className="mt-1 truncate text-xs text-gray-400 dark:text-gray-500">{absence.reason}</p>
					</div>
					<Badge variant={absenceStatusVariantMap[absence.status]} showDot>
						{absence.status}
					</Badge>
				</div>
			</Card>
		);
	}

	// Render
	return (
		<Card padding="md" className={className}>
			<div className="flex items-start justify-between gap-3">
				<div>
					<div className="flex items-center gap-2">
						<Icon name="calendar" size="sm" className="text-gray-500 dark:text-gray-400" />
						<span className="text-sm font-medium text-gray-900 dark:text-white">
							{formatDateRange(absence.startDate, absence.endDate)}
						</span>
					</div>
					<span className="ml-6 text-xs text-gray-400">{days} jours</span>
				</div>
				<Badge variant={absenceStatusVariantMap[absence.status]} showDot>
					{absence.status}
				</Badge>
			</div>

			<p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{absence.reason}</p>

			<div className="mt-4">
				<AbsenceTimeline
					status={absence.status}
					submittedAt={absence.submittedAt}
					respondedAt={absence.respondedAt}
				/>
			</div>

			<div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
				<Icon name="clock" size="xs" />
				<span>Soumise le {formatDate(absence.submittedAt)}</span>
			</div>
		</Card>
	);
}
