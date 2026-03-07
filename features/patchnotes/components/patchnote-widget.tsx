"use client";

// React
import { useState } from "react";

// Components
import { Button, Icon, SectionHeaderBanner } from "@/components/ui";
import { PatchnotePanel } from "./patchnote-panel";
import { useUIStore } from "@/store/ui.store";

// Utils & data
import { getLatestPatchnote } from "../data/patchnotes";

/**
 * Opens the full PatchnotePanel on click
 * @returns {JSX.Element} Patchnote dashboard widget
 */
export function PatchnoteWidget() {
	const [panelOpen, setPanelOpen] = useState(false);
	const latest = getLatestPatchnote();
	const legacyMode = useUIStore((s) => s.legacyMode);
	const adminMode = useUIStore((s) => s.adminMode);
	const accentColor = adminMode
		? ("red-pastel" as const)
		: legacyMode
			? ("orange-pastel" as const)
			: ("rose" as const);

	// Render
	return (
		<>
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
				{/* Header collé */}
				<SectionHeaderBanner
					icon="sparkles"
					title="Mise à Jour"
					accentColor={accentColor}
					className="rounded-none"
				>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setPanelOpen(true)}
						className="shrink-0 text-white/80 hover:bg-white/10 hover:text-white"
					>
						Voir tout
						<Icon name="chevronRight" size="xs" className="ml-1" />
					</Button>
				</SectionHeaderBanner>

				{/* Nouveautés en ligne */}
				<div className="px-4 py-3">
					<p className="flex flex-wrap items-center gap-x-0 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
						{latest.changes.map((change, idx) => (
							<span key={idx} className="flex items-center">
								{idx > 0 && <span className="mx-2 text-gray-300 dark:text-gray-600">·</span>}
								<span className="text-gray-400 dark:text-gray-500">—</span>
								<span className="ml-1">{change.description}</span>
							</span>
						))}
					</p>
				</div>
			</div>

			<PatchnotePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
		</>
	);
}
