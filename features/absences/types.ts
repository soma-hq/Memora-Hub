import type { AbsenceTypeValue, AbsenceStatusValue } from "@/constants";
import { AbsenceTypeLabel, AbsenceStatusLabel } from "@/constants";

export type { AbsenceTypeValue, AbsenceStatusValue };

// Re-export labels for consumer convenience
export { AbsenceTypeLabel, AbsenceStatusLabel };
// Re-export variant maps from design system
export {

	absenceStatusVariant,
	absenceTypeVariant,
	absenceTypeCalendarColors,
	absenceTypeDotColors,
} from "@/core/design/states";

/** Absence type options for select inputs */
export const absenceTypeOptions = Object.entries(AbsenceTypeLabel).map(([value, label]) => ({
	label,
	value: value as AbsenceTypeValue,
}));

/** Absence status filter options for select inputs */
export const absenceStatusOptions = [
	{ label: "Tous", value: "all" as const },
	...Object.entries(AbsenceStatusLabel).map(([value, label]) => ({
		label,
		value: value as AbsenceStatusValue,
	})),
];

/** Core absence entity */
export interface Absence {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	type: AbsenceTypeValue;
	startDate: string;
	endDate: string;
	reason?: string;
	status: AbsenceStatusValue;
	days: number;
	createdAt: string;
}

/** Form data for creating an absence request */
export interface AbsenceFormData {
	type: AbsenceTypeValue;
	startDate: string;
	endDate: string;
	reason?: string;
}
