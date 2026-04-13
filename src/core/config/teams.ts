import type { RoleId } from "./roles";

/**
 * Team configuration aligned with the Discord-style role system.
 * Teams are display groupings that map to the underlying role system.
 */
export const TEAMS = {
	OWNER: "Owner",
	MARSHA_TEAMS: "Marsha Teams",
	LEGACY: "Legacy",
	MOMENTUM_TALENT: "Momentum & Talent",
} as const;

export type Team = (typeof TEAMS)[keyof typeof TEAMS];

/** Hierarchy level for display ordering (higher = more access) */
export const TEAM_HIERARCHY: Record<Team, number> = {
	Owner: 100,
	"Marsha Teams": 80,
	Legacy: 50,
	"Momentum & Talent": 40,
};

/** Display color for badges and UI elements */
export const TEAM_COLORS: Record<Team, string> = {
	Owner: "error",
	"Marsha Teams": "primary",
	Legacy: "warning",
	"Momentum & Talent": "purple",
};

/** Tailwind text color for rich rendering */
export const TEAM_TEXT_COLORS: Record<Team, string> = {
	Owner: "text-red-500",
	"Marsha Teams": "text-primary-500",
	Legacy: "text-amber-500",
	"Momentum & Talent": "text-purple-500",
};

/** Entity scope per team */
export const TEAM_SCOPE: Record<Team, "all" | "specific"> = {
	Owner: "all",
	"Marsha Teams": "all",
	Legacy: "specific",
	"Momentum & Talent": "specific",
};

/** Human-readable labels */
export const TEAM_LABELS: Record<Team, string> = {
	Owner: "Owner",
	"Marsha Teams": "Marsha Teams",
	Legacy: "Legacy",
	"Momentum & Talent": "Momentum & Talent",
};

/** Detailed description */
export const TEAM_DESCRIPTIONS: Record<Team, string> = {
	Owner: "Contrôle absolu du Hub. Tous les accès sans aucune exception, y compris l'administration.",
	"Marsha Teams": "Accès de gestion sur tous les modules (hors admin). Toutes les entités accessibles.",
	Legacy: "Responsables de modération avec des entités spécifiques. Discord, Live/YouTube ou Polyvalent.",
	"Momentum & Talent": "Gestion des formations (Momentum) et du recrutement (Talent). Entités spécifiques.",
};

/** Map team to corresponding role IDs */
export const TEAM_ROLE_IDS: Record<Team, RoleId[]> = {
	Owner: ["owner"],
	"Marsha Teams": ["marsha_teams"],
	Legacy: ["legacy_resp_live", "legacy_resp_discord", "legacy_resp_polyvalent"],
	"Momentum & Talent": ["momentum_talent"],
};

/** Reverse map: roleId to team */
export function getTeamForRole(roleId: RoleId): Team {
	for (const [team, roleIds] of Object.entries(TEAM_ROLE_IDS)) {
		if ((roleIds as RoleId[]).includes(roleId)) return team as Team;
	}
	return "Momentum & Talent";
}

/** Check whether teamA outranks teamB */
export function isTeamAtLeast(teamA: Team, teamB: Team): boolean {
	return TEAM_HIERARCHY[teamA] >= TEAM_HIERARCHY[teamB];
}

/** Get all teams as options for select inputs */
export function getTeamOptions() {
	return Object.values(TEAMS).map((team) => ({
		label: team,
		value: team,
		description: TEAM_DESCRIPTIONS[team],
		color: TEAM_COLORS[team],
	}));
}
