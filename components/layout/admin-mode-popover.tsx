"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui";
import { useUIStore } from "@/store/ui.store";
import { useHubStore } from "@/store/hub.store";
import { cn } from "@/lib/utils/cn";


/**
 * Admin mode toggle button.
 * @returns {JSX.Element} Admin mode button
 */

export function AdminModePopover() {
	// State
	const adminMode = useUIStore((s) => s.adminMode);
	const toggleAdminMode = useUIStore((s) => s.toggleAdminMode);
	const { activeGroupId } = useHubStore();
	const router = useRouter();
	const [showOverlay, setShowOverlay] = useState(false);
	const [overlayText, setOverlayText] = useState("");
	const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Handlers

	/**
	 * Toggles admin mode on double-click.
	 */

	const handleDoubleClick = useCallback(() => {
		if (clickTimer.current) {
			clearTimeout(clickTimer.current);
			clickTimer.current = null;
		}

		const next = !adminMode;
		setOverlayText(next ? "Mode Admin" : "Retour au Hub");
		setShowOverlay(true);

		setTimeout(() => {
			toggleAdminMode();
			router.push(next ? "/admin" : `/hub/${activeGroupId ?? "default"}`);
		}, 400);

		setTimeout(() => {
			setShowOverlay(false);
		}, 1200);
	}, [adminMode, toggleAdminMode, router, activeGroupId]);

	// Render
	return (
		<>
			{/* Central activation overlay */}
			{showOverlay && (
				<div className="animate-fade-in pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
					<div
						className={cn(
							"flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-2xl backdrop-blur-md",
							adminMode
								? "border-gray-200/50 bg-white/80 dark:border-gray-700/50 dark:bg-gray-900/80"
								: "border-red-200/50 bg-red-50/80 dark:border-red-900/50 dark:bg-red-950/80",
						)}
					>
						<div className="relative">
							<Icon
								name="shield"
								style="solid"
								size="lg"
								className={cn(
									"transition-colors duration-300",
									adminMode ? "text-gray-400" : "text-red-500",
								)}
							/>
						</div>
						<div>
							<p
								className={cn(
									"text-sm font-bold",
									adminMode ? "text-gray-700 dark:text-gray-200" : "text-red-700 dark:text-red-300",
								)}
							>
								{overlayText}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{adminMode ? "Mode standard" : "Administration activée"}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Trigger button — double-click to toggle */}
			<div className="relative">
				<button
					onDoubleClick={handleDoubleClick}
					title="Double-cliquez pour basculer le mode Admin"
					className={cn(
						"relative rounded-lg p-2 transition-all duration-300 select-none",
						adminMode
							? "text-red-500 dark:text-red-400"
							: "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
					)}
				>
					<Icon name="shield" size="md" />
				</button>

				{/* Red wave rings when active */}
				{adminMode && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						<span className="animate-wave-ring absolute h-4 w-4 rounded-full border-2 border-red-400 dark:border-red-500" />
						<span className="animate-wave-ring-delay-1 absolute h-4 w-4 rounded-full border-2 border-red-400 dark:border-red-500" />
						<span className="animate-wave-ring-delay-2 absolute h-4 w-4 rounded-full border-2 border-red-400 dark:border-red-500" />
					</div>
				)}
			</div>
		</>
	);
}
