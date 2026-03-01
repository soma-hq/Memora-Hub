import { prisma } from "@/lib/prisma";
import { LogService } from "@/services/LogService";
import { LogAction } from "@/constants";


/** Input data for creating a training session */
interface CreateTrainingInput {
	groupId: string;
	title: string;
	description: string;
	category: string;
	instructorName: string;
	startDate: string;
	endDate: string;
	maxParticipants?: number;
	materials?: string[];
}

/** Training session and enrollment service */
export class TrainingService {
	/**
	 * Get training by ID
	 * @param id Training ID
	 * @returns Training with details, or null
	 */

	static async getById(id: string) {
		// Query training with group relation and participant details
		return prisma.training.findUnique({
			where: { id },
			include: {
				group: { select: { id: true, name: true } },
				participants: {
					include: {
						user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
					},
				},
				_count: { select: { participants: true } },
			},
		});
	}

	/**
	 * Get trainings by group
	 * @param groupId Group ID
	 * @param page Page number
	 * @param pageSize Trainings per page
	 * @returns Paginated trainings and count
	 */

	static async getByGroup(groupId: string, page = 1, pageSize = 20) {
		// Calculate offset for pagination
		const skip = (page - 1) * pageSize;

		// Execute training query and count in parallel
		const [trainings, total] = await Promise.all([
			prisma.training.findMany({
				where: { groupId },
				skip,
				take: pageSize,
				include: {
					_count: { select: { participants: true } },
				},
				orderBy: { startDate: "desc" },
			}),
			prisma.training.count({ where: { groupId } }),
		]);

		return { trainings, total, page, pageSize };
	}

	/**
	 * Create a new training
	 * @param input Training creation fields
	 * @param performedBy Actor user ID
	 * @returns Created training object
	 */

	static async create(input: CreateTrainingInput, performedBy?: string) {
		// Insert the training record with parsed dates
		const training = await prisma.training.create({
			data: {
				groupId: input.groupId,
				title: input.title,
				description: input.description,
				category: input.category as never,
				instructorName: input.instructorName,
				startDate: new Date(input.startDate),
				endDate: new Date(input.endDate),
				maxParticipants: input.maxParticipants ?? 20,
				materials: input.materials ?? [],
			},
		});

		// Log the training creation
		await LogService.log(LogAction.Create, "training", training.id, performedBy);

		return training;
	}

	/**
	 * Update a training
	 * @param id Training ID
	 * @param input Partial update data
	 * @param performedBy Actor user ID
	 * @returns Updated training object
	 */

	static async update(id: string, input: Partial<CreateTrainingInput>, performedBy?: string) {
		// Apply partial update with conditional field mapping
		const training = await prisma.training.update({
			where: { id },
			data: {
				...(input.title !== undefined && { title: input.title }),
				...(input.description !== undefined && { description: input.description }),
				...(input.category !== undefined && { category: input.category as never }),
				...(input.instructorName !== undefined && { instructorName: input.instructorName }),
				...(input.startDate !== undefined && { startDate: new Date(input.startDate) }),
				...(input.endDate !== undefined && { endDate: new Date(input.endDate) }),
				...(input.maxParticipants !== undefined && { maxParticipants: input.maxParticipants }),
				...(input.materials !== undefined && { materials: input.materials }),
			},
		});

		// Log the training update
		await LogService.log(LogAction.Update, "training", id, performedBy);

		return training;
	}

	/**
	 * Delete a training
	 * @param id Training ID
	 * @param performedBy Actor user ID
	 */

	static async delete(id: string, performedBy?: string) {
		// Remove the training record
		await prisma.training.delete({ where: { id } });

		// Log the training deletion
		await LogService.log(LogAction.Delete, "training", id, performedBy);
	}

	/**
	 * Enroll user in training
	 * @param trainingId Training ID
	 * @param userId User ID
	 * @throws Error if training is not found or is full
	 */

	static async enroll(trainingId: string, userId: string) {
		// Retrieve training with current participant count
		const training = await prisma.training.findUnique({
			where: { id: trainingId },
			include: { _count: { select: { participants: true } } },
		});

		// Validate training exists
		if (!training) throw new Error("Training not found");

		// Validate capacity is not exceeded
		if (training._count.participants >= training.maxParticipants) {
			throw new Error("Training is full");
		}

		// Create the enrollment record
		await prisma.trainingParticipant.create({
			data: { trainingId, userId },
		});
	}

	/**
	 * Unenroll user from training
	 * @param trainingId Training ID
	 * @param userId User ID
	 */

	static async unenroll(trainingId: string, userId: string) {
		// Delete matching enrollment records
		await prisma.trainingParticipant.deleteMany({
			where: { trainingId, userId },
		});
	}

	/**
	 * Get trainings by user
	 * @param userId User ID
	 * @returns Trainings with group info
	 */

	static async getByUser(userId: string) {
		// Query trainings where user is a participant
		return prisma.training.findMany({
			where: {
				participants: { some: { userId } },
			},
			include: {
				group: { select: { id: true, name: true } },
				_count: { select: { participants: true } },
			},
			orderBy: { startDate: "desc" },
		});
	}

	/**
	 * Update training status
	 * @param id Training ID
	 * @param status New status value
	 * @param performedBy Actor user ID
	 */

	static async updateStatus(id: string, status: string, performedBy?: string) {
		// Update the training status field
		await prisma.training.update({
			where: { id },
			data: { status: status as never },
		});

		// Log the status change with details
		await LogService.log(LogAction.Update, "training", id, performedBy, `status:${status}`);
	}
}
