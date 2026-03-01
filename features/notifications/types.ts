import type { BadgeVariant } from "@/core/design/states";
import type { IconName } from "@/core/design/icons";


/** Possible notification categories */
export type NotificationType = "task" | "meeting" | "absence" | "project" | "system" | "ping";

/** Notification list filter options */
export type NotificationFilter = "all" | "unread";

/** Core notification entity */
export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	description: string;
	time: string;
	read: boolean;
	icon: IconName;
	link?: string;
}

/** Notifications grouped by date label */
export interface NotificationGroup {
	label: string;
	notifications: Notification[];
}

/** Badge variant mapping for notification types */
export const notificationTypeVariant: Record<NotificationType, BadgeVariant> = {
	task: "info",
	meeting: "primary",
	absence: "warning",
	project: "success",
	system: "neutral",
	ping: "error",
} as const;

/** Icon background color mapping for notification types */
export const notificationTypeIconColor: Record<NotificationType, string> = {
	task: "text-info-500 bg-info-100 dark:bg-info-900/30",
	meeting: "text-primary-500 bg-primary-100 dark:bg-primary-900/30",
	absence: "text-warning-500 bg-warning-100 dark:bg-warning-900/30",
	project: "text-success-500 bg-success-100 dark:bg-success-900/30",
	system: "text-gray-500 bg-gray-100 dark:bg-gray-700",
	ping: "text-rose-500 bg-rose-100 dark:bg-rose-900/30",
} as const;

/** Localized labels for notification types */
export const notificationTypeLabel: Record<NotificationType, string> = {
	task: "Tache",
	meeting: "Reunion",
	absence: "Absence",
	project: "Projet",
	system: "Systeme",
	ping: "Ping",
} as const;
