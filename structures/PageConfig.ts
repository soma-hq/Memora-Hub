import type { RoleId } from "@/core/config/roles";
import type { Module, Permission } from "@/core/config/capabilities";

/**
 * Route group the page belongs to.
 * Determines base-level access and layout context.
 */
export type PageSection = "auth" | "public" | "owner" | "legacy" | "protected";

/**
 * Page configuration structure.
 * Every page must declare a PAGE_CONFIG const below its imports.
 *
 * Inspired by Discord bot command structures where each command
 * declares its required permissions, category, and access rules.
 */
export interface PageConfig {
	/** Unique page identifier matching the route path */
	name: string;

	/** Route group section */
	section: PageSection;

	/** Associated application module (null for auth/public/settings/profile pages) */
	module: Module | null;

	/** Short description of what the page does */
	description: string;

	/** Minimum role required to access this page (null = any authenticated user) */
	requiredRole: RoleId | null;

	/** Required permissions as module + action pairs */
	requiredPermissions: { module: Module; action: Permission }[];

	/** Owner-only shorthand (equivalent to requiredRole: "owner") */
	ownerOnly: boolean;

	/** Whether this page requires entity context (groupId in URL) */
	entityScoped: boolean;
}

/**
 * Helper to create a PageConfig with sensible defaults.
 * Reduces boilerplate for common page patterns.
 */
export function definePageConfig(
	config: Partial<PageConfig> & Pick<PageConfig, "name" | "section" | "description">,
): PageConfig {
	return {
		module: null,
		requiredRole: null,
		requiredPermissions: [],
		ownerOnly: false,
		entityScoped: false,
		...config,
	};
}
