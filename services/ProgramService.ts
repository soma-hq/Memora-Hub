import { prisma } from "@/lib/prisma";
import type {
	ProgramDefinition,
	ProgramEnrollment,
	ProgramInvitation,
	ProgramPhase,
	ProgramStatus,
	TrainingSpace,
} from "@/features/programs/types";

// Static data imports (used until DB migration for programs is in place)
import programsData from "@/core/data/programs.json";

/**
 * Service for managing training programs, enrollments, and invitations.
 * Uses static JSON data from core/data/programs.json for program definitions,
 * and Prisma for enrollment/invitation persistence when available.
 *
 * @layer Service
 */
export class ProgramService {
	// ---------------------------------------------------------------------------
	// Program Definitions (read from static data)
	// ---------------------------------------------------------------------------

	/** Get all available program definitions */
	static async getPrograms(): Promise<ProgramDefinition[]> {
		return programsData.programs as unknown as ProgramDefinition[];
	}

	/** Get a program definition by ID */
	static async getProgramById(programId: string): Promise<ProgramDefinition | null> {
		const program = programsData.programs.find((p) => p.id === programId);
		return (program as unknown as ProgramDefinition) ?? null;
	}

	/** Get open programs (available for enrollment) */
	static async getOpenPrograms(): Promise<ProgramDefinition[]> {
		return programsData.programs.filter((p) => p.isOpen) as unknown as ProgramDefinition[];
	}

	// ---------------------------------------------------------------------------
	// Enrollments
	// ---------------------------------------------------------------------------

	/** Get all enrollments from static data */
	static async getEnrollments(): Promise<ProgramEnrollment[]> {
		return programsData.enrollments as unknown as ProgramEnrollment[];
	}

	/** Get enrollment by ID */
	static async getEnrollmentById(enrollmentId: string): Promise<ProgramEnrollment | null> {
		const enrollment = programsData.enrollments.find((e) => e.id === enrollmentId);
		return (enrollment as unknown as ProgramEnrollment) ?? null;
	}

	/** Get enrollments for a specific user */
	static async getEnrollmentsByUser(userId: string): Promise<ProgramEnrollment[]> {
		return programsData.enrollments.filter((e) => e.userId === userId) as unknown as ProgramEnrollment[];
	}

	/** Get enrollments for a specific entity */
	static async getEnrollmentsByEntity(entityId: string): Promise<ProgramEnrollment[]> {
		return programsData.enrollments.filter((e) => e.entityId === entityId) as unknown as ProgramEnrollment[];
	}

	/** Get enrollments by status */
	static async getEnrollmentsByStatus(status: ProgramStatus): Promise<ProgramEnrollment[]> {
		return programsData.enrollments.filter((e) => e.status === status) as unknown as ProgramEnrollment[];
	}

	/** Get enrollments by program and track */
	static async getEnrollmentsByTrack(programId: string, trackId: string): Promise<ProgramEnrollment[]> {
		return programsData.enrollments.filter(
			(e) => e.programId === programId && e.trackId === trackId,
		) as unknown as ProgramEnrollment[];
	}

	/** Get active enrollments (status = active) */
	static async getActiveEnrollments(): Promise<ProgramEnrollment[]> {
		return programsData.enrollments.filter((e) => e.status === "active") as unknown as ProgramEnrollment[];
	}

	/** Get enrollments by mentor */
	static async getEnrollmentsByMentor(mentorId: string): Promise<ProgramEnrollment[]> {
		return programsData.enrollments.filter((e) => e.mentorId === mentorId) as unknown as ProgramEnrollment[];
	}

	/** Get enrollment statistics for dashboard */
	static async getEnrollmentStats() {
		const enrollments = programsData.enrollments;
		return {
			total: enrollments.length,
			active: enrollments.filter((e) => e.status === "active").length,
			pending: enrollments.filter((e) => e.status === "pending").length,
			completed: enrollments.filter((e) => e.status === "completed").length,
			cancelled: enrollments.filter((e) => e.status === "cancelled").length,
			averageProgress:
				enrollments.length > 0
					? Math.round(enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / enrollments.length)
					: 0,
		};
	}

	/**
	 * Advance an enrollment to the next phase.
	 * In a real implementation, this would update the DB via Prisma.
	 * @param enrollmentId Enrollment to advance
	 * @param approvedBy User ID who approved the transition
	 * @param notes Transition notes
	 */
	static async advancePhase(
		enrollmentId: string,
		_nextPhase: ProgramPhase,
		_approvedBy: string,
		_notes: string,
	): Promise<ProgramEnrollment | null> {
		// Static data — return the enrollment as-is for now.
		// When Prisma model is ready, this will do:
		// return prisma.programEnrollment.update({ where: { id: enrollmentId }, data: { currentPhase: nextPhase, ... } })
		const enrollment = programsData.enrollments.find((e) => e.id === enrollmentId);
		return (enrollment as unknown as ProgramEnrollment) ?? null;
	}

