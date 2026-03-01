"use client";

import { Icon, Popover } from "@/components/ui";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils/cn";
import { showSuccess } from "@/lib/utils/toast";
import { ABSENCE_MODE_OPTIONS } from "@/features/absences/absence-mode";
import type { AbsenceMode } from "@/features/absences/absence-mode";


/**
 * Absence mode selector.
 * @returns {JSX.Element} Absence mode selector popover
 */

export function AbsenceModePopover() {
	// State
	const absenceMode = useUIStore((s) => s.absenceMode);
	const setAbsenceMode = useUIStore((s) => s.setAbsenceMode);

	// Handlers
	/**
	 * Applies absence mode, shows toast.
	 * @param {AbsenceMode} mode - Selected absence mode
	 */

	const handleSelect = (mode: AbsenceMode) => {
		setAbsenceMode(mode);
		const label = ABSENCE_MODE_OPTIONS.find((opt) => opt.mode === mode)?.label ?? mode;
		showSuccess(`Mode changé : ${label}`);
	};

	// Computed
	const currentIcon = absenceMode === "none" ? "check" : absenceMode === "partial" ? "clock" : "absence";

	// Render
	return (
		<Popover
			trigger={
				<button
					title="Mode d'absence"
					className={cn(
						"rounded-lg p-2 transition-all duration-300",
						absenceMode !== "none"
							? "text-warning-500 dark:text-warning-400"
							: "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
					)}
				>
					<Icon name={currentIcon} size="md" />
				</button>
			}
			className="min-w-[280px]"
		>
			<div className="space-y-2">
				<div className="flex items-center gap-2 pb-1">
					<Icon name="absence" size="sm" className="text-primary-500" />
					<span className="text-sm font-semibold text-gray-900 dark:text-white">Mode d&apos;absence</span>
				</div>

				{ABSENCE_MODE_OPTIONS.map((option) => {
					const isSelected = absenceMode === option.mode;
					return (
						<button
							key={option.mode}
							onClick={() => handleSelect(option.mode)}
							className={cn(
								"flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150",
								isSelected
									? "bg-primary-50 ring-primary-200 dark:bg-primary-900/20 dark:ring-primary-800 ring-1"
									: "hover:bg-gray-50 dark:hover:bg-gray-700/50",
							)}
						>
							{/* Icon */}
							<div
								className={cn(
									"mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
									isSelected
										? "bg-primary-500 text-white"
										: "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500",
								)}
							>
								<Icon name={option.icon} size="xs" />
							</div>

							{/* Text */}
							<div className="min-w-0 flex-1">
								<p
									className={cn(
										"text-sm font-medium",
										isSelected
											? "text-primary-700 dark:text-primary-300"
											: "text-gray-700 dark:text-gray-300",
									)}
								>
									{option.label}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
							</div>

							{/* Check circle */}
							<div className="mt-1 shrink-0">
								{isSelected ? (
									<div className="bg-primary-500 flex h-5 w-5 items-center justify-center rounded-full">
										<Icon name="check" size="xs" className="text-white" />
									</div>
								) : (
									<div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
								)}
							</div>
						</button>
					);
				})}
			</div>
		</Popover>
	);
}
