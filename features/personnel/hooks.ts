"use client";

// React
import { useState, useMemo, useCallback } from "react";
import { TaskStatus as TaskStatusEnum } from "@/constants";
import { useDataStore } from "@/store/data.store";
import type {

	Absence,
	AbsenceStatus,
	PlanningEvent,
	PlanningEventType,
	PersonalProject,
	ProjectStatus,
	PersonalTask,
	TaskPriority,
	TaskStatus,
	UnifiedPlanningItem,
	UnifiedItemType,
} from "./types";

/**
 * Manages user absence requests with active and archived filtering
 * @returns Absence state, active/archived lists, and CRUD functions
 */
export function useAbsences() {
	// State
	const [absences, setAbsences] = useState<Absence[]>([]);

	// Computed
	const today = new Date().toISOString().split("T")[0];

	const activeAbsences = useMemo(() => {
		return absences.filter((a) => a.status !== "acknowledged" && a.endDate >= today).slice(0, 2);
	}, [absences, today]);

	const archivedAbsences = useMemo(() => {
		return absences.filter((a) => a.status === "acknowledged" || a.endDate < today);
	}, [absences, today]);

	const canAddAbsence = activeAbsences.length < 2;

	// Handlers
	/**
	 * Creates a new absence request with pending status
	 * @param data - Absence dates and reason
	 * @returns Newly created absence
	 */
	const addAbsence = useCallback((data: { startDate: string; endDate: string; reason: string }) => {
		const newAbsence: Absence = {
			id: `abs-${Date.now()}`,
			startDate: data.startDate,
			endDate: data.endDate,
			reason: data.reason,
			status: "pending",
			submittedAt: new Date().toISOString().split("T")[0],
		};
		setAbsences((prev) => [newAbsence, ...prev]);
		return newAbsence;
	}, []);

	/**
	 * Updates the status of an absence request
	 * @param absenceId - Absence ID to update
	 * @param status - New absence status
	 * @param respondedBy - Name of the person who responded
	 * @returns Nothing
	 */
	const acknowledgeAbsence = useCallback((absenceId: string, status: AbsenceStatus, respondedBy: string) => {
		setAbsences((prev) =>
			prev.map((a) =>
				a.id === absenceId
					? {
							...a,
							status,
							respondedAt: new Date().toISOString().split("T")[0],
							respondedBy,
						}
					: a,
			),
		);
	}, []);

	return {
		absences,
		activeAbsences,
		archivedAbsences,
		canAddAbsence,
		addAbsence,
		acknowledgeAbsence,
	};
}

/** Maps a planning event type to a unified item type */
function toUnifiedType(eventType: PlanningEventType): UnifiedItemType {
	if (eventType === "meeting") return "meeting";
	if (eventType === "personal") return "personal";
	return "event";
}

/**
 * Manages calendar planning events with month navigation and CRUD
 * @param userId - Optional user ID to include cross-source items (meetings, tasks, projects)
 * @returns Events state, month navigation, filtered lists, unified items, and CRUD functions
 */
