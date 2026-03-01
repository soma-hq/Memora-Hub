// Constants & types
import type {

	ActionResult,
	DetectedIntent,
	MessageAttachment,
	MessageListItem,
	Suggestion,
	ActiveFlow,
	ChatMessage,
} from "./types";
import {

	NAVIGATION_TARGETS,
	FLOW_DEFINITIONS,
	GREETING_RESPONSES,
	HELP_RESPONSE,
	WELCOME_SUGGESTIONS,
} from "./constants";
import { requiresFlow, requiresNavigation } from "./intent-engine";
import { getContextualSuggestions, hasPermissionForAction } from "./context-engine";
import type { AssistantContext } from "./types";


/**
 * Resolve a navigation target from the extracted entity and context
 * @param entities Extracted entities from intent
 * @param context Current assistant context
 * @returns Path and label, or null if target not found
 */

function resolveNavigationTarget(
	entities: Record<string, string>,
	context: AssistantContext,
): { path: string; label: string } | null {
	const target = entities.target?.toLowerCase().trim();
	if (!target) return null;

	// Try exact match first
	if (NAVIGATION_TARGETS[target]) {
		const nav = NAVIGATION_TARGETS[target];
		const path = nav.needsGroup ? nav.path.replace("{groupId}", context.currentGroupId || "default") : nav.path;
		return { path, label: nav.label };
	}

	// Try partial match
	for (const [key, nav] of Object.entries(NAVIGATION_TARGETS)) {
		if (target.includes(key) || key.includes(target)) {
			const path = nav.needsGroup ? nav.path.replace("{groupId}", context.currentGroupId || "default") : nav.path;
			return { path, label: nav.label };
		}
	}

	return null;
}

/**
 * Returns the task list (empty until connected to real data)
 * @param entities Extracted entities for filtering
 * @returns List of task items
 */
function getTaskList(entities: Record<string, string>): MessageListItem[] {
	return [];
}

/**
 * Returns the project list (empty until connected to real data)
 * @returns List of project items
 */
function getProjectList(): MessageListItem[] {
	return [];
}

/**
 * Returns the meeting list (empty until connected to real data)
 * @returns List of meeting items
 */
function getMeetingList(): MessageListItem[] {
	return [];
}

/**
 * Returns the absence list (empty until connected to real data)
 * @returns List of absence items
 */
function getAbsenceList(): MessageListItem[] {
	return [];
}

/**
 * Returns the notification list (empty until connected to real data)
 * @returns List of notification items
 */
function getNotificationList(): MessageListItem[] {
	return [];
}

/**
 * Returns the user list (empty until connected to real data)
 * @returns List of user items
 */
function getUserList(): MessageListItem[] {
	return [];
}

/**
 * Execute an action based on the detected intent and return a result
 * @param intent Detected intent from user input
 * @param context Current application context
 * @returns Action result with message, attachments, and suggestions
 */

