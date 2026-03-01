type LogLevel = "info" | "warn" | "error";

// Centralized errors
export class ErrorManager {
	/**
	 * Capture an error with context
	 * @param error Error to capture
	 * @param context Additional context metadata
	 */

	static capture(error: Error, context?: Record<string, unknown>): void {
		// Extend with Sentry: Sentry.captureException(error, { extra: context })
		console.error("[ErrorManager]", error.message, context ?? "");
	}

	/**
	 * Write a structured log entry
	 * @param level Log severity level
	 * @param message Log message
	 * @param meta Optional metadata
	 */

	static log(level: LogLevel, message: string, meta?: object): void {
		const prefix = `[${level.toUpperCase()}]`;
		if (level === "error") console.error(prefix, message, meta ?? "");
		else if (level === "warn") console.warn(prefix, message, meta ?? "");
		else console.info(prefix, message, meta ?? "");
	}
}
