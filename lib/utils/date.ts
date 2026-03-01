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
