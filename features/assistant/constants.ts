// Constants & types
import type { Suggestion, FlowDefinition, FlowStep } from "./types";


/** Default greeting response from the assistant */
export const ASSISTANT_NAME = "Memora AI";

/** Maximum number of messages to keep in conversation history */
export const MAX_CONVERSATION_HISTORY = 100;

/** Delay in milliseconds to simulate thinking */
export const THINKING_DELAY_MS = 600;

/** Delay between streamed characters */
export const STREAM_CHAR_DELAY_MS = 15;

/** Maximum input length for user messages */
export const MAX_INPUT_LENGTH = 2000;

/** Greeting messages the assistant can use - casual "tu" tone */
export const GREETING_RESPONSES: string[] = [
	"Salut ! Comment ca va ? Dis-moi ce dont t'as besoin aujourd'hui.",
	"Hey ! Qu'est-ce que je peux faire pour toi ?",
	"Coucou ! Besoin d'un coup de main sur un projet, une tache, ou autre ?",
	"Salut ! Dis-moi ce que tu veux faire, je m'en occupe.",
	"Hey ! Pret a avancer ? Dis-moi tout.",
	"Yo ! Qu'est-ce qu'on fait aujourd'hui ?",
];

/** Default welcome message shown when opening the assistant */
export const WELCOME_MESSAGE =
	"Salut ! Je suis **Memora AI**, ton assistant. Je peux t'aider à :\n\n" +
	"- **Créer** des tâches, projets, réunions\n" +
	"- **Naviguer** vers n'importe quelle page\n" +
	"- **Rechercher** dans toute l'app\n" +
	"- **Gérer** tes notifs et absences\n" +
	"- **Exporter** des données\n\n" +
	"Dis-moi juste ce dont tu as besoin !";

/** Quick action suggestions shown on the welcome screen */
export const WELCOME_SUGGESTIONS: Suggestion[] = [
	{
		id: "sug-create-task",
		label: "Creer une tache",
		icon: "tasks",
		description: "Nouvelle tache rapide",
		query: "Je veux creer une nouvelle tache",
		category: "task",
	},
	{
		id: "sug-create-project",
		label: "Nouveau projet",
		icon: "folder",
		description: "Demarrer un projet",
		query: "Creer un nouveau projet",
		category: "project",
	},
	{
		id: "sug-create-meeting",
		label: "Planifier une reunion",
		icon: "calendar",
		description: "Organiser un evenement",
		query: "Planifier une reunion",
		category: "meeting",
	},
	{
		id: "sug-list-tasks",
		label: "Mes taches",
		icon: "tasks",
		description: "Voir mes taches en cours",
		query: "Montre-moi mes taches en cours",
		category: "task",
	},
	{
		id: "sug-search",
		label: "Rechercher",
		icon: "search",
		description: "Trouver quelque chose",
		query: "Rechercher ",
		category: "search",
	},
	{
		id: "sug-navigate",
		label: "Naviguer",
		icon: "home",
		description: "Aller quelque part",
		query: "Emmene-moi vers ",
		category: "navigation",
	},
	{
		id: "sug-absence",
		label: "Demander un conge",
		icon: "calendar",
		description: "Poser une absence",
		query: "Je veux poser un conge",
		category: "absence",
	},
	{
		id: "sug-help",
		label: "Aide",
		icon: "info",
		description: "Comment ca marche ?",
		query: "Aide-moi a comprendre ce que tu peux faire",
		category: "help",
	},
];

