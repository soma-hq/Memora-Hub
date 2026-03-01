import { Icon } from "./icon";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


interface TimelineItem {
	id: string;
	icon?: IconName;
	iconColor?: string;
	title: React.ReactNode;
	description?: string;
	time: string;
}

interface TimelineProps {
	items: TimelineItem[];
	className?: string;
}

/**
 * Vertical timeline.
 * @param {TimelineProps} props - Component props
 * @param {TimelineItem[]} props.items - Ordered timeline entries
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Timeline layout
 */

export function Timeline({ items, className }: TimelineProps) {
	return (
		<div className={cn("space-y-0", className)}>
			{items.map((item, idx) => (
				<div key={item.id} className="relative flex gap-3 pb-6 last:pb-0">
					{/* Vertical line */}
					{idx < items.length - 1 && (
						<div className="absolute top-8 bottom-0 left-[15px] w-px bg-gray-200 dark:bg-gray-700" />
					)}

					{/* Icon dot */}
					<div
						className={cn(
							"z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
							item.iconColor || "bg-primary-100 dark:bg-primary-900/20",
						)}
					>
						<Icon name={item.icon || "check"} size="sm" className="text-primary-500" />
					</div>

					{/* Content */}
					<div className="min-w-0 flex-1 pt-0.5">
						<div className="text-sm text-gray-700 dark:text-gray-300">{item.title}</div>
						{item.description && <p className="mt-0.5 text-xs text-gray-400">{item.description}</p>}
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
					</div>
				</div>
			))}
		</div>
	);
}
