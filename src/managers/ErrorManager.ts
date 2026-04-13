type LogLevel = "info" | "warn" | "error";

// Centralized errors
export class ErrorManager {
	/**
	 * Capture an error with optional context metadata
	 * @param error The error object to capture
	 * @param context Additional metadata about the error context
	 */
	static capture(error: Error, context?: Record<string, unknown>): void {
		// Extend with Sentry: Sentry.captureException(error, { extra: context })
		console.error("[ErrorManager]", error.message, context ?? "");
	}

	/**
	 * Write à structured log entry at the specified severity level
	 * @param level Log severity level
	 * @param message Human-readable log message
	 * @param meta Optional structured metadata
	 */
	static log(level: LogLevel, message: string, meta?: object): void {
		const prefix = `[${level.toUpperCase()}]`;
		if (level === "error") console.error(prefix, message, meta ?? "");
		else if (level === "warn") console.warn(prefix, message, meta ?? "");
		else console.info(prefix, message, meta ?? "");
	}
}
