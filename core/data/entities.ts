/** Entity definition for managed content creators */
export interface Entity {
	id: string;
	name: string;
	avatar: string;
	color: string;
}

/**
 * All managed entities (content creators).
 * Each entity represents a creator whose moderation, tasks, projects, etc. are managed via the Hub.
 */
export const ENTITIES: Entity[] = [
	{ id: "michou", name: "Michou", avatar: "/avatars/michou.png", color: "#FF6B6B" },
	{ id: "doigby", name: "Doigby", avatar: "/avatars/doigby.png", color: "#4ECDC4" },
	{ id: "inoxtag", name: "Inoxtag", avatar: "/avatars/inoxtag.png", color: "#45B7D1" },
	{ id: "anthony", name: "Anthony", avatar: "/avatars/anthony.png", color: "#96CEB4" },
];

/** Map from entity ID to entity object for fast lookup */
export const ENTITY_BY_ID: Record<string, Entity> = Object.fromEntries(ENTITIES.map((e) => [e.id, e]));

/** All entity IDs */
export const ENTITY_IDS: string[] = ENTITIES.map((e) => e.id);

/**
 * Get entity by ID.
 * @param id - Entity identifier
 * @returns Entity object or undefined
 */
export function getEntityById(id: string): Entity | undefined {
	return ENTITY_BY_ID[id];
}

/**
 * Get entity options for select inputs.
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
 * Resolve entity access to actual entity objects.
 * Wildcard ["*"] returns all entities.
 * @param entityAccess - Array of entity IDs or ["*"] for all
 * @returns Array of resolved Entity objects
 */
export function resolveEntityAccess(entityAccess: string[]): Entity[] {
	if (entityAccess.includes("*")) return [...ENTITIES];
	return entityAccess.map((id) => ENTITY_BY_ID[id]).filter(Boolean);
}
