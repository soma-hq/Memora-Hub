"use client";

// React
import { useRef, useEffect } from "react";
import { AssistantMessage } from "./assistant-message";
import type { ChatMessage } from "@/features/assistant/types";


interface AssistantMessageListProps {
	messages: ChatMessage[];
	children?: React.ReactNode;
}

/**
 * Scrollable message list that auto-scrolls and passes consecutive message info.
 * Consecutive bot messages stack without repeating the avatar.
 * @param {AssistantMessageListProps} props Component props
 * @returns {JSX.Element} Scrollable message list
 */

export function AssistantMessageList({ messages, children }: AssistantMessageListProps) {
	const bottomRef = useRef<HTMLDivElement>(null);

	// Auto-scroll on new messages
	useEffect(() => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages.length, children]);

	return (
		<div className="flex h-full flex-col overflow-y-auto px-5 py-4">
			{messages.map((message, index) => {
				// Consecutive bot messages stack (no avatar repeat)
				const prevMessage = index > 0 ? messages[index - 1] : null;
				const isConsecutive = prevMessage?.role === message.role && message.role === "assistant";

				return (
					<div key={message.id} className={isConsecutive ? "mt-0.5" : index > 0 ? "mt-1.5" : ""}>
						<AssistantMessage message={message} isConsecutive={isConsecutive} />
					</div>
				);
			})}

			{/* Typing indicator or other content */}
			{children}

			{/* Scroll anchor */}
			<div ref={bottomRef} />
		</div>
	);
}
