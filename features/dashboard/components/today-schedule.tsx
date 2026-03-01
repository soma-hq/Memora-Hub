"use client";

// Components
import {

	CalendarDaysIcon,
	ExclamationTriangleIcon,
	SparklesIcon,
	MapPinIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";

// Utils & hooks
import { cn } from "@/lib/utils/cn";
import type { ScheduleItem } from "../utils/briefing-engine";


// ─── Type color mapping ─────────────────────────────────────────────────────

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

// ─── Props ──────────────────────────────────────────────────────────────────

/** Props for the TodaySchedule component */
interface TodayScheduleProps {
	items: ScheduleItem[];
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Timeline display of today's events with time, title, location, and participants.
 * Left side shows time, right side shows event details with a vertical connector line.
 */
export function TodaySchedule({ items }: TodayScheduleProps) {
	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
			{/* Header */}
			<div className="mb-4 flex items-center gap-2">
				<CalendarDaysIcon className="h-5 w-5 text-pink-500" />
				<h3 className="text-base font-semibold text-gray-900 dark:text-white">Agenda du jour</h3>
				{items.length > 0 && (
					<span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
						{items.length}
					</span>
				)}
			</div>

			{/* Empty state */}
			{items.length === 0 && (
				<div className="py-8 text-center">
					<CalendarDaysIcon className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
					<p className="mt-2 text-sm text-gray-400 dark:text-gray-500">Aucun evenement prevu aujourd'hui.</p>
				</div>
			)}

			{/* Timeline */}
			{items.length > 0 && (
				<div className="relative">
					{/* Vertical connector line */}
					{items.length > 1 && (
						<div className="absolute top-4 bottom-4 left-[39px] w-px bg-gray-200 dark:bg-gray-700" />
					)}

					<div className="space-y-3">
						{items.map((item, index) => {
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
	);
}
