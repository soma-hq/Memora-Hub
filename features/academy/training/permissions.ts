import { CAPABILITIES } from "@/core/config/capabilities";
import { canDo, hasMinRole } from "@/core/permissions/guards";
import type { UserWithAccess } from "@/core/permissions/roleMap";
import { UserRoles } from "@/constants";
import type { Role } from "@/core/config/roles";

const C = CAPABILITIES;

export function canViewTrainings(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TRAINING_VIEW);
}

export function canCreateTraining(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TRAINING_CREATE);
}

export function canEditTraining(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.TRAINING_EDIT);
}

export function canManageTrainings(user: UserWithAccess, groupId: string): boolean {
	return hasMinRole(user, groupId, UserRoles.Manager as Role);
}
