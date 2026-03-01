"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils/cn";


/**
 * Streamer mode toggle button.
 * @returns {JSX.Element} Streamer mode button
 */

export function StreamerModePopover() {
	// State
	const streamerMode = useUIStore((s) => s.streamerMode);
	const toggleStreamerMode = useUIStore((s) => s.toggleStreamerMode);
	const setStreamerMode = useUIStore((s) => s.setStreamerMode);
	const [showOverlay, setShowOverlay] = useState(false);
	const [overlayText, setOverlayText] = useState("");
	const streamRef = useRef<MediaStream | null>(null);

	// Auto-detect screen share via Display Media API
	useEffect(() => {
		/**
		 * Detects screen share start/stop.
		 */

		const original = navigator.mediaDevices?.getDisplayMedia?.bind(navigator.mediaDevices);
		if (!original) return;

		const patched = async function (constraints?: DisplayMediaStreamOptions) {
			const stream = await original(constraints);
			streamRef.current = stream;
			setStreamerMode(true);

			stream.getTracks().forEach((track) => {
				track.addEventListener("ended", () => {
					streamRef.current = null;
					setStreamerMode(false);
				});
			});

			return stream;
		};

		navigator.mediaDevices.getDisplayMedia = patched;

		return () => {
			navigator.mediaDevices.getDisplayMedia = original;
		};
	}, [setStreamerMode]);

	// Handlers

	/**
	 * Toggles streamer mode on double-click.
	 */

	const handleDoubleClick = useCallback(() => {
		const next = !streamerMode;
		setOverlayText(next ? "Mode Streamer" : "Mode Streamer désactivé");
		setShowOverlay(true);

		setTimeout(() => {
			toggleStreamerMode();
		}, 200);

		setTimeout(() => {
			setShowOverlay(false);
		}, 1200);
	}, [streamerMode, toggleStreamerMode]);

	// Render
	return (
		<>
			{/* Central activation overlay */}
			{showOverlay && (
				<div className="animate-fade-in pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
					<div
						className={cn(
							"flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-2xl backdrop-blur-md",
							streamerMode
								? "border-gray-200/50 bg-white/80 dark:border-gray-700/50 dark:bg-gray-900/80"
								: "border-teal-200/50 bg-teal-50/80 dark:border-teal-900/50 dark:bg-teal-950/80",
						)}
					>
						<Icon
							name="eye"
							style="solid"
							size="lg"
							className={cn(
								"transition-colors duration-300",
								streamerMode ? "text-gray-400" : "text-teal-500",
							)}
						/>
						<div>
							<p
								className={cn(
									"text-sm font-bold",
									streamerMode
										? "text-gray-700 dark:text-gray-200"
										: "text-teal-700 dark:text-teal-300",
								)}
							>
								{overlayText}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{streamerMode ? "Données visibles" : "Données sensibles masquées"}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Trigger button — double-click to toggle */}
			<div className="relative">
				<button
					onDoubleClick={handleDoubleClick}
					title="Double-cliquez pour basculer le mode Streamer"
					className={cn(
						"relative rounded-lg p-2 transition-all duration-300 select-none",
						streamerMode
							? "text-teal-500 dark:text-teal-400"
							: "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
					)}
				>
					<Icon name="eye" size="md" />
				</button>

				{/* Teal wave rings when active */}
				{streamerMode && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						<span className="animate-wave-ring absolute h-4 w-4 rounded-full border-2 border-teal-400 dark:border-teal-500" />
						<span className="animate-wave-ring-delay-1 absolute h-4 w-4 rounded-full border-2 border-teal-400 dark:border-teal-500" />
					</div>
				)}
			</div>
		</>
	);
}
