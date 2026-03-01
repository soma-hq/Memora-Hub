"use client";

// React
import { useState, useCallback } from "react";
import { Icon } from "@/components/ui";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils/cn";


interface StreamerGuardProps {
	children: React.ReactNode;
	className?: string;
}

/**
 * Masks sensitive content when streamer mode is active; double-click to reveal temporarily.
 * @param {StreamerGuardProps} props - Component props
 * @param {React.ReactNode} props.children - Sensitive content to protect
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Protected or revealed content
 */
export function StreamerGuard({ children, className }: StreamerGuardProps) {
	// State
	const streamerMode = useUIStore((s) => s.streamerMode);
	const [revealed, setRevealed] = useState(false);

	// Handlers
	/**
	 * Temporarily reveals hidden content for 5 seconds on double-click.
	 * @returns {void}
	 */
	const handleDoubleClick = useCallback(() => {
		if (!streamerMode) return;
		setRevealed(true);
		setTimeout(() => setRevealed(false), 5000);
	}, [streamerMode]);

	if (!streamerMode || revealed) {
		return <>{children}</>;
	}

	// Render
	return (
		<div className={cn("relative", className)} onDoubleClick={handleDoubleClick}>
			{/* Invisible content underneath */}
			<div className="invisible" aria-hidden="true">
				{children}
			</div>

			{/* Mask overlay */}
			<div className="absolute inset-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 dark:from-purple-950/40 dark:via-purple-900/20 dark:to-purple-950/40">
				<div className="absolute inset-0 flex items-center justify-center opacity-10">
					<div className="flex items-center gap-0.5">
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								key={i}
								className="h-2 w-4 rounded-full border-2 border-purple-500 dark:border-purple-400"
							/>
						))}
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Icon name="lock" size="sm" className="text-purple-400 dark:text-purple-500" />
					<span className="text-xs font-medium text-purple-400 dark:text-purple-500">Masque</span>
				</div>
			</div>
		</div>
	);
}
