import type { TutorialScript } from "../types";


/** Tutorial steps for the Memora Hub first-time walkthrough */
export const HUB_TUTORIAL: TutorialScript = {
	id: "hub-welcome",
	name: "Decouvrir le Hub",
	description: "Visite guidee des fonctionnalites du Memora Hub.",
	storageKey: "memora-tutorial-completed",
	steps: [
		// Phase 1: Sidebar overview (stays on current page)
		{
			id: "sidebar-nav",
			targetSelector: "[data-tutorial='sidebar']",
			title: "La Navigation",
			description:
				"Voici ta barre laterale. Tu y trouveras tous les modules du Hub organises par categorie : Dashboard, Equipe, Moderation, Projets et bien plus.",
			placement: "right",
		},
		// Phase 2: Header actions
		{
			id: "header-search",
			targetSelector: "[data-tutorial='search']",
			title: "La Recherche",
			description:
				"Utilise la recherche (Ctrl+K) pour trouver rapidement n'importe quoi : pages, membres, projets, parametres...",
			placement: "bottom",
		},
		{
			id: "header-patchnotes",
			targetSelector: "[data-tutorial='patchnotes']",
			title: "Les Patchnotes",
			description:
				"Chaque mise a jour du Hub sera signalee ici avec un point rouge. Tu pourras consulter le changelog complet.",
			placement: "bottom",
		},
		{
			id: "header-notifications",
			targetSelector: "[data-tutorial='notifications']",
			title: "Les Notifications",
			description:
				"Ici tu recevras toutes les notifications en temps reel : sanctions, messages d'equipe, rappels de taches...",
			placement: "bottom",
		},
		{
			id: "header-assistant",
			targetSelector: "[data-tutorial='assistant']",
			title: "Ton Assistant IA",
			description:
				"Ton assistant personnel pour toutes tes questions sur le Hub et Marsha. N'hesite pas a l'utiliser !",
			placement: "bottom",
		},
		{
			id: "header-profile",
			targetSelector: "[data-tutorial='profile']",
			title: "Ton Profil",
			description:
				"Accede a ton profil, parametres, preferences visuelles et deconnexion. Tu peux aussi changer le theme ici.",
			placement: "bottom",
		},
		// Phase 3: Navigate to dashboard
		{
			id: "dashboard-overview",
			targetSelector: "[data-tutorial='sidebar']",
			title: "Le Dashboard",
			description:
				"Ton tableau de bord central. Tu y verras un resume de ton activite, tes taches, et les dernieres actus de ta Squad.",
			placement: "right",
			navigateTo: "/hub/{groupId}",
			delay: 800,
		},
		// Phase 4: Navigate to squad (requires at least Junior access)
		{
			id: "squad-page",
			targetSelector: "[data-tutorial='sidebar']",
			title: "L'Equipe",
			description:
				"Retrouve tous les membres de ta Squad ici. Tu peux voir leurs profils, roles, et statuts de presence.",
			placement: "right",
			navigateTo: "/hub/{groupId}/personnel/squad",
			delay: 800,
			requiredRole: "Junior",
		},
		// Phase 5: Navigate to absences
		{
			id: "absences-page",
			targetSelector: "[data-tutorial='sidebar']",
			title: "Les Absences",
			description:
				"Gere tes absences ici : absence partielle (pas de notifs) ou totale (acces restreints). Indispensable pour un suivi clair.",
			placement: "right",
			navigateTo: "/hub/{groupId}/personnel/absences",
			delay: 800,
			requiredRole: "Junior",
		},
		// Phase 6: Navigate to projects (requires Moderator+)
		{
			id: "projects-page",
			targetSelector: "[data-tutorial='sidebar']",
			title: "Les Projets",
			description:
				"Cree et suis tes projets d'equipe. Chaque projet a un calendrier, des relations, et un journal d'activite.",
			placement: "right",
			navigateTo: "/hub/{groupId}/projects",
			delay: 800,
			requiredRole: "Moderator",
		},
		// Phase 7: Navigate to moderation (requires Moderator+)
		{
			id: "mod-page",
			targetSelector: "[data-tutorial='sidebar']",
			title: "La Moderation",
			description:
				"Ton espace de moderation selon la plateforme (Discord, Twitch, YouTube). Consignes, politique, sanctions et plus.",
			placement: "right",
			navigateTo: "/hub/{groupId}/mod-youtube/sanctions",
			delay: 800,
			requiredRole: "Moderator",
		},
		// Phase 8: Final step
		{
			id: "tutorial-done",
			targetSelector: "[data-tutorial='sidebar']",
			title: "C'est parti !",
			description:
				"Tu as fait le tour des fonctionnalites principales. Explore librement le Hub et n'hesite pas a utiliser l'assistant si tu as une question. Bienvenue dans la Marsha Squad !",
			placement: "right",
			nextLabel: "Terminer",
		},
	],
};

/**
 * Checks whether a specific tutorial script has been completed.
 * @param {string} storageKey - LocalStorage key for the tutorial
 * @returns {boolean} True if the tutorial was already completed
 */
export function hasTutorialCompleted(storageKey: string): boolean {
	if (typeof window === "undefined") return true;
	return localStorage.getItem(storageKey) === "true";
}

/**
 * Marks a tutorial script as completed in localStorage.
 * @param {string} storageKey - LocalStorage key for the tutorial
 * @returns {void}
 */
export function markTutorialCompleted(storageKey: string): void {
	localStorage.setItem(storageKey, "true");
}

/**
 * Resets a tutorial script so it can be replayed.
 * @param {string} storageKey - LocalStorage key for the tutorial
 * @returns {void}
 */
export function resetTutorial(storageKey: string): void {
	localStorage.removeItem(storageKey);
}

/** Role hierarchy for permission checking (higher index = higher permissions) */
const ROLE_HIERARCHY = ["Guest", "Junior", "Moderator", "Manager", "Admin", "Owner"] as const;

/**
 * Checks if a user role meets the minimum required role for a step.
 * @param {string} userRole - The current user role
 * @param {string} requiredRole - The minimum role required
 * @returns {boolean} True if user has sufficient permissions
 */
export function hasMinimumRole(userRole: string, requiredRole: string): boolean {
	const userIdx = ROLE_HIERARCHY.indexOf(userRole as (typeof ROLE_HIERARCHY)[number]);
	const reqIdx = ROLE_HIERARCHY.indexOf(requiredRole as (typeof ROLE_HIERARCHY)[number]);
	if (userIdx === -1 || reqIdx === -1) return false;
	return userIdx >= reqIdx;
}
