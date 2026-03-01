import { prisma } from "@/lib/prisma";
import type { LogActionValue } from "@/constants";


/** Activity and error logging service */
export class LogService {
	/**
	 * Log an action
	 * @param action Action type
	 * @param entityType Type of entity affected
	 * @param entityId Entity ID
	 * @param userId Actor user ID
	 * @param details Extra context
	 */

	static async log(action: LogActionValue, entityType: string, entityId: string, userId?: string, details?: string) {
		// Insert log entry into database
		await prisma.log.create({
			data: {
				action: action as never,
				entityType,
				entityId,
				userId: userId ?? null,
				details: details ?? null,
			},
		});
	}

	/**
	 * Log an error
	 * @param source Source identifier
	 * @param error Error object to log
	 */

	static async logError(source: string, error: Error) {
		// Serialize error details and persist as a system log entry
		await prisma.log.create({
			data: {
				action: "CREATE" as never,
				entityType: `ERROR:${source}`,
				entityId: "system",
				details: JSON.stringify({ message: error.message, stack: error.stack }),
			},
		});
	}

	/**
	 * Get logs by entity
	 * @param entityType Entity type
	 * @param entityId Entity ID
	 * @returns Recent log entries
	 */

	static async getByEntity(entityType: string, entityId: string) {
		// Query logs filtered by entity type and ID
		return prisma.log.findMany({
			where: { entityType, entityId },
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Get logs by user
	 * @param userId User ID
	 * @param limit Max results
	 * @returns User's log entries
	 */

	static async getByUser(userId: string, limit = 50) {
		// Query logs filtered by user with pagination
		return prisma.log.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
			take: limit,
		});
	}

	/**
	 * Get recent logs
	 * @param limit Max results
	 * @returns Recent logs with user info
	 */

	static async getRecent(limit = 50) {
		// Query recent logs across all entities with user relation
		return prisma.log.findMany({
			orderBy: { createdAt: "desc" },
			take: limit,
			include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
		});
	}
}
