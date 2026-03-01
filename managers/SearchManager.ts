import { SearchService } from "@/services/SearchService";


// Allowed entity types in search results
export type SearchResultType = "user" | "project" | "task" | "meeting" | "group";

// Unified search result across all entity types
export interface SearchResult {
	type: SearchResultType;
	id: string;
	label: string;
	description?: string;
	href: string;
}

// Orchestrates global search across all entity types
export class SearchManager {
	/**
	 * Search all entity types
	 * @param query Search query string
	 * @param limit Max results per entity type
	 * @returns Aggregated search results
	 */

	static async globalSearch(query: string, limit = 5): Promise<SearchResult[]> {
		// Reject queries that are too short
		if (!query || query.trim().length < 2) return [];

		// Execute all entity searches in parallel
		const [users, projects, tasks, meetings, groups] = await Promise.allSettled([
			SearchService.searchUsers(query, limit),
			SearchService.searchProjects(query, limit),
			SearchService.searchTasks(query, limit),
			SearchService.searchMeetings(query, limit),
			SearchService.searchGroups(query, limit),
		]);

		const results: SearchResult[] = [];

		// Map user matches to unified format
		if (users.status === "fulfilled") {
			results.push(
				...users.value.map((u) => ({
					type: "user" as const,
					id: u.id,
					label: `${u.firstName} ${u.lastName}`,
					description: u.email,
					href: `/users/${u.id}`,
				})),
			);
		}

		// Map project matches to unified format
		if (projects.status === "fulfilled") {
			results.push(
				...projects.value.map((p) => ({
					type: "project" as const,
					id: p.id,
					label: p.name,
					description: p.description ?? undefined,
					href: `/hub/${p.groupId}/projects/${p.id}`,
				})),
			);
		}

		// Map task matches to unified format
		if (tasks.status === "fulfilled") {
			results.push(
				...tasks.value.map((t) => ({
					type: "task" as const,
					id: t.id,
					label: t.title,
					href: `/hub/${t.project.groupId}/tasks/${t.id}`,
				})),
			);
		}

		// Map meeting matches to unified format
		if (meetings.status === "fulfilled") {
			results.push(
				...meetings.value.map((m) => ({
					type: "meeting" as const,
					id: m.id,
					label: m.title,
					description: m.date.toISOString(),
					href: `/hub/${m.groupId}/meetings/${m.id}`,
				})),
			);
		}

		// Map group matches to unified format
		if (groups.status === "fulfilled") {
			results.push(
				...groups.value.map((g) => ({
					type: "group" as const,
					id: g.id,
					label: g.name,
					description: g.description ?? undefined,
					href: `/hub/${g.id}`,
				})),
			);
		}

		return results;
	}
}
