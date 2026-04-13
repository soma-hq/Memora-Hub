import { z } from "zod";

export const notificationsConfigSchema = z.object({
	inAppEnabled: z.boolean(),
	emailEnabled: z.boolean(),
	autoMarkReadAfterDays: z.number().int().min(0),
	maxUnreadDisplay: z.number().int().min(1),
});

export type NotificationsConfig = z.infer<typeof notificationsConfigSchema>;
