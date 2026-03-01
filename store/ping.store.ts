"use client";

import { create } from "zustand";
import type { PingNotification } from "@/features/ping/types";

/** Demo pings for development */
const DEMO_PINGS: PingNotification[] = [
	{
		id: "ping-1",
		fromUserId: "user-2",
		fromUserName: "Léa Martin",
		fromUserAvatar: "/avatar/lea.webp",
		toUserId: "user-1",
		targetPath: "/hub/team-alpha/tasks",
		targetLabel: "Taches — Team Alpha",
		message: "Peux-tu valider cette tache ?",
		createdAt: new Date(Date.now() - 1000 * 30),
		read: false,
	},
	{
		id: "ping-2",
		fromUserId: "user-3",
		fromUserName: "Hugo Leroy",
		toUserId: "user-1",
		targetPath: "/hub/team-alpha/projects",
		targetLabel: "Projets — Team Alpha",
		createdAt: new Date(Date.now() - 1000 * 60 * 5),
		read: false,
	},
	{
		id: "ping-3",
		fromUserId: "user-4",
		fromUserName: "Camille Dupont",
		toUserId: "user-1",
		targetPath: "/hub/team-alpha/meetings",
		targetLabel: "Reunions — Team Alpha",
		message: "On attend ta confirmation",
		createdAt: new Date(Date.now() - 1000 * 60 * 60),
		read: true,
	},
];

/** State and actions for the ping store */
interface PingStore {
	pings: PingNotification[];
	bubbleVisible: boolean;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	dismissBubble: () => void;
}

/**
 * Zustand store
 * @returns {PingStore} - Ping state
 */
export const usePingStore = create<PingStore>((set) => ({
	pings: DEMO_PINGS,
	bubbleVisible: true,

	/** Mark a single ping as read */
	markAsRead: (id) =>
		set((s) => ({
			pings: s.pings.map((p) => (p.id === id ? { ...p, read: true } : p)),
		})),

	/** Mark all pings as read and hide the bubble */
	markAllAsRead: () =>
		set((s) => ({
			pings: s.pings.map((p) => ({ ...p, read: true })),
			bubbleVisible: false,
		})),

	/** Hide the bubble without marking as read */
	dismissBubble: () => set({ bubbleVisible: false }),
}));
