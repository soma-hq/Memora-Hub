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
			<div className="absolute inset-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-teal-200/70 bg-gradient-to-r from-teal-50 via-cyan-50 to-slate-100 dark:border-teal-800/50 dark:from-teal-950/45 dark:via-cyan-950/35 dark:to-slate-900">
				<div className="absolute inset-0 opacity-35">
					<div className="h-full w-full bg-[linear-gradient(135deg,transparent_0%,transparent_42%,rgba(20,184,166,0.22)_42%,rgba(20,184,166,0.22)_52%,transparent_52%,transparent_100%)] bg-[length:22px_22px]" />
				</div>

				<div className="relative flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-white/85 px-3 py-1.5 shadow-sm dark:border-teal-700/60 dark:bg-slate-900/80">
					<Icon name="lock" size="sm" className="text-teal-600 dark:text-teal-300" />
					<span className="text-[11px] font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-200">
						Mode Streamer
					</span>
				</div>
			</div>
		</div>
	);
}
