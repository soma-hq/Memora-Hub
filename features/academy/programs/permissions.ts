import { CAPABILITIES } from "@/core/config/capabilities";
import { canDo, hasMinRole, isOwnerOfAny } from "@/core/permissions/guards";
import type { GuardUser } from "@/core/permissions/guards";

const C = CAPABILITIES;

// Can the user view the list of programs and enrollments
export function canViewPrograms(user: GuardUser, groupId: string): boolean {
	return canDo(user, groupId, C.TRAINING_VIEW);
}

// Can the user manage programs
export function canManagePrograms(user: GuardUser, groupId: string): boolean {
	return hasMinRole(user, groupId, "Admin");
}

// Can the user enroll someone in a program
export function canEnrollInProgram(user: GuardUser, groupId: string): boolean {
	return hasMinRole(user, groupId, "Manager") || isOwnerOfAny(user);
}

// Can the user invite someone to a program
export function canInviteToProgram(user: GuardUser, groupId: string): boolean {
	return hasMinRole(user, groupId, "Manager");
}

// Can the user advance an enrollment to the next phase
export function canAdvancePhase(user: GuardUser, groupId: string): boolean {
	return hasMinRole(user, groupId, "Manager");
}

// Can the user update enrollment status
export function canUpdateEnrollmentStatus(user: GuardUser, groupId: string): boolean {
	return hasMinRole(user, groupId, "Manager");
}

// Can the user add notes to an enrollment
export function canAddEnrollmentNote(user: GuardUser, groupId: string): boolean {
	return canDo(user, groupId, C.TRAINING_VIEW);
}

// Can the user validate milestones
export function canValidateMilestone(user: GuardUser, groupId: string): boolean {
	return hasMinRole(user, groupId, "Collaborator");
}

// Can the user access training spaces
export function canAccessTrainingSpaces(user: GuardUser, groupId: string): boolean {
	return canDo(user, groupId, C.TRAINING_VIEW);
}

// Can the user manage training space content
export function canManageTrainingSpaces(user: GuardUser, groupId: string): boolean {
	return hasMinRole(user, groupId, "Admin");
}
