"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { AssistantManager } from "@/managers/AssistantManager";
import { useAssistantStore } from "@/store/assistant.store";
import { useUIStore } from "@/store/ui.store";
import type { AssistantContext, ChatMessage, Suggestion } from "./types";


/**
 * Main assistant chatbot hook
 * @returns Assistant state and action handlers
 */

export function useAssistant() {
	// Store state
	const {
		isOpen,
		open,
		close,
		toggle,
		status,
		setStatus,
		messages,
		addMessage,
		clearMessages,
		activeFlow,
		setActiveFlow,
		suggestions,
		setSuggestions,
		context,
		setContext,
		inputValue,
		setInputValue,
		startNewConversation,
		isMinimized,
		setMinimized,
		hasUnread,
		setHasUnread,
	} = useAssistantStore();

	const adminMode = useUIStore((s) => s.adminMode);

	// Manager ref
	const managerRef = useRef<AssistantManager | null>(null);

	// Initialize or update manager
	useEffect(() => {
		const callbacks = {
			addMessage,
			setStatus,
			setActiveFlow,
			setSuggestions,
			setHasUnread,
			isOpen,
		};

		if (!managerRef.current) {
			managerRef.current = new AssistantManager(callbacks, context);
		} else {
			managerRef.current.updateContext(context);
		}
	}, [context, isOpen, addMessage, setStatus, setActiveFlow, setSuggestions, setHasUnread]);

	// Sync active flow with manager
	useEffect(() => {
		if (managerRef.current) {
			managerRef.current.setActiveFlow(activeFlow);
		}
	}, [activeFlow]);

	// Sync admin mode with context
	useEffect(() => {
		setContext({ adminMode });
	}, [adminMode, setContext]);

	/**
	 * Send a message from the user
	 * @param content Message content
	 */

	const sendMessage = useCallback(
		async (content: string) => {
			if (!content.trim() || !managerRef.current) return;

			// Clear input immediately
			setInputValue("");

			// Process through manager
			const response = await managerRef.current.processUserMessage(content);

			// Handle navigation side effects
			if (response?.navigateTo) {
				window.location.href = response.navigateTo;
			}

			// Handle theme change side effects
			if (response?.sideEffects?.theme) {
				const themeEvent = new CustomEvent("assistant-theme-change", {
					detail: { theme: response.sideEffects.theme },
				});
				window.dispatchEvent(themeEvent);
			}

			// Handle admin mode toggle
			if (response?.sideEffects?.adminMode !== undefined) {
				const adminEvent = new CustomEvent("assistant-admin-toggle", {
					detail: { adminMode: response.sideEffects.adminMode },
				});
				window.dispatchEvent(adminEvent);
			}
		},
		[setInputValue],
	);

	/**
	 * Handle suggestion chip click
	 * @param suggestion Clicked suggestion
	 */

	const handleSuggestionClick = useCallback(
		async (suggestion: Suggestion) => {
			if (!managerRef.current) return;

			// Set the query as input briefly for visual feedback
			setInputValue(suggestion.query);

			// Process the suggestion
			await sendMessage(suggestion.query);
		},
		[sendMessage, setInputValue],
	);

	/**
	 * Cancel the current active flow
	 */

	const cancelFlow = useCallback(() => {
		if (managerRef.current) {
			managerRef.current.cancelCurrentFlow();
		}
	}, []);

	/**
	 * Start new conversation
	 */

	const handleNewConversation = useCallback(() => {
		if (managerRef.current) {
			managerRef.current.resetConversation();
		}
		startNewConversation();
	}, [startNewConversation]);

	/**
	 * Handle input form submission
	 * @param e Form event
	 */

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (inputValue.trim()) {
				sendMessage(inputValue);
			}
		},
		[inputValue, sendMessage],
	);

	return {
		// State
		isOpen,
		status,
		messages,
		activeFlow,
		suggestions,
		context,
		inputValue,
		isMinimized,
		hasUnread,

		// Actions
		open,
		close,
		toggle,
		sendMessage,
		handleSubmit,
		handleSuggestionClick,
		cancelFlow,
		clearMessages,
		handleNewConversation,
		setInputValue,
		setContext,
		setMinimized,
	};
}

/**
 * Update assistant context on route change
 * @param pathname Current route pathname
 * @param groupId Active group ID
 * @param groupName Active group name
 */

export function useAssistantContext(pathname: string, groupId?: string, groupName?: string) {
	const setContext = useAssistantStore((s) => s.setContext);

	useEffect(() => {
		setContext({
			currentPage: pathname,
			currentGroupId: groupId,
			currentGroupName: groupName,
			currentUserId: "user-owner",
			currentUserName: "Jeremy Alpha",
			currentUserRole: "Owner",
		});
	}, [pathname, groupId, groupName, setContext]);
}

/**
 * Keyboard shortcuts hook
 */

export function useAssistantKeyboard() {
	const toggle = useAssistantStore((s) => s.toggle);
	const isOpen = useAssistantStore((s) => s.isOpen);
	const cancelFlow = useAssistantStore((s) => s.cancelFlow);
	const activeFlow = useAssistantStore((s) => s.activeFlow);

	useEffect(() => {
		/**
		 * Handle keyboard shortcuts
		 * @param e Keyboard event
		 */

		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl/Cmd + J to toggle assistant
			if ((e.metaKey || e.ctrlKey) && e.key === "j") {
				e.preventDefault();
				toggle();
			}

			// Escape to cancel flow or close
			if (e.key === "Escape" && isOpen) {
				if (activeFlow) {
					cancelFlow();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [toggle, isOpen, cancelFlow, activeFlow]);
}

/**
 * Message stats hook
 * @returns Message statistics
 */

export function useAssistantStats() {
	const messages = useAssistantStore((s) => s.messages);

	return useMemo(() => {
		const userMessages = messages.filter((m) => m.role === "user").length;
		const assistantMessages = messages.filter((m) => m.role === "assistant").length;
		const totalMessages = messages.length;

		return { userMessages, assistantMessages, totalMessages };
	}, [messages]);
}
