import { z } from "zod";

export const usersConfigSchema = z.object({
	requireA2F: z.boolean(),
	defaultRole: z.string(),
	passwordMinLength: z.number().int().min(6).max(128),
	sessionTimeoutHours: z.number().int().min(1),
	maxLoginAttempts: z.number().int().min(1),
});

export type UsersConfig = z.infer<typeof usersConfigSchema>;
