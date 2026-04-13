import { prisma } from "@/lib/prisma";
import { LogService } from "@/services/LogService";
import { LogAction, UserRoles } from "@/constants";
import type { UserStatusValue } from "@/constants";
import type { CreateUserFormData, UpdateUserFormData } from "@/lib/validators/schemas";
import { hashPassword } from "@/lib/auth/password";

/** All profile fields returned in selects */
const USER_PROFILE_SELECT = {
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

	// Profile
	pseudo: true,
	phone: true,
	birthdate: true,
	birthdayWish: true,
	languages: true,

	// Discord
	discordUsername: true,
	discordId: true,

	// Social
	socialTwitter: true,
	socialTwitch: true,
	socialYoutube: true,
	socialInstagram: true,
	socialReddit: true,

	// Organisation
	entity: true,
	team: true,
	division: true,
	roleSecondary: true,
	arrivalDate: true,

	// Permission system
	roleId: true,
	entityAccess: true,

	groupMemberships: {
		include: {
			group: { select: { id: true, name: true } },
		},
	},
} as const;

/** User CRUD and role management service */
export class UserService {
	/**
	 * Get user by ID (full profile)
	 */
	static async getById(id: string) {
		return prisma.user.findUnique({
			where: { id },
			select: USER_PROFILE_SELECT,
		});
	}

	/**
	 * Get user by email (minimal — for auth)
	 */
	static async getByEmail(email: string) {
		return prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				status: true,
				roleId: true,
				entityAccess: true,
			},
		});
	}

	/**
	 * Get user by email including password — for authentication only
	 */
	static async getByEmailWithPassword(email: string) {
		return prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				password: true,
				firstName: true,
				lastName: true,
				role: true,
				status: true,
				a2fEnabled: true,
				a2fSecret: true,
				roleId: true,
				entityAccess: true,
			},
		});
	}

	/**
	 * Get all users paginated (full profile)
	 */
	static async getAll(page = 1, pageSize = 20) {
		const skip = (page - 1) * pageSize;

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				skip,
				take: pageSize,
				select: USER_PROFILE_SELECT,
				orderBy: { createdAt: "desc" },
			}),
			prisma.user.count(),
		]);

		return { users, total, page, pageSize };
	}

	/**
	 * Get all active users (for hydration)
	 */
	static async getAllActive() {
		return prisma.user.findMany({
			where: { status: "active" },
			select: USER_PROFILE_SELECT,
			orderBy: { firstName: "asc" },
		});
	}

	/**
	 * Create a new user
	 */
	static async create(input: CreateUserFormData, performedBy?: string) {
		const hashedPassword = await hashPassword(input.password);

		const user = await prisma.user.create({
			data: {
				email: input.email,
				password: hashedPassword,
				firstName: input.firstName,
				lastName: input.lastName,
				role: input.role as any,
				groupMemberships: {
					create: input.groupAccess.map((ga) => ({
						groupId: ga.groupId,
						role: ga.role as any,
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

		await LogService.log(LogAction.Create, "user", user.id, performedBy);

		return user;
	}

	/**
	 * Update a user
	 */
	static async update(id: string, input: UpdateUserFormData, performedBy?: string) {
		const user = await prisma.user.update({
			where: { id },
			data: {
				...(input.firstName !== undefined && { firstName: input.firstName }),
				...(input.lastName !== undefined && { lastName: input.lastName }),
				...(input.email !== undefined && { email: input.email }),
				...(input.role !== undefined && { role: input.role as any }),
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

		if (input.groupAccess) {
			await prisma.groupMember.deleteMany({ where: { userId: id } });
			await prisma.groupMember.createMany({
				data: input.groupAccess.map((ga) => ({
					userId: id,
					groupId: ga.groupId,
					role: ga.role as any,
				})),
			});
		}

		await LogService.log(LogAction.Update, "user", id, performedBy);

		return user;
	}

	/**
	 * Delete a user
	 */
	static async delete(id: string, performedBy?: string) {
		await prisma.user.delete({ where: { id } });
		await LogService.log(LogAction.Delete, "user", id, performedBy);
	}

	/**
	 * Update user status
	 */
	static async updateStatus(id: string, status: UserStatusValue, performedBy?: string) {
		await prisma.user.update({
			where: { id },
			data: { status },
		});
		await LogService.log(LogAction.Update, "user", id, performedBy, `status_changed:${status}`);
	}

	/**
	 * Get users by role
	 */
	static async getByRole(role: string) {
		return prisma.user.findMany({
			where: { role: role as any },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				status: true,
				pseudo: true,
				avatar: true,
				roleId: true,
			},
		});
	}

	/**
	 * Get admin users
	 */
	static async getAdmins() {
		return prisma.user.findMany({
			where: { role: { in: [UserRoles.Owner, UserRoles.Admin] } },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				pseudo: true,
				avatar: true,
				roleId: true,
			},
		});
	}
}
