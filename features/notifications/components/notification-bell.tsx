"use client";

import { useState } from "react";
import { Icon, Tooltip } from "@/components/ui";
import { NotificationCenter } from "./notification-center";
import { cn } from "@/lib/utils/cn";
import { useNotifications } from "../hooks";
import { useActivityStore } from "@/store/activity.store";
import { useUIStore } from "@/store/ui.store";
import { usePing } from "@/features/ping/hooks";
import { PingBubble } from "@/features/ping/components/ping-bubble";


/**
 * Notification bell
 * @returns Notification bell button
 */

export function NotificationBell() {
	// State
	const [isOpen, setIsOpen] = useState(false);
	const { unreadCount } = useNotifications();
	const activityUnread = useActivityStore((s) => s.unreadCount);
	const absenceMode = useUIStore((s) => s.absenceMode);
	const { latestUnread, bubbleVisible, unreadCount: pingUnread, dismissBubble, markAsRead } = usePing();

	// Computed
	const totalUnread = unreadCount + activityUnread + pingUnread;
	const isAbsent = absenceMode !== "none";
	const absenceLabel =
		absenceMode === "partial"
			? "Absence partielle — notifications desactivees"
			: absenceMode === "complete"
				? "Absence totale — notifications et mentions desactivees"
				: "";

	const handlePingNavigate = (pingId: string) => {
		markAsRead(pingId);
		dismissBubble();
	};

	// Render
	const bellButton = (
		<button
			type="button"
			onClick={() => !isAbsent && setIsOpen(true)}
			className={cn(
				"relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-150",
				isAbsent
					? "cursor-default text-gray-400 opacity-60 dark:text-gray-600"
					: [
							"text-gray-500 hover:bg-gray-100 hover:text-gray-700",
							"dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200",
						],
				isOpen && !isAbsent && "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
			)}
			aria-label={isAbsent ? absenceLabel : `Notifications${totalUnread > 0 ? ` (${totalUnread} non lues)` : ""}`}
		>
			<Icon name="bell" size="md" style={totalUnread > 0 && !isAbsent ? "solid" : "outline"} />

			{/* Diagonal strikethrough line for absence mode */}
			{isAbsent && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="h-[2px] w-5 rotate-45 rounded-full bg-gray-500 dark:bg-gray-400" />
				</div>
			)}

			{/* Unread badge (hidden during absence) */}
			{totalUnread > 0 && !isAbsent && (
				<span
					className={cn(
						"absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center",
						"bg-primary-500 rounded-full px-1 text-[10px] font-bold text-white",
						"ring-2 ring-white dark:ring-gray-800",
					)}
				>
					{totalUnread > 99 ? "99+" : totalUnread}
				</span>
			)}
		</button>
	);

	return (
		<div className="relative">
			{isAbsent ? (
				<Tooltip content={absenceLabel} position="bottom">
					{bellButton}
				</Tooltip>
			) : (
				bellButton
			)}

			{/* Ping bubble */}
			{bubbleVisible && latestUnread && !isOpen && !isAbsent && (
				<PingBubble
					ping={latestUnread}
					onDismiss={dismissBubble}
					onNavigate={handlePingNavigate}
				/>
			)}

			<NotificationCenter isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</div>
	);
}
