"use client";

// React
import { useState, useEffect } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { getLatestPatchnote, hasSeenLatestPatchnote, markPatchnoteSeen } from "../data/patchnotes";
import type { PatchnoteChange } from "../types";


/** Maps change type to a brief color token */
const TYPE_COLOR: Record<PatchnoteChange["type"], string> = {
	added: "text-success-500",
	improved: "text-info-500",
	fixed: "text-warning-500",
	removed: "text-error-500",
};

/**
 * Full-screen overlay announcing a new Memora update on first login.
 * Automatically shown when the latest patchnote hasn't been seen.
 * @returns {JSX.Element | null} Update announcement overlay or null
 */
export function UpdateAnnouncement() {
	// State
	const [visible, setVisible] = useState(false);
	const [dismissing, setDismissing] = useState(false);
	const latest = getLatestPatchnote();

	useEffect(() => {
		if (!hasSeenLatestPatchnote()) {
			const timer = setTimeout(() => setVisible(true), 500);
			return () => clearTimeout(timer);
		}
	}, []);

	// Handlers

	/**
	 * Dismisses the announcement overlay with a fade-out animation.
	 * @returns {void}
	 */
	const handleDismiss = () => {
		setDismissing(true);
		markPatchnoteSeen();
		setTimeout(() => setVisible(false), 300);
	};

	if (!visible) return null;

	// Render
	return (
		<div
			className={cn(
				"fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300",
				dismissing ? "opacity-0" : "animate-fade-in opacity-100",
			)}
		>
			<div
				className={cn(
					"mx-4 w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-800",
					dismissing ? "scale-95 opacity-0" : "animate-scale-in",
				)}
			>
				{/* Header with gradient accent */}
				<div className="from-primary-500 to-primary-700 relative overflow-hidden rounded-t-2xl bg-gradient-to-br px-6 py-8 text-center">
					<div className="absolute inset-0 bg-[url('/banners/grid-pattern.svg')] opacity-10" />
					<div className="relative">
						<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
							<Icon name="rocket" size="xs" />
							MISE A JOUR v{latest.version}
						</div>
						<h2 className="text-2xl font-bold text-white">{latest.title}</h2>
						<p className="mt-2 text-sm text-white/80">{latest.summary}</p>
					</div>
				</div>

				{/* Changes preview */}
				<div className="px-6 py-5">
					<p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
						Nouveautes
					</p>
					<div className="space-y-2">
						{latest.changes.slice(0, 6).map((change, idx) => (
							<div key={idx} className="flex items-start gap-2.5">
								<span className={cn("mt-1 text-xs", TYPE_COLOR[change.type])}>●</span>
								<span className="text-sm text-gray-600 dark:text-gray-300">{change.description}</span>
							</div>
						))}
						{latest.changes.length > 6 && (
							<p className="pl-5 text-xs text-gray-400">
								+{latest.changes.length - 6} autres changements
							</p>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
					<button
						onClick={handleDismiss}
						className="bg-primary-500 hover:bg-primary-600 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 active:scale-[0.98]"
					>
						<Icon name="rocket" size="xs" />
						C&apos;est parti !
					</button>
				</div>
			</div>
		</div>
	);
}
