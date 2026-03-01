import type {

	ChatMessage,
	DetectedIntent,
	ActionResult,
	ActiveFlow,
	AssistantContext,
	Suggestion,
	FlowStep,
} from "@/features/assistant/types";
import { THINKING_DELAY_MS, WELCOME_SUGGESTIONS } from "@/features/assistant/constants";
import { detectIntent, requiresFlow } from "@/features/assistant/intent-engine";
import {

	executeAction,
	getFlowForAction,
	initializeFlow,
	getFlowCompletionMessage,
	getFlowCompletionSuggestions,
} from "@/features/assistant/action-engine";
import { getContextualSuggestions, hasPermissionForAction } from "@/features/assistant/context-engine";
import { getFollowUpSuggestions, getAutocompleteSuggestions } from "@/features/assistant/suggestion-engine";
import { isSmartCommand, executeSmartCommand } from "@/features/assistant/smart-commands";


/** Response from the assistant service after processing a message */
export interface AssistantResponse {
	message: ChatMessage;
	suggestions: Suggestion[];
	flow?: ActiveFlow;
	navigateTo?: string;
	sideEffects?: Record<string, unknown>;
}

/** Assistant message processing service */
export class AssistantService {
	/**
	 * Process user message
	 * @param userMessage User message text
	 * @param context App context
	 * @param activeFlow Active flow or null
	 * @returns Assistant response
	 */

	static async processMessage(
		userMessage: string,
		context: AssistantContext,
		activeFlow: ActiveFlow | null,
	): Promise<AssistantResponse> {
		// If there is an active flow, handle the step response
		if (activeFlow) {
			return AssistantService.handleFlowStep(userMessage, activeFlow, context);
		}

		// Handle smart commands (starting with /)
		if (isSmartCommand(userMessage)) {
			const commandResult = executeSmartCommand(userMessage, context);
			if (commandResult) {
				// Handle clear conversation command
				if (commandResult.message === "__CLEAR_CONVERSATION__") {
					return {
						message: {
							id: `msg-${Date.now()}`,
							role: "assistant",
							content: "Conversation effacee. Comment puis-je vous aider ?",
							timestamp: new Date().toISOString(),
						},
						suggestions: getContextualSuggestions(context),
						sideEffects: { clearConversation: true },
					};
				}

				return {
					message: {
						id: `msg-${Date.now()}`,
						role: "assistant",
						content: commandResult.message,
						timestamp: new Date().toISOString(),
						attachment: commandResult.attachment,
					},
					suggestions: commandResult.suggestions || getContextualSuggestions(context),
					navigateTo: commandResult.navigateTo,
					sideEffects: commandResult.sideEffect,
				};
			}
		}

		// Detect intent from user message
		const intent = detectIntent(userMessage);

		// Check if this action requires a multi-step flow
		if (requiresFlow(intent.action)) {
			return AssistantService.startFlow(intent, context);
		}

		// Execute the action directly
		const result = executeAction(intent, context);

		// Build the response message
		const responseMessage: ChatMessage = {
			id: `msg-${Date.now()}`,
			role: "assistant",
			content: result.message,
			timestamp: new Date().toISOString(),
			attachment: result.attachment,
			isError: !result.success,
		};

		// Determine suggestions
		const suggestions = result.followUpSuggestions || getFollowUpSuggestions(intent.category, context);

		return {
			message: responseMessage,
			suggestions,
			navigateTo: result.navigateTo,
			sideEffects: result.data as Record<string, unknown> | undefined,
		};
	}

	/**
	 * Start conversation flow
	 * @param intent Detected intent
	 * @param context App context
	 * @returns First flow step response
	 */

	static async startFlow(intent: DetectedIntent, context: AssistantContext): Promise<AssistantResponse> {
		// Find the flow definition
		const flowDef = getFlowForAction(intent.action);
		if (!flowDef) {
			return {
				message: {
					id: `msg-${Date.now()}`,
					role: "assistant",
					content: "Desole, cette fonctionnalite n'est pas encore disponible.",
					timestamp: new Date().toISOString(),
				},
				suggestions: getContextualSuggestions(context),
			};
		}

		// Initialize the flow with any pre-extracted entities
		const flow = initializeFlow(flowDef, intent.entities);

		// Skip steps that are already filled from entities
		let startIndex = 0;
		for (let i = 0; i < flow.steps.length; i++) {
			const step = flow.steps[i];
			if (flow.collectedData[step.field] && step.field !== "_confirm") {
				startIndex = i + 1;
			} else {
				break;
			}
		}
		flow.currentStepIndex = startIndex;

		// Build the intro message with the first question
		const currentStep = flow.steps[flow.currentStepIndex];
		const prefilledInfo = AssistantService.getPrefilledSummary(flow);

		let content = `${flowDef.description}\n\n`;
		if (prefilledInfo) {
			content += `J'ai deja compris :\n${prefilledInfo}\n\n`;
		}
		content += `**${currentStep.label}**`;

		// Add options if it's a select step
		if (currentStep.type === "select" && currentStep.options) {
			content += "\n\n";
			currentStep.options.forEach((opt, i) => {
				content += `${i + 1}. ${opt.label}\n`;
			});
		}

		// Add confirm buttons info
		if (currentStep.type === "confirm") {
			content += "\n\nRepondez **oui** pour confirmer ou **non** pour annuler.";
		}

		const message: ChatMessage = {
			id: `msg-${Date.now()}`,
			role: "assistant",
			content,
			timestamp: new Date().toISOString(),
		};

		return {
			message,
			suggestions: AssistantService.getFlowStepSuggestions(currentStep),
			flow,
		};
	}

