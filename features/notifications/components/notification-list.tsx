"use client";

import { Button, Card, CardHeader, CardBody, Icon, Tabs, Skeleton } from "@/components/ui";
import { NotificationItem } from "./notification-item";
import { cn } from "@/lib/utils/cn";
import { useNotifications } from "../hooks";
import type { Notification, NotificationFilter } from "../types";


/** Props for the NotificationList component */
interface NotificationListProps {
	onNotificationClick?: (notification: Notification) => void;
	className?: string;
}

/** Filter tab definitions */
const FILTER_TABS = [
	{ id: "all" as const, label: "Toutes" },
	{ id: "unread" as const, label: "Non lues" },
];

/**
 * Notification list card
 * @param props - Component props
 * @param props.onNotificationClick - Notification click callback
 * @param props.className - Additional CSS classes
 * @returns Notification list card
 */

export function NotificationList({ onNotificationClick, className }: NotificationListProps) {
	// State
	const { groupedNotifications, unreadCount, isLoading, markAsRead, markAllAsRead, filter, setFilter } =
		useNotifications();

	// Computed
	const tabs = FILTER_TABS.map((tab) => ({
		...tab,
		count: tab.id === "unread" ? unreadCount : undefined,
	}));

	// Render
	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader>
				<div className="flex items-center gap-2">
					<Icon name="bell" size="lg" className="text-primary-500" />
					<div>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{unreadCount > 0
								? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
								: "Tout est a jour"}
						</p>
					</div>
				</div>

				{unreadCount > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={markAllAsRead}
						className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-xs"
					>
						<Icon name="check" size="sm" className="mr-1" />
						Tout marquer comme lu
					</Button>
				)}
			</CardHeader>

			<div className="px-4 pt-2">
				<Tabs
					tabs={tabs}
					activeTab={filter}
					onTabChange={(id) => setFilter(id as NotificationFilter)}
					variant="underline"
				/>
			</div>

			<CardBody className="px-2 py-2">
				{isLoading ? (
					<NotificationListSkeleton />
				) : groupedNotifications.length === 0 ? (
					<EmptyState filter={filter} />
				) : (
					<div className="space-y-4">
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
											onClick={onNotificationClick}
										/>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</CardBody>
		</Card>
	);
}

/** Props for the EmptyState component */
interface EmptyStateProps {
	filter: NotificationFilter;
}

/**
 * Empty notification state
 * @param props - Component props
 * @param props.filter - Current active filter
 * @returns Empty state
 */

function EmptyState({ filter }: EmptyStateProps) {
	// Render
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
				<Icon name="bell" size="lg" className="text-gray-400" />
			</div>
			<p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
				{filter === "unread" ? "Aucune notification non lue" : "Aucune notification"}
			</p>
			<p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
				{filter === "unread" ? "Vous avez tout lu, bravo !" : "Les nouvelles notifications apparaitront ici."}
			</p>
		</div>
	);
}

/**
 * Notification list skeleton
 * @returns Skeleton placeholder
 */

function NotificationListSkeleton() {
	// Render
	return (
		<div className="space-y-3 px-3">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex items-start gap-3 py-3">
					<Skeleton variant="circular" className="h-10 w-10" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-1/3" />
					</div>
				</div>
			))}
		</div>
	);
}
