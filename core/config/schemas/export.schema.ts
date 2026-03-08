import { z } from "zod";

export const exportConfigSchema = z.object({
	defaultFormat: z.enum(["pdf", "csv", "xlsx"]),
	maxRowsPerExport: z.number().int().min(1),
	includeHeaders: z.boolean(),
});

export type ExportConfig = z.infer<typeof exportConfigSchema>;
