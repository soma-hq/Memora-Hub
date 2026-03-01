"use client";

// Components
import { Icon } from "@/components/ui";
import { AssistantActionCard } from "./assistant-action-card";
import { cn } from "@/lib/utils/cn";
import type { ChatMessage } from "@/features/assistant/types";


interface AssistantMessageProps {
	message: ChatMessage;
	isConsecutive?: boolean;
}

/**
 * Render markdown-like bold text in a string
 * @param text Text that may contain **bold** markers
 * @returns Array of React nodes with bold spans
 */

function renderFormattedText(text: string): React.ReactNode[] {
	const parts = text.split(/(\*\*[^*]+\*\*)/g);
	return parts.map((part, i) => {
		if (part.startsWith("**") && part.endsWith("**")) {
			return (
				<strong key={i} className="font-semibold text-gray-900 dark:text-white">
					{part.slice(2, -2)}
				</strong>
			);
		}
		return <span key={i}>{part}</span>;
	});
}

/**
 * Render full message content with line breaks and formatting
 * @param content Message content string
 * @returns Formatted JSX nodes
 */

function renderContent(content: string): React.ReactNode {
	const lines = content.split("\n");
	return lines.map((line, i) => {
		if (line.trim() === "") {
			return <div key={i} className="h-1.5" />;
		}

		if (line.trim().startsWith("- ")) {
			return (
				<div key={i} className="flex items-start gap-1.5 pl-0.5">
					<span className="mt-1 text-[8px] text-rose-200">●</span>
					<span>{renderFormattedText(line.trim().substring(2))}</span>
				</div>
			);
		}

		const numberedMatch = line.trim().match(/^(\d+)\.\s(.+)/);
		if (numberedMatch) {
			return (
				<div key={i} className="flex items-start gap-1.5 pl-0.5">
					<span className="text-[11px] font-medium text-rose-400">{numberedMatch[1]}.</span>
					<span>{renderFormattedText(numberedMatch[2])}</span>
				</div>
			);
		}

		return <div key={i}>{renderFormattedText(line)}</div>;
	});
}

/**
 * Single chat message bubble. Consecutive bot messages stack (no avatar repeat).
 * Hour is displayed UNDER the bubble, not inside.
 * @param {AssistantMessageProps} props Component props
 * @returns {JSX.Element} Message bubble
 */

export function AssistantMessage({ message, isConsecutive }: AssistantMessageProps) {
	const isUser = message.role === "user";
	const isError = message.isError;

	return (
		<div
			className={cn(
				"flex gap-2.5",
				isUser ? "flex-row-reverse" : "flex-row",
				isConsecutive && !isUser && "pl-[38px]",
			)}
		>
			{/* Avatar - only for first bot message in a group */}
			{!isUser && !isConsecutive && (
				<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
					<Icon name="sparkles" size="xs" className="text-rose-400" />
				</div>
			)}

			{/* Bubble + timestamp underneath */}
			<div className={cn("flex max-w-[80%] flex-col", isUser && "items-end")}>
				{/* Bubble */}
				<div
					className={cn(
						"rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
						isUser && "rounded-br-md bg-rose-300 text-white",
						!isUser &&
							!isError &&
							"rounded-bl-md border border-gray-100 bg-gray-50/80 text-gray-600 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-300",
						isError &&
							"rounded-bl-md border border-red-100 bg-red-50/80 text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-400",
						isConsecutive && !isUser && "rounded-tl-md",
					)}
				>
					<div className="space-y-0.5">{renderContent(message.content)}</div>

					{/* Attachment */}
					{message.attachment && (
						<div className="mt-2.5">
							<AssistantActionCard attachment={message.attachment} />
						</div>
					)}
				</div>

				{/* Timestamp - UNDER the bubble */}
				<span
					className={cn(
						"mt-1 text-[10px] text-gray-300 dark:text-gray-600",
						isUser && "pr-1 text-right",
						!isUser && "pl-1",
					)}
				>
					{new Date(message.timestamp).toLocaleTimeString("fr-FR", {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>
			</div>
		</div>
	);
}
