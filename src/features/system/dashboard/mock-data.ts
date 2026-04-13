import type { UserProfile } from "@/features/admin/users/types";
import type { Project } from "@/features/operations/projects/types";
import type { Task } from "@/features/operations/tasks/types";
import type { Meeting } from "@/features/communication/meetings/types";
import type { Absence } from "@/features/operations/absences/types";
import type { RoleId } from "@/core/config/roles";
import type { Team } from "@/core/config/teams";

function buildUser(
	envPrefix: string,
	defaults: {
		team: Team;
		division: 0 | 1 | 2 | 3;
		roleSecondary: string;
		roleId: RoleId;
		entityAccess: string[];
		entity: string;
		avatar: string;
	},
): UserProfile {
	const e = process.env;
	const p = envPrefix;
	return {
		id: e[`${p}_ID`] ?? "",
		pseudo: e[`${p}_PSEUDO`] ?? "",
		firstName: e[`${p}_FIRSTNAME`] ?? "",
		lastName: e[`${p}_LASTNAME`] ?? "",
		email: e[`${p}_EMAIL`] ?? "",
		phone: e[`${p}_PHONE`] ?? "",
		birthdate: e[`${p}_BIRTHDATE`] ?? "",
		birthdayWish: e[`${p}_BWISH`] === "true",
		languages: (e[`${p}_LANGS`] ?? "fr").split(","),
		avatar: defaults.avatar,
		discordUsername: e[`${p}_DISCORD_NAME`] ?? "",
		discordId: e[`${p}_DISCORD_ID`] ?? "",
		social: {
			...(e[`${p}_SOCIAL_TWITTER`] ? { twitter: e[`${p}_SOCIAL_TWITTER`] } : {}),
			...(e[`${p}_SOCIAL_TWITCH`] ? { twitch: e[`${p}_SOCIAL_TWITCH`] } : {}),
		},
		entity: defaults.entity,
		team: defaults.team,
		division: defaults.division,
		roleSecondary: defaults.roleSecondary,
		arrivalDate: e[`${p}_ARRIVAL`] ?? "",
		roleId: defaults.roleId,
		entityAccess: defaults.entityAccess,
		twoFactorEnabled: true,
		status: "active",
		entityAccessDetails: [],
	};
}

export const MOCK_USERS: UserProfile[] = [
	buildUser("SEED_U0", {
		team: "Owner",
		division: 3,
		roleSecondary: "",
		roleId: "owner",
		entityAccess: ["*"],
		entity: "bazalthe",
		avatar: "/avatar/Alpha.jpeg",
	}),
	buildUser("SEED_U1", {
		team: "Marsha Teams",
		division: 3,
		roleSecondary: "",
		roleId: "marsha_teams",
		entityAccess: ["*"],
		entity: "bazalthe",
		avatar: "/avatar/Delta.jpeg",
	}),
	buildUser("SEED_U2", {
		team: "Marsha Teams",
		division: 3,
		roleSecondary: "",
		roleId: "marsha_teams",
		entityAccess: ["*"],
		entity: "bazalthe",
		avatar: "/avatar/Mike.jpeg",
	}),
	buildUser("SEED_U3", {
		team: "Legacy",
		division: 2,
		roleSecondary: "Resp. Discord",
		roleId: "legacy_resp_discord",
		entityAccess: ["inoxtag", "michou"],
		entity: "inoxtag",
		avatar: "/avatar/Foxtrot.jpeg",
	}),
	buildUser("SEED_U4", {
		team: "Legacy",
		division: 2,
		roleSecondary: "Resp. YouTube",
		roleId: "legacy_resp_polyvalent",
		entityAccess: ["inoxtag", "michou"],
		entity: "inoxtag",
		avatar: "/avatar/Upsilon.jpeg",
	}),
	buildUser("SEED_U5", {
		team: "Legacy",
		division: 2,
		roleSecondary: "Resp. Live",
		roleId: "legacy_resp_live",
		entityAccess: ["inoxtag", "michou"],
		entity: "inoxtag",
		avatar: "/avatar/Zulu.jpeg",
	}),
	buildUser("SEED_U6", {
		team: "Legacy",
		division: 2,
		roleSecondary: "Resp. Polyvalent",
		roleId: "legacy_resp_polyvalent",
		entityAccess: ["doigby"],
		entity: "doigby",
		avatar: "/avatar/Alpha.jpeg",
	}),
	buildUser("SEED_U7", {
		team: "Legacy",
		division: 2,
		roleSecondary: "Resp. Polyvalent",
		roleId: "legacy_resp_polyvalent",
		entityAccess: ["doigby"],
		entity: "doigby",
		avatar: "/avatar/Delta.jpeg",
	}),
	buildUser("SEED_U8", {
		team: "Momentum & Talent",
		division: 1,
		roleSecondary: "Referent PIM",
		roleId: "momentum_talent",
		entityAccess: ["inoxtag", "michou"],
		entity: "inoxtag",
		avatar: "/avatar/Foxtrot.jpeg",
	}),
	buildUser("SEED_U9", {
		team: "Momentum & Talent",
		division: 1,
		roleSecondary: "Referent Recrutement",
		roleId: "momentum_talent",
		entityAccess: ["inoxtag", "michou"],
		entity: "michou",
		avatar: "/avatar/Mike.jpeg",
	}),
];

