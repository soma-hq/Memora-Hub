"use client";

// React
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


interface StreamerOverlayProps {
	isVisible: boolean;
	isActive: boolean;
	onComplete: () => void;
}

/**
 * Full-screen animated overlay shown when toggling streamer mode.
 * @param {StreamerOverlayProps} props - Component props
 * @param {boolean} props.isVisible - Whether the overlay should play
 * @param {boolean} props.isActive - True when activating, false when deactivating
 * @param {() => void} props.onComplete - Callback fired after the animation finishes
 * @returns {JSX.Element | null} Overlay element or null when animation is done
 */
export function StreamerOverlay({ isVisible, isActive, onComplete }: StreamerOverlayProps) {
	// State
	const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "done">("done");

	useEffect(() => {
		if (!isVisible) return;

		setPhase("enter");
		const holdTimer = setTimeout(() => setPhase("hold"), 300);
		const exitTimer = setTimeout(() => setPhase("exit"), 1800);
		const doneTimer = setTimeout(() => {
			setPhase("done");
			onComplete();
		}, 2400);

		return () => {
			clearTimeout(holdTimer);
			clearTimeout(exitTimer);
			clearTimeout(doneTimer);
		};
	}, [isVisible, onComplete]);

	if (phase === "done") return null;

	// Render
	return (
		<div
			className={cn(
				"fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500",
				phase === "enter" && "opacity-0",
				phase === "hold" && "opacity-100",
				phase === "exit" && "opacity-0",
			)}
		>
			{/* Backdrop */}
			<div
				className={cn(
					"absolute inset-0 transition-all duration-500",
					isActive ? "bg-purple-950/80 backdrop-blur-md" : "bg-gray-950/60 backdrop-blur-sm",
				)}
			/>

			{/* Content */}
			<div
				className={cn(
					"relative flex flex-col items-center gap-6 transition-all duration-500",
					phase === "enter" && "scale-75 opacity-0",
					phase === "hold" && "scale-100 opacity-100",
					phase === "exit" && "scale-110 opacity-0",
				)}
			>
				{/* Chain links + padlock */}
				<div className="flex items-center gap-0">
					{/* Left chain */}
					<div className="flex items-center gap-1">
						{[0, 1, 2].map((i) => (
							<div
								key={`l-${i}`}
								className={cn(
									"h-3 w-6 rounded-full border-2 transition-all",
									isActive ? "border-purple-400/60" : "border-gray-400/40",
								)}
								style={{ animationDelay: `${i * 100}ms` }}
							/>
						))}
					</div>

					{/* Padlock */}
					<div
						className={cn(
							"mx-2 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500",
							isActive
								? "bg-purple-500 shadow-lg shadow-purple-500/40"
								: "bg-gray-500 shadow-lg shadow-gray-500/30",
						)}
					>
						<Icon
							name="lock"
							style="solid"
							size="lg"
							className={cn("transition-all duration-500", isActive ? "text-white" : "text-gray-200")}
						/>
					</div>

					{/* Right chain */}
					<div className="flex items-center gap-1">
						{[0, 1, 2].map((i) => (
							<div
								key={`r-${i}`}
								className={cn(
									"h-3 w-6 rounded-full border-2 transition-all",
									isActive ? "border-purple-400/60" : "border-gray-400/40",
								)}
								style={{ animationDelay: `${i * 100}ms` }}
							/>
						))}
					</div>
				</div>

				{/* Status text */}
				<div className="text-center">
					<p
						className={cn(
							"text-2xl font-bold tracking-wide",
							isActive ? "text-purple-200" : "text-gray-200",
						)}
					>
						{isActive ? "Mode Streamer active" : "Mode Streamer desactive"}
					</p>
					<p className={cn("mt-2 text-sm", isActive ? "text-purple-300/70" : "text-gray-400/70")}>
						{isActive
							? "Les informations sensibles sont masquees"
							: "Toutes les informations sont visibles"}
					</p>
				</div>
			</div>
		</div>
	);
}
