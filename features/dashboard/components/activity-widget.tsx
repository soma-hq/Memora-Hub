"use client";

// Next.js
import Link from "next/link";
import { Card, CardHeader, CardBody, Icon, Avatar } from "@/components/ui";
import { useDashboardActivity } from "../hooks";


/** Props for the ActivityWidget component */
interface ActivityWidgetProps {
	className?: string;
}

/**
 * Dashboard widget showing recent team activity feed
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @returns Activity feed card with recent entries
 */
export function ActivityWidget({ className }: ActivityWidgetProps) {
	// State
	const { activities } = useDashboardActivity();

	// Render
	return (
		<Card padding="sm" className={className}>
			<CardHeader>
				<h3 className="text-base font-semibold text-gray-900 dark:text-white">Activite recente</h3>
				<Link
					href="/activity"
					className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors"
				>
					Voir tout
				</Link>
			</CardHeader>

			<CardBody className="py-0">
				<div className="relative space-y-1">
					<div className="absolute top-0 bottom-0 left-[19px] w-px bg-gray-200 dark:bg-gray-700" />

					{activities.map((entry) => (
						<div
							key={entry.id}
							className="relative flex items-start gap-3 rounded-lg py-2.5 pr-2 pl-0 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
						>
							<Avatar
								name={entry.actor}
								size="xs"
								className="relative z-10 shrink-0 ring-2 ring-white dark:ring-gray-800"
							/>

							<div className="min-w-0 flex-1">
								<p className="text-sm text-gray-700 dark:text-gray-300">
									<span className="font-medium text-gray-900 dark:text-white">{entry.actor}</span>{" "}
									{entry.action}{" "}
									<span className="font-medium text-gray-900 dark:text-white">{entry.subject}</span>
								</p>
								<div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
									<Icon name="clock" size="xs" />
									<span>{entry.time}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
