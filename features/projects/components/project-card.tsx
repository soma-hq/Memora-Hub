"use client";

// Next.js
import Link from "next/link";
import { Badge, AvatarGroup, Icon, Tooltip } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Project } from "../types";
import { projectStatusVariant, priorityVariant } from "../types";


/** Props for the ProjectCard component */
interface ProjectCardProps {
	project: Project;
	groupId: string;
}

/**
 * Redesigned project card with emoji, priority badge, progress bar, and relation count.
 * Clicking the card navigates to the project detail page.
 * @param {ProjectCardProps} props - Component props
 * @returns {JSX.Element} Project card component
 */
export function ProjectCard({ project, groupId }: ProjectCardProps) {
	// Computed
	const totalRelations =
		project.relations.tasks.length +
		project.relations.communications.length +
		project.relations.contents.length +
		project.relations.creations.length +
		project.relations.ideas.length;

	const daysLeft = getDaysRemaining(project.endDate);
	const isArchived = project.status === "archived";
	const isComplete = project.status === "complete" || project.status === "done";

	// Render
	return (
		<Link
			href={`/hub/${groupId}/projects/${project.id}`}
			className={cn(
				"group relative flex flex-col rounded-xl border p-4 transition-all duration-200",
				"hover:-translate-y-0.5 hover:shadow-md",
				isArchived
					? "border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800/50"
					: "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
			)}
		>
			{/* Header: emoji + name + priority */}
			<div className="mb-3 flex items-start gap-3">
				<span className="text-2xl leading-none">{project.emoji}</span>
				<div className="min-w-0 flex-1">
					<h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate text-sm font-bold text-gray-900 dark:text-white">
						{project.name}
					</h3>
					<p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
						{project.description}
					</p>
				</div>
				<Badge variant={priorityVariant[project.priority]}>{project.priority}</Badge>
			</div>

			{/* Status + deadline */}
			<div className="mb-3 flex items-center gap-2">
				<Badge variant={projectStatusVariant[project.status]} showDot>
					{project.status}
				</Badge>
				{project.endDate &&
					project.status !== "done" &&
					project.status !== "complete" &&
					project.status !== "archived" && (
						<Tooltip content={`Deadline: ${formatDate(project.endDate)}`}>
							<span
								className={cn(
									"rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
									daysLeft < 0
										? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
										: daysLeft <= 7
											? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
											: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
								)}
							>
								{daysLeft < 0
									? `${Math.abs(daysLeft)}j en retard`
									: daysLeft === 0
										? "Aujourd'hui"
										: `${daysLeft}j restants`}
							</span>
						</Tooltip>
					)}
			</div>

			{/* Progress bar */}
			<div className="mb-3">
				<div className="mb-1 flex items-center justify-between">
					<span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
						{project.tasks.done}/{project.tasks.total} taches
					</span>
					<span
						className={cn(
							"text-[10px] font-bold",
							isComplete ? "text-success-600 dark:text-success-500" : "text-gray-600 dark:text-gray-300",
						)}
					>
						{project.progress}%
					</span>
				</div>
				<div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
					<div
						className={cn(
							"h-full rounded-full transition-all duration-300",
							isComplete ? "bg-success-500" : "bg-primary-500",
						)}
						style={{ width: `${project.progress}%` }}
					/>
				</div>
			</div>

			{/* Footer: avatars + metadata */}
			<div className="flex items-center justify-between">
				<AvatarGroup
					users={project.members.map((m) => ({ name: m.name, src: m.avatar ?? null }))}
					max={3}
					size="xs"
				/>
				<div className="flex items-center gap-3">
					{totalRelations > 0 && (
						<Tooltip content={`${totalRelations} relation${totalRelations > 1 ? "s" : ""}`}>
							<span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
								<Icon name="folder" size="xs" />
								{totalRelations}
							</span>
						</Tooltip>
					)}
					{project.timeline.length > 0 && (
						<Tooltip
							content={`${project.timeline.length} entree${project.timeline.length > 1 ? "s" : ""} journal`}
						>
							<span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
								<Icon name="logs" size="xs" />
								{project.timeline.length}
							</span>
						</Tooltip>
					)}
				</div>
			</div>
		</Link>
	);
}

/**
 * Formats an ISO date string to a short French locale date.
 * @param {string} iso - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

/**
 * Calculates the number of days remaining until a deadline.
 * @param {string} endDate - ISO date string for the deadline
 * @returns {number} Days remaining, negative if overdue
 */
function getDaysRemaining(endDate: string): number {
	const diff = new Date(endDate).getTime() - new Date().getTime();
	return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
