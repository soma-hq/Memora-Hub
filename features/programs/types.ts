// Constants & types
import type { BadgeVariant } from "@/core/design/states";
import type { RoleId } from "@/core/config/roles";

// ---------------------------------------------------------------------------
// Program lifecycle statuses
// ---------------------------------------------------------------------------

/** Whether the program enrollment is active, paused, completed, or cancelled */
export type ProgramStatus = "pending" | "active" | "paused" | "completed" | "cancelled";

/** Phase within a program track */
export type ProgramPhase = "onboarding" | "discovery" | "training" | "practice" | "evaluation" | "graduation";

/** Accompaniment intensity level */
export type AccompanimentLevel = "intensive" | "standard" | "light" | "autonomous";

/** Moderation function for track specialization */
export type ProgramFunction =
	| "moderation_discord"
	| "moderation_twitch"
	| "moderation_youtube"
	| "moderation_polyvalent"
	| "management"
	| "talent";

/** Type of program available */
export type ProgramType = "marsha_academy" | "pim_integration" | "skill_upgrade" | "cross_training";

// ---------------------------------------------------------------------------
// Core program structures
// ---------------------------------------------------------------------------

/** Defines a program template (e.g., "Marsha Academy") */
export interface ProgramDefinition {
	id: string;
	name: string;
	description: string;
	type: ProgramType;
	/** Default duration in days */
	defaultDurationDays: number;
	/** Available function tracks */
	availableTracks: ProgramTrack[];
	/** Prerequisites to enroll */
	prerequisites: ProgramPrerequisite[];
	/** Who can enroll people in this program */
	enrollmentRoles: RoleId[];
	/** Whether the program is open for new enrollments */
	isOpen: boolean;
	/** Banner image for the program listing */
	banner?: string;
	/** Color accent for UI */
	accentColor: string;
}

/** A specific track within a program */
export interface ProgramTrack {
	id: string;
	name: string;
	description: string;
	function: ProgramFunction;
	/** Phases in order */
	phases: ProgramPhaseDefinition[];
	/** Required competencies to complete */
	requiredCompetencies: string[];
	/** Accompaniment level for this track */
	accompanimentLevel: AccompanimentLevel;
	/** Dedicated formations */
	formationIds: string[];
}

/** A phase within a track, with milestones */
export interface ProgramPhaseDefinition {
	id: string;
	phase: ProgramPhase;
	name: string;
	description: string;
	/** Duration in days for this phase */
	durationDays: number;
	/** Milestones the enrollee must hit */
	milestones: ProgramMilestone[];
	/** Accompaniment specifics for this phase */
	accompaniment: AccompanimentConfig;
}

/** Specific milestone within a phase */
export interface ProgramMilestone {
	id: string;
	title: string;
	description: string;
	/** Type of validation */
	validationType: "auto" | "mentor" | "manager" | "self";
	/** Is it blocking for phase progression */
	required: boolean;
}

/** Accompaniment configuration for a program phase */
export interface AccompanimentConfig {
	/** Designated mentor/referent role */
	mentorRole: "momentum" | "legacy" | "marsha_teams";
	/** Check-in frequency in days */
	checkInFrequencyDays: number;
	/** Whether group sessions are scheduled */
	groupSessions: boolean;
	/** Whether 1-on-1 sessions are scheduled */
	oneOnOneSessions: boolean;
	/** Access to dedicated training spaces */
	trainingSpaceAccess: boolean;
	/** Access to practice environments */
	practiceEnvironmentAccess: boolean;
	/** Daily standup inclusion */
	dailyStandupInclusion: boolean;
}

/** Prerequisite for program enrollment */
export interface ProgramPrerequisite {
	type: "role" | "entity_access" | "completedProgram" | "competency";
	value: string;
	description: string;
}

// ---------------------------------------------------------------------------
// Enrollment (runtime state)
// ---------------------------------------------------------------------------

