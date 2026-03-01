import { DatabaseManager } from "./DatabaseManager";


/**
 * Single entry point for all notification dispatch (in-app + future channels)
 */
export class NotificationManager {
	/**
	 * Send a notification to a user
	 * @param userId - Target user ID
	 * @param payload - Notification content
	 */

	static async send(
		userId: string,
		payload: {
			title: string;
			message: string;
			type: "task" | "meeting" | "absence" | "project" | "system";
			relatedId?: string;
		},
	): Promise<void> {
		await DatabaseManager.createNotification({
			user: { connect: { id: userId } },
			title: payload.title,
			message: payload.message,
			type: payload.type,
			relatedId: payload.relatedId ?? null,
		});
	}

	/**
	 * Broadcast a notification to many users
	 * @param userIds - Target user IDs
	 * @param payload - Notification content
	 */

	static async broadcast(userIds: string[], payload: Parameters<typeof NotificationManager.send>[1]): Promise<void> {
		await Promise.all(userIds.map((id) => NotificationManager.send(id, payload)));
	}
}
