"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { useParams } from "next/navigation";
import { Badge, Button, Card, EmptyState, Icon, Modal, ModalFooter, ProgressBar } from "@/components/ui";
import { usePersonalProjects } from "@/features/operations/personnel/hooks";
import { projectStatusVariantMap, projectStatusLabels, PROJECT_STATUSES } from "@/features/operations/personnel/types";
import { cn } from "@/lib/utils/cn";
import type { ProjectStatus } from "@/features/operations/personnel/types";
import { definePageConfig } from "@/core/structures";
import { showError, showSuccess } from "@/lib/utils/toast";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/personnel/projects",
	section: "protected",
	module: "personnel",
	description: "Projets du personnel.",
	requiredPermissions: [{ module: "personnel", action: "view" }],
	entityScoped: true,
});

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
	const params = useParams();
	const groupId = (params.groupId as string) ?? "";
	const { filteredProjects, search, setSearch, statusFilter, setStatusFilter, createProject } =
		usePersonalProjects(groupId);

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [projectEndDate, setProjectEndDate] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const resetForm = () => {
		setProjectName("");
		setProjectDescription("");
		setProjectEndDate("");
	};

	const handleCreateProject = async () => {
		if (!projectName.trim()) {
			showError("Le nom du projet est obligatoire.");
			return;
		}

		setIsSubmitting(true);
		const success = await createProject({
			name: projectName.trim(),
			description: projectDescription.trim() || undefined,
			endDate: projectEndDate || undefined,
		});
		setIsSubmitting(false);

		if (!success) {
			showError("Impossible de créer le projet.");
			return;
		}

		showSuccess("Projet créé avec succès.");
		setIsCreateModalOpen(false);
		resetForm();
	};

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
			description="Vision claire, priorisée et orientée progression de tes projets personnels."
			actions={
				<Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
					<Icon name="plus" size="xs" />
					Nouveau projet
				</Button>
			}
		>
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

			<div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-4 dark:border-gray-700 dark:bg-gray-900/30">
				{/* Projects grid */}
				{filteredProjects.length === 0 ? (
					<EmptyState
						icon="folder"
						title="Aucun projet trouvé"
						description="Aucun projet ne correspond à vos critères de recherche."
					/>
				) : (
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
						{filteredProjects.map((project) => (
							<Card
								key={project.id}
								hover
								padding="md"
								className={cn(
									"border border-gray-200/90 dark:border-gray-700",
									"bg-white/90 dark:bg-gray-900/70",
									"shadow-xs",
								)}
							>
								<div className="mb-3 flex items-start justify-between gap-2">
									<h3 className="text-base font-semibold text-gray-900 dark:text-white">
										{project.name}
									</h3>
									<Badge variant={projectStatusVariantMap[project.status]} showDot>
										{projectStatusLabels[project.status]}
									</Badge>
								</div>

								<p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
									{project.description}
								</p>

								<div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
									<div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
										<span>Avancement</span>
										<span className="font-medium">{project.progress}%</span>
									</div>
									<ProgressBar
										value={project.progress}
										size="sm"
										variant={getProgressVariant(project.progress)}
									/>
								</div>

								<div className="mt-3 flex flex-wrap items-center gap-2">
									<Badge variant="neutral" showDot={false} className="text-[10px]">
										{project.role}
									</Badge>

									{project.deadline && (
										<span className="flex items-center gap-1 rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
											<Icon name="clock" size="xs" />
											{formatDate(project.deadline)}
										</span>
									)}
								</div>
							</Card>
						))}
					</div>
				)}
			</div>

			<Modal
				isOpen={isCreateModalOpen}
				onClose={() => {
					setIsCreateModalOpen(false);
					resetForm();
				}}
				title="Nouveau projet"
				description="Crée un projet personnel dans ton groupe actuel"
				size="md"
			>
				<div className="space-y-3">
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Nom *</label>
						<input
							type="text"
							value={projectName}
							onChange={(e) => setProjectName(e.target.value)}
							className={inputClasses}
							placeholder="Nom du projet"
						/>
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
							Description
						</label>
						<textarea
							value={projectDescription}
							onChange={(e) => setProjectDescription(e.target.value)}
							rows={3}
							className={cn(inputClasses, "resize-none")}
							placeholder="Contexte du projet"
						/>
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
							Date cible
						</label>
						<input
							type="date"
							value={projectEndDate}
							onChange={(e) => setProjectEndDate(e.target.value)}
							className={inputClasses}
						/>
					</div>
				</div>
				<ModalFooter>
					<Button
						variant="ghost"
						onClick={() => {
							setIsCreateModalOpen(false);
							resetForm();
						}}
					>
						Annuler
					</Button>
					<Button onClick={handleCreateProject} disabled={isSubmitting}>
						{isSubmitting ? "Création..." : "Créer"}
					</Button>
				</ModalFooter>
			</Modal>
		</PageContainer>
	);
}
