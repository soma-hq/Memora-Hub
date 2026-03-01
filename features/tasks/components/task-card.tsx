"use client";

// Components
import { Card, Badge, Avatar, Checkbox, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Task } from "../types";
import { statusVariantMap, priorityVariantMap } from "../types";


/** Props for the TaskCard component */
interface TaskCardProps {
	task: Task;
	onToggle?: (id: string) => void;
	onClick?: (task: Task) => void;
	className?: string;
}

/**
 * Task card with checkbox, status and priority badges, and assignee avatar
 * @param props - Component props
 * @param props.task - Task data to display
 * @param props.onToggle - Callback to toggle the task completion
 * @param props.onClick - Callback when the card is clicked
 * @param props.className - Additional CSS classes
 * @returns Task list item card
 */
export function TaskCard({ task, onToggle, onClick, className }: TaskCardProps) {
	// Computed
	const isComplete = task.status === "done";
	const subtasksDone = task.subtasks?.filter((st) => st.done).length ?? 0;
	const subtasksTotal = task.subtasks?.length ?? 0;

	// Render
	return (
		<Card
			hover
			padding="sm"
			className={cn("group transition-all duration-200", isComplete && "opacity-75", className)}
			onClick={() => onClick?.(task)}
		>
			<div className="flex items-start gap-3">
				<div
					className="pt-0.5"
					onClick={(e) => {
						e.stopPropagation();
						onToggle?.(task.id);
					}}
				>
					<Checkbox checked={isComplete} readOnly />
				</div>

				<div className="min-w-0 flex-1">
					<div className="mb-1.5 flex items-start justify-between gap-2">
						<h4
							className={cn(
								"truncate text-sm font-medium text-gray-900 dark:text-white",
								isComplete && "text-gray-400 line-through dark:text-gray-500",
							)}
						>
							{task.title}
						</h4>
					</div>

					{task.projectName && (
						<p className="mb-2 truncate text-xs text-gray-400">
							<Icon name="folder" size="xs" className="-mt-0.5 mr-1 inline" />
							{task.projectName}
						</p>
					)}

					<div className="flex flex-wrap items-center gap-2">
						<Badge variant={statusVariantMap[task.status]}>{task.status}</Badge>
						<Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>

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
			</div>
		</Card>
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
