import { cn } from "@/lib/utils/cn";


interface SkeletonProps {
	className?: string;
	variant?: "text" | "circular" | "rectangular";
	width?: string;
	height?: string;
}

/**
 * Loading skeleton shape.
 * @param {SkeletonProps} props - Component props
 * @param {string} [props.className] - Extra CSS classes
 * @param {"text" | "circular" | "rectangular"} [props.variant="text"] - Shape variant
 * @param {string} [props.width] - Custom CSS width
 * @param {string} [props.height] - Custom CSS height
 * @returns {JSX.Element} Pulsing skeleton shape
 */

export function Skeleton({ className, variant = "text", width, height }: SkeletonProps) {
	return (
		<div
			className={cn(
				"animate-pulse bg-gray-200 dark:bg-gray-700",
				variant === "text" && "h-4 rounded",
				variant === "circular" && "rounded-full",
				variant === "rectangular" && "rounded-lg",
				className,
			)}
			style={{ width, height }}
		/>
	);
}

/**
 * Card skeleton.
 * @returns {JSX.Element} Card skeleton layout
 */

export function SkeletonCard() {
	return (
		<div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
			<div className="mb-4 flex items-center gap-3">
				<Skeleton variant="circular" className="h-10 w-10" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-3 w-1/2" />
				</div>
			</div>
			<Skeleton className="mb-2 h-3 w-full" />
			<Skeleton className="h-3 w-5/6" />
		</div>
	);
}

/**
 * Table row skeleton.
 * @param {{ rows?: number }} props - Component props
 * @param {number} [props.rows=5] - Number of skeleton rows
 * @returns {JSX.Element} Table skeleton layout
 */

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
	return (
		<div className="space-y-3">
			{Array.from({ length: rows }).map((_, i) => (
				<div
					key={i}
					className="flex items-center gap-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
				>
					<Skeleton variant="circular" className="h-8 w-8" />
					<Skeleton className="h-4 flex-1" />
					<Skeleton className="h-5 w-16 rounded-full" />
					<Skeleton className="h-5 w-20 rounded-full" />
				</div>
			))}
		</div>
	);
}
