"use client";

import { useMemo } from "react";
import { useDataStore } from "@/store/data.store";
import { useHubStore } from "@/store/hub.store";
import type { RoleId } from "@/core/config/roles";
import { ROLE_HIERARCHY } from "@/core/config/roles";
import type { Permission, Module } from "@/core/config/capabilities";
import { hasPermission, hasModuleAccess, getAccessibleModules } from "@/core/permissions/capabilityMap";

/**
 * React hook providing Discord-style permission checks for the current user
 * @returns Permission state and helper functions for the current user context
 */
export function usePermission() {
	const currentUser = useDataStore((s) => s.currentUser);
	const activeEntityId = useHubStore((s) => s.activeGroupId);

	/**
	 * Check role ID validity
	 * @param value - Role candidate from user data
	 * @returns True if role exists in hierarchy
	 */
	const isKnownRole = (value: string): value is RoleId => value in ROLE_HIERARCHY;

	const roleId = useMemo<RoleId>(() => {
		if (!currentUser?.roleId) return "momentum_talent";
		return isKnownRole(currentUser.roleId) ? currentUser.roleId : "momentum_talent";
	}, [currentUser]);

	const entityAccess = useMemo<string[]>(() => {
		return currentUser?.entityAccess ?? [];
	}, [currentUser]);

	const canAccessEntityInternal = (entityId: string): boolean => {
		if (entityAccess.includes("*")) return true;
		return entityAccess.includes(entityId);
	};

	const hasEntityScope = (entityId?: string): boolean => {
		if (roleId === "owner") return true;
		const targetEntityId = entityId ?? activeEntityId;
		if (!targetEntityId) return true;
		return canAccessEntityInternal(targetEntityId);
	};

	const accessibleModules = useMemo(() => {
		if (!hasEntityScope()) return [];
		return getAccessibleModules(roleId);
	}, [roleId, activeEntityId, entityAccess]);

	/**
	 * Check if current user can perform an action on a module
	 * @param module - Target module
	 * @param action - Permission action
	 * @returns True if the user has the permission
	 */
	const can = (module: Module, action: Permission = "view", entityId?: string): boolean => {
		if (!hasEntityScope(entityId)) return false;
		return hasPermission(roleId, module, action);
	};

	/**
	 * Check if current user can access a module at all
	 * @param module - Target module
	 * @returns True if user has any access to the module
	 */
	const canAccess = (module: Module, entityId?: string): boolean => {
		if (!hasEntityScope(entityId)) return false;
		return hasModuleAccess(roleId, module);
	};

	/**
	 * Check if current user can access a specific entity
	 * @param entityId - Target entity ID
	 * @returns True if entity is in user's access list or user has wildcard
	 */
	const canAccessEntity = (entityId: string): boolean => {
		return canAccessEntityInternal(entityId);
	};

	/**
	 * Check if current role meets a minimum role threshold
	 * @param minRole - Minimum required role ID
	 * @returns True if current role level >= min role level
	 */
	const hasMinRole = (minRole: RoleId): boolean => {
		return ROLE_HIERARCHY[roleId] >= ROLE_HIERARCHY[minRole];
	};

	// Convenience flags
	const isOwner = roleId === "owner";
	const isAdmin = ROLE_HIERARCHY[roleId] >= ROLE_HIERARCHY["marsha_teams"];
	const isLegacy = roleId.startsWith("legacy_");
	const isMomentum = roleId === "momentum_talent";

	return {
		role: roleId,
		activeEntityId,
		entityAccess,
		accessibleModules,
		can,
		canAccess,
		canAccessEntity,
		hasMinRole,
		isOwner,
		isAdmin,
		isLegacy,
		isMomentum,
		currentUser,
	};
}
