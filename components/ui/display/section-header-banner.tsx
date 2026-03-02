"use client";

import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/display/icon";
import type { IconName } from "@/core/design/icons";

/** Props for the SectionHeaderBanner component */
interface SectionHeaderBannerProps {
	icon: IconName;
	title: string;
	description?: string;
	accentColor?: "red" | "orange" | "primary" | "rose";
	children?: React.ReactNode;
	className?: string;
}

/** Accent color mapping — solid bg + white content */
const ACCENT = {
	red: {
		bg: "bg-red-500 dark:bg-red-600",
	},
	orange: {
		bg: "bg-orange-500 dark:bg-orange-600",
	},
	primary: {
		bg: "bg-primary-500 dark:bg-primary-600",
	},
	rose: {
		bg: "bg-rose-500 dark:bg-rose-600",
	},
} as const;

/**
 * Compact full-width section header with solid accent background.
 * Icons are white, no background box. Takes full width of parent.
 * @param {SectionHeaderBannerProps} props - Component props
 * @returns {JSX.Element} Styled section header
 */

export function SectionHeaderBanner({
	icon,
	title,
	description,
	accentColor = "primary",
	children,
	className,
}: SectionHeaderBannerProps) {
	const accent = ACCENT[accentColor];

	return (
		<div className={cn("relative w-full overflow-hidden rounded-lg", accent.bg, className)}>
			{/* Content */}
			<div className="relative flex items-center justify-between px-4 py-2.5">
				<div className="flex items-center gap-2.5">
					<Icon name={icon} size="sm" className="text-white/90" />
					<div>
						<h2 className="text-sm font-semibold text-white">{title}</h2>
						{description && <p className="text-xs text-white/70">{description}</p>}
					</div>
				</div>
				{children && <div className="flex items-center gap-2">{children}</div>}
			</div>
		</div>
	);
}
