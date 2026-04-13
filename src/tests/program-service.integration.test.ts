import assert from "node:assert/strict";
import test from "node:test";

import { prisma } from "@/lib/prisma";
import { ProgramService } from "@/services/ProgramService";

const hasDatabase = Boolean(process.env.DATABASE_URL);

test("ProgramService persists enrollment and invitation lifecycle", { skip: !hasDatabase }, async () => {
	const db = prisma as any;
	const stamp = Date.now();
	const learnerEmail = `program.learner.${stamp}@example.com`;
	const mentorEmail = `program.mentor.${stamp}@example.com`;

	const learner = await db.user.create({
		data: {
			email: learnerEmail,
			password: "test_hash_only",
			firstName: "Program",
			lastName: "Learner",
			languages: ["fr"],
			entityAccess: ["grp-test"],
		},
	});

	const mentor = await db.user.create({
		data: {
			email: mentorEmail,
			password: "test_hash_only",
			firstName: "Program",
			lastName: "Mentor",
			languages: ["fr"],
			entityAccess: ["grp-test"],
		},
	});

	const program = await db.programDefinition.create({
		data: {
			name: "Program Integration",
			description: "Service integration test",
			type: "marsha_academy",
			defaultDurationDays: 30,
			enrollmentRoles: ["standard"],
			isOpen: true,
			accentColor: "#123456",
			prerequisites: [],
		},
	});

	const track = await db.programTrack.create({
		data: {
			programId: program.id,
			name: "Main Track",
			description: "Track for testing",
			function: "moderation_discord",
			requiredCompetencies: ["communication"],
			accompanimentLevel: "standard",
			formationIds: ["f-1"],
			phases: [],
		},
	});

	const space = await db.programTrainingSpace.create({
		data: {
			programId: program.id,
			trackId: track.id,
			name: "Space 1",
			description: "Entry level space",
			modules: [],
			requiredPhase: "onboarding",
			isLocked: false,
		},
	});

	try {
		const createdEnrollment = await ProgramService.createEnrollment({
			userId: learner.id,
			userName: "Program Learner",
			programId: program.id,
			trackId: track.id,
			entityId: "grp-test",
			mentorId: mentor.id,
			mentorName: "Program Mentor",
			startDate: new Date().toISOString(),
			expectedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
		});

		assert.equal(createdEnrollment.userId, learner.id);
		assert.equal(createdEnrollment.status, "pending");

		const activated = await ProgramService.updateEnrollmentStatus(createdEnrollment.id, "active");
		assert.ok(activated);
		assert.equal(activated?.status, "active");

		const phaseAdvanced = await ProgramService.advancePhase(
			createdEnrollment.id,
			"discovery",
			mentor.id,
			"Ready for next step",
		);
		assert.ok(phaseAdvanced);
		assert.equal(phaseAdvanced?.currentPhase, "discovery");
		assert.equal(phaseAdvanced?.phaseHistory.length, 1);

		const hasAccess = await ProgramService.hasTrainingSpaceAccess(learner.id, space.id);
		assert.equal(hasAccess, true);

		const invitation = await ProgramService.createInvitation({
			programId: program.id,
			trackId: track.id,
			entityId: "grp-test",
			inviteeEmail: `invitee.${stamp}@example.com`,
			inviteeName: "Invited User",
			assignedRoleId: "standard",
			expiresAt: new Date(Date.now() + 86400000).toISOString(),
			createdBy: mentor.id,
		});
		assert.equal(invitation.status, "pending");

		const accepted = await ProgramService.acceptInvitation(invitation.id, learner.id);
		assert.ok(accepted);
		assert.equal(accepted?.status, "accepted");
	} finally {
		await db.programTrainingSpace.deleteMany({ where: { programId: program.id } });
		await db.programEnrollment.deleteMany({ where: { programId: program.id } });
		await db.programInvitation.deleteMany({ where: { programId: program.id } });
		await db.programTrack.deleteMany({ where: { programId: program.id } });
		await db.programDefinition.delete({ where: { id: program.id } });
		await db.user.deleteMany({ where: { id: { in: [learner.id, mentor.id] } } });
	}
});
