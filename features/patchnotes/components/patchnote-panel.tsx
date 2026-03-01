"use client";

// React
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { useHubStore } from "@/store/hub.store";
import { PATCHNOTES } from "../data/patchnotes";
import type { PatchnoteChange } from "../types";


interface PatchnotePanelProps {
	isOpen: boolean;
	onClose: () => void;
}

/** Maps change type to display color and label */
const CHANGE_TYPE_CONFIG: Record<PatchnoteChange["type"], { label: string; color: string; bg: string }> = {
	added: {
		label: "Ajout",
		color: "text-success-600 dark:text-success-500",
		bg: "bg-success-100 dark:bg-success-900/30",
	},
	improved: { label: "Ameliore", color: "text-info-600 dark:text-info-500", bg: "bg-info-100 dark:bg-info-900/30" },
	fixed: {
		label: "Corrige",
		color: "text-warning-600 dark:text-warning-500",
		bg: "bg-warning-100 dark:bg-warning-900/30",
	},
	removed: {
		label: "Supprime",
		color: "text-error-600 dark:text-error-500",
		bg: "bg-error-100 dark:bg-error-900/30",
	},
};

/**
 * Slide-out panel showing recent patchnotes with version history.
 * @param {PatchnotePanelProps} props - Panel open state and close callback
 * @returns {JSX.Element} Patchnote side panel
 */
export function PatchnotePanel({ isOpen, onClose }: PatchnotePanelProps) {
	// State
	const panelRef = useRef<HTMLDivElement>(null);
	const { activeGroupId } = useHubStore();

	// Close on outside click
	useEffect(() => {
		if (!isOpen) return;
		const handler = (e: MouseEvent) => {
			if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [isOpen, onClose]);

	// Close on Escape
	useEffect(() => {
		if (!isOpen) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	// Render
	return (
		<div className="fixed inset-0 z-50">
			{/* Backdrop */}
			<div className="animate-fade-in absolute inset-0 bg-black/20 backdrop-blur-sm" />

			{/* Panel */}
			<div
				ref={panelRef}
				className="animate-slide-in-right absolute top-0 right-0 h-full w-full max-w-md border-l border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
					<div className="flex items-center gap-3">
						<div className="bg-primary-100 dark:bg-primary-900/30 flex h-9 w-9 items-center justify-center rounded-xl">
							<Icon name="news" size="sm" className="text-primary-600 dark:text-primary-400" />
						</div>
						<div>
							<h2 className="text-base font-bold text-gray-900 dark:text-white">Patchnotes</h2>
							<p className="text-xs text-gray-500 dark:text-gray-400">Dernieres mises a jour de Memora</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
					>
						<Icon name="close" size="sm" />
					</button>
				</div>

				{/* Content */}
				<div className="scrollbar-hide h-[calc(100%-130px)] overflow-y-auto px-5 py-4">
					<div className="space-y-6">
						{PATCHNOTES.map((note, idx) => (
							<div
								key={note.id}
								className={cn(
									"rounded-xl border p-4 transition-all duration-200",
									idx === 0 && note.isNew
										? "border-primary-200 bg-primary-50/50 dark:border-primary-800/40 dark:bg-primary-900/10"
										: "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50",
								)}
							>
								{/* Version header */}
								<div className="mb-3 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span
											className={cn(
												"rounded-md px-2 py-0.5 text-xs font-bold",
												idx === 0
													? "bg-primary-500 text-white"
													: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
											)}
										>
											v{note.version}
										</span>
										{idx === 0 && note.isNew && (
											<span className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-full px-2 py-0.5 text-[10px] font-bold">
												NOUVEAU
											</span>
										)}
									</div>
									<span className="text-xs text-gray-400 dark:text-gray-500">
										{new Date(note.date).toLocaleDateString("fr-FR", {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</span>
								</div>

								<h3 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">{note.title}</h3>
								<p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{note.summary}</p>

								{/* Changes list */}
								<div className="space-y-1.5">
									{note.changes.slice(0, 5).map((change, cIdx) => {
										const config = CHANGE_TYPE_CONFIG[change.type];
										return (
											<div key={cIdx} className="flex items-start gap-2">
												<span
													className={cn(
														"mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase",
														config.bg,
														config.color,
													)}
												>
													{config.label}
												</span>
												<span className="text-xs text-gray-600 dark:text-gray-300">
													{change.description}
												</span>
											</div>
										);
									})}
									{note.changes.length > 5 && (
										<p className="text-xs text-gray-400 dark:text-gray-500">
											+{note.changes.length - 5} autres changements...
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Footer */}
				<div className="border-t border-gray-200 px-5 py-3 dark:border-gray-700">
					<Link
						href={`/hub/${activeGroupId ?? "default"}/patchnotes`}
						onClick={onClose}
						className="bg-primary-500 hover:bg-primary-600 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200"
					>
						<Icon name="news" size="xs" />
						Voir tout l&apos;historique
					</Link>
				</div>
			</div>
		</div>
	);
}
