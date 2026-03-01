"use client";

// React
import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { BadgeVariant } from "@/core/design/states";


/** Meeting item for the dashboard widget */
interface MeetingItem {
	id: string;
	title: string;
	startTime: string;
	endTime: string;
	type: string;
	participantCount: number;
	isOnline: boolean;
}

/** Props for the MeetingsWidget component */
interface MeetingsWidgetProps {
	className?: string;
}

/** Badge variant mapping for meeting types */
const typeVariantMap: Record<string, BadgeVariant> = {
	Reunion: "info",
	Standup: "success",
	Revue: "warning",
	Retrospective: "primary",
	Entretien: "neutral",
};

/**
 * Dashboard widget showing upcoming meetings with time, type, and participant count
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @returns Meeting list card for the dashboard
 */
export function MeetingsWidget({ className }: MeetingsWidgetProps) {
	// State
	const [meetings] = useState<MeetingItem[]>([]);

	// Render
	return (
		<Card padding="sm" className={className}>
			<CardHeader>
				<h3 className="text-base font-semibold text-gray-900 dark:text-white">Reunions a venir</h3>
				<Link
					href="/meetings"
					className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors"
				>
					Voir tout
				</Link>
			</CardHeader>

			<CardBody className="divide-y divide-gray-100 py-0 dark:divide-gray-700">
				{meetings.length === 0 && (
					<div className="flex items-center justify-center py-8">
						<p className="text-sm text-gray-400 dark:text-gray-500">Aucune reunion a venir.</p>
					</div>
				)}

				{meetings.map((meeting) => (
					<div key={meeting.id} className="flex items-center gap-3 py-3 first:pt-3">
						<div className="w-16 shrink-0 text-center">
							<p className="text-sm font-semibold text-gray-900 dark:text-white">{meeting.startTime}</p>
							<p className="text-[11px] text-gray-500 dark:text-gray-400">{meeting.endTime}</p>
						</div>

						<div className="h-10 w-px shrink-0 bg-gray-200 dark:bg-gray-700" />

						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
								{meeting.title}
							</p>
							<div className="mt-1 flex items-center gap-2">
								<Badge
									variant={typeVariantMap[meeting.type] || "neutral"}
									showDot
									className="text-[10px]"
								>
									{meeting.type}
								</Badge>
							</div>
						</div>

						<div className="flex shrink-0 items-center gap-2">
							<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
								<Icon name="users" size="xs" />
								<span>{meeting.participantCount}</span>
							</div>
							{meeting.isOnline && (
								<span
									className={cn("bg-success-500 inline-block h-2 w-2 rounded-full")}
									title="En ligne"
								/>
							)}
						</div>
					</div>
				))}
			</CardBody>
		</Card>
	);
}
