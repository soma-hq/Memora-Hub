"use client";

import { useCallback, useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Badge, Button, Icon, Modal, ModalFooter, StyledEmptyState } from "@/components/ui";
import { useParams } from "next/navigation";
import { usePersonalProjects, usePersonalTasks } from "@/features/operations/personnel/hooks";
import {
	taskPriorityVariantMap,
	taskPriorityLabels,
	TASK_PRIORITIES,
	TASK_STATUSES,
	taskStatusLabels,
} from "@/features/operations/personnel/types";
import { cn } from "@/lib/utils/cn";
import { showError, showSuccess } from "@/lib/utils/toast";
import type { PersonalTask, TaskPriority, TaskStatus } from "@/features/operations/personnel/types";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/personnel/tasks",
	section: "protected",
	module: "personnel",
	description: "Tâches du personnel.",
	requiredPermissions: [{ module: "personnel", action: "view" }],
	entityScoped: true,
});

interface ColumnConfig {
	status: TaskStatus;
	label: string;
	borderColor: string;
	bgHeader: string;
	badgeVariant: "neutral" | "info" | "success";
}

const COLUMNS: ColumnConfig[] = [
	{
		status: "todo",
		label: "À faire",
		borderColor: "border-t-gray-400",
		bgHeader: "bg-gray-50 dark:bg-gray-800/50",
		badgeVariant: "neutral",
	},
	{
		status: "in_progress",
		label: "En cours",
		borderColor: "border-t-blue-500",
		bgHeader: "bg-blue-50/50 dark:bg-blue-900/10",
		badgeVariant: "info",
	},
	{
		status: "done",
		label: "Terminée",
		borderColor: "border-t-emerald-500",
		bgHeader: "bg-emerald-50/50 dark:bg-emerald-900/10",
		badgeVariant: "success",
	},
];

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function PersonalTaskCard({
	task,
	onStatusChange,
	isUpdating,
}: {
	task: PersonalTask;
	onStatusChange: (task: PersonalTask, status: TaskStatus) => void;
	isUpdating: boolean;
}) {
	return (
		<div
			className={cn(
				"rounded-xl border bg-white p-3",
				"border-gray-200 dark:border-gray-700 dark:bg-gray-800",
				"transition-all duration-200",
				"hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:hover:border-gray-600",
			)}
		>
			{/* Title */}
			<p className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</p>

			{/* Project name */}
			{task.projectName && (
				<p className="mt-1 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
					<Icon name="folder" size="xs" />
					{task.projectName}
				</p>
			)}

			{/* Footer: priority + due date */}
			<div className="mt-2.5 flex items-center justify-between gap-2">
				<Badge variant={taskPriorityVariantMap[task.priority]} showDot>
					{taskPriorityLabels[task.priority]}
				</Badge>

				{task.dueDate && (
					<span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
						<Icon name="clock" size="xs" />
						{formatDate(task.dueDate)}
					</span>
				)}
			</div>

			<div className="mt-2">
				<select
					value={task.status}
					disabled={isUpdating}
					onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
					className={cn(
						"w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700",
						"focus:border-primary-300 focus:ring-primary-300 transition-colors focus:ring-1 focus:outline-none",
						"disabled:cursor-not-allowed disabled:opacity-60",
						"dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
						"dark:focus:border-primary-600 dark:focus:ring-primary-600",
					)}
				>
					{TASK_STATUSES.map((statusOption) => (
						<option key={statusOption} value={statusOption}>
							{taskStatusLabels[statusOption]}
						</option>
					))}
				</select>
			</div>

			{/* Assigned by */}
			{task.assignedBy && (
				<p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">Assignée par {task.assignedBy}</p>
			)}
		</div>
	);
}