// ---------------------------------------------------------------------------
// Mock projects — user references via env-loaded IDs
// ---------------------------------------------------------------------------

export const MOCK_PROJECTS: Project[] = [
	{
		id: "proj-001",
		name: "Refonte Discord",
		emoji: "🎮",
		description: "Refonte complete de l'architecture du serveur Discord. Nouveaux salons, roles, bots.",
		status: "in_progress",
		priority: "P1",
		startDate: "2026-02-01",
		endDate: "2026-03-31",
		responsible: {
			userId: process.env.SEED_U3_ID ?? "",
			name: process.env.SEED_U3_NAME ?? "",
			role: "Resp. Discord",
			avatar: "/avatar/Foxtrot.jpeg",
		},
		assistants: [
			{
				userId: process.env.SEED_U1_ID ?? "",
				name: process.env.SEED_U1_NAME ?? "",
				role: "Admin",
				avatar: "/avatar/Delta.jpeg",
			},
		],
		members: [
			{
				userId: process.env.SEED_U3_ID ?? "",
				name: process.env.SEED_U3_NAME ?? "",
				role: "Resp. Discord",
				avatar: "/avatar/Foxtrot.jpeg",
			},
			{
				userId: process.env.SEED_U1_ID ?? "",
				name: process.env.SEED_U1_NAME ?? "",
				role: "Admin",
				avatar: "/avatar/Delta.jpeg",
			},
			{
				userId: process.env.SEED_U8_ID ?? "",
				name: process.env.SEED_U8_NAME ?? "",
				role: "Momentum",
				avatar: "/avatar/Foxtrot.jpeg",
			},
			{
				userId: process.env.SEED_U4_ID ?? "",
				name: process.env.SEED_U4_NAME ?? "",
				role: "YouTube",
				avatar: "/avatar/Upsilon.jpeg",
			},
		],
		tasks: { total: 12, done: 4, inProgress: 5, todo: 3 },
		progress: 33,
		relations: { tasks: [], communications: [], contents: [], creations: [], ideas: [] },
		timeline: [
			{
				id: "tl-001",
				action: "project_created",
				timestamp: "2026-02-01T10:00:00",
				user: process.env.SEED_U0_NAME ?? "",
				description: "Projet cree",
			},
		],
	},
	{
		id: "proj-002",
		name: "Moderation Live S2",
		emoji: "📺",
		description: "Organisation de la moderation live pour la saison 2.",
		status: "in_progress",
		priority: "P2",
		startDate: "2026-02-15",
		endDate: "2026-04-15",
		responsible: {
			userId: process.env.SEED_U6_ID ?? "",
			name: process.env.SEED_U6_NAME ?? "",
			role: "Resp. Polyvalent",
			avatar: "/avatar/Alpha.jpeg",
		},
		assistants: [
			{
				userId: process.env.SEED_U7_ID ?? "",
				name: process.env.SEED_U7_NAME ?? "",
				role: "Resp. Polyvalent",
				avatar: "/avatar/Delta.jpeg",
			},
		],
		members: [
			{
				userId: process.env.SEED_U6_ID ?? "",
				name: process.env.SEED_U6_NAME ?? "",
				role: "Resp. Polyvalent",
				avatar: "/avatar/Alpha.jpeg",
			},
			{
				userId: process.env.SEED_U7_ID ?? "",
				name: process.env.SEED_U7_NAME ?? "",
				role: "Resp. Polyvalent",
				avatar: "/avatar/Delta.jpeg",
			},
			{
				userId: process.env.SEED_U5_ID ?? "",
				name: process.env.SEED_U5_NAME ?? "",
				role: "Resp. Live",
				avatar: "/avatar/Zulu.jpeg",
			},
		],
		tasks: { total: 8, done: 2, inProgress: 3, todo: 3 },
		progress: 25,
		relations: { tasks: [], communications: [], contents: [], creations: [], ideas: [] },
		timeline: [
			{
				id: "tl-002",
				action: "project_created",
				timestamp: "2026-02-15T14:00:00",
				user: process.env.SEED_U1_NAME ?? "",
				description: "Projet cree",
			},
		],
	},
	{
		id: "proj-003",
		name: "Onboarding Marsha Academy",
		emoji: "🎓",
		description: "Mise en place du parcours de formation pour les nouvelles recrues via la Marsha Academy.",
		status: "in_progress",
		priority: "P1",
		startDate: "2026-01-15",
		endDate: "2026-03-15",
		responsible: {
			userId: process.env.SEED_U2_ID ?? "",
			name: process.env.SEED_U2_NAME ?? "",
			role: "Marsha Teams",
			avatar: "/avatar/Mike.jpeg",
		},
		assistants: [
			{
				userId: process.env.SEED_U8_ID ?? "",
				name: process.env.SEED_U8_NAME ?? "",
				role: "Momentum",
				avatar: "/avatar/Foxtrot.jpeg",
			},
		],
		members: [
			{
				userId: process.env.SEED_U2_ID ?? "",
				name: process.env.SEED_U2_NAME ?? "",
				role: "Marsha Teams",
				avatar: "/avatar/Mike.jpeg",
			},
			{
				userId: process.env.SEED_U8_ID ?? "",
				name: process.env.SEED_U8_NAME ?? "",
				role: "Momentum",
				avatar: "/avatar/Foxtrot.jpeg",
			},
			{
				userId: process.env.SEED_U9_ID ?? "",
				name: process.env.SEED_U9_NAME ?? "",
				role: "Momentum",
				avatar: "/avatar/Mike.jpeg",
			},
		],
		tasks: { total: 15, done: 10, inProgress: 3, todo: 2 },
		progress: 67,
		relations: { tasks: [], communications: [], contents: [], creations: [], ideas: [] },
		timeline: [
			{
				id: "tl-003",
				action: "project_created",
				timestamp: "2026-01-15T09:00:00",
				user: process.env.SEED_U2_NAME ?? "",
				description: "Projet cree",
			},
		],
	},
	{
		id: "proj-004",
		name: "Guidelines YouTube",
		emoji: "📋",
		description: "Redaction des guidelines de moderation YouTube.",
		status: "todo",
		priority: "P2",
		startDate: "2026-03-01",
		endDate: "2026-03-31",
		responsible: {
			userId: process.env.SEED_U4_ID ?? "",
			name: process.env.SEED_U4_NAME ?? "",
			role: "Resp. YouTube",
			avatar: "/avatar/Upsilon.jpeg",
		},
		assistants: [],
		members: [
			{
				userId: process.env.SEED_U4_ID ?? "",
				name: process.env.SEED_U4_NAME ?? "",
				role: "Resp. YouTube",
				avatar: "/avatar/Upsilon.jpeg",
			},
			{
				userId: process.env.SEED_U2_ID ?? "",
				name: process.env.SEED_U2_NAME ?? "",
				role: "Admin",
				avatar: "/avatar/Mike.jpeg",
			},
		],
		tasks: { total: 6, done: 0, inProgress: 0, todo: 6 },
		progress: 0,
		relations: { tasks: [], communications: [], contents: [], creations: [], ideas: [] },
		timeline: [],
	},
];

