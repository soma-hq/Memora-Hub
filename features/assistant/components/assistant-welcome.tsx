"use client";

// Components
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Suggestion } from "@/features/assistant/types";
import { ASSISTANT_NAME } from "@/features/assistant/constants";


interface AssistantWelcomeProps {
	suggestions: Suggestion[];
	onSuggestionClick: (suggestion: Suggestion) => void;
}

/**
 * Welcome screen shown when the assistant has no conversation history.
 * Friendly, casual tone with just suggestion titles.
 * @param {AssistantWelcomeProps} props Component props
 * @returns {JSX.Element} Welcome screen content
 */

export function AssistantWelcome({ suggestions, onSuggestionClick }: AssistantWelcomeProps) {
	return (
		<div className="flex h-full flex-col overflow-y-auto px-6 py-8">
			{/* Greeting */}
			<div className="mb-8 flex flex-col items-center text-center">
				{/* Bot icon */}
				<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-900/20">
					<Icon name="sparkles" size="lg" className="text-rose-300" />
				</div>

				{/* Greeting text */}
				<h3 className="text-lg font-bold text-gray-900 dark:text-white">
					Salut ! De quoi as-tu besoin aujourd&apos;hui ?
				</h3>
				<p className="mt-1.5 max-w-[320px] text-sm leading-relaxed text-gray-400">
					Je suis l&agrave; pour t&apos;aider au quotidien. Dis-moi ce que tu veux faire, je m&apos;en occupe.
				</p>
			</div>

			{/* Suggestions - just titles in a clean grid */}
			<div className="grid grid-cols-2 gap-2">
				{suggestions.slice(0, 8).map((suggestion) => (
					<button
						key={suggestion.id}
						onClick={() => onSuggestionClick(suggestion)}
						className={cn(
							"group flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition-all duration-200",
							"border-gray-100 bg-gray-50/50 hover:border-rose-200 hover:bg-rose-50/30",
							"dark:border-gray-800 dark:bg-gray-800/30 dark:hover:border-rose-800/50 dark:hover:bg-rose-900/10",
						)}
					>
						{/* Icon */}
						<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 transition-colors duration-200 group-hover:bg-rose-100 dark:bg-rose-900/20 dark:group-hover:bg-rose-900/30">
							<Icon name={(suggestion.icon || "sparkles") as any} size="xs" className="text-rose-300" />
						</div>

						{/* Just the title */}
						<span className="truncate text-[13px] font-medium text-gray-600 group-hover:text-rose-600 dark:text-gray-300 dark:group-hover:text-rose-400">
							{suggestion.label}
						</span>
					</button>
				))}
			</div>

			{/* Keyboard shortcut hint */}
			<div className="mt-auto pt-6 text-center">
				<span className="text-[10px] text-gray-300 dark:text-gray-600">
					<kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:bg-gray-800 dark:text-gray-500">
						Ctrl+J
					</kbd>{" "}
					pour ouvrir · tape{" "}
					<kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:bg-gray-800 dark:text-gray-500">
						/
					</kbd>{" "}
					pour les commandes
				</span>
			</div>
		</div>
	);
}
