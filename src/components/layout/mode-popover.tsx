"use client";

import { useCallback, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";

// Color scheme for a mode popover
interface ModeColors {
	active: string;
	activeDark: string;
	overlayBorder: string;
	overlayBg: string;
	overlayIcon: string;
	overlayTitle: string;
	ringBorder: string;
}

const COLOR_SCHEMES: Record<string, ModeColors> = {
	red: {
		active: "text-red-500",
		activeDark: "dark:text-red-400",
		overlayBorder: "border-red-200/50 bg-red-50/80 dark:border-red-900/50 dark:bg-red-950/80",
		overlayBg: "border-gray-200/50 bg-white/80 dark:border-gray-700/50 dark:bg-gray-900/80",
		overlayIcon: "text-red-500",
		overlayTitle: "text-red-700 dark:text-red-300",
		ringBorder: "border-red-400 dark:border-red-500",
	},
	orange: {
		active: "text-orange-500",
		activeDark: "dark:text-orange-400",
		overlayBorder: "border-orange-200/50 bg-orange-50/80 dark:border-orange-900/50 dark:bg-orange-950/80",
		overlayBg: "border-gray-200/50 bg-white/80 dark:border-gray-700/50 dark:bg-gray-900/80",
		overlayIcon: "text-orange-500",
		overlayTitle: "text-orange-700 dark:text-orange-300",
		ringBorder: "border-orange-400 dark:border-orange-500",
	},
	teal: {
		active: "text-teal-500",
		activeDark: "dark:text-teal-400",
		overlayBorder: "border-teal-200/50 bg-teal-50/80 dark:border-teal-900/50 dark:bg-teal-950/80",
		overlayBg: "border-gray-200/50 bg-white/80 dark:border-gray-700/50 dark:bg-gray-900/80",
		overlayIcon: "text-teal-500",
		overlayTitle: "text-teal-700 dark:text-teal-300",
		ringBorder: "border-teal-400 dark:border-teal-500",
	},
};

export interface ModePopoverConfig {
	// Icon shown in the button and overlay
	icon: IconName;
	// Color scheme key
	color: "red" | "orange" | "teal";
	// Text shown in the overlay when activating
	activateLabel: string;
	// Text shown in the overlay when deactivating
	deactivateLabel: string;
	// Subtitle when activated
	activateSubtitle: string;
	// Subtitle when deactivated
	deactivateSubtitle: string;
	// Tooltip for the button
	tooltip: string;
	// Number of wave rings when active
	rings?: number;
}

interface ModePopoverProps {
	config: ModePopoverConfig;
	isActive: boolean;
	onToggle: () => void;
	// Optional delay before calling onToggle
	toggleDelay?: number;
}

// Generic mode toggle button with double-click activation and overlay animation
export function ModePopover({ config, isActive, onToggle, toggleDelay = 400 }: ModePopoverProps) {
	const [showOverlay, setShowOverlay] = useState(false);
	const [overlayText, setOverlayText] = useState("");
	const [nextActive, setNextActive] = useState(false);
	const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const colors = COLOR_SCHEMES[config.color];
	const ringCount = config.rings ?? 3;

	const handleDoubleClick = useCallback(() => {
		if (clickTimer.current) {
			clearTimeout(clickTimer.current);
			clickTimer.current = null;
		}

		const next = !isActive;
		setOverlayText(next ? config.activateLabel : config.deactivateLabel);
		setNextActive(next);
		setShowOverlay(true);

		setTimeout(() => {
			onToggle();
		}, toggleDelay);

		setTimeout(() => {
			setShowOverlay(false);
		}, 1200);
	}, [isActive, onToggle, config.activateLabel, config.deactivateLabel, toggleDelay]);

	return (
		<>
			{/* Central activation overlay */}
			{showOverlay && (
				<div className="animate-fade-in pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
					<div
						className={cn(
							"relative flex min-w-[360px] items-center gap-4 overflow-hidden rounded-2xl border px-6 py-4 shadow-2xl backdrop-blur-md",
							nextActive ? colors.overlayBorder : colors.overlayBg,
						)}
					>
						<span className={cn("absolute top-0 bottom-0 left-0 w-1.5", colors.ringBorder)} />
						<div className="relative">
							<Icon
								name={config.icon}
								style="solid"
								size="lg"
								className={cn(
									"transition-colors duration-300",
									nextActive ? colors.overlayIcon : "text-gray-400",
								)}
							/>
						</div>
						<div>
							<p className="mb-0.5 text-[10px] font-semibold tracking-[0.14em] text-gray-500 uppercase dark:text-gray-400">
								{config.color === "teal" ? "Confidentialite" : "Changement de dashboard"}
							</p>
							<p
								className={cn(
									"text-sm font-bold",
									nextActive ? colors.overlayTitle : "text-gray-700 dark:text-gray-200",
								)}
							>
								{overlayText}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{nextActive ? config.activateSubtitle : config.deactivateSubtitle}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Trigger button — double-click to toggle */}
			<div className="relative">
				<button
					onDoubleClick={handleDoubleClick}
					title={config.tooltip}
					className={cn(
						"relative rounded-lg p-2 transition-all duration-300 select-none",
						isActive
							? `${colors.active} ${colors.activeDark} shadow-[0_0_0_1px_currentColor_inset]`
							: "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
					)}
				>
					<Icon name={config.icon} size="md" />
				</button>

				{/* Wave rings when active */}
				{isActive && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						{Array.from({ length: ringCount }, (_, i) => (
							<span
								key={i}
								className={cn(
									"absolute h-4 w-4 rounded-full border-2",
									colors.ringBorder,
									i === 0 && "animate-wave-ring",
									i === 1 && "animate-wave-ring-delay-1",
									i === 2 && "animate-wave-ring-delay-2",
								)}
							/>
						))}
					</div>
				)}
			</div>
		</>
	);
}