// ---------------------------------------------------------------------------
// Mock tasks
// ---------------------------------------------------------------------------

export const MOCK_TASKS: Task[] = [
	{
		id: "task-001",
		title: "Configurer les roles Discord",
		description: "Definir les roles, couleurs et permissions pour le serveur",
		status: "in_progress",
		priority: "high",
		assignee: {
			userId: process.env.SEED_U3_ID ?? "",
			name: process.env.SEED_U3_NAME ?? "",
			avatar: "/avatar/Foxtrot.jpeg",
		},
		dueDate: "2026-03-10",
		projectId: "proj-001",
		projectName: "Refonte Discord",
		subtasks: [
			{ id: "st-001", title: "Lister les roles actuels", done: true },
			{ id: "st-002", title: "Proposer la nouvelle architecture", done: false },
		],
		createdAt: "2026-02-01",
	},
	{
		id: "task-002",
		title: "Creer les formations dans la Marsha Academy",
		description: "Preparer les 3 modules de formation pour les nouveaux moderateurs",
		status: "in_progress",
		priority: "high",
		assignee: {
			userId: process.env.SEED_U8_ID ?? "",
			name: process.env.SEED_U8_NAME ?? "",
			avatar: "/avatar/Foxtrot.jpeg",
		},
		dueDate: "2026-03-10",
		projectId: "proj-003",
		projectName: "Onboarding Marsha Academy",
		createdAt: "2026-02-01",
	},
	{
		id: "task-003",
		title: "Planning des lives mars",
		description: "Etablir le planning de moderation pour les lives du mois de mars",
		status: "todo",
		priority: "medium",
		assignee: {
			userId: process.env.SEED_U6_ID ?? "",
			name: process.env.SEED_U6_NAME ?? "",
			avatar: "/avatar/Alpha.jpeg",
		},
		dueDate: "2026-03-08",
		projectId: "proj-002",
		projectName: "Moderation Live S2",
		createdAt: "2026-02-20",
	},
	{
		id: "task-004",
		title: "Evaluer les candidats session recrutement",
		description: "Analyser les candidatures recues pour la session de recrutement",
		status: "in_progress",
		priority: "high",
		assignee: {
			userId: process.env.SEED_U9_ID ?? "",
			name: process.env.SEED_U9_NAME ?? "",
			avatar: "/avatar/Mike.jpeg",
		},
		dueDate: "2026-03-12",
		createdAt: "2026-02-25",
	},
	{
		id: "task-005",
		title: "Mettre a jour les bots AutoMod",
		status: "done",
		priority: "medium",
		assignee: {
			userId: process.env.SEED_U3_ID ?? "",
			name: process.env.SEED_U3_NAME ?? "",
			avatar: "/avatar/Foxtrot.jpeg",
		},
		dueDate: "2026-02-28",
		projectId: "proj-001",
		projectName: "Refonte Discord",
		createdAt: "2026-02-10",
	},
	{
		id: "task-006",
		title: "Rediger les guidelines anti-raid Twitch",
		status: "todo",
		priority: "high",
		assignee: {
			userId: process.env.SEED_U5_ID ?? "",
			name: process.env.SEED_U5_NAME ?? "",
			avatar: "/avatar/Zulu.jpeg",
		},
		dueDate: "2026-03-14",
		createdAt: "2026-02-28",
	},
	{
		id: "task-007",
		title: "Preparer le template de rapport d'incident",
		status: "in_progress",
		priority: "low",
		assignee: {
			userId: process.env.SEED_U2_ID ?? "",
			name: process.env.SEED_U2_NAME ?? "",
			avatar: "/avatar/Mike.jpeg",
		},
		dueDate: "2026-03-20",
		projectId: "proj-003",
		projectName: "Onboarding Marsha Academy",
		createdAt: "2026-02-18",
	},
	{
		id: "task-008",
		title: "Audit des sanctions Q1",
		status: "todo",
		priority: "low",
		assignee: {
			userId: process.env.SEED_U7_ID ?? "",
			name: process.env.SEED_U7_NAME ?? "",
			avatar: "/avatar/Delta.jpeg",
		},
		dueDate: "2026-03-25",
		projectId: "proj-002",
		projectName: "Moderation Live S2",
		createdAt: "2026-02-25",
	},
	{
		id: "task-009",
		title: "Rediger les guidelines YouTube",
		status: "todo",
		priority: "medium",
		assignee: {
			userId: process.env.SEED_U4_ID ?? "",
			name: process.env.SEED_U4_NAME ?? "",
			avatar: "/avatar/Upsilon.jpeg",
		},
		dueDate: "2026-03-20",
		projectId: "proj-004",
		projectName: "Guidelines YouTube",
		createdAt: "2026-03-01",
	},
	{
		id: "task-010",
		title: "Revue des acces apres refonte",
		status: "todo",
		priority: "medium",
		assignee: {
			userId: process.env.SEED_U1_ID ?? "",
			name: process.env.SEED_U1_NAME ?? "",
			avatar: "/avatar/Delta.jpeg",
		},
		dueDate: "2026-04-01",
		projectId: "proj-001",
		projectName: "Refonte Discord",
		createdAt: "2026-03-01",
	},
];

