"use client";

import {
	CalendarDaysIcon,
	ExclamationTriangleIcon,
	SparklesIcon,
	MapPinIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import { StyledEmptyState, SectionHeaderBanner } from "@/components/ui";
import { useModePalette } from "@/hooks/useModePalette";
import { cn } from "@/lib/utils/cn";
import type { ScheduleItem } from "../utils/briefing-engine";

// Type color mapping

const TYPE_STYLES: Record<ScheduleItem["type"], { dot: string; bg: string; icon: typeof CalendarDaysIcon }> = {
	meeting: {
		dot: "bg-blue-500",
		bg: "bg-blue-50 dark:bg-blue-900/20",
		icon: CalendarDaysIcon,
	},
	deadline: {
		dot: "bg-red-500",
		bg: "bg-red-50 dark:bg-red-900/20",
		icon: ExclamationTriangleIcon,
	},
	event: {
		dot: "bg-purple-500",
		bg: "bg-purple-50 dark:bg-purple-900/20",
		icon: SparklesIcon,
	},
};

/** Props for the TodaySchedule component */
interface TodayScheduleProps {
	items: ScheduleItem[];
}

/**
 * Timeline display of today's events with time, title, location, and participants.
 * @param {TodayScheduleProps} props - Component props
 * @param {ScheduleItem[]} props.items - Schedule items for the day
 * @returns {JSX.Element} Today schedule widget
 */

export function TodaySchedule({ items }: TodayScheduleProps) {
	const palette = useModePalette();

	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
			{/* Header collé */}
			<SectionHeaderBanner icon="calendar" title="Agenda du Jour" className="rounded-none">
				{items.length > 0 && (
					<span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", palette.chipClass)}>
						{items.length}
					</span>
				)}
			</SectionHeaderBanner>

			<div className="p-5">
				{/* Empty state */}
				{items.length === 0 && (
					<StyledEmptyState
						icon="calendar"
						title="Aucun événement prévu"
						description="Votre agenda du jour est libre."
					/>
				)}

				{/* Timeline */}
				{items.length > 0 && (
					<div className="relative">
						{/* Vertical connector line */}
						{items.length > 1 && (
							<div className="absolute top-4 bottom-4 left-[39px] w-px bg-gray-200 dark:bg-gray-700" />
						)}

						<div className="space-y-3">
							{items.map((item) => {
								const style = TYPE_STYLES[item.type];
								const TypeIcon = style.icon;

								return (
									<div key={item.id} className="relative flex gap-4">
										{/* Time column */}
										<div className="w-14 flex-shrink-0 pt-2.5 text-right">
											<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
												{item.time}
											</span>
										</div>

										{/* Dot on timeline */}
										<div className="relative z-10 flex flex-shrink-0 items-start pt-3">
											<div
												className={cn(
													"h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800",
													style.dot,
												)}
											/>
										</div>

										{/* Content card */}
										<div
											className={cn(
												"flex-1 rounded-xl border border-gray-200 p-3 transition-all duration-200",
												"hover:shadow-md dark:border-gray-700",
												style.bg,
											)}
										>
											<div className="flex items-start gap-2">
												<TypeIcon
													className={cn(
														"mt-0.5 h-4 w-4 flex-shrink-0",
														item.type === "meeting"
															? "text-blue-500"
															: item.type === "deadline"
																? "text-red-500"
																: "text-purple-500",
													)}
												/>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-800 dark:text-gray-200">
														{item.title}
													</p>

													{/* Location */}
													{item.location && (
														<div className="mt-1 flex items-center gap-1">
															<MapPinIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
															<span className="text-xs text-gray-400 dark:text-gray-500">
																{item.location}
															</span>
														</div>
													)}

													{/* Participants */}
													{item.participants.length > 0 && (
														<div className="mt-1 flex items-center gap-1">
															<UsersIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
															<span className="text-xs text-gray-400 dark:text-gray-500">
																{item.participants.join(", ")}
															</span>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
