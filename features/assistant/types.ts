// Sender role for a chat message
export type MessageRole = "user" | "assistant" | "system";

// Current assistant processing state
export type AssistantStatus = "idle" | "thinking" | "processing" | "confirming" | "error";

// Categories of intents the assistant can handle
export type IntentCategory =
	| "navigation"
	| "task"
	| "project"
	| "meeting"
	| "absence"
	| "notification"
	| "user"
	| "search"
	| "help"
	| "settings"
	| "export"
	| "recruitment"
	| "training"
	| "group"
	| "greeting"
	| "unknown";

// Specific action the assistant should execute
export type IntentAction =
	| "navigate_to"
	| "create_task"
	| "update_task"
	| "delete_task"
	| "list_tasks"
	| "assign_task"
	| "complete_task"
	| "create_project"
	| "update_project"
	| "list_projects"
	| "delete_project"
	| "create_meeting"
	| "list_meetings"
	| "cancel_meeting"
	| "request_absence"
	| "list_absences"
	| "approve_absence"
	| "reject_absence"
	| "search_global"
	| "list_notifications"
	| "mark_notifications_read"
	| "list_users"
	| "find_user"
	| "change_theme"
	| "toggle_admin_mode"
	| "export_data"
	| "create_training"
	| "list_trainings"
	| "create_job_offer"
	| "list_candidates"
	| "show_stats"
	| "show_help"
	| "greet"
	| "unknown";

// Detected intent from user input
export interface DetectedIntent {
	category: IntentCategory;
	action: IntentAction;
	confidence: number;
	entities: Record<string, string>;
	rawQuery: string;
}

// Single step in a multi-step conversation flow
export interface FlowStep {
	id: string;
	field: string;
	label: string;
	type: "text" | "select" | "date" | "textarea" | "confirm";
	options?: FlowSelectOption[];
	placeholder?: string;
	required: boolean;
	validation?: (value: string) => string | null;
}

// Option in a select-type flow step
export interface FlowSelectOption {
	value: string;
	label: string;
}

// State of an active multi-step flow
export interface ActiveFlow {
	id: string;
	action: IntentAction;
	steps: FlowStep[];
	currentStepIndex: number;
	collectedData: Record<string, string>;
	startedAt: string;
}

/** Rich content attachment in a message */
export type MessageAttachment =
	| MessageAttachmentList
	| MessageAttachmentCard
	| MessageAttachmentForm
	| MessageAttachmentConfirm
	| MessageAttachmentStats
	| MessageAttachmentNavigation;

//  List of items displayed as cards
export interface MessageAttachmentList {
	type: "list";
	title: string;
	items: MessageListItem[];
	emptyText?: string;
}

// Single item in a list attachment
export interface MessageListItem {
	id: string;
	label: string;
	description?: string;
	badge?: string;
	badgeVariant?: "success" | "error" | "warning" | "info" | "neutral" | "primary";
	href?: string;
	icon?: string;
}

/** A standalone info card */
export interface MessageAttachmentCard {
	type: "card";
	title: string;
	fields: MessageCardField[];
	actions?: MessageCardAction[];
}

/** Key value field inside a card */
export interface MessageCardField {
	label: string;
	value: string;
}

/** Clickable action inside a card */
export interface MessageCardAction {
	label: string;
	actionId: string;
	variant?: "primary" | "cancel" | "outline-danger";
}

/** Inline form for collecting data */
export interface MessageAttachmentForm {
	type: "form";
	title: string;
	fields: FlowStep[];
	submitLabel: string;
	cancelLabel?: string;
}

/** Confirmation prompt before executing an action */
export interface MessageAttachmentConfirm {
	type: "confirm";
	title: string;
	description: string;
	confirmLabel: string;
	cancelLabel: string;
	actionId: string;
	payload: Record<string, string>;
}

/** Statistics display */
export interface MessageAttachmentStats {
	type: "stats";
	title: string;
	stats: MessageStatItem[];
}

/** Single statistic entry */
export interface MessageStatItem {
	label: string;
	value: string | number;
	trend?: "up" | "down" | "neutral";
	color?: string;
}

/** Navigation links */
export interface MessageAttachmentNavigation {
	type: "navigation";
	links: MessageNavLink[];
}

/** Single navigation link */
export interface MessageNavLink {
	label: string;
	href: string;
	icon?: string;
	description?: string;
}

/** Single chat message */
export interface ChatMessage {
	id: string;
	role: MessageRole;
	content: string;
	timestamp: string;
	attachment?: MessageAttachment;
	isError?: boolean;
	isStreaming?: boolean;
}

/** Quick action suggestion chip */
export interface Suggestion {
	id: string;
	label: string;
	icon?: string;
	description?: string;
	query: string;
	category: IntentCategory;
}

/** Context about the current application state */
export interface AssistantContext {
	currentPage: string;
	currentGroupId?: string;
	currentGroupName?: string;
	currentUserId?: string;
	currentUserName?: string;
	currentUserRole?: string;
	adminMode: boolean;
	activeProjectId?: string;
	activeProjectName?: string;
}

/** Summary of a conversation for history */
export interface ConversationSummary {
	id: string;
	title: string;
	lastMessage: string;
	messageCount: number;
	startedAt: string;
	updatedAt: string;
}

/** Result from executing an action */
export interface ActionResult {
	success: boolean;
	message: string;
	data?: unknown;
	attachment?: MessageAttachment;
	followUpSuggestions?: Suggestion[];
	navigateTo?: string;
}

/** Configuration for conversation flow definitions */
export interface FlowDefinition {
	id: string;
	action: IntentAction;
	title: string;
	description: string;
	steps: FlowStep[];
}
