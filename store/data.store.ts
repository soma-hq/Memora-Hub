import { create } from "zustand";
import type { UserProfile } from "@/features/users/types";
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";
import type { Meeting } from "@/features/meetings/types";
import type { Absence } from "@/features/absences/types";
import type { RoleId } from "@/core/config/roles";
import type { Entity } from "@/core/data/entities";
import { ENTITIES } from "@/core/data/entities";
import { SEED_USERS } from "@/core/data/users";
import { getTeamForRole } from "@/core/config/teams";

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

/**
 * Convert a seed user to a UserProfile for the store.
 */
function seedToProfile(seed: (typeof SEED_USERS)[number]): UserProfile {
	const team = getTeamForRole(seed.roleId);
	return {
		id: seed.id,
		pseudo: seed.name,
		firstName: seed.name,
		lastName: "",
		email: seed.email,
		phone: "",
		birthdate: "",
		birthdayWish: false,
		languages: ["fr"],
		avatar: seed.avatar ?? `/avatars/${seed.name.toLowerCase()}.png`,
		discordUsername: "",
		discordId: "",
		social: {},
		entity: seed.entityAccess.includes("*") ? "all" : (seed.entityAccess[0] ?? ""),
		team,
		division: 0,
		roleSecondary: "",
		arrivalDate: "2024-01-15",
		roleId: seed.roleId,
		entityAccess: seed.entityAccess,
		twoFactorSecret: seed.twoFactorSecret,
		twoFactorEnabled: seed.twoFactorEnabled,
		status: "active",
		entityAccessDetails: [],
	};
}

/** Seeded user profiles from SEED_USERS */
const INITIAL_USERS: UserProfile[] = SEED_USERS.map(seedToProfile);

/** Current user type for the permission system */
interface CurrentUserState {
	id: string;
	pseudo: string;
	email: string;
	roleId: RoleId;
	entityAccess: string[];
	avatar: string;
}

/** Global data state with query and CRUD methods */
interface DataState {
	// State
	entities: Entity[];
	users: UserProfile[];
	currentUser: CurrentUserState | null;
	projects: Project[];
	tasks: Task[];
	meetings: Meeting[];
	absences: Absence[];

	// Auth actions
	setCurrentUser: (userId: string) => void;
	clearCurrentUser: () => void;

	// Entity actions
	getEntitiesForCurrentUser: () => Entity[];

	// Query methods
	getUserById: (userId: string) => UserProfile | undefined;
	getUserProjects: (userId: string) => UserProjects;
	getUserTasks: (userId: string) => UserTasks;
	getUserMeetings: (userId: string) => UserMeetings;
	getUserAbsences: (userId: string) => Absence[];

	// CRUD: Users
	updateUser: (id: string, data: Partial<UserProfile>) => void;

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
 * Pre-seeded with entities and 9 users from the data layer.
 * @returns {DataState} Complete data state with all actions
 */
export const useDataStore = create<DataState>((set, get) => ({
	// Initial state -- seeded
	entities: [...ENTITIES],
	users: INITIAL_USERS,
	currentUser: null,
	projects: [],
	tasks: [],
	meetings: [],
	absences: [],

	// ── Auth actions ──────────────────────────────────────────────

	/**
	 * Sets the current authenticated user by user ID.
	 * @param userId - User ID to set as current
	 */
	setCurrentUser: (userId) => {
		const user = get().users.find((u) => u.id === userId);
		if (!user) return;
		set({
			currentUser: {
				id: user.id,
				pseudo: user.pseudo,
				email: user.email,
				roleId: user.roleId,
				entityAccess: user.entityAccess,
				avatar: user.avatar,
			},
		});
	},

	/** Clears the current user (logout) */
	clearCurrentUser: () => set({ currentUser: null }),

	// ── Entity actions ────────────────────────────────────────────

	/**
	 * Returns entities accessible by the current user.
	 * Wildcard users get all entities. Others get only their assigned ones.
	 */
	getEntitiesForCurrentUser: () => {
		const { currentUser, entities } = get();
		if (!currentUser) return [];
		if (currentUser.entityAccess.includes("*")) return entities;
		return entities.filter((e) => currentUser.entityAccess.includes(e.id));
	},

	// ── Query methods ──────────────────────────────────────────────

	/**
	 * Finds a user profile by ID.
	 * @param userId - User identifier
	 * @returns Matching user profile or undefined
	 */
	getUserById: (userId) => get().users.find((u) => u.id === userId),

	/**
	 * Returns a user's projects partitioned into active and archived.
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

	// ── CRUD: Users ───────────────────────────────────────────────

	/** Updates a user profile by ID */
	updateUser: (id, data) =>
		set((s) => {
			const updatedUsers = s.users.map((u) => (u.id === id ? { ...u, ...data } : u));
			// Also update currentUser if it's the same user
			const currentUser = s.currentUser;
			if (currentUser && currentUser.id === id) {
				const updated = updatedUsers.find((u) => u.id === id);
				if (updated) {
					return {
						users: updatedUsers,
						currentUser: {
							...currentUser,
							pseudo: updated.pseudo,
							email: updated.email,
							roleId: updated.roleId,
							entityAccess: updated.entityAccess,
							avatar: updated.avatar,
						},
					};
				}
			}
			return { users: updatedUsers };
		}),

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
