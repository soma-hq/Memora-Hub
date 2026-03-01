import { prisma } from "@/lib/prisma";
import { LogService } from "@/services/LogService";
import { LogAction, AbsenceStatus } from "@/constants";
import type { CreateAbsenceFormData } from "@/lib/validators/schemas";


/** Absence request and approval service */
export class AbsenceService {
	/**
	 * Get absence by ID
	 * @param id Absence ID
	 * @returns Absence with relations, or null
	 */

	static async getById(id: string) {
		// Query with relations
		return prisma.absence.findUnique({
			where: { id },
			include: {
				user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
				approver: { select: { id: true, firstName: true, lastName: true } },
			},
		});
	}

	/**
	 * Get absences by user
	 * @param userId User ID
	 * @param status Optional status filter
	 * @returns Absences with approver info
	 */

	static async getByUser(userId: string, status?: string) {
		// Filter by user/status
		return prisma.absence.findMany({
			where: {
				userId,
				...(status && { status: status as never }),
			},
			include: {
				approver: { select: { id: true, firstName: true, lastName: true } },
			},
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Get all absences paginated
	 * @param page Page number
	 * @param pageSize Absences per page
	 * @param status Optional status filter
	 * @returns Paginated absences and count
	 */

	static async getAll(page = 1, pageSize = 20, status?: string) {
		// Calculate offset for pagination
		const skip = (page - 1) * pageSize;

		// Parallel query + count
		const [absences, total] = await Promise.all([
			prisma.absence.findMany({
				where: status ? { status: status as never } : undefined,
				skip,
				take: pageSize,
				include: {
					user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
					approver: { select: { id: true, firstName: true, lastName: true } },
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.absence.count({ where: status ? { status: status as never } : undefined }),
		]);

		return { absences, total, page, pageSize };
	}

	/**
	 * Create an absence request
	 * @param userId Requesting user ID
	 * @param input Absence creation data
	 * @returns Created absence object
	 */

	static async create(userId: string, input: CreateAbsenceFormData) {
		// Insert with parsed dates
		const absence = await prisma.absence.create({
			data: {
				userId,
				type: input.type as never,
				startDate: new Date(input.startDate),
				endDate: new Date(input.endDate),
				reason: input.reason,
				status: AbsenceStatus.Pending as never,
			},
		});

		// Log the absence creation
		await LogService.log(LogAction.Create, "absence", absence.id, userId);

		return absence;
	}

	/**
	 * Approve a pending absence request
	 * @param id Absence ID
	 * @param approvedBy Approver user ID
	 * @returns Approved absence
	 */

	static async approve(id: string, approvedBy: string) {
		// Set approved + approver
		const absence = await prisma.absence.update({
			where: { id },
			data: {
				status: AbsenceStatus.Approved as never,
				approvedBy,
				approvedAt: new Date(),
			},
		});

		// Log the approval action
		await LogService.log(LogAction.Approve, "absence", id, approvedBy);

		return absence;
	}

	/**
	 * Reject a pending absence request
	 * @param id Absence ID
	 * @param rejectedBy Rejector user ID
	 * @returns Rejected absence
	 */

	static async reject(id: string, rejectedBy: string) {
		// Set rejected + reviewer
		const absence = await prisma.absence.update({
			where: { id },
			data: {
				status: AbsenceStatus.Rejected as never,
				approvedBy: rejectedBy,
				approvedAt: new Date(),
			},
		});

		// Log the rejection action
		await LogService.log(LogAction.Reject, "absence", id, rejectedBy);

		return absence;
	}

	/**
	 * Delete an absence
	 * @param id Absence ID
	 * @param performedBy Actor user ID
	 */

	static async delete(id: string, performedBy?: string) {
		// Remove the absence record
		await prisma.absence.delete({ where: { id } });

		// Log the absence deletion
		await LogService.log(LogAction.Delete, "absence", id, performedBy);
	}

	/**
	 * Count pending absences
	 * @returns Pending absence count
	 */

	static async countPending(): Promise<number> {
		// Count absences with pending status
		return prisma.absence.count({
			where: { status: AbsenceStatus.Pending as never },
		});
	}

	/**
	 * Get absences by date range
	 * @param startDate Start of the date range
	 * @param endDate End of the date range
	 * @returns Approved absences in range
	 */

	static async getByDateRange(startDate: Date, endDate: Date) {
		// Query overlapping approved absences
		return prisma.absence.findMany({
			where: {
				status: AbsenceStatus.Approved as never,
				startDate: { lte: endDate },
				endDate: { gte: startDate },
			},
			include: {
				user: { select: { id: true, firstName: true, lastName: true } },
			},
		});
	}
}
