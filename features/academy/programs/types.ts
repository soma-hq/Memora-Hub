import type { BadgeVariant } from "@/core/design/states";
import type { RoleId } from "@/core/config/roles";

// Whether the program enrollment is active, paused, completed, or cancelled
export type ProgramStatus = "pending" | "active" | "paused" | "completed" | "cancelled";

// Phase within a program track
export type ProgramPhase = "onboarding" | "discovery" | "training" | "practice" | "evaluation" | "graduation";

// Accompaniment intensity level
export type AccompanimentLevel = "intensive" | "standard" | "light" | "autonomous";

// Moderation function for track specialization
export type ProgramFunction =
	| "moderation_discord"
	| "moderation_twitch"
	| "moderation_youtube"
	| "moderation_polyvalent"
	| "management"
	| "talent";

// Type of program available
export type ProgramType = "marsha_academy" | "pim_integration" | "skill_upgrade" | "cross_training";

// Defines a program template
export interface ProgramDefinition {
	id: string;
	name: string;
	description: string;
	type: ProgramType;
	defaultDurationDays: number;
	availableTracks: ProgramTrack[];
	prerequisites: ProgramPrerequisite[];
	enrollmentRoles: RoleId[];
	isOpen: boolean;
	banner?: string;
	accentColor: string;
}

// A specific track within a program
export interface ProgramTrack {
	id: string;
	name: string;
	description: string;
	function: ProgramFunction;
	phases: ProgramPhaseDefinition[];
	requiredCompetencies: string[];
	accompanimentLevel: AccompanimentLevel;
	formationIds: string[];
}

// A phase within a track, with milestones
export interface ProgramPhaseDefinition {
	id: string;
	phase: ProgramPhase;
	name: string;
	description: string;
	durationDays: number;
	milestones: ProgramMilestone[];
	accompaniment: AccompanimentConfig;
}

// Specific milestone
export interface ProgramMilestone {
	id: string;
	title: string;
	description: string;
	validationType: "auto" | "mentor" | "manager" | "self";
	required: boolean;
}

// Accompaniment configuration for a program phase
export interface AccompanimentConfig {
	mentorRole: "momentum" | "legacy" | "marsha_teams";
	checkInFrequencyDays: number;
	groupSessions: boolean;
	oneOnOneSessions: boolean;
	trainingSpaceAccess: boolean;
	practiceEnvironmentAccess: boolean;
	dailyStandupInclusion: boolean;
}

// Prerequisite for program enrollment
export interface ProgramPrerequisite {
	type: "role" | "entity_access" | "completedProgram" | "competency";
	value: string;
	description: string;
}

// A user's enrollment in a specific program track
export interface ProgramEnrollment {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	programId: string;
	trackId: string;
	entityId: string;
	status: ProgramStatus;
	currentPhase: ProgramPhase;
	startDate: string;
	expectedEndDate: string;
	actualEndDate?: string;
	mentorId: string;
	mentorName: string;
	milestoneProgress: MilestoneProgress[];
	accompanimentLog: AccompanimentEntry[];
	phaseHistory: PhaseTransition[];
	notes: ProgramNote[];
	progressPercent: number;
}

// Individual milestone progress
export interface MilestoneProgress {
	milestoneId: string;
	completed: boolean;
	completedAt?: string;
	validatedBy?: string;
	notes?: string;
}

// Record of an accompaniment session
export interface AccompanimentEntry {
	id: string;
	type: "checkin" | "one_on_one" | "group_session" | "standup" | "evaluation" | "feedback";
	date: string;
	duration: string;
	participants: string[];
	summary: string;
	nextActions?: string[];
}

// Phase transition record
export interface PhaseTransition {
	fromPhase: ProgramPhase;
	toPhase: ProgramPhase;
	date: string;
	approvedBy: string;
	notes: string;
}

// Note attached to a program enrollment
export interface ProgramNote {
	id: string;
	content: string;
	author: string;
	authorRole: string;
	createdAt: string;
}

// Invitation carrying a program enrollment intent
export interface ProgramInvitation {
	id: string;
	programId: string;
	trackId: string;
	entityId: string;
	inviteeEmail: string;
	inviteeName: string;
	assignedRoleId: RoleId;
	mentorId?: string;
	welcomeMessage?: string;
	expiresAt: string;
	status: "pending" | "accepted" | "expired" | "cancelled";
	createdAt: string;
	createdBy: string;
}

// Training space accessible to program enrollees
export interface TrainingSpace {
	id: string;
	programId: string;
	trackId: string;
	name: string;
	description: string;
	modules: TrainingModule[];
	requiredPhase: ProgramPhase;
	isLocked: boolean;
}

// Module within a training space
export interface TrainingModule {
	id: string;
	title: string;
	description: string;
	type: "document" | "video" | "exercise" | "quiz" | "live_session";
	estimatedMinutes: number;
	contentUrl?: string;
	isCompleted?: boolean;
}

// Badge variant maps
export const programStatusVariantMap: Record<ProgramStatus, BadgeVariant> = {
	pending: "neutral",
	active: "success",
	paused: "warning",
	completed: "primary",
	cancelled: "error",
};

export const programPhaseVariantMap: Record<ProgramPhase, BadgeVariant> = {
	onboarding: "neutral",
	discovery: "info",
	training: "primary",
	practice: "warning",
	evaluation: "info",
	graduation: "success",
};

export const accompanimentLevelVariantMap: Record<AccompanimentLevel, BadgeVariant> = {
	intensive: "error",
	standard: "primary",
	light: "info",
	autonomous: "neutral",
};

// Constants
export const PROGRAM_STATUSES: ProgramStatus[] = ["pending", "active", "paused", "completed", "cancelled"];

export const PROGRAM_PHASES: ProgramPhase[] = [
	"onboarding",
	"discovery",
	"training",
	"practice",
	"evaluation",
	"graduation",
];

export const ACCOMPANIMENT_LEVELS: AccompanimentLevel[] = ["intensive", "standard", "light", "autonomous"];

export const PROGRAM_FUNCTIONS: ProgramFunction[] = [
	"moderation_discord",
	"moderation_twitch",
	"moderation_youtube",
	"moderation_polyvalent",
	"management",
	"talent",
];

export const PROGRAM_TYPES: ProgramType[] = ["marsha_academy", "pim_integration", "skill_upgrade", "cross_training"];

// Labels for program phases
export const PROGRAM_PHASE_LABELS: Record<ProgramPhase, string> = {
	onboarding: "Onboarding",
	discovery: "Decouverte",
	training: "Formation",
	practice: "Pratique",
	evaluation: "Evaluation",
	graduation: "Diplome",
};

// Labels for program functions
export const PROGRAM_FUNCTION_LABELS: Record<ProgramFunction, string> = {
	moderation_discord: "Moderation Discord",
	moderation_twitch: "Moderation Twitch",
	moderation_youtube: "Moderation YouTube",
	moderation_polyvalent: "Moderation Polyvalente",
	management: "Management",
	talent: "Talent & Recrutement",
};

// Labels for accompaniment levels
export const ACCOMPANIMENT_LEVEL_LABELS: Record<AccompanimentLevel, string> = {
	intensive: "Intensif",
	standard: "Standard",
	light: "Allege",
	autonomous: "Autonome",
};

// Labels for program statuses
export const PROGRAM_STATUS_LABELS: Record<ProgramStatus, string> = {
	pending: "En attente",
	active: "En cours",
	paused: "En pause",
	completed: "Termine",
	cancelled: "Annule",
};
