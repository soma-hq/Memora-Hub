"use client";

// React
import { useMemo } from "react";
import { Badge, Icon, Avatar, EmptyState } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Task, TaskStatusValue } from "../types";
import { statusVariantMap, priorityVariantMap, TaskStatusLabel } from "../types";
import { TaskStatus } from "@/constants";


/** Props for the TaskBoard component */
interface TaskBoardProps {
	tasks: Task[];
	onToggle?: (id: string) => void;
	onTaskClick?: (task: Task) => void;
	className?: string;
}

/** Display labels for each task status column */
const columnLabels: Record<TaskStatusValue, string> = TaskStatusLabel;

/** Icon names for each task status column */
const columnIcons: Record<TaskStatusValue, "tasks" | "clock" | "check"> = {
	todo: "tasks",
	in_progress: "clock",
	done: "check",
};

/**
 * Kanban board view for tasks organized by status columns
 * @param props - Component props
 * @param props.tasks - Array of tasks to display
 * @param props.onToggle - Callback to cycle a task status
 * @param props.onTaskClick - Callback when a task card is clicked
 * @param props.className - Additional CSS classes
 * @returns Three-column kanban board
 */
export function TaskBoard({ tasks, onToggle, onTaskClick, className }: TaskBoardProps) {
	// Computed
	const columns = useMemo(() => {
		const groups: Record<TaskStatusValue, Task[]> = {
			todo: [],
			in_progress: [],
			done: [],
		};
		for (const task of tasks) {
			groups[task.status].push(task);
		}
		return groups;
	}, [tasks]);

	if (tasks.length === 0) {
		return (
			<EmptyState icon="tasks" title="Aucune tache" description="Creez votre premiere tache pour commencer." />
		);
	}

	// Render
	return (
		<div className={cn("grid grid-cols-1 gap-6 md:grid-cols-3", className)}>
			{Object.values(TaskStatus).map((status) => (
				<BoardColumn
					key={status}
					status={status}
					tasks={columns[status]}
					onToggle={onToggle}
					onTaskClick={onTaskClick}
				/>
			))}
		</div>
	);
}

/** Props for the BoardColumn component */
interface BoardColumnProps {
	status: TaskStatusValue;
	tasks: Task[];
	onToggle?: (id: string) => void;
	onTaskClick?: (task: Task) => void;
}

/**
 * Single column in the task kanban board
 * @param props - Component props
 * @param props.status - Status this column represents
 * @param props.tasks - Tasks to display in this column
 * @param props.onToggle - Callback to cycle a task status
 * @param props.onTaskClick - Callback when a task card is clicked
 * @returns Column with header and task cards
 */
function BoardColumn({ status, tasks, onToggle, onTaskClick }: BoardColumnProps) {
	// Render
	return (
		<div className="flex flex-col">
			<div className="mb-4 flex items-center gap-2 border-b-2 border-gray-200 pb-3 dark:border-gray-700">
				<Icon name={columnIcons[status]} size="sm" className="text-gray-400" />
				<h3 className="text-sm font-semibold text-gray-900 dark:text-white">{columnLabels[status]}</h3>
				<span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
					{tasks.length}
				</span>
			</div>

			<div className="flex min-h-[200px] flex-col gap-3">
				{tasks.length === 0 && (
					<div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-8 dark:border-gray-700">
						<p className="text-xs text-gray-400">Aucune tache</p>
					</div>
				)}

				{tasks.map((task) => (
					<BoardCard key={task.id} task={task} onToggle={onToggle} onClick={onTaskClick} />
				))}
			</div>
		</div>
	);
}

/** Props for the BoardCard component */
interface BoardCardProps {
	task: Task;
	onToggle?: (id: string) => void;
	onClick?: (task: Task) => void;
}

/**
 * Task card displayed within a kanban board column
 * @param props - Component props
 * @param props.task - Task data to display
 * @param props.onToggle - Callback to cycle the task status
 * @param props.onClick - Callback when the card is clicked
 * @returns Task card with priority, title, and metadata
 */
function BoardCard({ task, onToggle, onClick }: BoardCardProps) {
	// Computed
	const isComplete = task.status === "done";
	const subtasksDone = task.subtasks?.filter((st) => st.done).length ?? 0;
	const subtasksTotal = task.subtasks?.length ?? 0;

	// Render
	return (
		<div
			className={cn(
				"cursor-pointer rounded-xl p-3 transition-all duration-200",
				"border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
				"hover:-translate-y-0.5 hover:shadow-md",
				isComplete && "opacity-75",
			)}
			onClick={() => onClick?.(task)}
		>
			<div className="mb-2 flex items-center justify-between">
				<Badge variant={priorityVariantMap[task.priority]} showDot={false}>
					{task.priority}
				</Badge>
				{onToggle && (
					<button
						type="button"
						className="hover:text-primary-500 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
						onClick={(e) => {
							e.stopPropagation();
							onToggle(task.id);
						}}
						title="Changer le statut"
					>
						<Icon name="chevronRight" size="xs" />
					</button>
				)}
			</div>

			<h4
				className={cn(
					"mb-1 line-clamp-2 text-sm font-medium text-gray-900 dark:text-white",
					isComplete && "text-gray-400 line-through dark:text-gray-500",
				)}
			>
				{task.title}
			</h4>

			{task.projectName && <p className="mb-3 truncate text-xs text-gray-400">{task.projectName}</p>}

			<div className="flex items-center gap-2 border-t border-gray-100 pt-2 dark:border-gray-700">
				{subtasksTotal > 0 && (
					<span className="inline-flex items-center gap-1 text-xs text-gray-400">
						<Icon name="check" size="xs" />
						{subtasksDone}/{subtasksTotal}
					</span>
				)}

				{task.dueDate && (
					<span
						className={cn(
							"inline-flex items-center gap-1 text-xs",
							isOverdue(task.dueDate) && !isComplete ? "text-error-600" : "text-gray-400",
						)}
					>
						<Icon name="calendar" size="xs" />
						{formatDate(task.dueDate)}
					</span>
				)}

				<div className="flex-1" />
				<Avatar name={task.assignee.name} src={task.assignee.avatar} size="xs" />
			</div>
		</div>
	);
}

/**
 * Formats a date string to short French locale format
 * @param dateStr - ISO date string
 * @returns Formatted date string
 */
function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
	});
}

/**
 * Checks if a date is in the past
 * @param dateStr - ISO date string
 * @returns True if the date is before today
 */
function isOverdue(dateStr: string): boolean {
	return new Date(dateStr) < new Date();
}
