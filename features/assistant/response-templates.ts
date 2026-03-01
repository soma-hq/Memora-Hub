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
				'Super, la tâche **"{title}"** a ete créée avec succes !',
				'C\'est fait ! Ta tâche **"{title}"** est prête.',
				'Tâche **"{title}"** créée. Tu peux la retrouver dans ta liste de tâches personnelles.',
				'Parfait, j\'ai crée ta tâche **"{title}"** !',
			],
		},
		error: {
			templates: [
				"Impossible de créer la tache. Vérifie les informations et réessaie.",
				"Oups, la creation de la tâche a échoue. On réessaie ?",
				"Malheureusement, une erreur est survenue lors de la création de ta tâche. J'ai prévenu le développeur de cet incident. Désolé ! 😬",
			],
		},
	},

	// Project creation responses
	create_project: {
		success: {
			templates: [
				'Le projet **"{name}"** a ete crée avec succes !',
				'Projet **"{name}"** lancé !',
				'C\'est parti ! Le projet **"{name}"** est prêt.',
			],
		},
		error: {
			templates: [
				"La création du projet a échoué. Vérifie vos permissions.",
				"Impossible de créer le projet pour le moment.",
			],
		},
	},

	// Meeting creation responses
	create_meeting: {
		success: {
			templates: [
				'La reunion **"{title}"** est planifiee pour le {date} a {time}.',
				'Reunion **"{title}"** confirmee ! Les participants seront notifies.',
				'C\'est note ! Reunion **"{title}"** le {date} a {time}.',
			],
		},
		error: {
			templates: [
				"La planification de la reunion a echoue.",
				"Impossible de creer la reunion. Un conflit d'horaire peut-etre ?",
			],
		},
	},

	// Absence request responses
	request_absence: {
		success: {
			templates: [
				"Ta demande d'absence du {startDate} au {endDate} a été soumise.",
				"Demande enregistrée ! Ton responsable a été notifié pour la prendre en compte.",
				"C'est fait, la demande d'absence est envoyé à tes responsables.",
			],
		},
		error: {
			templates: [
				"La demande d'absence n'a pas pu etre envoyee.",
				"Erreur lors de la soumission. Verifiez les dates.",
			],
		},
	},

	// Navigation responses
	navigate_to: {
		success: {
			templates: [
				"Je vous emmene vers **{label}**.",
				"Navigation vers **{label}** en cours...",
				"Allons-y ! Direction **{label}**.",
				"On y va ! Voici la page **{label}**.",
			],
		},
		not_found: {
			templates: [
				"Je n'ai pas trouve cette page. Essayez d'etre plus precis.",
				"Page introuvable. Voici quelques suggestions :",
				"Hmm, je ne connais pas cette destination. Ou voulez-vous aller ?",
			],
		},
	},

	// Search responses
	search_global: {
		success: {
			templates: [
				'Voici les resultats pour **"{query}"** :',
				'J\'ai trouve ceci pour **"{query}"** :',
				'Resultats de recherche pour **"{query}"** :',
			],
		},
		empty: {
			templates: [
				'Aucun resultat pour **"{query}"**. Essayez avec d\'autres termes.',
				'Je n\'ai rien trouve pour **"{query}"**. Reformulez votre recherche ?',
			],
		},
	},

	// Task list responses
	list_tasks: {
		success: {
			templates: ["Voici vos taches :", "Voici la liste de vos taches en cours :", "Votre backlog :"],
		},
		empty: {
			templates: [
				"Vous n'avez aucune tache pour le moment. On en cree une ?",
				"Liste vide ! C'est le moment de creer de nouvelles taches.",
			],
		},
	},

	// Task completion responses
	complete_task: {
		success: {
			templates: [
				"Tache terminee ! Bien joue.",
				"C'est fait, la tache est marquee comme terminee.",
				"Une de moins ! La tache est terminee.",
			],
		},
	},

	// Greeting responses with time-awareness
	greet: {
		morning: {
			templates: [
				"Bonjour ! Comment puis-je vous aider ce matin ?",
				"Bon matin ! Pret pour une journee productive ?",
				"Hello ! Quoi de prevu aujourd'hui ?",
			],
		},
		afternoon: {
			templates: [
				"Bon apres-midi ! Que puis-je faire pour vous ?",
				"Salut ! Comment va votre journee ?",
				"Hey ! Besoin d'aide cet apres-midi ?",
			],
		},
		evening: {
			templates: [
				"Bonsoir ! Encore au travail ? Comment puis-je vous aider ?",
				"Bonsoir ! Finissons cette journee en beaute.",
				"Hello ! On termine quelques taches ce soir ?",
			],
		},
	},

	// Help responses
	show_help: {
		success: {
			templates: [
				"Voici tout ce que je peux faire pour vous :",
				"Bien sur ! Voici mes capacites :",
				"Je suis la pour vous aider ! Voici ce que je sais faire :",
			],
		},
	},

	// Theme change responses
	change_theme: {
		dark: {
			templates: [
				"Mode sombre active. Vos yeux vous remercient !",
				"C'est fait, le theme sombre est en place.",
				"Theme sombre selectionne.",
			],
		},
		light: {
			templates: [
				"Mode clair active. Plus lumineux !",
				"Theme clair selectionne.",
				"C'est fait, retour au mode clair.",
			],
		},
		system: {
			templates: [
				"Theme automatique active. Il suivra les preferences de votre systeme.",
				"Le theme suit désormais votre systeme.",
			],
		},
	},

	// Notification responses
	mark_notifications_read: {
		success: {
			templates: [
				"Toutes vos notifications ont ete marquees comme lues.",
				"C'est fait, notifications lues !",
				"Boite de notifications nettoyee.",
			],
		},
	},

	// Export responses
	export_data: {
		success: {
			templates: [
				"L'export en {format} est en cours de preparation.",
				"Votre fichier {format} sera pret dans quelques instants.",
				"Export {format} lance ! Vous recevrez une notification.",
			],
		},
	},

	// Error fallbacks
	unknown: {
		default: {
			templates: [
				"Je n'ai pas bien compris. Pouvez-vous reformuler ?",
				"Hmm, je ne suis pas sur de comprendre. Essayez autrement ?",
				"Desole, je n'ai pas saisi votre demande. Voici ce que je peux faire :",
				"Je ne comprends pas cette requete. Voulez-vous voir mes capacites ?",
			],
		},
	},

	// Permission denied responses
	permission_denied: {
		default: {
			templates: [
				"Vous n'avez pas les permissions necessaires pour cette action.",
				"Desole, cette action n'est pas autorisee avec votre role actuel.",
				"Acces refuse. Contactez un administrateur pour obtenir les droits.",
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
 * Generate a conversational error message based on the error type
 * @param errorType Type of error that occurred
 * @param details Additional error details
 * @returns User-friendly error message
 */

export function getErrorMessage(errorType: string, details?: string): string {
	const errorMessages: Record<string, string[]> = {
		network: [
			"Probleme de connexion. Verifiez votre reseau et reessayez.",
			"La connexion a echoue. Verifiez votre acces Internet.",
		],
		permission: [
			"Vous n'avez pas l'autorisation d'effectuer cette action.",
			"Acces refuse. Contactez un administrateur.",
		],
		validation: [
			"Les donnees saisies ne sont pas valides. Verifiez et reessayez.",
			"Erreur de validation. Corrigez les champs en erreur.",
		],
		not_found: ["Element introuvable. Il a peut-etre ete supprime.", "Impossible de trouver cet element."],
		server: [
			"Erreur serveur. Reessayez dans quelques instants.",
			"Une erreur interne est survenue. L'equipe technique est notifiee.",
		],
		timeout: ["L'operation a pris trop de temps. Reessayez.", "Delai d'attente depasse. Veuillez reessayer."],
		generic: ["Une erreur inattendue s'est produite. Reessayez.", "Oups ! Quelque chose s'est mal passe."],
	};

	const messages = errorMessages[errorType] || errorMessages.generic;
	let message = pickRandom(messages);

	if (details) {
		message += `\n\nDetails : ${details}`;
	}

	return message;
}

/**
 * Generate a transition message for multi-step flows
 * @param stepIndex Current step index (1-based)
 * @param totalSteps Total number of steps
 * @param stepLabel Label for the current step
 * @returns Encouraging transition message
 */

export function getFlowTransitionMessage(stepIndex: number, totalSteps: number, stepLabel: string): string {
	if (stepIndex === 1) {
		const intros = ["Tres bien, commencons !", "C'est parti !", "Allons-y !"];
		return `${pickRandom(intros)} (Etape ${stepIndex}/${totalSteps})`;
	}

	if (stepIndex === totalSteps) {
		return `Derniere etape ! (${stepIndex}/${totalSteps})`;
	}

	const transitions = [
		`Parfait ! Suite... (${stepIndex}/${totalSteps})`,
		`Bien note. Continuons. (${stepIndex}/${totalSteps})`,
		`OK ! Prochaine question. (${stepIndex}/${totalSteps})`,
		`C'est enregistre. (${stepIndex}/${totalSteps})`,
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
			"Voulez-vous voir le planning de votre journee ?",
			"Pret a attaquer la journee ? Je peux vous montrer vos taches.",
		);
	} else if (hour < 12) {
		prompts.push("Avez-vous des taches a terminer avant la pause ?", "Un coup d'oeil sur vos reunions du jour ?");
	} else if (hour < 14) {
		prompts.push("Bon appetit ! A tout a l'heure.", "Besoin de planifier quelque chose pour cet apres-midi ?");
	} else if (hour < 17) {
		prompts.push(
			"Comment se passe votre apres-midi ? Besoin d'aide ?",
			"Un recap de votre avancement sur les taches en cours ?",
		);
	} else {
		prompts.push(
			"La journee touche a sa fin. Un recapitulatif ?",
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
			label: "Nouvelle tache",
			icon: "plus",
			description: "Votre action la plus utilisee",
			query: "Creer une nouvelle tache",
			category: "task",
		},
		list_tasks: {
			id: "pers-list-tasks",
			label: "Mes taches",
			icon: "tasks",
			description: "Votre action la plus utilisee",
			query: "Montre-moi mes taches",
			category: "task",
		},
		create_meeting: {
			id: "pers-create-meeting",
			label: "Planifier reunion",
			icon: "calendar",
			description: "Frequemment utilise",
			query: "Planifier une reunion",
			category: "meeting",
		},
		list_meetings: {
			id: "pers-list-meetings",
			label: "Reunions",
			icon: "calendar",
			description: "Frequemment utilise",
			query: "Mes prochaines reunions",
			category: "meeting",
		},
		create_project: {
			id: "pers-create-project",
			label: "Nouveau projet",
			icon: "folder",
			description: "Frequemment utilise",
			query: "Creer un nouveau projet",
			category: "project",
		},
		search_global: {
			id: "pers-search",
			label: "Rechercher",
			icon: "search",
			description: "Frequemment utilise",
			query: "Rechercher ",
			category: "search",
		},
		request_absence: {
			id: "pers-absence",
			label: "Poser un conge",
			icon: "calendar",
			description: "Frequemment utilise",
			query: "Je veux poser un conge",
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
