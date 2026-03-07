/**
 * Memora Hub — Database Seed Script
 * Populates the database from centralized JSON configuration files.
 * Run with: npm run db:seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

// ─── Helpers ───

async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12);
}

function readJSON<T>(relativePath: string): T {
	const absolutePath = resolve(__dirname, "..", relativePath);
	return JSON.parse(readFileSync(absolutePath, "utf-8")) as T;
}

// ─── Types ───

interface AccountEntry {
	id: string;
	pseudo: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: "Owner" | "Admin" | "Manager" | "Collaborator" | "Guest";
	roleId:
		| "owner"
		| "marsha_teams"
		| "legacy_resp_live"
		| "legacy_resp_discord"
		| "legacy_resp_polyvalent"
		| "momentum_talent"
		| "standard";
	team: string;
	entity: string;
	entityAccess: string[];
	division: number;
	status: "active" | "inactive";
	a2fEnabled: boolean;
	discordId?: string;
	arrivalDate?: string;
}

interface GroupEntry {
	id: string;
	name: string;
	entityId: string;
	type: string;
	description: string;
}

// ─── Load JSON configs ───

const { accounts } = readJSON<{ accounts: AccountEntry[] }>("core/configurations/default/users/accounts.json");
const { groups } = readJSON<{ groups: GroupEntry[] }>("core/configurations/default/entities/groups.json");

// Entity → Group ID mapping
const ENTITY_TO_GROUP: Record<string, string> = {};
for (const g of groups) {
	ENTITY_TO_GROUP[g.entityId] = g.id;
}

// Quick lookup by ID for seed data references
function userId(id: string): string {
	return id;
}

/**
 * Map legacy role IDs to valid permission roles.
 * @param roleId - Source role ID from configuration
 * @returns Normalized role ID used by the permission system
 */
function normalizeRoleId(roleId: AccountEntry["roleId"]): Exclude<AccountEntry["roleId"], "standard"> {
	if (roleId === "standard") return "momentum_talent";
	return roleId;
}

/**
 * Ensure user status value is always valid.
 * @param status - Source account status
 * @returns Normalized status
 */
function normalizeStatus(status: AccountEntry["status"]): "active" | "inactive" {
	return status === "inactive" ? "inactive" : "active";
}

// ─── Main ───

