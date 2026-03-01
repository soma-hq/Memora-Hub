import { CAPABILITIES } from "@/core/config/capabilities";
import { canDo, hasMinRole } from "@/core/permissions/guards";
import type { UserWithAccess } from "@/core/permissions/roleMap";
import { UserRoles } from "@/constants";
import type { Role } from "@/core/config/roles";

const C = CAPABILITIES;

/**
 * Check if user can view meetings
 */
export function canViewMeetings(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.MEETINGS_VIEW);
}

/**
 * Check if user can create meetings
 */
export function canCreateMeeting(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.MEETINGS_CREATE);
}

/**
 * Check if user can edit a meeting
 */
export function canEditMeeting(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.MEETINGS_EDIT);
}

/**
 * Check if user can delete a meeting
 */
export function canDeleteMeeting(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.MEETINGS_DELETE);
}

/**
 * Check if user can manage meeting attendees
 */
export function canManageMeetingAttendees(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.MEETINGS_MANAGE_ATTENDEES);
}

/**
 * Check if user can view meeting notes
 */
export function canViewMeetingNotes(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.MEETINGS_VIEW_NOTES);
}

/**
 * Check if user can edit meeting notes
 */
export function canEditMeetingNotes(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.MEETINGS_EDIT_NOTES);
}

/**
 * Check if user can export meetings
 */
export function canExportMeetings(user: UserWithAccess, groupId: string): boolean {
	return canDo(user, groupId, C.MEETINGS_EXPORT);
}
