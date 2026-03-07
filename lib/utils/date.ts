// External libraries
import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formats a date to a readable string using the given pattern
 * @param date - ISO string or Date object
 * @param pattern - date-fns format pattern
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, pattern = "dd/MM/yyyy"): string {
	const d = typeof date === "string" ? parseISO(date) : date;
	return format(d, pattern, { locale: fr });
}

/**
 * Formats a date to a relative time string
 * @param date - ISO string or Date object
 * @returns Relative time string with suffix
 */
export function formatRelative(date: string | Date): string {
	const d = typeof date === "string" ? parseISO(date) : date;
	return formatDistanceToNow(d, { addSuffix: true, locale: fr });
}

/**
 * Formats a date with smart labels for today, yesterday and tomorrow
 * @param date - ISO string or Date object
 * @returns Smart-labeled date string with time
 */
export function formatSmart(date: string | Date): string {
	const d = typeof date === "string" ? parseISO(date) : date;
	if (isToday(d)) return `Aujourd'hui, ${format(d, "HH:mm")}`;
	if (isYesterday(d)) return `Hier, ${format(d, "HH:mm")}`;
	if (isTomorrow(d)) return `Demain, ${format(d, "HH:mm")}`;
	return format(d, "dd MMM yyyy, HH:mm", { locale: fr });
}

/**
 * Formats a start and end date as a readable range
 * @param start - Range start date
 * @param end - Range end date
 * @returns Formatted date range string
 */
export function formatDateRange(start: string | Date, end: string | Date): string {
	return `${formatDate(start)} - ${formatDate(end)}`;
}

/**
 * Returns the full month name and year for a given date
 * @param date - ISO string or Date object
 * @returns Month name with year
 */
export function getMonthName(date: string | Date): string {
	const d = typeof date === "string" ? parseISO(date) : date;
	return format(d, "MMMM yyyy", { locale: fr });
}

/**
 * Converts a date to ISO date string (YYYY-MM-DD) without timezone issues.
 * Replaces the common `.toISOString().split("T")[0]` pattern.
 * @param date - Date object or ISO string
 * @returns ISO date string (YYYY-MM-DD)
 */
export function toISODate(date: string | Date): string {
	const d = typeof date === "string" ? parseISO(date) : date;
	return format(d, "yyyy-MM-dd");
}

/**
 * Formats a date as a short day + abbreviated month (e.g. "03 mar")
 * @param date - ISO string or Date object
 * @returns Short date string
 */
export function formatShortDate(date: string | Date): string {
	const d = typeof date === "string" ? parseISO(date) : date;
	return format(d, "dd MMM", { locale: fr });
}

/**
 * Formats a date in long form (e.g. "3 mars 2026")
 * @param date - ISO string or Date object
 * @returns Long date string
 */
export function formatLongDate(date: string | Date): string {
	const d = typeof date === "string" ? parseISO(date) : date;
	return format(d, "d MMMM yyyy", { locale: fr });
}

/**
 * Formats a date with time (e.g. "03/03/2026 14:30")
 * @param date - ISO string or Date object
 * @returns Date with time string
 */
export function formatWithTime(date: string | Date): string {
	const d = typeof date === "string" ? parseISO(date) : date;
	return format(d, "dd/MM/yyyy HH:mm", { locale: fr });
}

/**
 * Formats a date as day + month name (e.g. "3 mars")
 * @param date - ISO string or Date object
 * @returns Day and month string
 */
export function formatDayMonth(date: string | Date): string {
	const d = typeof date === "string" ? parseISO(date) : date;
	return format(d, "d MMMM", { locale: fr });
}