	/**
	 * Handle flow step input
	 * @param userInput User's step response
	 * @param flow Active flow
	 * @param context App context
	 * @returns Next step or completion
	 */

	static async handleFlowStep(
		userInput: string,
		flow: ActiveFlow,
		context: AssistantContext,
	): Promise<AssistantResponse> {
		const currentStep = flow.steps[flow.currentStepIndex];
		if (!currentStep) {
			return AssistantService.completeFlow(flow, context);
		}

		// Handle cancellation
		const cancelWords = ["annuler", "cancel", "stop", "arreter", "non", "quitter"];
		if (currentStep.type === "confirm" && cancelWords.some((w) => userInput.toLowerCase().includes(w))) {
			return {
				message: {
					id: `msg-${Date.now()}`,
					role: "assistant",
					content: "D'accord, l'action a ete annulee. Que puis-je faire d'autre ?",
					timestamp: new Date().toISOString(),
				},
				suggestions: getContextualSuggestions(context),
			};
		}

		// Handle confirm step
		if (currentStep.type === "confirm") {
			const confirmWords = ["oui", "yes", "ok", "confirmer", "valider", "d'accord", "go"];
			if (confirmWords.some((w) => userInput.toLowerCase().includes(w))) {
				return AssistantService.completeFlow(flow, context);
			}
			return {
				message: {
					id: `msg-${Date.now()}`,
					role: "assistant",
					content: "Repondez **oui** pour confirmer ou **non** pour annuler.",
					timestamp: new Date().toISOString(),
				},
				suggestions: [
					{ id: "confirm-yes", label: "Oui, confirmer", icon: "check", query: "oui", category: "help" },
					{ id: "confirm-no", label: "Non, annuler", icon: "close", query: "non", category: "help" },
				],
				flow,
			};
		}

		// Validate input
		let value = userInput.trim();

		// Handle select options (user can type the number or the label)
		if (currentStep.type === "select" && currentStep.options) {
			const numChoice = parseInt(value);
			if (!isNaN(numChoice) && numChoice >= 1 && numChoice <= currentStep.options.length) {
				value = currentStep.options[numChoice - 1].value;
			} else {
				const matchedOption = currentStep.options.find(
					(opt) =>
						opt.label.toLowerCase() === value.toLowerCase() ||
						opt.value.toLowerCase() === value.toLowerCase(),
				);
				if (matchedOption) {
					value = matchedOption.value;
				} else if (currentStep.required) {
					return {
						message: {
							id: `msg-${Date.now()}`,
							role: "assistant",
							content: `Choix invalide. Veuillez choisir parmi :\n${currentStep.options.map((o, i) => `${i + 1}. ${o.label}`).join("\n")}`,
							timestamp: new Date().toISOString(),
						},
						suggestions: AssistantService.getFlowStepSuggestions(currentStep),
						flow,
					};
				}
			}
		}

		// Run validation if present
		if (currentStep.validation && value) {
			const error = currentStep.validation(value);
			if (error) {
				return {
					message: {
						id: `msg-${Date.now()}`,
						role: "assistant",
						content: `${error}. Veuillez reessayer.`,
						timestamp: new Date().toISOString(),
					},
					suggestions: AssistantService.getFlowStepSuggestions(currentStep),
					flow,
				};
			}
		}

		// Skip optional empty fields
		if (!value && !currentStep.required) {
			value = "";
		} else if (!value && currentStep.required) {
			return {
				message: {
					id: `msg-${Date.now()}`,
					role: "assistant",
					content: `Ce champ est requis. ${currentStep.label}`,
					timestamp: new Date().toISOString(),
				},
				suggestions: AssistantService.getFlowStepSuggestions(currentStep),
				flow,
			};
		}

		// Store value and advance
		const updatedData = { ...flow.collectedData, [currentStep.field]: value };
		const nextIndex = flow.currentStepIndex + 1;

		// Check if we're done
		if (nextIndex >= flow.steps.length) {
			const updatedFlow = { ...flow, collectedData: updatedData, currentStepIndex: nextIndex };
			return AssistantService.completeFlow(updatedFlow, context);
		}

		// Move to next step
		const updatedFlow: ActiveFlow = {
			...flow,
			collectedData: updatedData,
			currentStepIndex: nextIndex,
		};

		const nextStep = flow.steps[nextIndex];
		let content = `**${nextStep.label}**`;

		// Add options for select steps
		if (nextStep.type === "select" && nextStep.options) {
			content += "\n\n";
			nextStep.options.forEach((opt, i) => {
				content += `${i + 1}. ${opt.label}\n`;
			});
		}

		// Show confirm summary
		if (nextStep.type === "confirm") {
			const summary = AssistantService.getDataSummary(updatedFlow);
			content = `Voici un recapitulatif :\n\n${summary}\n\n**${nextStep.label}**\n\nRepondez **oui** pour confirmer ou **non** pour annuler.`;
		}

		return {
			message: {
				id: `msg-${Date.now()}`,
				role: "assistant",
				content,
				timestamp: new Date().toISOString(),
			},
			suggestions: AssistantService.getFlowStepSuggestions(nextStep),
			flow: updatedFlow,
		};
	}

