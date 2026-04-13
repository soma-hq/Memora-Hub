import { z } from "zod";

export const paginationConfigSchema = z.object({
	defaultPageSize: z.number().int().min(1).max(1000),
	maxPageSize: z.number().int().min(1).max(1000),
	defaultSortOrder: z.enum(["asc", "desc"]),
});

export type PaginationConfig = z.infer<typeof paginationConfigSchema>;
