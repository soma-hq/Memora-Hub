"use client";

import { useState, useMemo, useCallback } from "react";
import { useDataStore } from "@/store/data.store";
import type { Absence, AbsenceStatusValue, AbsenceFormData } from "./types";


/**
 * Absence list state hook
 * @returns Absences state and filters
 */

export function useAbsences() {
	// State
	const storeAbsences = useDataStore((s) => s.absences);
	const [absences, setAbsences] = useState<Absence[]>(storeAbsences);
	const [isLoading] = useState(false);
	const [statusFilter, setStatusFilter] = useState<AbsenceStatusValue | "all">("all");

	// Computed
	const filteredAbsences = useMemo(() => {
		if (statusFilter === "all") return absences;
		return absences.filter((a) => a.status === statusFilter);
	}, [absences, statusFilter]);

	const pendingCount = useMemo(() => {
		return absences.filter((a) => a.status === "pending").length;
	}, [absences]);

	return {
		absences,
		setAbsences,
		isLoading,
		statusFilter,
		setStatusFilter,
		filteredAbsences,
		pendingCount,
	};
}

/**
 * Absence CRUD actions hook
 * @param absences - Current absences array
 * @param setAbsences - State setter for absences
 * @returns CRUD functions with loading
 */

export function useAbsenceActions(absences: Absence[], setAbsences: React.Dispatch<React.SetStateAction<Absence[]>>) {
	// State
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Create absence from form data
	 * @param data - Absence form data
	 * @returns New absence entity
	 */
	const createAbsence = useCallback(
		async (data: AbsenceFormData) => {
			setIsLoading(true);
			await new Promise((r) => setTimeout(r, 500));

			const startMs = new Date(data.startDate).getTime();
			const endMs = new Date(data.endDate).getTime();
			const diffDays = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);

			const newAbsence: Absence = {
				id: `abs-${Date.now()}`,
				userId: "u-current",
				userName: "Utilisateur courant",
				type: data.type,
				startDate: data.startDate,
				endDate: data.endDate,
				reason: data.reason,
				status: "pending",
				days: diffDays,
				createdAt: new Date().toISOString().split("T")[0],
			};

			setAbsences((prev) => [newAbsence, ...prev]);
			setIsLoading(false);
			return newAbsence;
		},
		[setAbsences],
	);

	/**
	 * Approve absence by ID
	 * @param id - Absence ID
	 * @returns Nothing
	 */
	const approveAbsence = useCallback(
		async (id: string) => {
			setIsLoading(true);
			await new Promise((r) => setTimeout(r, 300));
			setAbsences((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" as const } : a)));
			setIsLoading(false);
		},
		[setAbsences],
	);

	/**
	 * Reject absence by ID
	 * @param id - Absence ID
	 * @returns Nothing
	 */
	const rejectAbsence = useCallback(
		async (id: string) => {
			setIsLoading(true);
			await new Promise((r) => setTimeout(r, 300));
			setAbsences((prev) => prev.map((a) => (a.id === id ? { ...a, status: "rejected" as const } : a)));
			setIsLoading(false);
		},
		[setAbsences],
	);

	return {
		createAbsence,
		approveAbsence,
		rejectAbsence,
		isLoading,
	};
}