function TaskColumn({
	config,
	tasks,
	onStatusChange,
	updatingTaskIds,
}: {
	config: ColumnConfig;
	tasks: PersonalTask[];
	onStatusChange: (task: PersonalTask, status: TaskStatus) => void;
	updatingTaskIds: Set<string>;
}) {
	return (
		<div
			className={cn(
				"flex min-w-[280px] flex-1 flex-col rounded-2xl border border-gray-200 dark:border-gray-700",
				"bg-gray-50/50 dark:bg-gray-900/30",
				"border-t-4",
				config.borderColor,
			)}
		>
			{/* Column header */}
			<div className={cn("flex items-center justify-between px-4 py-3", config.bgHeader, "rounded-t-lg")}>
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{config.label}</span>
					<Badge variant={config.badgeVariant} showDot={false} className="text-[11px]">
						{tasks.length}
					</Badge>
				</div>
			</div>

			{/* Task cards */}
			<div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
				{tasks.map((task) => (
					<PersonalTaskCard
						key={task.id}
						task={task}
						onStatusChange={onStatusChange}
						isUpdating={updatingTaskIds.has(task.id)}
					/>
				))}

				{/* Empty column */}
				{tasks.length === 0 && (
					<div className="flex flex-1 items-center justify-center py-8">
						<p className="text-xs text-gray-400 dark:text-gray-500">Aucune tâche</p>
					</div>
				)}
			</div>
		</div>
	);
}

const PRIORITY_OPTIONS: { value: TaskPriority | ""; label: string }[] = [
	{ value: "", label: "Toutes priorités" },
	...TASK_PRIORITIES.map((p) => ({ value: p, label: taskPriorityLabels[p] })),
];

const STATUS_OPTIONS: { value: TaskStatus | ""; label: string }[] = [
	{ value: "", label: "Tous statuts" },
	...TASK_STATUSES.map((s) => ({ value: s, label: taskStatusLabels[s] })),
];

/**
 * Personal tasks page with status board, priority filtering and task details.
 * @returns The personal tasks management page
 */
