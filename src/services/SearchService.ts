import { prisma } from "@/lib/prisma";


/** Full-text search service */
export class SearchService {
	/**
	 * Search users
	 * @param query Search term
	 * @param limit Max results
	 * @returns Matching users
	 */

	static async searchUsers(query: string, limit = 5) {
		// Case-insensitive name/email match
		return prisma.user.findMany({
			where: {
				OR: [
					{ firstName: { contains: query, mode: "insensitive" } },
					{ lastName: { contains: query, mode: "insensitive" } },
					{ email: { contains: query, mode: "insensitive" } },
				],
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				avatar: true,
				role: true,
			},
			take: limit,
		});
	}

	/**
	 * Search projects
	 * @param query Search term
	 * @param limit Max results
	 * @returns Matching projects
	 */

	static async searchProjects(query: string, limit = 5) {
		// Match name or description
		return prisma.project.findMany({
			where: {
				OR: [
					{ name: { contains: query, mode: "insensitive" } },
					{ description: { contains: query, mode: "insensitive" } },
				],
			},
			select: {
				id: true,
				name: true,
				description: true,
				groupId: true,
				status: true,
			},
			take: limit,
		});
	}

	/**
	 * Search tasks
	 * @param query Search term
	 * @param limit Max results
	 * @returns Matching task records
	 */

	static async searchTasks(query: string, limit = 5) {
		// Match title or description
		return prisma.task.findMany({
			where: {
				OR: [
					{ title: { contains: query, mode: "insensitive" } },
					{ description: { contains: query, mode: "insensitive" } },
				],
			},
			select: {
				id: true,
				title: true,
				status: true,
				projectId: true,
				project: { select: { groupId: true } },
			},
			take: limit,
		});
	}

	/**
	 * Search meetings
	 * @param query Search term
	 * @param limit Max results
	 * @returns Matching meetings
	 */

	static async searchMeetings(query: string, limit = 5) {
		// Query meetings matching title
		return prisma.meeting.findMany({
			where: {
				title: { contains: query, mode: "insensitive" },
			},
			select: {
				id: true,
				title: true,
				date: true,
				groupId: true,
				type: true,
			},
			take: limit,
		});
	}

	/**
	 * Search groups
	 * @param query Search term
	 * @param limit Max results
	 * @returns Matching groups
	 */

	static async searchGroups(query: string, limit = 5) {
		// Query groups matching name
		return prisma.group.findMany({
			where: {
				name: { contains: query, mode: "insensitive" },
			},
			select: {
				id: true,
				name: true,
				description: true,
			},
			take: limit,
		});
	}
}
