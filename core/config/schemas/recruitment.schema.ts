import { z } from "zod";

export const recruitmentConfigSchema = z.object({
	maxCandidatesPerOffer: z.number().int().min(1),
	defaultOfferStatus: z.string(),
	enableQuestionnaire: z.boolean(),
	interviewReminderHours: z.number().int().min(0),
});

export type RecruitmentConfig = z.infer<typeof recruitmentConfigSchema>;
