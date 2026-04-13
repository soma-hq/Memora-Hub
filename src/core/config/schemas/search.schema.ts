import { z } from "zod";

export const searchConfigSchema = z.object({
	minQueryLength: z.number().int().min(1),
	maxResults: z.number().int().min(1),
	debounceMs: z.number().int().min(0),
	enableFuzzy: z.boolean(),
});

export type SearchConfig = z.infer<typeof searchConfigSchema>;
