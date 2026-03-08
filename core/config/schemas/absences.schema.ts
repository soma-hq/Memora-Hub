import { z } from "zod";

export const absencesConfigSchema = z.object({
	requireApproval: z.boolean(),
	minNoticeDays: z.number().int().min(0),
	maxDaysPerRequest: z.number().int().min(1),
});

export type AbsencesConfig = z.infer<typeof absencesConfigSchema>;
