import type { OnboardingScript } from "../types";


/** Main onboarding script for first-time users */
export const WELCOME_ONBOARDING: OnboardingScript = {
	id: "welcome",
	name: "Bienvenue chez Marsha",
	steps: [
		{ id: "introduction", title: "Bienvenue", category: "Decouverte", icon: "sparkles" },
		{ id: "marsha", title: "Marsha", category: "Decouverte", icon: "group" },
		{ id: "position", title: "Ta position", category: "Decouverte", icon: "shield" },
		{ id: "pim-1", title: "PIM Phase 1", category: "Formation", icon: "book" },
		{ id: "pim-2", title: "PIM Phase 2", category: "Formation", icon: "rocket" },
		{ id: "avant", title: "Avant de commencer", category: "Preparation", icon: "info" },
		{ id: "formulaire", title: "Formulaire", category: "Preparation", icon: "edit", showProgress: false },
		{ id: "apres", title: "Et apres ?", category: "Finalisation", icon: "check" },
		{ id: "celebration", title: "Bienvenue !", category: "Finalisation", icon: "sparkles" },
	],
	storageKey: "memora-onboarding-completed",
	triggersTutorial: "hub-welcome",
};

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