export function usePlanning(userId?: string) {
	// State
	const [events, setEvents] = useState<PlanningEvent[]>([]);
	const [currentMonth, setCurrentMonth] = useState(() => {
		const now = new Date();
		return { year: now.getFullYear(), month: now.getMonth() };
	});

	// Store data for cross-source unified items
	const meetings = useDataStore((s) => s.meetings);
	const tasks = useDataStore((s) => s.tasks);
	const projects = useDataStore((s) => s.projects);

	// Handlers
	/**
	 * Navigates to the next month
	 * @returns Nothing
	 */
	const goToNextMonth = useCallback(() => {
		setCurrentMonth((prev) => {
			if (prev.month === 11) return { year: prev.year + 1, month: 0 };
			return { ...prev, month: prev.month + 1 };
		});
	}, []);

	/**
	 * Navigates to the previous month
	 * @returns Nothing
	 */
	const goToPrevMonth = useCallback(() => {
		setCurrentMonth((prev) => {
			if (prev.month === 0) return { year: prev.year - 1, month: 11 };
			return { ...prev, month: prev.month - 1 };
		});
	}, []);

	/**
	 * Navigates back to the current month
	 * @returns Nothing
	 */
	const goToToday = useCallback(() => {
		const now = new Date();
		setCurrentMonth({ year: now.getFullYear(), month: now.getMonth() });
	}, []);

	// Computed
	const monthEvents = useMemo(() => {
		return events.filter((e) => {
			const d = new Date(e.date);
			return d.getFullYear() === currentMonth.year && d.getMonth() === currentMonth.month;
		});
	}, [events, currentMonth]);

	const upcomingEvents = useMemo(() => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const weekLater = new Date(now);
		weekLater.setDate(weekLater.getDate() + 7);

		return events
			.filter((e) => {
				const d = new Date(e.date);
				d.setHours(0, 0, 0, 0);
				return d >= now && d <= weekLater;
			})
			.sort((a, b) => {
				const dateCompare = a.date.localeCompare(b.date);
				if (dateCompare !== 0) return dateCompare;
				return a.startTime.localeCompare(b.startTime);
			});
	}, [events]);

	// Unified items from all data sources
	const unifiedItems = useMemo(() => {
		const items: UnifiedPlanningItem[] = [];

		// Planning events from local state
		const relevantEvents = userId ? events.filter((e) => e.authorId === userId || e.isPublic) : events;
		for (const evt of relevantEvents) {
			items.push({
				id: evt.id,
				title: evt.title,
				date: evt.date,
				startTime: evt.startTime,
				endTime: evt.endTime,
				type: toUnifiedType(evt.type),
				source: "planning",
			});
		}

		// Skip store data if no userId provided
		if (!userId) {
			items.sort((a, b) => {
				const dateCompare = a.date.localeCompare(b.date);
				if (dateCompare !== 0) return dateCompare;
				return a.startTime.localeCompare(b.startTime);
			});
			return items;
		}

		// Meetings from the store
		const userMeetings = meetings.filter((m) => m.participants.some((p) => p.userId === userId));
		for (const m of userMeetings) {
			items.push({
				id: `store-meeting-${m.id}`,
				title: m.title,
				date: m.date,
				startTime: m.startTime,
				endTime: m.endTime,
				type: "meeting",
				source: "meeting",
			});
		}

		// Tasks with due dates from the store
		const userTasks = tasks.filter((t) => t.assignee.userId === userId && t.dueDate);
		for (const t of userTasks) {
			items.push({
				id: `store-task-${t.id}`,
				title: t.title,
				date: t.dueDate!,
				startTime: "09:00",
				endTime: "09:30",
				type: "task",
				source: "task",
			});
		}

		// Project deadlines from the store
		const userProjects = projects.filter((p) => p.members.some((m) => m.userId === userId));
		for (const p of userProjects) {
			items.push({
				id: `store-project-${p.id}`,
				title: `Echeance — ${p.name}`,
				date: p.endDate,
				startTime: "00:00",
				endTime: "23:59",
				type: "deadline",
				source: "project",
			});
		}

		// Sort by date, then startTime
		items.sort((a, b) => {
			const dateCompare = a.date.localeCompare(b.date);
			if (dateCompare !== 0) return dateCompare;
			return a.startTime.localeCompare(b.startTime);
		});

		return items;
	}, [events, userId, meetings, tasks, projects]);

	/**
	 * Creates a new planning event
	 * @param data - Event data without ID
	 * @returns Newly created event
	 */
	const addEvent = useCallback((data: Omit<PlanningEvent, "id">) => {
		const newEvent: PlanningEvent = {
			...data,
			id: `evt-${Date.now()}`,
		};
		setEvents((prev) => [...prev, newEvent]);
		return newEvent;
	}, []);

	/**
	 * Updates an existing planning event
	 * @param eventId - Event ID to update
	 * @param data - Partial event data to merge
	 * @returns Nothing
	 */
	const updateEvent = useCallback((eventId: string, data: Partial<PlanningEvent>) => {
		setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, ...data } : e)));
	}, []);

	/**
	 * Deletes a planning event by ID
	 * @param eventId - Event ID to delete
	 * @returns Nothing
	 */
	const deleteEvent = useCallback((eventId: string) => {
		setEvents((prev) => prev.filter((e) => e.id !== eventId));
	}, []);

	return {
		events,
		monthEvents,
		upcomingEvents,
		unifiedItems,
		currentMonth,
		goToNextMonth,
		goToPrevMonth,
		goToToday,
		addEvent,
		updateEvent,
		deleteEvent,
	};
}

/**
 * Manages personal projects with search and status filtering
 * @returns Projects state, filters, and filtered results
 */
export function usePersonalProjects() {
	// State
	const [projects] = useState<PersonalProject[]>([]);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<ProjectStatus | "">("");

	// Computed
	const filteredProjects = useMemo(() => {
		return projects.filter((p) => {
			const matchesSearch =
				!search ||
				p.name.toLowerCase().includes(search.toLowerCase()) ||
				p.description.toLowerCase().includes(search.toLowerCase());
			const matchesStatus = !statusFilter || p.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [projects, search, statusFilter]);

	return {
		projects,
		filteredProjects,
		search,
		setSearch,
		statusFilter,
		setStatusFilter,
	};
}

/**
 * Manages personal tasks with search, priority, and status filtering
 * @returns Tasks state, filters, grouped tasks, and update function
 */
export function usePersonalTasks() {
	// State
	const [tasks, setTasks] = useState<PersonalTask[]>([]);
	const [search, setSearch] = useState("");
	const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
	const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");

	// Computed
	const filteredTasks = useMemo(() => {
		return tasks.filter((t) => {
			const matchesSearch =
				!search ||
				t.title.toLowerCase().includes(search.toLowerCase()) ||
				(t.projectName && t.projectName.toLowerCase().includes(search.toLowerCase()));
			const matchesPriority = !priorityFilter || t.priority === priorityFilter;
			const matchesStatus = !statusFilter || t.status === statusFilter;
			return matchesSearch && matchesPriority && matchesStatus;
		});
	}, [tasks, search, priorityFilter, statusFilter]);

	const todoTasks = useMemo(() => filteredTasks.filter((t) => t.status === TaskStatusEnum.Todo), [filteredTasks]);
	const inProgressTasks = useMemo(
		() => filteredTasks.filter((t) => t.status === TaskStatusEnum.InProgress),
		[filteredTasks],
	);
	const doneTasks = useMemo(() => filteredTasks.filter((t) => t.status === TaskStatusEnum.Done), [filteredTasks]);

	// Handlers
	/**
	 * Updates the status of a personal task
	 * @param taskId - Task ID to update
	 * @param status - New task status
	 * @returns Nothing
	 */
	const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
		setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
	}, []);

	return {
		tasks,
		filteredTasks,
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
	};
}