	/**
	 * Complete conversation flow
	 * @param flow Completed flow
	 * @param context App context
	 * @returns Final flow response
	 */

	static async completeFlow(flow: ActiveFlow, context: AssistantContext): Promise<AssistantResponse> {
		const completionMessage = getFlowCompletionMessage(flow.action, flow.collectedData);
		const suggestions = getFlowCompletionSuggestions(flow.action, context);

		return {
			message: {
				id: `msg-${Date.now()}`,
				role: "assistant",
				content: completionMessage,
				timestamp: new Date().toISOString(),
			},
			suggestions,
		};
	}

	/**
	 * Get flow step suggestions
	 * @param step Flow step
	 * @returns Step suggestions
	 */

	private static getFlowStepSuggestions(step: FlowStep): Suggestion[] {
		if (step.type === "select" && step.options) {
			return step.options.map((opt, i) => ({
				id: `step-opt-${i}`,
				label: opt.label,
				icon: "check",
				query: opt.value,
				category: "help" as const,
			}));
		}

		if (step.type === "confirm") {
			return [
				{ id: "confirm-yes", label: "Oui, confirmer", icon: "check", query: "oui", category: "help" },
				{ id: "confirm-no", label: "Non, annuler", icon: "close", query: "non", category: "help" },
			];
		}

		if (step.type === "date") {
			const today = new Date();
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);
			const nextWeek = new Date(today);
			nextWeek.setDate(nextWeek.getDate() + 7);

			return [
				{
					id: "date-today",
					label: "Aujourd'hui",
					icon: "calendar",
					query: today.toISOString().split("T")[0],
					category: "help",
				},
				{
					id: "date-tomorrow",
					label: "Demain",
					icon: "calendar",
					query: tomorrow.toISOString().split("T")[0],
					category: "help",
				},
				{
					id: "date-next-week",
					label: "Semaine prochaine",
					icon: "calendar",
					query: nextWeek.toISOString().split("T")[0],
					category: "help",
				},
			];
		}

		// For optional steps
		if (!step.required) {
			return [
				{
					id: "skip-step",
					label: "Passer",
					icon: "chevronRight",
					query: "",
					category: "help",
					description: "Laisser vide",
				},
			];
		}

		return [];
	}

	/**
	 * Get prefilled data summary
	 * @param flow Flow data
	 * @returns Summary string
	 */

	private static getPrefilledSummary(flow: ActiveFlow): string {
		const parts: string[] = [];
		for (const [field, value] of Object.entries(flow.collectedData)) {
			if (!value || field === "_confirm") continue;
			const step = flow.steps.find((s) => s.field === field);
			if (step) {
				const label = step.label.replace(/\?.*$/, "").replace(/^\*\*/, "").replace(/\*\*$/, "");
				parts.push(`- ${label} : **${value}**`);
			}
		}
		return parts.join("\n");
	}

	/**
	 * Get flow data summary
	 * @param flow Flow data
	 * @returns Human-readable summary
	 */

	private static getDataSummary(flow: ActiveFlow): string {
		const parts: string[] = [];
		for (const step of flow.steps) {
			if (step.field === "_confirm") continue;
			const value = flow.collectedData[step.field];
			if (!value) continue;

			// Find the display label for select values
			let displayValue = value;
			if (step.type === "select" && step.options) {
				const option = step.options.find((o) => o.value === value);
				if (option) displayValue = option.label;
			}

			const label = step.label
				.replace(/\?.*$/, "")
				.replace(/\(.*\)$/, "")
				.trim();
			parts.push(`- ${label} : **${displayValue}**`);
		}
		return parts.join("\n");
	}

	/**
	 * Get autocomplete suggestions
	 * @param input Input text
	 * @param context App context
	 * @returns Matching suggestions
	 */

	static getAutocompleteSuggestions(input: string, context: AssistantContext): Suggestion[] {
		return getAutocompleteSuggestions(input, context);
	}

	/**
	 * Simulate thinking delay
	 * @returns Resolved after delay
	 */

	static async simulateThinking(): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, THINKING_DELAY_MS));
	}
}
