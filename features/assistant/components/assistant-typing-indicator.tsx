"use client";

// Utils & hooks
import { cn } from "@/lib/utils/cn";


/**
 * Animated typing indicator showing Memora AI is writing.
 * Uses softer rose tones and a "writing" label with bouncing dots.
 * @returns {JSX.Element} Typing indicator
 */

export function AssistantTypingIndicator() {
	return (
		<div className="flex items-center gap-2.5">
			{/* Bot avatar */}
			<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
				<svg className="h-3.5 w-3.5 text-rose-300" fill="currentColor" viewBox="0 0 24 24">
					<path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
				</svg>
			</div>

			{/* Writing bubble */}
			<div className="rounded-2xl rounded-bl-md border border-gray-100 bg-gray-50/80 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-800/40">
				<div className="flex items-center gap-2">
					<span className="text-[11px] text-gray-400">Memora AI &eacute;crit</span>
					<div className="flex items-center gap-0.5">
						<span
							className={cn("h-1.5 w-1.5 rounded-full bg-rose-200", "animate-bounce")}
							style={{ animationDelay: "0ms", animationDuration: "1.2s" }}
						/>
						<span
							className={cn("h-1.5 w-1.5 rounded-full bg-rose-200", "animate-bounce")}
							style={{ animationDelay: "200ms", animationDuration: "1.2s" }}
						/>
						<span
							className={cn("h-1.5 w-1.5 rounded-full bg-rose-200", "animate-bounce")}
							style={{ animationDelay: "400ms", animationDuration: "1.2s" }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
