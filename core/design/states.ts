// Constants & types
import type {
	TaskStatusValue,
	TaskPriorityValue,
	AbsenceStatusValue,
	AbsenceTypeValue,
	MeetingTypeValue,
	ProjectStatusValue,
	ProjectPriorityValue,
	UserRole,
} from "@/constants";

export const badgeVariants = {
	success:
		"bg-success-100 text-success-700 border border-success-200 dark:bg-success-900/20 dark:text-success-400 dark:border-success-800",
	error: "bg-error-100 text-error-700 border border-error-200 dark:bg-error-900/20 dark:text-error-400 dark:border-error-800",
	warning:
		"bg-warning-100 text-warning-700 border border-warning-200 dark:bg-warning-900/20 dark:text-warning-400 dark:border-warning-800",
	info: "bg-info-100 text-info-700 border border-info-200 dark:bg-info-900/20 dark:text-info-400 dark:border-info-800",
	neutral:
		"bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
	primary:
		"bg-primary-100 text-primary-700 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

// Badge dot colors
export const badgeDotColors = {
	success: "bg-success-500",
	error: "bg-error-500",
	warning: "bg-warning-500",
	info: "bg-info-500",
	neutral: "bg-gray-500",
	primary: "bg-primary-500",
} as const;

// Alert classes
export const alertClasses = {
	success:
		"bg-success-50 border-l-4 border-success-500 text-success-700 dark:bg-success-900/10 dark:text-success-400",
	error: "bg-error-50 border-l-4 border-error-500 text-error-700 dark:bg-error-900/10 dark:text-error-400",
	warning:
		"bg-warning-50 border-l-4 border-warning-500 text-warning-700 dark:bg-warning-900/10 dark:text-warning-400",
	info: "bg-info-50 border-l-4 border-info-500 text-info-700 dark:bg-info-900/10 dark:text-info-400",
} as const;

export type AlertVariant = keyof typeof alertClasses;

// Input state classes
export const inputStateClasses = {
	default: "border-gray-300 dark:border-gray-600",
	focus: "border-primary-500 ring-2 ring-primary-100",
	valid: "border-success-500",
	error: "border-error-500",
	warning: "border-error-500",
	disabled: "border-gray-300 bg-gray-50 dark:bg-gray-900 cursor-not-allowed",
} as const;

// Checkbox states
export const checkboxStates = {
	unchecked: "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600",
	checked: "border-primary-500 bg-primary-500 text-white",
	disabled: "border-gray-200 bg-gray-100 cursor-not-allowed dark:bg-gray-900 dark:border-gray-700",
} as const;

// Task status badge variants
export const taskStatusVariant: Record<TaskStatusValue, BadgeVariant> = {
	todo: "neutral",
	in_progress: "info",
	done: "success",
};

// Task priority badge variants
export const taskPriorityVariant: Record<TaskPriorityValue, BadgeVariant> = {
	high: "error",
	medium: "warning",
	low: "neutral",
};

// Absence status badge variants
export const absenceStatusVariant: Record<AbsenceStatusValue, BadgeVariant> = {
	pending: "warning",
	approved: "success",
	rejected: "error",
};

// Absence type badge variants
export const absenceTypeVariant: Record<AbsenceTypeValue, BadgeVariant> = {
	conge_paye: "info",
	rtt: "primary",
	maladie: "error",
	autre: "neutral",
};

// Meeting type badge variants
export const meetingTypeVariant: Record<MeetingTypeValue, BadgeVariant> = {
	reunion: "info",
	standup: "success",
	revue: "warning",
	retrospective: "primary",
	entretien: "neutral",
};

// Project status badge variants
export const projectStatusVariant: Record<ProjectStatusValue, BadgeVariant> = {
	todo: "neutral",
	in_progress: "info",
	paused: "warning",
	done: "success",
	complete: "success",
	archived: "neutral",
};

// Project priority badge variants
export const projectPriorityVariant: Record<ProjectPriorityValue, BadgeVariant> = {
	P0: "error",
	P1: "warning",
	P2: "info",
	P3: "neutral",
	P4: "neutral",
};

// User role badge variants
export const roleVariant: Record<UserRole, BadgeVariant> = {
	Owner: "primary",
	Admin: "info",
	Manager: "warning",
	Collaborator: "success",
	Guest: "neutral",
};

// Absence type calendar cell colors
export const absenceTypeCalendarColors: Record<AbsenceTypeValue, string> = {
	conge_paye: "bg-info-200 dark:bg-info-800 text-info-700 dark:text-info-300",
	rtt: "bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300",
	maladie: "bg-error-200 dark:bg-error-800 text-error-700 dark:text-error-300",
	autre: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
};

// Absence type dot indicator colors
export const absenceTypeDotColors: Record<AbsenceTypeValue, string> = {
	conge_paye: "bg-info-500",
	rtt: "bg-primary-500",
	maladie: "bg-error-500",
	autre: "bg-gray-500",
};

// Meeting type dot colors
export const meetingTypeDotColors: Record<MeetingTypeValue, string> = {
	reunion: "bg-info-500",
	standup: "bg-success-500",
	revue: "bg-warning-500",
	retrospective: "bg-primary-500",
	entretien: "bg-gray-500",
};

// Semantic level types
export type SemanticLevel = "success" | "error" | "warning" | "info" | "neutral";

// Semantic left-border variants
export const levelBorderVariant: Record<SemanticLevel, string> = {
	success: "border-l-success-500",
	warning: "border-l-warning-500",
	error: "border-l-error-500",
	info: "border-l-info-500",
	neutral: "border-l-gray-400 dark:border-l-gray-500",
};

// Semantic icon color variants
export const levelIconColorVariant: Record<SemanticLevel, string> = {
	success: "text-success-500",
	warning: "text-warning-500",
	error: "text-error-500",
	info: "text-info-500",
	neutral: "text-gray-400 dark:text-gray-500",
};

// Semantic top-border variants
export const levelBorderTopVariant: Record<SemanticLevel, string> = {
	success: "border-t-success-500",
	warning: "border-t-warning-500",
	error: "border-t-error-500",
	info: "border-t-info-500",
	neutral: "border-t-gray-400 dark:border-t-gray-500",
};

// Semantic background icon variants
export const levelBgIconVariant: Record<SemanticLevel, string> = {
	success: "bg-success-100 dark:bg-success-900/20",
	warning: "bg-warning-100 dark:bg-warning-900/20",
	error: "bg-error-100 dark:bg-error-900/20",
	info: "bg-info-100 dark:bg-info-900/20",
	neutral: "bg-gray-100 dark:bg-gray-700",
};

// Semantic text icon variants
export const levelTextIconVariant: Record<SemanticLevel, string> = {
	success: "text-success-600 dark:text-success-400",
	warning: "text-warning-600 dark:text-warning-400",
	error: "text-error-600 dark:text-error-400",
	info: "text-info-600 dark:text-info-400",
	neutral: "text-gray-600 dark:text-gray-300",
};

// Semantic dot color variants
export const levelDotVariant: Record<SemanticLevel, string> = {
	success: "bg-success-500",
	warning: "bg-warning-500",
	error: "bg-error-500",
	info: "bg-info-500",
	neutral: "bg-gray-500",
};
