"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui";
import { useUIStore } from "@/store/ui.store";
import { useHubStore } from "@/store/hub.store";
import { cn } from "@/lib/utils/cn";

/**
 * Legacy mode toggle button with double-click activation and overlay animation.
 * @returns {JSX.Element} Legacy mode button
 */

export function LegacyModePopover() {
	// State
	const legacyMode = useUIStore((s) => s.legacyMode);
	const toggleLegacyMode = useUIStore((s) => s.toggleLegacyMode);
	const { activeGroupId } = useHubStore();
	const router = useRouter();
	const [showOverlay, setShowOverlay] = useState(false);
	const [overlayText, setOverlayText] = useState("");
	const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Handlers

	/**
	 * Toggles legacy mode on double-click.
	 */

	const handleDoubleClick = useCallback(() => {
		if (clickTimer.current) {
			clearTimeout(clickTimer.current);
			clickTimer.current = null;
		}

		const next = !legacyMode;
		setOverlayText(next ? "Mode Legacy" : "Retour au Hub");
		setShowOverlay(true);

		setTimeout(() => {
			toggleLegacyMode();
			router.push(next ? "/legacy" : `/hub/${activeGroupId ?? "default"}`);
		}, 400);

		setTimeout(() => {
			setShowOverlay(false);
		}, 1200);
	}, [legacyMode, toggleLegacyMode, router, activeGroupId]);

	// Render
	return (
		<>
			{/* Central activation overlay */}
			{showOverlay && (
				<div className="animate-fade-in pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
					<div
						className={cn(
							"flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-2xl backdrop-blur-md",
							legacyMode
								? "border-gray-200/50 bg-white/80 dark:border-gray-700/50 dark:bg-gray-900/80"
								: "border-orange-200/50 bg-orange-50/80 dark:border-orange-900/50 dark:bg-orange-950/80",
						)}
					>
						<div className="relative">
							<Icon
								name="folder"
								style="solid"
								size="lg"
								className={cn(
									"transition-colors duration-300",
									legacyMode ? "text-gray-400" : "text-orange-500",
								)}
							/>
						</div>
						<div>
							<p
								className={cn(
									"text-sm font-bold",
									legacyMode
										? "text-gray-700 dark:text-gray-200"
										: "text-orange-700 dark:text-orange-300",
								)}
							>
								{overlayText}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{legacyMode ? "Mode standard" : "Supervision activée"}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Trigger button — double-click to toggle */}
			<div className="relative">
				<button
					onDoubleClick={handleDoubleClick}
					title="Double-cliquez pour basculer le mode Legacy"
					className={cn(
						"relative rounded-lg p-2 transition-all duration-300 select-none",
						legacyMode
							? "text-orange-500 dark:text-orange-400"
							: "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
					)}
				>
					<Icon name="folder" size="md" />
				</button>

				{/* Orange wave rings when active */}
				{legacyMode && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						<span className="animate-wave-ring absolute h-4 w-4 rounded-full border-2 border-orange-400 dark:border-orange-500" />
						<span className="animate-wave-ring-delay-1 absolute h-4 w-4 rounded-full border-2 border-orange-400 dark:border-orange-500" />
						<span className="animate-wave-ring-delay-2 absolute h-4 w-4 rounded-full border-2 border-orange-400 dark:border-orange-500" />
					</div>
				)}
			</div>
		</>
	);
}
