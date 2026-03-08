import { z } from "zod";

export const tasksConfigSchema = z.object({
	defaultStatus: z.string(),
	defaultPriority: z.string(),
	maxSubtasks: z.number().int().min(1),
	enableTimeTracking: z.boolean(),
	dueDateWarningDays: z.number().int().min(0),
});

export type TasksConfig = z.infer<typeof tasksConfigSchema>;
