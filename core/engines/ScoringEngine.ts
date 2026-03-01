import { DatabaseManager } from "@/managers/DatabaseManager";


export interface ScoringCriteria {
	requiredSkills: string[];
	preferredSkills: string[];
	experienceWeight: number;
	skillMatchWeight: number;
}

export interface ScoringResult {
	candidateId: string;
	score: number;
	breakdown: {
		skillMatch: number;
		experience: number;
		overall: number;
	};
}

export class ScoringEngine {
	/**
	 * Calculates a relevance score for a candidate based on configured criteria
	 * @param candidateId - The candidate to score
	 * @param criteria - Scoring configuration with weights and required skills
	 * @returns Scoring result with breakdown
	 */
	static async score(candidateId: string, criteria: ScoringCriteria): Promise<ScoringResult> {
		// Use DatabaseManager to fetch candidate
		const candidate = await DatabaseManager.findCandidateById(candidateId);
		if (!candidate) throw new Error(`Candidate ${candidateId} not found`);

		const notes = candidate.notes ?? "";
		const requiredMatches = criteria.requiredSkills.filter((s) =>
			notes.toLowerCase().includes(s.toLowerCase()),
		).length;
		const preferredMatches = criteria.preferredSkills.filter((s) =>
			notes.toLowerCase().includes(s.toLowerCase()),
		).length;
		const skillMatch =
			criteria.requiredSkills.length > 0 ? (requiredMatches / criteria.requiredSkills.length) * 100 : 0;
		const experience =
			criteria.preferredSkills.length > 0 ? (preferredMatches / criteria.preferredSkills.length) * 100 : 0;
		const overall =
			(skillMatch * criteria.skillMatchWeight + experience * criteria.experienceWeight) /
			(criteria.skillMatchWeight + criteria.experienceWeight);

		return {
			candidateId,
			score: Math.round(overall),
			breakdown: {
				skillMatch: Math.round(skillMatch),
				experience: Math.round(experience),
				overall: Math.round(overall),
			},
		};
	}
}
