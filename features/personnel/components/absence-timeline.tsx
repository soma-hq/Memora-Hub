"use client";

// Utils & hooks
import { cn } from "@/lib/utils/cn";
import type { AbsenceStatus } from "../types";


/** Props for the AbsenceTimeline component */
interface AbsenceTimelineProps {
	status: AbsenceStatus;
	submittedAt: string;
	respondedAt?: string;
	className?: string;
}

/** Timeline step definitions */
const STEPS = [
	{ key: "submitted", label: "Soumise" },
	{ key: "received", label: "Réceptionnée" },
	{ key: "acknowledged", label: "Prise en compte" },
] as const;

/**
 * Maps an absence status to its corresponding step index
 * @param status - Absence status to map
 * @returns Zero-based step index
 */
function getStepIndex(status: AbsenceStatus): number {
	switch (status) {
		case "pending":
			return 0;
		case "received":
			return 1;
		case "acknowledged":
			return 2;
		default:
			return 0;
	}
}

/**
 * Formats a date string to short French locale format
 * @param dateStr - ISO date string
 * @returns Formatted date string
 */
function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

/**
 * Three-step progress timeline for absence request status
 * @param props - Component props
 * @param props.status - Current absence status
 * @param props.submittedAt - Submission date ISO string
 * @param props.respondedAt - Response date ISO string
 * @param props.className - Additional CSS classes
 * @returns Horizontal step timeline with connectors
 */
export function AbsenceTimeline({ status, submittedAt, respondedAt, className }: AbsenceTimelineProps) {
	// Computed
	const activeIndex = getStepIndex(status);

	// Render
	return (
		<div className={cn("flex items-center gap-0", className)}>
			{STEPS.map((step, index) => {
				const isReached = index <= activeIndex;
				const isLast = index === STEPS.length - 1;

				let dateLabel = "";
				if (index === 0) dateLabel = formatDate(submittedAt);
				if (index === 1 && respondedAt && activeIndex >= 1) dateLabel = formatDate(respondedAt);
				if (index === 2 && respondedAt && activeIndex >= 2) dateLabel = formatDate(respondedAt);

				return (
					<div key={step.key} className="flex items-center">
						<div className="flex flex-col items-center">
							<div
								className={cn(
									"flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
									isReached
										? "border-primary-500 bg-primary-500"
										: "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800",
								)}
							>
								{isReached && (
									<svg
										className="h-3 w-3 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={3}
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								)}
							</div>
							<span
								className={cn(
									"mt-1.5 text-[10px] font-medium whitespace-nowrap",
									isReached
										? "text-primary-600 dark:text-primary-400"
										: "text-gray-400 dark:text-gray-500",
								)}
							>
								{step.label}
							</span>
							{dateLabel && (
								<span className="text-[9px] text-gray-400 dark:text-gray-500">{dateLabel}</span>
							)}
						</div>

						{!isLast && (
							<div
								className={cn(
									"mx-1 h-0.5 w-8 sm:w-12",
									index < activeIndex ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700",
								)}
								style={{ marginTop: "-16px" }}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
