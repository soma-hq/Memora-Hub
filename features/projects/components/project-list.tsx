"use client";

// React
import { useState } from "react";
import { Input, SelectMenu, Icon, EmptyState } from "@/components/ui";
import type { SelectMenuOption } from "@/components/ui";
import { ProjectCard } from "./project-card";
import { ProjectBoardView } from "./project-board-view";
import { ProjectViewToggle } from "./project-view-toggle";
import { useProjects } from "../hooks";
import type { Project, ProjectStatusValue, ProjectPriorityValue, ProjectViewMode } from "../types";
import { ProjectStatusLabel, ProjectPriorityLabel } from "../types";


/** Status filter options including a "show all" entry */
const STATUS_OPTIONS: SelectMenuOption[] = [
	{ label: "Tous les statuts", value: "all", icon: "filter" },
	...Object.entries(ProjectStatusLabel).map(
		([value, label]) =>
			({
				label,
				value,
				icon:
					value === "todo"
						? "clock"
						: value === "in_progress"
							? "tasks"
							: value === "done"
								? "check"
								: value === "complete"
									? "check"
									: value === "archived"
										? "folder"
										: "clock",
			}) as SelectMenuOption,
	),
];

/** Priority filter options */
const PRIORITY_OPTIONS: SelectMenuOption[] = [
	{ label: "Toutes priorites", value: "all", icon: "filter" },
	{ label: "P0 - Critique", value: "P0", icon: "flag" },
	{ label: "P1 - Haute", value: "P1", icon: "flag" },
	{ label: "P2 - Moyenne", value: "P2", icon: "flag" },
	{ label: "P3 - Basse", value: "P3", icon: "flag" },
	{ label: "P4 - Minimale", value: "P4", icon: "flag" },
];

/** Props for the ProjectList component */
interface ProjectListProps {
	groupId: string;
	onCreateClick?: () => void;
}

/**
 * Searchable project collection with grid and kanban views, status and priority filters.
 * @param {ProjectListProps} props - Component props
 * @returns {JSX.Element} Project list with search, filters, and view toggle
 */
export function ProjectList({ groupId, onCreateClick }: ProjectListProps) {
	// State
	const {
		search,
		setSearch,
		statusFilter,
		setStatusFilter,
		priorityFilter,
		setPriorityFilter,
		filteredProjects,
		isLoading,
	} = useProjects();
	const [viewMode, setViewMode] = useState<ProjectViewMode>("grid");

	// Render
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
				<div className="flex-1">
					<Input
						placeholder="Rechercher un projet..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						icon={<Icon name="search" size="sm" />}
					/>
				</div>
				<div className="flex items-end gap-3">
					<div className="w-full sm:w-52">
						<SelectMenu
							options={STATUS_OPTIONS}
							value={statusFilter}
							onChange={(val) => setStatusFilter(val as ProjectStatusValue | "all")}
							triggerIcon="filter"
							placeholder="Tous les statuts"
						/>
					</div>
					<div className="w-full sm:w-52">
						<SelectMenu
							options={PRIORITY_OPTIONS}
							value={priorityFilter}
							onChange={(val) => setPriorityFilter(val as ProjectPriorityValue | "all")}
							triggerIcon="flag"
							placeholder="Toutes priorites"
						/>
					</div>
					<ProjectViewToggle mode={viewMode} onChange={setViewMode} />
				</div>
			</div>

			{isLoading && (
				<div className="flex items-center justify-center py-16">
					<div className="border-t-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-gray-200" />
				</div>
			)}

			{!isLoading && filteredProjects.length === 0 && (
				<EmptyState
					icon="folder"
					title="Aucun projet trouve"
					description={
						search || statusFilter !== "all" || priorityFilter !== "all"
							? "Essayez de modifier vos criteres de recherche."
							: "Commencez par creer votre premier projet."
					}
					actionLabel={
						!search && statusFilter === "all" && priorityFilter === "all" ? "Nouveau projet" : undefined
					}
					onAction={!search && statusFilter === "all" && priorityFilter === "all" ? onCreateClick : undefined}
				/>
			)}

			{!isLoading && filteredProjects.length > 0 && (
				<>
					{viewMode === "grid" ? (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
							{filteredProjects.map((project) => (
								<ProjectCard key={project.id} project={project} groupId={groupId} />
							))}
						</div>
					) : (
						<ProjectBoardView projects={filteredProjects} groupId={groupId} onProjectClick={() => {}} />
					)}
				</>
			)}
		</div>
	);
}
