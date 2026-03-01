import { cn } from "@/lib/utils/cn";


interface DividerProps {
	label?: string;
	className?: string;
	orientation?: "horizontal" | "vertical";
}

/**
 * Separator line.
 * @param {DividerProps} props - Component props
 * @param {string} [props.label] - Center label text
 * @param {string} [props.className] - Extra CSS classes
 * @param {"horizontal" | "vertical"} [props.orientation="horizontal"] - Divider direction
 * @returns {JSX.Element} Divider element
 */

export function Divider({ label, className, orientation = "horizontal" }: DividerProps) {
	if (orientation === "vertical") {
		return <div className={cn("w-px self-stretch bg-gray-200 dark:bg-gray-700", className)} />;
	}

	if (label) {
		return (
			<div className={cn("flex items-center gap-3", className)}>
				<div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
				<span className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
					{label}
				</span>
				<div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
			</div>
		);
	}

	return <div className={cn("h-px w-full bg-gray-200 dark:bg-gray-700", className)} />;
}
