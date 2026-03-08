"use client";

import { useMemo } from "react";
import { usePingStore } from "@/store/ping.store";

/** Hook to consume ping notifications state */
export function usePing() {
	const { pings, bubbleVisible, markAsRead, markAllAsRead, dismissBubble } = usePingStore();

	const unreadPings = useMemo(() => pings.filter((p) => !p.read), [pings]);
	const latestUnread = unreadPings[0] ?? null;

	return {
		pings,
		unreadPings,
		unreadCount: unreadPings.length,
		latestUnread,
		bubbleVisible: bubbleVisible && latestUnread !== null,
		markAsRead,
		markAllAsRead,
		dismissBubble,
	};
}
