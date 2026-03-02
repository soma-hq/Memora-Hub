"use client";

// React
import { useState } from "react";

// Components
import { Card, Button, Icon, SectionHeaderBanner } from "@/components/ui";
import { PatchnotePanel } from "./patchnote-panel";

// Utils & data
import { cn } from "@/lib/utils/cn";
import { getLatestPatchnote } from "../data/patchnotes";
import type { PatchnoteChange } from "../types";

/** Maps change type to display label and color classes */
const CHANGE_TYPE_CONFIG: Record<PatchnoteChange["type"], { label: string; color: string; bg: string }> = {
	added: {
		label: "Ajout",
		color: "text-success-600 dark:text-success-500",
		bg: "bg-success-100 dark:bg-success-900/30",
	},
	improved: {
		label: "Amélioré",
		color: "text-info-600 dark:text-info-500",
		bg: "bg-info-100 dark:bg-info-900/30",
	},
	fixed: {
		label: "Corrigé",
		color: "text-warning-600 dark:text-warning-500",
		bg: "bg-warning-100 dark:bg-warning-900/30",
	},
	removed: {
		label: "Supprimé",
		color: "text-error-600 dark:text-error-500",
		bg: "bg-error-100 dark:bg-error-900/30",
	},
};

/**
 * Compact dashboard widget showing the latest patchnote with type-tagged change list.
 * Opens the full PatchnotePanel on click.
 * @returns {JSX.Element} Patchnote dashboard widget
 */
export function PatchnoteWidget() {
	const [panelOpen, setPanelOpen] = useState(false);
	const latest = getLatestPatchnote();

	// Render
	return (
		<>
			<Card padding="md">
				{/* Header */}
				<SectionHeaderBanner icon="sparkles" title="Mise à Jour" description={latest.summary} accentColor="rose">
					<span className="bg-primary-500 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white">
						v{latest.version}
					</span>
					{latest.isNew && (
						<span className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-full px-2 py-0.5 text-[10px] font-bold">
							NOUVEAU
						</span>
					)}
					<Button variant="ghost" size="sm" onClick={() => setPanelOpen(true)} className="shrink-0">
						Voir tout
						<Icon name="chevronRight" size="xs" className="ml-1" />
					</Button>
				</SectionHeaderBanner>

				{/* Change list */}
				<div className="flex flex-wrap gap-x-5 gap-y-1.5">
					{latest.changes.slice(0, 3).map((change, idx) => {
						const config = CHANGE_TYPE_CONFIG[change.type];
						return (
							<div key={idx} className="flex min-w-0 items-start gap-1.5">
								<span
									className={cn(
										"mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase",
										config.bg,
										config.color,
									)}
								>
									{config.label}
								</span>
								<span className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
									{change.description}
								</span>
							</div>
						);
					})}
					{latest.changes.length > 3 && (
						<span className="self-center text-xs text-gray-400 dark:text-gray-500">
							+{latest.changes.length - 3} autres
						</span>
					)}
				</div>
			</Card>

			<PatchnotePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
		</>
	);
}
