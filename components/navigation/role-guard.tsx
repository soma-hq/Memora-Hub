"use client";

import { usePermission } from "@/hooks/usePermission";
import type { ReactNode } from "react";
import type { Role } from "@/core/config/roles";
import type { Capability } from "@/core/config/capabilities";


interface RoleGuardProps {
	children: ReactNode;
	capability?: Capability;
	minRole?: Role;
	fallback?: ReactNode;
}

/**
 * Role/capability access guard.
 * @param {RoleGuardProps} props - Component props
 * @param {ReactNode} props.children - Protected content
 * @param {Capability} [props.capability] - Required capability
 * @param {Role} [props.minRole] - Minimum role
 * @param {ReactNode} [props.fallback=null] - Fallback on deny
 * @returns {JSX.Element} Authorized content or fallback
 */

export function RoleGuard({ children, capability, minRole, fallback = null }: RoleGuardProps) {
	const { can, hasMinRole } = usePermission();

	if (capability && !can(capability)) {
		return <>{fallback}</>;
	}

	if (minRole && !hasMinRole(minRole)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
