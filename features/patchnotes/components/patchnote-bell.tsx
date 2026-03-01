"use client";

// React
import { useState, useEffect } from "react";
import { Icon, Tooltip } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { hasSeenLatestPatchnote, markPatchnoteSeen } from "../data/patchnotes";
import { PatchnotePanel } from "./patchnote-panel";
import { useUIStore } from "@/store/ui.store";


/**
 * Bell-style icon for patchnotes displayed in the header near notification bell.
 * Shows a red dot when a new patchnote hasn't been seen yet.
 * In absence mode, shows a barred icon with tooltip.
 * @returns {JSX.Element} Patchnote bell button with unread and absence indicators
 */
export function PatchnoteBell() {
	// State
	const [isOpen, setIsOpen] = useState(false);
	const [hasNew, setHasNew] = useState(false);
	const absenceMode = useUIStore((s) => s.absenceMode);

	// Computed
	const isAbsent = absenceMode !== "none";

	useEffect(() => {
		setHasNew(!hasSeenLatestPatchnote());
	}, []);

	// Handlers

	/**
	 * Opens the patchnote panel and marks the latest note as seen.
	 * @returns {void}
	 */
	const handleOpen = () => {
		if (isAbsent) return;
		setIsOpen(true);
		if (hasNew) {
			markPatchnoteSeen();
			setHasNew(false);
		}
	};

	// Render
	const patchButton = (
		<button
			type="button"
			onClick={handleOpen}
			className={cn(
				"relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-150",
				isAbsent
					? "cursor-default text-gray-400 opacity-60 dark:text-gray-600"
					: [
							"text-gray-500 hover:bg-gray-100 hover:text-gray-700",
							"dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200",
						],
				isOpen && !isAbsent && "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
			)}
			aria-label={isAbsent ? "Mises a jour communiquees a votre retour" : "Patchnotes"}
			title={isAbsent ? undefined : "Mises a jour"}
		>
			<Icon name="news" size="md" style={hasNew && !isAbsent ? "solid" : "outline"} />

			{/* Diagonal strikethrough line for absence mode */}
			{isAbsent && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="h-[2px] w-5 rotate-45 rounded-full bg-gray-500 dark:bg-gray-400" />
				</div>
			)}

			{/* New patchnote indicator (hidden during absence) */}
			{hasNew && !isAbsent && (
				<span
					className={cn(
						"absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center",
						"bg-primary-500 rounded-full",
						"ring-2 ring-white dark:ring-gray-800",
					)}
				>
					<span className="bg-primary-400 absolute h-full w-full animate-ping rounded-full opacity-75" />
				</span>
			)}
		</button>
	);

	return (
		<>
			{isAbsent ? (
				<Tooltip content="Les mises a jour te seront communiquees a ton retour" position="bottom">
					{patchButton}
				</Tooltip>
			) : (
				patchButton
			)}

			<PatchnotePanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</>
	);
}
