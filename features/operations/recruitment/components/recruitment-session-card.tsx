"use client";

import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { RecruitmentSession } from "../types";
import { sessionStatusVariantMap, sessionTypeVariantMap } from "../types";


/** Props for the RecruitmentSessionCard component */
interface RecruitmentSessionCardProps {
	session: RecruitmentSession;
	onClick?: () => void;
	className?: string;
}

/**
 * Recruitment session summary card
 * @param props.session - Session data
 * @param props.onClick - Card click handler
 * @param props.className - Extra CSS classes
 * @returns Session card with metadata row
 */

export function RecruitmentSessionCard({ session, onClick, className }: RecruitmentSessionCardProps) {
	// Computed
	const candidateCount = session.candidates.length;
	const dateRange = session.endDate ? `${session.startDate} — ${session.endDate}` : `Depuis le ${session.startDate}`;

	// Render
	return (
		<Card hover onClick={onClick} className={cn("group", className)}>
			{/* Header row */}
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="mb-1 flex items-center gap-2">
						<Badge variant={sessionTypeVariantMap[session.type]} showDot={false}>
							{session.type}
						</Badge>
						<Badge variant={sessionStatusVariantMap[session.status]}>{session.status}</Badge>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						{session.type} — {session.entity}
					</h3>
				</div>
				<Icon
					name="chevronRight"
					size="md"
					className="mt-1 text-gray-400 transition-transform group-hover:translate-x-0.5 dark:text-gray-500"
				/>
			</div>

			{/* Meta row */}
			<div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
				<span className="inline-flex items-center gap-1.5">
					<Icon name="calendar" size="xs" className="text-gray-400" />
					{dateRange}
				</span>
				<span className="inline-flex items-center gap-1.5">
					<Icon name="users" size="xs" className="text-gray-400" />
					{candidateCount} candidat{candidateCount !== 1 ? "s" : ""}
				</span>
				<span className="inline-flex items-center gap-1.5">
					<Icon name="profile" size="xs" className="text-gray-400" />
					{session.createdBy}
				</span>
			</div>
		</Card>
	);
}
