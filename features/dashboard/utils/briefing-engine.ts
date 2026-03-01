// Types
import type { UserProfile } from "@/features/users/types";
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";
import type { Meeting } from "@/features/meetings/types";
import type { Absence } from "@/features/absences/types";


// ─── Briefing types ─────────────────────────────────────────────────────────

/** Single briefing item displayed in the dashboard feed */
export interface BriefingItem {
	id: string;
	category: "projects" | "tasks" | "schedule" | "team" | "deadlines";
	icon: string;
	title: string;
	description?: string;
	link?: string;
	priority: "high" | "medium" | "low";
	timestamp?: string;
}

/** Today's schedule entry */
export interface ScheduleItem {
	id: string;
	time: string;
	title: string;
	location?: string;
	participants: string[];
	type: "meeting" | "deadline" | "event";
}

/** Action requiring user attention */
export interface ActionItem {
	id: string;
	title: string;
	urgency: "urgent" | "soon" | "later";
	dueDate?: string;
	link?: string;
}

/** Complete briefing payload for the dashboard */
export interface BriefingData {
	greeting: string;
	subtitle: string;
	items: BriefingItem[];
	todaySchedule: ScheduleItem[];
	pendingActions: ActionItem[];
	stats: { projects: number; tasks: number; meetings: number; deadlines: number };
}

