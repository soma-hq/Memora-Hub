import { z } from "zod";

export const authConfigSchema = z.object({
	sessionDurationDays: z.number().int().min(1),
	maxLoginAttempts: z.number().int().min(1),
	lockoutDurationMinutes: z.number().int().min(0),
	tokenExpiryHours: z.number().int().min(1),
	a2fEnabled: z.boolean(),
	passwordMinLength: z.number().int().min(6).max(128),
});

export type AuthConfig = z.infer<typeof authConfigSchema>;
