"use client";

import { useState, useRef, useEffect } from "react";
import { Icon, Button, Tabs } from "@/components/ui";
import { NotificationItem } from "./notification-item";
import { ActivityLog } from "./activity-log";
import { cn } from "@/lib/utils/cn";
import { useNotifications } from "../hooks";
import { useActivityStore } from "@/store/activity.store";
import { usePing } from "@/features/ping/hooks";
import { PingSection } from "./ping-section";
import type { NotificationFilter } from "../types";


/** Props for the NotificationCenter component */
interface NotificationCenterProps {
	isOpen: boolean;
	onClose: () => void;
}

/** Main tab definitions */
const MAIN_TABS = [
	{ id: "notifications" as const, label: "Notifications" },
	{ id: "activity" as const, label: "Activite" },
	{ id: "ping" as const, label: "Ping" },
];

/** Filter tab definitions */
const FILTER_TABS = [
	{ id: "all" as const, label: "Toutes" },
	{ id: "unread" as const, label: "Non lues" },
];

/**
 * Notification center panel
 * @param props - Component props
 * @param props.isOpen - Panel visibility
 * @param props.onClose - Close callback
 * @returns Side notification panel
 */

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
	// State
	const [mainTab, setMainTab] = useState<"notifications" | "activity" | "ping">("notifications");
	const panelRef = useRef<HTMLDivElement>(null);

	const { groupedNotifications, unreadCount, markAsRead, markAllAsRead, filter, setFilter } = useNotifications();
	const activityUnread = useActivityStore((s) => s.unreadCount);
	const markActivityRead = useActivityStore((s) => s.markAllRead);
	const { pings, unreadCount: pingUnread, markAsRead: markPingRead, markAllAsRead: markAllPingsRead } = usePing();

	// Handlers
	useEffect(() => {
		if (!isOpen) return;
		/**
		 * Close on outside click
		 * @param e - Mouse event
		 * @returns Nothing
		 */
		function handleClick(e: MouseEvent) {
			if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
				onClose();
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (!isOpen) return;
		/**
		 * Close on Escape key
		 * @param e - Keyboard event
		 * @returns Nothing
		 */
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (mainTab === "activity" && activityUnread > 0) {
			markActivityRead();
		}
	}, [mainTab, activityUnread, markActivityRead]);

	if (!isOpen) return null;

	// Computed
	const totalBadge = unreadCount + activityUnread + pingUnread;

	const mainTabsWithCount = MAIN_TABS.map((tab) => ({
		...tab,
		count:
			tab.id === "notifications"
				? unreadCount > 0
					? unreadCount
					: undefined
				: tab.id === "activity"
					? activityUnread > 0
						? activityUnread
						: undefined
					: tab.id === "ping"
						? pingUnread > 0
							? pingUnread
							: undefined
						: undefined,
	}));

	const filterTabsWithCount = FILTER_TABS.map((tab) => ({
		...tab,
		count: tab.id === "unread" ? (unreadCount > 0 ? unreadCount : undefined) : undefined,
	}));

	// Render
	return (
		<>
			<div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] dark:bg-black/50" onClick={onClose} />

			<div
				ref={panelRef}
				className={cn(
					"fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col",
					"border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800",
					"animate-slide-in-right",
				)}
			>
				<div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
					<div className="flex items-center gap-3">
						<div className="bg-primary-50 dark:bg-primary-900/20 flex h-10 w-10 items-center justify-center rounded-xl">
							<Icon name="bell" size="lg" className="text-primary-500" />
						</div>
						<div>
							<h2 className="text-base font-semibold text-gray-900 dark:text-white">
								Centre de notifications
							</h2>
							{totalBadge > 0 && (
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{totalBadge} element{totalBadge > 1 ? "s" : ""} non lu
									{totalBadge > 1 ? "s" : ""}
								</p>
							)}
						</div>
					</div>
					<button
						onClick={onClose}
						className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
					>
						<Icon name="close" size="sm" />
					</button>
				</div>

				<div className="border-b border-gray-100 px-5 pt-2 dark:border-gray-700">
					<Tabs
						tabs={mainTabsWithCount}
						activeTab={mainTab}
						onTabChange={(id) => setMainTab(id as "notifications" | "activity" | "ping")}
						variant="underline"
					/>
				</div>

				<div className="flex-1 overflow-y-auto">
					{mainTab === "ping" ? (
						<div className="py-2">
							<PingSection
								pings={pings}
								onMarkRead={markPingRead}
								onMarkAllRead={markAllPingsRead}
							/>
						</div>
					) : mainTab === "notifications" ? (
						<div>
							<div className="flex items-center justify-between border-b border-gray-50 px-5 py-2 dark:border-gray-700/50">
								<div className="flex-1">
									<Tabs
										tabs={filterTabsWithCount}
										activeTab={filter}
										onTabChange={(id) => setFilter(id as NotificationFilter)}
										variant="pills"
									/>
								</div>
								{unreadCount > 0 && (
									<Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
										<Icon name="check" size="xs" className="mr-1" />
										Tout lire
									</Button>
								)}
							</div>

							<div className="px-2 py-2">
								{groupedNotifications.length === 0 ? (
									<NotificationEmpty filter={filter} />
								) : (
									<div className="space-y-3">
										{groupedNotifications.map((group) => (
											<div key={group.label}>
												<div className="mb-1 px-3 py-1.5">
													<span className="text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
														{group.label}
													</span>
												</div>
												<div className="space-y-0.5">
													{group.notifications.map((notification) => (
														<NotificationItem
															key={notification.id}
															notification={notification}
															onRead={markAsRead}
														/>
													))}
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					) : (
						<div className="py-2">
							<ActivityLog />
						</div>
					)}
				</div>
			</div>
		</>
	);
}

/** Props for the NotificationEmpty component */
interface NotificationEmptyProps {
	filter: NotificationFilter;
}

/**
 * Empty notification state
 * @param props - Component props
 * @param props.filter - Current active filter
 * @returns Empty state
 */

function NotificationEmpty({ filter }: NotificationEmptyProps) {
	// Render
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
				<Icon name="bell" size="lg" className="text-gray-400" />
			</div>
			<p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
				{filter === "unread" ? "Aucune notification non lue" : "Aucune notification"}
			</p>
			<p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
				{filter === "unread" ? "Vous etes a jour." : "Les nouvelles notifications apparaitront ici."}
			</p>
		</div>
	);
}
