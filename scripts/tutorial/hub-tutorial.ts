import type { TutorialScript } from "../types";
import { defineScriptConfig } from "@/structures";

const SCRIPT_CONFIG = defineScriptConfig({
	name: "hub-tutorial",
	category: "tutorial",
	description: "Visite guidée du Memora Hub pour les nouveaux utilisateurs, accompagnée par PEARL.",
});

/** Tutorial steps for the Memora Hub first-time walkthrough, guided by PEARL */
export const HUB_TUTORIAL: TutorialScript = {
	id: "hub-welcome",
	name: "Découvrir le Hub",
	description: "Visite guidée des fonctionnalités du Memora Hub, accompagné par PEARL.",
	storageKey: "memora-tutorial-completed",
	steps: [
		// Phase 1: Sidebar overview
		{
			id: "sidebar-nav",
			targetSelector: "[data-tutorial='sidebar']",
			title: "La Navigation",
			description:
				"Voici ta barre latérale. Tu y trouveras tous les modules du Hub organisés par catégorie : Dashboard, Équipe, Modération, Projets et bien plus.",
			placement: "right",
			pearlMessage:
				"Salut ! Bienvenue sur le Hub. On commence par la sidebar : c'est ton GPS ici. Tous les modules sont rangés par catégorie.",
			pearlMood: "excited",
		},
		// Phase 2: Header actions
		{
			id: "header-search",
			targetSelector: "[data-tutorial='search']",
			title: "La Recherche",
			description:
				"Utilise la recherche (Ctrl+K) pour trouver rapidement n'importe quoi : pages, membres, projets, paramètres...",
			placement: "bottom",
			pearlMessage:
				"Ctrl+K et hop, tu trouves tout en un clin d'œil. Pages, membres, projets... C'est super rapide !",
			pearlMood: "curious",
			highlight: "search",
		},
		{
			id: "header-patchnotes",
			targetSelector: "[data-tutorial='patchnotes']",
			title: "Les Patchnotes",
			description:
				"Chaque mise à jour du Hub sera signalée ici avec un point rouge. Tu pourras consulter le changelog complet.",
			placement: "bottom",
			pearlMessage:
				"Le petit point rouge, c'est une nouvelle mise à jour ! Clique pour voir ce qui a changé. On améliore le Hub en continu.",
			pearlMood: "happy",
			highlight: "patchnotes",
		},
		{
			id: "header-notifications",
			targetSelector: "[data-tutorial='notifications']",
			title: "Les Notifications",
			description:
				"Ici tu recevras toutes les notifications en temps réel : sanctions, messages d'équipe, rappels de tâches...",
			placement: "bottom",
			pearlMessage: "Tes notifs arrivent ici en temps réel. Sanctions, rappels, messages... Tu ne rates rien !",
			pearlMood: "encouraging",
			highlight: "notifications",
		},
		{
			id: "header-assistant",
			targetSelector: "[data-tutorial='assistant']",
			title: "Ton Assistant IA",
			description:
				"Ton assistant personnel pour toutes tes questions sur le Hub et Marsha. N'hésite pas à l'utiliser !",
			placement: "bottom",
			pearlMessage:
				"Et là, c'est l'assistant IA. Si t'as une question, il est là pour toi. Mais bon, moi aussi je suis là hein !",
			pearlMood: "happy",
			highlight: "assistant",
		},
		{
			id: "header-profile",
			targetSelector: "[data-tutorial='profile']",
			title: "Ton Profil",
			description:
				"Accède à ton profil, paramètres, préférences visuelles et déconnexion. Tu peux aussi changer le thème ici.",
			placement: "bottom",
			pearlMessage:
				"Ton espace perso ! Profil, préférences, thème sombre/clair... Fais-toi plaisir, personnalise tout.",
			pearlMood: "encouraging",
			highlight: "profile",
		},
		// Phase 3: Navigate to dashboard
		{
			id: "dashboard-overview",
			targetSelector: "[data-tutorial='sidebar']",
			title: "Le Dashboard",
			description:
				"Ton tableau de bord central. Tu y verras un résumé de ton activité, tes tâches, et les dernières actus de ta Squad.",
			placement: "right",
			navigateTo: "/hub/{groupId}",
			delay: 800,
			pearlMessage:
				"Bienvenue sur ton Dashboard ! C'est ta base, ton cockpit. Résumé d'activité, tâches en cours, actus de la Squad... Tout est là.",
			pearlMood: "excited",
			highlight: "dashboard",
		},
		// Phase 4: Navigate to squad
		{
			id: "squad-page",
			targetSelector: "[data-tutorial='sidebar']",
			title: "L'Équipe",
			description:
				"Retrouve tous les membres de ta Squad ici. Tu peux voir leurs profils, rôles, et statuts de présence.",
			placement: "right",
			navigateTo: "/hub/{groupId}/personnel/squad",
			delay: 800,
			requiredRole: "Junior",
			pearlMessage:
				"Ta Squad, ta famille ! Ici tu vois tous les membres, leurs rôles, qui est en ligne... L'esprit d'équipe, ça commence là.",
			pearlMood: "happy",
			highlight: "equipe",
		},
		// Phase 5: Navigate to absences
		{
			id: "absences-page",
			targetSelector: "[data-tutorial='sidebar']",
			title: "Les Absences",
			description:
				"Gère tes absences ici : absence partielle (pas de notifs) ou totale (accès restreints). Indispensable pour un suivi clair.",
			placement: "right",
			navigateTo: "/hub/{groupId}/personnel/absences",
			delay: 800,
			requiredRole: "Junior",
			pearlMessage:
				"Besoin de souffler ? C'est ici que tu gères tes absences. Partielle ou totale, l'équipe sera au courant automatiquement.",
			pearlMood: "encouraging",
			highlight: "absences",
		},
		// Phase 6: Navigate to projects
		{
			id: "projects-page",
			targetSelector: "[data-tutorial='sidebar']",
			title: "Les Projets",
			description:
				"Crée et suis tes projets d'équipe. Chaque projet a un calendrier, des relations, et un journal d'activité.",
			placement: "right",
			navigateTo: "/hub/{groupId}/projects",
			delay: 800,
			requiredRole: "Moderator",
			pearlMessage:
				"Les projets, c'est là où la magie opère ! Crée, organise, suis l'avancement. Chaque projet a son propre univers.",
			pearlMood: "excited",
			highlight: "projets",
		},
		// Phase 7: Navigate to moderation
		{
			id: "mod-page",
			targetSelector: "[data-tutorial='sidebar']",
			title: "La Modération",
			description:
				"Ton espace de modération selon la plateforme (Discord, Twitch, YouTube). Consignes, politique, sanctions et plus.",
			placement: "right",
			navigateTo: "/hub/{groupId}/mod-youtube/sanctions",
			delay: 800,
			requiredRole: "Moderator",
			pearlMessage:
				"Ton espace de modération ! Discord, Twitch, YouTube... Chaque plateforme a ses consignes et ses outils. À toi de jouer.",
			pearlMood: "curious",
			highlight: "moderation",
		},
		// Phase 8: Final step
		{
			id: "tutorial-done",
			targetSelector: "[data-tutorial='sidebar']",
			title: "C'est parti !",
			description:
				"Tu as fait le tour des fonctionnalités principales. Explore librement le Hub et n'hésite pas à utiliser l'assistant si tu as une question. Bienvenue dans la Marsha Squad !",
			placement: "right",
			nextLabel: "Terminer",
			pearlMessage:
				"Et voilà, t'as fait le grand tour ! Tu connais l'essentiel. Explore, teste, amuse-toi. Je suis toujours là si tu as besoin. Bienvenue chez toi !",
			pearlMood: "proud",
			highlight: "celebration",
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
