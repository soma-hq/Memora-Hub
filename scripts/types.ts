/** Represents a single step in an interactive tutorial script */
export interface TutorialStep {
	/** Unique step identifier */
	id: string;
	/** CSS selector for the element to spotlight */
	targetSelector: string;
	/** Title displayed in the tooltip */
	title: string;
	/** Description displayed in the tooltip */
	description: string;
	/** Position of the tooltip relative to the spotlight */
	placement: "top" | "bottom" | "left" | "right";
	/** Optional action label for the "next" button override */
	nextLabel?: string;
	/** Optional URL to navigate to before showing this step */
	navigateTo?: string;
	/** Minimum role required to see this step (skip if user lacks permission) */
	requiredRole?: "Owner" | "Admin" | "Manager" | "Moderator" | "Junior" | "Guest";
	/** Optional delay in ms before showing the step (for page transitions) */
	delay?: number;
}

/** Configuration for a complete tutorial script */
export interface TutorialScript {
	/** Unique script identifier */
	id: string;
	/** Script display name */
	name: string;
	/** Script description */
	description: string;
	/** Ordered list of tutorial steps */
	steps: TutorialStep[];
	/** LocalStorage key for tracking completion */
	storageKey: string;
}

/** Represents a single step in the onboarding flow */
export interface OnboardingStep {
	/** Unique step identifier */
	id: string;
	/** Step display title */
	title: string;
	/** Step category label shown above title */
	category?: string;
	/** Step icon name */
	icon?: string;
	/** Whether to show the progress bar */
	showProgress?: boolean;
}

/** Configuration for an onboarding script */
export interface OnboardingScript {
	/** Unique script identifier */
	id: string;
	/** Script display name */
	name: string;
	/** Ordered list of onboarding steps */
	steps: OnboardingStep[];
	/** LocalStorage key for completion tracking */
	storageKey: string;
	/** Tutorial script ID to trigger after completion */
	triggersTutorial?: string;
}
