"use client";

// React
import { useMemo, useState } from "react";
import { Card, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Meeting } from "../types";
import { meetingTypeDotColors } from "../types";


/** Day name abbreviations for the calendar grid */
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;

/** Props for the CalendarWidget component */
interface CalendarWidgetProps {
	meetings: Meeting[];
	onDayClick?: (date: string) => void;
	className?: string;
}

/**
 * Returns the Monday of the week containing the given date
 * @param date - Reference date
 * @returns Monday date at midnight
 */
function getMonday(date: Date): Date {
	const d = new Date(date);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

/**
 * Formats a Date to local ISO date string (YYYY-MM-DD)
 * @param date - Date to format
 * @returns Formatted date string
 */
function toISODate(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

/**
 * Weekly calendar widget with meeting dot indicators
 * @param props - Component props
 * @param props.meetings - Array of meetings to display as dots
 * @param props.onDayClick - Callback when a day cell is clicked
 * @param props.className - Additional CSS classes
 * @returns Weekly calendar grid with navigation
 */
export function CalendarWidget({ meetings, onDayClick, className }: CalendarWidgetProps) {
	// State
	const [weekOffset, setWeekOffset] = useState(0);

	// Computed
	const weekDays = useMemo(() => {
		const today = new Date();
		const monday = getMonday(today);
		monday.setDate(monday.getDate() + weekOffset * 7);

		return Array.from({ length: 7 }, (_, i) => {
			const d = new Date(monday);
			d.setDate(monday.getDate() + i);
			return {
				date: toISODate(d),
				dayNum: d.getDate(),
				label: JOURS[i],
				isToday: toISODate(d) === toISODate(new Date()),
			};
		});
	}, [weekOffset]);

	const meetingsByDate = useMemo(() => {
		const map = new Map<string, Meeting[]>();
		for (const m of meetings) {
			const existing = map.get(m.date) ?? [];
			existing.push(m);
			map.set(m.date, existing);
		}
		return map;
	}, [meetings]);

	const weekLabel = useMemo(() => {
		if (weekDays.length === 0) return "";
		const start = new Date(weekDays[0].date);
		const end = new Date(weekDays[6].date);
		const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
		return `${start.toLocaleDateString("fr-FR", opts)} — ${end.toLocaleDateString("fr-FR", opts)} ${end.getFullYear()}`;
	}, [weekDays]);

	// Render
	return (
		<Card padding="md" className={cn("flex flex-col gap-3", className)}>
			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={() => setWeekOffset((v) => v - 1)}
					className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
					aria-label="Semaine precedente"
				>
					<Icon name="chevronLeft" size="sm" />
				</button>
				<span className="text-sm font-medium text-gray-700 dark:text-gray-300">{weekLabel}</span>
				<button
					type="button"
					onClick={() => setWeekOffset((v) => v + 1)}
					className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
					aria-label="Semaine suivante"
				>
					<Icon name="chevronRight" size="sm" />
				</button>
			</div>

			<div className="grid grid-cols-7 gap-1">
				{weekDays.map((day) => {
					const dayMeetings = meetingsByDate.get(day.date) ?? [];
					const hasMeetings = dayMeetings.length > 0;

					return (
						<button
							key={day.date}
							type="button"
							onClick={() => onDayClick?.(day.date)}
							className={cn(
								"flex flex-col items-center gap-1 rounded-lg px-1 py-2 transition-all duration-150",
								day.isToday
									? "bg-primary-50 ring-primary-200 dark:bg-primary-900/20 dark:ring-primary-800 ring-1"
									: "hover:bg-gray-50 dark:hover:bg-gray-700/50",
								onDayClick && "cursor-pointer",
							)}
						>
							<span
								className={cn(
									"text-[10px] font-medium uppercase",
									day.isToday
										? "text-primary-600 dark:text-primary-400"
										: "text-gray-400 dark:text-gray-500",
								)}
							>
								{day.label}
							</span>

							<span
								className={cn(
									"flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
									day.isToday ? "bg-primary-500 text-white" : "text-gray-700 dark:text-gray-300",
								)}
							>
								{day.dayNum}
							</span>

							<div className="flex h-2 items-center gap-0.5">
								{hasMeetings ? (
									dayMeetings
										.slice(0, 3)
										.map((m, idx) => (
											<span
												key={idx}
												className={cn("h-1.5 w-1.5 rounded-full", meetingTypeDotColors[m.type])}
												title={m.title}
											/>
										))
								) : (
									<span className="h-1.5 w-1.5" />
								)}
								{dayMeetings.length > 3 && (
									<span className="text-[8px] leading-none text-gray-400">
										+{dayMeetings.length - 3}
									</span>
								)}
							</div>
						</button>
					);
				})}
			</div>

			{(() => {
				const todayStr = toISODate(new Date());
				const todayMeetings = meetingsByDate.get(todayStr) ?? [];
				if (todayMeetings.length === 0) return null;

				return (
					<div className="mt-1 border-t border-gray-100 pt-3 dark:border-gray-700">
						<p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
							Aujourd&apos;hui — {todayMeetings.length} reunion{todayMeetings.length > 1 ? "s" : ""}
						</p>
						<div className="flex flex-col gap-1.5">
							{todayMeetings.map((m) => (
								<div
									key={m.id}
									className="flex items-center gap-2 rounded-md bg-gray-50 px-2.5 py-1.5 dark:bg-gray-700/50"
								>
									<span
										className={cn("h-2 w-2 shrink-0 rounded-full", meetingTypeDotColors[m.type])}
									/>
									<span className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
										{m.title}
									</span>
									<span className="ml-auto shrink-0 text-[10px] text-gray-400">{m.startTime}</span>
								</div>
							))}
						</div>
					</div>
				);
			})()}
		</Card>
	);
}
