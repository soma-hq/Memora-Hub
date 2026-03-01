import { prisma } from "@/lib/prisma";
import { LogService } from "@/services/LogService";
import { LogAction } from "@/constants";


/** Input data for creating a job offer */
interface CreateJobOfferInput {
	groupId: string;
	title: string;
	description: string;
	department: string;
	location: string;
	contractType: string;
	requirements?: string[];
}

/** Input data for creating a candidate */
interface CreateCandidateInput {
	offerId: string;
	name: string;
	email: string;
	avatar?: string;
	userId?: string;
	notes?: string;
}

/** Job offer and candidate service */
export class RecruitmentService {
	/**
	 * Get offer by ID
	 * @param id Job offer ID
	 * @returns Job offer or null
	 */

	static async getOfferById(id: string) {
		// Query with relations
		return prisma.jobOffer.findUnique({
			where: { id },
			include: {
				group: { select: { id: true, name: true } },
				candidates: true,
				_count: { select: { candidates: true } },
			},
		});
	}

	/**
	 * Get offers by group
	 * @param groupId Group ID
	 * @param page Page number
	 * @param pageSize Offers per page
	 * @returns Paginated offers and count
	 */

	static async getOffersByGroup(groupId: string, page = 1, pageSize = 20) {
		// Calculate offset for pagination
		const skip = (page - 1) * pageSize;

		// Parallel query + count
		const [offers, total] = await Promise.all([
			prisma.jobOffer.findMany({
				where: { groupId },
				skip,
				take: pageSize,
				include: {
					_count: { select: { candidates: true } },
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.jobOffer.count({ where: { groupId } }),
		]);

		return { offers, total, page, pageSize };
	}

	/**
	 * Create a job offer
	 * @param input Job offer creation fields
	 * @param performedBy Actor user ID
	 * @returns Created job offer object
	 */

	static async createOffer(input: CreateJobOfferInput, performedBy?: string) {
		// Insert the job offer record
		const offer = await prisma.jobOffer.create({
			data: {
				groupId: input.groupId,
				title: input.title,
				description: input.description,
				department: input.department,
				location: input.location,
				contractType: input.contractType as never,
				requirements: input.requirements ?? [],
			},
		});

		// Log the offer creation
		await LogService.log(LogAction.Create, "job_offer", offer.id, performedBy);

		return offer;
	}

	/**
	 * Update a job offer
	 * @param id Offer ID
	 * @param input Partial update data
	 * @param performedBy Actor user ID
	 * @returns Updated job offer object
	 */

	static async updateOffer(id: string, input: Partial<CreateJobOfferInput>, performedBy?: string) {
		// Apply partial update
		const offer = await prisma.jobOffer.update({
			where: { id },
			data: {
				...(input.title !== undefined && { title: input.title }),
				...(input.description !== undefined && { description: input.description }),
				...(input.department !== undefined && { department: input.department }),
				...(input.location !== undefined && { location: input.location }),
				...(input.contractType !== undefined && { contractType: input.contractType as never }),
				...(input.requirements !== undefined && { requirements: input.requirements }),
			},
		});

		// Log the offer update
		await LogService.log(LogAction.Update, "job_offer", id, performedBy);

		return offer;
	}

	/**
	 * Delete a job offer
	 * @param id Offer ID
	 * @param performedBy Actor user ID
	 */

	static async deleteOffer(id: string, performedBy?: string) {
		// Remove the job offer record
		await prisma.jobOffer.delete({ where: { id } });

		// Log the offer deletion
		await LogService.log(LogAction.Delete, "job_offer", id, performedBy);
	}

	/**
	 * Update offer status
	 * @param id Offer ID
	 * @param status New status value
	 * @param performedBy Actor user ID
	 */

	static async updateOfferStatus(id: string, status: string, performedBy?: string) {
		// Update the offer status field
		await prisma.jobOffer.update({
			where: { id },
			data: { status: status as never },
		});

		// Log status change
		await LogService.log(LogAction.Update, "job_offer", id, performedBy, `status:${status}`);
	}

	/**
	 * Add a candidate
	 * @param input Candidate creation fields
	 * @param performedBy Actor user ID
	 * @returns Created candidate object
	 */

	static async addCandidate(input: CreateCandidateInput, performedBy?: string) {
		// Insert the candidate record
		const candidate = await prisma.candidate.create({
			data: {
				offerId: input.offerId,
				name: input.name,
				email: input.email,
				avatar: input.avatar,
				userId: input.userId,
				notes: input.notes,
			},
		});

		// Log the candidate creation
		await LogService.log(LogAction.Create, "candidate", candidate.id, performedBy);

		return candidate;
	}

	/**
	 * Update candidate status
	 * @param id Candidate ID
	 * @param status New status value
	 * @param performedBy Actor user ID
	 */

	static async updateCandidateStatus(id: string, status: string, performedBy?: string) {
		// Update the candidate status field
		await prisma.candidate.update({
			where: { id },
			data: { status: status as never },
		});

		// Log status change
		await LogService.log(LogAction.Update, "candidate", id, performedBy, `status:${status}`);
	}

	/**
	 * Delete a candidate
	 * @param id Candidate ID
	 * @param performedBy Actor user ID
	 */

	static async deleteCandidate(id: string, performedBy?: string) {
		// Remove the candidate record
		await prisma.candidate.delete({ where: { id } });

		// Log the candidate deletion
		await LogService.log(LogAction.Delete, "candidate", id, performedBy);
	}

	/**
	 * Get candidates by offer
	 * @param offerId Job offer ID
	 * @returns Sorted candidate list
	 */

	static async getCandidatesByOffer(offerId: string) {
		// Filter by offer
		return prisma.candidate.findMany({
			where: { offerId },
			orderBy: { appliedAt: "desc" },
		});
	}
}
