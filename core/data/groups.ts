import groupsConfig from "@/core/configurations/default/entities/groups.json";

/** Group definition linked to a managed entity */
export interface EntityGroup {
	id: string;
	name: string;
	entityId: string;
	type: string;
	description: string;
}

/** Full list of configured groups */
export const ENTITY_GROUPS: EntityGroup[] = groupsConfig.groups;

/** Fast lookup by group ID */
export const GROUP_BY_ID: Record<string, EntityGroup> = Object.fromEntries(
	ENTITY_GROUPS.map((group) => [group.id, group]),
);

/** Fast lookup by entity ID */
export const GROUP_BY_ENTITY_ID: Record<string, EntityGroup> = Object.fromEntries(
	ENTITY_GROUPS.map((group) => [group.entityId, group]),
);

/** Group ID to entity ID mapping */
export const GROUP_TO_ENTITY_ID: Record<string, string> = Object.fromEntries(
	ENTITY_GROUPS.map((group) => [group.id, group.entityId]),
);

/** Entity ID to group ID mapping */
export const ENTITY_TO_GROUP_ID: Record<string, string> = Object.fromEntries(
	ENTITY_GROUPS.map((group) => [group.entityId, group.id]),
);

/**
 * Resolve a route/API group identifier to a database group ID.
 * @param groupOrEntityId - Route group ID or entity ID
 * @returns Database group ID or null
 */
export function resolveGroupId(groupOrEntityId: string): string | null {
	if (!groupOrEntityId) return null;
	if (GROUP_BY_ID[groupOrEntityId]) return groupOrEntityId;
	return ENTITY_TO_GROUP_ID[groupOrEntityId] ?? null;
}

/**
 * Resolve any route/API identifier to an entity ID.
 * @param groupOrEntityId - Route group ID or entity ID
 * @returns Entity ID or null
 */
export function resolveEntityId(groupOrEntityId: string): string | null {
	if (!groupOrEntityId) return null;
	if (GROUP_BY_ENTITY_ID[groupOrEntityId]) return groupOrEntityId;
	return GROUP_TO_ENTITY_ID[groupOrEntityId] ?? null;
}
