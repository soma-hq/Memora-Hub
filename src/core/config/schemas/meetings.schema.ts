import { z } from "zod";

export const meetingsConfigSchema = z.object({
	defaultDurationMinutes: z.number().int().min(1),
	reminderBeforeMinutes: z.number().int().min(0),
	maxParticipants: z.number().int().min(1),
	enableRecurring: z.boolean(),
	defaultLocation: z.string(),
});

export type MeetingsConfig = z.infer<typeof meetingsConfigSchema>;
