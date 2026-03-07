/**
 * DataService — hydration data for the client-side Zustand store.
 * Aggregates users (as UserProfile), projects, tasks, meetings and absences
 * from the database and maps them to the frontend display types.
 */

import { prisma } from "@/lib/prisma";
import type { UserProfile } from "@/features/users/types";
import type { Project, ProjectMember as FrontendProjectMember, ProjectTasks } from "@/features/projects/types";
import type { Task, TaskAssignee, Subtask } from "@/features/tasks/types";
import type { Meeting, MeetingParticipant } from "@/features/meetings/types";
import type { Absence } from "@/features/absences/types";
import type { RoleId } from "@/core/config/roles";
import { ROLE_HIERARCHY } from "@/core/config/roles";
import type { Team } from "@/core/config/teams";
import type {
	ProjectStatusValue,
	ProjectPriorityValue,
	TaskStatusValue,
	TaskPriorityValue,
	MeetingTypeValue,
	AbsenceTypeValue,
	AbsenceStatusValue,
} from "@/constants";

// ─── Mappers ───────────────────────────────────────────────────────────────

type DbUser = Awaited<ReturnType<typeof fetchUsers>>[number];
type DbProject = Awaited<ReturnType<typeof fetchProjects>>[number];
type DbTask = Awaited<ReturnType<typeof fetchTasks>>[number];
type DbMeeting = Awaited<ReturnType<typeof fetchMeetings>>[number];
type DbAbsence = Awaited<ReturnType<typeof fetchAbsences>>[number];

function mapDbUserToProfile(user: DbUser): UserProfile {
	const roleId = user.roleId && user.roleId in ROLE_HIERARCHY ? (user.roleId as RoleId) : "momentum_talent";

	return {
		id: user.id,
		pseudo: user.pseudo ?? `${user.firstName} ${user.lastName}`,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		phone: user.phone ?? "",
		birthdate: user.birthdate ?? "",
		birthdayWish: user.birthdayWish,
		languages: user.languages.length > 0 ? user.languages : ["fr"],
		avatar: user.avatar ?? "/avatar/Alpha.jpeg",

		discordUsername: user.discordUsername ?? "",
		discordId: user.discordId ?? "",

		social: {
			...(user.socialTwitter ? { twitter: user.socialTwitter } : {}),
			...(user.socialTwitch ? { twitch: user.socialTwitch } : {}),
			...(user.socialYoutube ? { youtube: user.socialYoutube } : {}),
			...(user.socialInstagram ? { instagram: user.socialInstagram } : {}),
			...(user.socialReddit ? { reddit: user.socialReddit } : {}),
		},

		entity: user.entity ?? "bazalthe",
		team: (user.team as Team) ?? ("Momentum & Talent" as Team),
		division: (user.division as 0 | 1 | 2 | 3) ?? 0,
		roleSecondary: user.roleSecondary ?? "",
		arrivalDate: user.arrivalDate ?? "",

		roleId,
		entityAccess: user.entityAccess.length > 0 ? user.entityAccess : [],
		twoFactorEnabled: user.a2fEnabled,

		status: user.status as "active" | "inactive",
		entityAccessDetails: [],
	};
}

function mapDbProjectToFrontend(project: DbProject): Project {
	const membersList = project.members.map(
		(m): FrontendProjectMember => ({
			userId: m.user.id,
			name: m.user.pseudo ?? `${m.user.firstName} ${m.user.lastName}`,
			role: m.role,
			avatar: m.user.avatar ?? undefined,
		}),
	);

	const responsible = membersList.find((m) => m.role === "owner") ??
		membersList[0] ?? { userId: "", name: "", role: "", avatar: undefined };
	const assistants = membersList.filter((m) => m.role === "assistant");

	const taskStats: ProjectTasks = {
		total: project.tasks.length,
		done: project.tasks.filter((t) => t.status === "done").length,
		inProgress: project.tasks.filter((t) => t.status === "in_progress").length,
		todo: project.tasks.filter((t) => t.status === "todo").length,
	};

	const progress = taskStats.total === 0 ? 0 : Math.round((taskStats.done / taskStats.total) * 100);

	return {
		id: project.id,
		name: project.name,
		emoji: project.emoji ?? "📁",
		description: project.description ?? "",
		status: project.status as ProjectStatusValue,
		priority: (project.priority as ProjectPriorityValue) ?? "P2",
		startDate: project.startDate?.toISOString().split("T")[0] ?? "",
		endDate: project.endDate?.toISOString().split("T")[0] ?? "",
		completedAt: project.completedAt?.toISOString().split("T")[0] ?? undefined,
		responsible,
		assistants,
		members: membersList,
		tasks: taskStats,
		progress,
		relations: { tasks: [], communications: [], contents: [], creations: [], ideas: [] },
		timeline: [],
	};
}

