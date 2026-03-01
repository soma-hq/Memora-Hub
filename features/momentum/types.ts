// Constants & types
import type { BadgeVariant } from "@/core/design/states";


/** PIM lifecycle status */
export type PimStatus = "Non débutée" | "En cours" | "En Stand-by" | "Réalisée" | "Annulée";

/** Training track type (intensive or accelerated) */
export type Dispositif = "ATRIA" | "PULSE";

/** Competency acquisition level */
export type CompetencyLevel = "Non acquise" | "Partiellement acquise" | "Acquise";

/** Moderation function specialization */
export type ModerationFunction = "Modération Discord" | "Modération Twitch" | "Modération YouTube";

/** PIM training period */
export type PimPeriod = "Période 1" | "Période 2" | "Période Bonus";

/** Remark polarity */
export type RemarkType = "positive" | "negative";

/** Bilan decision outcome */
export type BilanDecision = "Période suivante accordée" | "Période suivante refusée" | "PIM validée" | "En attente";

/** Role of a note or remark author */
export type AuthorRole = "Responsable" | "Marsha Teams" | "Momentum";

/** PIM session lifecycle status */
export type SessionStatus = "Active" | "Terminée" | "Annulée";

/** Note entry in a junior FSI */
export interface MomentumNote {
	id: string;
	content: string;
	author: string;
	authorRole: AuthorRole;
	createdAt: string;
}

/** Positive or negative remark for a junior */
export interface Remark {
	id: string;
	type: RemarkType;
	content: string;
	author: string;
	authorRole: string;
	juniorNotified: boolean;
	createdAt: string;
}

/** Competency item within a junior FSI */
export interface Competency {
	id: string;
	name: string;
	description: string;
	function: ModerationFunction;
	level: CompetencyLevel;
	evaluatedBy?: string;
	evaluatedAt?: string;
}

/** Period objective unlocked for a junior */
export interface Objective {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	unlockedAt: string;
	period: "Période 2" | "Période Bonus";
}

/** Bilan RRJ entry for a junior period review */
export interface BilanRRJ {
	id: string;
	period: PimPeriod;
	date: string;
	responsable: string;
	referent: string;
	junior: string;
	summary: string;
	decision: BilanDecision;
	createdAt: string;
}

/** Fiche de Suivi Individuel containing all junior tracking data */
export interface FSI {
	id: string;
	juniorId: string;
	referentId: string;
	referentName: string;
	competencies: Competency[];
	objectives: Objective[];
	bilans: BilanRRJ[];
	notes: MomentumNote[];
	remarks: Remark[];
	lastUpdated: string;
}

/** Junior participant in a PIM session */
export interface Junior {
	id: string;
	name: string;
	avatar?: string;
	referent: string;
	dispositif: Dispositif;
	function: ModerationFunction;
	startDate: string;
	pimStatus: PimStatus;
	currentPeriod: PimPeriod;
	fsi: FSI;
}

/** PIM session containing juniors for an entity */
export interface PimSession {
	id: string;
	entity: string;
	entityLogo?: string;
	startDate: string;
	status: SessionStatus;
	juniors: Junior[];
	createdBy: string;
	createdAt: string;
}

/** Training formation with modules */
export interface Formation {
	id: string;
	title: string;
	description: string;
	banner: string;
	category: ModerationFunction;
	dispositif: Dispositif | "Tous";
	duration: string;
	modules: string[];
}

/** Form data for launching a new PIM session */
export interface LaunchSessionFormData {
	entity: string;
	startDate: string;
}

/** Badge variant mapping for PIM statuses */
export const pimStatusVariantMap: Record<PimStatus, BadgeVariant> = {
	"Non débutée": "neutral",
	"En cours": "warning",
	"En Stand-by": "info",
	Réalisée: "success",
	Annulée: "error",
};

/** Badge variant mapping for dispositif types */
export const dispositifVariantMap: Record<Dispositif, BadgeVariant> = {
	ATRIA: "primary",
	PULSE: "info",
};

/** Badge variant mapping for competency levels */
export const competencyLevelVariantMap: Record<CompetencyLevel, BadgeVariant> = {
	"Non acquise": "error",
	"Partiellement acquise": "warning",
	Acquise: "success",
};

/** Badge variant mapping for session statuses */
export const sessionStatusVariantMap: Record<SessionStatus, BadgeVariant> = {
	Active: "success",
	Terminée: "neutral",
	Annulée: "error",
};

/** Badge variant mapping for remark types */
export const remarkTypeVariantMap: Record<RemarkType, BadgeVariant> = {
	positive: "success",
	negative: "error",
};

/** Badge variant mapping for PIM periods */
export const periodVariantMap: Record<PimPeriod, BadgeVariant> = {
	"Période 1": "primary",
	"Période 2": "info",
	"Période Bonus": "warning",
};

/** All available PIM statuses */
export const PIM_STATUSES: PimStatus[] = ["Non débutée", "En cours", "En Stand-by", "Réalisée", "Annulée"];

/** All available dispositif types */
export const DISPOSITIFS: Dispositif[] = ["ATRIA", "PULSE"];

/** All available competency levels */
export const COMPETENCY_LEVELS: CompetencyLevel[] = ["Non acquise", "Partiellement acquise", "Acquise"];

/** All available moderation functions */
export const MODERATION_FUNCTIONS: ModerationFunction[] = [
	"Modération Discord",
	"Modération Twitch",
	"Modération YouTube",
];

/** All available PIM periods */
export const PIM_PERIODS: PimPeriod[] = ["Période 1", "Période 2", "Période Bonus"];

/** Dispositif descriptions for display */
export const DISPOSITIF_INFO: Record<Dispositif, { label: string; description: string }> = {
	ATRIA: {
		label: "ATRIA",
		description:
			"Parcours intensif et encadré. Le Junior ne connaît pas la modération — accompagnement complet depuis les bases.",
	},
	PULSE: {
		label: "PULSE",
		description:
			"Parcours allégé et autonome. Le Junior connaît déjà la modération mais doit s'adapter à nos modes opératoires.",
	},
};
