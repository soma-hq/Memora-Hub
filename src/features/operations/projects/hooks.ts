"use client";

// React
import { useState, useMemo, useCallback } from "react";
import { useDataStore } from "@/store/data.store";
import type { Project, ProjectStatusValue, ProjectFormData, ProjectPriorityValue } from "./types";


/**
 * Manages project list state with search, status, and priority filtering.
 * @returns {object} Projects state, filters, and filtered results
 */
export function useProjects() {
	// State
	const storeProjects = useDataStore((s) => s.projects);
	const [projects, setProjects] = useState<Project[]>(storeProjects);
	const [isLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<ProjectStatusValue | "all">("all");
	const [priorityFilter, setPriorityFilter] = useState<ProjectPriorityValue | "all">("all");

	// Computed
	const filteredProjects = useMemo(() => {
		return projects.filter((project) => {
			const matchesSearch =
				search.trim() === "" ||
				project.name.toLowerCase().includes(search.toLowerCase()) ||
				project.description.toLowerCase().includes(search.toLowerCase());

			const matchesStatus = statusFilter === "all" || project.status === statusFilter;
			const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;

			return matchesSearch && matchesStatus && matchesPriority;
		});
	}, [projects, search, statusFilter, priorityFilter]);

	return {
		projects,
		setProjects,
		isLoading,
		search,
		setSearch,
		statusFilter,
		setStatusFilter,
		priorityFilter,
		setPriorityFilter,
		filteredProjects,
	};
}

/**
 * Provides CRUD actions for project management.
 * @returns {object} Create, update, and delete project functions with loading state
 */
export function useProjectActions() {
	// State
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Creates a new project from form data.
	 * @param {ProjectFormData} data - Project form data
	 * @returns {Promise<Project>} Newly created project with generated ID
	 */
	const createProject = useCallback(async (data: ProjectFormData): Promise<Project> => {
		setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 600));

		const now = new Date().toISOString();
		const responsible = data.responsible ?? { userId: "", name: "Non assigné", role: "Responsable" };
		const assistants = data.assistants ?? [];
		const newProject: Project = {
			id: `proj-${Date.now()}`,
			name: data.name,
			emoji: data.emoji || "📁",
			description: data.description,
			status: data.status,
			priority: data.priority ?? "P2",
			startDate: data.startDate,
			endDate: data.endDate,
			responsible,
			assistants,
			members: [responsible, ...assistants],
			tasks: { total: 0, done: 0, inProgress: 0, todo: 0 },
			progress: 0,
			relations: { tasks: [], communications: [], contents: [], creations: [], ideas: [] },
			timeline: [
				{
					id: `tl-${Date.now()}`,
					action: "project_created",
					timestamp: now,
					user: responsible.name,
					description: "Projet cree",
				},
			],
		};

		setIsLoading(false);
		return newProject;
	}, []);

	/**
	 * Updates an existing project by ID.
	 * @param {string} id - Project ID to update
	 * @param {Partial<ProjectFormData>} data - Partial project form data to merge
	 * @returns {Promise<Project>} Updated project object
	 */
	const updateProject = useCallback(async (id: string, data: Partial<ProjectFormData>): Promise<Project> => {
		setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 600));

		const updated: Project = {
			id,
			name: data.name ?? "",
			emoji: data.emoji ?? "📁",
			description: data.description ?? "",
			status: data.status ?? "todo",
			priority: data.priority ?? "P3",
			startDate: data.startDate ?? "",
			endDate: data.endDate ?? "",
			responsible: data.responsible ?? { userId: "", name: "", role: "" },
			assistants: data.assistants ?? [],
			members: data.members ?? [],
			tasks: { total: 0, done: 0, inProgress: 0, todo: 0 },
			progress: 0,
			relations: { tasks: [], communications: [], contents: [], creations: [], ideas: [] },
			timeline: [],
		};

		setIsLoading(false);
		return updated;
	}, []);

	/**
	 * Deletes a project by ID.
	 * @param {string} id - Project ID to delete
	 * @returns {Promise<void>}
	 */
	const deleteProject = useCallback(async (id: string): Promise<void> => {
		setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 400));
		setIsLoading(false);
		void id;
	}, []);

	return {
		createProject,
		updateProject,
		deleteProject,
		isLoading,
	};
}
