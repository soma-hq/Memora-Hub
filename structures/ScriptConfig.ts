import type { RoleId } from "@/core/config/roles";

/** Script categories */
export type ScriptCategory = "tutorial" | "onboarding" | "utility";

/**
 * Script configuration structure.
 * Every script must declare a SCRIPT_CONFIG const below its imports.
 */
export interface ScriptConfig {
	/** Unique script identifier */
	name: string;

	/** Script category */
	category: ScriptCategory;

	/** Short description of what the script does */
	description: string;

	/** Minimum role required to trigger this script (null = any authenticated user) */
	requiredRole: RoleId | null;

	/** Owner-only shorthand */
	ownerOnly: boolean;
}

/**
 * Helper to create a ScriptConfig with sensible defaults.
 */
export function defineScriptConfig(
	config: Partial<ScriptConfig> & Pick<ScriptConfig, "name" | "category" | "description">,
): ScriptConfig {
	return {
		requiredRole: null,
		ownerOnly: false,
		...config,
	};
}
