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

// Utility classes for common patterns
export const themeClasses = {
	card: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
	cardHover: "hover:bg-gray-50 dark:hover:bg-gray-700",
	input: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white",
	page: "bg-gray-50 dark:bg-gray-900 min-h-screen",
	sidebar: "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
	header: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
	modal: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
	overlay: "bg-black/50 dark:bg-black/70 backdrop-blur-sm",
	dropdown: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg",
} as const;
