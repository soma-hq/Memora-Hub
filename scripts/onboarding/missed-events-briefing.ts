import type { OnboardingScript } from "../types";

export const MISSED_EVENTS_PENDING_KEY = "memora-missed-events-pending";
export const MISSED_EVENTS_LAST_SEEN_KEY = "memora-missed-events-last-seen";

/**
 * Guided recap script shown right after login so users can catch up.
 */
export const MISSED_EVENTS_BRIEFING: OnboardingScript = {
	id: "missed-events-briefing",
	name: "Rattrapage des evenements",
	storageKey: MISSED_EVENTS_LAST_SEEN_KEY,
	steps: [
		{
			id: "intro",
			title: "Rattrapage",
			category: "Memora AI",
			icon: "bot",
			pearlMood: "encouraging",
			pearlMessage:
				"Hey ! T'as loupe un certain nombre d'evenements. Si tu veux, je te guide pas a pas avec un recap ultra clair.",
		},
		{
			id: "planning",
			title: "Planning & absences",
			category: "Calendrier",
			icon: "calendar",
			pearlMood: "curious",
			pearlMessage:
				"Je commence par le planning: reunions a venir et absences ajoutees pendant ton absence.",
		},
		{
			id: "delivery",
			title: "Projets & taches",
			category: "Execution",
			icon: "folder",
			pearlMood: "encouraging",
			pearlMessage:
				"Ensuite je te montre les projets, les taches et ce qui a bouge depuis ta derniere connexion.",
		},
		{
			id: "updates",
			title: "Patchnotes",
			category: "Produit",
			icon: "news",
			pearlMood: "excited",
			pearlMessage:
				"Pour finir: les nouveautes produit, correctifs, et ameliorations qui peuvent impacter ton quotidien.",
		},
		{
			id: "done",
			title: "Tu es a jour",
			category: "Final",
			icon: "check",
			pearlMood: "proud",
			pearlMessage:
				"Parfait, t'es a jour. Si tu veux, je peux ensuite te guider vers la prochaine action prioritaire.",
		},
	],
};
