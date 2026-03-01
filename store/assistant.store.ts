import { create } from "zustand";
import type {

	ChatMessage,
	AssistantStatus,
	ActiveFlow,
	Suggestion,
	AssistantContext,
} from "@/features/assistant/types";
import { WELCOME_MESSAGE, WELCOME_SUGGESTIONS, MAX_CONVERSATION_HISTORY } from "@/features/assistant/constants";


/** State shape for the assistant store */
interface AssistantState {
	// Visibility
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;

	// Status
	status: AssistantStatus;
	setStatus: (status: AssistantStatus) => void;

	// Messages
	messages: ChatMessage[];
	addMessage: (message: ChatMessage) => void;
	updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
	removeMessage: (id: string) => void;
	clearMessages: () => void;

	// Active flow
	activeFlow: ActiveFlow | null;
	setActiveFlow: (flow: ActiveFlow | null) => void;
	advanceFlow: (value: string) => void;
	cancelFlow: () => void;

	// Suggestions
	suggestions: Suggestion[];
	setSuggestions: (suggestions: Suggestion[]) => void;

	// Context
	context: AssistantContext;
	setContext: (context: Partial<AssistantContext>) => void;

	// Input
	inputValue: string;
	setInputValue: (value: string) => void;

	// Conversation management
	conversationId: string;
	startNewConversation: () => void;

	// Pending action
	pendingAction: { actionId: string; payload: Record<string, string> } | null;
	setPendingAction: (action: { actionId: string; payload: Record<string, string> } | null) => void;

	// Minimized state
	isMinimized: boolean;
	setMinimized: (minimized: boolean) => void;

	// Unread indicator
	hasUnread: boolean;
	setHasUnread: (unread: boolean) => void;
}

/**
 * Generate conversation ID
 * @returns Unique string identifier
 */

function generateConversationId(): string {
	return `conv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Create welcome message
 * @returns Welcome chat message
 */

function createWelcomeMessage(): ChatMessage {
	return {
		id: "welcome",
		role: "assistant",
		content: WELCOME_MESSAGE,
		timestamp: new Date().toISOString(),
	};
}

/**
 * Zustand store for the AI assistant conversation state.
 * @returns Assistant store state
 */

export const useAssistantStore = create<AssistantState>((set, get) => ({
	// Visibility controls
	isOpen: false,

	/**
	 * Open the modal
	 */

	open: () => set({ isOpen: true, hasUnread: false }),

	/**
	 * Close the modal
	 */

	close: () => set({ isOpen: false }),

	/**
	 * Toggle modal
	 */

	toggle: () => {
		const current = get().isOpen;
		set({ isOpen: !current, ...(current ? {} : { hasUnread: false }) });
	},

	// Status
	status: "idle",

	/**
	 * Set status
	 * @param status New status value
	 */

	setStatus: (status) => set({ status }),

	// Messages
	messages: [createWelcomeMessage()],

	/**
	 * Add a message
	 * @param message Message to add
	 */

	addMessage: (message) =>
		set((s) => {
			const messages = [...s.messages, message];
			// Trim oldest messages if over limit, keeping welcome message
			if (messages.length > MAX_CONVERSATION_HISTORY) {
				return { messages: [messages[0], ...messages.slice(messages.length - MAX_CONVERSATION_HISTORY + 1)] };
			}
			return { messages };
		}),

	/**
	 * Update a message by ID
	 * @param id Message ID
	 * @param updates Partial message fields
	 */

	updateMessage: (id, updates) =>
		set((s) => ({
			messages: s.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
		})),

	/**
	 * Remove a message
	 * @param id Message ID to remove
	 */

	removeMessage: (id) =>
		set((s) => ({
			messages: s.messages.filter((m) => m.id !== id),
		})),

	/**
	 * Clear messages and reset
	 */

	clearMessages: () =>
		set({
			messages: [createWelcomeMessage()],
			activeFlow: null,
			pendingAction: null,
			status: "idle",
			suggestions: WELCOME_SUGGESTIONS,
		}),

	// Active flow
	activeFlow: null,

	/**
	 * Set the active flow
	 * @param flow Active flow state or null
	 */

	setActiveFlow: (flow) => set({ activeFlow: flow }),

	/**
	 * Advance flow to next step
	 * @param value User value for current step
	 */

	advanceFlow: (value) => {
		const flow = get().activeFlow;
		if (!flow) return;

		const currentStep = flow.steps[flow.currentStepIndex];
		const updatedData = { ...flow.collectedData, [currentStep.field]: value };
		const nextIndex = flow.currentStepIndex + 1;

		// Check if flow is complete
		if (nextIndex >= flow.steps.length) {
			set({ activeFlow: { ...flow, collectedData: updatedData, currentStepIndex: nextIndex } });
		} else {
			set({ activeFlow: { ...flow, collectedData: updatedData, currentStepIndex: nextIndex } });
		}
	},

	/**
	 * Cancel flow and reset
	 */

	cancelFlow: () => set({ activeFlow: null, status: "idle", suggestions: WELCOME_SUGGESTIONS }),

	// Suggestions
	suggestions: WELCOME_SUGGESTIONS,

	/**
	 * Update suggestions
	 * @param suggestions New suggestions array
	 */

	setSuggestions: (suggestions) => set({ suggestions }),

	// Context
	context: {
		currentPage: "/",
		adminMode: false,
	},

	/**
	 * Update assistant context
	 * @param context Partial context updates
	 */

	setContext: (context) => set((s) => ({ context: { ...s.context, ...context } })),

	// Input
	inputValue: "",

	/**
	 * Set input value
	 * @param value New input value
	 */

	setInputValue: (value) => set({ inputValue: value }),

	// Conversation management
	conversationId: generateConversationId(),

	/**
	 * Start a new conversation
	 */

	startNewConversation: () =>
		set({
			conversationId: generateConversationId(),
			messages: [createWelcomeMessage()],
			activeFlow: null,
			pendingAction: null,
			status: "idle",
			suggestions: WELCOME_SUGGESTIONS,
			inputValue: "",
		}),

	// Pending action
	pendingAction: null,

	/**
	 * Set a pending action
	 * @param action Pending action or null
	 */

	setPendingAction: (action) => set({ pendingAction: action }),

	// Minimized state
	isMinimized: false,

	/**
	 * Set minimized state
	 * @param minimized Minimized state
	 */

	setMinimized: (minimized) => set({ isMinimized: minimized }),

	// Unread indicator
	hasUnread: false,

	/**
	 * Set unread indicator
	 * @param unread Whether there are unread messages
	 */

	setHasUnread: (unread) => set({ hasUnread: unread }),
}));
