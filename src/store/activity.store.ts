"use client";

import { create } from "zustand";


/** Severity level for an activity entry */
export type ActivityLevel = "success" | "error" | "warning" | "info";

/** Single activity log entry */
export interface ActivityEntry {
	id: string;
	level: ActivityLevel;
	message: string;
	detail?: string;
	source?: string;
	timestamp: string;
}

/** State and actions for the activity store */
interface ActivityState {
	entries: ActivityEntry[];
	addEntry: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;
	clearEntries: () => void;
	unreadCount: number;
	markAllRead: () => void;
}

/**
 * Zustand store managing the activity feed and unread count.
 * @returns {ActivityState} Activity state with entries and mutation actions
 */
export const useActivityStore = create<ActivityState>((set, get) => ({
	entries: [],

	unreadCount: 0,

	/**
	 * Prepends a new entry with a generated id and current timestamp.
	 * @param entry - Partial entry without id and timestamp
	 * @returns {void}
	 */
	addEntry: (entry) =>
		set((state) => ({
			entries: [
				{
					...entry,
					id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
					timestamp: new Date().toISOString(),
				},
				...state.entries,
			],
			unreadCount: state.unreadCount + 1,
		})),

	/** Removes all activity entries from the store */
	clearEntries: () => set({ entries: [] }),

	/** Resets the unread counter to zero */
	markAllRead: () => set({ unreadCount: 0 }),
}));