/** A user's enrollment in a specific program track */
export interface ProgramEnrollment {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	programId: string;
	trackId: string;
	/** Assigned entity context */
	entityId: string;
	/** Current program status */
	status: ProgramStatus;
	/** Current phase */
	currentPhase: ProgramPhase;
	/** Enrollment dates */
	startDate: string;
	expectedEndDate: string;
	actualEndDate?: string;
	/** Assigned mentor */
	mentorId: string;
	mentorName: string;
	/** Milestone completion tracking */
	milestoneProgress: MilestoneProgress[];
	/** Accompaniment log */
	accompanimentLog: AccompanimentEntry[];
	/** Phase transitions history */
	phaseHistory: PhaseTransition[];
	/** Notes from mentors/managers */
	notes: ProgramNote[];
	/** Overall progress percentage (0-100) */
	progressPercent: number;
}

/** Individual milestone progress */
export interface MilestoneProgress {
	milestoneId: string;
	completed: boolean;
	completedAt?: string;
	validatedBy?: string;
	notes?: string;
}

/** Record of an accompaniment session */
export interface AccompanimentEntry {
	id: string;
	type: "checkin" | "one_on_one" | "group_session" | "standup" | "evaluation" | "feedback";
	date: string;
	duration: string;
	participants: string[];
	summary: string;
	nextActions?: string[];
}

/** Phase transition record */
export interface PhaseTransition {
	fromPhase: ProgramPhase;
	toPhase: ProgramPhase;
	date: string;
	approvedBy: string;
	notes: string;
}

/** Note attached to a program enrollment */
export interface ProgramNote {
	id: string;
	content: string;
	author: string;
	authorRole: string;
	createdAt: string;
}

// ---------------------------------------------------------------------------
// Invitation with program context
// ---------------------------------------------------------------------------

/** Invitation carrying a program enrollment intent */
export interface ProgramInvitation {
	id: string;
	programId: string;
	trackId: string;
	entityId: string;
	/** Invited user info */
	inviteeEmail: string;
	inviteeName: string;
	/** Assigned role on join */
	assignedRoleId: RoleId;
	/** Mentor pre-assigned */
	mentorId?: string;
	/** Custom welcome message */
	welcomeMessage?: string;
	/** Expiration */
	expiresAt: string;
	/** State */
	status: "pending" | "accepted" | "expired" | "cancelled";
	createdAt: string;
	createdBy: string;
}

// ---------------------------------------------------------------------------
// Training space (placeholder for future content)
// ---------------------------------------------------------------------------

/** Training space accessible to program enrollees */
export interface TrainingSpace {
	id: string;
	programId: string;
	trackId: string;
	name: string;
	description: string;
	/** Ordered modules/resources */
	modules: TrainingModule[];
	/** Access rules */
	requiredPhase: ProgramPhase;
	isLocked: boolean;
}

/** Module within a training space */
export interface TrainingModule {
	id: string;
	title: string;
	description: string;
	type: "document" | "video" | "exercise" | "quiz" | "live_session";
	/** Duration estimate */
	estimatedMinutes: number;
	/** External content URL (future) */
	contentUrl?: string;
	/** Completion tracking */
	isCompleted?: boolean;
}

// ---------------------------------------------------------------------------
// Badge variant maps (for UI)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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

/** Labels for program phases */
export const PROGRAM_PHASE_LABELS: Record<ProgramPhase, string> = {
	onboarding: "Onboarding",
	discovery: "Decouverte",
	training: "Formation",
	practice: "Pratique",
	evaluation: "Evaluation",
	graduation: "Diplome",
};

/** Labels for program functions */
export const PROGRAM_FUNCTION_LABELS: Record<ProgramFunction, string> = {
	moderation_discord: "Moderation Discord",
	moderation_twitch: "Moderation Twitch",
	moderation_youtube: "Moderation YouTube",
	moderation_polyvalent: "Moderation Polyvalente",
	management: "Management",
	talent: "Talent & Recrutement",
};

/** Labels for accompaniment levels */
export const ACCOMPANIMENT_LEVEL_LABELS: Record<AccompanimentLevel, string> = {
	intensive: "Intensif",
	standard: "Standard",
	light: "Allege",
	autonomous: "Autonome",
};

/** Labels for program statuses */
export const PROGRAM_STATUS_LABELS: Record<ProgramStatus, string> = {
	pending: "En attente",
	active: "En cours",
	paused: "En pause",
	completed: "Termine",
	cancelled: "Annule",
};
