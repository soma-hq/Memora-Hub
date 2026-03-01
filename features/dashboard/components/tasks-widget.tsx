"use client";

// React
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Card, CardHeader, CardBody, Badge, Avatar, Checkbox } from "@/components/ui";
import type { BadgeVariant } from "@/core/design/states";


/** Task item for the dashboard widget */
interface TaskItem {
	id: string;
	title: string;
	priority: "Haute" | "Moyenne" | "Basse";
	assignee: { name: string; avatar?: string };
	done: boolean;
}

/** Props for the TasksWidget component */
interface TasksWidgetProps {
	className?: string;
}

/** Badge variant mapping for task priorities */
const priorityVariantMap: Record<string, BadgeVariant> = {
	Haute: "error",
	Moyenne: "warning",
	Basse: "neutral",
};

/**
 * Dashboard widget showing recent tasks with toggle completion
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @returns Task list card with checkboxes and priority badges
 */
export function TasksWidget({ className }: TasksWidgetProps) {
	// State
	const [tasks, setTasks] = useState<TaskItem[]>([]);

	// Handlers
	/**
	 * Toggles the completion state of a task
	 * @param id - Task ID to toggle
	 * @returns Nothing
	 */
	function handleToggle(id: string) {
		setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
	}

	// Render
	return (
		<Card padding="sm" className={className}>
			<CardHeader>
				<h3 className="text-base font-semibold text-gray-900 dark:text-white">Taches recentes</h3>
				<Link
					href="/tasks"
					className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors"
				>
					Voir tout
				</Link>
			</CardHeader>

			<CardBody className="divide-y divide-gray-100 py-0 dark:divide-gray-700">
				{tasks.length === 0 && (
					<div className="flex items-center justify-center py-8">
						<p className="text-sm text-gray-400 dark:text-gray-500">Aucune tache recente.</p>
					</div>
				)}

				{tasks.map((task) => (
					<div key={task.id} className="flex items-center gap-3 py-3 first:pt-3">
						<Checkbox checked={task.done} onChange={() => handleToggle(task.id)} />

						<div className="min-w-0 flex-1">
							<p
								className={cn(
									"truncate text-sm font-medium",
									task.done ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-200",
								)}
							>
								{task.title}
							</p>
						</div>

						<Badge variant={priorityVariantMap[task.priority]} showDot={false}>
							{task.priority}
						</Badge>

						<Avatar name={task.assignee.name} src={task.assignee.avatar} size="xs" />
					</div>
				))}
			</CardBody>
		</Card>
	);
}
