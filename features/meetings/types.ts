// Constants & types
import type { MeetingTypeValue } from "@/constants";

export type { MeetingTypeValue };

// Re-export label for consumer convenience
export { MeetingTypeLabel } from "@/constants";
// Re-export variant maps from design system
export { meetingTypeVariant, meetingTypeDotColors } from "@/core/design/states";


/** Participant in a meeting */
export interface MeetingParticipant {
	userId: string;
	name: string;
	avatar?: string;
}

/** Core meeting entity */
export interface Meeting {
	id: string;
	title: string;
	date: string;
	startTime: string;
	endTime: string;
	location: string;
	type: MeetingTypeValue;
	participants: MeetingParticipant[];
	notes?: string;
	isOnline: boolean;
	link?: string;
}

/** Form data for creating or editing a meeting */
export interface MeetingFormData {
	title: string;
	date: string;
	startTime: string;
	endTime: string;
	location: string;
	type: MeetingTypeValue;
	participants: MeetingParticipant[];
	notes: string;
	isOnline: boolean;
	link: string;
}
