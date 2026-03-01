import type { TutorialStep } from "../types";


/** Tutorial steps for the Memora Hub first-time walkthrough */
export const TUTORIAL_STEPS: TutorialStep[] = [
	{
		id: "sidebar-nav",
		targetSelector: "[data-tutorial='sidebar']",
		title: "La Navigation",
		description:
			"Voici ta barre laterale. Tu y retrouveras tous les modules : Dashboard, Equipe, Projets, Moderation, et bien plus.",
		placement: "right",
	},
	{
		id: "header-search",
		targetSelector: "[data-tutorial='search']",
		title: "La Recherche",
		description:
			"Utilise la recherche (ou Ctrl+K) pour trouver rapidement n'importe quel element dans le Hub : pages, membres, projets...",
		placement: "bottom",
	},
	{
		id: "header-notifications",
		targetSelector: "[data-tutorial='notifications']",
		title: "Les Notifications",
		description:
			"Tu recevras ici toutes les notifications importantes : sanctions, mises a jour d'equipe, rappels...",
		placement: "bottom",
	},
	{
		id: "header-patchnotes",
		targetSelector: "[data-tutorial='patchnotes']",
		title: "Les Patchnotes",
		description:
			"Chaque mise a jour du Hub sera signalee ici. Tu pourras consulter le changelog complet des nouveautes.",
		placement: "bottom",
	},
	{
		id: "header-assistant",
		targetSelector: "[data-tutorial='assistant']",
		title: "Ton Assistant IA",
		description:
			"Besoin d'aide ? Ton assistant IA est la pour repondre a tes questions sur le fonctionnement du Hub et de Marsha.",
		placement: "bottom",
	},
	{
		id: "header-profile",
		targetSelector: "[data-tutorial='profile']",
		title: "Ton Profil",
		description:
			"Accede a ton profil, tes parametres et ta deconnexion depuis ce menu. Tu peux aussi y changer le theme.",
		placement: "bottom",
		nextLabel: "Terminer",
	},
];

/** LocalStorage key for tracking tutorial completion */
export const TUTORIAL_STORAGE_KEY = "memora-tutorial-completed";

/**
 * Checks whether the user has completed the tutorial.
 * @returns {boolean} True if the tutorial was already completed
 */
export function hasTutorialCompleted(): boolean {
	if (typeof window === "undefined") return true;
	return localStorage.getItem(TUTORIAL_STORAGE_KEY) === "true";
}

/**
 * Marks the tutorial as completed in localStorage.
 * @returns {void}
 */
export function markTutorialCompleted(): void {
	localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
}
