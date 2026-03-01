"use client";

// React
import { useEffect, useRef } from "react";
import { AssistantHeader } from "./assistant-header";
import { AssistantMessageList } from "./assistant-message-list";
import { AssistantInput } from "./assistant-input";
import { AssistantSuggestions } from "./assistant-suggestions";
import { AssistantWelcome } from "./assistant-welcome";
import { AssistantTypingIndicator } from "./assistant-typing-indicator";
import { cn } from "@/lib/utils/cn";
import { useAssistant, useAssistantKeyboard } from "@/features/assistant/hooks";


/**
 * Main assistant chatbot modal. Centered on screen, wider format.
 * @returns {JSX.Element | null} The assistant modal or null when closed
 */

export function AssistantModal() {
	// State
	const {
		isOpen,
		close,
		status,
		messages,
		activeFlow,
		suggestions,
		inputValue,
		isMinimized,
		sendMessage,
		handleSubmit,
		handleSuggestionClick,
		cancelFlow,
		handleNewConversation,
		setInputValue,
		setMinimized,
	} = useAssistant();

	// Keyboard shortcuts
	useAssistantKeyboard();

	// Refs
	const modalRef = useRef<HTMLDivElement>(null);

	// Close on click outside
	useEffect(() => {
		if (!isOpen) return;

		/**
		 * Handle clicks outside the modal
		 * @param e Mouse event
		 * @returns {void}
		 */

		const handleClickOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				close();
			}
		};

		// Delay to prevent immediate close from trigger click
		const timer = setTimeout(() => {
			document.addEventListener("mousedown", handleClickOutside);
		}, 100);

		return () => {
			clearTimeout(timer);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, close]);

	if (!isOpen) return null;

	// Check if we only have the welcome message
	const isWelcomeState = messages.length <= 1;
	const isThinking = status === "thinking" || status === "processing";

	// Render
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center pt-6">
			{/* Overlay */}
			<div
				className="animate-fade-in fixed inset-0 bg-black/20 backdrop-blur-[2px] dark:bg-black/40"
				onClick={close}
			/>

			{/* Modal container - centered, wider */}
			<div
				ref={modalRef}
				className={cn(
					"animate-scale-in relative z-10 flex flex-col overflow-hidden rounded-2xl border shadow-2xl",
					"border-gray-200/60 bg-white dark:border-gray-700/50 dark:bg-gray-900",
					isMinimized ? "h-14 w-[600px]" : "h-[680px] w-full max-w-[680px]",
					"transition-all duration-300",
				)}
			>
				{/* Header */}
				<AssistantHeader
					status={status}
					isMinimized={isMinimized}
					activeFlow={activeFlow}
					onClose={close}
					onMinimize={() => setMinimized(!isMinimized)}
					onNewConversation={handleNewConversation}
					onCancelFlow={cancelFlow}
				/>

				{/* Body (hidden when minimized) */}
				{!isMinimized && (
					<>
						{/* Messages or welcome */}
						<div className="flex-1 overflow-hidden">
							{isWelcomeState ? (
								<AssistantWelcome suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />
							) : (
								<AssistantMessageList messages={messages}>
									{isThinking && <AssistantTypingIndicator />}
								</AssistantMessageList>
							)}
						</div>

						{/* Suggestions */}
						{!isWelcomeState && suggestions.length > 0 && !isThinking && (
							<AssistantSuggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />
						)}

						{/* Input */}
						<AssistantInput
							value={inputValue}
							onChange={setInputValue}
							onSubmit={handleSubmit}
							disabled={isThinking}
							placeholder={activeFlow ? "Ta reponse..." : "Dis-moi ce dont tu as besoin..."}
						/>
					</>
				)}
			</div>
		</div>
	);
}
