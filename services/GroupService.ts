import { prisma } from "@/lib/prisma";
import { LogService } from "@/services/LogService";
import { LogAction } from "@/constants";
import {
	DEFAULT_ENTITY_PAGES,
	normalizeRoleTemplates,
	type EntityRoleTemplateInput,
} from "@/core/config/entity-blueprint";
import type { Module } from "@/core/config/capabilities";
import { nanoid } from "nanoid";

/** Input data for creating a new group */
interface CreateGroupInput {
	name: string;
	description?: string;
	logoUrl?: string;
	roleTemplates?: EntityRoleTemplateInput[];
}

interface GroupBlueprint {
	pages: Array<{ slug: string; title: string; module: Module }>;
	roles: EntityRoleTemplateInput[];
}

interface GroupInvitationInput {
	email: string;
	roleKey: string;
	requireA2F?: boolean;
	firstConnection?: boolean;
	expiresInDays?: number;
	invitedById?: string;
}

interface GroupInvitationRecord {
	id: string;
	token: string;
	email: string;
	roleKey: string;
	groupId: string;
	permissions: Module[];
	firstConnection: boolean;
	requireA2F: boolean;
	expiresAt: string | null;
	createdAt: string;
	createdBy: string | null;
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
					members: {
						select: {
							user: {
								select: { roleId: true },
							},
						},
					},
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.group.count(),
		]);

		const normalized = groups.map((group) => {
			const legacyMembersCount = group.members.filter((member) => {
				const roleId = member.user.roleId ?? "";
				return roleId.startsWith("legacy_");
			}).length;

			return {
				...group,
				legacyMembersCount,
			};
		});

		return { groups: normalized, total, page, pageSize };
	}

	/**
	 * Create a new group
	 * @param input Group creation fields
	 * @param performedBy Actor user ID
	 * @returns Created group object
	 */

	static async create(input: CreateGroupInput, performedBy?: string) {
		const roleTemplates = normalizeRoleTemplates(input.roleTemplates);

		const group = await prisma.$transaction(async (tx) => {
			const createdGroup = await tx.group.create({
				data: {
					name: input.name,
					description: input.description,
					logoUrl: input.logoUrl,
				},
			});

			const blueprint: GroupBlueprint = {
				pages: DEFAULT_ENTITY_PAGES,
				roles: roleTemplates,
			};

			await tx.log.create({
				data: {
					userId: performedBy,
					action: LogAction.Create,
					entityType: "group_blueprint",
					entityId: createdGroup.id,
					details: JSON.stringify(blueprint),
				},
			});

			return createdGroup;
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
	 * Delete à group
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
				role: role as any,
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
			data: { role: role as any },
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

	/**
	 * Resolve the latest persisted entity blueprint from logs.
	 * @param groupId Group ID
	 * @returns Entity blueprint with roles/pages
	 */
	static async getBlueprint(groupId: string): Promise<GroupBlueprint> {
		const blueprintLog = await prisma.log.findFirst({
			where: {
				entityType: "group_blueprint",
				entityId: groupId,
			},
			orderBy: { createdAt: "desc" },
		});

		if (!blueprintLog?.details) {
			return {
				pages: DEFAULT_ENTITY_PAGES,
				roles: normalizeRoleTemplates(),
			};
		}

		try {
			const parsed = JSON.parse(blueprintLog.details) as GroupBlueprint;
			return {
				pages: parsed.pages?.length ? parsed.pages : DEFAULT_ENTITY_PAGES,
				roles: normalizeRoleTemplates(parsed.roles),
			};
		} catch {
			return {
				pages: DEFAULT_ENTITY_PAGES,
				roles: normalizeRoleTemplates(),
			};
		}
	}

	/**
	 * Create an invitation record with permissions resolved from entity role templates.
	 * Invitations are persisted in logs to keep DB compatibility with current schema.
	 * @param groupId Group ID
	 * @param input Invitation payload
	 * @returns Created invitation record
	 */
	static async createInvitation(groupId: string, input: GroupInvitationInput): Promise<GroupInvitationRecord> {
		const blueprint = await this.getBlueprint(groupId);
		const role = blueprint.roles.find((r) => r.key === input.roleKey) ?? blueprint.roles[0];
		const token = nanoid(32);
		const createdAt = new Date();
		const expiresAt =
			typeof input.expiresInDays === "number" && input.expiresInDays > 0
				? new Date(createdAt.getTime() + input.expiresInDays * 24 * 60 * 60 * 1000)
				: null;

		const record: GroupInvitationRecord = {
			id: `inv-${nanoid(12)}`,
			token,
			email: input.email.toLowerCase().trim(),
			roleKey: role.key,
			groupId,
			permissions: role.modules,
			firstConnection: input.firstConnection ?? true,
			requireA2F: input.requireA2F ?? true,
			expiresAt: expiresAt ? expiresAt.toISOString() : null,
			createdAt: createdAt.toISOString(),
			createdBy: input.invitedById ?? null,
		};

		await prisma.log.create({
			data: {
				userId: input.invitedById,
				action: LogAction.Create,
				entityType: "group_invitation",
				entityId: groupId,
				details: JSON.stringify(record),
			},
		});

		return record;
	}

	/**
	 * List invitations associated to a group from persisted logs.
	 * @param groupId Group ID
	 * @returns Invitations ordered by newest first
	 */
	static async listInvitations(groupId: string): Promise<GroupInvitationRecord[]> {
		const rows = await prisma.log.findMany({
			where: {
				entityType: "group_invitation",
				entityId: groupId,
			},
			orderBy: { createdAt: "desc" },
		});

		const parsed = rows
			.map((row) => {
				if (!row.details) return null;
				try {
					return JSON.parse(row.details) as GroupInvitationRecord;
				} catch {
					return null;
				}
			})
			.filter((item): item is GroupInvitationRecord => !!item);

		return parsed;
	}
}
