"use client";

import { cn } from "@/lib/utils/cn";
import type { AbsenceMode } from "@/features/absences/absence-mode";


interface AbsenceIndicatorProps {
	children: React.ReactNode;
	absenceMode?: AbsenceMode;
	className?: string;
}

/**
 * Absence mode indicator.
 * @param {AbsenceIndicatorProps} props - Component props
 * @param {React.ReactNode} props.children - Content to wrap
 * @param {AbsenceMode} [props.absenceMode="none"] - Current absence mode
 * @param {string} [props.className] - Extra CSS classes
 * @returns {JSX.Element} Styled absence span
 */

export function AbsenceIndicator({ children, absenceMode = "none", className }: AbsenceIndicatorProps) {
	if (absenceMode === "none") {
		return <span className={className}>{children}</span>;
	}

	if (absenceMode === "partial") {
		return <span className={cn("opacity-70", className)}>{children}</span>;
	}

	return (
		<span className={cn("cursor-default line-through opacity-60", className)} title="En absence">
			{children}
		</span>
	);
}
