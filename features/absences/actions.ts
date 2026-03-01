"use server";

import { revalidatePath } from "next/cache";
import { AbsenceService } from "@/services/AbsenceService";
import { AuthService } from "@/services/AuthService";
import { createAbsenceSchema } from "@/lib/validators/schemas";
import type { CreateAbsenceFormData } from "@/lib/validators/schemas";

export interface ActionResult {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
}

export async function createAbsenceAction(formData: CreateAbsenceFormData): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const parsed = createAbsenceSchema.safeParse(formData);
	if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Donnees invalides" };
	const absence = await AbsenceService.create(currentUser.id, parsed.data);
	revalidatePath("/absences");
	return { success: true, data: { id: absence.id } };
}

export async function approveAbsenceAction(absenceId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const absence = await AbsenceService.getById(absenceId);
	if (!absence) return { success: false, error: "Absence introuvable" };
	await AbsenceService.approve(absenceId, currentUser.id);
	revalidatePath("/absences");
	return { success: true };
}

export async function rejectAbsenceAction(absenceId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const absence = await AbsenceService.getById(absenceId);
	if (!absence) return { success: false, error: "Absence introuvable" };
	await AbsenceService.reject(absenceId, currentUser.id);
	revalidatePath("/absences");
	return { success: true };
}

export async function deleteAbsenceAction(absenceId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const absence = await AbsenceService.getById(absenceId);
	if (!absence) return { success: false, error: "Absence introuvable" };
	await AbsenceService.delete(absenceId, currentUser.id);
	revalidatePath("/absences");
	return { success: true };
}

export async function getAbsenceAction(absenceId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const absence = await AbsenceService.getById(absenceId);
	if (!absence) return { success: false, error: "Absence introuvable" };
	return { success: true, data: absence as unknown as Record<string, unknown> };
}

export async function getAbsencesAction(page = 1, pageSize = 20, status?: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const result = await AbsenceService.getAll(page, pageSize, status);
	return { success: true, data: result as unknown as Record<string, unknown> };
}

export async function getAbsencesByUserAction(userId?: string, status?: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const absences = await AbsenceService.getByUser(userId ?? currentUser.id, status);
	return { success: true, data: { absences } as unknown as Record<string, unknown> };
}

export async function countPendingAbsencesAction(): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const count = await AbsenceService.countPending();
	return { success: true, data: { count } };
}

export async function getAbsencesByDateRangeAction(startDate: string, endDate: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const absences = await AbsenceService.getByDateRange(new Date(startDate), new Date(endDate));
	return { success: true, data: { absences } as unknown as Record<string, unknown> };
}
