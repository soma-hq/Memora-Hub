import { hasMinRole } from "@/core/permissions/guards";
import type { UserWithAccess } from "@/core/permissions/roleMap";
import { UserRoles } from "@/constants";
import type { Role } from "@/core/config/roles";

export function canViewOwnNotifications(): boolean {
	return true;
}

export function canSendNotification(user: UserWithAccess, groupId: string): boolean {
	return hasMinRole(user, groupId, UserRoles.Admin as Role);
}
