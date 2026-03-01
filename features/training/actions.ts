"use server";

import { revalidatePath } from "next/cache";
import { TrainingService } from "@/services/TrainingService";
import { AuthService } from "@/services/AuthService";

export interface ActionResult {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
}

interface CreateTrainingFormData {
	groupId: string;
	title: string;
	description: string;
	category: string;
	instructorName: string;
	startDate: string;
	endDate: string;
	maxParticipants?: number;
	materials?: string[];
}

export async function createTrainingAction(formData: CreateTrainingFormData): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const training = await TrainingService.create(formData, currentUser.id);
	revalidatePath(`/hub/${formData.groupId}/training`);
	return { success: true, data: { id: training.id } };
}

export async function updateTrainingAction(
	trainingId: string,
	formData: Partial<CreateTrainingFormData>,
): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const training = await TrainingService.getById(trainingId);
	if (!training) return { success: false, error: "Formation introuvable" };
	await TrainingService.update(trainingId, formData, currentUser.id);
	revalidatePath(`/hub/${training.groupId}/training`);
	return { success: true };
}

export async function deleteTrainingAction(trainingId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const training = await TrainingService.getById(trainingId);
	if (!training) return { success: false, error: "Formation introuvable" };
	await TrainingService.delete(trainingId, currentUser.id);
	revalidatePath(`/hub/${training.groupId}/training`);
	return { success: true };
}

export async function updateTrainingStatusAction(trainingId: string, status: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const training = await TrainingService.getById(trainingId);
	if (!training) return { success: false, error: "Formation introuvable" };
	await TrainingService.updateStatus(trainingId, status, currentUser.id);
	revalidatePath(`/hub/${training.groupId}/training`);
	return { success: true };
}

export async function getTrainingAction(trainingId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const training = await TrainingService.getById(trainingId);
	if (!training) return { success: false, error: "Formation introuvable" };
	return { success: true, data: training as unknown as Record<string, unknown> };
}

export async function getTrainingsAction(groupId: string, page = 1, pageSize = 20): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const result = await TrainingService.getByGroup(groupId, page, pageSize);
	return { success: true, data: result as unknown as Record<string, unknown> };
}

export async function enrollInTrainingAction(trainingId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	try {
		await TrainingService.enroll(trainingId, currentUser.id);
		revalidatePath("/training");
		return { success: true };
	} catch (error) {
		return { success: false, error: (error as Error).message };
	}
}

export async function unenrollFromTrainingAction(trainingId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	await TrainingService.unenroll(trainingId, currentUser.id);
	revalidatePath("/training");
	return { success: true };
}

export async function getTrainingsByUserAction(): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const trainings = await TrainingService.getByUser(currentUser.id);
	return { success: true, data: { trainings } as unknown as Record<string, unknown> };
}
