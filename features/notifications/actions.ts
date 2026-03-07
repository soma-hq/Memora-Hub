"use server";

import { NotificationService } from "@/services/NotificationService";
import { ensureAuth, AUTH_ERROR } from "@/lib/server/ensure-auth";
import type { ActionResult } from "@/lib/types/action-result";

export async function getNotificationsAction(onlyUnread = false): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const notifications = await NotificationService.getByUser(currentUser.id, onlyUnread);
	return { success: true, data: { notifications } as unknown as Record<string, unknown> };
}

export async function markNotificationAsReadAction(notificationId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	await NotificationService.markAsRead(notificationId);
	return { success: true };
}

export async function markAllNotificationsAsReadAction(): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	await NotificationService.markAllAsRead(currentUser.id);
	return { success: true };
}

export async function deleteNotificationAction(notificationId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	await NotificationService.delete(notificationId);
	return { success: true };
}

export async function countUnreadNotificationsAction(): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const count = await NotificationService.countUnread(currentUser.id);
	return { success: true, data: { count } };
}
