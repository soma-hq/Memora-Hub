"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon, Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { formatRelative } from "@/lib/utils/date";
import type { PingNotification } from "@/features/ping/types";

interface PingSectionProps {
	pings: PingNotification[];
	onMarkRead: (id: string) => void;
	onMarkAllRead: () => void;
}

/** Ping section inside the NotificationCenter */
export function PingSection({ pings, onMarkRead, onMarkAllRead }: PingSectionProps) {
	const router = useRouter();
	const unreadPings = pings.filter((p) => !p.read);

	const handleNavigate = (ping: PingNotification) => {
		onMarkRead(ping.id);
		router.push(ping.targetPath);
	};

	if (pings.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
					<Icon name="ping" size="lg" className="text-rose-400" />
				</div>
				<p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">Aucun ping</p>
				<p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
					Les pings que vous recevez apparaitront ici.
				</p>
			</div>
		);
	}

	return (
		<div>
			{unreadPings.length > 0 && (
				<div className="flex items-center justify-end border-b border-gray-50 px-5 py-2 dark:border-gray-700/50">
					<Button variant="ghost" size="sm" onClick={onMarkAllRead} className="text-xs">
						<Icon name="check" size="xs" className="mr-1" />
						Tout lire
					</Button>
				</div>
			)}

			<div className="space-y-0.5 px-2 py-2">
				{pings.map((ping) => (
					<button
						key={ping.id}
						onClick={() => handleNavigate(ping)}
						className={cn(
							"flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors",
							ping.read
								? "hover:bg-gray-50 dark:hover:bg-gray-700/50"
								: "bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-900/10 dark:hover:bg-rose-900/20",
						)}
					>
						{/* Ping indicator dot */}
						<div className="mt-1.5 flex-shrink-0">
							<div className={cn("h-2 w-2 rounded-full", ping.read ? "bg-transparent" : "bg-rose-500")} />
						</div>

						{/* Avatar */}
						<div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-100 dark:bg-rose-900/30">
							{ping.fromUserAvatar ? (
								<Image
									src={ping.fromUserAvatar}
									alt={ping.fromUserName}
									width={36}
									height={36}
									className="h-9 w-9 rounded-full object-cover"
								/>
							) : (
								<Icon name="ping" size="sm" className="text-rose-500" />
							)}
						</div>

						{/* Content */}
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-1">
								<span className="text-sm font-medium text-gray-900 dark:text-white">
									{ping.fromUserName}
								</span>
								<span className="text-xs text-gray-400">vous a ping</span>
							</div>
							{ping.message && (
								<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{ping.message}</p>
							)}
							<div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
								<Icon name="link" size="xs" />
								<span className="truncate">{ping.targetLabel}</span>
								<span>·</span>
								<span>{formatRelative(ping.createdAt)}</span>
							</div>
						</div>

						{/* Arrow */}
						<div className="mt-2 flex-shrink-0">
							<Icon name="chevronRight" size="xs" className="text-gray-300 dark:text-gray-600" />
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
