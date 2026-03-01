export const CAPABILITIES = {
	// Users
	USERS_VIEW: "users:view",
	USERS_CREATE: "users:create",
	USERS_EDIT: "users:edit",
	USERS_DELETE: "users:delete",

	// Groups
	GROUPS_VIEW: "groups:view",
	GROUPS_CREATE: "groups:create",
	GROUPS_EDIT: "groups:edit",
	GROUPS_DELETE: "groups:delete",

	// Projects
	PROJECTS_VIEW: "projects:view",
	PROJECTS_CREATE: "projects:create",
	PROJECTS_EDIT: "projects:edit",
	PROJECTS_DELETE: "projects:delete",
	PROJECTS_ARCHIVE: "projects:archive",
	PROJECTS_MANAGE_MEMBERS: "projects:manage_members",
	PROJECTS_VIEW_STATS: "projects:view_stats",
	PROJECTS_EXPORT: "projects:export",

	// Tasks
	TASKS_VIEW: "tasks:view",
	TASKS_CREATE: "tasks:create",
	TASKS_EDIT: "tasks:edit",
	TASKS_DELETE: "tasks:delete",
	TASKS_ASSIGN: "tasks:assign",
	TASKS_MANAGE_SUBTASKS: "tasks:manage_subtasks",
	TASKS_CHANGE_STATUS: "tasks:change_status",
	TASKS_CHANGE_PRIORITY: "tasks:change_priority",
	TASKS_VIEW_ALL: "tasks:view_all",
	TASKS_EXPORT: "tasks:export",

	// Meetings
	MEETINGS_VIEW: "meetings:view",
	MEETINGS_CREATE: "meetings:create",
	MEETINGS_EDIT: "meetings:edit",
	MEETINGS_DELETE: "meetings:delete",
	MEETINGS_MANAGE_ATTENDEES: "meetings:manage_attendees",
	MEETINGS_VIEW_NOTES: "meetings:view_notes",
	MEETINGS_EDIT_NOTES: "meetings:edit_notes",
	MEETINGS_EXPORT: "meetings:export",

	// Absences
	ABSENCES_VIEW: "absences:view",
	ABSENCES_CREATE: "absences:create",
	ABSENCES_APPROVE: "absences:approve",

	// Recruitment
	RECRUITMENT_VIEW: "recruitment:view",
	RECRUITMENT_CREATE: "recruitment:create",
	RECRUITMENT_EDIT: "recruitment:edit",

	// Training
	TRAINING_VIEW: "training:view",
	TRAINING_CREATE: "training:create",
	TRAINING_EDIT: "training:edit",

	// Stats
	STATS_VIEW: "stats:view",

	// Settings
	SETTINGS_VIEW: "settings:view",
	SETTINGS_EDIT: "settings:edit",

	// Admin
	ADMIN_PANEL: "admin:panel",
} as const;

export type Capability = (typeof CAPABILITIES)[keyof typeof CAPABILITIES];
