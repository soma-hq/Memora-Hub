"use client";

// Components
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { PATCHNOTES } from "@/features/patchnotes/data/patchnotes";
import type { PatchnoteChange } from "@/features/patchnotes/types";


/** Maps change type to display config */
const CHANGE_CONFIG: Record<PatchnoteChange["type"], { label: string; color: string; bg: string; icon: string }> = {
	added: {
		label: "Ajout",
		color: "text-success-600 dark:text-success-500",
		bg: "bg-success-100 dark:bg-success-900/30",
		icon: "+",
	},
	improved: {
		label: "Ameliore",
		color: "text-info-600 dark:text-info-500",
		bg: "bg-info-100 dark:bg-info-900/30",
		icon: "^",
	},
	fixed: {
		label: "Corrige",
		color: "text-warning-600 dark:text-warning-500",
		bg: "bg-warning-100 dark:bg-warning-900/30",
		icon: "~",
	},
	removed: {
		label: "Supprime",
		color: "text-error-600 dark:text-error-500",
		bg: "bg-error-100 dark:bg-error-900/30",
		icon: "-",
	},
};

/**
 * Full patchnotes page showing all version history with detailed changelogs.
 * @returns {JSX.Element} Patchnotes page
 */
export default function PatchnotesPage() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-8">
			{/* Page header */}
			<div className="mb-8">
				<div className="flex items-center gap-3">
					<div className="bg-primary-100 dark:bg-primary-900/30 flex h-11 w-11 items-center justify-center rounded-2xl">
						<Icon name="news" size="md" className="text-primary-600 dark:text-primary-400" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patchnotes</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Historique complet des mises a jour de Memora Hub
						</p>
					</div>
				</div>
			</div>

			{/* Timeline */}
			<div className="relative">
				{/* Vertical line */}
				<div className="absolute top-0 left-6 h-full w-px bg-gray-200 dark:bg-gray-700" />

				<div className="space-y-8">
					{PATCHNOTES.map((note, idx) => (
						<div key={note.id} className="relative pl-16">
							{/* Timeline dot */}
							<div
								className={cn(
									"absolute top-1 left-4 flex h-5 w-5 items-center justify-center rounded-full border-2",
									idx === 0
										? "border-primary-500 bg-primary-100 dark:border-primary-400 dark:bg-primary-900/30"
										: "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800",
								)}
							>
								<div
									className={cn(
										"h-2 w-2 rounded-full",
										idx === 0 ? "bg-primary-500" : "bg-gray-400 dark:bg-gray-500",
									)}
								/>
							</div>

							{/* Version card */}
							<div
								className={cn(
									"rounded-xl border p-6 transition-all duration-200",
									idx === 0 && note.isNew
										? "border-primary-200 bg-primary-50/30 dark:border-primary-800/40 dark:bg-primary-900/5"
										: "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50",
								)}
							>
								{/* Version header */}
								<div className="mb-4 flex flex-wrap items-center gap-3">
									<span
										className={cn(
											"rounded-lg px-3 py-1 text-sm font-bold",
											idx === 0
												? "bg-primary-500 text-white"
												: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
										)}
									>
										v{note.version}
									</span>
									{idx === 0 && note.isNew && (
										<span className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 animate-pulse rounded-full px-2.5 py-0.5 text-xs font-bold">
											NOUVELLE VERSION
										</span>
									)}
									<span className="text-sm text-gray-400 dark:text-gray-500">
										{new Date(note.date).toLocaleDateString("fr-FR", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</span>
								</div>

								<h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{note.title}</h2>
								<p className="mb-5 text-sm text-gray-500 dark:text-gray-400">{note.summary}</p>

								{/* Grouped changes */}
								<div className="space-y-2">
									{note.changes.map((change, cIdx) => {
										const config = CHANGE_CONFIG[change.type];
										return (
											<div
												key={cIdx}
												className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
											>
												<span
													className={cn(
														"mt-0.5 flex h-5 min-w-5 items-center justify-center rounded text-[10px] font-bold",
														config.bg,
														config.color,
													)}
												>
													{config.icon}
												</span>
												<div className="flex-1">
													<span className="text-sm text-gray-700 dark:text-gray-200">
														{change.description}
													</span>
												</div>
												<span
													className={cn(
														"shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase",
														config.bg,
														config.color,
													)}
												>
													{config.label}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