/** Raw data sources passed to the briefing engine */
interface DataSources {
	users: UserProfile[];
	projects: Project[];
	tasks: Task[];
	meetings: Meeting[];
	absences: Absence[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns a French greeting based on time of day */
function getGreeting(name: string): string {
	const hour = new Date().getHours();
	if (hour < 12) return `Bonjour ${name} !`;
	if (hour < 18) return `Bon apres-midi ${name} !`;
	return `Bonsoir ${name} !`;
}

/** Returns a contextual subtitle based on time and data */
function getSubtitle(todayMeetingCount: number, pendingTaskCount: number, deadlineCount: number): string {
	const parts: string[] = [];
	if (todayMeetingCount > 0) {
		parts.push(`${todayMeetingCount} reunion${todayMeetingCount > 1 ? "s" : ""} aujourd'hui`);
	}
	if (pendingTaskCount > 0) {
		parts.push(`${pendingTaskCount} tache${pendingTaskCount > 1 ? "s" : ""} en cours`);
	}
	if (deadlineCount > 0) {
		parts.push(`${deadlineCount} echeance${deadlineCount > 1 ? "s" : ""} proche${deadlineCount > 1 ? "s" : ""}`);
	}
	if (parts.length === 0) return "Voici ton briefing pour aujourd'hui.";
	return `Tu as ${parts.join(", ")}.`;
}

/** Formats a date as "dd/MM" */
function shortDate(dateStr: string): string {
	const d = new Date(dateStr);
	return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Formats a date as a human-readable French string */
function humanDate(dateStr: string): string {
	const d = new Date(dateStr);
	return d.toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});
}

/** Checks if a date string matches today */
function isToday(dateStr: string): boolean {
	const d = new Date(dateStr);
	const now = new Date();
	return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

/** Checks if a date string is tomorrow */
function isTomorrow(dateStr: string): boolean {
	const d = new Date(dateStr);
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	return (
		d.getFullYear() === tomorrow.getFullYear() &&
		d.getMonth() === tomorrow.getMonth() &&
		d.getDate() === tomorrow.getDate()
	);
}

/** Checks if a date is within the next N days from now */
function isWithinDays(dateStr: string, days: number): boolean {
	const d = new Date(dateStr);
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	d.setHours(0, 0, 0, 0);
	const diff = d.getTime() - now.getTime();
	return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

/** Checks if a date range overlaps with today */
function isActiveAbsence(startDate: string, endDate: string): boolean {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	const start = new Date(startDate);
	start.setHours(0, 0, 0, 0);
	const end = new Date(endDate);
	end.setHours(23, 59, 59, 999);
	return now >= start && now <= end;
}

/** Priority sort weight */
function priorityWeight(p: "high" | "medium" | "low"): number {
	if (p === "high") return 0;
	if (p === "medium") return 1;
	return 2;
}

// ─── User project membership check ─────────────────────────────────────────

/** Check if user is a member of a project */
function isUserInProject(project: Project, userId: string): boolean {
	return (
		project.responsible?.userId === userId ||
		project.assistants?.some((a) => a.userId === userId) ||
		project.members?.some((m) => m.userId === userId)
	);
}

// ─── Generators ─────────────────────────────────────────────────────────────

/** Generate project-related briefing items */
function generateProjectItems(userId: string, projects: Project[]): BriefingItem[] {
	const items: BriefingItem[] = [];
	const userProjects = projects.filter((p) => isUserInProject(p, userId));

	for (const project of userProjects) {
		// Skip done/archived projects
		if (project.status === "done" || project.status === "archived") continue;

		// Check for recent timeline activity (last 3 days)
		const recentTimeline = (project.timeline || []).filter((entry) => isWithinDays(entry.timestamp, 3));

		if (recentTimeline.length > 0) {
			const latest = recentTimeline[recentTimeline.length - 1];
			items.push({
				id: `proj-update-${project.id}`,
				category: "projects",
				icon: "FolderIcon",
				title: `Le projet "${project.name}" a avance — ${latest.user} : ${latest.description}.`,
				description: `Progression : ${project.progress}%`,
				link: `/projects/${project.id}`,
				priority: project.priority === "P0" || project.priority === "P1" ? "high" : "medium",
				timestamp: latest.timestamp,
			});
		} else if (project.status === "in_progress") {
			// Show active projects the user is on
			items.push({
				id: `proj-active-${project.id}`,
				category: "projects",
				icon: "FolderIcon",
				title: `Le projet "${project.name}" est en cours (${project.progress}%).`,
				description: `${project.tasks.inProgress} tache${project.tasks.inProgress > 1 ? "s" : ""} en cours, ${project.tasks.todo} a faire`,
				link: `/projects/${project.id}`,
				priority: "low",
			});
		}

		if (project.status === "paused") {
			items.push({
				id: `proj-paused-${project.id}`,
				category: "projects",
				icon: "ExclamationTriangleIcon",
				title: `Le projet "${project.name}" est en pause.`,
				link: `/projects/${project.id}`,
				priority: "medium",
			});
		}
	}

	return items;
}

/** Generate task-related briefing items */
function generateTaskItems(userId: string, tasks: Task[]): BriefingItem[] {
	const items: BriefingItem[] = [];
	const userTasks = tasks.filter((t) => t.assignee?.userId === userId);

	// Tasks due today or tomorrow
	for (const task of userTasks) {
		if (!task.dueDate || task.status === "done") continue;

		if (isToday(task.dueDate)) {
			items.push({
				id: `task-due-today-${task.id}`,
				category: "deadlines",
				icon: "ExclamationTriangleIcon",
				title: `Ta tache "${task.title}" arrive a echeance aujourd'hui.`,
				description: task.projectName ? `Projet : ${task.projectName}` : undefined,
				link: `/tasks/${task.id}`,
				priority: "high",
				timestamp: task.dueDate,
			});
		} else if (isTomorrow(task.dueDate)) {
			items.push({
				id: `task-due-tomorrow-${task.id}`,
				category: "deadlines",
				icon: "ClockIcon",
				title: `Ta tache "${task.title}" arrive a echeance demain.`,
				description: task.projectName ? `Projet : ${task.projectName}` : undefined,
				link: `/tasks/${task.id}`,
				priority: "high",
				timestamp: task.dueDate,
			});
		} else if (isWithinDays(task.dueDate, 3)) {
			items.push({
				id: `task-due-soon-${task.id}`,
				category: "deadlines",
				icon: "ClockIcon",
				title: `Ta tache "${task.title}" est due le ${humanDate(task.dueDate)}.`,
				description: task.projectName ? `Projet : ${task.projectName}` : undefined,
				link: `/tasks/${task.id}`,
				priority: "medium",
				timestamp: task.dueDate,
			});
		}
	}

	// In-progress tasks
	const inProgressTasks = userTasks.filter((t) => t.status === "in_progress");
	if (inProgressTasks.length > 0) {
		if (inProgressTasks.length === 1) {
			const task = inProgressTasks[0];
			items.push({
				id: `task-progress-${task.id}`,
				category: "tasks",
				icon: "CheckCircleIcon",
				title: `Ta tache "${task.title}" est en cours.`,
				description: task.dueDate ? `Echeance : ${humanDate(task.dueDate)}` : undefined,
				link: `/tasks/${task.id}`,
				priority: "medium",
			});
		} else {
			items.push({
				id: "tasks-in-progress-summary",
				category: "tasks",
				icon: "CheckCircleIcon",
				title: `Tu as ${inProgressTasks.length} taches en cours.`,
				description: inProgressTasks.map((t) => t.title).join(", "),
				link: "/tasks",
				priority: "medium",
			});
		}
	}

	// Todo tasks
	const todoTasks = userTasks.filter((t) => t.status === "todo");
	if (todoTasks.length > 0) {
		items.push({
			id: "tasks-todo-summary",
			category: "tasks",
			icon: "ClipboardDocumentListIcon",
			title: `${todoTasks.length} tache${todoTasks.length > 1 ? "s" : ""} en attente te sont assignee${todoTasks.length > 1 ? "s" : ""}.`,
			link: "/tasks",
			priority: "low",
		});
	}

	return items;
}

/** Generate schedule briefing items from today's meetings */
function generateScheduleItems(userId: string, meetings: Meeting[]): BriefingItem[] {
	const items: BriefingItem[] = [];
	const todayMeetings = meetings.filter((m) => isToday(m.date) && m.participants?.some((p) => p.userId === userId));

	if (todayMeetings.length > 0) {
		if (todayMeetings.length === 1) {
			const mtg = todayMeetings[0];
			const participantNames = mtg.participants
				.filter((p) => p.userId !== userId)
				.map((p) => p.name)
				.join(", ");
			items.push({
				id: `schedule-today-${mtg.id}`,
				category: "schedule",
				icon: "CalendarDaysIcon",
				title: `Tu as 1 reunion aujourd'hui : ${mtg.title} a ${mtg.startTime}.`,
				description: participantNames ? `Avec ${participantNames}` : undefined,
				link: `/meetings/${mtg.id}`,
				priority: "medium",
			});
		} else {
			const titles = todayMeetings.map((m) => `${m.title} a ${m.startTime}`).join(" et ");
			items.push({
				id: "schedule-today-summary",
				category: "schedule",
				icon: "CalendarDaysIcon",
				title: `Tu as ${todayMeetings.length} reunions aujourd'hui : ${titles}.`,
				link: "/meetings",
				priority: "medium",
			});
		}
	}

	// Upcoming meetings within 3 days (not today)
	const upcomingMeetings = meetings.filter(
		(m) => !isToday(m.date) && isWithinDays(m.date, 3) && m.participants?.some((p) => p.userId === userId),
	);

	for (const mtg of upcomingMeetings) {
		items.push({
			id: `schedule-upcoming-${mtg.id}`,
			category: "schedule",
			icon: "CalendarDaysIcon",
			title: `Reunion "${mtg.title}" prevue le ${humanDate(mtg.date)} a ${mtg.startTime}.`,
			description: mtg.location ? `Lieu : ${mtg.location}` : undefined,
			priority: "low",
		});
	}

	return items;
}

/** Generate team news from absences */
function generateTeamItems(userId: string, absences: Absence[], users: UserProfile[]): BriefingItem[] {
	const items: BriefingItem[] = [];

	// Active or upcoming approved absences for team members (not self)
	const relevantAbsences = absences.filter(
		(a) =>
			a.userId !== userId &&
			a.status === "approved" &&
			(isActiveAbsence(a.startDate, a.endDate) || isWithinDays(a.startDate, 7)),
	);

	for (const absence of relevantAbsences) {
		const user = users.find((u) => u.id === absence.userId);
		const name = user?.pseudo || absence.userName;
		const endFormatted = humanDate(absence.endDate);

		if (isActiveAbsence(absence.startDate, absence.endDate)) {
			items.push({
				id: `team-absence-${absence.id}`,
				category: "team",
				icon: "UsersIcon",
				title: `${name} est absent${name.endsWith("e") ? "e" : ""} jusqu'au ${endFormatted}.`,
				description: absence.reason || undefined,
				priority: "low",
			});
		} else {
			items.push({
				id: `team-absence-upcoming-${absence.id}`,
				category: "team",
				icon: "UsersIcon",
				title: `${name} sera absent${name.endsWith("e") ? "e" : ""} du ${humanDate(absence.startDate)} au ${endFormatted}.`,
				priority: "low",
			});
		}
	}

	return items;
}

// ─── Schedule builder ───────────────────────────────────────────────────────

/** Build today's schedule from meetings and deadlines */
function buildTodaySchedule(userId: string, meetings: Meeting[], tasks: Task[]): ScheduleItem[] {
	const schedule: ScheduleItem[] = [];

	// Today's meetings
	const todayMeetings = meetings.filter((m) => isToday(m.date) && m.participants?.some((p) => p.userId === userId));

	for (const mtg of todayMeetings) {
		schedule.push({
			id: mtg.id,
			time: mtg.startTime,
			title: mtg.title,
			location: mtg.location,
			participants: mtg.participants.filter((p) => p.userId !== userId).map((p) => p.name),
			type: "meeting",
		});
	}

	// Today's deadlines
	const todayDeadlines = tasks.filter(
		(t) => t.assignee?.userId === userId && t.dueDate && isToday(t.dueDate) && t.status !== "done",
	);

	for (const task of todayDeadlines) {
		schedule.push({
			id: task.id,
			time: "23:59",
			title: `Echeance : ${task.title}`,
			participants: [],
			type: "deadline",
		});
	}

	// Sort by time
	return schedule.sort((a, b) => a.time.localeCompare(b.time));
}

// ─── Actions builder ────────────────────────────────────────────────────────

/** Build pending action items from tasks and deadlines */
function buildPendingActions(userId: string, tasks: Task[], projects: Project[]): ActionItem[] {
	const actions: ActionItem[] = [];
	const userTasks = tasks.filter((t) => t.assignee?.userId === userId && t.status !== "done");

	for (const task of userTasks) {
		if (!task.dueDate) continue;

		let urgency: "urgent" | "soon" | "later";
		if (isToday(task.dueDate) || isTomorrow(task.dueDate)) {
			urgency = "urgent";
		} else if (isWithinDays(task.dueDate, 5)) {
			urgency = "soon";
		} else {
			continue; // Skip tasks more than 5 days away
		}

		actions.push({
			id: `action-task-${task.id}`,
			title: task.title,
			urgency,
			dueDate: shortDate(task.dueDate),
			link: `/tasks/${task.id}`,
		});
	}

	// Check for project communications that need handling
	for (const project of projects) {
		if (!isUserInProject(project, userId)) continue;
		const pendingComms = (project.relations?.communications || []).filter(
			(c) => c.status === "todo" || c.status === "in_progress",
		);
		for (const comm of pendingComms) {
			actions.push({
				id: `action-comm-${comm.id}`,
				title: `Communication a preparer : ${comm.description} (${project.name})`,
				urgency: "soon",
				link: `/projects/${project.id}`,
			});
		}
	}

	// Sort by urgency
	const urgencyWeight = { urgent: 0, soon: 1, later: 2 };
	return actions.sort((a, b) => urgencyWeight[a.urgency] - urgencyWeight[b.urgency]);
}

// ─── Main generator ─────────────────────────────────────────────────────────

/**
 * Generates a complete personal briefing for the given user.
 * Collates project updates, task states, schedule, team news, and deadlines.
 */
export function generateBriefing(userId: string, data: DataSources): BriefingData {
	const { users, projects, tasks, meetings, absences } = data;

	// Find user
	const user = users.find((u) => u.id === userId);
	const name = user?.pseudo || "Utilisateur";

	// Generate all items
	const projectItems = generateProjectItems(userId, projects);
	const taskItems = generateTaskItems(userId, tasks);
	const scheduleItems = generateScheduleItems(userId, meetings);
	const teamItems = generateTeamItems(userId, absences, users);

	// Merge and sort items by priority then timestamp
	const allItems = [...projectItems, ...taskItems, ...scheduleItems, ...teamItems].sort((a, b) => {
		const pw = priorityWeight(a.priority) - priorityWeight(b.priority);
		if (pw !== 0) return pw;
		if (a.timestamp && b.timestamp) return b.timestamp.localeCompare(a.timestamp);
		return 0;
	});

	// Build schedule and actions
	const todaySchedule = buildTodaySchedule(userId, meetings, tasks);
	const pendingActions = buildPendingActions(userId, tasks, projects);

	// Compute stats
	const userProjects = projects.filter((p) => isUserInProject(p, userId));
	const activeProjects = userProjects.filter((p) => p.status !== "done" && p.status !== "archived");
	const userTasks = tasks.filter((t) => t.assignee?.userId === userId && t.status !== "done");
	const userMeetings = meetings.filter(
		(m) => isWithinDays(m.date, 7) && m.participants?.some((p) => p.userId === userId),
	);
	const deadlineItems = allItems.filter((i) => i.category === "deadlines");

	// Compute subtitle data
	const todayMeetingCount = todaySchedule.filter((s) => s.type === "meeting").length;
	const pendingTaskCount = userTasks.filter((t) => t.status === "in_progress").length;

	return {
		greeting: getGreeting(name),
		subtitle: getSubtitle(todayMeetingCount, pendingTaskCount, deadlineItems.length),
		items: allItems,
		todaySchedule,
		pendingActions,
		stats: {
			projects: activeProjects.length,
			tasks: userTasks.length,
			meetings: userMeetings.length,
			deadlines: deadlineItems.length,
		},
	};
}
