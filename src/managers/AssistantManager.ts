import type { AssistantResponse } from "@/services/AssistantService";
import type { ChatMessage, ActiveFlow, AssistantContext, Suggestion } from "@/features/system/assistant/types";
import type { AssistantConfig } from "@/core/config/schemas/assistant.schema";

/**
 * Contract for the assistant service. Satisfied by the wrapper in container.ts.
 * Defined here to keep the manager decoupled from the concrete service class.
 */
export interface IAssistantService {
	processMessage(content: string, context: AssistantContext, flow: ActiveFlow | null): Promise<AssistantResponse>;
	simulateThinking(): Promise<void>;
	getAutocompleteSuggestions(input: string, context: AssistantContext): Suggestion[];
}

// Callback for updating the conversation state
export interface ConversationCallbacks {
	addMessage: (message: ChatMessage) => void;
	setStatus: (status: "idle" | "thinking" | "processing" | "confirming" | "error") => void;
	setActiveFlow: (flow: ActiveFlow | null) => void;
	setSuggestions: (suggestions: Suggestion[]) => void;
	setHasUnread: (unread: boolean) => void;
	isOpen: boolean;
}

// Manages the conversation lifecycle
export class AssistantManager {
	// Reference to conversation state callbacks
	private callbacks: ConversationCallbacks;

	// Current application context
	private context: AssistantContext;

	// Current active conversation flow
	private activeFlow: ActiveFlow | null = null;

	// Processing lock to prevent duplicate submissions
	private isProcessing = false;

	// Injected service — never imported directly
	private svc: IAssistantService;

	// Config-driven messages
	private cfg: AssistantConfig;

	/**
	 * Create an AssistantManager instance.
	 * @param callbacks Functions to update conversation state
	 * @param context Current application context
	 * @param svc Assistant service injected from container
	 * @param cfg Assistant config from container.config.assistant
	 */

	constructor(
		callbacks: ConversationCallbacks,
		context: AssistantContext,
		svc: IAssistantService,
		cfg: AssistantConfig,
	) {
		this.callbacks = callbacks;
		this.context = context;
		this.svc = svc;
		this.cfg = cfg;
	}

	/**
	 * Update the application context
	 * @param context Partial context updates
	 */

	updateContext(context: Partial<AssistantContext>): void {
		this.context = { ...this.context, ...context };
	}

	/**
	 * Update the active flow
	 * @param flow New flow state or null
	 */

	setActiveFlow(flow: ActiveFlow | null): void {
		this.activeFlow = flow;
	}

	/**
	 * Process a user message
	 * @param content - User message content
	 * @returns Assistant response or null
	 */

	async processUserMessage(content: string): Promise<AssistantResponse | null> {
		// Prevent double processing
		if (this.isProcessing) return null;
		this.isProcessing = true;

		try {
			// Add the user message to the conversation
			const userMessage: ChatMessage = {
				id: `user-${Date.now()}`,
				role: "user",
				content,
				timestamp: new Date().toISOString(),
			};
			this.callbacks.addMessage(userMessage);

			// Set thinking status
			this.callbacks.setStatus("thinking");

			// Simulate thinking delay
			await this.svc.simulateThinking();

			// Set processing status
			this.callbacks.setStatus("processing");

			// Process the message
			const response = await this.svc.processMessage(content, this.context, this.activeFlow);

			// Add the assistant response
			this.callbacks.addMessage(response.message);

			// Update flow state
			if (response.flow !== undefined) {
				this.activeFlow = response.flow;
				this.callbacks.setActiveFlow(response.flow);
			} else if (this.activeFlow && !response.flow) {
				// Flow completed or cancelled
				this.activeFlow = null;
				this.callbacks.setActiveFlow(null);
			}

			// Update suggestions
			if (response.suggestions) {
				this.callbacks.setSuggestions(response.suggestions);
			}

			// Set unread indicator
			if (!this.callbacks.isOpen) {
				this.callbacks.setHasUnread(true);
			}

			// Reset status
			this.callbacks.setStatus("idle");

			return response;
		} catch (error) {
			// Handle error — message from config, never hardcoded
			const errorMessage: ChatMessage = {
				id: `error-${Date.now()}`,
				role: "assistant",
				content: this.cfg.errorMessage,
				timestamp: new Date().toISOString(),
				isError: true,
			};
			this.callbacks.addMessage(errorMessage);
			this.callbacks.setStatus("error");

			return null;
		} finally {
			this.isProcessing = false;
		}
	}

	/**
	 * Handle suggestion click
	 * @param query Suggestion query
	 * @returns Assistant response or null
	 */

	async handleSuggestionClick(query: string): Promise<AssistantResponse | null> {
		return this.processUserMessage(query);
	}

	/**
	 * Handle action confirmation
	 * @param actionId Action ID
	 * @param payload Action payload
	 * @returns Assistant response or null
	 */

	async handleActionConfirm(actionId: string, payload: Record<string, string>): Promise<AssistantResponse | null> {
		return this.processUserMessage(`Confirmer : ${actionId}`);
	}

	// Cancel active flow
	cancelCurrentFlow(): void {
		this.activeFlow = null;
		this.callbacks.setActiveFlow(null);
		this.callbacks.setStatus("idle");

		const cancelMessage: ChatMessage = {
			id: `cancel-${Date.now()}`,
			role: "assistant",
			content: this.cfg.flowCancelledMessage,
			timestamp: new Date().toISOString(),
		};
		this.callbacks.addMessage(cancelMessage);
	}

	// Reset conversation
	resetConversation(): void {
		this.activeFlow = null;
		this.isProcessing = false;
	}

	/**
	 * Check if processing
	 * @returns True if processing
	 */

	getIsProcessing(): boolean {
		return this.isProcessing;
	}

	/**
	 * Get autocomplete suggestions
	 * @param input Current input text
	 * @returns Matching suggestions
	 */

	getAutocompleteSuggestions(input: string): Suggestion[] {
		return this.svc.getAutocompleteSuggestions(input, this.context);
	}
}
