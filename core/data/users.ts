import type { RoleId } from "@/core/config/roles";
import accountsConfig from "@/core/configurations/default/users/accounts.json";

/** User definition loaded from centralized JSON config */
export interface SeedUser {
	id: string;
	name: string;
	pseudo: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: string;
	roleId: RoleId;
	team: string;
	entity: string;
	entityAccess: string[];
	division: number;
	status: string;
	a2fEnabled: boolean;
	twoFactorEnabled: boolean;
	twoFactorSecret: string;
	discordId?: string;
	arrivalDate?: string;
	avatar?: string;
}

// ---------------------------------------------------------------------------
// Users — loaded from core/configurations/default/users/accounts.json
// Single source of truth: no env vars, no hardcoded data.
// ---------------------------------------------------------------------------

export const SEED_USERS: SeedUser[] = accountsConfig.accounts.map((acc) => ({
	id: acc.id,
	name: `${acc.firstName} ${acc.lastName}`,
	pseudo: acc.pseudo,
	firstName: acc.firstName,
	lastName: acc.lastName,
	email: acc.email,
	password: acc.password,
	role: acc.role,
	roleId: acc.roleId as RoleId,
	team: acc.team,
	entity: acc.entity,
	entityAccess: acc.entityAccess,
	division: acc.division,
	status: acc.status,
	a2fEnabled: acc.a2fEnabled,
	twoFactorEnabled: acc.a2fEnabled,
	twoFactorSecret: "",
	discordId: acc.discordId,
	arrivalDate: acc.arrivalDate,
}));

// Map from user ID to user object for fast lookup
export const USER_BY_ID: Record<string, SeedUser> = Object.fromEntries(SEED_USERS.map((u) => [u.id, u]));

// Map from email to user object
export const USER_BY_EMAIL: Record<string, SeedUser> = Object.fromEntries(SEED_USERS.map((u) => [u.email, u]));

/**
 * Get user by ID
 * @param id - User identifier
 * @returns User object or undefined
 */
export function getUserById(id: string): SeedUser | undefined {
	return USER_BY_ID[id];
}

/**
 * Get user by email
 * @param email - User email
 * @returns User object or undefined
 */
export function getUserByEmail(email: string): SeedUser | undefined {
	return USER_BY_EMAIL[email];
}

/**
 * Get users filtered by role
 * @param roleId - Role to filter by
 * @returns Array of users with that role
 */
export function getUsersByRole(roleId: RoleId): SeedUser[] {
	return SEED_USERS.filter((u) => u.roleId === roleId);
}

/**
 * Get users who have access to a specific entity
 * @param entityId - Entity ID to check
 * @returns Array of users with access to the entity
 */
export function getUsersByEntity(entityId: string): SeedUser[] {
	return SEED_USERS.filter((u) => u.entityAccess.includes("*") || u.entityAccess.includes(entityId));
}
