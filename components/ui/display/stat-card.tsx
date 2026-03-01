import { Icon } from "./icon";
import { Card } from "./card";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


interface StatCardProps {
	label: string;
	value: string | number;
	icon?: IconName;
	change?: string;
	trend?: "up" | "down" | "neutral";
	iconColor?: string;
	className?: string;
}

/**
 * Dashboard stat card.
 * @param {StatCardProps} props - Component props
 * @param {string} props.label - Metric label
 * @param {string | number} props.value - Metric value
 * @param {IconName} [props.icon] - Top-right icon
 * @param {string} [props.change] - Change indicator text
 * @param {"up" | "down" | "neutral"} [props.trend] - Trend direction
 * @param {string} [props.iconColor] - Icon background classes
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Stat card element
 */

export function StatCard({
	label,
	value,
	icon,
	change,
	trend,
	iconColor = "bg-primary-100 text-primary-500 dark:bg-primary-900/20",
	className,
}: StatCardProps) {
	return (
		<Card padding="md" className={className}>
			<div className="flex items-start justify-between">
				<div>
					<p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
					<p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
				</div>
				{icon && (
					<div className={cn("rounded-lg p-2", iconColor)}>
						<Icon name={icon} style="solid" size="lg" />
					</div>
				)}
			</div>
			{change && (
				<div className="mt-3 flex items-center gap-1 text-sm">
					<span
						className={cn(
							trend === "up" && "text-success-600",
							trend === "down" && "text-error-600",
							trend === "neutral" && "text-gray-400",
						)}
					>
						{change}
					</span>
					<span className="text-gray-400">vs. mois dernier</span>
				</div>
			)}
		</Card>
	);
}