export default function PersonalTasksPage() {
	const params = useParams();
	const groupId = (params.groupId as string) ?? "";

	const {
		todoTasks,
		inProgressTasks,
		doneTasks,
		search,
		setSearch,
		priorityFilter,
		setPriorityFilter,
		statusFilter,
		setStatusFilter,
		updateTaskStatus,
		createTask,
	} = usePersonalTasks(groupId);
	const { projects } = usePersonalProjects(groupId);

	const [updatingTaskIds, setUpdatingTaskIds] = useState<Set<string>>(new Set());
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [taskTitle, setTaskTitle] = useState("");
	const [taskProjectId, setTaskProjectId] = useState("");
	const [taskPriority, setTaskPriority] = useState<TaskPriority>("medium");
	const [taskDueDate, setTaskDueDate] = useState("");
	const [taskDescription, setTaskDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const resetCreateTask = useCallback(() => {
		setTaskTitle("");
		setTaskProjectId("");
		setTaskPriority("medium");
		setTaskDueDate("");
		setTaskDescription("");
	}, []);

	const handleCreateTask = useCallback(async () => {
		if (!taskTitle.trim()) {
			showError("Le titre de la tâche est obligatoire.");
			return;
		}

		if (!taskProjectId) {
			showError("Sélectionne un projet pour créer la tâche.");
			return;
		}

		setIsSubmitting(true);
		const success = await createTask({
			title: taskTitle.trim(),
			projectId: taskProjectId,
			priority: taskPriority,
			dueDate: taskDueDate || undefined,
			description: taskDescription.trim() || undefined,
		});
		setIsSubmitting(false);

		if (!success) {
			showError("Impossible de créer la tâche.");
			return;
		}

		showSuccess("Tâche créée avec succès.");
		setIsCreateModalOpen(false);
		resetCreateTask();
	}, [createTask, resetCreateTask, taskDescription, taskDueDate, taskPriority, taskProjectId, taskTitle]);

	const handleStatusChange = useCallback(
		async (task: PersonalTask, nextStatus: TaskStatus) => {
			if (task.status === nextStatus) return;

			setUpdatingTaskIds((prev) => {
				const next = new Set(prev);
				next.add(task.id);
				return next;
			});

			const success = await updateTaskStatus(task.id, nextStatus);

			setUpdatingTaskIds((prev) => {
				const next = new Set(prev);
				next.delete(task.id);
				return next;
			});

			if (success) {
				showSuccess(`Statut mis à jour: ${taskStatusLabels[nextStatus]}.`);
				return;
			}

			showError("Impossible de mettre à jour la tâche pour le moment.");
		},
		[updateTaskStatus],
	);

	const totalVisibleTasks = todoTasks.length + inProgressTasks.length + doneTasks.length;

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
			title="Mes tâches"
			description="Visualisez et suivez l'avancement de vos tâches personnelles."
			actions={
				<Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
					<Icon name="plus" size="xs" />
					Nouvelle tâche
				</Button>
			}
		>
			{/* Filter bar */}
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
				{/* Search */}
				<div className="relative flex-1">
					<Icon name="search" size="sm" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher une tâche ou un projet..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={inputClasses}
					/>
				</div>

				{/* Priority filter */}
				<select
					value={priorityFilter}
					onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | "")}
					className={selectClasses}
				>
					{PRIORITY_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>

				{/* Status filter */}
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "")}
					className={selectClasses}
				>
					{STATUS_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{/* Kanban board */}
			{totalVisibleTasks === 0 ? (
				<StyledEmptyState
					icon="tasks"
					title="Aucune tâche visible"
					description="Aucune tâche ne correspond aux filtres actuels pour ce groupe."
				/>
			) : (
				<div className="flex gap-4 overflow-x-auto pb-4">
					{COLUMNS.map((col) => {
						let tasks: PersonalTask[] = [];
						if (col.status === "todo") tasks = todoTasks;
						else if (col.status === "in_progress") tasks = inProgressTasks;
						else if (col.status === "done") tasks = doneTasks;

						return (
							<TaskColumn
								key={col.status}
								config={col}
								tasks={tasks}
								onStatusChange={handleStatusChange}
								updatingTaskIds={updatingTaskIds}
							/>
						);
					})}
				</div>
			)}

			<Modal
				isOpen={isCreateModalOpen}
				onClose={() => {
					setIsCreateModalOpen(false);
					resetCreateTask();
				}}
				title="Nouvelle tâche"
				description="Ajoute une tâche personnelle dans un de tes projets"
				size="md"
			>
				<div className="space-y-3">
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
							Titre *
						</label>
						<input
							type="text"
							value={taskTitle}
							onChange={(e) => setTaskTitle(e.target.value)}
							className={inputClasses}
							placeholder="Titre de la tâche"
						/>
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
							Projet *
						</label>
						<select
							value={taskProjectId}
							onChange={(e) => setTaskProjectId(e.target.value)}
							className={inputClasses}
						>
							<option value="">Choisir un projet</option>
							{projects.map((project) => (
								<option key={project.id} value={project.id}>
									{project.name}
								</option>
							))}
						</select>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div>
							<label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
								Priorité
							</label>
							<select
								value={taskPriority}
								onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
								className={inputClasses}
							>
								{TASK_PRIORITIES.map((priority) => (
									<option key={priority} value={priority}>
										{taskPriorityLabels[priority]}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
								Date cible
							</label>
							<input
								type="date"
								value={taskDueDate}
								onChange={(e) => setTaskDueDate(e.target.value)}
								className={inputClasses}
							/>
						</div>
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
							Description
						</label>
						<textarea
							value={taskDescription}
							onChange={(e) => setTaskDescription(e.target.value)}
							rows={3}
							className={cn(inputClasses, "resize-none")}
							placeholder="Détails de la tâche"
						/>
					</div>
				</div>
				<ModalFooter>
					<Button
						variant="ghost"
						onClick={() => {
							setIsCreateModalOpen(false);
							resetCreateTask();
						}}
					>
						Annuler
					</Button>
					<Button onClick={handleCreateTask} disabled={isSubmitting}>
						{isSubmitting ? "Création..." : "Créer"}
					</Button>
				</ModalFooter>
			</Modal>
		</PageContainer>
	);
}
