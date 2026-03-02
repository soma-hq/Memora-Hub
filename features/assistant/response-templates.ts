// Constants & types
import type { IntentAction, AssistantContext, Suggestion } from "./types";
import { getContextualSuggestions } from "./context-engine";

/** Personality modes the assistant can use */
export type PersonalityMode = "professional" | "friendly" | "concise";

/** Response template with placeholder support */
interface ResponseTemplate {
	templates: string[];
	emoji?: string;
}

/** Response template map by action and variant */
const RESPONSE_TEMPLATES: Record<string, Record<string, ResponseTemplate>> = {
	// Task creation responses
	create_task: {
		success: {
			templates: [
				'Super, la tâche **"{title}"** a été créée avec succès !',
				'C\'est fait ! Ta tâche **"{title}"** est prête.',
				'Tâche **"{title}"** créée. Tu peux la retrouver dans ta liste de tâches personnelles.',
				'Parfait, j\'ai créé ta tâche **"{title}"** !',
			],
		},
		error: {
			templates: [
				"Impossible de créer la tâche. Vérifie les informations et réessaie.",
				"Oups, la création de la tâche a échoué. On réessaie ?",
				"Malheureusement, une erreur est survenue lors de la création de ta tâche. J'ai prévenu le développeur de cet incident. Désolé !",
			],
		},
	},

	// Project creation responses
	create_project: {
		success: {
			templates: [
				'Le projet **"{name}"** a été créé avec succès !',
				'Projet **"{name}"** lancé !',
				'C\'est parti ! Le projet **"{name}"** est prêt.',
			],
		},
		error: {
			templates: [
				"La création du projet a échoué. Vérifiez vos permissions.",
				"Impossible de créer le projet pour le moment.",
			],
		},
	},

	// Meeting creation responses
	create_meeting: {
		success: {
			templates: [
				'La réunion **"{title}"** est planifiée pour le {date} à {time}.',
				'Réunion **"{title}"** confirmée ! Les participants seront notifiés.',
				'C\'est noté ! Réunion **"{title}"** le {date} à {time}.',
			],
		},
		error: {
			templates: [
				"La planification de la réunion a échoué.",
				"Impossible de créer la réunion. Un conflit d'horaire peut-être ?",
			],
		},
	},

	// Absence request responses
	request_absence: {
		success: {
			templates: [
				"Ta demande d'absence du {startDate} au {endDate} a été soumise.",
				"Demande enregistrée ! Ton responsable a été notifié pour la prendre en compte.",
				"C'est fait, la demande d'absence est envoyée à tes responsables.",
			],
		},
		error: {
			templates: [
				"La demande d'absence n'a pas pu être envoyée.",
				"Erreur lors de la soumission. Vérifiez les dates.",
			],
		},
	},

	// Navigation responses
	navigate_to: {
		success: {
			templates: [
				"Je vous emmène vers **{label}**.",
				"Navigation vers **{label}** en cours...",
				"Allons-y ! Direction **{label}**.",
				"On y va ! Voici la page **{label}**.",
			],
		},
		not_found: {
			templates: [
				"Je n'ai pas trouvé cette page. Essayez d'être plus précis.",
				"Page introuvable. Voici quelques suggestions :",
				"Hmm, je ne connais pas cette destination. Où voulez-vous aller ?",
			],
		},
	},

	// Search responses
	search_global: {
		success: {
			templates: [
				'Voici les résultats pour **"{query}"** :',
				'J\'ai trouvé ceci pour **"{query}"** :',
				'Résultats de recherche pour **"{query}"** :',
			],
		},
		empty: {
			templates: [
				'Aucun résultat pour **"{query}"**. Essayez avec d\'autres termes.',
				'Je n\'ai rien trouvé pour **"{query}"**. Reformulez votre recherche ?',
			],
		},
	},

	// Task list responses
	list_tasks: {
		success: {
			templates: ["Voici vos tâches :", "Voici la liste de vos tâches en cours :", "Votre backlog :"],
		},
		empty: {
			templates: [
				"Vous n'avez aucune tâche pour le moment. On en crée une ?",
				"Liste vide ! C'est le moment de créer de nouvelles tâches.",
			],
		},
	},

	// Task completion responses
	complete_task: {
		success: {
			templates: [
				"Tâche terminée ! Bien joué.",
				"C'est fait, la tâche est marquée comme terminée.",
				"Une de moins ! La tâche est terminée.",
			],
		},
	},

	// Greeting responses with time-awareness
	greet: {
		morning: {
			templates: [
				"Bonjour ! Comment puis-je vous aider ce matin ?",
				"Bon matin ! Prêt pour une journée productive ?",
				"Hello ! Quoi de prévu aujourd'hui ?",
			],
		},
		afternoon: {
			templates: [
				"Bon après-midi ! Que puis-je faire pour vous ?",
				"Salut ! Comment va votre journée ?",
				"Hey ! Besoin d'aide cet après-midi ?",
			],
		},
		evening: {
			templates: [
				"Bonsoir ! Encore au travail ? Comment puis-je vous aider ?",
				"Bonsoir ! Finissons cette journée en beauté.",
				"Hello ! On termine quelques tâches ce soir ?",
			],
		},
	},

	// Help responses
	show_help: {
		success: {
			templates: [
				"Voici tout ce que je peux faire pour vous :",
				"Bien sûr ! Voici mes capacités :",
				"Je suis là pour vous aider ! Voici ce que je sais faire :",
			],
		},
	},

	// Theme change responses
	change_theme: {
		dark: {
			templates: [
				"Mode sombre activé. Vos yeux vous remercient !",
				"C'est fait, le thème sombre est en place.",
				"Thème sombre sélectionné.",
			],
		},
		light: {
			templates: [
				"Mode clair activé. Plus lumineux !",
				"Thème clair sélectionné.",
				"C'est fait, retour au mode clair.",
			],
		},
		system: {
			templates: [
				"Thème automatique activé. Il suivra les préférences de votre système.",
				"Le thème suit désormais votre système.",
			],
		},
	},

	// Notification responses
	mark_notifications_read: {
		success: {
			templates: [
				"Toutes vos notifications ont été marquées comme lues.",
				"C'est fait, notifications lues !",
				"Boîte de notifications nettoyée.",
			],
		},
	},

	// Export responses
	export_data: {
		success: {
			templates: [
				"L'export en {format} est en cours de préparation.",
				"Votre fichier {format} sera prêt dans quelques instants.",
				"Export {format} lancé ! Vous recevrez une notification.",
			],
		},
	},

	// Error fallbacks
	unknown: {
		default: {
			templates: [
				"Je n'ai pas bien compris. Pouvez-vous reformuler ?",
				"Hmm, je ne suis pas sûr de comprendre. Essayez autrement ?",
				"Désolé, je n'ai pas saisi votre demande. Voici ce que je peux faire :",
				"Je ne comprends pas cette requête. Voulez-vous voir mes capacités ?",
			],
		},
	},

	// Permission denied responses
	permission_denied: {
		default: {
			templates: [
				"Vous n'avez pas les permissions nécessaires pour cette action.",
				"Désolé, cette action n'est pas autorisée avec votre rôle actuel.",
				"Accès refusé. Contactez un administrateur pour obtenir les droits.",
			],
		},
	},
};

