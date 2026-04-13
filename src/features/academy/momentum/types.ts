// Constants & types — Momentum ecosystem
// Voir COMMENTARIES.md pour la documentation fonctionnelle complète.

import type { BadgeVariant } from "@/core/design/states";

// ─── Enums & unions ────────────────────────────────────────────────────────────

/** Statut du cycle de vie d'une PIM */
export type PimStatus = "Non débutée" | "En cours" | "En Stand-by" | "Réalisée" | "Annulée";

/** Type de parcours selon l'expérience du Junior */
export type Dispositif = "ATRIA" | "PULSE";

/** Niveau d'acquisition d'une compétence */
export type CompetencyLevel = "Non acquise" | "Partiellement acquise" | "Acquise";

/**
 * Fonction de modération du Junior.
 * Couple toujours avec une entité pour déterminer les compétences évaluées.
 */
export type ModerationFunction =
	| "Modération Discord"
	| "Modération Twitch"
	| "Modération YouTube"
	| "Modération Polyvalente";

/** Période de la PIM en cours */
export type PimPeriod = "Période 1" | "Période 2" | "Période Bonus";

/** Polarité d'une remarque */
export type RemarkType = "positive" | "negative";

/** Décision issue d'un bilan de période */
export type BilanDecision = "Période suivante accordée" | "Période suivante refusée" | "PIM validée" | "En attente";

/** Rôle de l'auteur d'une note ou remarque */
export type AuthorRole = "Responsable" | "Marsha Teams" | "Momentum" | "Référent";

/** Statut du cycle de vie d'une session PIM */
export type SessionStatus = "Active" | "Terminée" | "Annulée";

/** Type d'événement dans le calendrier Momentum */
export type CalendarEventType =
	| "formation"
	| "integration"
	| "vocal_rrj"
	| "vocal_rj"
	| "vocal_rr"
	| "live_participation";

/** Statut d'une formation autonome */
export type FormationStatus = "not_started" | "in_progress" | "completed";

// ─── Sub-entities ──────────────────────────────────────────────────────────────

/** Note interne dans la FSI d'un Junior */
export interface MomentumNote {
	id: string;
	content: string;
	author: string;
	authorRole: AuthorRole;
	createdAt: string;
}

/** Remarque positive ou négative horodatée */
export interface Remark {
	id: string;
	type: RemarkType;
	content: string;
	author: string;
	authorRole: string;
	juniorNotified: boolean;
	createdAt: string;
}

/**
 * Compétence évaluée dans la FSI d'un Junior.
 * Liée à une fonction de modération ET à un dispositif (ATRIA / PULSE).
 */
export interface Competency {
	id: string;
	name: string;
	description: string;
	category: "technique" | "sociale" | "professionnelle";
	function: ModerationFunction;
	dispositif: Dispositif | "Tous";
	level: CompetencyLevel;
	evaluatedBy?: string;
	evaluatedAt?: string;
}

/** Objectif débloqué pour une période donnée */
export interface Objective {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	unlockedAt: string;
	period: "Période 2" | "Période Bonus";
}

/** Bilan écrit de période (RRJ) */
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

/**
 * Live auquel le Junior a participé.
 * Permet de tracer les lives par période pour Twitch / YouTube.
 */
export interface LiveParticipation {
	id: string;
	entityId: string;
	date: string;
	platform: "Twitch" | "YouTube";
	period: PimPeriod;
	durationMinutes: number;
	referentNote?: string;
}

/** Événement dans le calendrier Momentum de l'entité */
export interface MomentumCalendarEvent {
	id: string;
	type: CalendarEventType;
	title: string;
	description?: string;
	date: string;
	startTime?: string;
	endTime?: string;
	entityId: string;
	/** IDs des participants (Juniors, Référents, Momentum…) */
	participantIds: string[];
	juniorId?: string;
	createdBy: string;
	createdAt: string;
}

// ─── FSI ───────────────────────────────────────────────────────────────────────

/**
 * Fiche de Suivi Individuel — document central du parcours d'un Junior.
 * Toutes les données de progression sont stockées ici.
 */
export interface FSI {
	id: string;
	juniorId: string;
	referentId: string;
	referentName: string;
	competencies: Competency[];
	objectives: Objective[];
	bilans: BilanRRJ[];
	liveParticipations: LiveParticipation[];
	notes: MomentumNote[];
	remarks: Remark[];
	lastUpdated: string;
}

// ─── Entities ──────────────────────────────────────────────────────────────────

/**
 * Junior participant à une PIM.
 * Toujours affilié à une entité ET une fonction de modération.
 */
export interface Junior {
	id: string;
	name: string;
	avatar?: string;
	/** ID du référent assigné au Junior */
	referentId: string;
	referentName: string;
	dispositif: Dispositif;
	/** Fonction de modération — détermine les compétences évaluées */
	function: ModerationFunction;
	/** Entité à laquelle est rattachée la PIM */
	entityId: string;
	entityName: string;
	startDate: string;
	pimStatus: PimStatus;
	currentPeriod: PimPeriod;
	fsi: FSI;
}

