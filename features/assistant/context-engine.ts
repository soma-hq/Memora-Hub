import type { AssistantContext, Suggestion } from "./types";
import { WELCOME_SUGGESTIONS } from "./constants";


/** Context-aware page routes */
const PAGE_CONTEXT_MAP: Record<string, { module: string; label: string }> = {
	"/hub": { module: "dashboard", label: "Tableau de bord" },
	"/projects": { module: "project", label: "Projets" },
	"/tasks": { module: "task", label: "Taches" },
	"/meetings": { module: "meeting", label: "Reunions" },
	"/absences": { module: "absence", label: "Absences" },
	"/personnel": { module: "personnel", label: "Personnel" },
	"/recruitment": { module: "recruitment", label: "Recrutement" },
	"/training": { module: "training", label: "Formations" },
	"/momentum": { module: "momentum", label: "Momentum" },
	"/profile": { module: "profile", label: "Profil" },
	"/settings": { module: "settings", label: "Parametres" },
	"/users": { module: "users", label: "Utilisateurs" },
	"/groups": { module: "groups", label: "Groupes" },
	"/stats": { module: "stats", label: "Statistiques" },
	"/admin": { module: "admin", label: "Administration" },
};

/**
 * Detect current module
 * @param pathname Current pathname
 * @returns Module info or null
 */

export function detectCurrentModule(pathname: string): { module: string; label: string } | null {
	// Normalize by removing group-id segments from hub routes
	const normalized = pathname.replace(/\/hub\/[^/]+/, "/hub");

	// Check each page context pattern
	for (const [pattern, context] of Object.entries(PAGE_CONTEXT_MAP)) {
		if (normalized.startsWith(pattern) || normalized.includes(pattern)) {
			return context;
		}
	}

	return null;
}

/**
 * Generate page contextual suggestions
 * @param context Current assistant context
 * @returns Context-relevant suggestions
 */

export function getContextualSuggestions(context: AssistantContext): Suggestion[] {
	const module = detectCurrentModule(context.currentPage);
	const suggestions: Suggestion[] = [];

	if (!module) return WELCOME_SUGGESTIONS;

	// Generate module-specific suggestions
	switch (module.module) {
		case "dashboard":
			suggestions.push(
				{
					id: "ctx-recent-tasks",
					label: "Taches recentes",
					icon: "tasks",
					description: "Voir les dernieres taches",
					query: "Montre-moi mes taches en cours",
					category: "task",
				},
				{
					id: "ctx-upcoming-meetings",
					label: "Prochaines reunions",
					icon: "calendar",
					description: "Reunions a venir",
					query: "Quelles sont mes prochaines reunions ?",
					category: "meeting",
				},
				{
					id: "ctx-create-task",
					label: "Nouvelle tache",
					icon: "plus",
					description: "Creer une tache rapidement",
					query: "Creer une nouvelle tache",
					category: "task",
				},
				{
					id: "ctx-stats",
					label: "Statistiques",
					icon: "stats",
					description: "Voir les indicateurs",
					query: "Montre-moi les statistiques",
					category: "navigation",
				},
			);
			break;

		case "project":
			suggestions.push(
				{
					id: "ctx-new-project",
					label: "Nouveau projet",
					icon: "folder",
					description: "Creer un projet",
					query: "Creer un nouveau projet",
					category: "project",
				},
				{
					id: "ctx-list-projects",
					label: "Tous les projets",
					icon: "folder",
					description: "Lister les projets",
					query: "Liste-moi tous les projets",
					category: "project",
				},
				{
					id: "ctx-project-tasks",
					label: "Taches du projet",
					icon: "tasks",
					description: "Voir les taches",
					query: "Montre-moi les taches de ce projet",
					category: "task",
				},
				{
					id: "ctx-export-project",
					label: "Exporter",
					icon: "download",
					description: "Exporter les donnees",
					query: "Exporter les donnees du projet en PDF",
					category: "export",
				},
			);
			break;

		case "task":
			suggestions.push(
				{
					id: "ctx-new-task",
					label: "Nouvelle tache",
					icon: "plus",
					description: "Ajouter une tache",
					query: "Creer une nouvelle tache",
					category: "task",
				},
				{
					id: "ctx-my-tasks",
					label: "Mes taches",
					icon: "tasks",
					description: "Mes taches assignees",
					query: "Montre-moi mes taches",
					category: "task",
				},
				{
					id: "ctx-overdue-tasks",
					label: "En retard",
					icon: "warning",
					description: "Taches en retard",
					query: "Quelles taches sont en retard ?",
					category: "task",
				},
				{
					id: "ctx-complete-task",
					label: "Terminer une tache",
					icon: "check",
					description: "Marquer comme fait",
					query: "Terminer la tache ",
					category: "task",
				},
			);
			break;

		case "meeting":
			suggestions.push(
				{
					id: "ctx-new-meeting",
					label: "Nouvelle reunion",
					icon: "calendar",
					description: "Planifier une reunion",
					query: "Planifier une reunion",
					category: "meeting",
				},
				{
					id: "ctx-upcoming",
					label: "Prochaines",
					icon: "clock",
					description: "Reunions a venir",
					query: "Quelles sont mes prochaines reunions ?",
					category: "meeting",
				},
				{
					id: "ctx-standup",
					label: "Standup",
					icon: "calendar",
					description: "Planifier un standup",
					query: "Planifier un standup demain matin",
					category: "meeting",
				},
				{
					id: "ctx-cancel-meeting",
					label: "Annuler",
					icon: "close",
					description: "Annuler une reunion",
					query: "Annuler la reunion ",
					category: "meeting",
				},
			);
			break;

		case "absence":
			suggestions.push(
				{
					id: "ctx-request-absence",
					label: "Poser un conge",
					icon: "calendar",
					description: "Demander une absence",
					query: "Je veux poser un conge paye",
					category: "absence",
				},
				{
					id: "ctx-my-absences",
					label: "Mes absences",
					icon: "clock",
					description: "Voir mes demandes",
					query: "Montre-moi mes demandes d'absence",
					category: "absence",
				},
				{
					id: "ctx-pending-absences",
					label: "En attente",
					icon: "warning",
					description: "Absences a valider",
					query: "Quelles absences sont en attente d'approbation ?",
					category: "absence",
				},
				{
					id: "ctx-rtt",
					label: "Poser un RTT",
					icon: "calendar",
					description: "Demander un RTT",
					query: "Je veux poser un RTT",
					category: "absence",
				},
			);
			break;

		case "recruitment":
			suggestions.push(
				{
					id: "ctx-new-offer",
					label: "Nouvelle offre",
					icon: "briefcase",
					description: "Publier un poste",
					query: "Creer une offre d'emploi",
					category: "recruitment",
				},
				{
					id: "ctx-candidates",
					label: "Candidats",
					icon: "users",
					description: "Voir les candidats",
					query: "Montre-moi les candidats",
					category: "recruitment",
				},
				{
					id: "ctx-interviews",
					label: "Entretiens",
					icon: "calendar",
					description: "Planifier un entretien",
					query: "Planifier un entretien",
					category: "meeting",
				},
				{
					id: "ctx-export-recruitment",
					label: "Exporter",
					icon: "download",
					description: "Exporter les donnees",
					query: "Exporter les donnees de recrutement",
					category: "export",
				},
			);
			break;

		case "training":
			suggestions.push(
				{
					id: "ctx-new-training",
					label: "Nouvelle formation",
					icon: "training",
					description: "Creer une session",
					query: "Creer une nouvelle formation",
					category: "training",
				},
				{
					id: "ctx-list-trainings",
					label: "Toutes les formations",
					icon: "training",
					description: "Voir les formations",
					query: "Liste des formations",
					category: "training",
				},
				{
					id: "ctx-upcoming-training",
					label: "A venir",
					icon: "clock",
					description: "Prochaines sessions",
					query: "Quelles formations arrivent prochainement ?",
					category: "training",
				},
			);
			break;

		case "personnel":
			suggestions.push(
				{
					id: "ctx-list-members",
					label: "Equipe",
					icon: "users",
					description: "Voir l'equipe",
					query: "Montre-moi les membres de l'equipe",
					category: "user",
				},
				{
					id: "ctx-find-member",
					label: "Trouver quelqu'un",
					icon: "search",
					description: "Chercher un collaborateur",
					query: "Trouver ",
					category: "search",
				},
			);
			break;

		case "settings":
			suggestions.push(
				{
					id: "ctx-theme",
					label: "Changer le theme",
					icon: "moon",
					description: "Clair / Sombre",
					query: "Passer en mode sombre",
					category: "settings",
				},
				{
					id: "ctx-export-data",
					label: "Exporter mes donnees",
					icon: "download",
					description: "Export complet",
					query: "Exporter toutes mes donnees",
					category: "export",
				},
			);
			break;

		default:
			return WELCOME_SUGGESTIONS.slice(0, 4);
	}

	return suggestions;
}