/** Keywords mapped to intent categories for detection */
export const INTENT_KEYWORDS: Record<string, { category: string; action: string; weight: number }[]> = {
	// Task keywords
	tache: [
		{ category: "task", action: "create_task", weight: 0.6 },
		{ category: "task", action: "list_tasks", weight: 0.3 },
	],
	taches: [{ category: "task", action: "list_tasks", weight: 0.8 }],
	"creer une tache": [{ category: "task", action: "create_task", weight: 0.95 }],
	"nouvelle tache": [{ category: "task", action: "create_task", weight: 0.95 }],
	"ajouter une tache": [{ category: "task", action: "create_task", weight: 0.95 }],
	"modifier la tache": [{ category: "task", action: "update_task", weight: 0.9 }],
	"supprimer la tache": [{ category: "task", action: "delete_task", weight: 0.9 }],
	"terminer la tache": [{ category: "task", action: "complete_task", weight: 0.9 }],
	"finir la tache": [{ category: "task", action: "complete_task", weight: 0.9 }],
	"assigner la tache": [{ category: "task", action: "assign_task", weight: 0.9 }],
	"mes taches": [{ category: "task", action: "list_tasks", weight: 0.95 }],
	"liste des taches": [{ category: "task", action: "list_tasks", weight: 0.95 }],
	"taches en cours": [{ category: "task", action: "list_tasks", weight: 0.9 }],
	"taches a faire": [{ category: "task", action: "list_tasks", weight: 0.9 }],
	todo: [{ category: "task", action: "list_tasks", weight: 0.7 }],

	// Project keywords
	projet: [
		{ category: "project", action: "create_project", weight: 0.5 },
		{ category: "project", action: "list_projects", weight: 0.4 },
	],
	projets: [{ category: "project", action: "list_projects", weight: 0.8 }],
	"creer un projet": [{ category: "project", action: "create_project", weight: 0.95 }],
	"nouveau projet": [{ category: "project", action: "create_project", weight: 0.95 }],
	"ajouter un projet": [{ category: "project", action: "create_project", weight: 0.95 }],
	"modifier le projet": [{ category: "project", action: "update_project", weight: 0.9 }],
	"supprimer le projet": [{ category: "project", action: "delete_project", weight: 0.9 }],
	"mes projets": [{ category: "project", action: "list_projects", weight: 0.95 }],
	"liste des projets": [{ category: "project", action: "list_projects", weight: 0.95 }],

	// Meeting keywords
	reunion: [
		{ category: "meeting", action: "create_meeting", weight: 0.5 },
		{ category: "meeting", action: "list_meetings", weight: 0.4 },
	],
	reunions: [{ category: "meeting", action: "list_meetings", weight: 0.8 }],
	"creer une reunion": [{ category: "meeting", action: "create_meeting", weight: 0.95 }],
	"planifier une reunion": [{ category: "meeting", action: "create_meeting", weight: 0.95 }],
	"organiser une reunion": [{ category: "meeting", action: "create_meeting", weight: 0.95 }],
	"nouvelle reunion": [{ category: "meeting", action: "create_meeting", weight: 0.95 }],
	"annuler la reunion": [{ category: "meeting", action: "cancel_meeting", weight: 0.9 }],
	"mes reunions": [{ category: "meeting", action: "list_meetings", weight: 0.95 }],
	"prochaines reunions": [{ category: "meeting", action: "list_meetings", weight: 0.9 }],
	standup: [{ category: "meeting", action: "create_meeting", weight: 0.8 }],
	retrospective: [{ category: "meeting", action: "create_meeting", weight: 0.8 }],
	entretien: [{ category: "meeting", action: "create_meeting", weight: 0.8 }],

	// Absence keywords
	absence: [
		{ category: "absence", action: "request_absence", weight: 0.6 },
		{ category: "absence", action: "list_absences", weight: 0.3 },
	],
	absences: [{ category: "absence", action: "list_absences", weight: 0.8 }],
	conge: [{ category: "absence", action: "request_absence", weight: 0.85 }],
	conges: [{ category: "absence", action: "list_absences", weight: 0.8 }],
	"poser un conge": [{ category: "absence", action: "request_absence", weight: 0.95 }],
	"demander un conge": [{ category: "absence", action: "request_absence", weight: 0.95 }],
	vacances: [{ category: "absence", action: "request_absence", weight: 0.8 }],
	rtt: [{ category: "absence", action: "request_absence", weight: 0.85 }],
	maladie: [{ category: "absence", action: "request_absence", weight: 0.85 }],
	"approuver absence": [{ category: "absence", action: "approve_absence", weight: 0.95 }],
	"refuser absence": [{ category: "absence", action: "reject_absence", weight: 0.95 }],

	// Navigation keywords
	aller: [{ category: "navigation", action: "navigate_to", weight: 0.7 }],
	"aller a": [{ category: "navigation", action: "navigate_to", weight: 0.85 }],
	"aller vers": [{ category: "navigation", action: "navigate_to", weight: 0.85 }],
	"emmene-moi": [{ category: "navigation", action: "navigate_to", weight: 0.9 }],
	"emmene moi": [{ category: "navigation", action: "navigate_to", weight: 0.9 }],
	naviguer: [{ category: "navigation", action: "navigate_to", weight: 0.85 }],
	"ouvrir la page": [{ category: "navigation", action: "navigate_to", weight: 0.9 }],
	"va sur": [{ category: "navigation", action: "navigate_to", weight: 0.85 }],
	"montre-moi": [{ category: "navigation", action: "navigate_to", weight: 0.7 }],
	dashboard: [{ category: "navigation", action: "navigate_to", weight: 0.8 }],
	"tableau de bord": [{ category: "navigation", action: "navigate_to", weight: 0.85 }],
	accueil: [{ category: "navigation", action: "navigate_to", weight: 0.85 }],
	profil: [{ category: "navigation", action: "navigate_to", weight: 0.85 }],
	parametres: [{ category: "navigation", action: "navigate_to", weight: 0.85 }],
	reglages: [{ category: "navigation", action: "navigate_to", weight: 0.85 }],
	statistiques: [{ category: "navigation", action: "navigate_to", weight: 0.8 }],
	admin: [{ category: "navigation", action: "navigate_to", weight: 0.8 }],
	administration: [{ category: "navigation", action: "navigate_to", weight: 0.85 }],

	// Search keywords
	rechercher: [{ category: "search", action: "search_global", weight: 0.9 }],
	chercher: [{ category: "search", action: "search_global", weight: 0.9 }],
	trouver: [{ category: "search", action: "search_global", weight: 0.85 }],
	"ou est": [{ category: "search", action: "search_global", weight: 0.8 }],
	"ou se trouve": [{ category: "search", action: "search_global", weight: 0.8 }],

	// Notification keywords
	notifications: [{ category: "notification", action: "list_notifications", weight: 0.9 }],
	notification: [{ category: "notification", action: "list_notifications", weight: 0.8 }],
	"marquer comme lu": [{ category: "notification", action: "mark_notifications_read", weight: 0.95 }],
	"lire notifications": [{ category: "notification", action: "mark_notifications_read", weight: 0.85 }],

	// User keywords
	utilisateurs: [{ category: "user", action: "list_users", weight: 0.85 }],
	utilisateur: [{ category: "user", action: "find_user", weight: 0.7 }],
	membres: [{ category: "user", action: "list_users", weight: 0.8 }],
	equipe: [{ category: "user", action: "list_users", weight: 0.75 }],
	collegue: [{ category: "user", action: "find_user", weight: 0.7 }],
	collaborateur: [{ category: "user", action: "find_user", weight: 0.7 }],

	// Settings keywords
	theme: [{ category: "settings", action: "change_theme", weight: 0.85 }],
	"mode sombre": [{ category: "settings", action: "change_theme", weight: 0.95 }],
	"mode clair": [{ category: "settings", action: "change_theme", weight: 0.95 }],
	"dark mode": [{ category: "settings", action: "change_theme", weight: 0.95 }],
	"light mode": [{ category: "settings", action: "change_theme", weight: 0.95 }],
	"mode admin": [{ category: "settings", action: "toggle_admin_mode", weight: 0.9 }],

	// Export keywords
	exporter: [{ category: "export", action: "export_data", weight: 0.9 }],
	export: [{ category: "export", action: "export_data", weight: 0.85 }],
	telecharger: [{ category: "export", action: "export_data", weight: 0.7 }],
	pdf: [{ category: "export", action: "export_data", weight: 0.75 }],
	excel: [{ category: "export", action: "export_data", weight: 0.75 }],
	csv: [{ category: "export", action: "export_data", weight: 0.75 }],

	// Recruitment keywords
	recrutement: [{ category: "recruitment", action: "list_candidates", weight: 0.7 }],
	candidat: [{ category: "recruitment", action: "list_candidates", weight: 0.7 }],
	candidats: [{ category: "recruitment", action: "list_candidates", weight: 0.85 }],
	"offre emploi": [{ category: "recruitment", action: "create_job_offer", weight: 0.85 }],
	"nouvelle offre": [{ category: "recruitment", action: "create_job_offer", weight: 0.8 }],

	// Training keywords
	formation: [
		{ category: "training", action: "create_training", weight: 0.5 },
		{ category: "training", action: "list_trainings", weight: 0.4 },
	],
	formations: [{ category: "training", action: "list_trainings", weight: 0.85 }],
	"nouvelle formation": [{ category: "training", action: "create_training", weight: 0.9 }],
	"creer une formation": [{ category: "training", action: "create_training", weight: 0.95 }],

	// Group keywords
	groupe: [{ category: "group", action: "navigate_to", weight: 0.6 }],
	groupes: [{ category: "group", action: "navigate_to", weight: 0.7 }],
	entite: [{ category: "group", action: "navigate_to", weight: 0.6 }],

	// Help keywords
	aide: [{ category: "help", action: "show_help", weight: 0.9 }],
	help: [{ category: "help", action: "show_help", weight: 0.9 }],
	comment: [{ category: "help", action: "show_help", weight: 0.6 }],
	"que peux-tu faire": [{ category: "help", action: "show_help", weight: 0.95 }],
	"qu'est-ce que": [{ category: "help", action: "show_help", weight: 0.6 }],
	fonctionnalites: [{ category: "help", action: "show_help", weight: 0.8 }],

	// Greeting keywords
	bonjour: [{ category: "greeting", action: "greet", weight: 0.95 }],
	salut: [{ category: "greeting", action: "greet", weight: 0.95 }],
	hello: [{ category: "greeting", action: "greet", weight: 0.95 }],
	hey: [{ category: "greeting", action: "greet", weight: 0.9 }],
	coucou: [{ category: "greeting", action: "greet", weight: 0.95 }],
	bonsoir: [{ category: "greeting", action: "greet", weight: 0.95 }],
	"ca va": [{ category: "greeting", action: "greet", weight: 0.8 }],
	merci: [{ category: "greeting", action: "greet", weight: 0.7 }],

	// Stats keywords
	stats: [{ category: "navigation", action: "show_stats", weight: 0.85 }],
	indicateurs: [{ category: "navigation", action: "show_stats", weight: 0.8 }],
	kpi: [{ category: "navigation", action: "show_stats", weight: 0.85 }],
};

