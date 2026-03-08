import type { AbsencesConfig } from "@/core/config/schemas/absences.schema";
import type { Absence, AbsenceFormData } from "@/features/operations/absences/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface AbsenceValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Business logic for absence requests.
 * Receives its config from the container — never imports it directly.
 */
export class AbsenceManager {
	constructor(private readonly config: AbsencesConfig) {}

	/**
	 * Compute the number of days between two ISO date strings (inclusive).
	 */
	computeDays(startDate: string, endDate: string): number {
		const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
		return Math.max(1, Math.round(diff / MS_PER_DAY) + 1);
	}

	/**
	 * Validate an absence request against business rules from config.
	 */
	validateRequest(data: AbsenceFormData): AbsenceValidationResult {
		const days = this.computeDays(data.startDate, data.endDate);

		if (days > this.config.maxDaysPerRequest) {
			return {
				valid: false,
				error: `La demande ne peut pas dépasser ${this.config.maxDaysPerRequest} jours.`,
			};
		}

		if (this.config.requireApproval) {
			const today = new Date().toISOString().split("T")[0];
			const noticeDays = this.computeDays(today, data.startDate);

			if (noticeDays < this.config.minNoticeDays) {
				return {
					valid: false,
					error: `Un préavis de ${this.config.minNoticeDays} jour(s) minimum est requis.`,
				};
			}
		}

		return { valid: true };
	}

	/**
	 * Build an optimistic UI Absence object before server confirmation.
	 * userId and userName must be provided by the caller (from session/store).
	 */
	buildOptimisticAbsence(data: AbsenceFormData, userId: string, userName: string): Absence {
		return {
			id: `abs-${Date.now()}`,
			userId,
			userName,
			type: data.type,
			startDate: data.startDate,
			endDate: data.endDate,
			reason: data.reason,
			status: "pending",
			days: this.computeDays(data.startDate, data.endDate),
			createdAt: new Date().toISOString().split("T")[0],
		};
	}
}
