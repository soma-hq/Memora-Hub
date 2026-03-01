"use client";

// React
import { useState } from "react";
import { Icon, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { showInfo } from "@/lib/utils/toast";
import type { ProjectRelations as Relations, RelationStatusValue } from "../types";
import { RelationStatusLabel } from "../types";
import type { IconName } from "@/core/design/icons";


interface ProjectRelationsProps {
	relations: Relations;
}

/** Relation tab definition */
type RelationTab = "tasks" | "communications" | "contents" | "creations" | "ideas";

/** Display config for each relation tab */
const TAB_CONFIG: Record<RelationTab, { label: string; icon: IconName }> = {
	tasks: { label: "Taches", icon: "tasks" },
	communications: { label: "Communications", icon: "communication" },
	contents: { label: "Contenu", icon: "content" },
	creations: { label: "Creations", icon: "creation" },
	ideas: { label: "Idees", icon: "idea" },
};

/** Status badge variant mapping */
const STATUS_VARIANT: Record<RelationStatusValue, string> = {
	todo: "neutral",
	in_progress: "info",
	done: "success",
	cancelled: "error",
};

/**
 * Tabbed display of all project relation types (Tasks, Communications, Content, Creation, Ideas).
 * @param {ProjectRelationsProps} props - Relations data from the project
 * @returns {JSX.Element} Tabbed relation panels
 */
export function ProjectRelations({ relations }: ProjectRelationsProps) {
	// State
	const [activeTab, setActiveTab] = useState<RelationTab>("tasks");

	// Computed
	const counts: Record<RelationTab, number> = {
		tasks: relations.tasks.length,
		communications: relations.communications.length,
		contents: relations.contents.length,
		creations: relations.creations.length,
		ideas: relations.ideas.length,
	};

	// Render
	return (
		<div>
			{/* Sub-tabs */}
			<div className="mb-4 flex flex-wrap gap-1">
				{(Object.keys(TAB_CONFIG) as RelationTab[]).map((tab) => {
					const config = TAB_CONFIG[tab];
					const isActive = activeTab === tab;
					return (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={cn(
								"flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
								isActive
									? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
									: "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
							)}
						>
							<Icon name={config.icon} size="xs" />
							{config.label}
							{counts[tab] > 0 && (
								<span className="ml-0.5 rounded-full bg-gray-200 px-1.5 text-[9px] font-bold dark:bg-gray-700">
									{counts[tab]}
								</span>
							)}
						</button>
					);
				})}
			</div>

			{/* Tab content */}
			<div className="space-y-2">
				{/* Tasks */}
				{activeTab === "tasks" &&
					(relations.tasks.length === 0 ? (
						<EmptyRelation label="Aucune tache liee" />
					) : (
						relations.tasks.map((item) => (
							<RelationCard key={item.id}>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{item.description}
										</p>
										<div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
											<span className="flex items-center gap-1">
												<Icon name="profile" size="xs" />
												{item.assignee}
											</span>
											<span className="flex items-center gap-1">
												<Icon name="calendar" size="xs" />
												{formatDateShort(item.deadline)}
											</span>
											{item.platforms.map((p) => (
												<span
													key={p}
													className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] dark:bg-gray-700"
												>
													{p}
												</span>
											))}
										</div>
									</div>
									<Badge variant={STATUS_VARIANT[item.status] as any}>
										{RelationStatusLabel[item.status]}
									</Badge>
								</div>
							</RelationCard>
						))
					))}

				{/* Communications */}
				{activeTab === "communications" &&
					(relations.communications.length === 0 ? (
						<EmptyRelation label="Aucune communication liee" />
					) : (
						relations.communications.map((item) => (
							<RelationCard key={item.id}>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{item.description}
										</p>
										<div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
											<span className="flex items-center gap-1">
												<Icon name="profile" size="xs" />
												{item.assignee}
											</span>
											<span className="flex items-center gap-1">
												<Icon name="calendar" size="xs" />
												{formatDateShort(item.postDate)}
											</span>
											{item.platforms.map((p) => (
												<span
													key={p}
													className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] dark:bg-gray-700"
												>
													{p}
												</span>
											))}
										</div>
									</div>
									<Badge variant={STATUS_VARIANT[item.status] as any}>
										{RelationStatusLabel[item.status]}
									</Badge>
								</div>
							</RelationCard>
						))
					))}

				{/* Contents */}
				{activeTab === "contents" &&
					(relations.contents.length === 0 ? (
						<EmptyRelation label="Aucun contenu lie" />
					) : (
						relations.contents.map((item) => (
							<RelationCard key={item.id}>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{item.description}
										</p>
										<div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
											<span className="flex items-center gap-1">
												<Icon name="profile" size="xs" />
												{item.assignee}
											</span>
											<span className="flex items-center gap-1">
												<Icon name="calendar" size="xs" />
												{formatDateShort(item.deadline)}
											</span>
											{item.platforms.map((p) => (
												<span
													key={p}
													className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] dark:bg-gray-700"
												>
													{p}
												</span>
											))}
										</div>
									</div>
									<Badge variant={STATUS_VARIANT[item.status] as any}>
										{RelationStatusLabel[item.status]}
									</Badge>
								</div>
							</RelationCard>
						))
					))}

				{/* Creations */}
				{activeTab === "creations" &&
					(relations.creations.length === 0 ? (
						<EmptyRelation label="Aucune creation liee" />
					) : (
						relations.creations.map((item) => (
							<RelationCard key={item.id}>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{item.description}
										</p>
										<div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
											<span className="flex items-center gap-1">
												<Icon name="profile" size="xs" />
												{item.assignee}
											</span>
											<span className="flex items-center gap-1">
												<Icon name="calendar" size="xs" />
												{formatDateShort(item.deadline)}
											</span>
											{item.links.map((link, i) => (
												<a
													key={i}
													href={link}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:underline"
												>
													<Icon name="link" size="xs" />
													Lien {i + 1}
												</a>
											))}
										</div>
									</div>
									<Badge variant={STATUS_VARIANT[item.status] as any}>
										{RelationStatusLabel[item.status]}
									</Badge>
								</div>
							</RelationCard>
						))
					))}

				{/* Ideas */}
				{activeTab === "ideas" &&
					(relations.ideas.length === 0 ? (
						<EmptyRelation label="Aucune idee liee" />
					) : (
						relations.ideas.map((item) => (
							<RelationCard key={item.id}>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{item.description}
										</p>
										<div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
											<span className="flex items-center gap-1">
												<Icon name="idea" size="xs" />
												Pensee par {item.thoughtBy}
											</span>
										</div>
									</div>
									<Badge variant={STATUS_VARIANT[item.status] as any}>
										{RelationStatusLabel[item.status]}
									</Badge>
								</div>
							</RelationCard>
						))
					))}
			</div>

			{/* Add relation button */}
			<div className="mt-4">
				<Button
					variant="outline-neutral"
					size="sm"
					onClick={() => showInfo("Ajout de relation bientot disponible.")}
				>
					<Icon name="plus" size="xs" />
					Ajouter une relation
				</Button>
			</div>
		</div>
	);
}

/**
 * Wrapper card for a single relation item.
 * @param {{ children: React.ReactNode }} props - Card content
 * @returns {JSX.Element} Styled relation card
 */
function RelationCard({ children }: { children: React.ReactNode }) {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
			{children}
		</div>
	);
}

/**
 * Empty state placeholder for relation tabs with no items.
 * @param {{ label: string }} props - Empty state label
 * @returns {JSX.Element} Empty relation placeholder
 */
function EmptyRelation({ label }: { label: string }) {
	return (
		<div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 py-8 dark:border-gray-600">
			<p className="text-sm text-gray-400 dark:text-gray-500">{label}</p>
		</div>
	);
}

/**
 * Formats an ISO date string to a short French locale string.
 * @param {string} iso - ISO date string
 * @returns {string} Formatted date
 */
function formatDateShort(iso: string): string {
	return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}