	/**
	 * Create a new enrollment.
	 * Placeholder until Prisma model exists.
	 */
	static async createEnrollment(data: {
		userId: string;
		userName: string;
		programId: string;
		trackId: string;
		entityId: string;
		mentorId: string;
		mentorName: string;
		startDate: string;
		expectedEndDate: string;
	}): Promise<ProgramEnrollment> {
		// When Prisma model is ready: prisma.programEnrollment.create({ data: { ... } })
		const newEnrollment: ProgramEnrollment = {
			id: `enroll-${Date.now()}`,
			userId: data.userId,
			userName: data.userName,
			programId: data.programId,
			trackId: data.trackId,
			entityId: data.entityId,
			status: "pending",
			currentPhase: "onboarding",
			startDate: data.startDate,
			expectedEndDate: data.expectedEndDate,
			mentorId: data.mentorId,
			mentorName: data.mentorName,
			milestoneProgress: [],
			accompanimentLog: [],
			phaseHistory: [],
			notes: [],
			progressPercent: 0,
		};
		return newEnrollment;
	}

	/**
	 * Update enrollment status (pause, cancel, complete)
	 */
	static async updateEnrollmentStatus(
		enrollmentId: string,
		_status: ProgramStatus,
	): Promise<ProgramEnrollment | null> {
		// Placeholder: prisma.programEnrollment.update(...)
		const enrollment = programsData.enrollments.find((e) => e.id === enrollmentId);
		return (enrollment as unknown as ProgramEnrollment) ?? null;
	}

	// ---------------------------------------------------------------------------
	// Invitations
	// ---------------------------------------------------------------------------

	/** Get all program invitations */
	static async getInvitations(): Promise<ProgramInvitation[]> {
		return programsData.invitations as unknown as ProgramInvitation[];
	}

	/** Get invitation by ID */
	static async getInvitationById(invitationId: string): Promise<ProgramInvitation | null> {
		const invitation = programsData.invitations.find((i) => i.id === invitationId);
		return (invitation as unknown as ProgramInvitation) ?? null;
	}

	/** Get pending invitations for a program */
	static async getPendingInvitations(programId: string): Promise<ProgramInvitation[]> {
		return programsData.invitations.filter(
			(i) => i.programId === programId && i.status === "pending",
		) as unknown as ProgramInvitation[];
	}

	/**
	 * Create a program invitation
	 */
	static async createInvitation(data: {
		programId: string;
		trackId: string;
		entityId: string;
		inviteeEmail: string;
		inviteeName: string;
		assignedRoleId: string;
		mentorId?: string;
		welcomeMessage?: string;
		expiresAt: string;
		createdBy: string;
	}): Promise<ProgramInvitation> {
		// Placeholder: prisma.programInvitation.create(...)
		const newInvitation: ProgramInvitation = {
			id: `inv-${Date.now()}`,
			programId: data.programId,
			trackId: data.trackId,
			entityId: data.entityId,
			inviteeEmail: data.inviteeEmail,
			inviteeName: data.inviteeName,
			assignedRoleId: data.assignedRoleId as ProgramInvitation["assignedRoleId"],
			mentorId: data.mentorId,
			welcomeMessage: data.welcomeMessage,
			expiresAt: data.expiresAt,
			status: "pending",
			createdAt: new Date().toISOString(),
			createdBy: data.createdBy,
		};
		return newInvitation;
	}

	/**
	 * Accept a program invitation (transitions to enrollment creation)
	 */
	static async acceptInvitation(invitationId: string): Promise<ProgramInvitation | null> {
		// Placeholder: prisma.programInvitation.update({ where: { id }, data: { status: "accepted" } })
		const invitation = programsData.invitations.find((i) => i.id === invitationId);
		return (invitation as unknown as ProgramInvitation) ?? null;
	}

	// ---------------------------------------------------------------------------
	// Training Spaces
	// ---------------------------------------------------------------------------

	/** Get all training spaces */
	static async getTrainingSpaces(): Promise<TrainingSpace[]> {
		return programsData.trainingSpaces as unknown as TrainingSpace[];
	}

	/** Get training spaces for a specific track */
	static async getTrainingSpacesByTrack(trackId: string): Promise<TrainingSpace[]> {
		return programsData.trainingSpaces.filter((s) => s.trackId === trackId) as unknown as TrainingSpace[];
	}

	/** Get a training space by ID */
	static async getTrainingSpaceById(spaceId: string): Promise<TrainingSpace | null> {
		const space = programsData.trainingSpaces.find((s) => s.id === spaceId);
		return (space as unknown as TrainingSpace) ?? null;
	}

	/** Check if a user has access to a training space based on their enrollment phase */
	static async hasTrainingSpaceAccess(userId: string, spaceId: string): Promise<boolean> {
		const space = programsData.trainingSpaces.find((s) => s.id === spaceId);
		if (!space) return false;

		const enrollment = programsData.enrollments.find(
			(e) => e.userId === userId && e.trackId === space.trackId && e.status === "active",
		);
		if (!enrollment) return false;

		const phaseOrder: ProgramPhase[] = [
			"onboarding",
			"discovery",
			"training",
			"practice",
			"evaluation",
			"graduation",
		];
		const currentIndex = phaseOrder.indexOf(enrollment.currentPhase as ProgramPhase);
		const requiredIndex = phaseOrder.indexOf(space.requiredPhase as ProgramPhase);

		return currentIndex >= requiredIndex;
	}
}
