import type { Suggestion, AssistantContext, IntentCategory } from "./types";
import { WELCOME_SUGGESTIONS } from "./constants";
import { getContextualSuggestions, detectCurrentModule } from "./context-engine";


/** Suggestion groups organized by topic */
const SUGGESTION_GROUPS: Record<string, Suggestion[]> = {
	quickActions: [
		{
			id: "qa-create-task",
			label: "Nouvelle tache",
			icon: "plus",
			description: "Creer rapidement",
			query: "Creer une nouvelle tache",
			category: "task",
		},
		{
			id: "qa-create-meeting",
			label: "Planifier reunion",
			icon: "calendar",
			description: "Organiser un evenement",
			query: "Planifier une reunion",
			category: "meeting",
		},
		{
			id: "qa-request-absence",
			label: "Poser un conge",
			icon: "calendar",
			description: "Demander une absence",
			query: "Je veux poser un conge",
			category: "absence",
		},
	],
	views: [
		{
			id: "v-my-tasks",
			label: "Mes taches",
			icon: "tasks",
			description: "Taches assignees",
			query: "Montre-moi mes taches",
			category: "task",
		},
		{
			id: "v-my-projects",
			label: "Mes projets",
			icon: "folder",
			description: "Projets en cours",
			query: "Liste des projets",
			category: "project",
		},
		{
			id: "v-meetings",
			label: "Reunions a venir",
			icon: "calendar",
			description: "Prochaines reunions",
			query: "Mes prochaines reunions",
			category: "meeting",
		},
		{
			id: "v-notifications",
			label: "Notifications",
			icon: "bell",
			description: "Voir les notifications",
			query: "Montre-moi mes notifications",
			category: "notification",
		},
	],
	management: [
		{
			id: "m-team",
			label: "Equipe",
			icon: "users",
			description: "Voir les membres",
			query: "Montre-moi les membres de l'equipe",
			category: "user",
		},
		{
			id: "m-stats",
			label: "Statistiques",
			icon: "stats",
			description: "Indicateurs cles",
			query: "Montre-moi les statistiques",
			category: "navigation",
		},
		{
			id: "m-export",
			label: "Exporter",
			icon: "download",
			description: "Exporter des donnees",
			query: "Exporter les donnees en PDF",
			category: "export",
		},
	],
};

/**
 * Generate autocomplete suggestions
 * @param input Current input text
 * @param context Current assistant context
 * @returns Relevant suggestions array
 */

export function getAutocompleteSuggestions(input: string, context: AssistantContext): Suggestion[] {
	if (!input || input.trim().length < 2) {
		return getContextualSuggestions(context);
	}

	const normalized = input.toLowerCase().trim();
	const allSuggestions = [
		...WELCOME_SUGGESTIONS,
		...SUGGESTION_GROUPS.quickActions,
		...SUGGESTION_GROUPS.views,
		...SUGGESTION_GROUPS.management,
	];

	// Filter by matching label or query
	const matches = allSuggestions.filter((s) => {
		const labelMatch = s.label.toLowerCase().includes(normalized);
		const queryMatch = s.query.toLowerCase().includes(normalized);
		const descMatch = s.description?.toLowerCase().includes(normalized);
		return labelMatch || queryMatch || descMatch;
	});

	// Deduplicate by ID
	const seen = new Set<string>();
	const unique = matches.filter((s) => {
		if (seen.has(s.id)) return false;
		seen.add(s.id);
		return true;
	});

	return unique.slice(0, 6);
}

/**
 * Get follow-up turn suggestions
 * @param lastCategory Last intent category
 * @param context Current assistant context
 * @returns Follow-up suggestions
 */

export function getFollowUpSuggestions(lastCategory: IntentCategory, context: AssistantContext): Suggestion[] {
	const suggestions: Suggestion[] = [];

	switch (lastCategory) {
		case "task":
			suggestions.push(...SUGGESTION_GROUPS.quickActions.filter((s) => s.category === "task"), {
				id: "fu-view-tasks",
				label: "Voir les taches",
				icon: "tasks",
				query: "Montre-moi mes taches",
				category: "task",
			});
			break;

		case "project":
			suggestions.push(
				{
					id: "fu-project-tasks",
					label: "Taches du projet",
					icon: "tasks",
					query: "Taches du projet",
					category: "task",
				},
				{
					id: "fu-new-project",
					label: "Nouveau projet",
					icon: "plus",
					query: "Creer un projet",
					category: "project",
				},
			);
			break;

		case "meeting":
			suggestions.push(
				{
					id: "fu-next-meetings",
					label: "Prochaines reunions",
					icon: "calendar",
					query: "Mes prochaines reunions",
					category: "meeting",
				},
				{
					id: "fu-new-meeting",
					label: "Planifier reunion",
					icon: "plus",
					query: "Planifier une reunion",
					category: "meeting",
				},
			);
			break;

		case "absence":
			suggestions.push(
				{
					id: "fu-my-absences",
					label: "Mes absences",
					icon: "calendar",
					query: "Voir mes absences",
					category: "absence",
				},
				{
					id: "fu-new-absence",
					label: "Nouveau conge",
					icon: "plus",
					query: "Poser un conge",
					category: "absence",
				},
			);
			break;

		case "navigation":
			suggestions.push(...SUGGESTION_GROUPS.views.slice(0, 3));
			break;

		default:
			return getContextualSuggestions(context).slice(0, 4);
	}

	// Add some default suggestions if we have few
	if (suggestions.length < 3) {
		suggestions.push({
			id: "fu-help",
			label: "Aide",
			icon: "info",
			query: "Que peux-tu faire ?",
			category: "help",
		});
	}

	return suggestions.slice(0, 4);
}

/**
 * Get welcome state suggestions
 * @param context Current assistant context
 * @returns Welcome suggestions
 */

export function getWelcomeSuggestions(context: AssistantContext): Suggestion[] {
	const module = detectCurrentModule(context.currentPage);

	// If on a specific module page, mix context-aware with general
	if (module) {
		const contextual = getContextualSuggestions(context).slice(0, 4);
		const general = WELCOME_SUGGESTIONS.filter((ws) => !contextual.some((cs) => cs.category === ws.category)).slice(
			0,
			4,
		);

		return [...contextual, ...general].slice(0, 8);
	}

	return WELCOME_SUGGESTIONS;
}

/**
 * Get trending suggestions
 * @returns Most common suggestions
 */

export function getTrendingSuggestions(): Suggestion[] {
	return [
		{
			id: "trend-tasks",
			label: "Mes taches en cours",
			icon: "tasks",
			description: "Le plus utilise",
			query: "Montre-moi mes taches en cours",
			category: "task",
		},
		{
			id: "trend-create-task",
			label: "Creer une tache",
			icon: "plus",
			description: "Action rapide",
			query: "Creer une nouvelle tache",
			category: "task",
		},
		{
			id: "trend-meetings",
			label: "Prochaines reunions",
			icon: "calendar",
			description: "Cette semaine",
			query: "Mes prochaines reunions",
			category: "meeting",
		},
		{
			id: "trend-search",
			label: "Rechercher",
			icon: "search",
			description: "Trouver rapidement",
			query: "Rechercher ",
			category: "search",
		},
	];
}