// ---------------------------------------------------------------------------
// Mock meetings
// ---------------------------------------------------------------------------

export const MOCK_MEETINGS: Meeting[] = [
	{
		id: "meet-001",
		title: "Standup Marsha Teams",
		date: "2026-03-09",
		startTime: "10:00",
		endTime: "10:30",
		location: "Discord — Salon Vocal Marsha",
		type: "standup",
		participants: [
			{
				userId: process.env.SEED_U0_ID ?? "",
				name: process.env.SEED_U0_NAME ?? "",
				avatar: "/avatar/Alpha.jpeg",
			},
			{
				userId: process.env.SEED_U1_ID ?? "",
				name: process.env.SEED_U1_NAME ?? "",
				avatar: "/avatar/Delta.jpeg",
			},
			{ userId: process.env.SEED_U2_ID ?? "", name: process.env.SEED_U2_NAME ?? "", avatar: "/avatar/Mike.jpeg" },
		],
		isOnline: true,
		link: "discord://marsha-vocal",
	},
	{
		id: "meet-002",
		title: "Point Refonte Discord",
		date: "2026-03-10",
		startTime: "14:00",
		endTime: "15:00",
		location: "Discord — Salon Vocal",
		type: "réunion",
		participants: [
			{
				userId: process.env.SEED_U3_ID ?? "",
				name: process.env.SEED_U3_NAME ?? "",
				avatar: "/avatar/Foxtrot.jpeg",
			},
			{
				userId: process.env.SEED_U1_ID ?? "",
				name: process.env.SEED_U1_NAME ?? "",
				avatar: "/avatar/Delta.jpeg",
			},
			{
				userId: process.env.SEED_U8_ID ?? "",
				name: process.env.SEED_U8_NAME ?? "",
				avatar: "/avatar/Foxtrot.jpeg",
			},
		],
		notes: "Valider l'architecture des salons avant la mise en production",
		isOnline: true,
	},
	{
		id: "meet-003",
		title: "Revue Onboarding Academy",
		date: "2026-03-11",
		startTime: "11:00",
		endTime: "12:00",
		location: "Discord — Salon Momentum",
		type: "revue",
		participants: [
			{ userId: process.env.SEED_U2_ID ?? "", name: process.env.SEED_U2_NAME ?? "", avatar: "/avatar/Mike.jpeg" },
			{
				userId: process.env.SEED_U8_ID ?? "",
				name: process.env.SEED_U8_NAME ?? "",
				avatar: "/avatar/Foxtrot.jpeg",
			},
			{ userId: process.env.SEED_U9_ID ?? "", name: process.env.SEED_U9_NAME ?? "", avatar: "/avatar/Mike.jpeg" },
		],
		notes: "Bilan des 3 premieres semaines de la Marsha Academy",
		isOnline: true,
	},
	{
		id: "meet-004",
		title: "Entretien recrutement",
		date: "2026-03-12",
		startTime: "16:00",
		endTime: "16:45",
		location: "Discord — Salon Prive Recrutement",
		type: "entretien",
		participants: [
			{ userId: process.env.SEED_U9_ID ?? "", name: process.env.SEED_U9_NAME ?? "", avatar: "/avatar/Mike.jpeg" },
			{
				userId: process.env.SEED_U8_ID ?? "",
				name: process.env.SEED_U8_NAME ?? "",
				avatar: "/avatar/Foxtrot.jpeg",
			},
		],
		isOnline: true,
	},
	{
		id: "meet-005",
		title: "Retrospective Fevrier",
		date: "2026-03-13",
		startTime: "15:00",
		endTime: "16:00",
		location: "Discord — Salon Vocal",
		type: "retrospective",
		participants: [
			{
				userId: process.env.SEED_U6_ID ?? "",
				name: process.env.SEED_U6_NAME ?? "",
				avatar: "/avatar/Alpha.jpeg",
			},
			{
				userId: process.env.SEED_U7_ID ?? "",
				name: process.env.SEED_U7_NAME ?? "",
				avatar: "/avatar/Delta.jpeg",
			},
			{ userId: process.env.SEED_U5_ID ?? "", name: process.env.SEED_U5_NAME ?? "", avatar: "/avatar/Zulu.jpeg" },
		],
		notes: "Retour sur la moderation live du mois de fevrier",
		isOnline: true,
	},
];

