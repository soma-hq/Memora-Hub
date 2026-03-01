"use server";

import { NotificationService } from "@/services/NotificationService";
import { AuthService } from "@/services/AuthService";

export interface ActionResult {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
}

export async function getNotificationsAction(onlyUnread = false): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const notifications = await NotificationService.getByUser(currentUser.id, onlyUnread);
	return { success: true, data: { notifications } as unknown as Record<string, unknown> };
}

export async function markNotificationAsReadAction(notificationId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	await NotificationService.markAsRead(notificationId);
	return { success: true };
}

export async function markAllNotificationsAsReadAction(): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	await NotificationService.markAllAsRead(currentUser.id);
	return { success: true };
}

export async function deleteNotificationAction(notificationId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	await NotificationService.delete(notificationId);
	return { success: true };
}

export async function countUnreadNotificationsAction(): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const count = await NotificationService.countUnread(currentUser.id);
	return { success: true, data: { count } };
}
