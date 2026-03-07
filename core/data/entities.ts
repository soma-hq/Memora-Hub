import entitiesConfig from "@/core/configurations/default/entities/entities.json";

/** Entity definition for managed content creators */
export interface Entity {
	id: string;
	name: string;
	avatar: string;
	color: string;
	type?: string;
}

// All managed entities — loaded from core/configurations/default/entities/entities.json
export const ENTITIES: Entity[] = entitiesConfig.entities;

// Map from entity ID to entity object for fast lookup
export const ENTITY_BY_ID: Record<string, Entity> = Object.fromEntries(ENTITIES.map((e) => [e.id, e]));

/** All entity IDs */
export const ENTITY_IDS: string[] = ENTITIES.map((e) => e.id);

/**
 * Get entity by ID
 * @param id - Entity identifier
 * @returns Entity object or undefined
 */
export function getEntityById(id: string): Entity | undefined {
	return ENTITY_BY_ID[id];
}

/**
 * Get entity options for select inputs
 * @returns Array of entity option objects
 */
export function getEntityOptions() {
	return ENTITIES.map((e) => ({
		label: e.name,
		value: e.id,
		avatar: e.avatar,
		color: e.color,
	}));
}

/**
 * Resolve entity access to actual entity objects
 * @param entityAccess - Array of entity IDs or ["*"] for all
 * @returns Array of resolved Entity objects
 */
export function resolveEntityAccess(entityAccess: string[]): Entity[] {
	if (entityAccess.includes("*")) return [...ENTITIES];
	return entityAccess.map((id) => ENTITY_BY_ID[id]).filter(Boolean);
}
