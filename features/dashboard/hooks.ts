"use client";

// React
import { useMemo } from "react";
import { generateBriefing } from "./utils/briefing-engine";
import type { IconName } from "@/core/design/icons";
import type { BriefingData } from "./utils/briefing-engine";
import type { UserProfile } from "@/features/users/types";
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";
import type { Meeting } from "@/features/meetings/types";
import type { Absence } from "@/features/absences/types";

// Re-export briefing types for consumer convenience
export type { BriefingData, BriefingItem, ScheduleItem, ActionItem } from "./utils/briefing-engine";

// ---------------------------------------------------------------------------
// Mock data — coherent with core/data/accounts.json test accounts
// ---------------------------------------------------------------------------

const MOCK_USERS: UserProfile[] = [
	{
		id: "usr_jeremy",
		pseudo: "jeremy",
		firstName: "Jeremy",
		lastName: "Music",
		email: "jeremy@memora.hub",
		phone: "+33600000001",
		birthdate: "1998-06-15",
		birthdayWish: true,
		languages: ["fr", "en"],
		avatar: "/avatar/Alpha.jpeg",
		discordUsername: "jeremy#0001",
		discordId: "000000000000000001",
		social: { twitter: "@jeremy_music", twitch: "jeremy_music" },
		entity: "bazalthe",
		team: "Owner",
		division: 3,
		roleSecondary: "",
		arrivalDate: "2024-01-01",
		roleId: "owner",
		entityAccess: ["*"],
		twoFactorEnabled: true,
		status: "active",
		entityAccessDetails: [],
	},
	{
		id: "usr_kevin",
		pseudo: "kevin",
		firstName: "Kevin",
		lastName: "Music",
		email: "kevin@memora.hub",
		phone: "+33600000002",
		birthdate: "1996-03-22",
		birthdayWish: true,
		languages: ["fr", "en"],
		avatar: "/avatar/Delta.jpeg",
		discordUsername: "kevin#0002",
		discordId: "000000000000000002",
		social: {},
		entity: "bazalthe",
		team: "Marsha Teams",
		division: 3,
		roleSecondary: "",
		arrivalDate: "2024-01-15",
		roleId: "marsha_teams",
		entityAccess: ["*"],
		twoFactorEnabled: true,
		status: "active",
		entityAccessDetails: [],
	},
	{
		id: "usr_candice",
		pseudo: "candice",
		firstName: "Candice",
		lastName: "Music",
		email: "candice@memora.hub",
		phone: "+33600000003",
		birthdate: "1997-09-10",
		birthdayWish: true,
		languages: ["fr"],
		avatar: "/avatar/Mike.jpeg",
		discordUsername: "candice#0003",
		discordId: "000000000000000003",
		social: {},
		entity: "bazalthe",
		team: "Marsha Teams",
		division: 3,
		roleSecondary: "",
		arrivalDate: "2024-02-01",
		roleId: "marsha_teams",
		entityAccess: ["*"],
		twoFactorEnabled: true,
		status: "active",
		entityAccessDetails: [],
	},
	{
		id: "usr_antwo",
		pseudo: "antwo",
		firstName: "Antwo",
		lastName: "Legacy",
		email: "antwo@memora.hub",
		phone: "+33600000004",
		birthdate: "2000-11-05",
		birthdayWish: false,
		languages: ["fr"],
		avatar: "/avatar/Foxtrot.jpeg",
		discordUsername: "antwo#0004",
		discordId: "000000000000000004",
		social: {},
		entity: "inoxtag",
		team: "Legacy",
		division: 2,
		roleSecondary: "Resp. Discord",
		arrivalDate: "2024-06-01",
		roleId: "legacy_resp_discord",
		entityAccess: ["inoxtag", "michou"],
		twoFactorEnabled: true,
		status: "active",
		entityAccessDetails: [],
	},
	{
		id: "usr_procy",
		pseudo: "procy",
		firstName: "Procy",
		lastName: "Legacy",
		email: "procy@memora.hub",
		phone: "+33600000005",
		birthdate: "2001-04-18",
		birthdayWish: true,
		languages: ["fr"],
		avatar: "/avatar/Upsilon.jpeg",
		discordUsername: "procy#0005",
		discordId: "000000000000000005",
		social: {},
		entity: "inoxtag",
		team: "Legacy",
		division: 2,
		roleSecondary: "Resp. YouTube",
		arrivalDate: "2024-07-01",
		roleId: "legacy_resp_polyvalent",
		entityAccess: ["inoxtag", "michou"],
		twoFactorEnabled: true,
		status: "active",
		entityAccessDetails: [],
	},
	{
		id: "usr_andrew",
		pseudo: "andrew",
		firstName: "Andrew",
		lastName: "Legacy",
		email: "andrew@memora.hub",
		phone: "+33600000006",
		birthdate: "1999-12-30",
		birthdayWish: false,
		languages: ["fr", "en"],
		avatar: "/avatar/Zulu.jpeg",
		discordUsername: "andrew#0006",
		discordId: "000000000000000006",
		social: { twitch: "andrew_live" },
		entity: "inoxtag",
		team: "Legacy",
		division: 2,
		roleSecondary: "Resp. Live",
		arrivalDate: "2024-06-15",
		roleId: "legacy_resp_live",
		entityAccess: ["inoxtag", "michou"],
		twoFactorEnabled: true,
		status: "active",
		entityAccessDetails: [],
	},
	{
		id: "usr_luzrod",
		pseudo: "luzrod",
		firstName: "Luzrod",
		lastName: "Legacy",
		email: "luzrod@memora.hub",
		phone: "+33600000007",
		birthdate: "2002-01-25",
		birthdayWish: true,
		languages: ["fr"],
		avatar: "/avatar/Alpha.jpeg",
		discordUsername: "luzrod#0007",
		discordId: "000000000000000007",
		social: {},
		entity: "doigby",
		team: "Legacy",
		division: 2,
		roleSecondary: "Resp. Polyvalent",
		arrivalDate: "2024-08-01",
		roleId: "legacy_resp_polyvalent",
		entityAccess: ["doigby"],
		twoFactorEnabled: true,
		status: "active",
		entityAccessDetails: [],
	},
	{
		id: "usr_benji",
		pseudo: "benji",
		firstName: "Benji",
		lastName: "Legacy",
		email: "benji@memora.hub",
		phone: "+33600000008",
		birthdate: "2001-07-14",
		birthdayWish: false,
		languages: ["fr"],
		avatar: "/avatar/Delta.jpeg",
		discordUsername: "benji#0008",
		discordId: "000000000000000008",
		social: {},
		entity: "doigby",
		team: "Legacy",
		division: 2,
		roleSecondary: "Resp. Polyvalent",
		arrivalDate: "2024-08-15",
		roleId: "legacy_resp_polyvalent",
		entityAccess: ["doigby"],
		twoFactorEnabled: true,
		status: "active",
		entityAccessDetails: [],
	},
	{
		id: "usr_shiny",
		pseudo: "shiny",
		firstName: "Shiny",
		lastName: "Momentum",
		email: "shiny@memora.hub",
		phone: "+33600000009",
		birthdate: "2000-05-20",
		birthdayWish: true,
		languages: ["fr", "en"],
		avatar: "/avatar/Foxtrot.jpeg",
		discordUsername: "shiny#0009",
		discordId: "000000000000000009",
		social: {},
		entity: "inoxtag",
		team: "Momentum & Talent",
		division: 1,
		roleSecondary: "Referent PIM",
		arrivalDate: "2024-09-01",
		roleId: "momentum_talent",
		entityAccess: ["inoxtag", "michou"],
		twoFactorEnabled: true,
		status: "active",
		entityAccessDetails: [],
	},
	{
		id: "usr_flo",
		pseudo: "flo",
		firstName: "Flo",
		lastName: "Momentum",
		email: "flo@memora.hub",
		phone: "+33600000010",
		birthdate: "1999-08-08",
		birthdayWish: true,
		languages: ["fr"],
		avatar: "/avatar/Mike.jpeg",
		discordUsername: "flo#0010",
		discordId: "000000000000000010",
		social: {},
		entity: "michou",
		team: "Momentum & Talent",
		division: 1,
		roleSecondary: "Referent Recrutement",
		arrivalDate: "2024-09-15",
		roleId: "momentum_talent",
		entityAccess: ["inoxtag", "michou"],
		twoFactorEnabled: true,
		status: "active",
		entityAccessDetails: [],
	},
];

