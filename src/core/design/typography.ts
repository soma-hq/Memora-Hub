export const fontFamily = {
	sans: ["DM Sans", "system-ui", "sans-serif"],
	serif: ["DM Serif Display", "serif"],
	mono: ["DM Mono", "monospace"],
} as const;

export const fontSize = {
	xs: "0.6875rem",
	sm: "0.875rem",
	base: "1rem",
	lg: "1.125rem",
	xl: "1.25rem",
	"2xl": "1.5rem",
	"3xl": "1.875rem",
	"4xl": "2.25rem",
} as const;

export const headingClasses = {
	h1: "text-4xl font-bold text-gray-900 dark:text-white font-serif",
	h2: "text-3xl font-bold text-gray-900 dark:text-white font-serif",
	h3: "text-2xl font-semibold text-gray-900 dark:text-white",
	h4: "text-xl font-semibold text-gray-800 dark:text-gray-100",
	h5: "text-lg font-medium text-gray-800 dark:text-gray-100",
	h6: "text-base font-medium text-gray-700 dark:text-gray-200",
} as const;

export const textClasses = {
	body: "text-base text-gray-700 dark:text-gray-300",
	bodyLarge: "text-lg text-gray-700 dark:text-gray-300",
	bodySmall: "text-sm text-gray-400 dark:text-gray-400",
	caption: "text-xs text-gray-400 dark:text-gray-500",
	label: "text-sm font-medium text-gray-700 dark:text-gray-300",
	link: "text-primary-600 hover:text-primary-700 underline",
	description: "text-sm text-gray-400 dark:text-gray-400",
} as const;
