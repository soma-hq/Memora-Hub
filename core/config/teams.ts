export const TEAMS = {
	OWNER: "Owner",
	EXECUTIVE: "Executive",
	MARSHA: "Marsha Team",
	LEGACY: "Legacy",
	TALENT: "Talent",
	MOMENTUM: "Momentum",
	SQUAD: "Squad",
} as const;

export type Team = (typeof TEAMS)[keyof typeof TEAMS];

// Hierarchy level (higher = more access)
export const TEAM_HIERARCHY: Record<Team, number> = {
	Owner: 7,
	Executive: 6,
	"Marsha Team": 5,
	Legacy: 4,
	Talent: 3,
	Momentum: 3,
	Squad: 1,
};

// Display color for badges and UI
export const TEAM_COLORS: Record<Team, string> = {
	Owner: "primary",
	Executive: "error",
	"Marsha Team": "purple",
	Legacy: "warning",
	Talent: "success",
	Momentum: "info",
	Squad: "neutral",
};

// Tailwind text color for rich rendering
export const TEAM_TEXT_COLORS: Record<Team, string> = {
	Owner: "text-primary-500",
	Executive: "text-red-500",
	"Marsha Team": "text-purple-500",
	Legacy: "text-amber-500",
	Talent: "text-emerald-500",
	Momentum: "text-blue-500",
	Squad: "text-gray-400",
};

// Scope: "all" = all entities, "specific" = assigned to one entity
export const TEAM_SCOPE: Record<Team, "all" | "specific"> = {
	Owner: "all",
	Executive: "all",
	"Marsha Team": "all",
	Legacy: "specific",
	Talent: "all",
	Momentum: "all",
	Squad: "specific",
};

// Human-readable labels
export const TEAM_LABELS: Record<Team, string> = {
	Owner: "Owner",
	Executive: "Executive",
	"Marsha Team": "Marsha Team",
	Legacy: "Legacy",
	Talent: "Talent",
	Momentum: "Momentum",
	Squad: "Squad",
};

// Detailed description
export const TEAM_DESCRIPTIONS: Record<Team, string> = {
	Owner: "Maîtrise totale du Hub. Tous les accès, compte développeur, sans aucune exception.",
	Executive: "Toutes les permissions sur toutes les entités. Accès complet à la gestion et à l'administration.",
	"Marsha Team": "Mêmes accès que Legacy (modification et traitement managérial) mais sur toutes les entités.",
	Legacy: "Accès de modification et de traitement managérial, attitré à une entité spécifique.",
	Talent: "Accès aux recrutements et permissions classiques sur toutes les entités.",
	Momentum: "Accès aux Référents (Formations) et permissions classiques sur toutes les entités.",
	Squad: "Affilié à une entité spécifique par défaut. Aucun accès managérial.",
};

// Default permissions per team
export type Permission =
	| "hub:full"
	| "hub:developer"
	| "users:view"
	| "users:manage"
	| "projects:view"
	| "projects:manage"
	| "tasks:view"
	| "tasks:manage"
	| "meetings:view"
	| "meetings:manage"
	| "recruitment:view"
	| "recruitment:manage"
	| "training:view"
	| "training:manage"
	| "absences:view"
	| "absences:manage"
	| "stats:view"
	| "stats:manage"
	| "entities:view"
	| "entities:manage"
	| "settings:view"
	| "settings:manage";

const ALL_PERMISSIONS: Permission[] = [
	"hub:full",
	"hub:developer",
	"users:view",
	"users:manage",
	"projects:view",
	"projects:manage",
	"tasks:view",
	"tasks:manage",
	"meetings:view",
	"meetings:manage",
	"recruitment:view",
	"recruitment:manage",
	"training:view",
	"training:manage",
	"absences:view",
	"absences:manage",
	"stats:view",
	"stats:manage",
	"entities:view",
	"entities:manage",
	"settings:view",
	"settings:manage",
];

const STANDARD_VIEW: Permission[] = [
	"users:view",
	"projects:view",
	"tasks:view",
	"meetings:view",
	"absences:view",
	"stats:view",
	"settings:view",
];

const STANDARD_MANAGE: Permission[] = [...STANDARD_VIEW, "projects:manage", "tasks:manage", "meetings:manage"];

export const TEAM_PERMISSIONS: Record<Team, Permission[]> = {
	Owner: [...ALL_PERMISSIONS],
	Executive: ALL_PERMISSIONS.filter((p) => p !== "hub:developer"),
	"Marsha Team": [...STANDARD_MANAGE, "users:manage", "absences:manage"],
	Legacy: [...STANDARD_MANAGE, "users:manage", "absences:manage"],
	Talent: [...STANDARD_VIEW, "recruitment:view", "recruitment:manage", "tasks:manage"],
	Momentum: [...STANDARD_VIEW, "training:view", "training:manage", "tasks:manage"],
	Squad: ["projects:view", "tasks:view", "tasks:manage", "meetings:view", "absences:view", "settings:view"],
};

// Check whether teamA outranks teamB
/**
 * Check if team meets minimum hierarchy level
 * @param teamA - Team to evaluate
 * @param teamB - Minimum required team
 * @returns True if teamA outranks teamB
 */

export function isTeamAtLeast(teamA: Team, teamB: Team): boolean {
	return TEAM_HIERARCHY[teamA] >= TEAM_HIERARCHY[teamB];
}

// Check if a team has a specific permission
/**
 * Check if a team includes a specific permission
 * @param team - Team to check
 * @param permission - Permission to look for
 * @returns True if team has the permission
 */

export function teamHasPermission(team: Team, permission: Permission): boolean {
	return TEAM_PERMISSIONS[team].includes(permission);
}

// Get all teams as options for select inputs
/**
 * Build team options for select inputs
 * @returns Array of team option objects
 */

export function getTeamOptions() {
	return Object.values(TEAMS).map((team) => ({
		label: team,
		value: team,
		description: TEAM_DESCRIPTIONS[team],
		color: TEAM_COLORS[team],
	}));
}
