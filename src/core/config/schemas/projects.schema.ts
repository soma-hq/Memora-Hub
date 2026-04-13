import { z } from "zod";

export const projectsConfigSchema = z.object({
	defaultStatus: z.string(),
	defaultPriority: z.string(),
	maxMembersPerProject: z.number().int().min(1),
	enableTimeline: z.boolean(),
	enableRelations: z.boolean(),
});

export type ProjectsConfig = z.infer<typeof projectsConfigSchema>;
