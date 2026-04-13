import { z } from "zod";

export const trainingConfigSchema = z.object({
	defaultCapacity: z.number().int().min(1),
	defaultStatus: z.string(),
	enableCertificates: z.boolean(),
	minEnrollmentDays: z.number().int().min(0),
});

export type TrainingConfig = z.infer<typeof trainingConfigSchema>;
