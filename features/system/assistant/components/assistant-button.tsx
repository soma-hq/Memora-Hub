"use client";

// Components
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { useAssistantStore } from "@/store/assistant.store";


/**
 * Header button that opens the assistant chatbot modal.
 * Uses softer rose tones instead of vibrant pink.
 * @returns {JSX.Element} Assistant button with unread indicator
 */

export function AssistantButton() {
	const toggle = useAssistantStore((s) => s.toggle);
	const isOpen = useAssistantStore((s) => s.isOpen);
	const hasUnread = useAssistantStore((s) => s.hasUnread);
	const status = useAssistantStore((s) => s.status);

	const isActive = isOpen;
	const isBusy = status === "thinking" || status === "processing";

	return (
		<button
			onClick={toggle}
			title={isOpen ? "Fermer l'assistant (Ctrl+J)" : "Ouvrir l'assistant (Ctrl+J)"}
			className={cn(
				"relative flex items-center justify-center rounded-xl p-2 transition-all duration-200",
				isActive
					? "bg-rose-50 text-rose-300 dark:bg-rose-900/20 dark:text-rose-300"
					: "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
			)}
		>
			<Icon name="bot" size="sm" className={cn("transition-all duration-200", isBusy && "animate-pulse")} />

			{/* Unread indicator */}
			{hasUnread && !isOpen && (
				<span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-300 dark:border-gray-900">
					<span className="absolute h-full w-full animate-ping rounded-full bg-rose-200 opacity-75" />
				</span>
			)}
		</button>
	);
}
