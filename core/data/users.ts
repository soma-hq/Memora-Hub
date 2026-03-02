import type { RoleId } from "@/core/config/roles";

/** User definition with role and entity access */
export interface SeedUser {
	id: string;
	name: string;
	email: string;
	password: string;
	roleId: RoleId;
	entityAccess: string[];
	twoFactorEnabled: boolean;
	twoFactorSecret: string;
	avatar?: string;
}

/**
 * Seed users for the Memora Hub.
 * Passwords are stored as plaintext mock values (format: xxxx-xxxxx).
 * In production, these would be hashed via lib/auth/password.ts.
 * 2FA secrets are base32-encoded TOTP seeds.
 */
export const SEED_USERS: SeedUser[] = [
	{
		id: "usr_witt",
		name: "Witt",
		email: "witt@memora.hub",
		password: "wi7t-4xmq",
		roleId: "marsha_teams",
		entityAccess: ["*"],
		twoFactorEnabled: true,
		twoFactorSecret: "JBSWY3DPEHPK3PXP",
	},
	{
		id: "usr_candice",
		name: "Candice",
		email: "candice@memora.hub",
		password: "ca3d-9npz",
		roleId: "marsha_teams",
		entityAccess: ["*"],
		twoFactorEnabled: true,
		twoFactorSecret: "KRSXG5CTMVZXIZLS",
	},
	{
		id: "usr_procy",
		name: "Procy",
		email: "procy@memora.hub",
		password: "pr5c-7kfg",
		roleId: "legacy_resp_live",
		entityAccess: ["inoxtag", "michou"],
		twoFactorEnabled: true,
		twoFactorSecret: "MFQWC5DJN5XCA4TF",
	},
	{
		id: "usr_andrew",
		name: "Andrew",
		email: "andrew@memora.hub",
		password: "an2w-8dre",
		roleId: "legacy_resp_live",
		entityAccess: ["inoxtag", "michou"],
		twoFactorEnabled: true,
		twoFactorSecret: "NB2HI4DTHIXS653X",
	},
	{
		id: "usr_antwo",
		name: "Antwo",
		email: "antwo@memora.hub",
		password: "at6o-3bwx",
		roleId: "legacy_resp_discord",
		entityAccess: ["inoxtag", "michou"],
		twoFactorEnabled: true,
		twoFactorSecret: "OBQXG43XN5ZGILLQ",
	},
	{
		id: "usr_luzrod",
		name: "Luzrod",
		email: "luzrod@memora.hub",
		password: "lu4r-6jhs",
		roleId: "legacy_resp_polyvalent",
		entityAccess: ["doigby"],
		twoFactorEnabled: true,
		twoFactorSecret: "PFRG65LTOVRXI33S",
	},
	{
		id: "usr_benji",
		name: "Benji",
		email: "benji@memora.hub",
		password: "be9j-1pkl",
		roleId: "legacy_resp_polyvalent",
		entityAccess: ["doigby"],
		twoFactorEnabled: true,
		twoFactorSecret: "QDXG6ZTPOZSXE3LU",
	},
	{
		id: "usr_shiny",
		name: "Shiny",
		email: "shiny@memora.hub",
		password: "sh3y-5mtv",
		roleId: "momentum_talent",
		entityAccess: ["inoxtag", "michou"],
		twoFactorEnabled: true,
		twoFactorSecret: "RE4TG6ZTN52XK4TT",
	},
	{
		id: "usr_flo",
		name: "Flo",
		email: "flo@memora.hub",
		password: "fl8o-2zcq",
		roleId: "momentum_talent",
		entityAccess: ["inoxtag", "michou"],
		twoFactorEnabled: true,
		twoFactorSecret: "SFQXG43XN5XHEZLS",
	},
];

/** Map from user ID to user object for fast lookup */
export const USER_BY_ID: Record<string, SeedUser> = Object.fromEntries(SEED_USERS.map((u) => [u.id, u]));

/** Map from email to user object */
export const USER_BY_EMAIL: Record<string, SeedUser> = Object.fromEntries(SEED_USERS.map((u) => [u.email, u]));

/**
 * Get user by ID.
 * @param id - User identifier
 * @returns User object or undefined
 */
export function getUserById(id: string): SeedUser | undefined {
	return USER_BY_ID[id];
}

/**
 * Get user by email.
 * @param email - User email
 * @returns User object or undefined
 */
export function getUserByEmail(email: string): SeedUser | undefined {
	return USER_BY_EMAIL[email];
}

/**
 * Get users filtered by role.
 * @param roleId - Role to filter by
 * @returns Array of users with that role
 */
export function getUsersByRole(roleId: RoleId): SeedUser[] {
	return SEED_USERS.filter((u) => u.roleId === roleId);
}

/**
 * Get users who have access to a specific entity.
 * @param entityId - Entity ID to check
 * @returns Array of users with access to the entity
 */
export function getUsersByEntity(entityId: string): SeedUser[] {
	return SEED_USERS.filter((u) => u.entityAccess.includes("*") || u.entityAccess.includes(entityId));
}