/** Navigation route targets mapped from keywords */
export const NAVIGATION_TARGETS: Record<string, { path: string; label: string; needsGroup: boolean }> = {
	accueil: { path: "/hub/{groupId}", label: "Tableau de bord", needsGroup: true },
	dashboard: { path: "/hub/{groupId}", label: "Tableau de bord", needsGroup: true },
	"tableau de bord": { path: "/hub/{groupId}", label: "Tableau de bord", needsGroup: true },
	projets: { path: "/hub/{groupId}/projects", label: "Projets", needsGroup: true },
	projet: { path: "/hub/{groupId}/projects", label: "Projets", needsGroup: true },
	taches: { path: "/hub/{groupId}/tasks", label: "Taches", needsGroup: true },
	tache: { path: "/hub/{groupId}/tasks", label: "Taches", needsGroup: true },
	reunions: { path: "/hub/{groupId}/meetings", label: "Reunions", needsGroup: true },
	reunion: { path: "/hub/{groupId}/meetings", label: "Reunions", needsGroup: true },
	calendrier: { path: "/hub/{groupId}/meetings", label: "Calendrier", needsGroup: true },
	absences: { path: "/hub/{groupId}/absences", label: "Absences", needsGroup: true },
	conges: { path: "/hub/{groupId}/absences", label: "Conges", needsGroup: true },
	personnel: { path: "/hub/{groupId}/personnel", label: "Personnel", needsGroup: true },
	recrutement: { path: "/hub/{groupId}/recruitment", label: "Recrutement", needsGroup: true },
	formations: { path: "/hub/{groupId}/training", label: "Formations", needsGroup: true },
	formation: { path: "/hub/{groupId}/training", label: "Formations", needsGroup: true },
	momentum: { path: "/hub/{groupId}/momentum", label: "Momentum", needsGroup: true },
	profil: { path: "/profile", label: "Mon profil", needsGroup: false },
	"mon profil": { path: "/profile", label: "Mon profil", needsGroup: false },
	parametres: { path: "/settings/account", label: "Parametres", needsGroup: false },
	reglages: { path: "/settings/account", label: "Parametres", needsGroup: false },
	"parametres compte": { path: "/settings/account", label: "Parametres du compte", needsGroup: false },
	securite: { path: "/settings/security", label: "Securite", needsGroup: false },
	preferences: { path: "/settings/preferences", label: "Preferences", needsGroup: false },
	"parametres notifications": {
		path: "/settings/notifications",
		label: "Parametres de notifications",
		needsGroup: false,
	},
	donnees: { path: "/settings/data", label: "Donnees", needsGroup: false },
	utilisateurs: { path: "/users", label: "Utilisateurs", needsGroup: false },
	groupes: { path: "/groups", label: "Groupes", needsGroup: false },
	statistiques: { path: "/stats", label: "Statistiques", needsGroup: false },
	stats: { path: "/stats", label: "Statistiques", needsGroup: false },
	admin: { path: "/admin/access", label: "Administration", needsGroup: false },
	administration: { path: "/admin/access", label: "Administration", needsGroup: false },
};

