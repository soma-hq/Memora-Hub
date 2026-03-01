"use client";

// Features & Components
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, EmptyState, ProgressBar } from "@/components/ui";
import { usePersonalProjects } from "@/features/personnel/hooks";
import { projectStatusVariantMap, projectStatusLabels, PROJECT_STATUSES } from "@/features/personnel/types";
import { cn } from "@/lib/utils/cn";
import type { ProjectStatus } from "@/features/personnel/types";


/**
 * Formats a date string to a localized French display format.
 * @param dateStr - ISO date string to format
 * @returns The formatted date string
 */
function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Returns a color variant based on project completion percentage.
 * @param progress - The completion percentage (0-100)
 * @returns The variant string for the progress bar color
 */
function getProgressVariant(progress: number): "primary" | "success" | "warning" | "error" {
	if (progress >= 100) return "success";
	if (progress >= 60) return "primary";
	if (progress >= 30) return "warning";
	return "error";
}

const STATUS_OPTIONS: { value: ProjectStatus | ""; label: string }[] = [
	{ value: "", label: "Tous les statuts" },
	...PROJECT_STATUSES.map((s) => ({ value: s, label: projectStatusLabels[s] })),
];

/**
 * Personal projects page with status filtering, progress tracking and team display.
 * @returns The personal projects list page
 */
export default function PersonalProjectsPage() {
	const { filteredProjects, search, setSearch, statusFilter, setStatusFilter } = usePersonalProjects();

	const inputClasses = cn(
		"w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm text-gray-900",
		"placeholder-gray-400 transition-colors",
		"focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none",
		"dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
		"dark:focus:border-primary-600 dark:focus:ring-primary-600",
	);

	const selectClasses = cn(
		"rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700",
		"transition-colors",
		"focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none",
		"dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
		"dark:focus:border-primary-600 dark:focus:ring-primary-600",
	);

	return (
		<PageContainer
			title="Mes projets"
			description="Retrouvez l'ensemble de vos projets personnels et leur avancement."
		>
			{/* Filter bar */}
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
				{/* Search */}
				<div className="relative flex-1">
					<Icon name="search" size="sm" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher un projet..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={inputClasses}
					/>
				</div>

				{/* Status filter */}
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "")}
					className={selectClasses}
				>
					{STATUS_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{/* Projects grid */}
			{filteredProjects.length === 0 ? (
				<EmptyState
					icon="folder"
					title="Aucun projet trouvé"
					description="Aucun projet ne correspond à vos critères de recherche."
				/>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{filteredProjects.map((project) => (
						<Card key={project.id} hover padding="md">
							{/* Header */}
							<div className="flex items-start justify-between gap-2">
								<h3 className="text-sm font-semibold text-gray-900 dark:text-white">{project.name}</h3>
								<Badge variant={projectStatusVariantMap[project.status]} showDot>
									{projectStatusLabels[project.status]}
								</Badge>
							</div>

							{/* Description */}
							<p className="mt-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
								{project.description}
							</p>

							{/* Progress */}
							<div className="mt-4">
								<ProgressBar
									value={project.progress}
									showValue
									size="sm"
									variant={getProgressVariant(project.progress)}
								/>
							</div>

							{/* Footer info */}
							<div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
								{/* Role badge */}
								<Badge variant="neutral" showDot={false} className="text-[10px]">
									{project.role}
								</Badge>

								{/* Deadline */}
								{project.deadline && (
									<span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
										<Icon name="clock" size="xs" />
										{formatDate(project.deadline)}
									</span>
								)}
							</div>
						</Card>
					))}
				</div>
			)}
		</PageContainer>
	);
}
