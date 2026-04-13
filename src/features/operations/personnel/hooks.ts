"use client";

// React
import { useState, useMemo, useCallback, useEffect } from "react";
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

/** Maps à planning event type to a unified item type */
function toUnifiedType(eventType: PlanningEventType): UnifiedItemType {
	if (eventType === "meeting") return "meeting";
	if (eventType === "personal") return "personal";
	return "event";
}

/** Returns YYYY-MM-DD from an ISO string or Date-like input. */
function toISODateOnly(value: string | Date): string {
	const raw = typeof value === "string" ? value : value.toISOString();
	return raw.slice(0, 10);
}

interface MeetingNotesMeta {
	authorId?: string;
	authorName?: string;
	template?: string;
	isPublic?: boolean;
}

function extractMeetingMetadata(notes?: string | null): MeetingNotesMeta {
	if (!notes) return {};
	const match = notes.match(/^<!--memora:(.*?)-->\s*/);
	if (!match) return {};

	const entries = match[1].split(";").map((entry) => entry.trim());
	const meta: MeetingNotesMeta = {};
	for (const entry of entries) {
		const [rawKey, ...rest] = entry.split("=");
		const key = rawKey?.trim();
		const value = rest.join("=").trim();
		if (!key || !value) continue;
		if (key === "authorId") meta.authorId = value;
		if (key === "authorName") meta.authorName = value;
		if (key === "template") meta.template = value;
		if (key === "public") meta.isPublic = value === "1";
	}

	return meta;
}

function stripMeetingMetadata(notes?: string | null): string | undefined {
	if (!notes) return undefined;
	return notes.replace(/^<!--[\s\S]*?-->\s*/, "").trim() || undefined;
}

/**
 * Manages calendar planning events with month navigation and CRUD
 * @param userId - Optional user ID to include cross-source items (meetings, tasks, projects)
 * @returns Events state, month navigation, filtered lists, unified items, and CRUD functions
 */