/** Validation helper for required string fields */
export const VALIDATORS = {
	/**
	 * Validate that a string is non-empty
	 * @param value Value to validate
	 * @returns Error message or null
	 */
	required: (value: string): string | null => {
		if (!value || value.trim().length === 0) return "Ce champ est requis";
		return null;
	},

	/**
	 * Validate minimum length
	 * @param min Minimum acceptable length
	 * @returns Validator function
	 */
	minLength:
		(min: number) =>
		(value: string): string | null => {
			if (value.trim().length < min) return `Minimum ${min} caracteres`;
			return null;
		},

	/**
	 * Validate that a value looks like a date
	 * @param value Value to validate
	 * @returns Error message or null
	 */
	date: (value: string): string | null => {
		if (!value) return "Date requise";
		const parsed = Date.parse(value);
		if (isNaN(parsed)) return "Format de date invalide";
		return null;
	},
};

/** Steps for the task creation flow - casual "tu" tone */
export const CREATE_TASK_STEPS: FlowStep[] = [
	{
		id: "task-title",
		field: "title",
		label: "C'est quoi le titre de ta tache ?",
		type: "text",
		placeholder: "Ex: Implementer le module d'export",
		required: true,
		validation: VALIDATORS.minLength(3),
	},
	{
		id: "task-description",
		field: "description",
		label: "Tu veux ajouter une description ? (optionnel)",
		type: "textarea",
		placeholder: "Decris la tache en detail...",
		required: false,
	},
	{
		id: "task-priority",
		field: "priority",
		label: "Quelle priorite tu mets ?",
		type: "select",
		options: [
			{ value: "Haute", label: "Haute" },
			{ value: "Moyenne", label: "Moyenne" },
			{ value: "Basse", label: "Basse" },
		],
		required: true,
	},
	{
		id: "task-status",
		field: "status",
		label: "On la met en quel statut ?",
		type: "select",
		options: [
			{ value: "A faire", label: "A faire" },
			{ value: "En cours", label: "En cours" },
		],
		required: true,
	},
	{
		id: "task-assignee",
		field: "assignee",
		label: "Tu l'assignes a qui ? (optionnel)",
		type: "text",
		placeholder: "Nom du collaborateur",
		required: false,
	},
	{
		id: "task-duedate",
		field: "dueDate",
		label: "Pour quand ? (format: AAAA-MM-JJ, optionnel)",
		type: "date",
		placeholder: "2026-03-15",
		required: false,
	},
	{
		id: "task-confirm",
		field: "_confirm",
		label: "On cree ca ?",
		type: "confirm",
		required: true,
	},
];

