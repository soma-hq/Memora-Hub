export interface PageConventions {
	/** Rules that every page must follow */
	rules: string[];

	/** Structure that every page file must respect */
	fileStructure: string[];

	/** Naming conventions */
	naming: string[];

	/** Permission conventions */
	permissions: string[];
}

export const CONVENTIONS: PageConventions = {
	rules: [
		"Every page.tsx must declare a PAGE_CONFIG const of type PageConfig immediately after imports.",
		"Every script must declare a SCRIPT_CONFIG const of type ScriptConfig immediately after imports.",
		"PAGE_CONFIG must accurately reflect the actual permissions required by the page.",
		"ownerOnly: true must be set for all pages under the (owner) route group.",
		"entityScoped: true must be set for all pages under hub/[groupId]/.",
		"module must match the functional module the page belongs to.",
		"requiredPermissions must list at minimum a view permission for the relevant module.",
		"Auth pages (login, a2f, onboarding) have section: 'auth' and no permission requirements.",
		"Settings and profile pages have section: 'protected' with no module requirement.",
	],

	fileStructure: [
		"1. 'use client' directive (if needed)",
		"2. Import statements (React, Next.js, components, types, utils)",
		"3. Import { definePageConfig } from '@/structures'",
		"4. PAGE_CONFIG declaration using definePageConfig()",
		"5. Local types and interfaces",
		"6. Local constants and mock data",
		"7. Helper functions",
		"8. Exported default page component",
	],

	naming: [
		"PAGE_CONFIG for page configuration const.",
		"SCRIPT_CONFIG for script configuration const.",
		"Page components use PascalCase with Page suffix: DashboardPage, TasksPage.",
		"Section names match route groups: auth, public, owner, legacy, protected.",
		"Module names match core/config/capabilities.ts Module type.",
	],

	permissions: [
		"Owner pages: ownerOnly: true, requiredRole: 'owner', module: 'admin'.",
		"Legacy pages: section: 'legacy', no specific module required.",
		"Hub pages: entityScoped: true, module matches the feature area.",
		"Moderation pages: module is one of moderation_discord, moderation_twitch, moderation_youtube, moderation_polyvalent.",
		"Personnel pages: module: 'personnel'.",
		"Momentum pages: module: 'momentum'.",
		"Recruitment pages: module: 'talent'.",
		"Tasks pages: module: 'tasks'.",
		"Projects pages: module: 'projects'.",
		"Meetings pages: module: 'meetings'.",
		"Logs pages: module: 'logs'.",
		"Settings/profile pages: module: null (no specific module).",
	],
};
