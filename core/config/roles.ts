export const ROLES = {
	OWNER: "Owner",
	ADMIN: "Admin",
	MANAGER: "Manager",
	COLLABORATOR: "Collaborator",
	GUEST: "Guest",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<Role, number> = {
	Owner: 5,
	Admin: 4,
	Manager: 3,
	Collaborator: 2,
	Guest: 1,
};

export const ROLE_LABELS: Record<Role, string> = {
	Owner: "Propriétaire",
	Admin: "Administrateur",
	Manager: "Responsable",
	Collaborator: "Collaborateur",
	Guest: "Invité",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
	Owner: "Accès complet à toutes les fonctionnalités et paramètres de l'entité.",
	Admin: "Gestion des utilisateurs, projets, tâches, réunions, recrutement et formation.",
	Manager: "Gestion des projets, tâches et réunions de son équipe.",
	Collaborator: "Lecture et écriture sur les tâches, lecture sur les réunions.",
	Guest: "Accès en lecture seule sur les tâches assignées.",
};

// Check whether roleA is >= roleB in hierarchy
/**
 * Check if role meets minimum hierarchy level
 * @param roleA - Role to evaluate
 * @param roleB - Minimum required role
 * @returns True if roleA is sufficient
 */

export function isRoleAtLeast(roleA: Role, roleB: Role): boolean {
	return ROLE_HIERARCHY[roleA] >= ROLE_HIERARCHY[roleB];
}

// Get all roles at or below the given role in hierarchy
/**
 * Retrieve all roles at or below given level
 * @param role - Upper bound role in hierarchy
 * @returns Array of roles at or below that level
 */

export function getRolesBelow(role: Role): Role[] {
	const level = ROLE_HIERARCHY[role];
	return (Object.keys(ROLE_HIERARCHY) as Role[]).filter((r) => ROLE_HIERARCHY[r] <= level);
}
