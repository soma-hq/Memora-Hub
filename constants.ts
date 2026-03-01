// Application metadata
export const APP_NAME = "Memora Hub";
export const APP_VERSION = "0.1.0";
export const APP_DESCRIPTION = "Plateforme de gestion multi-entité";

// Pagination
export const PAGINATION = {
	DEFAULT_PAGE_SIZE: 10,
	PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// File upload
export const FILE_UPLOAD = {
	MAX_SIZE_MB: 5,
	MAX_SIZE_BYTES: 5 * 1024 * 1024,
	ACCEPTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
	ACCEPTED_DOCUMENT_TYPES: [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	],
} as const;

// Date formats
export const DATE_FORMATS = {
	SHORT: "dd/MM/yyyy",
	LONG: "d MMMM yyyy",
	WITH_TIME: "dd/MM/yyyy HH:mm",
	TIME_ONLY: "HH:mm",
	MONTH_YEAR: "MMMM yyyy",
} as const;

// Storage keys
export const STORAGE_KEYS = {
	THEME: "memora-theme",
	LOCALE: "memora-locale",
	SIDEBAR_COLLAPSED: "memora-sidebar-collapsed",
	ACTIVE_GROUP: "memora-active-group",
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
	SM: 640,
	MD: 768,
	LG: 1024,
	XL: 1280,
	"2XL": 1536,
} as const;

// User roles
export const UserRoles = {
	Owner: "Owner",
	Admin: "Admin",
	Manager: "Manager",
	Collaborator: "Collaborator",
	Guest: "Guest",
} as const;

/**
 * Union type of user role values
 */
export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

// User account statuses
export const UserStatus = {
	Active: "active",
	Inactive: "inactive",
} as const;

/**
 * Union type of user status values
 */
export type UserStatusValue = (typeof UserStatus)[keyof typeof UserStatus];

// Group statuses
export const GroupStatus = {
	Active: "active",
	Inactive: "inactive",
} as const;

/**
 * Union type of group status values
 */
export type GroupStatusValue = (typeof GroupStatus)[keyof typeof GroupStatus];

// Task statuses
export const TaskStatus = {
	Todo: "todo",
	InProgress: "in_progress",
	Done: "done",
} as const;

/**
 * Union type of task status values
 */
export type TaskStatusValue = (typeof TaskStatus)[keyof typeof TaskStatus];

// Task status display labels
export const TaskStatusLabel: Record<TaskStatusValue, string> = {
	todo: "A faire",
	in_progress: "En cours",
	done: "Terminé",
} as const;

// Task priorities
export const TaskPriority = {
	High: "high",
	Medium: "medium",
	Low: "low",
} as const;

/**
 * Union type of task priority values
 */
export type TaskPriorityValue = (typeof TaskPriority)[keyof typeof TaskPriority];

// Task priority display labels
export const TaskPriorityLabel: Record<TaskPriorityValue, string> = {
	high: "Haute",
	medium: "Moyenne",
	low: "Basse",
} as const;

// Project statuses
export const ProjectStatus = {
	Todo: "todo",
	InProgress: "in_progress",
	Paused: "paused",
	Done: "done",
	Complete: "complete",
	Archived: "archived",
} as const;

/**
 * Union type of project status values
 */
export type ProjectStatusValue = (typeof ProjectStatus)[keyof typeof ProjectStatus];

// Project status display labels
export const ProjectStatusLabel: Record<ProjectStatusValue, string> = {
	todo: "A faire",
	in_progress: "En cours",
	paused: "En pause",
	done: "Terminé",
	complete: "Complété",
	archived: "Archivé",
} as const;

// Absence types
export const AbsenceType = {
	CongePaye: "conge_paye",
	RTT: "rtt",
	Maladie: "maladie",
	Autre: "autre",
} as const;

/**
 * Union type of absence type values
 */
export type AbsenceTypeValue = (typeof AbsenceType)[keyof typeof AbsenceType];

// Absence type display labels
export const AbsenceTypeLabel: Record<AbsenceTypeValue, string> = {
	conge_paye: "Congé payé",
	rtt: "RTT",
	maladie: "Maladie",
	autre: "Autre",
} as const;

// Absence statuses
export const AbsenceStatus = {
	Pending: "pending",
	Approved: "approved",
	Rejected: "rejected",
} as const;

/**
 * Union type of absence status values
 */
export type AbsenceStatusValue = (typeof AbsenceStatus)[keyof typeof AbsenceStatus];

// Absence status display labels
export const AbsenceStatusLabel: Record<AbsenceStatusValue, string> = {
	pending: "En attente",
	approved: "Approuvé",
	rejected: "Refusé",
} as const;

// Absence acknowledgment statuses (personnel workflow)
export const AbsenceAcknowledgmentStatus = {
	Pending: "pending",
	Received: "received",
	Acknowledged: "acknowledged",
} as const;

/**
 * Union type of absence acknowledgment status values
 */
export type AbsenceAcknowledgmentStatusValue =
	(typeof AbsenceAcknowledgmentStatus)[keyof typeof AbsenceAcknowledgmentStatus];

// Absence acknowledgment status display labels
export const AbsenceAcknowledgmentStatusLabel: Record<AbsenceAcknowledgmentStatusValue, string> = {
	pending: "En attente",
	received: "Réceptionnée",
	acknowledged: "Prise en compte",
} as const;

// Meeting types
export const MeetingType = {
	Reunion: "reunion",
	Standup: "standup",
	Revue: "revue",
	Retrospective: "retrospective",
	Entretien: "entretien",
} as const;

/**
 * Union type of meeting type values
 */
export type MeetingTypeValue = (typeof MeetingType)[keyof typeof MeetingType];

// Meeting type display labels
export const MeetingTypeLabel: Record<MeetingTypeValue, string> = {
	reunion: "Réunion",
	standup: "Standup",
	revue: "Revue",
	retrospective: "Rétrospective",
	entretien: "Entretien",
} as const;

// Notification types
export const NotificationType = {
	Task: "task",
	Meeting: "meeting",
	Absence: "absence",
	Project: "project",
	System: "system",
} as const;

/**
 * Union type of notification type values
 */
export type NotificationTypeValue = (typeof NotificationType)[keyof typeof NotificationType];

// Audit log actions
export const LogAction = {
	Create: "CREATE",
	Update: "UPDATE",
	Delete: "DELETE",
	Login: "LOGIN",
	Logout: "LOGOUT",
	Approve: "APPROVE",
	Reject: "REJECT",
} as const;

/**
 * Union type of log action values
 */
export type LogActionValue = (typeof LogAction)[keyof typeof LogAction];

// Job offer statuses
export const OfferStatus = {
	Open: "open",
	Paused: "paused",
	Closed: "closed",
} as const;

/**
 * Union type of offer status values
 */
export type OfferStatusValue = (typeof OfferStatus)[keyof typeof OfferStatus];

// Candidate pipeline statuses
export const CandidateStatus = {
	New: "new",
	Interview: "interview",
	Finalist: "finalist",
	Hired: "hired",
	Rejected: "rejected",
} as const;

/**
 * Union type of candidate status values
 */
export type CandidateStatusValue = (typeof CandidateStatus)[keyof typeof CandidateStatus];

// Contract types
export const ContractType = {
	CDI: "cdi",
	CDD: "cdd",
	Stage: "stage",
	Alternance: "alternance",
	Freelance: "freelance",
} as const;

/**
 * Union type of contract type values
 */
export type ContractTypeValue = (typeof ContractType)[keyof typeof ContractType];

// Training categories
export const TrainingCategory = {
	Technique: "technique",
	Management: "management",
	Securite: "securite",
	SoftSkills: "soft_skills",
	Onboarding: "onboarding",
} as const;

/**
 * Union type of training category values
 */
export type TrainingCategoryValue = (typeof TrainingCategory)[keyof typeof TrainingCategory];

// Training statuses
export const TrainingStatus = {
	Upcoming: "upcoming",
	InProgress: "in_progress",
	Done: "done",
} as const;

/**
 * Union type of training status values
 */
export type TrainingStatusValue = (typeof TrainingStatus)[keyof typeof TrainingStatus];

// Export formats
export const ExportFormat = {
	PDF: "pdf",
	Excel: "excel",
	CSV: "csv",
} as const;

/**
 * Union type of export format values
 */
export type ExportFormatValue = (typeof ExportFormat)[keyof typeof ExportFormat];

// Application limits and thresholds
export const AppLimits = {
	MaxLoginAttempts: 5,
	SessionDurationDays: 7,
	MaxFileUploadMb: 10,
	PaginationDefaultSize: 20,
	PaginationMaxSize: 100,
	PasswordMinLength: 8,
} as const;

// Project priorities
export const ProjectPriority = {
	P0: "P0",
	P1: "P1",
	P2: "P2",
	P3: "P3",
	P4: "P4",
} as const;

/**
 * Union type of project priority values
 */
export type ProjectPriorityValue = (typeof ProjectPriority)[keyof typeof ProjectPriority];

// Project priority display labels
export const ProjectPriorityLabel: Record<ProjectPriorityValue, string> = {
	P0: "Critique",
	P1: "Haute",
	P2: "Moyenne",
	P3: "Basse",
	P4: "Minimale",
} as const;

// Relation statuses
export const RelationStatus = {
	Todo: "todo",
	InProgress: "in_progress",
	Done: "done",
	Cancelled: "cancelled",
} as const;

/**
 * Union type of relation status values
 */
export type RelationStatusValue = (typeof RelationStatus)[keyof typeof RelationStatus];

// Relation status display labels
export const RelationStatusLabel: Record<RelationStatusValue, string> = {
	todo: "A faire",
	in_progress: "En cours",
	done: "Réalisée",
	cancelled: "Annulée",
} as const;

// Absence modes
export const AbsenceModeValues = {
	None: "none",
	Partial: "partial",
	Complete: "complete",
} as const;

/**
 * Union type of absence mode values
 */
export type AbsenceMode = (typeof AbsenceModeValues)[keyof typeof AbsenceModeValues];

// Page access modes
export const PageAccessMode = {
	ReadOnly: "read_only",
	Editable: "editable",
	FullAccess: "full_access",
} as const;

/**
 * Union type of page access mode values
 */
export type PageAccessModeValue = (typeof PageAccessMode)[keyof typeof PageAccessMode];

// Page access mode display labels
export const PageAccessModeLabel: Record<PageAccessModeValue, string> = {
	read_only: "Lecture seule",
	editable: "Peut être modifiée",
	full_access: "Accès complet",
} as const;
