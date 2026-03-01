import { Icon } from "./icon";
import { Button } from "../actions/button";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


interface EmptyStateProps {
	icon?: IconName;
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
	className?: string;
}

/**
 * Empty state placeholder.
 * @param {EmptyStateProps} props - Component props
 * @param {IconName} [props.icon="folder"] - Icon above title
 * @param {string} props.title - Heading text
 * @param {string} [props.description] - Description text
 * @param {string} [props.actionLabel] - Action button label
 * @param {() => void} [props.onAction] - Action callback
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Empty state placeholder
 */

export function EmptyState({ icon = "folder", title, description, actionLabel, onAction, className }: EmptyStateProps) {
	return (
		<div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
			<div className="mb-4 rounded-2xl bg-gray-100 p-4 dark:bg-gray-800">
				<Icon name={icon} size="xl" className="text-gray-400 dark:text-gray-600" />
			</div>
			<h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
			{description && <p className="mb-4 max-w-sm text-sm text-gray-400">{description}</p>}
			{actionLabel && onAction && (
				<Button onClick={onAction} size="sm">
					<Icon name="plus" size="xs" />
					{actionLabel}
				</Button>
			)}
		</div>
	);
}
