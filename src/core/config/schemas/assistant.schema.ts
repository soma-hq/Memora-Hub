import { z } from "zod";

export const assistantConfigSchema = z.object({
	errorMessage: z.string(),
	flowCancelledMessage: z.string(),
	maxConversationHistory: z.number().int().min(1),
});

export type AssistantConfig = z.infer<typeof assistantConfigSchema>;
