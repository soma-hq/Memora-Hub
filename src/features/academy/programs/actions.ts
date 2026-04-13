"use server";

import { revalidatePath } from "next/cache";
import { ensureAuth, AUTH_ERROR } from "@/lib/server/ensure-auth";
import { ProgramService } from "@/services/ProgramService";
import type { ProgramPhase, ProgramStatus } from "@/features/academy/programs/types";
import type { ActionResult } from "@/lib/types/action-result";

// ---------------------------------------------------------------------------
// Program definitions
// ---------------------------------------------------------------------------

/**
 * Get all available programs
 */
export async function getProgramsAction(): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const programs = await ProgramService.getPrograms();
	return { success: true, data: { programs } as unknown as Record<string, unknown> };
}

/**
 * Get a specific program by ID
 */
export async function getProgramByIdAction(programId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const program = await ProgramService.getProgramById(programId);
	if (!program) return { success: false, error: "Programme introuvable" };
	return { success: true, data: { program } as unknown as Record<string, unknown> };
}

/**
 * Get open programs (available for enrollment)
 */
export async function getOpenProgramsAction(): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const programs = await ProgramService.getOpenPrograms();
	return { success: true, data: { programs } as unknown as Record<string, unknown> };
}

// ---------------------------------------------------------------------------
// Enrollments
// ---------------------------------------------------------------------------

/**
 * Get all enrollments
 */
export async function getEnrollmentsAction(): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const enrollments = await ProgramService.getEnrollments();
	return { success: true, data: { enrollments } as unknown as Record<string, unknown> };
}

/**
 * Get enrollment by ID
 */
export async function getEnrollmentByIdAction(enrollmentId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const enrollment = await ProgramService.getEnrollmentById(enrollmentId);
	if (!enrollment) return { success: false, error: "Inscription introuvable" };
	return { success: true, data: { enrollment } as unknown as Record<string, unknown> };
}

/**
 * Get enrollments for the current user
 */
export async function getMyEnrollmentsAction(): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const enrollments = await ProgramService.getEnrollmentsByUser(currentUser.id);
	return { success: true, data: { enrollments } as unknown as Record<string, unknown> };
}

/**
 * Get enrollments by entity
 */
export async function getEnrollmentsByEntityAction(entityId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const enrollments = await ProgramService.getEnrollmentsByEntity(entityId);
	return { success: true, data: { enrollments } as unknown as Record<string, unknown> };
}

/**
 * Get active enrollments
 */
export async function getActiveEnrollmentsAction(): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const enrollments = await ProgramService.getActiveEnrollments();
	return { success: true, data: { enrollments } as unknown as Record<string, unknown> };
}

/**
 * Get enrollments assigned to the current user as mentor
 */
export async function getMyMenteeEnrollmentsAction(): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const enrollments = await ProgramService.getEnrollmentsByMentor(currentUser.id);
	return { success: true, data: { enrollments } as unknown as Record<string, unknown> };
}

/**
 * Get enrollment statistics for the dashboard
 */
export async function getEnrollmentStatsAction(): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const stats = await ProgramService.getEnrollmentStats();
	return { success: true, data: stats };
}

/**
 * Create a new enrollment
 */
export async function createEnrollmentAction(data: {
	userId: string;
	userName: string;
	programId: string;
	trackId: string;
	entityId: string;
	mentorId: string;
	mentorName: string;
	startDate: string;
	expectedEndDate: string;
}): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

	const enrollment = await ProgramService.createEnrollment(data);
	revalidatePath("/programs");
	return { success: true, data: { enrollment } as unknown as Record<string, unknown> };
}

/**
 * Advance an enrollment to the next phase
 */
export async function advancePhaseAction(
	enrollmentId: string,
	nextPhase: ProgramPhase,
	notes: string,
): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

	const enrollment = await ProgramService.advancePhase(enrollmentId, nextPhase, currentUser.id, notes);
	if (!enrollment) return { success: false, error: "Inscription introuvable" };
	revalidatePath("/programs");
	return { success: true, data: { enrollment } as unknown as Record<string, unknown> };
}

/**
 * Update enrollment status (pause, cancel, complete)
 */
export async function updateEnrollmentStatusAction(enrollmentId: string, status: ProgramStatus): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

	const enrollment = await ProgramService.updateEnrollmentStatus(enrollmentId, status);
	if (!enrollment) return { success: false, error: "Inscription introuvable" };
	revalidatePath("/programs");
	return { success: true, data: { enrollment } as unknown as Record<string, unknown> };
}

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------

/**
 * Get all invitations
 */
export async function getInvitationsAction(): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const invitations = await ProgramService.getInvitations();
	return { success: true, data: { invitations } as unknown as Record<string, unknown> };
}

/**
 * Get pending invitations for a program
 */
export async function getPendingInvitationsAction(programId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const invitations = await ProgramService.getPendingInvitations(programId);
	return { success: true, data: { invitations } as unknown as Record<string, unknown> };
}

/**
 * Create a program invitation
 */
export async function createInvitationAction(data: {
	programId: string;
	trackId: string;
	entityId: string;
	inviteeEmail: string;
	inviteeName: string;
	assignedRoleId: string;
	mentorId?: string;
	welcomeMessage?: string;
	expiresAt: string;
}): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

	const invitation = await ProgramService.createInvitation({
		...data,
		createdBy: currentUser.id,
	});
	revalidatePath("/programs");
	return { success: true, data: { invitation } as unknown as Record<string, unknown> };
}

/**
 * Accept a program invitation
 */
export async function acceptInvitationAction(invitationId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

	const invitation = await ProgramService.acceptInvitation(invitationId, currentUser.id);
	if (!invitation) return { success: false, error: "Invitation introuvable" };
	revalidatePath("/programs");
	return { success: true, data: { invitation } as unknown as Record<string, unknown> };
}

// ---------------------------------------------------------------------------
// Training Spaces
// ---------------------------------------------------------------------------

/**
 * Get training spaces for a track
 */
export async function getTrainingSpacesByTrackAction(trackId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;
	const spaces = await ProgramService.getTrainingSpacesByTrack(trackId);
	return { success: true, data: { spaces } as unknown as Record<string, unknown> };
}

/**
 * Get a training space by ID with access check
 */
export async function getTrainingSpaceAction(spaceId: string): Promise<ActionResult> {
	const currentUser = await ensureAuth();
	if (!currentUser) return AUTH_ERROR;

	const space = await ProgramService.getTrainingSpaceById(spaceId);
	if (!space) return { success: false, error: "Espace de formation introuvable" };

	const hasAccess = await ProgramService.hasTrainingSpaceAccess(currentUser.id, spaceId);
	return {
		success: true,
		data: { space, hasAccess } as unknown as Record<string, unknown>,
	};
}
