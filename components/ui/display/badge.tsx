import { cn } from "@/lib/utils/cn";
import { badgeVariants, badgeDotColors, type BadgeVariant } from "@/core/design/states";


interface BadgeProps {
	variant?: BadgeVariant;
	children: React.ReactNode;
	className?: string;
	showDot?: boolean;
}

/**
 * Status badge pill.
 * @param {BadgeProps} props - Component props
 * @param {BadgeVariant} [props.variant="neutral"] - Color variant
 * @param {React.ReactNode} props.children - Badge label content
 * @param {string} [props.className] - Extra CSS classes
 * @param {boolean} [props.showDot=true] - Show status dot
 * @returns {JSX.Element} Badge pill element
 */

export function Badge({ variant = "neutral", children, className, showDot = true }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
				badgeVariants[variant],
				className,
			)}
		>
			{showDot && <span className={cn("h-1.5 w-1.5 rounded-full", badgeDotColors[variant])} />}
			{children}
		</span>
	);
}