// ---------------------------------------------------------------------------
// Mock absences
// ---------------------------------------------------------------------------

export const MOCK_ABSENCES: Absence[] = [
	{
		id: "abs-001",
		userId: process.env.SEED_U4_ID ?? "",
		userName: process.env.SEED_U4_NAME ?? "",
		userAvatar: "/avatar/Upsilon.jpeg",
		type: "conge_paye",
		startDate: "2026-03-17",
		endDate: "2026-03-21",
		reason: "Vacances",
		status: "approved",
		days: 5,
		createdAt: "2026-02-20",
	},
	{
		id: "abs-002",
		userId: process.env.SEED_U7_ID ?? "",
		userName: process.env.SEED_U7_NAME ?? "",
		userAvatar: "/avatar/Delta.jpeg",
		type: "autre",
		startDate: "2026-03-10",
		endDate: "2026-03-10",
		reason: "Rendez-vous medical",
		status: "approved",
		days: 1,
		createdAt: "2026-02-27",
	},
	{
		id: "abs-003",
		userId: process.env.SEED_U5_ID ?? "",
		userName: process.env.SEED_U5_NAME ?? "",
		userAvatar: "/avatar/Zulu.jpeg",
		type: "maladie",
		startDate: "2026-03-06",
		endDate: "2026-03-07",
		reason: "Maladie",
		status: "pending",
		days: 2,
		createdAt: "2026-03-05",
	},
];
