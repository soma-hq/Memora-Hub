"use client";

// Components
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Suggestion } from "@/features/assistant/types";
import type { IconName } from "@/core/design/icons";


interface AssistantSuggestionsProps {
	suggestions: Suggestion[];
	onSuggestionClick: (suggestion: Suggestion) => void;
	compact?: boolean;
}

/**
 * Horizontal scrollable row of suggestion chips.
 * @param {AssistantSuggestionsProps} props Component props
 * @param {Suggestion[]} props.suggestions Array of suggestions to display
 * @param {(suggestion: Suggestion) => void} props.onSuggestionClick Handler for suggestion clicks
 * @param {boolean} [props.compact] Whether to use compact chip style
 * @returns {JSX.Element} Suggestion chips row
 */

export function AssistantSuggestions({ suggestions, onSuggestionClick, compact }: AssistantSuggestionsProps) {
	if (suggestions.length === 0) return null;

	// Render
	return (
		<div className="border-t border-gray-100 px-4 py-2 dark:border-gray-700/50">
			<div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
				{suggestions.map((suggestion) => (
					<button
						key={suggestion.id}
						onClick={() => onSuggestionClick(suggestion)}
						title={suggestion.description}
						className={cn(
							"flex shrink-0 items-center gap-1.5 rounded-full border transition-all duration-200",
							compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs",
							"hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 border-gray-200 bg-white text-gray-600",
							"dark:hover:border-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
						)}
					>
						{suggestion.icon && (
							<Icon name={suggestion.icon as IconName} size="xs" className="opacity-70" />
						)}
						<span className="font-medium whitespace-nowrap">{suggestion.label}</span>
					</button>
				))}
			</div>
		</div>
	);
}
