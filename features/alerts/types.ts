/** Types of system alerts */
export type AlertType = "update" | "access_denied" | "access_granted";

/** Represents a system alert */
export interface SystemAlert {
	id: string;
	type: AlertType;
	title: string;
	description: string;
	timestamp: string;
	dismissed: boolean;
	metadata?: Record<string, string>;
}
