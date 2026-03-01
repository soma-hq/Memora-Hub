export const ROUTES = {
	// Auth
	LOGIN: "/login",
	A2F: "/a2f",

	// Hub scoped
	DASHBOARD: (groupId: string) => `/hub/${groupId}`,
	PROJECTS: (groupId: string) => `/hub/${groupId}/projects`,
	PROJECT_DETAIL: (groupId: string, projectId: string) => `/hub/${groupId}/projects/${projectId}`,
	TASKS: (groupId: string) => `/hub/${groupId}/tasks`,
	MEETINGS: (groupId: string) => `/hub/${groupId}/meetings`,

	// Personal
	PERSONNEL_ABSENCES: (groupId: string) => `/hub/${groupId}/personnel/absences`,
	PERSONNEL_PLANNING: (groupId: string) => `/hub/${groupId}/personnel/planning`,
	PERSONNEL_PROJECTS: (groupId: string) => `/hub/${groupId}/personnel/projects`,
	PERSONNEL_TASKS: (groupId: string) => `/hub/${groupId}/personnel/tasks`,

	// Momentum
	MOMENTUM_LAUNCH: (groupId: string) => `/hub/${groupId}/momentum/launch`,
	MOMENTUM_SESSIONS: (groupId: string) => `/hub/${groupId}/momentum/sessions`,
	MOMENTUM_SESSION_DETAIL: (groupId: string, sessionId: string) => `/hub/${groupId}/momentum/sessions/${sessionId}`,
	MOMENTUM_SPACE: (groupId: string) => `/hub/${groupId}/momentum/space`,
	MOMENTUM_MANAGEMENT: (groupId: string) => `/hub/${groupId}/momentum/management`,

	// Talent
	RECRUITMENT: (groupId: string) => `/hub/${groupId}/recruitment`,
	RECRUITMENT_SESSION: (groupId: string, sessionId: string) => `/hub/${groupId}/recruitment/sessions/${sessionId}`,
	RECRUITMENT_QUESTIONNAIRE: (groupId: string, sessionId: string) =>
		`/hub/${groupId}/recruitment/sessions/${sessionId}/questionnaire`,
	RECRUITMENT_ESPACE: (groupId: string) => `/hub/${groupId}/recruitment/espace`,
	RECRUITMENT_CONSIGNES: (groupId: string) => `/hub/${groupId}/recruitment/consignes`,
	RECRUITMENT_CANDIDATES: (groupId: string) => `/hub/${groupId}/recruitment/candidates`,
	RECRUITMENT_CANDIDATE: (groupId: string, candidateId: string) =>
		`/hub/${groupId}/recruitment/candidates/${candidateId}`,
	RECRUITMENT_RESULTS: (groupId: string) => `/hub/${groupId}/recruitment/results`,
	RECRUITMENT_CALENDAR: (groupId: string) => `/hub/${groupId}/recruitment/calendar`,
	RECRUITMENT_ADMIN: (groupId: string) => `/hub/${groupId}/recruitment/admin`,

	// Discord Mod
	MODERATION_PANEL: (groupId: string) => `/hub/${groupId}/moderation`,
	MODERATION_CENTRE_INFO: (groupId: string) => `/hub/${groupId}/moderation/centre-info`,
	MODERATION_ECHELLE: (groupId: string) => `/hub/${groupId}/moderation/centre-info/echelle`,
	MODERATION_TICKETS: (groupId: string) => `/hub/${groupId}/moderation/centre-info/tickets`,
	MODERATION_TIPS: (groupId: string) => `/hub/${groupId}/moderation/centre-info/tips`,
	MODERATION_MARSHA_BOT: (groupId: string) => `/hub/${groupId}/moderation/marsha-bot`,
	MODERATION_SANCTIONS: (groupId: string) => `/hub/${groupId}/moderation/sanctions`,
	MODERATION_CONSIGNES: (groupId: string) => `/hub/${groupId}/moderation/consignes`,
	MODERATION_POLITIQUE: (groupId: string) => `/hub/${groupId}/moderation/politique`,

	// Twitch Mod
	MOD_TWITCH_PANEL: (groupId: string) => `/hub/${groupId}/mod-twitch`,
	MOD_TWITCH_CENTRE_INFO: (groupId: string) => `/hub/${groupId}/mod-twitch/centre-info`,
	MOD_TWITCH_ECHELLE: (groupId: string) => `/hub/${groupId}/mod-twitch/centre-info/echelle`,
	MOD_TWITCH_TICKETS: (groupId: string) => `/hub/${groupId}/mod-twitch/centre-info/tickets`,
	MOD_TWITCH_TIPS: (groupId: string) => `/hub/${groupId}/mod-twitch/centre-info/tips`,
	MOD_TWITCH_SANCTIONS: (groupId: string) => `/hub/${groupId}/mod-twitch/sanctions`,
	MOD_TWITCH_CONSIGNES: (groupId: string) => `/hub/${groupId}/mod-twitch/consignes`,
	MOD_TWITCH_POLITIQUE: (groupId: string) => `/hub/${groupId}/mod-twitch/politique`,

	// YouTube Mod
	MOD_YOUTUBE_PANEL: (groupId: string) => `/hub/${groupId}/mod-youtube`,
	MOD_YOUTUBE_CENTRE_INFO: (groupId: string) => `/hub/${groupId}/mod-youtube/centre-info`,
	MOD_YOUTUBE_ECHELLE: (groupId: string) => `/hub/${groupId}/mod-youtube/centre-info/echelle`,
	MOD_YOUTUBE_TICKETS: (groupId: string) => `/hub/${groupId}/mod-youtube/centre-info/tickets`,
	MOD_YOUTUBE_TIPS: (groupId: string) => `/hub/${groupId}/mod-youtube/centre-info/tips`,
	MOD_YOUTUBE_SANCTIONS: (groupId: string) => `/hub/${groupId}/mod-youtube/sanctions`,
	MOD_YOUTUBE_CONSIGNES: (groupId: string) => `/hub/${groupId}/mod-youtube/consignes`,
	MOD_YOUTUBE_POLITIQUE: (groupId: string) => `/hub/${groupId}/mod-youtube/politique`,

	// Polyvalent Mod
	MOD_POLYVALENT_PANEL: (groupId: string) => `/hub/${groupId}/mod-polyvalent`,
	MOD_POLYVALENT_CENTRE_INFO: (groupId: string) => `/hub/${groupId}/mod-polyvalent/centre-info`,
	MOD_POLYVALENT_ECHELLE: (groupId: string) => `/hub/${groupId}/mod-polyvalent/centre-info/echelle`,
	MOD_POLYVALENT_TICKETS: (groupId: string) => `/hub/${groupId}/mod-polyvalent/centre-info/tickets`,
	MOD_POLYVALENT_TIPS: (groupId: string) => `/hub/${groupId}/mod-polyvalent/centre-info/tips`,
	MOD_POLYVALENT_MARSHA_BOT: (groupId: string) => `/hub/${groupId}/mod-polyvalent/marsha-bot`,
	MOD_POLYVALENT_SANCTIONS: (groupId: string) => `/hub/${groupId}/mod-polyvalent/sanctions`,
	MOD_POLYVALENT_CONSIGNES: (groupId: string) => `/hub/${groupId}/mod-polyvalent/consignes`,
	MOD_POLYVALENT_POLITIQUE: (groupId: string) => `/hub/${groupId}/mod-polyvalent/politique`,

	// Global
	PROFILE: "/profile",
	SETTINGS: "/settings/account",
	SETTINGS_SECURITY: "/settings/security",
	SETTINGS_PREFERENCES: "/settings/preferences",
	SETTINGS_NOTIFICATIONS: "/settings/notifications",
	SETTINGS_DATA: "/settings/data",

	// Owner
	USERS: "/users",
	USER_DETAIL: (userId: string) => `/users/${userId}`,
	GROUPS: "/groups",
	STATS: "/stats",

	// Admin Dashboard
	ADMIN_DASHBOARD: "/admin",
	ADMIN_ACCESS: "/admin/access",
	ADMIN_LINKS: "/admin/links",
	ADMIN_STATS: "/admin/stats",
	ADMIN_DEV: "/admin/dev",
	ADMIN_TRASH: "/admin/trash",
} as const;
