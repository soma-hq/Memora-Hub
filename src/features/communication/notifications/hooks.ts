"use client";

import { useState, useMemo, useCallback } from "react";
import type { Notification, NotificationFilter, NotificationGroup } from "./types";


/**
 * Group notifications by date
 * @param notifications - Notifications to group
 * @returns Grouped notifications
 */

function groupByDate(notifications: Notification[]): NotificationGroup[] {
	const now = new Date();
	const today = now.toISOString().slice(0, 10);

	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);
	const yesterdayStr = yesterday.toISOString().slice(0, 10);

	const groups: Record<string, Notification[]> = {};
	const order: string[] = [];

	for (const notif of notifications) {
		const dateStr = notif.time.slice(0, 10);
		let label: string;

		if (dateStr === today) {
			label = "Aujourd'hui";
		} else if (dateStr === yesterdayStr) {
			label = "Hier";
		} else {
			const date = new Date(dateStr);
			label = date.toLocaleDateString("fr-FR", {
				weekday: "long",
				day: "numeric",
				month: "long",
			});
			label = label.charAt(0).toUpperCase() + label.slice(1);
		}

		if (!groups[label]) {
			groups[label] = [];
			order.push(label);
		}
		groups[label].push(notif);
	}

	return order.map((label) => ({
		label,
		notifications: groups[label],
	}));
}

/**
 * Notification list hook
 * @returns Notification state and actions
 */

export function useNotifications() {
	// State
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading] = useState(false);
	const [filter, setFilter] = useState<NotificationFilter>("all");

	// Computed
	const unreadCount = useMemo(() => {
		return notifications.filter((n) => !n.read).length;
	}, [notifications]);

	const filteredNotifications = useMemo(() => {
		if (filter === "unread") {
			return notifications.filter((n) => !n.read);
		}
		return notifications;
	}, [notifications, filter]);

	const groupedNotifications = useMemo(() => {
		return groupByDate(filteredNotifications);
	}, [filteredNotifications]);

	// Handlers
	/**
	 * Mark notification as read
	 * @param id - Notification ID
	 * @returns Nothing
	 */
	const markAsRead = useCallback((id: string) => {
		setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
	}, []);

	/**
	 * Mark all as read
	 * @returns Nothing
	 */
	const markAllAsRead = useCallback(() => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
	}, []);

	return {
		notifications: filteredNotifications,
		groupedNotifications,
		unreadCount,
		isLoading,
		markAsRead,
		markAllAsRead,
		filter,
		setFilter,
	};
}
