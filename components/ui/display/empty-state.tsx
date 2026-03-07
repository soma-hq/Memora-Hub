import { Icon } from "./icon";
import { Button } from "../actions/button";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";

type EmptyStateVariant = "full" | "outlined";

interface EmptyStateProps {
	icon?: IconName;
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
	className?: string;
	/** Visual variant: "full" (background + large icon) or "outlined" (dashed border, compact) */
	variant?: EmptyStateVariant;
}

/**
 * Empty state placeholder with two visual variants.
 * - `full` (default): background icon container, larger spacing, optional action button
 * - `outlined`: dashed border, compact, no action button
 */
export function EmptyState({
	icon = "folder",
	title,
	description,
	actionLabel,
	onAction,
	className,
	variant = "full",
}: EmptyStateProps) {
	if (variant === "outlined") {
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
					{description && <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{description}</p>}
				</div>
			</div>
		);
	}

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
