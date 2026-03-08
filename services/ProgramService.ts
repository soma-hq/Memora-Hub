import { prisma } from "@/lib/prisma";
import type {
	ProgramAccompanimentEntry,
	ProgramDefinition,
	ProgramEnrollment,
	ProgramInvitation,
	ProgramMilestoneProgress,
	ProgramNote,
	ProgramPhase,
	ProgramPhaseDefinition,
	PhaseTransition,
	ProgramStatus,
	ProgramTrack,
	TrainingModule,
	TrainingSpace,
} from "@/features/academy/programs/types";

type JsonArray<T> = T[] | null | undefined;

function asArray<T>(value: JsonArray<T>): T[] {
	return Array.isArray(value) ? value : [];
}

function toIso(value: Date | string): string {
	return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function statusToProgramStatus(status: string): ProgramStatus {
	return status as ProgramStatus;
}

function mapTrack(track: {
	id: string;
	name: string;
	description: string;
	function: string;
	requiredCompetencies: string[];
	accompanimentLevel: string;
	formationIds: string[];
	phases: unknown;
}): ProgramTrack {
	return {
		id: track.id,
		name: track.name,
		description: track.description,
		function: track.function as ProgramTrack["function"],
		requiredCompetencies: track.requiredCompetencies,
		accompanimentLevel: track.accompanimentLevel as ProgramTrack["accompanimentLevel"],
		formationIds: track.formationIds,
		phases: asArray(track.phases as ProgramPhaseDefinition[]),
	};
}

function mapProgram(program: {
	id: string;
	name: string;
	description: string;
	type: string;
	defaultDurationDays: number;
	enrollmentRoles: string[];
	isOpen: boolean;
	banner: string | null;
	accentColor: string;
	prerequisites: unknown;
	tracks: Array<{
		id: string;
		name: string;
		description: string;
		function: string;
		requiredCompetencies: string[];
		accompanimentLevel: string;
		formationIds: string[];
		phases: unknown;
	}>;
}): ProgramDefinition {
	return {
		id: program.id,
		name: program.name,
		description: program.description,
		type: program.type as ProgramDefinition["type"],
		defaultDurationDays: program.defaultDurationDays,
		availableTracks: program.tracks.map(mapTrack),
		prerequisites: asArray(program.prerequisites as ProgramDefinition["prerequisites"]),
		enrollmentRoles: program.enrollmentRoles as ProgramDefinition["enrollmentRoles"],
		isOpen: program.isOpen,
		banner: program.banner ?? undefined,
		accentColor: program.accentColor,
	};
}

function mapEnrollment(enrollment: {
	id: string;
	userId: string;
	programId: string;
	trackId: string;
	entityId: string;
	status: string;
	currentPhase: string;
	startDate: Date;
	expectedEndDate: Date;
	actualEndDate: Date | null;
	mentorId: string;
	milestoneProgress: unknown;
	accompanimentLog: unknown;
	phaseHistory: unknown;
	notes: unknown;
	progressPercent: number;
	user: { firstName: string; lastName: string; avatar: string | null };
	mentor: { firstName: string; lastName: string };
}): ProgramEnrollment {
	return {
		id: enrollment.id,
		userId: enrollment.userId,
		userName: `${enrollment.user.firstName} ${enrollment.user.lastName}`.trim(),
		userAvatar: enrollment.user.avatar ?? undefined,
		programId: enrollment.programId,
		trackId: enrollment.trackId,
		entityId: enrollment.entityId,
		status: statusToProgramStatus(enrollment.status),
		currentPhase: enrollment.currentPhase as ProgramPhase,
		startDate: toIso(enrollment.startDate),
		expectedEndDate: toIso(enrollment.expectedEndDate),
		actualEndDate: enrollment.actualEndDate ? toIso(enrollment.actualEndDate) : undefined,
		mentorId: enrollment.mentorId,
		mentorName: `${enrollment.mentor.firstName} ${enrollment.mentor.lastName}`.trim(),
		milestoneProgress: asArray(enrollment.milestoneProgress as ProgramMilestoneProgress[]),
		accompanimentLog: asArray(enrollment.accompanimentLog as ProgramAccompanimentEntry[]),
		phaseHistory: asArray(enrollment.phaseHistory as PhaseTransition[]),
		notes: asArray(enrollment.notes as ProgramNote[]),
		progressPercent: enrollment.progressPercent,
	};
}

function mapInvitation(invitation: {
	id: string;
	programId: string;
	trackId: string;
	entityId: string;
	inviteeEmail: string;
	inviteeName: string;
	assignedRoleId: string;
	mentorId: string | null;
	welcomeMessage: string | null;
	expiresAt: Date;
	status: string;
	createdAt: Date;
	creator: { firstName: string; lastName: string };
}): ProgramInvitation {
	return {
		id: invitation.id,
		programId: invitation.programId,
		trackId: invitation.trackId,
		entityId: invitation.entityId,
		inviteeEmail: invitation.inviteeEmail,
		inviteeName: invitation.inviteeName,
		assignedRoleId: invitation.assignedRoleId as ProgramInvitation["assignedRoleId"],
		mentorId: invitation.mentorId ?? undefined,
		welcomeMessage: invitation.welcomeMessage ?? undefined,
		expiresAt: toIso(invitation.expiresAt),
		status: invitation.status as ProgramInvitation["status"],
		createdAt: toIso(invitation.createdAt),
		createdBy: `${invitation.creator.firstName} ${invitation.creator.lastName}`.trim(),
	};
}

function mapTrainingSpace(space: {
	id: string;
	programId: string;
	trackId: string;
	name: string;
	description: string;
	modules: unknown;
	requiredPhase: string;
	isLocked: boolean;
}): TrainingSpace {
	return {
		id: space.id,
		programId: space.programId,
		trackId: space.trackId,
		name: space.name,
		description: space.description,
		modules: asArray(space.modules as TrainingModule[]),
		requiredPhase: space.requiredPhase as ProgramPhase,
		isLocked: space.isLocked,
	};
}

/**
 * Service for managing training programs, enrollments, and invitations.
 * Uses Prisma persistence for program definitions, enrollments, invitations, and spaces.
 *
 * @layer Service
 */
export class ProgramService {
	// ---------------------------------------------------------------------------
	// Program Definitions
	// ---------------------------------------------------------------------------

	/** Get all available program definitions */
	static async getPrograms(): Promise<ProgramDefinition[]> {
		const programs = await prisma.programDefinition.findMany({
			include: { tracks: true },
			orderBy: { createdAt: "desc" },
		});
		return programs.map(mapProgram);
	}

	/** Get a program definition by ID */
	static async getProgramById(programId: string): Promise<ProgramDefinition | null> {
		const program = await prisma.programDefinition.findUnique({
			where: { id: programId },
			include: { tracks: true },
		});
		return program ? mapProgram(program) : null;
	}

	/** Get open programs (available for enrollment) */
	static async getOpenPrograms(): Promise<ProgramDefinition[]> {
		const programs = await prisma.programDefinition.findMany({
			where: { isOpen: true },
			include: { tracks: true },
			orderBy: { createdAt: "desc" },
		});
		return programs.map(mapProgram);
	}

	// ---------------------------------------------------------------------------
	// Enrollments
	// ---------------------------------------------------------------------------

	/** Get all enrollments */
	static async getEnrollments(): Promise<ProgramEnrollment[]> {
		const enrollments = await prisma.programEnrollment.findMany({
			include: {
				user: { select: { firstName: true, lastName: true, avatar: true } },
				mentor: { select: { firstName: true, lastName: true } },
			},
			orderBy: { createdAt: "desc" },
		});
		return enrollments.map(mapEnrollment);
	}

	/** Get enrollment by ID */
	static async getEnrollmentById(enrollmentId: string): Promise<ProgramEnrollment | null> {
		const enrollment = await prisma.programEnrollment.findUnique({
			where: { id: enrollmentId },
			include: {
				user: { select: { firstName: true, lastName: true, avatar: true } },
				mentor: { select: { firstName: true, lastName: true } },
			},
		});
		return enrollment ? mapEnrollment(enrollment) : null;
	}

	/** Get enrollments for a specific user */
	static async getEnrollmentsByUser(userId: string): Promise<ProgramEnrollment[]> {
		const enrollments = await prisma.programEnrollment.findMany({
			where: { userId },
			include: {
				user: { select: { firstName: true, lastName: true, avatar: true } },
				mentor: { select: { firstName: true, lastName: true } },
			},
			orderBy: { createdAt: "desc" },
		});
		return enrollments.map(mapEnrollment);
	}

	/** Get enrollments for a specific entity */
	static async getEnrollmentsByEntity(entityId: string): Promise<ProgramEnrollment[]> {
		const enrollments = await prisma.programEnrollment.findMany({
			where: { entityId },
			include: {
				user: { select: { firstName: true, lastName: true, avatar: true } },
				mentor: { select: { firstName: true, lastName: true } },
			},
			orderBy: { createdAt: "desc" },
		});
		return enrollments.map(mapEnrollment);
	}

	/** Get enrollments by status */
	static async getEnrollmentsByStatus(status: ProgramStatus): Promise<ProgramEnrollment[]> {
		const enrollments = await prisma.programEnrollment.findMany({
			where: { status: status as any },
			include: {
				user: { select: { firstName: true, lastName: true, avatar: true } },
				mentor: { select: { firstName: true, lastName: true } },
			},
			orderBy: { createdAt: "desc" },
		});
		return enrollments.map(mapEnrollment);
	}

	/** Get enrollments by program and track */
	static async getEnrollmentsByTrack(programId: string, trackId: string): Promise<ProgramEnrollment[]> {
		const enrollments = await prisma.programEnrollment.findMany({
			where: { programId, trackId },
			include: {
				user: { select: { firstName: true, lastName: true, avatar: true } },
				mentor: { select: { firstName: true, lastName: true } },
			},
			orderBy: { createdAt: "desc" },
		});
		return enrollments.map(mapEnrollment);
	}

	/** Get active enrollments (status = active) */
	static async getActiveEnrollments(): Promise<ProgramEnrollment[]> {
		return this.getEnrollmentsByStatus("active");
	}

	/** Get enrollments by mentor */
	static async getEnrollmentsByMentor(mentorId: string): Promise<ProgramEnrollment[]> {
		const enrollments = await prisma.programEnrollment.findMany({
			where: { mentorId },
			include: {
				user: { select: { firstName: true, lastName: true, avatar: true } },
				mentor: { select: { firstName: true, lastName: true } },
			},
			orderBy: { createdAt: "desc" },
		});
		return enrollments.map(mapEnrollment);
	}

	/** Get enrollment statistics for dashboard */
	static async getEnrollmentStats() {
		const enrollments = await prisma.programEnrollment.findMany({
			select: { status: true, progressPercent: true },
		});

		const active = enrollments.filter((e) => e.status === "active").length;
		const pending = enrollments.filter((e) => e.status === "pending").length;
		const completed = enrollments.filter((e) => e.status === "completed").length;
		const cancelled = enrollments.filter((e) => e.status === "cancelled").length;
		const averageProgress =
			enrollments.length > 0
				? Math.round(enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / enrollments.length)
				: 0;

		return {
			total: enrollments.length,
			active,
			pending,
			completed,
			cancelled,
			averageProgress,
		};
	}

	/**
	 * Advance an enrollment to the next phase.
	 * @param enrollmentId Enrollment to advance
	 * @param approvedBy User ID who approved the transition
	 * @param notes Transition notes
	 */
	static async advancePhase(
		enrollmentId: string,
		nextPhase: ProgramPhase,
		approvedBy: string,
		notes: string,
	): Promise<ProgramEnrollment | null> {
		const existing = await prisma.programEnrollment.findUnique({ where: { id: enrollmentId } });
		if (!existing) return null;

		const history = asArray(existing.phaseHistory as PhaseTransition[]);
		history.push({
			fromPhase: existing.currentPhase as ProgramPhase,
			toPhase: nextPhase,
			date: new Date().toISOString(),
			approvedBy,
			notes,
		});

		const updated = await prisma.programEnrollment.update({
			where: { id: enrollmentId },
			data: {
				currentPhase: nextPhase as any,
				phaseHistory: history,
			},
			include: {
				user: { select: { firstName: true, lastName: true, avatar: true } },
				mentor: { select: { firstName: true, lastName: true } },
			},
		});
		return mapEnrollment(updated);
	}

	/**
	 * Create a new enrollment.
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
		const created = await prisma.programEnrollment.create({
			data: {
				userId: data.userId,
				programId: data.programId,
				trackId: data.trackId,
				entityId: data.entityId,
				status: "pending",
				currentPhase: "onboarding",
				startDate: new Date(data.startDate),
				expectedEndDate: new Date(data.expectedEndDate),
				mentorId: data.mentorId,
				milestoneProgress: [],
				accompanimentLog: [],
				phaseHistory: [],
				notes: [],
				progressPercent: 0,
			},
			include: {
				user: { select: { firstName: true, lastName: true, avatar: true } },
				mentor: { select: { firstName: true, lastName: true } },
			},
		});
		return mapEnrollment(created);
	}

	/**
	 * Update enrollment status (pause, cancel, complete)
	 */
	static async updateEnrollmentStatus(
		enrollmentId: string,
		status: ProgramStatus,
	): Promise<ProgramEnrollment | null> {
		const exists = await prisma.programEnrollment.findUnique({ where: { id: enrollmentId } });
		if (!exists) return null;

		const updated = await prisma.programEnrollment.update({
			where: { id: enrollmentId },
			data: {
				status: status as any,
				actualEndDate: status === "completed" || status === "cancelled" ? new Date() : null,
			},
			include: {
				user: { select: { firstName: true, lastName: true, avatar: true } },
				mentor: { select: { firstName: true, lastName: true } },
			},
		});
		return mapEnrollment(updated);
	}

	// ---------------------------------------------------------------------------
	// Invitations
	// ---------------------------------------------------------------------------

	/** Get all program invitations */
	static async getInvitations(): Promise<ProgramInvitation[]> {
		const invitations = await prisma.programInvitation.findMany({
			include: { creator: { select: { firstName: true, lastName: true } } },
			orderBy: { createdAt: "desc" },
		});
		return invitations.map(mapInvitation);
	}

	/** Get invitation by ID */
	static async getInvitationById(invitationId: string): Promise<ProgramInvitation | null> {
		const invitation = await prisma.programInvitation.findUnique({
			where: { id: invitationId },
			include: { creator: { select: { firstName: true, lastName: true } } },
		});
		return invitation ? mapInvitation(invitation) : null;
	}

	/** Get pending invitations for a program */
	static async getPendingInvitations(programId: string): Promise<ProgramInvitation[]> {
		const invitations = await prisma.programInvitation.findMany({
			where: { programId, status: "pending" },
			include: { creator: { select: { firstName: true, lastName: true } } },
			orderBy: { createdAt: "desc" },
		});
		return invitations.map(mapInvitation);
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
		const invitation = await prisma.programInvitation.create({
			data: {
				programId: data.programId,
				trackId: data.trackId,
				entityId: data.entityId,
				inviteeEmail: data.inviteeEmail,
				inviteeName: data.inviteeName,
				assignedRoleId: data.assignedRoleId,
				mentorId: data.mentorId,
				welcomeMessage: data.welcomeMessage,
				expiresAt: new Date(data.expiresAt),
				status: "pending",
				createdBy: data.createdBy,
			},
			include: { creator: { select: { firstName: true, lastName: true } } },
		});
		return mapInvitation(invitation);
	}

	/**
	 * Accept a program invitation (transitions to enrollment creation)
	 */
	static async acceptInvitation(invitationId: string, acceptedBy?: string): Promise<ProgramInvitation | null> {
		const existing = await prisma.programInvitation.findUnique({ where: { id: invitationId } });
		if (!existing) return null;

		const invitation = await prisma.programInvitation.update({
			where: { id: invitationId },
			data: {
				status: "accepted",
				acceptedBy,
			},
			include: { creator: { select: { firstName: true, lastName: true } } },
		});
		return mapInvitation(invitation);
	}

	// ---------------------------------------------------------------------------
	// Training Spaces
	// ---------------------------------------------------------------------------

	/** Get all training spaces */
	static async getTrainingSpaces(): Promise<TrainingSpace[]> {
		const spaces = await prisma.programTrainingSpace.findMany({ orderBy: { createdAt: "desc" } });
		return spaces.map(mapTrainingSpace);
	}

	/** Get training spaces for a specific track */
	static async getTrainingSpacesByTrack(trackId: string): Promise<TrainingSpace[]> {
		const spaces = await prisma.programTrainingSpace.findMany({
			where: { trackId },
			orderBy: { createdAt: "desc" },
		});
		return spaces.map(mapTrainingSpace);
	}

	/** Get a training space by ID */
	static async getTrainingSpaceById(spaceId: string): Promise<TrainingSpace | null> {
		const space = await prisma.programTrainingSpace.findUnique({ where: { id: spaceId } });
		return space ? mapTrainingSpace(space) : null;
	}

	/** Check if a user has access to a training space based on their enrollment phase */
	static async hasTrainingSpaceAccess(userId: string, spaceId: string): Promise<boolean> {
		const space = await prisma.programTrainingSpace.findUnique({ where: { id: spaceId } });
		if (!space) return false;
		if (space.isLocked) return false;

		const enrollment = await prisma.programEnrollment.findFirst({
			where: {
				userId,
				trackId: space.trackId,
				status: "active",
			},
			select: { currentPhase: true },
		});
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
