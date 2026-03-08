import { z } from "zod";

const sectionModeSchema = z.object({
	bannerPath: z.string().startsWith("/"),
	accentColor: z.enum(["red-pastel", "orange-pastel", "rose-pastel"]),
});

export const sectionBannersConfigSchema = z.object({
	owner: sectionModeSchema,
	legacy: sectionModeSchema,
	default: sectionModeSchema,
});

export type SectionBannersConfig = z.infer<typeof sectionBannersConfigSchema>;
export type SectionModeConfig = z.infer<typeof sectionModeSchema>;