const MOCK_PROJECTS: Project[] = [
	{
		id: "proj-001",
		name: "Refonte Discord Inoxtag",
		emoji: "🎮",
		description: "Refonte complete de l'architecture du serveur Discord Inoxtag. Nouveaux salons, roles, bots.",
		status: "in_progress",
		priority: "P1",
		startDate: "2026-02-01",
		endDate: "2026-03-31",
		responsible: { userId: "usr_antwo", name: "Antwo", role: "Resp. Discord", avatar: "/avatar/Foxtrot.jpeg" },
		assistants: [{ userId: "usr_kevin", name: "Kevin", role: "Admin", avatar: "/avatar/Delta.jpeg" }],
		members: [
			{ userId: "usr_shiny", name: "Shiny", role: "Momentum", avatar: "/avatar/Foxtrot.jpeg" },
			{ userId: "usr_procy", name: "Procy", role: "YouTube", avatar: "/avatar/Upsilon.jpeg" },
		],
		tasks: { total: 12, done: 4, inProgress: 5, todo: 3 },
		progress: 33,
		relations: { tasks: [], communications: [], contents: [], creations: [], ideas: [] },
		timeline: [
			{
				id: "tl-001",
				action: "project_created",
				timestamp: "2026-02-01T10:00:00",
				user: "Jeremy",
				description: "Projet cree",
			},
		],
	},
	{
		id: "proj-002",
		name: "Moderation Live Doigby S2",
		emoji: "📺",
		description: "Organisation de la moderation live pour la saison 2 des streams Doigby.",
		status: "in_progress",
		priority: "P2",
		startDate: "2026-02-15",
		endDate: "2026-04-15",
		responsible: { userId: "usr_luzrod", name: "Luzrod", role: "Resp. Polyvalent", avatar: "/avatar/Alpha.jpeg" },
		assistants: [{ userId: "usr_benji", name: "Benji", role: "Resp. Polyvalent", avatar: "/avatar/Delta.jpeg" }],
		members: [{ userId: "usr_andrew", name: "Andrew", role: "Resp. Live", avatar: "/avatar/Zulu.jpeg" }],
		tasks: { total: 8, done: 2, inProgress: 3, todo: 3 },
		progress: 25,
		relations: { tasks: [], communications: [], contents: [], creations: [], ideas: [] },
		timeline: [
			{
				id: "tl-002",
				action: "project_created",
				timestamp: "2026-02-15T14:00:00",
				user: "Kevin",
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
		responsible: { userId: "usr_candice", name: "Candice", role: "Marsha Teams", avatar: "/avatar/Mike.jpeg" },
		assistants: [{ userId: "usr_shiny", name: "Shiny", role: "Momentum", avatar: "/avatar/Foxtrot.jpeg" }],
		members: [{ userId: "usr_flo", name: "Flo", role: "Momentum", avatar: "/avatar/Mike.jpeg" }],
		tasks: { total: 15, done: 10, inProgress: 3, todo: 2 },
		progress: 67,
		relations: { tasks: [], communications: [], contents: [], creations: [], ideas: [] },
		timeline: [
			{
				id: "tl-003",
				action: "project_created",
				timestamp: "2026-01-15T09:00:00",
				user: "Candice",
				description: "Projet cree",
			},
		],
	},
	{
		id: "proj-004",
		name: "Guidelines YouTube Michou",
		emoji: "📋",
		description: "Redaction des guidelines de moderation YouTube pour Michou.",
		status: "todo",
		priority: "P2",
		startDate: "2026-03-01",
		endDate: "2026-03-31",
		responsible: { userId: "usr_procy", name: "Procy", role: "Resp. YouTube", avatar: "/avatar/Upsilon.jpeg" },
		assistants: [],
		members: [{ userId: "usr_candice", name: "Candice", role: "Admin", avatar: "/avatar/Mike.jpeg" }],
		tasks: { total: 6, done: 0, inProgress: 0, todo: 6 },
		progress: 0,
		relations: { tasks: [], communications: [], contents: [], creations: [], ideas: [] },
		timeline: [],
	},
];

const MOCK_TASKS: Task[] = [
	{
		id: "task-001",
		title: "Configurer les roles Discord Inoxtag",
		description: "Definir les roles, couleurs et permissions pour le serveur Inoxtag",
		status: "in_progress",
		priority: "high",
		assignee: { userId: "usr_antwo", name: "Antwo", avatar: "/avatar/Foxtrot.jpeg" },
		dueDate: "2026-03-05",
		projectId: "proj-001",
		projectName: "Refonte Discord Inoxtag",
		subtasks: [
			{ id: "st-001", title: "Lister les roles actuels", done: true },
			{ id: "st-002", title: "Proposer la nouvelle architecture", done: false },
		],
		createdAt: "2026-02-01",
	},
	{
		id: "task-002",
		title: "Creer les formations Discord dans la Marsha Academy",
		description: "Preparer les 3 modules de formation Discord pour les nouveaux moderateurs",
		status: "in_progress",
		priority: "high",
		assignee: { userId: "usr_shiny", name: "Shiny", avatar: "/avatar/Foxtrot.jpeg" },
		dueDate: "2026-03-10",
		projectId: "proj-003",
		projectName: "Onboarding Marsha Academy",
		createdAt: "2026-02-01",
	},
	{
		id: "task-003",
		title: "Planning des lives Doigby mars",
		description: "Etablir le planning de moderation pour les lives Doigby du mois de mars",
		status: "todo",
		priority: "medium",
		assignee: { userId: "usr_luzrod", name: "Luzrod", avatar: "/avatar/Alpha.jpeg" },
		dueDate: "2026-03-03",
		projectId: "proj-002",
		projectName: "Moderation Live Doigby S2",
		createdAt: "2026-02-20",
	},
	{
		id: "task-004",
		title: "Evaluer les candidats session recrutement Michou",
		description: "Analyser les 8 candidatures recues pour la session de recrutement Michou",
		status: "in_progress",
		priority: "high",
		assignee: { userId: "usr_flo", name: "Flo", avatar: "/avatar/Mike.jpeg" },
		dueDate: "2026-03-07",
		createdAt: "2026-02-25",
	},
	{
		id: "task-005",
		title: "Mettre a jour les bots AutoMod",
		status: "done",
		priority: "medium",
		assignee: { userId: "usr_antwo", name: "Antwo", avatar: "/avatar/Foxtrot.jpeg" },
		dueDate: "2026-02-28",
		projectId: "proj-001",
		projectName: "Refonte Discord Inoxtag",
		createdAt: "2026-02-10",
	},
	{
		id: "task-006",
		title: "Rediger les guidelines anti-raid Twitch",
		status: "todo",
		priority: "high",
		assignee: { userId: "usr_andrew", name: "Andrew", avatar: "/avatar/Zulu.jpeg" },
		dueDate: "2026-03-08",
		createdAt: "2026-02-28",
	},
	{
		id: "task-007",
		title: "Preparer le template de rapport d'incident",
		status: "in_progress",
		priority: "low",
		assignee: { userId: "usr_candice", name: "Candice", avatar: "/avatar/Mike.jpeg" },
		dueDate: "2026-03-15",
		projectId: "proj-003",
		projectName: "Onboarding Marsha Academy",
		createdAt: "2026-02-18",
	},
	{
		id: "task-008",
		title: "Audit des sanctions Doigby Q1",
		status: "todo",
		priority: "low",
		assignee: { userId: "usr_benji", name: "Benji", avatar: "/avatar/Delta.jpeg" },
		dueDate: "2026-03-20",
		projectId: "proj-002",
		projectName: "Moderation Live Doigby S2",
		createdAt: "2026-02-25",
	},
];

const MOCK_MEETINGS: Meeting[] = [
	{
		id: "meet-001",
		title: "Standup Marsha Teams",
		date: "2026-03-02",
		startTime: "10:00",
		endTime: "10:30",
		location: "Discord — Salon Vocal Marsha",
		type: "standup",
		participants: [
			{ userId: "usr_jeremy", name: "Jeremy", avatar: "/avatar/Alpha.jpeg" },
			{ userId: "usr_kevin", name: "Kevin", avatar: "/avatar/Delta.jpeg" },
			{ userId: "usr_candice", name: "Candice", avatar: "/avatar/Mike.jpeg" },
		],
		isOnline: true,
		link: "discord://marsha-vocal",
	},
	{
		id: "meet-002",
		title: "Point Refonte Discord Inoxtag",
		date: "2026-03-02",
		startTime: "14:00",
		endTime: "15:00",
		location: "Discord — Salon Vocal Inoxtag",
		type: "réunion",
		participants: [
			{ userId: "usr_antwo", name: "Antwo", avatar: "/avatar/Foxtrot.jpeg" },
			{ userId: "usr_kevin", name: "Kevin", avatar: "/avatar/Delta.jpeg" },
			{ userId: "usr_shiny", name: "Shiny", avatar: "/avatar/Foxtrot.jpeg" },
		],
		notes: "Valider l'architecture des salons avant la mise en production",
		isOnline: true,
	},
	{
		id: "meet-003",
		title: "Revue Onboarding Academy",
		date: "2026-03-03",
		startTime: "11:00",
		endTime: "12:00",
		location: "Discord — Salon Momentum",
		type: "revue",
		participants: [
			{ userId: "usr_candice", name: "Candice", avatar: "/avatar/Mike.jpeg" },
			{ userId: "usr_shiny", name: "Shiny", avatar: "/avatar/Foxtrot.jpeg" },
			{ userId: "usr_flo", name: "Flo", avatar: "/avatar/Mike.jpeg" },
		],
		notes: "Bilan des 3 premieres semaines de la Marsha Academy",
		isOnline: true,
	},
	{
		id: "meet-004",
		title: "Entretien recrutement — Candidat Michou",
		date: "2026-03-04",
		startTime: "16:00",
		endTime: "16:45",
		location: "Discord — Salon Prive Recrutement",
		type: "entretien",
		participants: [
			{ userId: "usr_flo", name: "Flo", avatar: "/avatar/Mike.jpeg" },
			{ userId: "usr_shiny", name: "Shiny", avatar: "/avatar/Foxtrot.jpeg" },
		],
		isOnline: true,
	},
	{
		id: "meet-005",
		title: "Retrospective Doigby Fevrier",
		date: "2026-03-05",
		startTime: "15:00",
		endTime: "16:00",
		location: "Discord — Salon Vocal Doigby",
		type: "retrospective",
		participants: [
			{ userId: "usr_luzrod", name: "Luzrod", avatar: "/avatar/Alpha.jpeg" },
			{ userId: "usr_benji", name: "Benji", avatar: "/avatar/Delta.jpeg" },
			{ userId: "usr_andrew", name: "Andrew", avatar: "/avatar/Zulu.jpeg" },
		],
		notes: "Retour sur la moderation live du mois de fevrier",
		isOnline: true,
	},
];

const MOCK_ABSENCES: Absence[] = [
	{
		id: "abs-001",
		userId: "usr_procy",
		userName: "Procy",
		userAvatar: "/avatar/Upsilon.jpeg",
		type: "conge_paye",
		startDate: "2026-03-10",
		endDate: "2026-03-14",
		reason: "Vacances",
		status: "approved",
		days: 5,
		createdAt: "2026-02-20",
	},
	{
		id: "abs-002",
		userId: "usr_benji",
		userName: "Benji",
		userAvatar: "/avatar/Delta.jpeg",
		type: "autre",
		startDate: "2026-03-03",
		endDate: "2026-03-03",
		reason: "Rendez-vous medical",
		status: "approved",
		days: 1,
		createdAt: "2026-02-27",
	},
];

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Generates a personal assistant briefing for the given user.
 * Uses coherent mock data tied to test accounts.
 * @param userId - The user ID to generate a briefing for
 * @returns Briefing data for the dashboard
 */
export function useDashboardBriefing(userId: string): BriefingData {
	return useMemo(
		() =>
			generateBriefing(userId, {
				users: MOCK_USERS,
				projects: MOCK_PROJECTS,
				tasks: MOCK_TASKS,
				meetings: MOCK_MEETINGS,
				absences: MOCK_ABSENCES,
			}),
		[userId],
	);
}

// Legacy hooks (kept for backward compatibility)

/** Dashboard stat with display metadata */
export interface DashboardStat {
	label: string;
	value: number;
	icon: IconName;
	iconColor: string;
	trend: "up" | "down" | "neutral";
	change: string;
	sparkline: number[];
}

/** Dashboard activity entry for the feed */
export interface DashboardActivity {
	id: string;
	action: string;
	subject: string;
	time: string;
	actor: string;
	icon: IconName;
}

/**
 * Provides dashboard stats for the overview widgets.
 * @returns Dashboard stats object keyed by category
 */
export function useDashboardStats() {
	const stats = useMemo(
		() => ({
			projects: {
				label: "Projets actifs",
				value: MOCK_PROJECTS.filter((p) => p.status === "in_progress").length,
				icon: "folder" as IconName,
				iconColor: "text-primary-500",
				trend: "up" as const,
				change: "+1",
				sparkline: [1, 2, 2, 3, 3],
			},
			tasks: {
				label: "Taches en cours",
				value: MOCK_TASKS.filter((t) => t.status === "in_progress").length,
				icon: "tasks" as IconName,
				iconColor: "text-info-500",
				trend: "up" as const,
				change: "+2",
				sparkline: [3, 4, 3, 5, 4],
			},
			meetings: {
				label: "Reunions cette semaine",
				value: MOCK_MEETINGS.length,
				icon: "calendar" as IconName,
				iconColor: "text-warning-500",
				trend: "neutral" as const,
				change: "0",
				sparkline: [3, 4, 5, 4, 5],
			},
			members: {
				label: "Membres actifs",
				value: MOCK_USERS.filter((u) => u.status === "active").length,
				icon: "users" as IconName,
				iconColor: "text-success-500",
				trend: "up" as const,
				change: "+2",
				sparkline: [8, 8, 9, 10, 10],
			},
		}),
		[],
	);

	return { stats, isLoading: false };
}

/**
 * Provides recent activity entries for the dashboard activity feed.
 * @returns Array of recent activity entries
 */
export function useDashboardActivity() {
	const activities: DashboardActivity[] = useMemo(
		() => [
			{
				id: "act-001",
				action: "a termine",
				subject: "Mettre a jour les bots AutoMod",
				time: "Il y a 2h",
				actor: "Antwo",
				icon: "check-circle" as IconName,
			},
			{
				id: "act-002",
				action: "a cree",
				subject: "Entretien recrutement Michou",
				time: "Il y a 3h",
				actor: "Flo",
				icon: "calendar" as IconName,
			},
			{
				id: "act-003",
				action: "a commente",
				subject: "Refonte Discord Inoxtag",
				time: "Il y a 5h",
				actor: "Kevin",
				icon: "message-circle" as IconName,
			},
			{
				id: "act-004",
				action: "a demarre",
				subject: "Formations Discord Academy",
				time: "Hier",
				actor: "Shiny",
				icon: "play" as IconName,
			},
			{
				id: "act-005",
				action: "a valide l'absence de",
				subject: "Benji (03 mars)",
				time: "Hier",
				actor: "Candice",
				icon: "check" as IconName,
			},
			{
				id: "act-006",
				action: "a rejoint",
				subject: "le projet Doigby S2",
				time: "Il y a 2j",
				actor: "Andrew",
				icon: "user-plus" as IconName,
			},
		],
		[],
	);

	return { activities, isLoading: false };
}