async function main() {
	console.log("🌱 Seeding database from JSON configs...\n");

	// 1. Groups
	console.log("Creating groups...");
	for (const group of groups) {
		await prisma.group.upsert({
			where: { id: group.id },
			create: { id: group.id, name: group.name, description: group.description },
			update: { name: group.name, description: group.description },
		});
	}
	console.log(`✓ ${groups.length} groups created\n`);

	// 2. Users
	console.log("Creating users...");
	for (const acc of accounts) {
		const hashedPassword = await hashPassword(acc.password);
		const normalizedRoleId = normalizeRoleId(acc.roleId);
		const normalizedStatus = normalizeStatus(acc.status);

		await prisma.user.upsert({
			where: { email: acc.email },
			create: {
				id: acc.id,
				email: acc.email,
				password: hashedPassword,
				firstName: acc.firstName,
				lastName: acc.lastName,
				pseudo: acc.pseudo,
				role: acc.role,
				status: normalizedStatus,

				// Profile
				phone: null,
				birthdate: null,
				birthdayWish: false,
				languages: ["fr"],

				// Discord
				discordId: acc.discordId || null,
				discordUsername: null,

				// Social
				socialTwitter: null,
				socialTwitch: null,

				// Organisation
				entity: acc.entity,
				team: acc.team,
				division: acc.division,
				arrivalDate: acc.arrivalDate || null,

				// Permission system
				roleId: normalizedRoleId,
				entityAccess: acc.entityAccess,

				// 2FA
				a2fEnabled: acc.a2fEnabled,
			},
			update: {
				password: hashedPassword,
				firstName: acc.firstName,
				lastName: acc.lastName,
				role: acc.role,
				status: normalizedStatus,
				pseudo: acc.pseudo,
				team: acc.team,
				division: acc.division,
				roleId: normalizedRoleId,
				entityAccess: acc.entityAccess,
				entity: acc.entity,
			},
		});
		console.log(`  ✓ ${acc.id} — ${acc.email} (${acc.role})`);
	}
	console.log();

	// 3. Group memberships (derived from entityAccess)
	console.log("Creating group memberships...");
	let membershipCount = 0;
	for (const acc of accounts) {
		for (const entityId of acc.entityAccess) {
			const groupId = ENTITY_TO_GROUP[entityId];
			if (!groupId) continue;

			await prisma.groupMember.upsert({
				where: { userId_groupId: { userId: acc.id, groupId } },
				create: { userId: acc.id, groupId, role: acc.role },
				update: { role: acc.role },
			});
			membershipCount++;
		}
	}
	console.log(`✓ ${membershipCount} memberships created\n`);

	// ─── Seed test data (projects, tasks, meetings, absences) ───

	// Alias for readability (mapped from old u0-u9 to new user IDs)
	const luzrod = userId("usr-luzrod");
	const witt = userId("usr-witt");
	const candice = userId("usr-candice");
	const procy = userId("usr-procy");
	const andrew = userId("usr-andrew");
	const antwo = userId("usr-antwo");
	const flo = userId("usr-flo");
	const cancun = userId("usr-cancun");
	const shiny = userId("usr-shiny");
	const anaelle = userId("usr-anaelle");

	// 4. Projects
	console.log("Creating seed projects...");
	const projects = [
		{
			id: "proj-001",
			name: "Refonte Discord",
			emoji: "🎮",
			description: "Refonte complète de l'architecture du serveur Discord. Nouveaux salons, roles, bots.",
			status: "in_progress" as const,
			priority: "P1",
			groupId: "grp-inoxtag",
			createdById: luzrod,
			startDate: new Date("2026-02-01"),
			endDate: new Date("2026-03-31"),
			members: [
				{ userId: procy, role: "owner" },
				{ userId: witt, role: "assistant" },
				{ userId: shiny, role: "member" },
				{ userId: andrew, role: "member" },
			],
		},
		{
			id: "proj-002",
			name: "Moderation Live S2",
			emoji: "📺",
			description: "Organisation de la modération live pour la saison 2.",
			status: "in_progress" as const,
			priority: "P2",
			groupId: "grp-doigby",
			createdById: witt,
			startDate: new Date("2026-02-15"),
			endDate: new Date("2026-04-15"),
			members: [
				{ userId: flo, role: "owner" },
				{ userId: cancun, role: "assistant" },
				{ userId: antwo, role: "member" },
			],
		},
		{
			id: "proj-003",
			name: "Onboarding Marsha Academy",
			emoji: "🎓",
			description: "Mise en place du parcours de formation pour les nouvelles recrues via la Marsha Academy.",
			status: "in_progress" as const,
			priority: "P1",
			groupId: "grp-bazalthe",
			createdById: candice,
			startDate: new Date("2026-01-15"),
			endDate: new Date("2026-03-15"),
			members: [
				{ userId: candice, role: "owner" },
				{ userId: shiny, role: "assistant" },
				{ userId: anaelle, role: "member" },
			],
		},
		{
			id: "proj-004",
			name: "Guidelines YouTube",
			emoji: "📋",
			description: "Rédaction des guidelines de modération YouTube.",
			status: "todo" as const,
			priority: "P2",
			groupId: "grp-inoxtag",
			createdById: candice,
			startDate: new Date("2026-03-01"),
			endDate: new Date("2026-03-31"),
			members: [
				{ userId: andrew, role: "owner" },
				{ userId: candice, role: "member" },
			],
		},
	];

	for (const project of projects) {
		const { members, ...projectData } = project;

		await prisma.project.upsert({
			where: { id: project.id },
			create: projectData,
			update: {
				name: projectData.name,
				description: projectData.description,
				status: projectData.status,
				priority: projectData.priority,
				emoji: projectData.emoji,
			},
		});

		for (const member of members) {
			await prisma.projectMember.upsert({
				where: { projectId_userId: { projectId: project.id, userId: member.userId } },
				create: { projectId: project.id, userId: member.userId, role: member.role },
				update: { role: member.role },
			});
		}
	}
	console.log(`✓ ${projects.length} projects created\n`);

	// 5. Tasks
	console.log("Creating seed tasks...");
	const tasks = [
		{
			id: "task-001",
			title: "Configurer les rôles Discord",
			description: "Définir les rôles, couleurs et permissions pour le serveur",
			projectId: "proj-001",
			assigneeId: procy,
			createdById: luzrod,
			status: "in_progress" as const,
			priority: "high" as const,
			dueDate: new Date("2026-03-10"),
			subtasks: [
				{ id: "st-001", title: "Lister les rôles actuels", done: true },
				{ id: "st-002", title: "Proposer la nouvelle architecture", done: false },
			],
		},
		{
			id: "task-002",
			title: "Créer les formations dans la Marsha Academy",
			description: "Préparer les 3 modules de formation pour les nouveaux modérateurs",
			projectId: "proj-003",
			assigneeId: shiny,
			createdById: candice,
			status: "in_progress" as const,
			priority: "high" as const,
			dueDate: new Date("2026-03-10"),
		},
		{
			id: "task-003",
			title: "Planning des lives mars",
			description: "Établir le planning de modération pour les lives du mois de mars",
			projectId: "proj-002",
			assigneeId: flo,
			createdById: witt,
			status: "todo" as const,
			priority: "medium" as const,
			dueDate: new Date("2026-03-08"),
		},
		{
			id: "task-004",
			title: "Évaluer les candidats session recrutement",
			description: "Analyser les candidatures reçues pour la session de recrutement",
			projectId: "proj-003",
			assigneeId: anaelle,
			createdById: witt,
			status: "in_progress" as const,
			priority: "high" as const,
			dueDate: new Date("2026-03-12"),
		},
		{
			id: "task-005",
			title: "Mettre à jour les bots AutoMod",
			projectId: "proj-001",
			assigneeId: procy,
			createdById: luzrod,
			status: "done" as const,
			priority: "medium" as const,
			dueDate: new Date("2026-02-28"),
		},
		{
			id: "task-006",
			title: "Rédiger les guidelines anti-raid Twitch",
			projectId: "proj-002",
			assigneeId: antwo,
			createdById: witt,
			status: "todo" as const,
			priority: "high" as const,
			dueDate: new Date("2026-03-14"),
		},
		{
			id: "task-007",
			title: "Préparer le template de rapport d'incident",
			projectId: "proj-003",
			assigneeId: candice,
			createdById: candice,
			status: "in_progress" as const,
			priority: "low" as const,
			dueDate: new Date("2026-03-20"),
		},
		{
			id: "task-008",
			title: "Audit des sanctions Q1",
			projectId: "proj-002",
			assigneeId: cancun,
			createdById: witt,
			status: "todo" as const,
			priority: "low" as const,
			dueDate: new Date("2026-03-25"),
		},
		{
			id: "task-009",
			title: "Rédiger les guidelines YouTube",
			projectId: "proj-004",
			assigneeId: andrew,
			createdById: candice,
			status: "todo" as const,
			priority: "medium" as const,
			dueDate: new Date("2026-03-20"),
		},
		{
			id: "task-010",
			title: "Revue des accès après refonte",
			projectId: "proj-001",
			assigneeId: witt,
			createdById: witt,
			status: "todo" as const,
			priority: "medium" as const,
			dueDate: new Date("2026-04-01"),
		},
	];

	for (const task of tasks) {
		const { subtasks, ...taskData } = task as typeof task & {
			subtasks?: Array<{ id: string; title: string; done: boolean }>;
		};

		await prisma.task.upsert({
			where: { id: task.id },
			create: taskData,
			update: { title: taskData.title, status: taskData.status, priority: taskData.priority },
		});

		if (subtasks) {
			for (const subtask of subtasks) {
				await prisma.subtask.upsert({
					where: { id: subtask.id },
					create: { id: subtask.id, taskId: task.id, title: subtask.title, done: subtask.done },
					update: { title: subtask.title, done: subtask.done },
				});
			}
		}
	}
	console.log(`✓ ${tasks.length} tasks created\n`);

	// 6. Meetings
	console.log("Creating seed meetings...");
	const meetings = [
		{
			id: "meet-001",
			title: "Standup Marsha Teams",
			groupId: "grp-bazalthe",
			date: new Date("2026-03-09"),
			startTime: "10:00",
			endTime: "10:30",
			location: "Discord — Salon Vocal Marsha",
			type: "standup" as const,
			isOnline: true,
			link: "discord://marsha-vocal",
			attendeeIds: [luzrod, witt, candice],
		},
		{
			id: "meet-002",
			title: "Point Refonte Discord",
			groupId: "grp-inoxtag",
			date: new Date("2026-03-10"),
			startTime: "14:00",
			endTime: "15:00",
			location: "Discord — Salon Vocal",
			type: "réunion" as const,
			notes: "Valider l'architecture des salons avant la mise en production",
			isOnline: true,
			attendeeIds: [procy, witt, shiny],
		},
		{
			id: "meet-003",
			title: "Revue Onboarding Academy",
			groupId: "grp-bazalthe",
			date: new Date("2026-03-11"),
			startTime: "11:00",
			endTime: "12:00",
			location: "Discord — Salon Momentum",
			type: "revue" as const,
			notes: "Bilan des 3 premières semaines de la Marsha Academy",
			isOnline: true,
			attendeeIds: [candice, shiny, anaelle],
		},
		{
			id: "meet-004",
			title: "Entretien recrutement",
			groupId: "grp-bazalthe",
			date: new Date("2026-03-12"),
			startTime: "16:00",
			endTime: "16:45",
			location: "Discord — Salon Privé Recrutement",
			type: "entretien" as const,
			isOnline: true,
			attendeeIds: [anaelle, shiny],
		},
		{
			id: "meet-005",
			title: "Rétrospective Février",
			groupId: "grp-doigby",
			date: new Date("2026-03-13"),
			startTime: "15:00",
			endTime: "16:00",
			location: "Discord — Salon Vocal",
			type: "retrospective" as const,
			notes: "Retour sur la modération live du mois de février",
			isOnline: true,
			attendeeIds: [flo, cancun, antwo],
		},
	];

	for (const meeting of meetings) {
		const { attendeeIds, ...meetingData } = meeting;

		await prisma.meeting.upsert({
			where: { id: meeting.id },
			create: meetingData,
			update: { title: meetingData.title, notes: meetingData.notes },
		});

		for (const attendeeUserId of attendeeIds) {
			await prisma.meetingAttendee.upsert({
				where: { meetingId_userId: { meetingId: meeting.id, userId: attendeeUserId } },
				create: { meetingId: meeting.id, userId: attendeeUserId },
				update: {},
			});
		}
	}
	console.log(`✓ ${meetings.length} meetings created\n`);

	// 7. Absences
	console.log("Creating seed absences...");
	const absences = [
		{
			id: "abs-001",
			userId: andrew,
			type: "conge_paye" as const,
			startDate: new Date("2026-03-17"),
			endDate: new Date("2026-03-21"),
			reason: "Vacances",
			status: "approved" as const,
			approvedBy: luzrod,
			approvedAt: new Date("2026-03-01"),
		},
		{
			id: "abs-002",
			userId: cancun,
			type: "autre" as const,
			startDate: new Date("2026-03-10"),
			endDate: new Date("2026-03-10"),
			reason: "Rendez-vous médical",
			status: "approved" as const,
			approvedBy: luzrod,
			approvedAt: new Date("2026-03-01"),
		},
		{
			id: "abs-003",
			userId: antwo,
			type: "maladie" as const,
			startDate: new Date("2026-03-06"),
			endDate: new Date("2026-03-07"),
			reason: "Maladie",
			status: "pending" as const,
		},
	];

	for (const absence of absences) {
		await prisma.absence.upsert({
			where: { id: absence.id },
			create: absence,
			update: { status: absence.status },
		});
	}
	console.log(`✓ ${absences.length} absences created\n`);

	console.log("✅ Database seeded successfully from JSON configs!");
}

main()
	.catch((error) => {
		console.error("❌ Seed failed:", error);
		process.exit(1);
	})
	.finally(() => {
		prisma.$disconnect();
	});
