import type { OnboardingScript } from "../types";
import { defineScriptConfig } from "@/structures";

const SCRIPT_CONFIG = defineScriptConfig({
	name: "welcome-onboarding",
	category: "onboarding",
	description:
		"Script d'accueil pour les nouveaux utilisateurs, guidé par PEARL. Adapté aux programmes de formation (Marsha Academy).",
});

/** Main onboarding script for first-time users, guided by PEARL */
export const WELCOME_ONBOARDING: OnboardingScript = {
	id: "welcome",
	name: "Bienvenue chez Marsha",
	steps: [
		{
			id: "introduction",
			title: "Bienvenue",
			category: "Decouverte",
			icon: "sparkles",
			pearlMessage:
				"Hey ! Bienvenue sur Memora ! Je suis PEARL, ton guide perso. On va faire le tour ensemble, tu vas voir c'est super simple !",
			pearlMood: "excited",
			highlight: "dashboard",
		},
		{
			id: "marsha",
			title: "Marsha",
			category: "Decouverte",
			icon: "group",
			pearlMessage:
				"Alors, Marsha c'est ton equipe ! C'est ici que tout se passe : la coordination, la gestion, le suivi. Tu fais partie d'un truc solide.",
			pearlMood: "happy",
			highlight: "equipe",
		},
		{
			id: "position",
			title: "Ta position",
			category: "Decouverte",
			icon: "shield",
			pearlMessage:
				"Ton role dans la team va definir ce que tu peux voir et faire. Pas de panique, je t'explique tout au fur et a mesure !",
			pearlMood: "encouraging",
			highlight: "role",
		},
		{
			id: "program-intro",
			title: "Ton programme",
			category: "Programme",
			icon: "book",
			pearlMessage:
				"Tu as ete inscrit a la Marsha Academy ! C'est un parcours de formation complet avec un mentor dedie qui va t'accompagner du debut a la fin. On va tout detailler.",
			pearlMood: "excited",
			highlight: "programme",
		},
		{
			id: "program-track",
			title: "Ton parcours",
			category: "Programme",
			icon: "route",
			pearlMessage:
				"Ton parcours est adapte a ta fonction : moderation Discord, Twitch, YouTube ou polyvalente. Chaque parcours a ses propres phases, milestones et formations.",
			pearlMood: "curious",
			highlight: "parcours",
		},
		{
			id: "program-mentor",
			title: "Ton mentor",
			category: "Programme",
			icon: "user",
			pearlMessage:
				"Tu as un referent Momentum assigne qui va te suivre tout au long du programme. Check-ins reguliers, sessions de groupe, feedbacks continus : tu ne seras jamais seul.",
			pearlMood: "encouraging",
			highlight: "mentor",
		},
		{
			id: "program-phases",
			title: "Les phases",
			category: "Programme",
			icon: "layers",
			pearlMessage:
				"Ton parcours se deroule en 6 phases : Accueil, Decouverte, Formation, Pratique, Evaluation et Integration. Chaque phase a des objectifs clairs a valider avant de passer a la suite.",
			pearlMood: "happy",
			highlight: "phases",
		},
		{
			id: "program-spaces",
			title: "Espaces de formation",
			category: "Programme",
			icon: "layout",
			pearlMessage:
				"Tu auras acces a des espaces de formation dedies a ton parcours : documents, videos, exercices, quiz et sessions live. Tout est la pour toi dans le Hub.",
			pearlMood: "excited",
			highlight: "espaces",
		},
		{
			id: "pim-1",
			title: "PIM Phase 1",
			category: "Formation",
			icon: "book",
			pearlMessage:
				"La Phase 1 du PIM, c'est la base ! Tu vas apprendre les fondamentaux de la moderation et du fonctionnement de l'equipe. On y va ?",
			pearlMood: "curious",
			highlight: "formation",
		},
		{
			id: "pim-2",
			title: "PIM Phase 2",
			category: "Formation",
			icon: "rocket",
			pearlMessage:
				"Phase 2, on monte en puissance ! Tu vas decouvrir les outils avances et les process de l'equipe. Ca va te plaire !",
			pearlMood: "excited",
			highlight: "outils",
		},
		{
			id: "avant",
			title: "Avant de commencer",
			category: "Preparation",
			icon: "info",
			pearlMessage:
				"Avant de te lancer, quelques trucs a savoir : lis bien les consignes, configure ton profil, et n'hesite jamais a poser des questions !",
			pearlMood: "encouraging",
			highlight: "profil",
		},
		{
			id: "formulaire",
			title: "Formulaire",
			category: "Preparation",
			icon: "edit",
			showProgress: false,
			pearlMessage:
				"Petit formulaire rapide pour mieux te connaitre. Remplis ca tranquille, je t'attends de l'autre cote !",
			pearlMood: "happy",
			highlight: "formulaire",
		},
		{
			id: "apres",
			title: "Et apres ?",
			category: "Finalisation",
			icon: "check",
			pearlMessage:
				"Nickel ! Maintenant, tu as acces a ton Hub. Ton programme de formation t'attend dans l'onglet Programmes. Ton mentor sera notifie de ton arrivee.",
			pearlMood: "encouraging",
			highlight: "hub",
		},
		{
			id: "celebration",
			title: "Bienvenue !",
			category: "Finalisation",
			icon: "sparkles",
			pearlMessage:
				"Et voila, tu fais officiellement partie de l'equipe ! Bienvenue dans la Marsha Squad. Ton aventure a la Marsha Academy commence maintenant. On va faire de grandes choses ensemble !",
			pearlMood: "proud",
			highlight: "celebration",
		},
	],
	storageKey: "memora-onboarding-completed",
	triggersTutorial: "hub-welcome",
};

/**
 * Returns a subset of onboarding steps tailored to a program enrollee.
 * If the user has no program enrollment, returns the standard steps only.
 * @param hasProgram - Whether the user is enrolled in a program
 * @returns Filtered list of step IDs to display
 */
export function getOnboardingStepsForUser(hasProgram: boolean): string[] {
	const allSteps = WELCOME_ONBOARDING.steps.map((s) => s.id);
	const programSteps = ["program-intro", "program-track", "program-mentor", "program-phases", "program-spaces"];

	if (hasProgram) {
		return allSteps;
	}

	// Filter out program-specific steps for non-enrolled users
	return allSteps.filter((id) => !programSteps.includes(id));
}

/**
 * Checks whether the onboarding has been completed.
 * @param {string} storageKey - LocalStorage key for the onboarding
 * @returns {boolean} True if onboarding was already completed
 */
export function hasOnboardingCompleted(storageKey: string): boolean {
	if (typeof window === "undefined") return true;
	return localStorage.getItem(storageKey) === "true";
}

/**
 * Marks the onboarding as completed and optionally triggers a tutorial.
 * @param {string} storageKey - LocalStorage key for the onboarding
 * @param {string} [tutorialStorageKey] - Optional tutorial key to reset (so tutorial triggers)
 * @returns {void}
 */
export function completeOnboarding(storageKey: string, tutorialStorageKey?: string): void {
	localStorage.setItem(storageKey, "true");
	// When onboarding completes, ensure the tutorial runs next
	if (tutorialStorageKey) {
		localStorage.removeItem(tutorialStorageKey);
	}
}
