"use client";

import { Icon, Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Notification } from "../types";
import { notificationTypeIconColor, notificationTypeLabel, notificationTypeVariant } from "../types";


/** Props for the NotificationItem component */
interface NotificationItemProps {
	notification: Notification;
	onRead: (id: string) => void;
	onClick?: (notification: Notification) => void;
}

/**
 * French relative time string
 * @param time - ISO timestamp string
 * @returns Relative time string
 */

function formatRelativeTime(time: string): string {
	const now = new Date();
	const date = new Date(time);
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60000);
	const diffH = Math.floor(diffMin / 60);
	const diffD = Math.floor(diffH / 24);

	if (diffMin < 1) return "A l'instant";
	if (diffMin < 60) return `Il y a ${diffMin} min`;
	if (diffH < 24) return `Il y a ${diffH}h`;
	if (diffD === 1) return "Hier";
	if (diffD < 7) return `Il y a ${diffD} jours`;

	return date.toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
	});
}

/**
 * Single notification row
 * @param props - Component props
 * @param props.notification - Notification to display
 * @param props.onRead - Mark-as-read callback
 * @param props.onClick - Click callback
 * @returns Notification item
 */

export function NotificationItem({ notification, onRead, onClick }: NotificationItemProps) {
	// Computed
	const { id, type, title, description, time, read, icon } = notification;

	// Handlers
	/**
	 * Mark read and fire click
	 * @returns Nothing
	 */
	const handleClick = () => {
		if (!read) {
			onRead(id);
		}
		onClick?.(notification);
	};

	// Render
	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-all duration-150",
				"hover:bg-gray-50 dark:hover:bg-gray-700/50",
				!read && "bg-primary-50/50 dark:bg-primary-900/10",
			)}
		>
			<div
				className={cn(
					"flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
					notificationTypeIconColor[type],
				)}
			>
				<Icon name={icon} size="md" />
			</div>

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-2">
					<p
						className={cn(
							"text-sm leading-tight",
							!read
								? "font-semibold text-gray-900 dark:text-white"
								: "font-medium text-gray-700 dark:text-gray-300",
						)}
					>
						{title}
					</p>
					<Badge variant={notificationTypeVariant[type]} showDot={false} className="shrink-0 text-[10px]">
						{notificationTypeLabel[type]}
					</Badge>
				</div>

				<p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{description}</p>

				<div className="mt-1.5 flex items-center gap-2">
					<Icon name="clock" size="xs" className="text-gray-400" />
					<span className="text-[11px] text-gray-400 dark:text-gray-500">{formatRelativeTime(time)}</span>
				</div>
			</div>

			{!read && <span className="bg-primary-500 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" />}
		</button>
	);
}
