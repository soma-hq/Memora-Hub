import type { Module } from "@/core/config/capabilities";

export interface EntityRoleTemplateInput {
	key: string;
	label: string;
	modules: Module[];
}

export interface EntityPageBlueprint {
	slug: string;
	title: string;
	module: Module;
}

export const DEFAULT_ENTITY_ROLE_TEMPLATES: EntityRoleTemplateInput[] = [
	{
		key: "owner",
		label: "Owner",
		modules: ["admin", "personnel", "projects", "tasks", "meetings", "logs", "groups", "notifications"],
	},
	{
		key: "manager",
		label: "Manager",
		modules: ["personnel", "projects", "tasks", "meetings", "logs", "notifications"],
	},
	{
		key: "member",
		label: "Membre",
		modules: ["personnel", "tasks", "notifications"],
	},
];

export const DEFAULT_ENTITY_PAGES: EntityPageBlueprint[] = [
	{ slug: "personnel", title: "Personnel", module: "personnel" },
	{ slug: "projects", title: "Projets", module: "projects" },
	{ slug: "tasks", title: "Taches", module: "tasks" },
	{ slug: "meetings", title: "Reunions", module: "meetings" },
	{ slug: "permissions", title: "Permissions", module: "admin" },
];

export function normalizeRoleTemplates(input?: EntityRoleTemplateInput[]): EntityRoleTemplateInput[] {
	const source = input && input.length > 0 ? input : DEFAULT_ENTITY_ROLE_TEMPLATES;

	return source.map((role) => {
		const modules = Array.from(new Set(["personnel", ...(role.modules ?? [])])) as Module[];

		return {
			key: role.key.trim().toLowerCase(),
			label: role.label.trim(),
			modules,
		};
	});
}
