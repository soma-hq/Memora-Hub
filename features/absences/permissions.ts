import { CAPABILITIES } from "@/core/config/capabilities";
import { canDo, hasMinRole } from "@/core/permissions/guards";
import type { UserWithAccess } from "@/core/permissions/roleMap";
import { UserRoles } from "@/constants";
import type { Role } from "@/core/config/roles";

const C = CAPABILITIES;

export function canViewAbsences(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.ABSENCES_VIEW);
}

export function canCreateAbsence(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.ABSENCES_CREATE);
}

export function canApproveAbsence(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.ABSENCES_APPROVE);
}

export function canDeleteOwnAbsence(user: UserWithAccess, groupId: string, absenceUserId: string): boolean {
	if (user.id === absenceUserId) return canDo(user, groupId, C.ABSENCES_CREATE);
	return canDo(user, groupId, C.ABSENCES_APPROVE);
}

export function canManageAbsences(user: UserWithAccess, groupId: string): boolean {
	return hasMinRole(user, groupId, UserRoles.Manager as Role);
}