/** Steps for the project creation flow */
export const CREATE_PROJECT_STEPS: FlowStep[] = [
	{
		id: "project-name",
		field: "name",
		label: "Comment tu veux appeler ton projet ?",
		type: "text",
		placeholder: "Ex: Refonte de l'interface utilisateur",
		required: true,
		validation: VALIDATORS.minLength(3),
	},
	{
		id: "project-description",
		field: "description",
		label: "Une petite description ? (optionnel)",
		type: "textarea",
		placeholder: "Objectifs, perimetre, equipe...",
		required: false,
	},
	{
		id: "project-status",
		field: "status",
		label: "On le demarre en quel statut ?",
		type: "select",
		options: [
			{ value: "todo", label: "A faire" },
			{ value: "in_progress", label: "En cours" },
		],
		required: true,
	},
	{
		id: "project-startdate",
		field: "startDate",
		label: "Date de debut ? (format: AAAA-MM-JJ, optionnel)",
		type: "date",
		placeholder: "2026-03-01",
		required: false,
	},
	{
		id: "project-enddate",
		field: "endDate",
		label: "Date de fin prevue ? (format: AAAA-MM-JJ, optionnel)",
		type: "date",
		placeholder: "2026-06-30",
		required: false,
	},
	{
		id: "project-confirm",
		field: "_confirm",
		label: "On lance ce projet ?",
		type: "confirm",
		required: true,
	},
];

