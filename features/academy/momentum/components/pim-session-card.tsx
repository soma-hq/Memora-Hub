"use client";

import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { PimSession } from "../types";
import { sessionStatusVariantMap } from "../types";

// Props for the PimSessionCard component
interface PimSessionCardProps {
	session: PimSession;
	onClick: () => void;
}

/**
 * PIM session summary card
 * @param props.session - PIM session data
 * @param props.onClick - Card click handler
 * @returns Session card
 */

export function PimSessionCard({ session, onClick }: PimSessionCardProps) {
	// Computed
	const juniorsCount = session.juniors.length;
	const formattedDate = new Date(session.startDate).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	// Render
	return (
		<Card hover onClick={onClick} className="group">
			{/* Header */}
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">{session.entity}</h3>
				</div>
				<Badge variant={sessionStatusVariantMap[session.status]}>{session.status}</Badge>
			</div>

			{/* Meta row */}
			<div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
				<div className="flex items-center gap-1.5">
					<Icon name="users" size="sm" className="text-gray-400 dark:text-gray-500" />
					<span>
						{juniorsCount} junior{juniorsCount !== 1 ? "s" : ""}
					</span>
				</div>

				<div className="flex items-center gap-1.5">
					<Icon name="calendar" size="sm" className="text-gray-400 dark:text-gray-500" />
					<span>{formattedDate}</span>
				</div>

				<div className="ml-auto flex items-center gap-1.5">
					<Icon name="profile" size="sm" className="text-gray-400 dark:text-gray-500" />
					<span className="truncate">{session.createdBy}</span>
				</div>
			</div>
		</Card>
	);
}
