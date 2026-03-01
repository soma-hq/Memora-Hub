import type { UserProfile } from "@/features/users/types";


/** User profiles array */
export const users: UserProfile[] = [];

/**
 * Finds a user profile by ID
 * @param id - User identifier to search for
 * @returns Matching user profile or undefined
 */
export function getUserById(id: string): UserProfile | undefined {
	return users.find((u) => u.id === id);
}

/**
 * Retrieves all unique entity names across users
 * @returns Sorted array of entity names
 */
export function getEntities(): string[] {
	const entities = new Set<string>();
	for (const user of users) {
		entities.add(user.entity);
	}
	return Array.from(entities).sort();
}