export function executeAction(intent: DetectedIntent, context: AssistantContext): ActionResult {
	const { action, entities } = intent;

	// Check permission
	if (!hasPermissionForAction(action, context.currentUserRole)) {
		return {
			success: false,
			message: "Desole, vous n'avez pas les permissions necessaires pour effectuer cette action.",
			followUpSuggestions: WELCOME_SUGGESTIONS.slice(0, 4),
		};
	}

	// Handle each action type
	switch (action) {
		case "greet": {
			const response = GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)];
			return {
				success: true,
				message: response,
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "show_help": {
			return {
				success: true,
				message: HELP_RESPONSE,
				followUpSuggestions: WELCOME_SUGGESTIONS.slice(0, 4),
			};
		}

		case "navigate_to": {
			const navTarget = resolveNavigationTarget(entities, context);
			if (navTarget) {
				return {
					success: true,
					message: `Je vous emmene vers **${navTarget.label}**.`,
					navigateTo: navTarget.path,
					followUpSuggestions: getContextualSuggestions({
						...context,
						currentPage: navTarget.path,
					}),
				};
			}

			// Couldn't find target, offer navigation options
			const navLinks = Object.entries(NAVIGATION_TARGETS)
				.slice(0, 8)
				.map(([key, nav]) => ({
					label: nav.label,
					href: nav.needsGroup
						? nav.path.replace("{groupId}", context.currentGroupId || "default")
						: nav.path,
					description: key,
				}));

			return {
				success: false,
				message: "Je n'ai pas trouve cette page. Voici les pages disponibles :",
				attachment: { type: "navigation", links: navLinks },
				followUpSuggestions: WELCOME_SUGGESTIONS.slice(0, 4),
			};
		}

		case "list_tasks": {
			const tasks = getTaskList(entities);
			const statusLabel = entities.status ? ` (${entities.status})` : "";
			return {
				success: true,
				message: `Voici vos taches${statusLabel} :`,
				attachment: {
					type: "list",
					title: `Taches${statusLabel}`,
					items: tasks,
					emptyText: "Aucune tache trouvee.",
				},
				followUpSuggestions: [
					{
						id: "fs-create-task",
						label: "Creer une tache",
						icon: "plus",
						query: "Creer une nouvelle tache",
						category: "task",
					},
					{
						id: "fs-filter-inprogress",
						label: "En cours seulement",
						icon: "filter",
						query: "Montre-moi mes taches en cours",
						category: "task",
					},
				],
			};
		}

		case "list_projects": {
			const projects = getProjectList();
			return {
				success: true,
				message: "Voici la liste des projets :",
				attachment: {
					type: "list",
					title: "Projets",
					items: projects,
					emptyText: "Aucun projet.",
				},
				followUpSuggestions: [
					{
						id: "fs-create-project",
						label: "Nouveau projet",
						icon: "plus",
						query: "Creer un nouveau projet",
						category: "project",
					},
					{
						id: "fs-project-tasks",
						label: "Voir les taches",
						icon: "tasks",
						query: "Montre-moi les taches",
						category: "task",
					},
				],
			};
		}

		case "list_meetings": {
			const meetings = getMeetingList();
			return {
				success: true,
				message: "Voici vos prochaines reunions :",
				attachment: {
					type: "list",
					title: "Reunions a venir",
					items: meetings,
					emptyText: "Aucune reunion planifiee.",
				},
				followUpSuggestions: [
					{
						id: "fs-new-meeting",
						label: "Nouvelle reunion",
						icon: "plus",
						query: "Planifier une reunion",
						category: "meeting",
					},
				],
			};
		}

		case "list_absences": {
			const absences = getAbsenceList();
			return {
				success: true,
				message: "Voici vos demandes d'absence :",
				attachment: {
					type: "list",
					title: "Absences",
					items: absences,
					emptyText: "Aucune demande d'absence.",
				},
				followUpSuggestions: [
					{
						id: "fs-new-absence",
						label: "Poser un conge",
						icon: "calendar",
						query: "Je veux poser un conge",
						category: "absence",
					},
				],
			};
		}

		case "list_notifications": {
			const notifications = getNotificationList();
			return {
				success: true,
				message: "Voici vos notifications recentes :",
				attachment: {
					type: "list",
					title: "Notifications",
					items: notifications,
					emptyText: "Aucune notification.",
				},
				followUpSuggestions: [
					{
						id: "fs-mark-read",
						label: "Tout marquer lu",
						icon: "check",
						query: "Marquer toutes les notifications comme lues",
						category: "notification",
					},
				],
			};
		}

		case "mark_notifications_read": {
			return {
				success: true,
				message: "Toutes vos notifications ont ete marquees comme lues.",
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "list_users":
		case "find_user": {
			const users = getUserList();
			return {
				success: true,
				message: "Voici les membres de l'equipe :",
				attachment: {
					type: "list",
					title: "Equipe",
					items: users,
					emptyText: "Aucun utilisateur trouve.",
				},
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "search_global": {
			const query = entities.query || intent.rawQuery;
			return {
				success: true,
				message: `Resultats de recherche pour **"${query}"** :`,
				attachment: {
					type: "list",
					title: `Recherche : ${query}`,
					items: [],
					emptyText: "Aucun resultat.",
				},
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "change_theme": {
			const targetTheme = entities.theme || "dark";
			const themeLabel = targetTheme === "dark" ? "sombre" : targetTheme === "light" ? "clair" : "systeme";
			return {
				success: true,
				message: `Le theme a ete change en mode **${themeLabel}**.`,
				data: { theme: targetTheme },
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "toggle_admin_mode": {
			return {
				success: true,
				message: context.adminMode ? "Le **mode admin** a ete desactive." : "Le **mode admin** a ete active.",
				data: { adminMode: !context.adminMode },
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "export_data": {
			const format = entities.format || "pdf";
			return {
				success: true,
				message: `L'export en **${format.toUpperCase()}** est en cours de preparation. Vous recevrez une notification quand il sera pret.`,
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "complete_task": {
			return {
				success: true,
				message: entities.name
					? `La tache **"${entities.name}"** a ete marquee comme terminee.`
					: "La tache a ete marquee comme terminee.",
				followUpSuggestions: [
					{
						id: "fs-list-tasks",
						label: "Voir mes taches",
						icon: "tasks",
						query: "Montre-moi mes taches",
						category: "task",
					},
				],
			};
		}

		case "show_stats": {
			return {
				success: true,
				message: "Voici un apercu de vos indicateurs :",
				attachment: {
					type: "stats",
					title: "Indicateurs cles",
					stats: [],
				},
				followUpSuggestions: [
					{
						id: "fs-go-stats",
						label: "Page statistiques",
						icon: "stats",
						query: "Emmene-moi vers les statistiques",
						category: "navigation",
					},
				],
			};
		}

		case "approve_absence": {
			return {
				success: true,
				message: "La demande d'absence a ete **approuvee**. Le collaborateur a ete notifie.",
				followUpSuggestions: [
					{
						id: "fs-list-abs",
						label: "Voir les absences",
						icon: "calendar",
						query: "Montre-moi les absences en attente",
						category: "absence",
					},
				],
			};
		}

		case "reject_absence": {
			return {
				success: true,
				message: "La demande d'absence a ete **refusee**. Le collaborateur a ete notifie.",
				followUpSuggestions: [
					{
						id: "fs-list-abs",
						label: "Voir les absences",
						icon: "calendar",
						query: "Montre-moi les absences en attente",
						category: "absence",
					},
				],
			};
		}

		case "cancel_meeting": {
			return {
				success: true,
				message: entities.name
					? `La reunion **"${entities.name}"** a ete annulee. Les participants ont ete notifies.`
					: "La reunion a ete annulee. Les participants ont ete notifies.",
				followUpSuggestions: [
					{
						id: "fs-list-meetings",
						label: "Voir les reunions",
						icon: "calendar",
						query: "Montre-moi mes reunions",
						category: "meeting",
					},
				],
			};
		}

		case "list_candidates": {
			return {
				success: true,
				message: "Voici les candidats en cours de recrutement :",
				attachment: {
					type: "list",
					title: "Candidats",
					items: [],
					emptyText: "Aucun candidat.",
				},
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "list_trainings": {
			return {
				success: true,
				message: "Voici les formations disponibles :",
				attachment: {
					type: "list",
					title: "Formations",
					items: [],
					emptyText: "Aucune formation.",
				},
				followUpSuggestions: [
					{
						id: "fs-new-training",
						label: "Nouvelle formation",
						icon: "plus",
						query: "Creer une formation",
						category: "training",
					},
				],
			};
		}

		// Flow-based actions are handled by the flow system
		case "create_task":
		case "create_project":
		case "create_meeting":
		case "request_absence":
		case "create_job_offer":
		case "create_training":
		case "update_task":
		case "update_project":
		case "delete_task":
		case "delete_project":
		case "assign_task": {
			// These are handled by the flow initiator, should not reach here
			return {
				success: true,
				message: "Lancement du formulaire...",
				followUpSuggestions: [],
			};
		}

		default: {
			return {
				success: false,
				message:
					"Je n'ai pas bien compris votre demande. Pouvez-vous reformuler ou essayer l'une de ces suggestions ?",
				followUpSuggestions: getContextualSuggestions(context),
			};
		}
	}
}

/**
 * Get the flow definition for a given action
 * @param action Intent action that requires a flow
 * @returns Flow definition or null
 */

export function getFlowForAction(action: string): (typeof FLOW_DEFINITIONS)[number] | null {
	return FLOW_DEFINITIONS.find((f) => f.action === action) || null;
}

/**
 * Initialize a new active flow from a flow definition
 * @param flowDef Flow definition to initialize
 * @param prefilledData Optional pre-filled data from entity extraction
 * @returns Initialized active flow state
 */

export function initializeFlow(
	flowDef: (typeof FLOW_DEFINITIONS)[number],
	prefilledData?: Record<string, string>,
): ActiveFlow {
	return {
		id: `flow-${Date.now()}`,
		action: flowDef.action,
		steps: flowDef.steps,
		currentStepIndex: 0,
		collectedData: prefilledData || {},
		startedAt: new Date().toISOString(),
	};
}

/**
 * Generate a summary message for a completed flow
 * @param action The action that was completed
 * @param data The collected form data
 * @returns Human-readable summary message
 */

export function getFlowCompletionMessage(action: string, data: Record<string, string>): string {
	switch (action) {
		case "create_task":
			return (
				`La tache **"${data.title}"** a ete creee avec succes !\n\n` +
				(data.priority ? `- Priorite : ${data.priority}\n` : "") +
				(data.status ? `- Statut : ${data.status}\n` : "") +
				(data.assignee ? `- Assignee a : ${data.assignee}\n` : "") +
				(data.dueDate ? `- Echeance : ${data.dueDate}\n` : "")
			);

		case "create_project":
			return (
				`Le projet **"${data.name}"** a ete cree avec succes !\n\n` +
				(data.status ? `- Statut : ${data.status === "todo" ? "A faire" : "En cours"}\n` : "") +
				(data.startDate ? `- Debut : ${data.startDate}\n` : "") +
				(data.endDate ? `- Fin prevue : ${data.endDate}\n` : "")
			);

		case "create_meeting":
			return (
				`La reunion **"${data.title}"** a ete planifiee !\n\n` +
				`- Date : ${data.date}\n` +
				`- Heure : ${data.time}\n` +
				(data.duration ? `- Duree : ${data.duration}\n` : "") +
				(data.location ? `- Lieu : ${data.location}\n` : "")
			);

		case "request_absence":
			return (
				`Votre demande d'absence a ete soumise !\n\n` +
				`- Type : ${data.type === "conge_paye" ? "Conge paye" : data.type === "rtt" ? "RTT" : data.type === "maladie" ? "Maladie" : "Autre"}\n` +
				`- Du : ${data.startDate}\n` +
				`- Au : ${data.endDate}\n` +
				(data.reason ? `- Motif : ${data.reason}\n` : "") +
				"\nVotre responsable sera notifie pour validation."
			);

		case "create_job_offer":
			return (
				`L'offre d'emploi **"${data.title}"** a ete publiee !\n\n` +
				`- Contrat : ${data.contractType?.toUpperCase()}\n` +
				"\nL'offre est maintenant visible dans le module recrutement."
			);

		case "create_training":
			return (
				`La formation **"${data.title}"** a ete creee !\n\n` +
				(data.category ? `- Categorie : ${data.category}\n` : "") +
				"\nLa formation est disponible dans le module formations."
			);

		default:
			return "L'action a ete effectuee avec succes !";
	}
}

/**
 * Get follow-up suggestions after completing a flow
 * @param action Completed flow action
 * @param context Current context
 * @returns Relevant follow-up suggestions
 */

export function getFlowCompletionSuggestions(action: string, context: AssistantContext): Suggestion[] {
	switch (action) {
		case "create_task":
			return [
				{
					id: "fc-list-tasks",
					label: "Voir mes taches",
					icon: "tasks",
					query: "Montre-moi mes taches",
					category: "task",
				},
				{
					id: "fc-another-task",
					label: "Creer une autre tache",
					icon: "plus",
					query: "Creer une nouvelle tache",
					category: "task",
				},
				{
					id: "fc-go-tasks",
					label: "Aller aux taches",
					icon: "tasks",
					query: "Emmene-moi vers les taches",
					category: "navigation",
				},
			];

		case "create_project":
			return [
				{
					id: "fc-list-projects",
					label: "Voir les projets",
					icon: "folder",
					query: "Liste des projets",
					category: "project",
				},
				{
					id: "fc-add-task",
					label: "Ajouter une tache",
					icon: "plus",
					query: "Creer une tache",
					category: "task",
				},
			];

		case "create_meeting":
			return [
				{
					id: "fc-list-meetings",
					label: "Voir les reunions",
					icon: "calendar",
					query: "Mes prochaines reunions",
					category: "meeting",
				},
				{
					id: "fc-another-meeting",
					label: "Planifier une autre",
					icon: "plus",
					query: "Planifier une reunion",
					category: "meeting",
				},
			];

		case "request_absence":
			return [
				{
					id: "fc-list-absences",
					label: "Mes absences",
					icon: "calendar",
					query: "Voir mes demandes d'absence",
					category: "absence",
				},
				{
					id: "fc-go-absences",
					label: "Page absences",
					icon: "calendar",
					query: "Emmene-moi vers les absences",
					category: "navigation",
				},
			];

		default:
			return getContextualSuggestions(context);
	}
}
