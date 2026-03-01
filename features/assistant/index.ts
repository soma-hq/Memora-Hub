// Public exports for the assistant feature module

export type {
	ChatMessage,
	Suggestion,
	AssistantContext,
	AssistantStatus,
	DetectedIntent,
	ActiveFlow,
	ActionResult,
	MessageAttachment,
	FlowDefinition,
	FlowStep,
	ConversationSummary,
} from "./types";

export { useAssistant, useAssistantContext, useAssistantKeyboard, useAssistantStats } from "./hooks";
export { AssistantModal } from "./components/assistant-modal";
export { AssistantButton } from "./components/assistant-button";
export { AssistantHeader } from "./components/assistant-header";
export { AssistantMessageList } from "./components/assistant-message-list";
export { AssistantMessage } from "./components/assistant-message";
export { AssistantInput } from "./components/assistant-input";
export { AssistantSuggestions } from "./components/assistant-suggestions";
export { AssistantActionCard } from "./components/assistant-action-card";
export { AssistantTypingIndicator } from "./components/assistant-typing-indicator";
export { AssistantWelcome } from "./components/assistant-welcome";
export { detectIntent, requiresFlow, requiresNavigation } from "./intent-engine";
export { executeAction, getFlowForAction, initializeFlow, getFlowCompletionMessage } from "./action-engine";
export {

	getContextualSuggestions,
	detectCurrentModule,
	buildContextSummary,
	hasPermissionForAction,
} from "./context-engine";
export {

	getAutocompleteSuggestions,
	getFollowUpSuggestions,
	getWelcomeSuggestions,
	getTrendingSuggestions,
} from "./suggestion-engine";

export {

	ASSISTANT_NAME,
	WELCOME_MESSAGE,
	WELCOME_SUGGESTIONS,
	NAVIGATION_TARGETS,
	FLOW_DEFINITIONS,
} from "./constants";

export {

	loadHistory,
	saveHistory,
	saveConversation,
	loadConversation,
	deleteConversation,
	clearHistory,
	getConversationSummaries,
	trackEvent,
	getAnalyticsSummary,
	getMostUsedActions,
	getWeeklyActivity,
	clearAnalytics,
} from "./history-manager";

export {

	getResponse,
	getTimeAwareGreeting,
	getErrorMessage,
	getFlowTransitionMessage,
	getIdlePrompt,
	getPersonalizedSuggestions,
} from "./response-templates";

export {

	isSmartCommand,
	executeSmartCommand,
	parseSmartCommand,
	getCommandAutocompleteSuggestions,
	getAllCommandSuggestions,
	SMART_COMMANDS,
} from "./smart-commands";
