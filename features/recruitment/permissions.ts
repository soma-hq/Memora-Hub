import { CAPABILITIES } from "@/core/config/capabilities";
import { canDo, hasMinRole } from "@/core/permissions/guards";
import type { UserWithAccess } from "@/core/permissions/roleMap";
import { UserRoles } from "@/constants";
import type { Role } from "@/core/config/roles";

const C = CAPABILITIES;

export function canViewRecruitment(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.RECRUITMENT_VIEW);
}

export function canCreateOffer(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.RECRUITMENT_CREATE);
}

export function canEditOffer(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.RECRUITMENT_EDIT);
}

export function canManageCandidates(user: UserWithAccess, groupId: string): boolean {
	return hasMinRole(user, groupId, UserRoles.Manager as Role);
}
