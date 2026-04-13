"use client";

import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/display/icon";
import type { IconName } from "@/core/design/icons";
import { useModePalette } from "@/hooks/useModePalette";
import { container } from "@/core/container";

// Props for the SectionHeaderBanner component
interface SectionHeaderBannerProps {
	icon: IconName;
	title: string;
	description?: string;
	accentColor?: "red" | "orange" | "primary" | "rose" | "gray" | "orange-pastel" | "red-pastel" | "rose-pastel";
	children?: React.ReactNode;
	className?: string;
}

// Accent color mapping
const ACCENT = {
	red: {
		bg: "bg-red-500 dark:bg-red-600",
		icon: "text-white/90",
		title: "text-white",
		desc: "text-white/70",
	},
	orange: {
		bg: "bg-orange-500 dark:bg-orange-600",
		icon: "text-white/90",
		title: "text-white",
		desc: "text-white/70",
	},
	primary: {
		bg: "bg-primary-500 dark:bg-primary-600",
		icon: "text-white/90",
		title: "text-white",
		desc: "text-white/70",
	},
	rose: {
		bg: "bg-rose-500 dark:bg-rose-600",
		icon: "text-white/90",
		title: "text-white",
		desc: "text-white/70",
	},
	gray: {
		bg: "bg-gray-100 dark:bg-gray-700/60",
		icon: "text-gray-500 dark:text-gray-400",
		title: "text-gray-700 dark:text-gray-200",
		desc: "text-gray-500 dark:text-gray-400",
	},
	"orange-pastel": {
		bg: "bg-orange-50 dark:bg-orange-900/20",
		icon: "text-orange-500 dark:text-orange-400",
		title: "text-orange-700 dark:text-orange-300",
		desc: "text-orange-500/80 dark:text-orange-400/80",
	},
	"red-pastel": {
		bg: "bg-red-50 dark:bg-red-900/20",
		icon: "text-red-500 dark:text-red-400",
		title: "text-red-700 dark:text-red-300",
		desc: "text-red-500/80 dark:text-red-400/80",
	},
	"rose-pastel": {
		bg: "bg-rose-50/70 dark:bg-rose-950/20",
		icon: "text-rose-500 dark:text-rose-300",
		title: "text-rose-700 dark:text-rose-100",
		desc: "text-rose-500/90 dark:text-rose-200/90",
	},
} as const;

/**
 * Supports colored and gray variants
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
	const palette = useModePalette();
	const resolvedAccent = palette.sectionAccent ?? accentColor;
	const accent = ACCENT[resolvedAccent];
	const isColoredAccent = accentColor !== "gray";
	const headerBanner = container.config.sectionBanners[palette.mode].bannerPath;

	return (
		<div className={cn("relative w-full overflow-hidden rounded-lg", accent.bg, className)}>
			{isColoredAccent && (
				<>
					<div
						className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.22]"
						style={{ backgroundImage: `url('${headerBanner}')` }}
					/>
					<div className="pointer-events-none absolute inset-0 bg-black/15 dark:bg-black/25" />
				</>
			)}

			{/* Content */}
			<div className="relative flex items-center justify-between px-4 py-2.5">
				<div className="flex items-center gap-2.5">
					<Icon name={icon} size="sm" className={accent.icon} />
					<div>
						<h2 className={cn("text-sm font-semibold", accent.title)}>{title}</h2>
						{description && <p className={cn("text-xs", accent.desc)}>{description}</p>}
					</div>
				</div>
				{children && <div className="flex items-center gap-2">{children}</div>}
			</div>
		</div>
	);
}
