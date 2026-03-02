/**
 * Legacy-specific design tokens (orange pastel).
 * Called by Legacy pages to apply consistent orange pastel styling.
 */

/** Orange pastel accent tokens for Legacy mode section headers */
export const legacySectionColors = {
	headerBg: "bg-orange-50/60 dark:bg-orange-950/10",
	headerBorder: "border-orange-200/40 dark:border-orange-800/30",
	iconBg: "bg-orange-100 dark:bg-orange-900/30",
	iconColor: "text-orange-400 dark:text-orange-300",
	titleColor: "text-orange-600 dark:text-orange-400",
	descriptionColor: "text-orange-400/80 dark:text-orange-500/80",
	statBorder: "border-orange-200/50 dark:border-orange-800/30",
	statIconBg: "bg-orange-100 dark:bg-orange-900/20",
	statIconColor: "text-orange-400",
	statHover: "hover:border-orange-300 dark:hover:border-orange-700",
	categoryExpanded: "border-orange-200 bg-orange-50/30 dark:border-orange-800/40 dark:bg-orange-900/5",
	categoryCollapsed: "border-gray-200/60 bg-transparent dark:border-gray-700/40",
	categoryDivider: "border-orange-100 dark:border-orange-900/20",
	linkHover: "hover:border-orange-200 hover:shadow-md dark:hover:border-orange-700",
	linkIconBg: "bg-orange-50 dark:bg-orange-900/10",
	linkIconHover: "group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20",
	badgeBg: "bg-orange-100 dark:bg-orange-900/30",
	badgeText: "text-orange-600 dark:text-orange-400",
	emptyBorder: "border-orange-200/60 dark:border-orange-800/30",
} as const;

/** Owner-specific design tokens (red pastel) */
export const ownerSectionColors = {
	headerBg: "bg-red-50/60 dark:bg-red-950/10",
	headerBorder: "border-red-200/40 dark:border-red-800/30",
	iconBg: "bg-red-100 dark:bg-red-900/30",
	iconColor: "text-red-400 dark:text-red-300",
	titleColor: "text-red-600 dark:text-red-400",
	descriptionColor: "text-red-400/80 dark:text-red-500/80",
	statBorder: "border-red-200/60 dark:border-red-900/30",
	statIconBg: "bg-red-100 dark:bg-red-900/20",
	statIconColor: "text-red-400",
	statHover: "hover:border-red-300 dark:hover:border-red-700",
	emptyBorder: "border-red-200/60 dark:border-red-800/30",
} as const;

/** Squad-specific design tokens (rose pastel) */
export const squadSectionColors = {
	headerBg: "bg-rose-50/40 dark:bg-rose-950/10",
	headerBorder: "border-rose-200/40 dark:border-rose-800/20",
	iconBg: "bg-rose-100 dark:bg-rose-900/20",
	iconColor: "text-rose-400 dark:text-rose-300",
	titleColor: "text-rose-600 dark:text-rose-400",
	descriptionColor: "text-rose-400/80 dark:text-rose-500/80",
	emptyBorder: "border-rose-200/60 dark:border-rose-800/20",
} as const;

/** Type for available mode color schemes */
export type ModeColorScheme = "squad" | "legacy" | "owner";

/**
 * Returns section color tokens for the given mode.
 * @param {ModeColorScheme} mode - The current mode
 * @returns Section color tokens
 */

export function getSectionColors(mode: ModeColorScheme) {
	switch (mode) {
		case "legacy":
			return legacySectionColors;
		case "owner":
			return ownerSectionColors;
		default:
			return squadSectionColors;
	}
}
