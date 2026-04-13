/**
 * Discord-style role definitions with hierarchy levels.
 * Higher level = more authority. Roles are used across the entire permission system.
 */
export const ROLES = {
	OWNER: { id: "owner", level: 100, label: "Owner", color: "red" },
	MARSHA_TEAMS: { id: "marsha_teams", level: 80, label: "Marsha Teams", color: "primary" },
	LEGACY_RESP_LIVE: { id: "legacy_resp_live", level: 50, label: "Resp. Live & YouTube", color: "orange" },
	LEGACY_RESP_DISCORD: { id: "legacy_resp_discord", level: 50, label: "Resp. Discord", color: "orange" },
	LEGACY_RESP_POLYVALENT: { id: "legacy_resp_polyvalent", level: 50, label: "Resp. Polyvalent", color: "orange" },
	MOMENTUM_TALENT: { id: "momentum_talent", level: 40, label: "Momentum & Talent", color: "purple" },
} as const;

/** Union type of all role IDs */
export type RoleId = (typeof ROLES)[keyof typeof ROLES]["id"];

/** Single role definition structure */
export interface RoleDefinition {
	readonly id: RoleId;
	readonly level: number;
	readonly label: string;
	readonly color: string;
}

/** Array of all role definitions sorted by level descending */
export const ROLES_LIST: RoleDefinition[] = Object.values(ROLES).sort((a, b) => b.level - a.level);

/** Map from role ID to its definition */
export const ROLE_BY_ID: Record<RoleId, RoleDefinition> = Object.fromEntries(
	Object.values(ROLES).map((r) => [r.id, r]),
) as Record<RoleId, RoleDefinition>;

/** Map from role ID to its hierarchy level */
export const ROLE_HIERARCHY: Record<RoleId, number> = Object.fromEntries(
	Object.values(ROLES).map((r) => [r.id, r.level]),
) as Record<RoleId, number>;

/** Localized role labels for display */
export const ROLE_LABELS: Record<RoleId, string> = {
	owner: "Owner",
	marsha_teams: "Marsha Teams",
	legacy_resp_live: "Resp. Live & YouTube",
	legacy_resp_discord: "Resp. Discord",
	legacy_resp_polyvalent: "Resp. Polyvalent",
	momentum_talent: "Momentum & Talent",
};

/** Localized role descriptions */
export const ROLE_DESCRIPTIONS: Record<RoleId, string> = {
	owner: "Accès complet et total. Contrôle absolu sur toutes les fonctionnalités, tous les modules et toutes les entités.",
	marsha_teams: "Accès de gestion sur tous les modules (hors admin). Toutes les entités accessibles.",
	legacy_resp_live:
		"Responsable des plateformes Live & YouTube. Modération Twitch/YouTube, tâches, projets, réunions et personnel.",
	legacy_resp_discord: "Responsable Discord. Modération Discord, tâches, projets, réunions et personnel.",
	legacy_resp_polyvalent: "Responsable Polyvalent. Modération polyvalente, tâches, projets, réunions et personnel.",
	momentum_talent: "Gestion Momentum & Talent. Accès aux formations, recrutement et tâches.",
};

/** Tailwind color classes for role badges */
export const ROLE_COLORS: Record<RoleId, string> = {
	owner: "text-red-500",
	marsha_teams: "text-primary-500",
	legacy_resp_live: "text-amber-500",
	legacy_resp_discord: "text-amber-500",
	legacy_resp_polyvalent: "text-amber-500",
	momentum_talent: "text-purple-500",
};

/** Badge background classes for role display */
export const ROLE_BADGE_CLASSES: Record<RoleId, string> = {
	owner: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
	marsha_teams: "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400",
	legacy_resp_live: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
	legacy_resp_discord: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
	legacy_resp_polyvalent: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
	momentum_talent: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
};

/**
 * Check if roleA outranks or equals roleB in hierarchy
 * @param roleA - Role to evaluate
 * @param roleB - Comparison role
 * @returns True if roleA level >= roleB level
 */
export function isRoleAtLeast(roleA: RoleId, roleB: RoleId): boolean {
	return ROLE_HIERARCHY[roleA] >= ROLE_HIERARCHY[roleB];
}

/**
 * Check if roleA strictly outranks roleB
 * @param roleA - Role to evaluate
 * @param roleB - Comparison role
 * @returns True if roleA level > roleB level
 */
export function isHigherRole(roleA: RoleId, roleB: RoleId): boolean {
	return ROLE_HIERARCHY[roleA] > ROLE_HIERARCHY[roleB];
}

/**
 * Get all roles at or below the given role level
 * @param role - Upper bound role
 * @returns Array of role IDs at or below that level
 */
export function getRolesBelow(role: RoleId): RoleId[] {
	const level = ROLE_HIERARCHY[role];
	return (Object.keys(ROLE_HIERARCHY) as RoleId[]).filter((r) => ROLE_HIERARCHY[r] <= level);
}

/**
 * Get role options for select inputs
 * @returns Array of role option objects with label, value, description, color
 */
export function getRoleOptions() {
	return ROLES_LIST.map((role) => ({
		label: role.label,
		value: role.id,
		description: ROLE_DESCRIPTIONS[role.id],
		color: role.color,
	}));
}

// ---------------------------------------------------------------------------
// Generic role abstraction — used by feature permission files
// Maps generic role names (Owner, Admin, Manager, ...) to hierarchy levels
// so that `hasMinRole(user, groupId, "Manager")` works regardless of the
// actual RoleId the user holds.
// ---------------------------------------------------------------------------

/** Generic role names used in permission checks */
export type Role = "Owner" | "Admin" | "Manager" | "Collaborator" | "Guest";

/** Minimum hierarchy level for each generic role */
export const GENERIC_ROLE_LEVELS: Record<Role, number> = {
	Owner: 100,
	Admin: 80,
	Manager: 50,
	Collaborator: 40,
	Guest: 0,
};
