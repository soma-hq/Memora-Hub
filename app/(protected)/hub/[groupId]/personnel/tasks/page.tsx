"use client";

// Features & Components
import { PageContainer } from "@/components/layout/page-container";
import { Badge, Icon } from "@/components/ui";
import { usePersonalTasks } from "@/features/personnel/hooks";
import {

	taskPriorityVariantMap,
	taskPriorityLabels,
	TASK_PRIORITIES,
	TASK_STATUSES,
	taskStatusLabels,
} from "@/features/personnel/types";

// Utils & hooks
import { cn } from "@/lib/utils/cn";
import type { PersonalTask, TaskPriority, TaskStatus } from "@/features/personnel/types";


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

function PersonalTaskCard({ task }: { task: PersonalTask }) {
	return (
		<div
			className={cn(
				"rounded-lg border bg-white p-3",
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

			{/* Assigned by */}
			{task.assignedBy && (
				<p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">Assignée par {task.assignedBy}</p>
			)}
		</div>
	);
}

function TaskColumn({ config, tasks }: { config: ColumnConfig; tasks: PersonalTask[] }) {
	return (
		<div
			className={cn(
				"flex min-w-[260px] flex-1 flex-col rounded-xl border border-gray-200 dark:border-gray-700",
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
					<PersonalTaskCard key={task.id} task={task} />
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
	} = usePersonalTasks();

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
		<PageContainer title="Mes tâches" description="Visualisez et suivez l'avancement de vos tâches personnelles.">
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
			<div className="flex gap-4 overflow-x-auto pb-4">
				{COLUMNS.map((col) => {
					let tasks: PersonalTask[] = [];
					if (col.status === "todo") tasks = todoTasks;
					else if (col.status === "in_progress") tasks = inProgressTasks;
					else if (col.status === "done") tasks = doneTasks;

					return <TaskColumn key={col.status} config={col} tasks={tasks} />;
				})}
			</div>
		</PageContainer>
	);
}