/**
 * Build context summary string
 * @param context Current assistant context
 * @returns Context summary string
 */

export function buildContextSummary(context: AssistantContext): string {
	const parts: string[] = [];

	const module = detectCurrentModule(context.currentPage);
	if (module) {
		parts.push(`Page actuelle : ${module.label}`);
	}

	if (context.currentGroupName) {
		parts.push(`Groupe : ${context.currentGroupName}`);
	}

	if (context.currentUserName) {
		parts.push(`Utilisateur : ${context.currentUserName}`);
	}

	if (context.currentUserRole) {
		parts.push(`Role : ${context.currentUserRole}`);
	}

	if (context.adminMode) {
		parts.push("Mode admin actif");
	}

	if (context.activeProjectName) {
		parts.push(`Projet actif : ${context.activeProjectName}`);
	}

	return parts.join(" | ");
}

/**
 * Check role-based action permission
 * @param action Action to check
 * @param role User role
 * @returns True if permitted
 */

export function hasPermissionForAction(action: string, role?: string): boolean {
	if (!role) return false;

	// Owner and Admin can do everything
	if (role === "Owner" || role === "Admin") return true;

	// Manager can do most things except user management and admin settings
	const managerRestricted = ["list_users", "toggle_admin_mode"];
	if (role === "Manager") return !managerRestricted.includes(action);

	// Collaborator can create and view but not delete or admin
	const collaboratorAllowed = [
		"navigate_to",
		"create_task",
		"list_tasks",
		"complete_task",
		"list_projects",
		"list_meetings",
		"request_absence",
		"list_absences",
		"search_global",
		"list_notifications",
		"mark_notifications_read",
		"change_theme",
		"show_help",
		"greet",
		"show_stats",
	];
	if (role === "Collaborator") return collaboratorAllowed.includes(action);

	// Guest has very limited access
	const guestAllowed = ["navigate_to", "search_global", "list_notifications", "change_theme", "show_help", "greet"];
	if (role === "Guest") return guestAllowed.includes(action);

	return false;
}
