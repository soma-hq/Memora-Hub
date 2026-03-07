import { cn } from "@/lib/utils/cn";
import { themeClasses } from "@/core/design/themes";
import { Icon } from "./icon";
import type { IconName } from "@/core/design/icons";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	hover?: boolean;
	outline?: boolean;
	padding?: "sm" | "md" | "lg";
	onClick?: () => void;
}

const paddingMap = {
	sm: "p-3",
	md: "p-4",
	lg: "p-6",
} as const;

/**
 * Card container
 * @param {CardProps} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Extra CSS classes
 * @param {boolean} [props.hover=false] - Enable hover elevation
 * @param {boolean} [props.outline=false] - Outline-only mode (no background fill)
 * @param {"sm" | "md" | "lg"} [props.padding="md"] - Inner padding size
 * @param {() => void} [props.onClick] - Click handler
 * @returns {JSX.Element} Card wrapper
 */

export function Card({ children, className, hover = false, outline = false, padding = "md", onClick }: CardProps) {
	return (
		<div
			className={cn(
				"rounded-xl",
				outline
					? "border border-gray-200 bg-transparent dark:border-gray-700"
					: cn("shadow-sm", themeClasses.card),
				paddingMap[padding],
				hover && "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
				onClick && "cursor-pointer",
				className,
			)}
			onClick={onClick}
		>
			{children}
		</div>
	);
}

/**
 * Card header
 * @param {{ children: React.ReactNode; className?: string }} props - Component props
 * @param {React.ReactNode} props.children - Header content
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Card header
 */

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				"flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700",
				className,
			)}
		>
			{children}
		</div>
	);
}

/**
 * Card body
 * @param {{ children: React.ReactNode; className?: string }} props - Component props
 * @param {React.ReactNode} props.children - Body content
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Card body
 */

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
	return <div className={cn("py-4", className)}>{children}</div>;
}

/**
 * Card footer
 * @param {{ children: React.ReactNode; className?: string }} props - Component props
 * @param {React.ReactNode} props.children - Footer content
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Card footer
 */

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				"flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700",
				className,
			)}
		>
			{children}
		</div>
	);
}

// StatCard
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
 * Stat card with large value, icon badge, and optional trend indicator
 * @param {StatCardProps} props - Component props
 * @param {string} props.label - Stat label
 * @param {string | number} props.value - Stat value
 * @param {IconName} [props.icon] - Icon to display
 * @param {string} [props.change] - Change text
 * @param {"up" | "down" | "neutral"} [props.trend] - Trend direction
 * @param {string} [props.iconColor] - Icon container color classes
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Stat card
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

// SectionCard
type SectionCardColor = "primary" | "success" | "error" | "warning" | "info" | "neutral" | "orange";

const headerColorMap: Record<SectionCardColor, string> = {
	primary: "bg-primary-500 dark:bg-primary-600",
	success: "bg-success-600 dark:bg-success-700",
	error: "bg-error-500 dark:bg-error-600",
	warning: "bg-warning-500 dark:bg-warning-600",
	info: "bg-info-500 dark:bg-info-600",
	neutral: "bg-gray-500 dark:bg-gray-600",
	orange: "bg-orange-500 dark:bg-orange-600",
};

interface SectionCardProps {
	title: string;
	icon?: IconName;
	badge?: React.ReactNode;
	action?: React.ReactNode;
	children: React.ReactNode;
	color?: SectionCardColor;
	padding?: "sm" | "md" | "lg";
	className?: string;
}

/**
 * Section card with colored header strip, icon, title, and optional badge/action
 * @param {SectionCardProps} props - Component props
 * @param {string} props.title - Section title
 * @param {IconName} [props.icon] - Header icon
 * @param {React.ReactNode} [props.badge] - Badge element next to title
 * @param {React.ReactNode} [props.action] - Action element in header right
 * @param {React.ReactNode} props.children - Section content
 * @param {SectionCardColor} [props.color="primary"] - Header accent color
 * @param {"sm" | "md" | "lg"} [props.padding="md"] - Body padding
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Section card
 */

export function SectionCard({
	title,
	icon,
	badge,
	action,
	children,
	color = "primary",
	padding = "md",
	className,
}: SectionCardProps) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800",
				className,
			)}
		>
			<div className={cn("flex items-center justify-between px-4 py-3", headerColorMap[color])}>
				<div className="flex items-center gap-2.5">
					{icon && <Icon name={icon} size="sm" className="shrink-0 text-white" />}
					<span className="text-sm font-semibold text-white">{title}</span>
					{badge && <span className="ml-0.5">{badge}</span>}
				</div>
				{action && <div className="shrink-0">{action}</div>}
			</div>
			<div className={cn(paddingMap[padding])}>{children}</div>
		</div>
	);
}
