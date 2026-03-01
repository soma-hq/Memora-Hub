"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardBody, Button, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Absence, AbsenceTypeValue } from "../types";
import { absenceTypeCalendarColors, absenceTypeDotColors, AbsenceTypeLabel } from "../types";


/** Weekday header labels */
const JOURS_SEMAINE = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/** Month display names */
const MOIS_NOMS = [
	"Janvier",
	"Fevrier",
	"Mars",
	"Avril",
	"Mai",
	"Juin",
	"Juillet",
	"Aout",
	"Septembre",
	"Octobre",
	"Novembre",
	"Decembre",
];

/**
 * Days in a month
 * @param year - Full year
 * @param month - Zero-based month index
 * @returns Day count
 */

function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}

/**
 * Monday-first weekday of month start
 * @param year - Full year
 * @param month - Zero-based month index
 * @returns Weekday index (0=Monday)
 */

function getFirstDayOfMonth(year: number, month: number): number {
	const day = new Date(year, month, 1).getDay();
	return day === 0 ? 6 : day - 1;
}

/**
 * Check date string matches year/month/day
 * @param dateStr - ISO date string
 * @param year - Target year
 * @param month - Target zero-based month
 * @param day - Target day
 * @returns True if dates match
 */

function isSameDay(dateStr: string, year: number, month: number, day: number): boolean {
	const d = new Date(dateStr);
	return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
}

/**
 * Check date falls within range
 * @param year - Year to check
 * @param month - Month to check
 * @param day - Day to check
 * @param startDate - Range start ISO string
 * @param endDate - Range end ISO string
 * @returns True if within range
 */

function isDateInRange(year: number, month: number, day: number, startDate: string, endDate: string): boolean {
	const current = new Date(year, month, day);
	const start = new Date(startDate);
	const end = new Date(endDate);
	start.setHours(0, 0, 0, 0);
	end.setHours(23, 59, 59, 999);
	current.setHours(12, 0, 0, 0);
	return current >= start && current <= end;
}

/** Absence types shown in the calendar legend */
const LEGEND_TYPES: AbsenceTypeValue[] = Object.keys(AbsenceTypeLabel) as AbsenceTypeValue[];

/** Props for the AbsenceCalendar component */
interface AbsenceCalendarProps {
	absences: Absence[];
	className?: string;
}

/**
 * Absence calendar
 * @param props - Component props
 * @param props.absences - Absences to display
 * @param props.className - Additional CSS classes
 * @returns Monthly calendar with absence indicators
 */

export function AbsenceCalendar({ absences, className }: AbsenceCalendarProps) {
	// State
	const today = new Date();
	const [currentYear, setCurrentYear] = useState(today.getFullYear());
	const [currentMonth, setCurrentMonth] = useState(today.getMonth());

	// Computed
	const approvedAbsences = useMemo(() => {
		return absences.filter((a) => a.status === "approved");
	}, [absences]);

	const daysInMonth = getDaysInMonth(currentYear, currentMonth);
	const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

	// Handlers
	/**
	 * Navigate to previous month
	 * @returns Nothing
	 */
	function goToPreviousMonth() {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear((y) => y - 1);
		} else {
			setCurrentMonth((m) => m - 1);
		}
	}

	/**
	 * Navigate to next month
	 * @returns Nothing
	 */
	function goToNextMonth() {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear((y) => y + 1);
		} else {
			setCurrentMonth((m) => m + 1);
		}
	}

	/**
	 * Navigate back to current month
	 * @returns Nothing
	 */
	function goToToday() {
		setCurrentYear(today.getFullYear());
		setCurrentMonth(today.getMonth());
	}

	/**
	 * Absences for a specific day
	 * @param day - Day of month
	 * @returns Matching absences array
	 */
	function getAbsencesForDay(day: number): Absence[] {
		return approvedAbsences.filter((a) => isDateInRange(currentYear, currentMonth, day, a.startDate, a.endDate));
	}

	/**
	 * Check if day is today
	 * @param day - Day of month
	 * @returns True if today
	 */
	function isToday(day: number): boolean {
		return isSameDay(today.toISOString(), currentYear, currentMonth, day);
	}

	// Render
	return (
		<Card className={className}>
			<CardHeader>
				<div className="flex items-center gap-3">
					<Icon name="calendarDays" size="md" className="text-primary-500" />
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Calendrier des absences</h2>
				</div>

				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
						<Icon name="chevronLeft" size="sm" />
					</Button>
					<button
						onClick={goToToday}
						className="hover:text-primary-600 dark:hover:text-primary-400 min-w-[160px] text-center text-sm font-medium text-gray-700 transition-colors dark:text-gray-300"
					>
						{MOIS_NOMS[currentMonth]} {currentYear}
					</button>
					<Button variant="ghost" size="sm" onClick={goToNextMonth}>
						<Icon name="chevronRight" size="sm" />
					</Button>
				</div>
			</CardHeader>

			<CardBody>
				<div className="mb-1 grid grid-cols-7 gap-px">
					{JOURS_SEMAINE.map((jour) => (
						<div
							key={jour}
							className="py-2 text-center text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
						>
							{jour}
						</div>
					))}
				</div>

				<div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
					{Array.from({ length: firstDay }).map((_, i) => (
						<div key={`empty-${i}`} className="min-h-[80px] bg-gray-50 p-1 dark:bg-gray-800/50" />
					))}

					{Array.from({ length: daysInMonth }).map((_, i) => {
						const day = i + 1;
						const dayAbsences = getAbsencesForDay(day);
						const todayHighlight = isToday(day);

						return (
							<div
								key={day}
								className={cn(
									"min-h-[80px] bg-white p-1 transition-colors dark:bg-gray-800",
									todayHighlight && "ring-primary-500 ring-2 ring-inset",
								)}
							>
								<span
									className={cn(
										"inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
										todayHighlight
											? "bg-primary-500 text-white"
											: "text-gray-700 dark:text-gray-300",
									)}
								>
									{day}
								</span>

								<div className="mt-0.5 space-y-0.5">
									{dayAbsences.slice(0, 2).map((absence) => (
										<div
											key={absence.id}
											className={cn(
												"truncate rounded px-1 py-0.5 text-[10px] leading-tight font-medium",
												absenceTypeCalendarColors[absence.type],
											)}
											title={`${absence.userName} — ${absence.type}`}
										>
											{absence.userName.split(" ")[0]}
										</div>
									))}
									{dayAbsences.length > 2 && (
										<div className="px-1 text-[10px] text-gray-400 dark:text-gray-500">
											+{dayAbsences.length - 2} autre{dayAbsences.length - 2 > 1 ? "s" : ""}
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>

				<div className="mt-4 flex flex-wrap items-center gap-4">
					<span className="text-xs font-medium text-gray-500 dark:text-gray-400">Legende :</span>
					{LEGEND_TYPES.map((type) => (
						<div key={type} className="flex items-center gap-1.5">
							<span className={cn("h-2.5 w-2.5 rounded-full", absenceTypeDotColors[type])} />
							<span className="text-xs text-gray-600 dark:text-gray-400">{AbsenceTypeLabel[type]}</span>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
