"use server";

import { revalidatePath } from "next/cache";
import { RecruitmentService } from "@/services/RecruitmentService";
import { AuthService } from "@/services/AuthService";

export interface ActionResult {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
}

interface CreateJobOfferFormData {
	title: string;
	description: string;
	department: string;
	location: string;
	contractType: string;
	requirements?: string[];
}

interface CreateCandidateFormData {
	offerId: string;
	name: string;
	email: string;
	avatar?: string;
	userId?: string;
	notes?: string;
}

export async function createJobOfferAction(groupId: string, formData: CreateJobOfferFormData): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const offer = await RecruitmentService.createOffer({ ...formData, groupId }, currentUser.id);
	revalidatePath(`/hub/${groupId}/recruitment`);
	return { success: true, data: { id: offer.id } };
}

export async function updateJobOfferAction(
	offerId: string,
	formData: Partial<CreateJobOfferFormData>,
): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const offer = await RecruitmentService.getOfferById(offerId);
	if (!offer) return { success: false, error: "Offre introuvable" };
	await RecruitmentService.updateOffer(offerId, formData, currentUser.id);
	revalidatePath(`/hub/${offer.groupId}/recruitment`);
	return { success: true };
}

export async function deleteJobOfferAction(offerId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const offer = await RecruitmentService.getOfferById(offerId);
	if (!offer) return { success: false, error: "Offre introuvable" };
	await RecruitmentService.deleteOffer(offerId, currentUser.id);
	revalidatePath(`/hub/${offer.groupId}/recruitment`);
	return { success: true };
}

export async function updateOfferStatusAction(offerId: string, status: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const offer = await RecruitmentService.getOfferById(offerId);
	if (!offer) return { success: false, error: "Offre introuvable" };
	await RecruitmentService.updateOfferStatus(offerId, status, currentUser.id);
	revalidatePath(`/hub/${offer.groupId}/recruitment`);
	return { success: true };
}

export async function getJobOfferAction(offerId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const offer = await RecruitmentService.getOfferById(offerId);
	if (!offer) return { success: false, error: "Offre introuvable" };
	return { success: true, data: offer as unknown as Record<string, unknown> };
}

export async function getJobOffersAction(groupId: string, page = 1, pageSize = 20): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const result = await RecruitmentService.getOffersByGroup(groupId, page, pageSize);
	return { success: true, data: result as unknown as Record<string, unknown> };
}

export async function addCandidateAction(formData: CreateCandidateFormData): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const candidate = await RecruitmentService.addCandidate(formData, currentUser.id);
	revalidatePath("/recruitment");
	return { success: true, data: { id: candidate.id } };
}

export async function updateCandidateStatusAction(candidateId: string, status: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	await RecruitmentService.updateCandidateStatus(candidateId, status, currentUser.id);
	revalidatePath("/recruitment");
	return { success: true };
}

export async function deleteCandidateAction(candidateId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	await RecruitmentService.deleteCandidate(candidateId, currentUser.id);
	revalidatePath("/recruitment");
	return { success: true };
}

export async function getCandidatesByOfferAction(offerId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const candidates = await RecruitmentService.getCandidatesByOffer(offerId);
	return { success: true, data: { candidates } as unknown as Record<string, unknown> };
}
