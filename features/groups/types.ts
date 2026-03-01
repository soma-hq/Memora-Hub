// Constants & types
import type { BadgeVariant } from "@/core/design/states";


/** Member of a group */
export interface GroupMember {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role: GroupRole;
}

/** Group entity with members and metadata */
export interface Group {
	id: string;
	name: string;
	description: string;
	members: GroupMember[];
	projects: number;
	status: GroupStatus;
	createdAt: string;
}

/** Possible group statuses */
export type GroupStatus = "active" | "inactive";

/** Possible group member roles */
export type GroupRole = "owner" | "admin" | "manager" | "collaborator" | "guest";

/** Badge variant mapping for group roles */
export const roleVariantMap: Record<GroupRole, BadgeVariant> = {
	owner: "primary",
	admin: "info",
	manager: "warning",
	collaborator: "success",
	guest: "neutral",
} as const;

/** Localized role labels */
export const roleLabelMap: Record<GroupRole, string> = {
	owner: "Proprietaire",
	admin: "Administrateur",
	manager: "Gestionnaire",
	collaborator: "Collaborateur",
	guest: "Invite",
} as const;

/** Localized status labels */
export const statusLabelMap: Record<GroupStatus, string> = {
	active: "Actif",
	inactive: "Inactif",
} as const;

/** Badge variant mapping for group statuses */
export const statusVariantMap: Record<GroupStatus, BadgeVariant> = {
	active: "success",
	inactive: "neutral",
} as const;

/** Form data for group creation and edition */
export interface GroupFormData {
	name: string;
	description: string;
	status: GroupStatus;
}
