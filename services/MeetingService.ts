import { prisma } from "@/lib/prisma";
import { LogService } from "@/services/LogService";
import { LogAction } from "@/constants";
import type { CreateMeetingFormData } from "@/lib/validators/schemas";


/** Meeting CRUD and attendee service */
export class MeetingService {
	/**
	 * Get meeting by ID
	 * @param id Meeting ID
	 * @returns Meeting with details, or null
	 */

	static async getById(id: string) {
		// Query meeting with attendees and group relation
		return prisma.meeting.findUnique({
			where: { id },
			include: {
				attendees: {
					include: {
						user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
					},
				},
				group: { select: { id: true, name: true } },
			},
		});
	}

	/**
	 * Get meetings by group
	 * @param groupId Group ID
	 * @param page Page number
	 * @param pageSize Meetings per page
	 * @returns Paginated meetings and count
	 */

	static async getByGroup(groupId: string, page = 1, pageSize = 20) {
		// Calculate offset for pagination
		const skip = (page - 1) * pageSize;

		// Execute meeting query and count in parallel
		const [meetings, total] = await Promise.all([
			prisma.meeting.findMany({
				where: { groupId },
				skip,
				take: pageSize,
				include: {
					attendees: {
						include: {
							user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
						},
					},
				},
				orderBy: { date: "desc" },
			}),
			prisma.meeting.count({ where: { groupId } }),
		]);

		return { meetings, total, page, pageSize };
	}

	/**
	 * Get meetings by user
	 * @param userId User ID
	 * @returns Meetings with group info
	 */

	static async getByUser(userId: string) {
		// Query meetings where user is an attendee
		return prisma.meeting.findMany({
			where: {
				attendees: { some: { userId } },
			},
			include: {
				group: { select: { id: true, name: true } },
				_count: { select: { attendees: true } },
			},
			orderBy: { date: "desc" },
		});
	}

	/**
	 * Create a new meeting
	 * @param groupId Parent group ID
	 * @param input Meeting creation data
	 * @param performedBy Actor user ID
	 * @returns Created meeting object
	 */

	static async create(groupId: string, input: CreateMeetingFormData, performedBy?: string) {
		// Insert meeting with optional attendee list
		const meeting = await prisma.meeting.create({
			data: {
				title: input.title,
				groupId,
				date: new Date(input.date),
				startTime: input.time,
				endTime: input.duration || "",
				location: input.location,
				notes: input.description,
				attendees: input.participants
					? {
							create: input.participants.map((userId) => ({ userId })),
						}
					: undefined,
			},
		});

		// Log the meeting creation
		await LogService.log(LogAction.Create, "meeting", meeting.id, performedBy);

		return meeting;
	}

	/**
	 * Update a meeting
	 * @param id Meeting ID
	 * @param input Partial update data
	 * @param performedBy Actor user ID
	 * @returns Updated meeting object
	 */

	static async update(id: string, input: Partial<CreateMeetingFormData>, performedBy?: string) {
		// Apply partial update with date/time field mapping
		const meeting = await prisma.meeting.update({
			where: { id },
			data: {
				...(input.title !== undefined && { title: input.title }),
				...(input.date !== undefined && { date: new Date(input.date) }),
				...(input.time !== undefined && { startTime: input.time }),
				...(input.duration !== undefined && { endTime: input.duration }),
				...(input.location !== undefined && { location: input.location }),
				...(input.description !== undefined && { notes: input.description }),
			},
		});

		// Log the meeting update
		await LogService.log(LogAction.Update, "meeting", id, performedBy);

		return meeting;
	}

	/**
	 * Delete a meeting
	 * @param id Meeting ID
	 * @param performedBy Actor user ID
	 */

	static async delete(id: string, performedBy?: string) {
		// Remove the meeting record
		await prisma.meeting.delete({ where: { id } });

		// Log the meeting deletion
		await LogService.log(LogAction.Delete, "meeting", id, performedBy);
	}

	/**
	 * Add meeting attendee
	 * @param meetingId Meeting ID
	 * @param userId User ID
	 */

	static async addAttendee(meetingId: string, userId: string) {
		// Create the attendee record
		await prisma.meetingAttendee.create({
			data: { meetingId, userId },
		});
	}

	/**
	 * Remove meeting attendee
	 * @param meetingId Meeting ID
	 * @param userId User ID
	 */

	static async removeAttendee(meetingId: string, userId: string) {
		// Delete matching attendee records
		await prisma.meetingAttendee.deleteMany({
			where: { meetingId, userId },
		});
	}

	/**
	 * Get upcoming meetings
	 * @param groupId Group ID
	 * @param limit Max results
	 * @returns Future meetings with counts
	 */

	static async getUpcoming(groupId: string, limit = 5) {
		// Query future meetings ordered by ascending date
		return prisma.meeting.findMany({
			where: {
				groupId,
				date: { gte: new Date() },
			},
			include: {
				_count: { select: { attendees: true } },
			},
			orderBy: { date: "asc" },
			take: limit,
		});
	}
}
