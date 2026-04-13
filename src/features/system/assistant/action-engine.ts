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
 * Resolve à navigation target from the extracted entity and context
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
			message: "Désolé, vous n'avez pas les permissions nécessaires pour effectuer cette action.",
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
					message: `Je vous emmène vers **${navTarget.label}**.`,
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
				message: "Je n'ai pas trouvé cette page. Voici les pages disponibles :",
				attachment: { type: "navigation", links: navLinks },
				followUpSuggestions: WELCOME_SUGGESTIONS.slice(0, 4),
			};
		}

		case "list_tasks": {
			const tasks = getTaskList(entities);
			const statusLabel = entities.status ? ` (${entities.status})` : "";
			return {
				success: true,
				message: `Voici vos tâches${statusLabel} :`,
				attachment: {
					type: "list",
					title: `Tâches${statusLabel}`,
					items: tasks,
					emptyText: "Aucune tâche trouvée.",
				},
				followUpSuggestions: [
					{
						id: "fs-create-task",
						label: "Créer une tâche",
						icon: "plus",
						query: "Créer une nouvelle tâche",
						category: "task",
					},
					{
						id: "fs-filter-inprogress",
						label: "En cours seulement",
						icon: "filter",
						query: "Montre-moi mes tâches en cours",
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
						query: "Créer un nouveau projet",
						category: "project",
					},
					{
						id: "fs-project-tasks",
						label: "Voir les tâches",
						icon: "tasks",
						query: "Montre-moi les tâches",
						category: "task",
					},
				],
			};
		}

		case "list_meetings": {
			const meetings = getMeetingList();
			return {
				success: true,
				message: "Voici vos prochaines réunions :",
				attachment: {
					type: "list",
					title: "Réunions à venir",
					items: meetings,
					emptyText: "Aucune réunion planifiée.",
				},
				followUpSuggestions: [
					{
						id: "fs-new-meeting",
						label: "Nouvelle réunion",
						icon: "plus",
						query: "Planifier une réunion",
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
				message: "Voici vos notifications récentes :",
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
				message: "Toutes vos notifications ont été marquées comme lues.",
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "list_users":
		case "find_user": {
			const users = getUserList();
			return {
				success: true,
				message: "Voici les membres de l'équipe :",
				attachment: {
					type: "list",
					title: "Équipe",
					items: users,
					emptyText: "Aucun utilisateur trouvé.",
				},
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "search_global": {
			const query = entities.query || intent.rawQuery;
			return {
				success: true,
				message: `Résultats de recherche pour **"${query}"** :`,
				attachment: {
					type: "list",
					title: `Recherche : ${query}`,
					items: [],
					emptyText: "Aucun résultat.",
				},
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "change_theme": {
			const targetTheme = entities.theme || "dark";
			const themeLabel = targetTheme === "dark" ? "sombre" : targetTheme === "light" ? "clair" : "système";
			return {
				success: true,
				message: `Le thème a été changé en mode **${themeLabel}**.`,
				data: { theme: targetTheme },
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "toggle_admin_mode": {
			return {
				success: true,
				message: context.adminMode ? "Le **mode admin** a été désactivé." : "Le **mode admin** a été activé.",
				data: { adminMode: !context.adminMode },
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "export_data": {
			const format = entities.format || "pdf";
			return {
				success: true,
				message: `L'export en **${format.toUpperCase()}** est en cours de préparation. Vous recevrez une notification quand il sera prêt.`,
				followUpSuggestions: getContextualSuggestions(context),
			};
		}

		case "complete_task": {
			return {
				success: true,
				message: entities.name
					? `La tâche **"${entities.name}"** a été marquée comme terminée.`
					: "La tâche a été marquée comme terminée.",
				followUpSuggestions: [
					{
						id: "fs-list-tasks",
						label: "Voir mes tâches",
						icon: "tasks",
						query: "Montre-moi mes tâches",
						category: "task",
					},
				],
			};
		}

		case "show_stats": {
			return {
				success: true,
				message: "Voici un aperçu de vos indicateurs :",
				attachment: {
					type: "stats",
					title: "Indicateurs clés",
					stats: [],
				},
				followUpSuggestions: [
					{
						id: "fs-go-stats",
						label: "Page statistiques",
						icon: "stats",
						query: "Emmène-moi vers les statistiques",
						category: "navigation",
					},
				],
			};
		}

		case "approve_absence": {
			return {
				success: true,
				message: "La demande d'absence a été **approuvée**. Le collaborateur a été notifié.",
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
				message: "La demande d'absence a été **refusée**. Le collaborateur a été notifié.",
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
					? `La réunion **"${entities.name}"** a été annulée. Les participants ont été notifiés.`
					: "La réunion a été annulée. Les participants ont été notifiés.",
				followUpSuggestions: [
					{
						id: "fs-list-meetings",
						label: "Voir les réunions",
						icon: "calendar",
						query: "Montre-moi mes réunions",
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
						query: "Créer une formation",
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
 * Initialize a new active flow from à flow definition
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
 * Generate à summary message for a completed flow
 * @param action The action that was completed
 * @param data The collected form data
 * @returns Human-readable summary message
 */

export function getFlowCompletionMessage(action: string, data: Record<string, string>): string {
	switch (action) {
		case "create_task":
			return (
				`La tâche **"${data.title}"** a été créée avec succès !\n\n` +
				(data.priority ? `- Priorité : ${data.priority}\n` : "") +
				(data.status ? `- Statut : ${data.status}\n` : "") +
				(data.assignee ? `- Assignée à : ${data.assignee}\n` : "") +
				(data.dueDate ? `- Échéance : ${data.dueDate}\n` : "")
			);

		case "create_project":
			return (
				`Le projet **"${data.name}"** a été créé avec succès !\n\n` +
				(data.status ? `- Statut : ${data.status === "todo" ? "À faire" : "En cours"}\n` : "") +
				(data.startDate ? `- Début : ${data.startDate}\n` : "") +
				(data.endDate ? `- Fin prévue : ${data.endDate}\n` : "")
			);

		case "create_meeting":
			return (
				`La réunion **"${data.title}"** a été planifiée !\n\n` +
				`- Date : ${data.date}\n` +
				`- Heure : ${data.time}\n` +
				(data.duration ? `- Durée : ${data.duration}\n` : "") +
				(data.location ? `- Lieu : ${data.location}\n` : "")
			);

		case "request_absence":
			return (
				`Votre demande d'absence a été soumise !\n\n` +
				`- Type : ${data.type === "conge_paye" ? "Congé payé" : data.type === "rtt" ? "RTT" : data.type === "maladie" ? "Maladie" : "Autre"}\n` +
				`- Du : ${data.startDate}\n` +
				`- Au : ${data.endDate}\n` +
				(data.reason ? `- Motif : ${data.reason}\n` : "") +
				"\nVotre responsable sera notifié pour validation."
			);

		case "create_job_offer":
			return (
				`L'offre d'emploi **"${data.title}"** a été publiée !\n\n` +
				`- Contrat : ${data.contractType?.toUpperCase()}\n` +
				"\nL'offre est maintenant visible dans le module recrutement."
			);

		case "create_training":
			return (
				`La formation **"${data.title}"** a été créée !\n\n` +
				(data.category ? `- Catégorie : ${data.category}\n` : "") +
				"\nLa formation est disponible dans le module formations."
			);

		default:
			return "L'action a été effectuée avec succès !";
	}
}

/**
 * Get follow-up suggestions after completing à flow
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
					label: "Voir mes tâches",
					icon: "tasks",
					query: "Montre-moi mes tâches",
					category: "task",
				},
				{
					id: "fc-another-task",
					label: "Créer une autre tâche",
					icon: "plus",
					query: "Créer une nouvelle tâche",
					category: "task",
				},
				{
					id: "fc-go-tasks",
					label: "Aller aux tâches",
					icon: "tasks",
					query: "Emmène-moi vers les tâches",
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
					label: "Ajouter une tâche",
					icon: "plus",
					query: "Créer une tâche",
					category: "task",
				},
			];

		case "create_meeting":
			return [
				{
					id: "fc-list-meetings",
					label: "Voir les réunions",
					icon: "calendar",
					query: "Mes prochaines réunions",
					category: "meeting",
				},
				{
					id: "fc-another-meeting",
					label: "Planifier une autre",
					icon: "plus",
					query: "Planifier une réunion",
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
					query: "Emmène-moi vers les absences",
					category: "navigation",
				},
			];

		default:
			return getContextualSuggestions(context);
	}
}
