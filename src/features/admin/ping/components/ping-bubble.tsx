"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatRelative } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import { Card, Icon, Button } from "@/components/ui";
import { useModePalette } from "@/hooks/useModePalette";
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
	const palette = useModePalette();

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
		<div className="animate-fade-in absolute top-full right-0 z-50 mt-2 w-80">
			<Card padding="sm" className={cn("relative rounded-2xl border shadow-xl", palette.bubbleBorderClass)}>
				{/* Arrow */}
				<div
					className={cn(
						"absolute -top-2 right-5 h-4 w-4 rotate-45 border-t border-l bg-white dark:bg-gray-800",
						palette.bubbleBorderClass,
					)}
				/>

				{/* Header */}
				<div className="mb-3 flex items-start justify-between gap-3">
					<div className="flex min-w-0 items-center gap-2.5">
						<div
							className={cn(
								"flex h-7 w-7 items-center justify-center rounded-full",
								palette.bubbleIconWrapClass,
							)}
						>
							<Icon name="ping" size="xs" className={palette.bubbleIconClass} />
						</div>
						<div className="min-w-0">
							<p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
								{ping.fromUserName}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">vous a pingé</p>
						</div>
					</div>
					<Button variant="ghost" size="sm" onClick={onDismiss} className="!p-0.5">
						<Icon name="close" size="xs" />
					</Button>
				</div>

				{/* Essential context */}
				{ping.message && <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{ping.message}</p>}

				<div className="mb-3 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/70">
					<p className="truncate text-xs font-medium text-gray-700 dark:text-gray-200">{ping.targetLabel}</p>
					<p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
						{formatRelative(ping.createdAt)}
					</p>
				</div>

				{/* Action */}
				<div className="flex items-center justify-end">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleNavigate}
						className={cn("text-xs font-semibold", palette.bubbleActionClass)}
					>
						Voir la tâche
					</Button>
				</div>
			</Card>
		</div>
	);
}
