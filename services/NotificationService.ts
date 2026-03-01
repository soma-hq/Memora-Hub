import { prisma } from "@/lib/prisma";
import { NotificationType, UserRoles } from "@/constants";
import type { NotificationTypeValue } from "@/constants";


/** Input data for sending a notification */
interface SendNotificationInput {
	userId: string;
	title: string;
	message: string;
	type?: NotificationTypeValue;
	relatedId?: string;
}

/** Notification delivery and management service */
export class NotificationService {
	/**
	 * Send a notification to a user
	 * @param input Notification input data
	 * @returns Created notification object
	 */

	static async send(input: SendNotificationInput) {
		// Insert notification record with unread status
		return prisma.notification.create({
			data: {
				userId: input.userId,
				title: input.title,
				message: input.message,
				type: (input.type ?? NotificationType.System) as never,
				relatedId: input.relatedId ?? null,
				isRead: false,
			},
		});
	}

	/**
	 * Notify all admins
	 * @param params Notification params
	 */

	static async notifyAdmins(params: { title: string; message: string; type?: NotificationTypeValue }) {
		// Retrieve all admin and owner user IDs
		const admins = await prisma.user.findMany({
			where: { role: { in: [UserRoles.Owner, UserRoles.Admin] } },
			select: { id: true },
		});

		// Send a notification to each admin in parallel
		const promises = admins.map((admin) =>
			NotificationService.send({
				userId: admin.id,
				title: params.title,
				message: params.message,
				type: params.type ?? NotificationType.System,
			}),
		);

		await Promise.all(promises);
	}

	/**
	 * Get user notifications
	 * @param userId User ID
	 * @param onlyUnread Filter unread only
	 * @returns Sorted notifications
	 */

	static async getByUser(userId: string, onlyUnread = false) {
		// Query notifications filtered by user and optional read status
		return prisma.notification.findMany({
			where: {
				userId,
				...(onlyUnread && { isRead: false }),
			},
			orderBy: { createdAt: "desc" },
		});
	}

	/**
	 * Mark a single notification as read
	 * @param id Notification ID
	 */

	static async markAsRead(id: string) {
		// Set the notification read flag to true
		await prisma.notification.update({
			where: { id },
			data: { isRead: true },
		});
	}

	/**
	 * Mark all as read
	 * @param userId User ID
	 */

	static async markAllAsRead(userId: string) {
		// Bulk update all unread notifications for this user
		await prisma.notification.updateMany({
			where: { userId, isRead: false },
			data: { isRead: true },
		});
	}

	/**
	 * Count unread notifications
	 * @param userId User ID
	 * @returns Unread notification count
	 */

	static async countUnread(userId: string): Promise<number> {
		// Count unread notifications for the specified user
		return prisma.notification.count({
			where: { userId, isRead: false },
		});
	}

	/**
	 * Delete a notification
	 * @param id Notification ID
	 */

	static async delete(id: string) {
		// Remove the notification record
		await prisma.notification.delete({ where: { id } });
	}

	/**
	 * Clean up old notifications
	 * @param days Retention days
	 * @returns Deleted count
	 */

	static async cleanupOld(days = 30) {
		// Calculate the cutoff date
		const cutoff = new Date();
		cutoff.setDate(cutoff.getDate() - days);

		// Delete read notifications older than the cutoff
		const result = await prisma.notification.deleteMany({
			where: {
				isRead: true,
				createdAt: { lt: cutoff },
			},
		});

		return result.count;
	}
}
