/** Represents a single step in the interactive tutorial */
export interface TutorialStep {
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
}