/**
 * Session PIM — regroupe des Juniors pour une entité donnée.
 * Toujours affiliée à une entité unique.
 */
export interface PimSession {
	id: string;
	entityId: string;
	entityName: string;
	entityLogo?: string;
	startDate: string;
	status: SessionStatus;
	juniors: Junior[];
	createdBy: string;
	createdAt: string;
}

/**
 * Module de formation autonome.
 * Filtré selon l'entité, la fonction et le dispositif du Junior.
 */
export interface Formation {
	id: string;
	title: string;
	description: string;
	/** Chemin vers la bannière de l'entité concernée */
	banner: string;
	entityId: string | "global";
	function: ModerationFunction | "Toutes";
	dispositif: Dispositif | "Tous";
	durationMinutes: number;
	modules: string[];
	status?: FormationStatus;
}

/** Données de formulaire pour le lancement d'une session PIM */
export interface LaunchSessionFormData {
	entityId: string;
	entityName: string;
	startDate: string;
}

/**
 * Métadonnées PIM dans une invitation.
 * Transmises lors de la création d'un lien d'invitation avec PIM activée.
 */
export interface PimInvitationData {
	pimEnabled: true;
	entityId: string;
	function: ModerationFunction;
	dispositif: Dispositif;
	referentId?: string;
}

// ─── Template de compétences ───────────────────────────────────────────────────

/** Définition d'une compétence dans un template (avant assignation à un Junior) */
export interface CompetencyTemplate {
	id: string;
	name: string;
	description: string;
	category: "technique" | "sociale" | "professionnelle";
	function: ModerationFunction;
	dispositif: Dispositif | "Tous";
}

// ─── Badge variant maps ────────────────────────────────────────────────────────

/** Variants de badge pour les statuts PIM */
export const pimStatusVariantMap: Record<PimStatus, BadgeVariant> = {
	"Non débutée": "neutral",
	"En cours": "warning",
	"En Stand-by": "info",
	Réalisée: "success",
	Annulée: "error",
};

/** Variants de badge pour les dispositifs */
export const dispositifVariantMap: Record<Dispositif, BadgeVariant> = {
	ATRIA: "primary",
	PULSE: "info",
};

/** Variants de badge pour les niveaux de compétences */
export const competencyLevelVariantMap: Record<CompetencyLevel, BadgeVariant> = {
	"Non acquise": "error",
	"Partiellement acquise": "warning",
	Acquise: "success",
};

/** Variants de badge pour les statuts de session */
export const sessionStatusVariantMap: Record<SessionStatus, BadgeVariant> = {
	Active: "success",
	Terminée: "neutral",
	Annulée: "error",
};

/** Variants de badge pour les remarques */
export const remarkTypeVariantMap: Record<RemarkType, BadgeVariant> = {
	positive: "success",
	negative: "error",
};

/** Variants de badge pour les périodes PIM */
export const periodVariantMap: Record<PimPeriod, BadgeVariant> = {
	"Période 1": "primary",
	"Période 2": "info",
	"Période Bonus": "warning",
};

/** Variants de badge pour les types d'événements calendrier */
export const calendarEventTypeVariantMap: Record<CalendarEventType, BadgeVariant> = {
	formation: "primary",
	integration: "info",
	vocal_rrj: "warning",
	vocal_rj: "neutral",
	vocal_rr: "neutral",
	live_participation: "success",
};

// ─── Listes de constantes ──────────────────────────────────────────────────────

export const PIM_STATUSES: PimStatus[] = ["Non débutée", "En cours", "En Stand-by", "Réalisée", "Annulée"];
export const DISPOSITIFS: Dispositif[] = ["ATRIA", "PULSE"];
export const COMPETENCY_LEVELS: CompetencyLevel[] = ["Non acquise", "Partiellement acquise", "Acquise"];
export const MODERATION_FUNCTIONS: ModerationFunction[] = [
	"Modération Discord",
	"Modération Twitch",
	"Modération YouTube",
	"Modération Polyvalente",
];
export const PIM_PERIODS: PimPeriod[] = ["Période 1", "Période 2", "Période Bonus"];

// ─── Descriptions textuelles ───────────────────────────────────────────────────

/** Descriptions des dispositifs affichées dans l'UI */
export const DISPOSITIF_INFO: Record<Dispositif, { label: string; description: string; accentColor: string }> = {
	ATRIA: {
		label: "ATRIA",
		description:
			"Parcours intensif et encadré. Le Junior ne connaît pas la modération — accompagnement complet depuis les bases.",
		accentColor: "primary",
	},
	PULSE: {
		label: "PULSE",
		description:
			"Parcours allégé et autonome. Le Junior connaît déjà la modération mais doit s'adapter à nos modes opératoires.",
		accentColor: "info",
	},
};

/** Labels affichables pour les types d'événements calendrier */
export const CALENDAR_EVENT_LABELS: Record<CalendarEventType, string> = {
	formation: "Session de formation",
	integration: "Session d'intégration",
	vocal_rrj: "Vocal bilan RRJ",
	vocal_rj: "Vocal RJ",
	vocal_rr: "Vocal RR",
	live_participation: "Participation live",
};
