// Constants & types
import type { PimSession, Formation, Competency } from "./types";


/** Competency templates grouped by moderation function */
export const COMPETENCY_TEMPLATES: Record<string, Omit<Competency, "id" | "level" | "evaluatedBy" | "evaluatedAt">[]> =
	{};

/**
 * Generates competency entries from templates with optional level overrides
 * @param func - Moderation function to generate competencies for
 * @param overrides - Optional overrides keyed by competency name
 * @returns Array of fully hydrated competency objects
 */
export function generateCompetencies(
	func: "Moderation Discord" | "Moderation Twitch" | "Moderation YouTube",
	overrides: Partial<Record<string, { level: Competency["level"]; evaluatedBy?: string; evaluatedAt?: string }>>,
): Competency[] {
	const templates = COMPETENCY_TEMPLATES[func];
	if (!templates) return [];
	return templates.map((t, i) => {
		const override = overrides[t.name];
		return {
			id: `comp-${func.replace(/\s/g, "").toLowerCase()}-${i}`,
			...t,
			level: override?.level ?? "Non acquise",
			evaluatedBy: override?.evaluatedBy,
			evaluatedAt: override?.evaluatedAt,
		};
	});
}

/** PIM sessions array */
export const sessions: PimSession[] = [];

/** Training formations array */
export const formations: Formation[] = [];
