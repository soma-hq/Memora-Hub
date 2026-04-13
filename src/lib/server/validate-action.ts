import type { ZodSchema, ZodError } from "zod";

/**
 * Validates form data against a Zod schema.
 * Returns a standardised error result on failure.
 */
export function validateAction<T>(
	schema: ZodSchema<T>,
	data: unknown,
): { success: true; data: T } | { success: false; error: string } {
	try {
		const validated = schema.parse(data);
		return { success: true, data: validated };
	} catch (error) {
		const zodError = error as ZodError;
		return { success: false, error: zodError.issues?.[0]?.message ?? "Donnees invalides" };
	}
}
