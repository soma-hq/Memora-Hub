import { prisma } from "@/lib/prisma";
import { LogService } from "@/services/LogService";
import { LogAction } from "@/constants";


/** Input data for creating a new group */
interface CreateGroupInput {
	name: string;
	description?: string;
	logoUrl?: string;
}

/** Group CRUD and membership service */
export class GroupService {
	/**
	 * Get group by ID
	 * @param id Group ID
	 * @returns Group with details, or null
	 */

	static async getById(id: string) {
		// Query group with members and aggregate counts
		return prisma.group.findUnique({
			where: { id },
			include: {
				members: {
					include: {
						user: {
							select: {
								id: true,
								email: true,
								firstName: true,
								lastName: true,
								avatar: true,
								role: true,
							},
						},
					},
				},
				_count: {
					select: { projects: true, meetings: true },
				},
			},
		});
	}

	/**
	 * Get all groups paginated
	 * @param page Page number
	 * @param pageSize Groups per page
	 * @returns Paginated groups and count
	 */

	static async getAll(page = 1, pageSize = 20) {
		// Calculate offset for pagination
		const skip = (page - 1) * pageSize;

		// Execute group query and count in parallel
		const [groups, total] = await Promise.all([
			prisma.group.findMany({
				skip,
				take: pageSize,
				include: {
					_count: { select: { members: true, projects: true } },
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.group.count(),
		]);

		return { groups, total, page, pageSize };
	}

	/**
	 * Create a new group
	 * @param input Group creation fields
	 * @param performedBy Actor user ID
	 * @returns Created group object
	 */

	static async create(input: CreateGroupInput, performedBy?: string) {
		// Insert the group record
		const group = await prisma.group.create({
			data: {
				name: input.name,
				description: input.description,
				logoUrl: input.logoUrl,
			},
		});

		// Log the group creation
		await LogService.log(LogAction.Create, "group", group.id, performedBy);

		return group;
	}

	/**
	 * Update a group
	 * @param id Group ID
	 * @param input Partial update data
	 * @param performedBy Actor user ID
	 * @returns Updated group object
	 */

	static async update(id: string, input: Partial<CreateGroupInput>, performedBy?: string) {
		// Apply partial update to the group
		const group = await prisma.group.update({
			where: { id },
			data: input,
		});

		// Log the group update
		await LogService.log(LogAction.Update, "group", id, performedBy);

		return group;
	}

	/**
	 * Delete a group
	 * @param id Group ID
	 * @param performedBy Actor user ID
	 */

	static async delete(id: string, performedBy?: string) {
		// Remove the group record
		await prisma.group.delete({ where: { id } });

		// Log the group deletion
		await LogService.log(LogAction.Delete, "group", id, performedBy);
	}

	/**
	 * Add group member
	 * @param groupId Group ID
	 * @param userId User ID
	 * @param role Member role
	 * @param performedBy Actor user ID
	 */

	static async addMember(groupId: string, userId: string, role: string, performedBy?: string) {
		// Create the group membership record
		await prisma.groupMember.create({
			data: {
				groupId,
				userId,
				role: role as never,
			},
		});

		// Log the membership creation
		await LogService.log(LogAction.Create, "group_member", groupId, performedBy, `user:${userId}`);
	}

	/**
	 * Remove group member
	 * @param groupId Group ID
	 * @param userId User ID
	 * @param performedBy Actor user ID
	 */

	static async removeMember(groupId: string, userId: string, performedBy?: string) {
		// Delete matching membership records
		await prisma.groupMember.deleteMany({
			where: { groupId, userId },
		});

		// Log the membership removal
		await LogService.log(LogAction.Delete, "group_member", groupId, performedBy, `user:${userId}`);
	}

	/**
	 * Update member role
	 * @param groupId Group ID
	 * @param userId User ID
	 * @param role New role to assign
	 * @param performedBy Actor user ID
	 */

	static async updateMemberRole(groupId: string, userId: string, role: string, performedBy?: string) {
		// Update the role on matching membership records
		await prisma.groupMember.updateMany({
			where: { groupId, userId },
			data: { role: role as never },
		});

		// Log the role change
		await LogService.log(LogAction.Update, "group_member", groupId, performedBy, `user:${userId},role:${role}`);
	}

	/**
	 * Get groups by user
	 * @param userId User ID
	 * @returns User's groups with counts
	 */

	static async getByUser(userId: string) {
		// Query groups where user has a membership
		return prisma.group.findMany({
			where: {
				members: { some: { userId } },
			},
			include: {
				members: {
					where: { userId },
					select: { role: true },
				},
				_count: { select: { members: true, projects: true } },
			},
		});
	}
}
