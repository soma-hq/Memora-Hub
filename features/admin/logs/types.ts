/** Severity levels for log entries */
export type LogLevel = "info" | "warning" | "error" | "success";

/** Source categories for log entries */
export type LogSource = "system" | "moderation" | "project" | "user" | "security" | "notification";

/** Represents a single log entry */
export interface LogEntry {
	id: string;
	timestamp: string;
	level: LogLevel;
	source: LogSource;
	title: string;
	description: string;
	user?: string;
	metadata?: Record<string, string>;
}
