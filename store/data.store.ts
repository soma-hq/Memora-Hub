import { create } from "zustand";
import type { UserProfile } from "@/features/users/types";
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";
import type { Meeting } from "@/features/meetings/types";
import type { Absence } from "@/features/absences/types";


/** Project statuses considered archived */
const ARCHIVED_PROJECT_STATUSES = new Set(["done", "complete", "archived"]);

/** Task statuses considered archived */
const ARCHIVED_TASK_STATUSES = new Set(["done"]);

/** Checks whether a meeting is upcoming based on its date + endTime */
function isMeetingUpcoming(meeting: Meeting): boolean {
	const now = new Date();
	const meetingEnd = new Date(`${meeting.date}T${meeting.endTime}`);
	return meetingEnd >= now;
}

/** Partitioned project lists for a user */
interface UserProjects {
	active: Project[];
	archived: Project[];
}

/** Partitioned task lists for a user */
interface UserTasks {
	active: Task[];
	archived: Task[];
}

/** Partitioned meeting lists for a user */
interface UserMeetings {
	upcoming: Meeting[];
	past: Meeting[];
}

/** Global data state with query and CRUD methods */
interface DataState {
	// State
	users: UserProfile[];
	projects: Project[];
	tasks: Task[];
	meetings: Meeting[];
	absences: Absence[];

	// Query methods
	getUserById: (userId: string) => UserProfile | undefined;
	getUserProjects: (userId: string) => UserProjects;
	getUserTasks: (userId: string) => UserTasks;
	getUserMeetings: (userId: string) => UserMeetings;
	getUserAbsences: (userId: string) => Absence[];

	// CRUD: Projects
	addProject: (project: Project) => void;
	updateProject: (id: string, data: Partial<Project>) => void;
	removeProject: (id: string) => void;

	// CRUD: Tasks
	addTask: (task: Task) => void;
	updateTask: (id: string, data: Partial<Task>) => void;
	removeTask: (id: string) => void;

	// CRUD: Meetings
	addMeeting: (meeting: Meeting) => void;
	updateMeeting: (id: string, data: Partial<Meeting>) => void;
	removeMeeting: (id: string) => void;

	// CRUD: Absences
	addAbsence: (absence: Absence) => void;
	updateAbsence: (id: string, data: Partial<Absence>) => void;
	removeAbsence: (id: string) => void;
}

/**
 * Zustand store for all entity data with query helpers and CRUD operations.
 * @returns {DataState} Complete data state with all actions
 */
export const useDataStore = create<DataState>((set, get) => ({
	// Initial state — empty
	users: [],
	projects: [],
	tasks: [],
	meetings: [],
	absences: [],

	// ── Query methods ──────────────────────────────────────────────

	/**
	 * Finds a user profile by ID.
	 * @param userId - User identifier
	 * @returns Matching user profile or undefined
	 */
	getUserById: (userId) => get().users.find((u) => u.id === userId),

	/**
	 * Returns a user's projects partitioned into active and archived.
	 * A project is archived when its status is done, complete, or archived.
	 * @param userId - User identifier
	 * @returns Active and archived project arrays
	 */
	getUserProjects: (userId) => {
		const userProjects = get().projects.filter((p) => p.members.some((m) => m.userId === userId));
		const active: Project[] = [];
		const archived: Project[] = [];
		for (const project of userProjects) {
			if (ARCHIVED_PROJECT_STATUSES.has(project.status)) {
				archived.push(project);
			} else {
				active.push(project);
			}
		}
		return { active, archived };
	},

	/**
	 * Returns a user's tasks partitioned into active and archived.
	 * A task is archived when its status is done.
	 * @param userId - User identifier
	 * @returns Active and archived task arrays
	 */
	getUserTasks: (userId) => {
		const userTasks = get().tasks.filter((t) => t.assignee.userId === userId);
		const active: Task[] = [];
		const archived: Task[] = [];
		for (const task of userTasks) {
			if (ARCHIVED_TASK_STATUSES.has(task.status)) {
				archived.push(task);
			} else {
				active.push(task);
			}
		}
		return { active, archived };
	},

	/**
	 * Returns a user's meetings partitioned into upcoming and past.
	 * A meeting is upcoming when its date+endTime is >= now.
	 * @param userId - User identifier
	 * @returns Upcoming and past meeting arrays
	 */
	getUserMeetings: (userId) => {
		const userMeetings = get().meetings.filter((m) => m.participants.some((p) => p.userId === userId));
		const upcoming: Meeting[] = [];
		const past: Meeting[] = [];
		for (const meeting of userMeetings) {
			if (isMeetingUpcoming(meeting)) {
				upcoming.push(meeting);
			} else {
				past.push(meeting);
			}
		}
		return { upcoming, past };
	},

	/**
	 * Returns all absences for a given user.
	 * @param userId - User identifier
	 * @returns Absence array for the user
	 */
	getUserAbsences: (userId) => get().absences.filter((a) => a.userId === userId),

	// ── CRUD: Projects ─────────────────────────────────────────────

	/** Adds a project to the store */
	addProject: (project) => set((s) => ({ projects: [project, ...s.projects] })),

	/** Updates a project by ID */
	updateProject: (id, data) =>
		set((s) => ({
			projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
		})),

	/** Removes a project by ID */
	removeProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

	// ── CRUD: Tasks ────────────────────────────────────────────────

	/** Adds a task to the store */
	addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),

	/** Updates a task by ID */
	updateTask: (id, data) =>
		set((s) => ({
			tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
		})),

	/** Removes a task by ID */
	removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

	// ── CRUD: Meetings ─────────────────────────────────────────────

	/** Adds a meeting to the store */
	addMeeting: (meeting) => set((s) => ({ meetings: [meeting, ...s.meetings] })),

	/** Updates a meeting by ID */
	updateMeeting: (id, data) =>
		set((s) => ({
			meetings: s.meetings.map((m) => (m.id === id ? { ...m, ...data } : m)),
		})),

	/** Removes a meeting by ID */
	removeMeeting: (id) => set((s) => ({ meetings: s.meetings.filter((m) => m.id !== id) })),

	// ── CRUD: Absences ─────────────────────────────────────────────

	/** Adds an absence to the store */
	addAbsence: (absence) => set((s) => ({ absences: [absence, ...s.absences] })),

	/** Updates an absence by ID */
	updateAbsence: (id, data) =>
		set((s) => ({
			absences: s.absences.map((a) => (a.id === id ? { ...a, ...data } : a)),
		})),

	/** Removes an absence by ID */
	removeAbsence: (id) => set((s) => ({ absences: s.absences.filter((a) => a.id !== id) })),
}));
