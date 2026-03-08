"use server";

import { revalidatePath } from "next/cache";
import { MeetingService } from "@/services/MeetingService";
import { ensureAuth, AUTH_ERROR } from "@/lib/server/ensure-auth";
import { createMeetingSchema } from "@/lib/validators/schemas";
import type { CreateMeetingFormData } from "@/lib/validators/schemas";
import type { ActionResult } from "@/lib/types/action-result";

/**
 * Creates a new meeting in a group
 * @param groupId - Parent group ID
 * @param formData - Meeting creation fields
 * @returns Action result with created meeting data
 */
export async function createMeetingAction(groupId: string, formData: CreateMeetingFormData): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

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
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

	const targetMeeting = await MeetingService.getById(meetingId);
	if (!targetMeeting) {
		return { success: false, error: "Réunion introuvable" };
	}

	await MeetingService.update(meetingId, formData, currentUser.id);

	revalidatePath(`/hub/${targetMeeting.groupId}/meetings`);

	return { success: true };
}

/**
 * Deletes à meeting
 * @param meetingId - Target meeting ID
 * @returns Action result
 */
export async function deleteMeetingAction(meetingId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

	const targetMeeting = await MeetingService.getById(meetingId);
	if (!targetMeeting) {
		return { success: false, error: "Réunion introuvable" };
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
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

	await MeetingService.addAttendee(meetingId, userId);

	return { success: true };
}

/**
 * Removes an attendee from à meeting
 * @param meetingId - Target meeting ID
 * @param userId - User to remove
 * @returns Action result
 */
export async function removeMeetingAttendeeAction(meetingId: string, userId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

	await MeetingService.removeAttendee(meetingId, userId);

	return { success: true };
}

/**
 * Get a single meeting by ID
 */
export async function getMeetingAction(meetingId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

	const meeting = await MeetingService.getById(meetingId);
	if (!meeting) {
		return { success: false, error: "Réunion introuvable" };
	}

	return { success: true, data: meeting as unknown as Record<string, unknown> };
}

/**
 * Get meetings by group paginated
 */
export async function getMeetingsAction(groupId: string, page = 1, pageSize = 20): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

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
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const meetings = await MeetingService.getUpcoming(groupId, limit);
	return { success: true, data: { meetings } as unknown as Record<string, unknown> };
}

/**
 * Get meetings for the current user
 * @returns Action result with user meetings
 */
export async function getMeetingsByUserAction(): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
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
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const meeting = await MeetingService.getById(meetingId);
	if (!meeting) return { success: false, error: "Réunion introuvable" };
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
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const meeting = await MeetingService.getById(meetingId);
	if (!meeting) return { success: false, error: "Réunion introuvable" };
	return { success: true, data: { attendees: meeting.attendees } as unknown as Record<string, unknown> };
}

/**
 * Search meetings by title or notes within a group
 * @param groupId - Group ID
 * @param query - Search query
 * @returns Action result with matching meetings
 */
export async function searchMeetingsAction(groupId: string, query: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const meetings = await MeetingService.search(groupId, query);
	return { success: true, data: { meetings } as unknown as Record<string, unknown> };
}

/**
 * Get meetings within a date range for a group
 * @param groupId - Group ID
 * @param startDate - Range start (ISO string)
 * @param endDate - Range end (ISO string)
 * @returns Action result with meetings in the date range
 */
export async function getMeetingsByDateRangeAction(
	groupId: string,
	startDate: string,
	endDate: string,
): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const meetings = await MeetingService.getByDateRange(groupId, new Date(startDate), new Date(endDate));
	return { success: true, data: { meetings } as unknown as Record<string, unknown> };
}