/** Steps for the meeting creation flow */
export const CREATE_MEETING_STEPS: FlowStep[] = [
	{
		id: "meeting-title",
		field: "title",
		label: "C'est quoi le titre de la reunion ?",
		type: "text",
		placeholder: "Ex: Point d'equipe hebdomadaire",
		required: true,
		validation: VALIDATORS.minLength(3),
	},
	{
		id: "meeting-date",
		field: "date",
		label: "A quelle date ? (format: AAAA-MM-JJ)",
		type: "date",
		placeholder: "2026-03-15",
		required: true,
		validation: VALIDATORS.date,
	},
	{
		id: "meeting-time",
		field: "time",
		label: "A quelle heure ? (format: HH:MM)",
		type: "text",
		placeholder: "14:00",
		required: true,
	},
	{
		id: "meeting-duration",
		field: "duration",
		label: "Duree prevue ?",
		type: "select",
		options: [
			{ value: "15min", label: "15 minutes" },
			{ value: "30min", label: "30 minutes" },
			{ value: "45min", label: "45 minutes" },
			{ value: "1h", label: "1 heure" },
			{ value: "1h30", label: "1h30" },
			{ value: "2h", label: "2 heures" },
		],
		required: true,
	},
	{
		id: "meeting-location",
		field: "location",
		label: "Lieu ou lien de la reunion ? (optionnel)",
		type: "text",
		placeholder: "Salle A3 / https://meet.google.com/...",
		required: false,
	},
	{
		id: "meeting-description",
		field: "description",
		label: "Notes ou ordre du jour ? (optionnel)",
		type: "textarea",
		placeholder: "Points a discuter...",
		required: false,
	},
	{
		id: "meeting-confirm",
		field: "_confirm",
		label: "Confirmer la creation de la reunion ?",
		type: "confirm",
		required: true,
	},
];

/** Steps for the absence request flow */
export const REQUEST_ABSENCE_STEPS: FlowStep[] = [
	{
		id: "absence-type",
		field: "type",
		label: "Quel type d'absence ?",
		type: "select",
		options: [
			{ value: "conge_paye", label: "Conge paye" },
			{ value: "rtt", label: "RTT" },
			{ value: "maladie", label: "Maladie" },
			{ value: "autre", label: "Autre" },
		],
		required: true,
	},
	{
		id: "absence-start",
		field: "startDate",
		label: "Date de debut ? (format: AAAA-MM-JJ)",
		type: "date",
		placeholder: "2026-03-20",
		required: true,
		validation: VALIDATORS.date,
	},
	{
		id: "absence-end",
		field: "endDate",
		label: "Date de fin ? (format: AAAA-MM-JJ)",
		type: "date",
		placeholder: "2026-03-24",
		required: true,
		validation: VALIDATORS.date,
	},
	{
		id: "absence-reason",
		field: "reason",
		label: "Motif (optionnel)",
		type: "textarea",
		placeholder: "Raison de votre absence...",
		required: false,
	},
	{
		id: "absence-confirm",
		field: "_confirm",
		label: "Confirmer la demande d'absence ?",
		type: "confirm",
		required: true,
	},
];

/** Steps for the job offer creation flow */
export const CREATE_JOB_OFFER_STEPS: FlowStep[] = [
	{
		id: "offer-title",
		field: "title",
		label: "Intitule du poste ?",
		type: "text",
		placeholder: "Ex: Developpeur Full-Stack Senior",
		required: true,
		validation: VALIDATORS.minLength(3),
	},
	{
		id: "offer-contract",
		field: "contractType",
		label: "Type de contrat ?",
		type: "select",
		options: [
			{ value: "cdi", label: "CDI" },
			{ value: "cdd", label: "CDD" },
			{ value: "stage", label: "Stage" },
			{ value: "alternance", label: "Alternance" },
			{ value: "freelance", label: "Freelance" },
		],
		required: true,
	},
	{
		id: "offer-description",
		field: "description",
		label: "Description du poste",
		type: "textarea",
		placeholder: "Missions, competences, avantages...",
		required: true,
		validation: VALIDATORS.minLength(10),
	},
	{
		id: "offer-confirm",
		field: "_confirm",
		label: "Publier cette offre d'emploi ?",
		type: "confirm",
		required: true,
	},
];

