"use server";

import { revalidatePath } from "next/cache";
import { MeetingService } from "@/services/MeetingService";
import { AuthService } from "@/services/AuthService";
import { createMeetingSchema } from "@/lib/validators/schemas";
import type { CreateMeetingFormData } from "@/lib/validators/schemas";

/** Standard action result */
export interface ActionResult {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
}

/**
 * Creates a new meeting in a group
 * @param groupId - Parent group ID
 * @param formData - Meeting creation fields
 * @returns Action result with created meeting data
 */
export async function createMeetingAction(groupId: string, formData: CreateMeetingFormData): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const parsed = createMeetingSchema.safeParse(formData);
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0]?.message ?? "Donnees invalides" };
	}

	const meeting = await MeetingService.create(groupId, parsed.data, currentUser.id);

	revalidatePath(`/hub/${groupId}/meetings`);

	return { success: true, data: { id: meeting.id } };
}

/**
 * Updates an existing meeting
 * @param meetingId - Target meeting ID
 * @param formData - Partial meeting update fields
 * @returns Action result
 */
export async function updateMeetingAction(
	meetingId: string,
	formData: Partial<CreateMeetingFormData>,
): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const targetMeeting = await MeetingService.getById(meetingId);
	if (!targetMeeting) {
		return { success: false, error: "Reunion introuvable" };
	}

	await MeetingService.update(meetingId, formData, currentUser.id);

	revalidatePath(`/hub/${targetMeeting.groupId}/meetings`);

	return { success: true };
}

/**
 * Deletes a meeting
 * @param meetingId - Target meeting ID
 * @returns Action result
 */
export async function deleteMeetingAction(meetingId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const targetMeeting = await MeetingService.getById(meetingId);
	if (!targetMeeting) {
		return { success: false, error: "Reunion introuvable" };
	}

	await MeetingService.delete(meetingId, currentUser.id);

	revalidatePath(`/hub/${targetMeeting.groupId}/meetings`);

	return { success: true };
}

/**
 * Adds an attendee to a meeting
 * @param meetingId - Target meeting ID
 * @param userId - User to add
 * @returns Action result
 */
export async function addMeetingAttendeeAction(meetingId: string, userId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	await MeetingService.addAttendee(meetingId, userId);

	return { success: true };
}

/**
 * Removes an attendee from a meeting
 * @param meetingId - Target meeting ID
 * @param userId - User to remove
 * @returns Action result
 */
export async function removeMeetingAttendeeAction(meetingId: string, userId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	await MeetingService.removeAttendee(meetingId, userId);

	return { success: true };
}

/**
 * Get a single meeting by ID
 */
export async function getMeetingAction(meetingId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const meeting = await MeetingService.getById(meetingId);
	if (!meeting) {
		return { success: false, error: "Reunion introuvable" };
	}

	return { success: true, data: meeting as unknown as Record<string, unknown> };
}

/**
 * Get meetings by group paginated
 */
export async function getMeetingsAction(groupId: string, page = 1, pageSize = 20): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return { success: false, error: "Non authentifie" };
	}

	const result = await MeetingService.getByGroup(groupId, page, pageSize);

	return { success: true, data: result as unknown as Record<string, unknown> };
}

/**
 * Get upcoming meetings for a group
 * @param groupId - Target group ID
 * @param limit - Max number of meetings to return
 * @returns Action result with upcoming meetings
 */
export async function getUpcomingMeetingsAction(groupId: string, limit = 5): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const meetings = await MeetingService.getUpcoming(groupId, limit);
	return { success: true, data: { meetings } as unknown as Record<string, unknown> };
}

/**
 * Get meetings for the current user
 * @returns Action result with user meetings
 */
export async function getMeetingsByUserAction(): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const meetings = await MeetingService.getByUser(currentUser.id);
	return { success: true, data: { meetings } as unknown as Record<string, unknown> };
}

/**
 * Updates meeting notes/description
 * @param meetingId - Target meeting ID
 * @param notes - New notes content
 * @returns Action result
 */
export async function updateMeetingNotesAction(meetingId: string, notes: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const meeting = await MeetingService.getById(meetingId);
	if (!meeting) return { success: false, error: "Reunion introuvable" };
	await MeetingService.update(meetingId, { description: notes }, currentUser.id);
	revalidatePath(`/hub/${meeting.groupId}/meetings`);
	return { success: true };
}

/**
 * Get attendees for a meeting
 * @param meetingId - Target meeting ID
 * @returns Action result with attendees
 */
export async function getMeetingAttendeesAction(meetingId: string): Promise<ActionResult> {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) return { success: false, error: "Non authentifie" };
	const meeting = await MeetingService.getById(meetingId);
	if (!meeting) return { success: false, error: "Reunion introuvable" };
	return { success: true, data: { attendees: meeting.attendees } as unknown as Record<string, unknown> };
}
