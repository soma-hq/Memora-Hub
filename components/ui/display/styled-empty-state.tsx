import { cn } from "@/lib/utils/cn";
import { Icon } from "./icon";
import type { IconName } from "@/core/design/icons";

interface StyledEmptyStateProps {
	icon: IconName;
	title: string;
	description: string;
	className?: string;
}

/**
 * Simple outline empty state box with no background design.
 * Used when there is no data to display — just an outlined container with icon and text.
 * @param {StyledEmptyStateProps} props - Component props
 * @param {IconName} props.icon - Icon displayed in the center
 * @param {string} props.title - Heading text
 * @param {string} props.description - Subtitle text shown smaller and in gray
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Simple outline empty state
 */

export function StyledEmptyState({ icon, title, description, className }: StyledEmptyStateProps) {
	return (
		<div
			className={cn(
				"rounded-xl border border-dashed border-gray-200 bg-transparent dark:border-gray-700",
				className,
			)}
		>
			<div className="flex flex-col items-center justify-center py-8 text-center">
				<Icon name={icon} size="lg" className="mb-2 text-gray-300 dark:text-gray-600" />
				<p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
				<p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{description}</p>
			</div>
		</div>
	);
}
