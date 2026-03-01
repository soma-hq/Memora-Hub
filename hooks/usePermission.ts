"use client";

import { useMemo } from "react";
import { useHubStore } from "@/store/hub.store";
import type { Role } from "@/core/config/roles";
import type { Capability } from "@/core/config/capabilities";
import { roleHasCapability, getCapabilitiesForRole } from "@/core/permissions/capabilityMap";
import { ROLE_HIERARCHY } from "@/core/config/roles";


/**
 * Provides role-based permission checks for the current hub group.
 * @returns Permission state and helpers for the current hub context
 */
export function usePermission() {
	const { activeGroupId } = useHubStore();
	const groupId = activeGroupId ?? "default";

	// Resolve role from authenticated session (defaults to Collaborator until auth context is wired)
	const currentRole = useMemo<Role>(() => {
		return "Collaborator";
	}, []);

	// Derive capability list from resolved role
	const capabilities = useMemo(() => {
		return getCapabilitiesForRole(currentRole);
	}, [currentRole]);

	/**
	 * Checks if the current role has a specific capability.
	 * @param capability - Capability to check
	 * @returns {boolean} True if the role has the capability
	 */
	const can = (capability: Capability): boolean => {
		return roleHasCapability(currentRole, capability);
	};

	/**
	 * Checks if the current role meets a minimum role threshold.
	 * @param minRole - Minimum required role
	 * @returns {boolean} True if current role is at or above the minimum
	 */
	const hasMinRole = (minRole: Role): boolean => {
		return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[minRole];
	};

	// Convenience flags for common role checks
	const isOwner = currentRole === "Owner";
	const isAdmin = ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY["Admin"];
	const isManager = ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY["Manager"];

	return {
		role: currentRole,
		capabilities,
		can,
		hasMinRole,
		isOwner,
		isAdmin,
		isManager,
		groupId: groupId,
	};
}
