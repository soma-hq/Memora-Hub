import { prisma } from "@/lib/prisma";
import { LogService } from "@/services/LogService";
import { LogAction, UserRoles } from "@/constants";
import type { UserStatusValue } from "@/constants";
import type { CreateUserFormData, UpdateUserFormData } from "@/lib/validators/schemas";
import { hashPassword } from "@/lib/auth/password";


/** User CRUD and role management service */
export class UserService {
	/**
	 * Get user by ID
	 * @param id User ID
	 * @returns User with memberships, or null
	 */

	static async getById(id: string) {
		// Query with group relations
		return prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				avatar: true,
				role: true,
				status: true,
				a2fEnabled: true,
				createdAt: true,
				updatedAt: true,
				groupMemberships: {
					include: {
						group: { select: { id: true, name: true } },
					},
				},
			},
		});
	}

	/**
	 * Get user by email
	 * @param email Email to search
	 * @returns User info or null
	 */

	static async getByEmail(email: string) {
		// Query user by unique email
		return prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				status: true,
			},
		});
	}

	/**
	 * Get all users paginated
	 * @param page Page number
	 * @param pageSize Users per page
	 * @returns Paginated users and count
	 */

	static async getAll(page = 1, pageSize = 20) {
		// Calculate offset for pagination
		const skip = (page - 1) * pageSize;

		// Parallel query + count
		const [users, total] = await Promise.all([
			prisma.user.findMany({
				skip,
				take: pageSize,
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
					avatar: true,
					role: true,
					status: true,
					createdAt: true,
					groupMemberships: {
						include: {
							group: { select: { id: true, name: true } },
						},
					},
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.user.count(),
		]);

		return { users, total, page, pageSize };
	}

	/**
	 * Create a new user
	 * @param input User creation data
	 * @param performedBy Actor user ID
	 * @returns Created user object
	 */

	static async create(input: CreateUserFormData, performedBy?: string) {
		// Hash the plain text password
		const hashedPassword = await hashPassword(input.password);

		// Insert with group memberships
		const user = await prisma.user.create({
			data: {
				email: input.email,
				password: hashedPassword,
				firstName: input.firstName,
				lastName: input.lastName,
				role: input.role as never,
				groupMemberships: {
					create: input.groupAccess.map((ga) => ({
						groupId: ga.groupId,
						role: ga.role as never,
					})),
				},
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				status: true,
				createdAt: true,
			},
		});

		// Log the user creation
		await LogService.log(LogAction.Create, "user", user.id, performedBy);

		return user;
	}

	/**
	 * Update a user
	 * @param id User ID
	 * @param input Partial update data
	 * @param performedBy Actor user ID
	 * @returns Updated user object
	 */

	static async update(id: string, input: UpdateUserFormData, performedBy?: string) {
		// Update only the provided fields
		const user = await prisma.user.update({
			where: { id },
			data: {
				...(input.firstName !== undefined && { firstName: input.firstName }),
				...(input.lastName !== undefined && { lastName: input.lastName }),
				...(input.email !== undefined && { email: input.email }),
				...(input.role !== undefined && { role: input.role as never }),
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				status: true,
				updatedAt: true,
			},
		});

		// Replace group memberships if provided
		if (input.groupAccess) {
			// Remove all existing memberships
			await prisma.groupMember.deleteMany({ where: { userId: id } });

			// Create new memberships
			await prisma.groupMember.createMany({
				data: input.groupAccess.map((ga) => ({
					userId: id,
					groupId: ga.groupId,
					role: ga.role as never,
				})),
			});
		}

		// Log the user update
		await LogService.log(LogAction.Update, "user", id, performedBy);

		return user;
	}

	/**
	 * Delete a user
	 * @param id User ID
	 * @param performedBy Actor user ID
	 */

	static async delete(id: string, performedBy?: string) {
		// Remove the user record
		await prisma.user.delete({ where: { id } });

		// Log the deletion
		await LogService.log(LogAction.Delete, "user", id, performedBy);
	}

	/**
	 * Update user status
	 * @param id User ID
	 * @param status New status value
	 * @param performedBy Actor user ID
	 */

	static async updateStatus(id: string, status: UserStatusValue, performedBy?: string) {
		// Update the user status field
		await prisma.user.update({
			where: { id },
			data: { status },
		});

		// Log status change
		await LogService.log(LogAction.Update, "user", id, performedBy, `status_changed:${status}`);
	}

	/**
	 * Get users by role
	 * @param role Role to filter
	 * @returns Users with that role
	 */

	static async getByRole(role: string) {
		// Query users filtered by role
		return prisma.user.findMany({
			where: { role: role as never },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				status: true,
			},
		});
	}

	/**
	 * Get admin users
	 * @returns Admin and owner users
	 */

	static async getAdmins() {
		// Query users with elevated roles
		return prisma.user.findMany({
			where: { role: { in: [UserRoles.Owner, UserRoles.Admin] } },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
			},
		});
	}
}
