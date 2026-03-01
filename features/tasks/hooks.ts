"use client";

// React
import { useState, useMemo, useCallback } from "react";
import { useDataStore } from "@/store/data.store";
import type { Task, TaskStatusValue, TaskPriorityValue, TaskFormData } from "./types";


/**
 * Manages task list state with search, status, and priority filtering
 * @returns Tasks state, filters, and filtered results
 */
export function useTasks() {
	// State
	const storeTasks = useDataStore((s) => s.tasks);
	const [tasks, setTasks] = useState<Task[]>(storeTasks);
	const [isLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<TaskStatusValue | "">("");
	const [priorityFilter, setPriorityFilter] = useState<TaskPriorityValue | "">("");

	// Computed
	const filteredTasks = useMemo(() => {
		return tasks.filter((task) => {
			const matchesSearch =
				!search ||
				task.title.toLowerCase().includes(search.toLowerCase()) ||
				task.description?.toLowerCase().includes(search.toLowerCase()) ||
				task.assignee.name.toLowerCase().includes(search.toLowerCase());

			const matchesStatus = !statusFilter || task.status === statusFilter;
			const matchesPriority = !priorityFilter || task.priority === priorityFilter;

			return matchesSearch && matchesStatus && matchesPriority;
		});
	}, [tasks, search, statusFilter, priorityFilter]);

	return {
		tasks,
		setTasks,
		isLoading,
		search,
		setSearch,
		statusFilter,
		setStatusFilter,
		priorityFilter,
		setPriorityFilter,
		filteredTasks,
	};
}

/**
 * Provides CRUD and toggle actions for task management
 * @param tasks - Current tasks array
 * @param setTasks - State setter for tasks
 * @returns Task CRUD and toggle functions with loading state
 */
export function useTaskActions(tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) {
	// State
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Creates a new task from form data
	 * @param data - Task form data
	 * @returns Nothing
	 */
	const createTask = useCallback(
		(data: TaskFormData) => {
			setIsLoading(true);
			const newTask: Task = {
				id: `task-${Date.now()}`,
				title: data.title,
				description: data.description || undefined,
				status: data.status,
				priority: data.priority,
				assignee: { userId: "", name: data.assignee },
				dueDate: data.dueDate || undefined,
				projectId: data.projectId || undefined,
				createdAt: new Date().toISOString().split("T")[0],
			};
			setTasks((prev) => [newTask, ...prev]);
			setIsLoading(false);
		},
		[setTasks],
	);

	/**
	 * Updates an existing task by ID
	 * @param id - Task ID to update
	 * @param data - Partial task form data to merge
	 * @returns Nothing
	 */
	const updateTask = useCallback(
		(id: string, data: Partial<TaskFormData>) => {
			setIsLoading(true);
			setTasks((prev) =>
				prev.map((task) => {
					if (task.id !== id) return task;
					return {
						...task,
						...(data.title !== undefined && { title: data.title }),
						...(data.description !== undefined && { description: data.description }),
						...(data.status !== undefined && { status: data.status }),
						...(data.priority !== undefined && { priority: data.priority }),
						...(data.assignee !== undefined && { assignee: { userId: "", name: data.assignee } }),
						...(data.dueDate !== undefined && { dueDate: data.dueDate }),
						...(data.projectId !== undefined && { projectId: data.projectId }),
					};
				}),
			);
			setIsLoading(false);
		},
		[setTasks],
	);

	/**
	 * Deletes a task by ID
	 * @param id - Task ID to delete
	 * @returns Nothing
	 */
	const deleteTask = useCallback(
		(id: string) => {
			setIsLoading(true);
			setTasks((prev) => prev.filter((task) => task.id !== id));
			setIsLoading(false);
		},
		[setTasks],
	);

	/**
	 * Cycles a task status through todo, in_progress, done
	 * @param id - Task ID to toggle
	 * @returns Nothing
	 */
	const toggleTask = useCallback(
		(id: string) => {
			setTasks((prev) =>
				prev.map((task) => {
					if (task.id !== id) return task;
					const nextStatus: Record<TaskStatusValue, TaskStatusValue> = {
						todo: "in_progress",
						in_progress: "done",
						done: "todo",
					};
					return { ...task, status: nextStatus[task.status] };
				}),
			);
		},
		[setTasks],
	);

	return { createTask, updateTask, deleteTask, toggleTask, isLoading };
}
