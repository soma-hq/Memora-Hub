/**
 * Module-based permission system (Discord-style).
 * Each module has granular permissions: view, create, edit, delete, manage.
 */

/** Available permission actions */
export type Permission = "view" | "create" | "edit" | "delete" | "manage";

/** All permission actions as an array */
export const ALL_PERMISSIONS: Permission[] = ["view", "create", "edit", "delete", "manage"];

/** Standard CRUD permissions (without manage) */
export const CRUD_PERMISSIONS: Permission[] = ["view", "create", "edit", "delete"];

/** Read + Write permissions (no delete, no manage) */
export const READ_WRITE_PERMISSIONS: Permission[] = ["view", "create", "edit"];

/** All application modules */
export type Module =
	| "moderation_discord"
	| "moderation_twitch"
	| "moderation_youtube"
	| "moderation_polyvalent"
	| "personnel"
	| "momentum"
	| "talent"
	| "tasks"
	| "projects"
	| "meetings"
	| "logs"
	| "admin"
	| "absences"
	| "groups"
	| "recruitment"
	| "training"
	| "notifications";

/** All modules as an array */
export const ALL_MODULES: Module[] = [
	"moderation_discord",
	"moderation_twitch",
	"moderation_youtube",
	"moderation_polyvalent",
	"personnel",
	"momentum",
	"talent",
	"tasks",
	"projects",
	"meetings",
	"logs",
	"admin",
	"absences",
	"groups",
	"recruitment",
	"training",
	"notifications",
];

/** Localized module labels for display */
export const MODULE_LABELS: Record<Module, string> = {
	moderation_discord: "Modération Discord",
	moderation_twitch: "Modération Twitch",
	moderation_youtube: "Modération YouTube",
	moderation_polyvalent: "Modération Polyvalent",
	personnel: "Personnel",
	momentum: "Momentum",
	talent: "Talent & Recrutement",
	tasks: "Tâches",
	projects: "Projets",
	meetings: "Réunions",
	logs: "Logs & Activité",
	admin: "Administration",
	absences: "Absences",
	groups: "Groupements",
	recruitment: "Recrutement",
	training: "Formations",
	notifications: "Notifications",
};

/** Module icon names for UI */
export const MODULE_ICONS: Record<Module, string> = {
	moderation_discord: "shield",
	moderation_twitch: "shield",
	moderation_youtube: "shield",
	moderation_polyvalent: "shield",
	personnel: "group",
	momentum: "rocket",
	talent: "sparkles",
	tasks: "check",
	projects: "folder",
	meetings: "calendar",
	logs: "clock",
	admin: "settings",
	absences: "calendar",
	groups: "group",
	recruitment: "sparkles",
	training: "academic-cap",
	notifications: "bell",
};

/** Permission label for display */
export const PERMISSION_LABELS: Record<Permission, string> = {
	view: "Voir",
	create: "Créer",
	edit: "Modifier",
	delete: "Supprimer",
	manage: "Gérer (tout)",
};

// ---------------------------------------------------------------------------
// Capability constants — used by feature permission files
// Each capability maps to a { module, action } pair for resolution.
// ---------------------------------------------------------------------------

/** A capability descriptor binding a module to an action */
export interface Capability {
	readonly module: Module;
	readonly action: Permission;
}

/** Helper to build a typed capability constant */
function cap(module: Module, action: Permission): Capability {
	return { module, action } as const;
}

/**
 * All fine-grained capability constants used across features/permissions.
 * Granular capabilities that exceed basic CRUD are mapped to the closest
 * base permission (typically "manage" or "edit").
 */
export const CAPABILITIES = {
	// Tasks
	TASKS_VIEW: cap("tasks", "view"),
	TASKS_CREATE: cap("tasks", "create"),
	TASKS_EDIT: cap("tasks", "edit"),
	TASKS_DELETE: cap("tasks", "delete"),
	TASKS_ASSIGN: cap("tasks", "manage"),
	TASKS_MANAGE_SUBTASKS: cap("tasks", "manage"),
	TASKS_CHANGE_STATUS: cap("tasks", "edit"),
	TASKS_CHANGE_PRIORITY: cap("tasks", "edit"),
	TASKS_VIEW_ALL: cap("tasks", "manage"),
	TASKS_EXPORT: cap("tasks", "manage"),

	// Projects
	PROJECTS_VIEW: cap("projects", "view"),
	PROJECTS_CREATE: cap("projects", "create"),
	PROJECTS_EDIT: cap("projects", "edit"),
	PROJECTS_DELETE: cap("projects", "delete"),
	PROJECTS_ARCHIVE: cap("projects", "manage"),
	PROJECTS_MANAGE_MEMBERS: cap("projects", "manage"),
	PROJECTS_VIEW_STATS: cap("projects", "view"),
	PROJECTS_EXPORT: cap("projects", "manage"),

	// Meetings
	MEETINGS_VIEW: cap("meetings", "view"),
	MEETINGS_CREATE: cap("meetings", "create"),
	MEETINGS_EDIT: cap("meetings", "edit"),
	MEETINGS_DELETE: cap("meetings", "delete"),
	MEETINGS_MANAGE_ATTENDEES: cap("meetings", "manage"),
	MEETINGS_VIEW_NOTES: cap("meetings", "view"),
	MEETINGS_EDIT_NOTES: cap("meetings", "edit"),
	MEETINGS_EXPORT: cap("meetings", "manage"),

	// Absences
	ABSENCES_VIEW: cap("absences", "view"),
	ABSENCES_CREATE: cap("absences", "create"),
	ABSENCES_APPROVE: cap("absences", "manage"),

	// Groups
	GROUPS_VIEW: cap("groups", "view"),
	GROUPS_EDIT: cap("groups", "edit"),
	GROUPS_DELETE: cap("groups", "delete"),

	// Recruitment
	RECRUITMENT_VIEW: cap("recruitment", "view"),
	RECRUITMENT_CREATE: cap("recruitment", "create"),
	RECRUITMENT_EDIT: cap("recruitment", "edit"),

	// Training
	TRAINING_VIEW: cap("training", "view"),
	TRAINING_CREATE: cap("training", "create"),
	TRAINING_EDIT: cap("training", "edit"),

	// Notifications
	NOTIFICATIONS_VIEW: cap("notifications", "view"),
	NOTIFICATIONS_MANAGE: cap("notifications", "manage"),
} as const;
