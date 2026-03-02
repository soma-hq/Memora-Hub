"use client";

import { usePermission } from "@/hooks/usePermission";
import type { ReactNode } from "react";
import type { RoleId } from "@/core/config/roles";
import type { Permission, Module } from "@/core/config/capabilities";

interface RoleGuardProps {
	children: ReactNode;
	/** Required module access (checks if user has any permission on the module) */
	requiredModule?: Module;
	/** Required permission on the module (defaults to "view") */
	requiredPermission?: Permission;
	/** Minimum role level required */
	requiredRole?: RoleId;
	/** Required entity access */
	requiredEntity?: string;
	/** Content to render when access is denied */
	fallback?: ReactNode;
}

/**
 * Discord-style access guard component.
 * Wraps children and only renders them if the current user meets the permission requirements.
 * @param {RoleGuardProps} props - Guard configuration
 * @returns {JSX.Element} Protected content or fallback
 */
export function RoleGuard({
	children,
	requiredModule,
	requiredPermission = "view",
	requiredRole,
	requiredEntity,
	fallback = null,
}: RoleGuardProps) {
	const { can, canAccessEntity, hasMinRole } = usePermission();

	// Check module + permission
	if (requiredModule && !can(requiredModule, requiredPermission)) {
		return <>{fallback}</>;
	}

	// Check minimum role
	if (requiredRole && !hasMinRole(requiredRole)) {
		return <>{fallback}</>;
	}

	// Check entity access
	if (requiredEntity && !canAccessEntity(requiredEntity)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
