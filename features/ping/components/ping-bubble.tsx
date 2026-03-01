"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatRelative } from "@/lib/utils/date";
import { Icon, Button } from "@/components/ui";
import type { PingNotification } from "../types";

interface PingBubbleProps {
	// The ping to display
	ping: PingNotification;
	// Called when the user dismisses the bubble
	onDismiss: () => void;
	// Called when the user clicks to navigate
	onNavigate: (pingId: string) => void;
}

// Bubble popup
export function PingBubble({ ping, onDismiss, onNavigate }: PingBubbleProps) {
	const router = useRouter();

	// Auto-dismiss after 8 seconds
	useEffect(() => {
		const timer = setTimeout(onDismiss, 8000);
		return () => clearTimeout(timer);
	}, [onDismiss]);

	const handleNavigate = () => {
		onNavigate(ping.id);
		router.push(ping.targetPath);
	};

	return (
		<div className="animate-fade-in absolute top-full right-0 z-50 mt-2 w-72">
			<div className="relative rounded-xl border border-rose-200 bg-white px-4 py-3 shadow-lg dark:border-rose-800 dark:bg-gray-800">
				{/* Arrow */}
				<div className="absolute -top-2 right-4 h-4 w-4 rotate-45 border-t border-l border-rose-200 bg-white dark:border-rose-800 dark:bg-gray-800" />

				{/* Header */}
				<div className="mb-2 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
							<Icon name="ping" size="xs" className="text-rose-500" />
						</div>
						<span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Ping</span>
					</div>
					<button
						onClick={onDismiss}
						className="rounded-md p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
					>
						<Icon name="close" size="xs" />
					</button>
				</div>

				{/* Content */}
				<div className="mb-2">
					<p className="text-sm font-medium text-gray-900 dark:text-white">{ping.fromUserName}</p>
					{ping.message && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{ping.message}</p>}
				</div>

				{/* Target & action */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1 text-xs text-gray-400">
						<Icon name="link" size="xs" />
						<span className="max-w-[120px] truncate">{ping.targetLabel}</span>
						<span>· {formatRelative(ping.createdAt)}</span>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleNavigate}
						className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400"
					>
						Voir
					</Button>
				</div>
			</div>
		</div>
	);
}