/** Steps for training creation flow */
export const CREATE_TRAINING_STEPS: FlowStep[] = [
	{
		id: "training-title",
		field: "title",
		label: "Titre de la formation ?",
		type: "text",
		placeholder: "Ex: Introduction a TypeScript",
		required: true,
		validation: VALIDATORS.minLength(3),
	},
	{
		id: "training-category",
		field: "category",
		label: "Categorie ?",
		type: "select",
		options: [
			{ value: "technique", label: "Technique" },
			{ value: "management", label: "Management" },
			{ value: "securite", label: "Securite" },
			{ value: "soft_skills", label: "Soft Skills" },
			{ value: "onboarding", label: "Onboarding" },
		],
		required: true,
	},
	{
		id: "training-description",
		field: "description",
		label: "Description (optionnel)",
		type: "textarea",
		placeholder: "Contenu, objectifs, prerequis...",
		required: false,
	},
	{
		id: "training-confirm",
		field: "_confirm",
		label: "Creer cette formation ?",
		type: "confirm",
		required: true,
	},
];

/** All flow definitions used by the assistant */
export const FLOW_DEFINITIONS: FlowDefinition[] = [
	{
		id: "flow-create-task",
		action: "create_task",
		title: "Creer une tache",
		description: "Je vais vous guider pour creer une nouvelle tache.",
		steps: CREATE_TASK_STEPS,
	},
	{
		id: "flow-create-project",
		action: "create_project",
		title: "Creer un projet",
		description: "Creons ensemble un nouveau projet.",
		steps: CREATE_PROJECT_STEPS,
	},
	{
		id: "flow-create-meeting",
		action: "create_meeting",
		title: "Planifier une reunion",
		description: "Organisons une nouvelle reunion.",
		steps: CREATE_MEETING_STEPS,
	},
	{
		id: "flow-request-absence",
		action: "request_absence",
		title: "Demander un conge",
		description: "Je vais vous aider a soumettre votre demande d'absence.",
		steps: REQUEST_ABSENCE_STEPS,
	},
	{
		id: "flow-create-job-offer",
		action: "create_job_offer",
		title: "Creer une offre d'emploi",
		description: "Publions une nouvelle offre de recrutement.",
		steps: CREATE_JOB_OFFER_STEPS,
	},
	{
		id: "flow-create-training",
		action: "create_training",
		title: "Creer une formation",
		description: "Mettons en place une nouvelle formation.",
		steps: CREATE_TRAINING_STEPS,
	},
];

/** Help response content */
export const HELP_RESPONSE =
	"Voici tout ce que je peux faire pour vous :\n\n" +
	"**Taches**\n" +
	"- Creer, modifier, supprimer des taches\n" +
	"- Lister vos taches (en cours, a faire, terminees)\n" +
	"- Assigner et terminer des taches\n\n" +
	"**Projets**\n" +
	"- Creer et gerer des projets\n" +
	"- Voir la liste des projets\n\n" +
	"**Reunions**\n" +
	"- Planifier des reunions, standups, retrospectives\n" +
	"- Voir les prochaines reunions\n\n" +
	"**Absences**\n" +
	"- Poser un conge (paye, RTT, maladie)\n" +
	"- Voir vos demandes d'absence\n\n" +
	"**Navigation**\n" +
	"- Naviguer vers n'importe quelle page\n" +
	'- Ex: *"Emmene-moi vers les projets"*\n\n' +
	"**Recherche**\n" +
	"- Rechercher dans toute l'application\n" +
	"- Trouver des utilisateurs, projets, taches\n\n" +
	"**Recrutement & Formation**\n" +
	"- Creer des offres d'emploi\n" +
	"- Gerer les formations\n\n" +
	"**Parametres**\n" +
	"- Changer le theme (clair/sombre)\n" +
	"- Activer le mode admin\n" +
	"- Exporter des donnees\n\n" +
	"Essayez simplement de me dire ce que vous voulez faire en langage naturel !";