/**
 * Pick a random template from a list
 * @param templates Array of template strings
 * @returns Random template
 */

function pickRandom(templates: string[]): string {
	return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Replace placeholder tokens in a template string
 * @param template Template with {token} placeholders
 * @param data Key-value map of token replacements
 * @returns Template with tokens replaced
 */

function fillTemplate(template: string, data: Record<string, string>): string {
	let result = template;
	for (const [key, value] of Object.entries(data)) {
		result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
	}
	return result;
}

/**
 * Get a response message for a given action and variant
 * @param action Intent action type
 * @param variant Response variant (success, error, etc.)
 * @param data Template data for placeholder replacement
 * @returns Formatted response string
 */

export function getResponse(action: string, variant: string, data: Record<string, string> = {}): string {
	const actionTemplates = RESPONSE_TEMPLATES[action];
	if (!actionTemplates) {
		return pickRandom(RESPONSE_TEMPLATES.unknown.default.templates);
	}

	const variantTemplates = actionTemplates[variant];
	if (!variantTemplates) {
		// Fallback to success or first available
		const fallbackVariant = actionTemplates.success || Object.values(actionTemplates)[0];
		return fillTemplate(pickRandom(fallbackVariant.templates), data);
	}

	return fillTemplate(pickRandom(variantTemplates.templates), data);
}

/**
 * Get a time-aware greeting response
 * @returns Appropriate greeting based on current time
 */

export function getTimeAwareGreeting(): string {
	const hour = new Date().getHours();
	let period: string;

	if (hour < 12) period = "morning";
	else if (hour < 18) period = "afternoon";
	else period = "evening";

	return getResponse("greet", period);
}

/**
 * Generate à conversational error message based on the error type
 * @param errorType Type of error that occurred
 * @param details Additional error details
 * @returns User-friendly error message
 */

export function getErrorMessage(errorType: string, details?: string): string {
	const errorMessages: Record<string, string[]> = {
		network: [
			"Problème de connexion. Vérifiez votre réseau et réessayez.",
			"La connexion a échoué. Vérifiez votre accès Internet.",
		],
		permission: [
			"Vous n'avez pas l'autorisation d'effectuer cette action.",
			"Accès refusé. Contactez un administrateur.",
		],
		validation: [
			"Les données saisies ne sont pas valides. Vérifiez et réessayez.",
			"Erreur de validation. Corrigez les champs en erreur.",
		],
		not_found: ["Élément introuvable. Il a peut-être été supprimé.", "Impossible de trouver cet élément."],
		server: [
			"Erreur serveur. Réessayez dans quelques instants.",
			"Une erreur interne est survenue. L'équipe technique est notifiée.",
		],
		timeout: ["L'opération a pris trop de temps. Réessayez.", "Délai d'attente dépassé. Veuillez réessayer."],
		generic: ["Une erreur inattendue s'est produite. Réessayez.", "Oups ! Quelque chose s'est mal passé."],
	};

	const messages = errorMessages[errorType] || errorMessages.generic;
	let message = pickRandom(messages);

	if (details) {
		message += `\n\nDétails : ${details}`;
	}

	return message;
}

/**
 * Generate à transition message for multi-step flows
 * @param stepIndex Current step index (1-based)
 * @param totalSteps Total number of steps
 * @param stepLabel Label for the current step
 * @returns Encouraging transition message
 */

export function getFlowTransitionMessage(stepIndex: number, totalSteps: number, stepLabel: string): string {
	if (stepIndex === 1) {
		const intros = ["Très bien, commençons !", "C'est parti !", "Allons-y !"];
		return `${pickRandom(intros)} (Étape ${stepIndex}/${totalSteps})`;
	}

	if (stepIndex === totalSteps) {
		return `Dernière étape ! (${stepIndex}/${totalSteps})`;
	}

	const transitions = [
		`Parfait ! Suite... (${stepIndex}/${totalSteps})`,
		`Bien noté. Continuons. (${stepIndex}/${totalSteps})`,
		`OK ! Prochaine question. (${stepIndex}/${totalSteps})`,
		`C'est enregistré. (${stepIndex}/${totalSteps})`,
	];

	return pickRandom(transitions);
}

/**
 * Generate an idle conversation prompt based on time of day and context
 * @param context Current assistant context
 * @returns A proactive suggestion message
 */

export function getIdlePrompt(context: AssistantContext): string {
	const hour = new Date().getHours();
	const prompts: string[] = [];

	if (hour < 10) {
		prompts.push(
			"Voulez-vous voir le planning de votre journée ?",
			"Prêt à attaquer la journée ? Je peux vous montrer vos tâches.",
		);
	} else if (hour < 12) {
		prompts.push("Avez-vous des tâches à terminer avant la pause ?", "Un coup d'oeil sur vos réunions du jour ?");
	} else if (hour < 14) {
		prompts.push("Bon appétit ! À tout à l'heure.", "Besoin de planifier quelque chose pour cet après-midi ?");
	} else if (hour < 17) {
		prompts.push(
			"Comment se passe votre après-midi ? Besoin d'aide ?",
			"Un récap de votre avancement sur les tâches en cours ?",
		);
	} else {
		prompts.push(
			"La journée touche à sa fin. Un récapitulatif ?",
			"Voulez-vous planifier quelque chose pour demain ?",
		);
	}

	return pickRandom(prompts);
}

/**
 * Compute suggestions based on the user's usage patterns and current context
 * @param mostUsedActions Array of most frequently used action names
 * @param context Current context
 * @returns Personalized suggestions
 */

export function getPersonalizedSuggestions(mostUsedActions: string[], context: AssistantContext): Suggestion[] {
	const suggestions: Suggestion[] = [];
	const actionSuggestionMap: Record<string, Suggestion> = {
		create_task: {
			id: "pers-create-task",
			label: "Nouvelle tâche",
			icon: "plus",
			description: "Votre action la plus utilisée",
			query: "Créer une nouvelle tâche",
			category: "task",
		},
		list_tasks: {
			id: "pers-list-tasks",
			label: "Mes tâches",
			icon: "tasks",
			description: "Votre action la plus utilisée",
			query: "Montre-moi mes tâches",
			category: "task",
		},
		create_meeting: {
			id: "pers-create-meeting",
			label: "Planifier réunion",
			icon: "calendar",
			description: "Fréquemment utilisé",
			query: "Planifier une réunion",
			category: "meeting",
		},
		list_meetings: {
			id: "pers-list-meetings",
			label: "Réunions",
			icon: "calendar",
			description: "Fréquemment utilisé",
			query: "Mes prochaines réunions",
			category: "meeting",
		},
		create_project: {
			id: "pers-create-project",
			label: "Nouveau projet",
			icon: "folder",
			description: "Fréquemment utilisé",
			query: "Créer un nouveau projet",
			category: "project",
		},
		search_global: {
			id: "pers-search",
			label: "Rechercher",
			icon: "search",
			description: "Fréquemment utilisé",
			query: "Rechercher ",
			category: "search",
		},
		request_absence: {
			id: "pers-absence",
			label: "Poser un congé",
			icon: "calendar",
			description: "Fréquemment utilisé",
			query: "Je veux poser un congé",
			category: "absence",
		},
	};

	// Add suggestions for most used actions
	for (const action of mostUsedActions.slice(0, 4)) {
		if (actionSuggestionMap[action]) {
			suggestions.push(actionSuggestionMap[action]);
		}
	}

	// Fill remaining with contextual suggestions
	if (suggestions.length < 4) {
		const contextual = getContextualSuggestions(context);
		for (const s of contextual) {
			if (!suggestions.some((existing) => existing.category === s.category)) {
				suggestions.push(s);
			}
			if (suggestions.length >= 4) break;
		}
	}

	return suggestions;
}
