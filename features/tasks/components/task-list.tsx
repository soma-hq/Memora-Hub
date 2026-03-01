"use client";

// React
import { useMemo } from "react";
import { Input, SelectMenu, Icon, Badge, EmptyState } from "@/components/ui";
import type { SelectMenuOption } from "@/components/ui";
import { TaskCard } from "./task-card";
import { cn } from "@/lib/utils/cn";
import type { Task, TaskStatusValue, TaskPriorityValue } from "../types";
import { statusVariantMap, TaskStatusLabel, TaskPriorityLabel } from "../types";
import { TaskStatus, TaskPriority } from "@/constants";


/** Status filter options including a "show all" entry */
const STATUS_OPTIONS: SelectMenuOption[] = [
	{ label: "Tous les statuts", value: "", icon: "filter" },
	...Object.entries(TaskStatusLabel).map(
		([value, label]) =>
			({
				label,
				value,
				icon: value === "todo" ? "clock" : value === "in_progress" ? "tasks" : "check",
			}) as SelectMenuOption,
	),
];

/** Priority filter options including a "show all" entry */
const PRIORITY_OPTIONS: SelectMenuOption[] = [
	{ label: "Toutes les priorites", value: "", icon: "flag" },
	...Object.entries(TaskPriorityLabel).map(([value, label]) => ({ label, value, icon: "flag" }) as SelectMenuOption),
];

/** Props for the TaskList component */
interface TaskListProps {
	tasks: Task[];
	search: string;
	onSearchChange: (value: string) => void;
	statusFilter: TaskStatusValue | "";
	onStatusFilterChange: (value: TaskStatusValue | "") => void;
	priorityFilter: TaskPriorityValue | "";
	onPriorityFilterChange: (value: TaskPriorityValue | "") => void;
	onToggle?: (id: string) => void;
	onTaskClick?: (task: Task) => void;
	className?: string;
}

/**
 * Filterable task list grouped by status sections
 * @param props - Component props
 * @param props.tasks - Array of tasks to display
 * @param props.search - Current search query
 * @param props.onSearchChange - Callback when search query changes
 * @param props.statusFilter - Current status filter
 * @param props.onStatusFilterChange - Callback when status filter changes
 * @param props.priorityFilter - Current priority filter
 * @param props.onPriorityFilterChange - Callback when priority filter changes
 * @param props.onToggle - Callback to toggle a task status
 * @param props.onTaskClick - Callback when a task card is clicked
 * @param props.className - Additional CSS classes
 * @returns Task list with filters and grouped sections
 */
export function TaskList({
	tasks,
	search,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	priorityFilter,
	onPriorityFilterChange,
	onToggle,
	onTaskClick,
	className,
}: TaskListProps) {
	// Computed
	const groupedTasks = useMemo(() => {
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

	const visibleStatuses = statusFilter ? [statusFilter] : Object.values(TaskStatus);

	// Render
	return (
		<div className={cn("space-y-6", className)}>
			<div className="flex flex-col gap-3 sm:flex-row">
				<div className="flex-1">
					<Input
						placeholder="Rechercher une tache..."
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						icon={<Icon name="search" size="sm" />}
					/>
				</div>
				<div className="flex gap-3">
					<SelectMenu
						options={STATUS_OPTIONS}
						value={statusFilter}
						onChange={(val) => onStatusFilterChange(val as TaskStatusValue | "")}
						triggerIcon="filter"
						placeholder="Tous les statuts"
					/>
					<SelectMenu
						options={PRIORITY_OPTIONS}
						value={priorityFilter}
						onChange={(val) => onPriorityFilterChange(val as TaskPriorityValue | "")}
						triggerIcon="flag"
						placeholder="Toutes les priorites"
					/>
				</div>
			</div>

			{tasks.length === 0 && (
				<EmptyState
					icon="tasks"
					title="Aucune tache trouvee"
					description="Essayez de modifier vos filtres ou creez une nouvelle tache."
				/>
			)}

			{visibleStatuses.map((status) => {
				const statusTasks = groupedTasks[status];
				if (statusTasks.length === 0) return null;

				return (
					<section key={status}>
						<div className="mb-3 flex items-center gap-2">
							<Badge variant={statusVariantMap[status]}>{TaskStatusLabel[status]}</Badge>
							<span className="text-xs font-medium text-gray-400">
								{statusTasks.length} tache{statusTasks.length > 1 ? "s" : ""}
							</span>
							<div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
						</div>

						<div className="space-y-2">
							{statusTasks.map((task) => (
								<TaskCard key={task.id} task={task} onToggle={onToggle} onClick={onTaskClick} />
							))}
						</div>
					</section>
				);
			})}
		</div>
	);
}