function mapDbTaskToFrontend(task: DbTask): Task {
	const assignee: TaskAssignee = task.assignee
		? {
				userId: task.assignee.id,
				name: task.assignee.pseudo ?? `${task.assignee.firstName} ${task.assignee.lastName}`,
				avatar: task.assignee.avatar ?? undefined,
			}
		: { userId: "", name: "Non assigné" };

	const subtasks: Subtask[] = task.subtasks.map((st) => ({
		id: st.id,
		title: st.title,
		done: st.done,
	}));

	return {
		id: task.id,
		title: task.title,
		description: task.description ?? undefined,
		status: task.status as TaskStatusValue,
		priority: task.priority as TaskPriorityValue,
		assignee,
		dueDate: task.dueDate?.toISOString().split("T")[0] ?? undefined,
		projectId: task.projectId ?? undefined,
		projectName: task.project?.name ?? undefined,
		subtasks: subtasks.length > 0 ? subtasks : undefined,
		createdAt: task.createdAt.toISOString().split("T")[0],
	};
}

function mapDbMeetingToFrontend(meeting: DbMeeting): Meeting {
	const participants: MeetingParticipant[] = meeting.attendees.map((a) => ({
		userId: a.user.id,
		name: a.user.pseudo ?? `${a.user.firstName} ${a.user.lastName}`,
		avatar: a.user.avatar ?? undefined,
	}));

	return {
		id: meeting.id,
		title: meeting.title,
		date: meeting.date.toISOString().split("T")[0],
		startTime: meeting.startTime,
		endTime: meeting.endTime,
		location: meeting.location ?? "",
		type: meeting.type as MeetingTypeValue,
		participants,
		notes: meeting.notes ?? undefined,
		isOnline: meeting.isOnline,
		link: meeting.link ?? undefined,
	};
}

function mapDbAbsenceToFrontend(absence: DbAbsence): Absence {
	const start = absence.startDate;
	const end = absence.endDate;
	const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

	return {
		id: absence.id,
		userId: absence.userId,
		userName: absence.user.pseudo ?? `${absence.user.firstName} ${absence.user.lastName}`,
		userAvatar: absence.user.avatar ?? undefined,
		type: absence.type as AbsenceTypeValue,
		startDate: start.toISOString().split("T")[0],
		endDate: end.toISOString().split("T")[0],
		reason: absence.reason ?? undefined,
		status: absence.status as AbsenceStatusValue,
		days,
		createdAt: absence.createdAt.toISOString().split("T")[0],
	};
}

// ─── DB Queries ────────────────────────────────────────────────────────────

function fetchUsers() {
	return prisma.user.findMany({
		where: { status: "active" },
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			avatar: true,
			role: true,
			status: true,
			a2fEnabled: true,
			pseudo: true,
			phone: true,
			birthdate: true,
			birthdayWish: true,
			languages: true,
			discordUsername: true,
			discordId: true,
			socialTwitter: true,
			socialTwitch: true,
			socialYoutube: true,
			socialInstagram: true,
			socialReddit: true,
			entity: true,
			team: true,
			division: true,
			roleSecondary: true,
			arrivalDate: true,
			roleId: true,
			entityAccess: true,
		},
		orderBy: { firstName: "asc" },
	});
}

function fetchProjects() {
	return prisma.project.findMany({
		where: {
			status: { notIn: ["archived"] },
		},
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							pseudo: true,
							avatar: true,
						},
					},
				},
			},
			tasks: {
				select: { status: true },
			},
		},
		orderBy: { createdAt: "desc" },
	});
}

function fetchTasks() {
	return prisma.task.findMany({
		include: {
			assignee: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					pseudo: true,
					avatar: true,
				},
			},
			project: {
				select: { name: true },
			},
			subtasks: {
				select: { id: true, title: true, done: true },
			},
		},
		orderBy: { createdAt: "desc" },
	});
}

function fetchMeetings() {
	return prisma.meeting.findMany({
		include: {
			attendees: {
				include: {
					user: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							pseudo: true,
							avatar: true,
						},
					},
				},
			},
		},
		orderBy: { date: "asc" },
	});
}

function fetchAbsences() {
	return prisma.absence.findMany({
		include: {
			user: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					pseudo: true,
					avatar: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});
}

// ─── Public API ────────────────────────────────────────────────────────────

export interface StoreInitData {
	users: UserProfile[];
	projects: Project[];
	tasks: Task[];
	meetings: Meeting[];
	absences: Absence[];
}

/** Fetches and maps all data needed to initialize the Zustand store */
export class DataService {
	static async getInitData(): Promise<StoreInitData> {
		const [dbUsers, dbProjects, dbTasks, dbMeetings, dbAbsences] = await Promise.all([
			fetchUsers(),
			fetchProjects(),
			fetchTasks(),
			fetchMeetings(),
			fetchAbsences(),
		]);

		return {
			users: dbUsers.map(mapDbUserToProfile),
			projects: dbProjects.map(mapDbProjectToFrontend),
			tasks: dbTasks.map(mapDbTaskToFrontend),
			meetings: dbMeetings.map(mapDbMeetingToFrontend),
			absences: dbAbsences.map(mapDbAbsenceToFrontend),
		};
	}
}
