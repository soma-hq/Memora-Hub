/** Light theme token values for backgrounds, surfaces, borders and text */

export const lightTheme = {
	background: "bg-gray-50",
	surface: "bg-white",
	surfaceHover: "bg-gray-50",
	border: "border-gray-200",
	divider: "border-gray-200",
	text: {
		primary: "text-gray-900",
		secondary: "text-gray-700",
		description: "text-gray-400",
		placeholder: "text-gray-500",
	},
} as const;

/** Dark theme token values for backgrounds, surfaces, borders and text */

export const darkTheme = {
	background: "bg-gray-900",
	surface: "bg-gray-800",
	surfaceHover: "bg-gray-700",
	border: "border-gray-600",
	divider: "border-gray-700",
	text: {
		primary: "text-white",
		secondary: "text-gray-300",
		description: "text-gray-400",
		placeholder: "text-gray-500",
	},
} as const;

/**
 * Shared utility class tokens for common UI patterns.
 * Includes cards, modals, inputs, empty states, wizard, and outline variants.
 */

export const themeClasses = {
	card: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
	cardOutline: "bg-transparent border border-gray-200 dark:border-gray-700",
	cardHover: "hover:bg-gray-50 dark:hover:bg-gray-700",
	input: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white",
	page: "bg-gray-50 dark:bg-gray-900 min-h-screen",
	sidebar: "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
	header: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
	modal: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
	overlay: "bg-black/50 dark:bg-black/70 backdrop-blur-sm",
	dropdown: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg",
	emptyState:
		"bg-gradient-to-br from-[#f0eced] via-[#f5f0f2] to-[#fce4ec40] dark:from-[#1f1a1c] dark:via-[#251e21] dark:to-[#2d1f2640] border border-gray-200/60 dark:border-gray-700/40 rounded-2xl",
	wizard: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl",
	wizardStep: "border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all duration-200",
	wizardStepActive: "border-primary-400 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/20",
	wizardBreadcrumb: "flex items-center gap-1.5",
	wizardBreadcrumbCompleted: "bg-emerald-500 text-white",
	wizardBreadcrumbCurrent: "bg-primary-500 text-white ring-2 ring-primary-200 dark:ring-primary-800",
	wizardBreadcrumbPending: "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500",
	bannerOverlay:
		"bg-cover bg-center opacity-[0.035] dark:opacity-[0.02]",
	bannerGradient:
		"bg-gradient-to-r from-white/90 to-white/60 dark:from-gray-900/90 dark:to-gray-900/60",
} as const;

/**
 * Orange accent tokens for Legacy mode.
 */

export const legacyTheme = {
	accent: "text-orange-500",
	accentBg: "bg-orange-500",
	accentLight: "bg-orange-100 dark:bg-orange-900/30",
	accentText: "text-orange-700 dark:text-orange-400",
	accentBorder: "border-orange-200 dark:border-orange-800",
	gradient:
		"bg-gradient-to-b from-orange-50/30 to-white dark:from-orange-950/10 dark:to-gray-900",
} as const;

/**
 * Red accent tokens for Owner/Admin mode.
 */

export const ownerTheme = {
	accent: "text-red-500",
	accentBg: "bg-red-500",
	accentLight: "bg-red-100 dark:bg-red-900/30",
	accentText: "text-red-700 dark:text-red-400",
	accentBorder: "border-red-200 dark:border-red-800",
	gradient:
		"bg-gradient-to-b from-red-50/30 to-white dark:from-red-950/10 dark:to-gray-900",
} as const;
