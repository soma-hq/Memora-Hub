"use client";

import { useMemo } from "react";
import { useDataStore } from "@/store/data.store";
import type { RoleId } from "@/core/config/roles";
import { ROLE_HIERARCHY } from "@/core/config/roles";
import type { Permission, Module } from "@/core/config/capabilities";
import { hasPermission, hasModuleAccess, getAccessibleModules } from "@/core/permissions/capabilityMap";

/**
 * React hook providing Discord-style permission checks for the current user.
 * Reads the current user from the data store and exposes permission helpers.
 * @returns Permission state and helper functions for the current user context
 */
export function usePermission() {
	const currentUser = useDataStore((s) => s.currentUser);

	const roleId = useMemo<RoleId>(() => {
		return currentUser?.roleId ?? "momentum_talent";
	}, [currentUser]);

	const entityAccess = useMemo<string[]>(() => {
		return currentUser?.entityAccess ?? [];
	}, [currentUser]);

	const accessibleModules = useMemo(() => {
		return getAccessibleModules(roleId);
	}, [roleId]);

	/**
	 * Check if current user can perform an action on a module.
	 * @param module - Target module
	 * @param action - Permission action (defaults to "view")
	 * @returns True if the user has the permission
	 */
	const can = (module: Module, action: Permission = "view"): boolean => {
		return hasPermission(roleId, module, action);
	};

	/**
	 * Check if current user can access a module at all.
	 * @param module - Target module
	 * @returns True if user has any access to the module
	 */
	const canAccess = (module: Module): boolean => {
		return hasModuleAccess(roleId, module);
	};

	/**
	 * Check if current user can access a specific entity.
	 * @param entityId - Target entity ID
	 * @returns True if entity is in user's access list or user has wildcard
	 */
	const canAccessEntity = (entityId: string): boolean => {
		if (entityAccess.includes("*")) return true;
		return entityAccess.includes(entityId);
	};

	/**
	 * Check if current role meets a minimum role threshold.
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
