"use client";

// Utils & hooks
import { cn } from "@/lib/utils/cn";
import { Card, Icon } from "@/components/ui";
import { useModePalette } from "@/hooks/useModePalette";
import type { IconName } from "@/core/design/icons";

/** Props for the StatWidget component */
interface StatWidgetProps {
	label: string;
	value: number | string;
	icon: IconName;
	iconColor?: string;
	change: string;
	trend: "up" | "down" | "neutral";
	sparkline?: number[];
	className?: string;
}

/** Props for the MiniBarChart component */
interface MiniBarChartProps {
	data: number[];
	barClassName: string;
	className?: string;
}

/**
 * Renders a small bar chart for sparkline visualizations
 * @param props - Component props
 * @param props.data - Array of numeric values to visualize
 * @param props.className - Additional CSS classes
 * @returns Horizontal bar chart element
 */
function MiniBarChart({ data, barClassName, className }: MiniBarChartProps) {
	// Computed
	const max = Math.max(...data, 1);

	// Render
	return (
		<div className={cn("flex h-8 items-end gap-0.5", className)}>
			{data.map((value, idx) => (
				<div
					key={idx}
					className={cn("flex-1 rounded-sm transition-all duration-300", barClassName)}
					style={{ height: `${(value / max) * 100}%` }}
				/>
			))}
		</div>
	);
}

/** Props for the TrendIndicator component */
interface TrendIndicatorProps {
	change: string;
	trend: "up" | "down" | "neutral";
}

/**
 * Displays à trend direction arrow with a change value label
 * @param props - Component props
 * @param props.change - Change percentage or label
 * @param props.trend - Direction of the trend
 * @returns Trend indicator with colored arrow and value
 */
function TrendIndicator({ change, trend }: TrendIndicatorProps) {
	// Render
	return (
		<div className="flex items-center gap-1 text-sm">
			{trend === "up" && <Icon name="chevronUp" size="xs" className="text-success-500" />}
			{trend === "down" && <Icon name="chevronDown" size="xs" className="text-error-500" />}
			<span
				className={cn(
					"font-medium",
					trend === "up" && "text-success-600 dark:text-success-400",
					trend === "down" && "text-error-600 dark:text-error-400",
					trend === "neutral" && "text-gray-500 dark:text-gray-400",
				)}
			>
				{change}
			</span>
			<span className="text-xs text-gray-500 dark:text-gray-400">vs. mois dernier</span>
		</div>
	);
}

/**
 * Dashboard stat card with icon, value, trend indicator, and optional sparkline
 * @param props - Component props
 * @param props.label - Stat label text
 * @param props.value - Stat numeric or string value
 * @param props.icon - Icon name for the stat
 * @param props.iconColor - CSS classes for icon background and text color
 * @param props.change - Change value compared to previous period
 * @param props.trend - Direction of the trend
 * @param props.sparkline - Optional numeric data for mini bar chart
 * @param props.className - Additional CSS classes
 * @returns Stat widget card
 */
export function StatWidget({ label, value, icon, iconColor, change, trend, sparkline, className }: StatWidgetProps) {
	const palette = useModePalette();
	const defaultIconColor =
		palette.mode === "owner"
			? "bg-red-100 text-red-500 dark:bg-red-900/20"
			: palette.mode === "legacy"
				? "bg-orange-100 text-orange-500 dark:bg-orange-900/20"
				: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
	const barClassName =
		palette.mode === "owner"
			? "bg-red-300 dark:bg-red-500/40"
			: palette.mode === "legacy"
				? "bg-orange-300 dark:bg-orange-500/40"
				: "bg-slate-300 dark:bg-slate-500/40";

	// Render
	return (
		<Card padding="md" className={className}>
			<div className="flex items-start justify-between">
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm text-gray-500 dark:text-gray-400">{label}</p>
					<p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
				</div>

				<div className={cn("shrink-0 rounded-lg p-2", iconColor || defaultIconColor)}>
					<Icon name={icon} style="solid" size="lg" />
				</div>
			</div>

			<div className="mt-4 flex items-end justify-between gap-4">
				<TrendIndicator change={change} trend={trend} />
				{sparkline && sparkline.length > 0 && (
					<MiniBarChart data={sparkline} barClassName={barClassName} className="w-20 shrink-0" />
				)}
			</div>
		</Card>
	);
}
