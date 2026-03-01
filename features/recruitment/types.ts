import type { BadgeVariant } from "@/core/design/states";


/** Available recruitment session types */
export type RecruitmentSessionType =
	| "Modération Discord"
	| "Modération Twitch"
	| "Modération YouTube"
	| "Clipper"
	| "Autre";

/** Recruitment session lifecycle status */
export type RecruitmentSessionStatus = "Active" | "Terminée" | "Annulée";

/** All possible candidate decisions across roles */
export type CandidateDecision = "Favorable" | "Défavorable" | "Accepté" | "Refusé" | "En attente";

/** Decisions available to Talent role only (Favorable/Defavorable) */
export type TalentDecision = "Favorable" | "Défavorable";

/** Decisions available to Legacy and Marsha roles (Accepte/Refuse) */
export type LeaderDecision = "Accepté" | "Refusé";

/** Role of the person submitting an avis */
export type AvisAuthorRole = "Talent" | "Marsha" | "Legacy";

/** Profile types a consigne can target */
export type ConsigneProfileType =
	| "Modération Discord"
	| "Modération Twitch"
	| "Modération YouTube"
	| "Clipper"
	| "Tous";

/** Review submitted by a recruiter for a candidate */
export interface CandidateAvis {
	id: string;
	author: string;
	authorRole: AvisAuthorRole;
	decision: CandidateDecision;
	comment?: string;
	createdAt: string;
}

/** Candidate in a recruitment session */
export interface Candidate {
	id: string;
	name: string;
	avatar?: string;
	formId: string;
	sessionId: string;
	interviewDate?: string;
	interviewTime?: string;
	recruiter: string;
	spectators: string[];
	avis: CandidateAvis[];
	finalDecision?: CandidateDecision;
	candidature: string;
	notes?: string;
}

/** Recruitment session containing candidates */
export interface RecruitmentSession {
	id: string;
	type: RecruitmentSessionType;
	entity: string;
	startDate: string;
	endDate?: string;
	status: RecruitmentSessionStatus;
	candidates: Candidate[];
	createdBy: string;
}

/** Stage in the interview questionnaire */
export interface QuestionnaireStage {
	id: string;
	number: 1 | 2 | 3 | 4;
	title: string;
	objective: string;
	description: string;
	questions: string[];
	tips: string[];
}

/** Instruction from leadership for recruiters */
export interface Consigne {
	id: string;
	author: string;
	authorRole: AvisAuthorRole;
	content: string;
	profileType: ConsigneProfileType;
	createdAt: string;
}

/** Aggregated stats for a recruiter dashboard */
export interface RecruiterStats {
	totalCandidates: number;
	favorable: number;
	unfavorable: number;
	pending: number;
	todayInterviews: number;
}

/** Form data for creating a new recruitment session */
export interface RecruitmentSessionFormData {
	type: RecruitmentSessionType;
	entity: string;
	startDate: string;
}

/** Badge variant mapping for candidate decisions */
export const decisionVariantMap: Record<CandidateDecision, BadgeVariant> = {
	Favorable: "success",
	Défavorable: "error",
	Accepté: "primary",
	Refusé: "error",
	"En attente": "warning",
};

/** Badge variant mapping for session statuses */
export const sessionStatusVariantMap: Record<RecruitmentSessionStatus, BadgeVariant> = {
	Active: "success",
	Terminée: "neutral",
	Annulée: "error",
};

/** Badge variant mapping for avis author roles */
export const avisRoleVariantMap: Record<AvisAuthorRole, BadgeVariant> = {
	Talent: "info",
	Marsha: "primary",
	Legacy: "warning",
};

/** Badge variant mapping for session types */
export const sessionTypeVariantMap: Record<RecruitmentSessionType, BadgeVariant> = {
	"Modération Discord": "primary",
	"Modération Twitch": "info",
	"Modération YouTube": "error",
	Clipper: "warning",
	Autre: "neutral",
};

/** All available recruitment session types */
export const RECRUITMENT_SESSION_TYPES: RecruitmentSessionType[] = [
	"Modération Discord",
	"Modération Twitch",
	"Modération YouTube",
	"Clipper",
	"Autre",
];

/** All available recruitment session statuses */
export const RECRUITMENT_SESSION_STATUSES: RecruitmentSessionStatus[] = ["Active", "Terminée", "Annulée"];

/** All available candidate decisions */
export const CANDIDATE_DECISIONS: CandidateDecision[] = ["Favorable", "Défavorable", "Accepté", "Refusé", "En attente"];

/** Decisions restricted to the Talent role */
export const TALENT_DECISIONS: TalentDecision[] = ["Favorable", "Défavorable"];

/** Decisions restricted to Legacy and Marsha roles */
export const LEADER_DECISIONS: LeaderDecision[] = ["Accepté", "Refusé"];

/** All available avis author roles */
export const AVIS_AUTHOR_ROLES: AvisAuthorRole[] = ["Talent", "Marsha", "Legacy"];

/** All available consigne profile types */
export const CONSIGNE_PROFILE_TYPES: ConsigneProfileType[] = [
	"Modération Discord",
	"Modération Twitch",
	"Modération YouTube",
	"Clipper",
	"Tous",
];
