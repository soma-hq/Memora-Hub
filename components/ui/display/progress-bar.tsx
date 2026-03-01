import { cn } from "@/lib/utils/cn";


interface ProgressBarProps {
	value: number;
	max?: number;
	label?: string;
	showValue?: boolean;
	size?: "sm" | "md" | "lg";
	variant?: "primary" | "success" | "warning" | "error" | "info";
	className?: string;
}

const variantColors = {
	primary: "bg-primary-500",
	success: "bg-success-500",
	warning: "bg-warning-500",
	error: "bg-error-500",
	info: "bg-info-500",
} as const;

const sizeMap = {
	sm: "h-1.5",
	md: "h-2.5",
	lg: "h-4",
} as const;

/**
 * Progress bar.
 * @param {ProgressBarProps} props - Component props
 * @param {number} props.value - Current value
 * @param {number} [props.max=100] - Maximum value
 * @param {string} [props.label] - Label above bar
 * @param {boolean} [props.showValue=false] - Show percentage
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Bar height
 * @param {"primary" | "success" | "warning" | "error" | "info"} [props.variant="primary"] - Color variant
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Progress bar element
 */

export function ProgressBar({
	value,
	max = 100,
	label,
	showValue = false,
	size = "md",
	variant = "primary",
	className,
}: ProgressBarProps) {
	// Computed
	const percent = Math.min(100, Math.max(0, (value / max) * 100));

	// Render
	return (
		<div className={cn("w-full", className)}>
			{(label || showValue) && (
				<div className="mb-1.5 flex items-center justify-between">
					{label && <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>}
					{showValue && <span className="text-xs font-medium text-gray-500">{Math.round(percent)}%</span>}
				</div>
			)}
			<div className={cn("w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700", sizeMap[size])}>
				<div
					className={cn("h-full rounded-full transition-all duration-500", variantColors[variant])}
					style={{ width: `${percent}%` }}
				/>
			</div>
		</div>
	);
}
