export {
	canAccessEntity,
	canAccessModule,
	canPerformAction,
	isHigherRole,
	isOwner,
	isAdmin,
	canManageUser,
	canAccessAdmin,
	isAuthorized,
	canDo,
	hasMinRole,
	isOwnerOfAny,
} from "./guards";
export type { GuardUser } from "./guards";

export {
	CAPABILITY_MAP,
	hasPermission,
	hasModuleAccess,
	getPermissionsForModule,
	getAccessibleModules,
} from "./capabilityMap";

export {
	getUserRole,
	getAccessibleEntities,
	hasWildcardAccess,
	hasMinimumRole,
	compareRoles,
	isMemberOfGroup,
} from "./roleMap";
export type { UserWithAccess } from "./roleMap";
