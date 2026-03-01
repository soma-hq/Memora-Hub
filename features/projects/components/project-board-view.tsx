"use client";

// Components
import { Badge, Icon, EmptyState } from "@/components/ui";
import { ProjectCard } from "./project-card";
import { cn } from "@/lib/utils/cn";
import type { Project, ProjectStatusValue } from "../types";
import { projectStatusVariant, ProjectStatusLabel } from "../types";
import { ProjectStatus } from "@/constants";


/** Column header background colors per status */
const columnHeaderColor: Record<ProjectStatusValue, string> = {
	todo: "bg-gray-100 dark:bg-gray-800",
	in_progress: "bg-blue-50 dark:bg-blue-900/20",
	paused: "bg-amber-50 dark:bg-amber-900/20",
	done: "bg-emerald-50 dark:bg-emerald-900/20",
	complete: "bg-emerald-50 dark:bg-emerald-900/20",
	archived: "bg-gray-100 dark:bg-gray-800",
};

/** Props for the ProjectBoardView component */
interface ProjectBoardViewProps {
	projects: Project[];
	groupId: string;
	onProjectClick?: (project: Project) => void;
}

/**
 * Kanban board view for projects organized by status columns
 * @param props - Component props
 * @param props.projects - Array of projects to display
 * @param props.onProjectClick - Callback when a project card is clicked
 * @returns Kanban board with status columns
 */
export function ProjectBoardView({ projects, groupId, onProjectClick }: ProjectBoardViewProps) {
	// Computed
	const projectsByStatus = Object.values(ProjectStatus).reduce(
		(acc, status) => {
			acc[status] = projects.filter((p) => p.status === status);
			return acc;
		},
		{} as Record<ProjectStatusValue, Project[]>,
	);

	if (projects.length === 0) {
		return (
			<EmptyState icon="folder" title="Aucun projet" description="Creez votre premier projet pour commencer." />
		);
	}

	// Render
	return (
		<div className="flex gap-4 overflow-x-auto pb-4">
			{Object.values(ProjectStatus).map((status) => {
				const statusProjects = projectsByStatus[status];
				return (
					<div
						key={status}
						className="flex min-w-[280px] flex-1 flex-col rounded-xl border border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/30"
					>
						<div
							className={cn(
								"flex items-center justify-between rounded-t-xl px-3 py-2.5",
								columnHeaderColor[status],
							)}
						>
							<div className="flex items-center gap-2">
								<Badge variant={projectStatusVariant[status]} showDot>
									{ProjectStatusLabel[status]}
								</Badge>
							</div>
							<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
								{statusProjects.length}
							</span>
						</div>

						<div className="flex flex-1 flex-col gap-3 p-3">
							{statusProjects.length === 0 ? (
								<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 px-4 py-8 dark:border-gray-700">
									<Icon name="folder" size="md" className="mb-1 text-gray-300 dark:text-gray-600" />
									<p className="text-xs text-gray-400">Aucun projet</p>
								</div>
							) : (
								statusProjects.map((project) => (
									<div
										key={project.id}
										onClick={() => onProjectClick?.(project)}
										className="cursor-pointer"
									>
										<ProjectCard project={project} groupId={groupId} />
									</div>
								))
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
