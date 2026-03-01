import { prisma } from "@/lib/prisma";
import { LogService } from "@/services/LogService";
import { LogAction, ProjectStatus } from "@/constants";
import type { CreateProjectFormData } from "@/lib/validators/schemas";


/** Project CRUD and membership service */
export class ProjectService {
	/**
	 * Get project by ID
	 * @param id Project ID
	 * @returns Project with relations, or null
	 */

	static async getById(id: string) {
		// Query project with creator, members and task count
		return prisma.project.findUnique({
			where: { id },
			include: {
				createdBy: { select: { id: true, firstName: true, lastName: true, avatar: true } },
				members: {
					include: {
						project: false,
					},
				},
				_count: { select: { tasks: true } },
			},
		});
	}

	/**
	 * Get projects by group
	 * @param groupId Group ID
	 * @param page Page number
	 * @param pageSize Projects per page
	 * @returns Paginated projects and count
	 */

	static async getByGroup(groupId: string, page = 1, pageSize = 20) {
		// Calculate offset for pagination
		const skip = (page - 1) * pageSize;

		// Execute project query and count in parallel
		const [projects, total] = await Promise.all([
			prisma.project.findMany({
				where: { groupId },
				skip,
				take: pageSize,
				include: {
					createdBy: { select: { id: true, firstName: true, lastName: true } },
					_count: { select: { tasks: true, members: true } },
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.project.count({ where: { groupId } }),
		]);

		return { projects, total, page, pageSize };
	}

	/**
	 * Create a new project
	 * @param groupId Parent group ID
	 * @param createdById Creator user ID
	 * @param input Project creation data
	 * @returns Created project object
	 */

	static async create(groupId: string, createdById: string, input: CreateProjectFormData) {
		// Insert the project record with parsed dates
		const project = await prisma.project.create({
			data: {
				name: input.name,
				description: input.description,
				groupId,
				createdById,
				status: (input.status as never) || ProjectStatus.Todo,
				startDate: input.startDate ? new Date(input.startDate) : null,
				endDate: input.endDate ? new Date(input.endDate) : null,
			},
		});

		// Log the project creation
		await LogService.log(LogAction.Create, "project", project.id, createdById);

		return project;
	}

	/**
	 * Update a project
	 * @param id Project ID
	 * @param input Partial update data
	 * @param performedBy Actor user ID
	 * @returns Updated project object
	 */

	static async update(id: string, input: Partial<CreateProjectFormData>, performedBy?: string) {
		// Apply partial update with date parsing
		const project = await prisma.project.update({
			where: { id },
			data: {
				...(input.name !== undefined && { name: input.name }),
				...(input.description !== undefined && { description: input.description }),
				...(input.status !== undefined && { status: input.status as never }),
				...(input.startDate !== undefined && { startDate: input.startDate ? new Date(input.startDate) : null }),
				...(input.endDate !== undefined && { endDate: input.endDate ? new Date(input.endDate) : null }),
			},
		});

		// Log the project update
		await LogService.log(LogAction.Update, "project", id, performedBy);

		return project;
	}

	/**
	 * Delete a project
	 * @param id Project ID
	 * @param performedBy Actor user ID
	 */

	static async delete(id: string, performedBy?: string) {
		// Remove the project record
		await prisma.project.delete({ where: { id } });

		// Log the project deletion
		await LogService.log(LogAction.Delete, "project", id, performedBy);
	}

	/**
	 * Add project member
	 * @param projectId Project ID
	 * @param userId User ID
	 * @param role Member role
	 */

	static async addMember(projectId: string, userId: string, role = "member") {
		// Create the project membership record
		await prisma.projectMember.create({
			data: { projectId, userId, role },
		});
	}

	/**
	 * Remove a user from a project
	 * @param projectId Project ID
	 * @param userId User ID
	 */

	static async removeMember(projectId: string, userId: string) {
		// Delete matching membership records
		await prisma.projectMember.deleteMany({
			where: { projectId, userId },
		});
	}

	/**
	 * Get user's projects
	 * @param userId User ID
	 * @returns Projects as creator or member
	 */

	static async getByUser(userId: string) {
		// Query projects where user is either creator or member
		return prisma.project.findMany({
			where: {
				OR: [{ createdById: userId }, { members: { some: { userId } } }],
			},
			include: {
				group: { select: { id: true, name: true } },
				_count: { select: { tasks: true } },
			},
			orderBy: { updatedAt: "desc" },
		});
	}
}
