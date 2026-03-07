import type { Role } from "@prisma/client";
import { resolveEntityId, resolveGroupId, ENTITY_TO_GROUP_ID } from "@/core/data/groups";

/** Minimal authenticated user shape required for entity scoping */
export interface EntityScopedUser {
	role: Role;
	roleId?: string | null;
	entityAccess?: string[];
	groupMemberships?: Array<{ group: { id: string } }>;
}

/**
 * Check whether the user has full multi-entity access.
 * @param user - Authenticated user
 * @returns True for owner-level users
 */
export function hasGlobalEntityAccess(user: EntityScopedUser): boolean {
	if (user.role === "Owner") return true;
	if (user.roleId === "owner") return true;
	return (user.entityAccess ?? []).includes("*");
}

/**
 * Resolve allowed entity IDs for a user.
 * @param user - Authenticated user
 * @returns Null for full access, otherwise allowed entity IDs
 */
export function getAllowedEntityIds(user: EntityScopedUser): string[] | null {
	if (hasGlobalEntityAccess(user)) return null;
	const source = user.entityAccess ?? [];
	return [...new Set(source.filter(Boolean))];
}

/**
 * Resolve allowed database group IDs for a user.
 * @param user - Authenticated user
 * @returns Null for full access, otherwise allowed group IDs
 */
export function getAllowedGroupIds(user: EntityScopedUser): string[] | null {
	if (hasGlobalEntityAccess(user)) return null;

	const groupIdsFromEntities = (user.entityAccess ?? [])
		.map((entityId) => ENTITY_TO_GROUP_ID[entityId])
		.filter(Boolean);
	const groupIdsFromMemberships = (user.groupMemberships ?? []).map((membership) => membership.group.id);

	return [...new Set([...groupIdsFromEntities, ...groupIdsFromMemberships])];
}

/**
 * Check whether a user can access an entity.
 * @param user - Authenticated user
 * @param entityId - Target entity ID
 * @returns True if access is allowed
 */
export function canAccessEntityId(user: EntityScopedUser, entityId: string): boolean {
	const allowedEntityIds = getAllowedEntityIds(user);
	if (!allowedEntityIds) return true;
	return allowedEntityIds.includes(entityId);
}

/**
 * Check whether a user can access a group or route group identifier.
 * @param user - Authenticated user
 * @param groupOrEntityId - Group ID or entity ID
 * @returns True if access is allowed
 */
export function canAccessGroupId(user: EntityScopedUser, groupOrEntityId: string): boolean {
	const resolvedEntityId = resolveEntityId(groupOrEntityId);
	if (!resolvedEntityId) return false;
	return canAccessEntityId(user, resolvedEntityId);
}

/**
 * Normalize and authorize a group identifier for DB queries.
 * @param user - Authenticated user
 * @param groupOrEntityId - Group ID or entity ID
 * @returns Resolved DB group ID or null if forbidden/invalid
 */
export function resolveAuthorizedGroupId(user: EntityScopedUser, groupOrEntityId: string): string | null {
	const normalizedGroupId = resolveGroupId(groupOrEntityId);
	if (!normalizedGroupId) return null;
	if (!canAccessGroupId(user, normalizedGroupId)) return null;
	return normalizedGroupId;
}

/**
 * Normalize and authorize an entity identifier.
 * @param user - Authenticated user
 * @param groupOrEntityId - Group ID or entity ID
 * @returns Resolved entity ID or null if forbidden/invalid
 */
export function resolveAuthorizedEntityId(user: EntityScopedUser, groupOrEntityId: string): string | null {
	const normalizedEntityId = resolveEntityId(groupOrEntityId);
	if (!normalizedEntityId) return null;
	if (!canAccessEntityId(user, normalizedEntityId)) return null;
	return normalizedEntityId;
}
