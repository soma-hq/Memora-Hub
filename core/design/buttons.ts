import { clsx } from "clsx";


// Base classes shared by all buttons
const buttonBase =
	"inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

// Solid variants
const solidVariants = {
	primary: "bg-primary-500 text-white hover:bg-primary-600 shadow hover:shadow-md focus:ring-primary-500",
	success: "bg-success-500 text-white hover:bg-success-600 focus:ring-success-500",
	cancel: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-600",
	ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800",
} as const;

// Outline variants
const outlineVariants = {
	"outline-primary":
		"bg-transparent text-primary-600 border border-primary-400 hover:bg-primary-50 hover:border-primary-600 focus:ring-primary-500 dark:text-primary-400 dark:border-primary-500 dark:hover:bg-primary-900/10 dark:hover:border-primary-400",
	"outline-danger":
		"bg-transparent text-error-600 border border-error-300 hover:bg-error-50 hover:border-error-500 focus:ring-error-500 dark:text-error-400 dark:border-error-500 dark:hover:bg-error-900/10 dark:hover:border-error-400",
	"outline-neutral":
		"bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-500 focus:ring-gray-400 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800",
} as const;

// Soft variants
const softVariants = {
	"soft-primary":
		"bg-primary-100 text-primary-700 border border-primary-200 hover:bg-primary-200 focus:ring-primary-500 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800 dark:hover:bg-primary-900/30",
	"soft-success":
		"bg-success-100 text-success-700 border border-success-200 hover:bg-success-200 focus:ring-success-500 dark:bg-success-900/20 dark:text-success-400 dark:border-success-800 dark:hover:bg-success-900/30",
	"soft-warning":
		"bg-warning-100 text-warning-700 border border-warning-200 hover:bg-warning-200 focus:ring-warning-500 dark:bg-warning-900/20 dark:text-warning-400 dark:border-warning-800 dark:hover:bg-warning-900/30",
} as const;

// All variants merged
const allVariants = {
	...solidVariants,
	...outlineVariants,
	...softVariants,
} as const;

export type ButtonVariant = keyof typeof allVariants;

// Sizes
export const buttonSizes = {
	sm: "px-3 py-1.5 text-sm rounded-md",
	md: "px-4 py-2 text-base rounded-lg",
	lg: "px-6 py-3 text-lg rounded-lg",
	xl: "px-8 py-4 text-xl rounded-xl",
} as const;

export type ButtonSize = keyof typeof buttonSizes;

/**
 * Generate button class string
 * @param variant Button variant
 * @param size Button size
 */
export function buttonVariants({
	variant = "primary",
	size = "md",
}: {
	variant?: ButtonVariant;
	size?: ButtonSize;
} = {}) {
	return clsx(buttonBase, allVariants[variant], buttonSizes[size]);
}
