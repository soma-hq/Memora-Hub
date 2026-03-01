"use client";

import { Card, CardHeader, CardBody, Badge, Button, SelectMenu, Icon, Avatar, EmptyState } from "@/components/ui";
import type { SelectMenuOption } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Absence, AbsenceStatusValue } from "../types";
import { absenceStatusVariant, absenceTypeVariant, absenceStatusOptions } from "../types";


/** Status filter options formatted for SelectMenu */
const STATUS_MENU_OPTIONS: SelectMenuOption[] = absenceStatusOptions.map((opt) => ({
	label: opt.label,
	value: opt.value,
	icon:
		opt.value === "all"
			? "filter"
			: opt.value === "pending"
				? "clock"
				: opt.value === "approved"
					? "check"
					: "close",
}));

/** Props for the AbsenceList component */
interface AbsenceListProps {
	absences: Absence[];
	statusFilter: AbsenceStatusValue | "all";
	onStatusFilterChange: (value: AbsenceStatusValue | "all") => void;
	onApprove?: (id: string) => void;
	onReject?: (id: string) => void;
	isManager?: boolean;
	isLoading?: boolean;
	className?: string;
}

/**
 * Short French date format
 * @param dateStr - ISO date string
 * @returns Formatted date
 */

function formatDate(dateStr: string): string {
	const d = new Date(dateStr);
	return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Format date range string
 * @param startDate - Start ISO string
 * @param endDate - End ISO string
 * @returns Date range string
 */

function formatDateRange(startDate: string, endDate: string): string {
	if (startDate === endDate) return formatDate(startDate);
	return `${formatDate(startDate)} — ${formatDate(endDate)}`;
}

/**
 * Filterable absence list
 * @param props - Component props
 * @param props.absences - Absences to display
 * @param props.statusFilter - Current status filter
 * @param props.onStatusFilterChange - Filter change callback
 * @param props.onApprove - Approve callback
 * @param props.onReject - Reject callback
 * @param props.isManager - Manager permission flag
 * @param props.isLoading - Loading state
 * @param props.className - Additional CSS classes
 * @returns Absence list card
 */

export function AbsenceList({
	absences,
	statusFilter,
	onStatusFilterChange,
	onApprove,
	onReject,
	isManager = false,
	isLoading = false,
	className,
}: AbsenceListProps) {
	// Render
	return (
		<Card className={className}>
			<CardHeader>
				<div className="flex items-center gap-3">
					<Icon name="absence" size="md" className="text-primary-500" />
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Demandes d&apos;absence</h2>
					<Badge variant="neutral" showDot={false}>
						{absences.length}
					</Badge>
				</div>

				<div className="w-48">
					<SelectMenu
						options={STATUS_MENU_OPTIONS}
						value={statusFilter}
						onChange={(val) => onStatusFilterChange(val as AbsenceStatusValue | "all")}
						placeholder="Filtrer par statut"
					/>
				</div>
			</CardHeader>

			<CardBody className={cn("py-0", isLoading && "pointer-events-none opacity-60")}>
				{absences.length === 0 ? (
					<EmptyState
						icon="absence"
						title="Aucune absence trouvee"
						description="Aucune demande d'absence ne correspond aux filtres selectionnes."
					/>
				) : (
					<ul className="divide-y divide-gray-200 dark:divide-gray-700">
						{absences.map((absence) => (
							<li key={absence.id} className="flex items-center gap-4 py-4 first:pt-2 last:pb-2">
								<Avatar name={absence.userName} src={absence.userAvatar} size="md" />

								<div className="min-w-0 flex-1">
									<div className="mb-0.5 flex items-center gap-2">
										<span className="truncate text-sm font-medium text-gray-900 dark:text-white">
											{absence.userName}
										</span>
										<Badge variant={absenceTypeVariant[absence.type]}>{absence.type}</Badge>
									</div>
									<div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
										<span className="flex items-center gap-1">
											<Icon name="calendar" size="xs" />
											{formatDateRange(absence.startDate, absence.endDate)}
										</span>
										<span className="flex items-center gap-1">
											<Icon name="clock" size="xs" />
											{absence.days} jour{absence.days > 1 ? "s" : ""}
										</span>
									</div>
									{absence.reason && (
										<p className="mt-1 truncate text-xs text-gray-400 dark:text-gray-500">
											{absence.reason}
										</p>
									)}
								</div>

								<div className="flex shrink-0 items-center gap-3">
									<Badge variant={absenceStatusVariant[absence.status]}>{absence.status}</Badge>

									{isManager && absence.status === "pending" && (
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onApprove?.(absence.id)}
												disabled={isLoading}
												className="text-success-600 hover:text-success-700 hover:bg-success-50 dark:hover:bg-success-900/20"
											>
												<Icon name="check" size="sm" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onReject?.(absence.id)}
												disabled={isLoading}
												className="text-error-600 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-900/20"
											>
												<Icon name="close" size="sm" />
											</Button>
										</div>
									)}
								</div>
							</li>
						))}
					</ul>
				)}
			</CardBody>
		</Card>
	);
}