export function usePlanning(groupId?: string, userId?: string) {
	// State
	const [events, setEvents] = useState<PlanningEvent[]>([]);
	const [currentMonth, setCurrentMonth] = useState(() => {
		const now = new Date();
		return { year: now.getFullYear(), month: now.getMonth() };
	});
	const [apiReady, setApiReady] = useState(false);

	// Store data for cross-source unified items
	const meetings = useDataStore((s) => s.meetings);
	const tasks = useDataStore((s) => s.tasks);
	const projects = useDataStore((s) => s.projects);

	// Load persisted meetings from API for the current group
	useEffect(() => {
		let isMounted = true;

		async function loadPlanningEvents() {
			if (!groupId) {
				setApiReady(true);
				return;
			}

			try {
				const response = await fetch(
					`/api/meetings?groupId=${encodeURIComponent(groupId)}&page=1&pageSize=100`,
					{
						cache: "no-store",
					},
				);
				if (!response.ok) throw new Error("Erreur lors du chargement du planning");

				const payload = (await response.json()) as {
					meetings?: Array<{
						id: string;
						title: string;
						date: string;
						startTime: string;
						endTime: string;
						location?: string | null;
						notes?: string | null;
					}>;
				};

				const mapped: PlanningEvent[] = (payload.meetings ?? []).map((meeting) => {
					const meta = extractMeetingMetadata(meeting.notes);
					return {
						id: meeting.id,
						title: meeting.title,
						description: stripMeetingMetadata(meeting.notes),
						date: toISODateOnly(meeting.date),
						startTime: meeting.startTime,
						endTime: meeting.endTime,
						type: "meeting",
						isPublic: meta.isPublic ?? true,
						authorId: meta.authorId ?? "server",
						authorName: meta.authorName ?? "Equipe",
						location: meeting.location ?? undefined,
					};
				});

				if (isMounted) setEvents(mapped);
			} catch {
				// Keep local state as fallback if API is unavailable.
			} finally {
				if (isMounted) setApiReady(true);
			}
		}

		void loadPlanningEvents();

		return () => {
			isMounted = false;
		};
	}, [groupId]);

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
				title: `Échéance — ${p.name}`,
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
	const addEvent = useCallback(
		async (data: Omit<PlanningEvent, "id">): Promise<boolean> => {
			const optimisticEvent: PlanningEvent = {
				...data,
				id: `evt-${Date.now()}`,
			};

			setEvents((prev) => [...prev, optimisticEvent]);

			if (!groupId) return true;

			try {
				const response = await fetch("/api/meetings", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						groupId,
						title: data.title,
						date: data.date,
						time: data.startTime,
						duration: data.endTime,
						location: data.location,
						description: data.description,
						participants: [],
					}),
				});

				if (!response.ok) {
					setEvents((prev) => prev.filter((event) => event.id !== optimisticEvent.id));
					return false;
				}

				const created = (await response.json()) as {
					id: string;
					title: string;
					date: string;
					startTime: string;
					endTime: string;
					location?: string | null;
					notes?: string | null;
				};

				setEvents((prev) =>
					prev.map((event) =>
						event.id === optimisticEvent.id
							? {
									...event,
									id: created.id,
									date: toISODateOnly(created.date),
									startTime: created.startTime,
									endTime: created.endTime,
									location: created.location ?? undefined,
									description: created.notes ?? event.description,
								}
							: event,
					),
				);

				return true;
			} catch {
				setEvents((prev) => prev.filter((event) => event.id !== optimisticEvent.id));
				return false;
			}
		},
		[groupId],
	);

	/**
	 * Updates an existing planning event
	 * @param eventId - Event ID to update
	 * @param data - Partial event data to merge
	 * @returns Nothing
	 */
	const updateEvent = useCallback(
		(eventId: string, data: Partial<PlanningEvent>) => {
			let previousEvent: PlanningEvent | null = null;

			setEvents((prev) =>
				prev.map((event) => {
					if (event.id !== eventId) return event;
					previousEvent = event;
					return { ...event, ...data };
				}),
			);

			if (!groupId || eventId.startsWith("evt-")) return;

			void (async () => {
				try {
					const response = await fetch(`/api/meetings/${encodeURIComponent(eventId)}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							title: data.title,
							description: data.description,
							date: data.date,
							time: data.startTime,
							duration: data.endTime,
							location: data.location,
						}),
					});

					if (response.ok || !previousEvent) return;

					setEvents((prev) => prev.map((event) => (event.id === eventId ? previousEvent! : event)));
				} catch {
					if (!previousEvent) return;
					setEvents((prev) => prev.map((event) => (event.id === eventId ? previousEvent! : event)));
				}
			})();
		},
		[groupId],
	);

	/**
	 * Deletes à planning event by ID
	 * @param eventId - Event ID to delete
	 * @returns Nothing
	 */
	const deleteEvent = useCallback(
		(eventId: string) => {
			let removedEvent: PlanningEvent | null = null;
			setEvents((prev) => {
				removedEvent = prev.find((event) => event.id === eventId) ?? null;
				return prev.filter((event) => event.id !== eventId);
			});

			if (!groupId || eventId.startsWith("evt-")) return;

			void (async () => {
				try {
					const response = await fetch(`/api/meetings/${encodeURIComponent(eventId)}`, {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
					});

					if (response.ok || !removedEvent) return;
					setEvents((prev) => {
						if (prev.some((event) => event.id === removedEvent!.id)) return prev;
						return [...prev, removedEvent!].sort((a, b) => {
							const dateCompare = a.date.localeCompare(b.date);
							if (dateCompare !== 0) return dateCompare;
							return a.startTime.localeCompare(b.startTime);
						});
					});
				} catch {
					if (!removedEvent) return;
					setEvents((prev) => {
						if (prev.some((event) => event.id === removedEvent!.id)) return prev;
						return [...prev, removedEvent!].sort((a, b) => {
							const dateCompare = a.date.localeCompare(b.date);
							if (dateCompare !== 0) return dateCompare;
							return a.startTime.localeCompare(b.startTime);
						});
					});
				}
			})();
		},
		[groupId],
	);

	return {
		events,
		apiReady,
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
export function usePersonalProjects(groupId?: string) {
	// State
	const [projects, setProjects] = useState<PersonalProject[]>([]);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<ProjectStatus | "">("");

	const loadProjects = useCallback(async () => {
		if (!groupId) {
			setProjects([]);
			return;
		}

		try {
			const params = new URLSearchParams({ groupId, page: "1", pageSize: "100" });
			const response = await fetch(`/api/projects/personal?${params.toString()}`, { cache: "no-store" });
			if (!response.ok) throw new Error("Erreur lors du chargement des projets");

			const payload = (await response.json()) as {
				projects?: Array<{
					id: string;
					name: string;
					description?: string | null;
					status: string;
					endDate?: string | null;
					_count?: { tasks?: number };
				}>;
			};

			const mapped: PersonalProject[] = (payload.projects ?? []).map((project) => {
				const statusMap: Record<string, ProjectStatus> = {
					todo: "active",
					in_progress: "active",
					paused: "paused",
					done: "completed",
					complete: "completed",
					archived: "cancelled",
				};

				const taskCount = project._count?.tasks ?? 0;
				const progress = taskCount > 0 ? Math.min(95, Math.round((taskCount / 10) * 100)) : 0;

				return {
					id: project.id,
					name: project.name,
					description: project.description ?? "Sans description.",
					progress,
					status: statusMap[project.status] ?? "active",
					role: "Contributeur",
					deadline: project.endDate ? toISODateOnly(project.endDate) : undefined,
				};
			});

			setProjects(mapped);
		} catch {
			setProjects([]);
		}
	}, [groupId]);

	useEffect(() => {
		void loadProjects();
	}, [loadProjects]);

	const createProject = useCallback(
		async (input: { name: string; description?: string; endDate?: string }): Promise<boolean> => {
			if (!groupId) return false;

			try {
				const response = await fetch("/api/projects", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						groupId,
						name: input.name,
						description: input.description,
						status: "todo",
						endDate: input.endDate || undefined,
					}),
				});

				if (!response.ok) return false;
				await loadProjects();
				return true;
			} catch {
				return false;
			}
		},
		[groupId, loadProjects],
	);

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
		createProject,
	};
}

/**
 * Manages personal tasks with search, priority, and status filtering
 * @returns Tasks state, filters, grouped tasks, and update function
 */
export function usePersonalTasks(groupId?: string) {
	// State
	const [tasks, setTasks] = useState<PersonalTask[]>([]);
	const [search, setSearch] = useState("");
	const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
	const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");

	const loadTasks = useCallback(async () => {
		try {
			const params = new URLSearchParams({ page: "1", pageSize: "120" });
			if (groupId) params.set("groupId", groupId);
			const response = await fetch(`/api/tasks?${params.toString()}`, { cache: "no-store" });
			if (!response.ok) throw new Error("Erreur lors du chargement des taches");

			const payload = (await response.json()) as {
				tasks?: Array<{
					id: string;
					title: string;
					priority: TaskPriority;
					status: TaskStatus;
					dueDate?: string | null;
					project?: { name?: string | null } | null;
					createdBy?: { firstName?: string | null; lastName?: string | null } | null;
				}>;
			};

			const mapped: PersonalTask[] = (payload.tasks ?? []).map((task) => ({
				id: task.id,
				title: task.title,
				projectName: task.project?.name ?? undefined,
				priority: task.priority,
				status: task.status,
				dueDate: task.dueDate ? toISODateOnly(task.dueDate) : undefined,
				assignedBy:
					[task.createdBy?.firstName, task.createdBy?.lastName].filter(Boolean).join(" ") || undefined,
			}));

			setTasks(mapped);
		} catch {
			setTasks([]);
		}
	}, [groupId]);

	useEffect(() => {
		void loadTasks();
	}, [loadTasks]);

	const createTask = useCallback(
		async (input: {
			title: string;
			projectId: string;
			priority: TaskPriority;
			dueDate?: string;
			description?: string;
		}): Promise<boolean> => {
			try {
				const meResponse = await fetch("/api/users/me", { cache: "no-store" });
				if (!meResponse.ok) return false;
				const mePayload = (await meResponse.json()) as { user?: { id?: string } };
				const assigneeId = mePayload.user?.id;
				if (!assigneeId) return false;

				const response = await fetch("/api/tasks", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						title: input.title,
						description: input.description,
						projectId: input.projectId,
						assigneeId,
						status: "todo",
						priority: input.priority,
						dueDate: input.dueDate || undefined,
					}),
				});

				if (!response.ok) return false;
				await loadTasks();
				return true;
			} catch {
				return false;
			}
		},
		[loadTasks],
	);

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
	 * Updates the status of à personal task
	 * @param taskId - Task ID to update
	 * @param status - New task status
	 * @returns Nothing
	 */
	const updateTaskStatus = useCallback(async (taskId: string, status: TaskStatus): Promise<boolean> => {
		let previousStatus: TaskStatus | null = null;
		setTasks((prev) =>
			prev.map((task) => {
				if (task.id !== taskId) return task;
				previousStatus = task.status;
				return { ...task, status };
			}),
		);

		if (previousStatus === null || previousStatus === status) return true;

		try {
			const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status }),
			});

			if (response.ok) return true;
			setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: previousStatus! } : task)));
			return false;
		} catch {
			setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: previousStatus! } : task)));
			return false;
		}
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
		createTask,
	};
}
