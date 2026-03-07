/**
 * Legacy-specific design tokens for orange pastel theme.
 * All Legacy pages should import from this file for consistent styling.
 */

/** Core accent colors for Legacy mode (orange pastel) */
export const LEGACY_ACCENT = {
	primary: "orange" as const,
	pastel: "orange-pastel" as const,
} as const;

/** Orange pastel section header tokens */
export const LEGACY_SECTION = {
	headerBg: "bg-orange-50/60 dark:bg-orange-950/10",
	headerBorder: "border-orange-200/40 dark:border-orange-800/30",
	iconBg: "bg-orange-100 dark:bg-orange-900/30",
	iconColor: "text-orange-400 dark:text-orange-300",
	titleColor: "text-orange-600 dark:text-orange-400",
	descriptionColor: "text-orange-400/80 dark:text-orange-500/80",
} as const;

/** Orange pastel stat cards */
export const LEGACY_STAT_CARD = {
	border: "border-orange-200/50 dark:border-orange-800/30",
	borderHover: "hover:border-orange-300 dark:hover:border-orange-700",
	iconBg: "bg-orange-100 dark:bg-orange-900/20",
	iconColor: "text-orange-500",
	count: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
} as const;

/** Orange pastel collapsible categories */
export const LEGACY_CATEGORY = {
	expanded: "border-orange-200 bg-orange-50/30 dark:border-orange-800/40 dark:bg-orange-900/5",
	collapsed: "border-gray-200/60 bg-transparent dark:border-gray-700/40",
	divider: "border-orange-100 dark:border-orange-900/20",
	expandedTitle: "text-orange-700 dark:text-orange-400",
	expandedIconBg: "bg-orange-100 dark:bg-orange-900/30",
	expandedIcon: "text-orange-500",
} as const;

/** Orange pastel navigation link items */
export const LEGACY_LINK = {
	base: "group flex items-center gap-3 rounded-xl border border-gray-200/60 p-4 transition-all duration-200 bg-white hover:border-orange-200 hover:shadow-md dark:border-gray-700/40 dark:bg-gray-800/60 dark:hover:border-orange-700",
	iconBg: "flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 transition-colors group-hover:bg-orange-100 dark:bg-orange-900/10 dark:group-hover:bg-orange-900/20",
	iconColor: "text-orange-500",
} as const;

/** Orange pastel empty state border */
export const LEGACY_EMPTY = {
	border: "border-orange-200/60 dark:border-orange-800/30",
} as const;

/** Orange pastel badge for Legacy mode indicator */
export const LEGACY_BADGE = {
	bg: "bg-orange-100 dark:bg-orange-900/30",
	text: "text-orange-600 dark:text-orange-400",
} as const;
