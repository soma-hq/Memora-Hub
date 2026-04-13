import type { RoleId } from "@/core/config/roles";
import type { Team } from "@/core/config/teams";
import type { AbsenceMode } from "@/features/operations/absences/absence-mode";
export { PageAccessModeLabel } from "@/constants";
export type { PageAccessModeValue } from "@/constants";
// Re-export variant map from design system
export { roleVariant } from "@/core/design/states";

/** Access entry linking a user to a group with a role */
export interface GroupAccess {
	groupId: string;
	groupName: string;
	role: string;
}

/** Core user model for list display */
export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	/** Discord-style role ID from the permission system */
	roleId: RoleId;
	avatar: string;
	group: string;
	status: "active" | "inactive";
	groupAccess?: GroupAccess[];
	/** Entity IDs the user can access. ["*"] = all entities */
	entityAccess: string[];
	/** TOTP base32 secret for two-factor authentication */
	twoFactorSecret?: string;
	/** Whether two-factor authentication is enabled */
	twoFactorEnabled: boolean;
}

/** Access entry linking a user to an entity with permissions */
export interface EntityAccess {
	entityId: string;
	entityName: string;
	logo: string;
	team: Team;
	joinedAt: string;
	permissions: string[];
}

/** Full user profile with personal info and multi-entity access */
export interface UserProfile {
	id: string;
	pseudo: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	birthdate: string;
	birthdayWish: boolean;
	languages: string[];
	avatar: string;

	// Discord
	discordUsername: string;
	discordId: string;

	// Social
	social: {
		twitter?: string;
		twitch?: string;
		youtube?: string;
		instagram?: string;
		reddit?: string;
	};

	// Organization
	entity: string;
	team: Team;
	division: 0 | 1 | 2 | 3;
	roleSecondary: string;
	arrivalDate: string;

	// Discord-style permission system fields
	/** Role ID from the permission system */
	roleId: RoleId;
	/** Entity IDs this user can access. ["*"] = all entities */
	entityAccess: string[];
	/** TOTP base32 secret for two-factor authentication */
	twoFactorSecret?: string;
	/** Whether two-factor authentication is enabled */
	twoFactorEnabled: boolean;

	// Status
	status: "active" | "inactive";

	// Absence mode
	absenceMode?: AbsenceMode;

	// Multi-entity access (legacy)
	entityAccessDetails: EntityAccess[];
}

/** Division icon paths indexed by division level */
export const DIVISION_ICONS: Record<number, string> = {
	0: "/icons/marsha/marshaSquad0.png",
	1: "/icons/marsha/marshaSquad1.png",
	2: "/icons/marsha/marshaSquad2.png",
	3: "/icons/marsha/marshaSquad3.png",
};

/** Division display labels indexed by division level */
export const DIVISION_LABELS: Record<number, string> = {
	0: "Recrue",
	1: "-->",
	2: "-->-->",
	3: "-->-->-->",
};

/** Marsha Squad team-level icon paths */
export const MARSHA_ICONS: Record<string, string> = {
	Owner: "/icons/marsha/marshaExecutive.png",
	"Marsha Teams": "/icons/marsha/marshaTeams.png",
	Legacy: "/icons/marsha/marshaLegacy.png",
};

/** Marsha Squad hierarchy entry for org charts and access display */
export interface MarshaHierarchy {
	role: "executive" | "responsable" | "legacy" | "division3" | "division2" | "division1" | "division0";
	label: string;
	description: string;
	level: number;
}

/** Ordered hierarchy levels from executive to recruit */
export const MARSHA_HIERARCHY: MarshaHierarchy[] = [
	{
		role: "executive",
		label: "Executive",
		description: "Dirige l'ensemble. Donne les ordres aux administrations Marsha Teams et Legacy.",
		level: 6,
	},
	{
		role: "responsable",
		label: "Responsable Marsha Squad",
		description: "À la tête des 4 divisions. Gère Momentum et Talent (Qualité).",
		level: 5,
	},
	{ role: "legacy", label: "Legacy", description: "Administration managériale. Hors division.", level: 4 },
	{ role: "division3", label: "Division 3", description: "Membres confirmés, référents.", level: 3 },
	{ role: "division2", label: "Division 2", description: "Membres intermédiaires.", level: 2 },
	{ role: "division1", label: "Division 1", description: "Membres juniors.", level: 1 },
	{ role: "division0", label: "Marsha Academy", description: "Recrues en période d'intégration.", level: 0 },
];

/** Form values for user creation and edition */
export interface UserFormValues {
	firstName: string;
	lastName: string;
	email: string;
	roleId: RoleId;
	password?: string;
	entityAccess: string[];
	twoFactorEnabled: boolean;
	groupAccess: GroupAccess[];
}

/** Available role options for select inputs (Discord-style) */
export const roleOptions: { label: string; value: RoleId }[] = [
	{ label: "Owner", value: "owner" },
	{ label: "Marsha Teams", value: "marsha_teams" },
	{ label: "Resp. Live & YouTube", value: "legacy_resp_live" },
	{ label: "Resp. Discord", value: "legacy_resp_discord" },
	{ label: "Resp. Polyvalent", value: "legacy_resp_polyvalent" },
	{ label: "Momentum & Talent", value: "momentum_talent" },
];

/** Available group options for select inputs */
export const availableGroups = [
	{ label: "Michou", value: "michou" },
	{ label: "Doigby", value: "doigby" },
	{ label: "Inoxtag", value: "inoxtag" },
	{ label: "Anthony", value: "anthony" },
] as const;

/** Localized status labels */
export const statusLabels: Record<User["status"], string> = {
	active: "Actif",
	inactive: "Inactif",
};
