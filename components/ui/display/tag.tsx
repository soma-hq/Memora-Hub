"use client";

import { Icon } from "./icon";
import { cn } from "@/lib/utils/cn";


interface TagProps {
	children: React.ReactNode;
	color?: "gray" | "primary" | "success" | "error" | "warning" | "info";
	removable?: boolean;
	onRemove?: () => void;
	className?: string;
}

const colorMap = {
	gray: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
	primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
	success: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
	error: "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400",
	warning: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
	info: "bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400",
} as const;

/**
 * Colored label tag.
 * @param {TagProps} props - Component props
 * @param {React.ReactNode} props.children - Tag label content
 * @param {"gray" | "primary" | "success" | "error" | "warning" | "info"} [props.color="gray"] - Color theme
 * @param {boolean} [props.removable] - Show a close button
 * @param {() => void} [props.onRemove] - Remove callback
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Tag element
 */

export function Tag({ children, color = "gray", removable, onRemove, className }: TagProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
				colorMap[color],
				className,
			)}
		>
			{children}
			{removable && (
				<button
					onClick={onRemove}
					className="ml-0.5 rounded-sm p-0.5 transition-colors hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
				>
					<Icon name="close" size="xs" />
				</button>
			)}
		</span>
	);
}
