import type { ChatMessage, ConversationSummary, AssistantContext, Suggestion } from "./types";
import { MAX_CONVERSATION_HISTORY } from "./constants";


/** Key used for local storage persistence */
const STORAGE_KEY = "memora-assistant-history";

/** Maximum number of saved conversations */
const MAX_SAVED_CONVERSATIONS = 20;

/** Single saved conversation with metadata */
interface SavedConversation {
	id: string;
	title: string;
	messages: ChatMessage[];
	context: AssistantContext;
	createdAt: string;
	updatedAt: string;
}

/** Full history store shape */
interface HistoryStore {
	conversations: SavedConversation[];
	activeConversationId: string | null;
}

/**
 * Load history from local storage
 * @returns History store or empty default
 */

export function loadHistory(): HistoryStore {
	if (typeof window === "undefined") {
		return { conversations: [], activeConversationId: null };
	}

	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { conversations: [], activeConversationId: null };
		const parsed = JSON.parse(raw) as HistoryStore;
		return parsed;
	} catch {
		return { conversations: [], activeConversationId: null };
	}
}

/**
 * Save history to local storage
 * @param store History store to persist
 */

export function saveHistory(store: HistoryStore): void {
	if (typeof window === "undefined") return;

	try {
		// Trim to max conversations
		const trimmed: HistoryStore = {
			...store,
			conversations: store.conversations.slice(0, MAX_SAVED_CONVERSATIONS),
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
	} catch {
		// Silently fail if storage is full
	}
}

/**
 * Save or update conversation
 * @param id Conversation ID
 * @param messages Current messages
 * @param context Current context
 */

export function saveConversation(id: string, messages: ChatMessage[], context: AssistantContext): void {
	const history = loadHistory();
	const existingIndex = history.conversations.findIndex((c) => c.id === id);

	// Generate a title from the first user message
	const firstUserMessage = messages.find((m) => m.role === "user");
	const title = firstUserMessage
		? firstUserMessage.content.substring(0, 60) + (firstUserMessage.content.length > 60 ? "..." : "")
		: "Nouvelle conversation";

	const now = new Date().toISOString();

	if (existingIndex >= 0) {
		// Update existing
		history.conversations[existingIndex] = {
			...history.conversations[existingIndex],
			messages: messages.slice(-MAX_CONVERSATION_HISTORY),
			context,
			title,
			updatedAt: now,
		};
	} else {
		// Add new at the beginning
		history.conversations.unshift({
			id,
			title,
			messages: messages.slice(-MAX_CONVERSATION_HISTORY),
			context,
			createdAt: now,
			updatedAt: now,
		});
	}

	history.activeConversationId = id;
	saveHistory(history);
}

/**
 * Load conversation from history
 * @param id Conversation ID to load
 * @returns Conversation or null
 */

export function loadConversation(id: string): SavedConversation | null {
	const history = loadHistory();
	return history.conversations.find((c) => c.id === id) || null;
}

/**
 * Delete conversation from history
 * @param id Conversation ID to delete
 */

export function deleteConversation(id: string): void {
	const history = loadHistory();
	history.conversations = history.conversations.filter((c) => c.id !== id);
	if (history.activeConversationId === id) {
		history.activeConversationId = null;
	}
	saveHistory(history);
}

/**
 * Clear all history
 */

export function clearHistory(): void {
	saveHistory({ conversations: [], activeConversationId: null });
}

/**
 * Get conversation summaries
 * @returns Sorted conversation summaries
 */

export function getConversationSummaries(): ConversationSummary[] {
	const history = loadHistory();
	return history.conversations.map((c) => ({
		id: c.id,
		title: c.title,
		lastMessage: c.messages.length > 0 ? c.messages[c.messages.length - 1].content.substring(0, 80) : "",
		messageCount: c.messages.length,
		startedAt: c.createdAt,
		updatedAt: c.updatedAt,
	}));
}

/** Analytics event types */
export type AnalyticsEvent =
	| "conversation_started"
	| "message_sent"
	| "suggestion_clicked"
	| "flow_started"
	| "flow_completed"
	| "flow_cancelled"
	| "action_executed"
	| "navigation_triggered"
	| "error_occurred";

/** Analytics data point */
interface AnalyticsDataPoint {
	event: AnalyticsEvent;
	timestamp: string;
	metadata: Record<string, string | number>;
}

/** Analytics storage key */
const ANALYTICS_KEY = "memora-assistant-analytics";

/** Maximum number of analytics events to store */
const MAX_ANALYTICS_EVENTS = 500;

/**
 * Track analytics event
 * @param event Event type
 * @param metadata Additional event metadata
 */

export function trackEvent(event: AnalyticsEvent, metadata: Record<string, string | number> = {}): void {
	if (typeof window === "undefined") return;

	try {
		const raw = localStorage.getItem(ANALYTICS_KEY);
		const events: AnalyticsDataPoint[] = raw ? JSON.parse(raw) : [];

		events.push({
			event,
			timestamp: new Date().toISOString(),
			metadata,
		});

		// Trim to max events
		const trimmed = events.slice(-MAX_ANALYTICS_EVENTS);
		localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmed));
	} catch {
		// Silently fail
	}
}

/**
 * Get analytics summary
 * @returns Analytics summary counts
 */

export function getAnalyticsSummary(): Record<string, number> {
	if (typeof window === "undefined") return {};

	try {
		const raw = localStorage.getItem(ANALYTICS_KEY);
		if (!raw) return {};
		const events: AnalyticsDataPoint[] = JSON.parse(raw);

		const summary: Record<string, number> = {};
		for (const event of events) {
			summary[event.event] = (summary[event.event] || 0) + 1;
		}
		return summary;
	} catch {
		return {};
	}
}

/**
 * Get most-used actions
 * @returns Actions sorted by frequency
 */

export function getMostUsedActions(): string[] {
	if (typeof window === "undefined") return [];

	try {
		const raw = localStorage.getItem(ANALYTICS_KEY);
		if (!raw) return [];
		const events: AnalyticsDataPoint[] = JSON.parse(raw);

		// Count action occurrences
		const actionCounts: Record<string, number> = {};
		for (const event of events) {
			if (event.event === "action_executed" && event.metadata.action) {
				const action = String(event.metadata.action);
				actionCounts[action] = (actionCounts[action] || 0) + 1;
			}
		}

		// Sort by frequency
		return Object.entries(actionCounts)
			.sort(([, a], [, b]) => b - a)
			.map(([action]) => action);
	} catch {
		return [];
	}
}

/**
 * Get weekly activity data
 * @returns Daily message counts
 */

export function getWeeklyActivity(): { day: string; count: number }[] {
	if (typeof window === "undefined") return [];

	try {
		const raw = localStorage.getItem(ANALYTICS_KEY);
		if (!raw) return [];
		const events: AnalyticsDataPoint[] = JSON.parse(raw);

		const now = new Date();
		const days: { day: string; count: number }[] = [];

		for (let i = 6; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);
			const dayStr = date.toISOString().split("T")[0];
			const dayLabel = date.toLocaleDateString("fr-FR", { weekday: "short" });

			const count = events.filter((e) => {
				return e.event === "message_sent" && e.timestamp.startsWith(dayStr);
			}).length;

			days.push({ day: dayLabel, count });
		}

		return days;
	} catch {
		return [];
	}
}

/**
 * Clear analytics data
 */

export function clearAnalytics(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(ANALYTICS_KEY);
}
