"use client";

// React
import { useRef, useEffect } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { MAX_INPUT_LENGTH } from "@/features/assistant/constants";


interface AssistantInputProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	disabled?: boolean;
	placeholder?: string;
}

/**
 * Chat input field with auto-resize textarea and send button.
 * @param {AssistantInputProps} props Component props
 * @param {string} props.value Current input value
 * @param {(value: string) => void} props.onChange Input change handler
 * @param {(e: React.FormEvent) => void} props.onSubmit Form submit handler
 * @param {boolean} [props.disabled] Whether input is disabled
 * @param {string} [props.placeholder] Placeholder text
 * @returns {JSX.Element} Chat input component
 */

export function AssistantInput({ value, onChange, onSubmit, disabled, placeholder }: AssistantInputProps) {
	// Refs
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Auto-focus on mount
	useEffect(() => {
		if (textareaRef.current && !disabled) {
			textareaRef.current.focus();
		}
	}, [disabled]);

	// Auto-resize textarea
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
		}
	}, [value]);

	/**
	 * Handle keydown events on the textarea
	 * @param e Keyboard event
	 * @returns {void}
	 */

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Submit on Enter (without Shift)
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (value.trim()) {
				onSubmit(e);
			}
		}
	};

	const canSend = value.trim().length > 0 && !disabled;

	// Render
	return (
		<form onSubmit={onSubmit} className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
			<div
				className={cn(
					"flex items-end gap-2 rounded-xl border px-3 py-2 transition-all duration-200",
					"border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50",
					"focus-within:border-primary-400 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30 focus-within:ring-2",
					disabled && "opacity-50",
				)}
			>
				{/* Textarea */}
				<textarea
					ref={textareaRef}
					value={value}
					onChange={(e) => onChange(e.target.value.slice(0, MAX_INPUT_LENGTH))}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					placeholder={placeholder || "Ecrivez votre message..."}
					rows={1}
					className={cn(
						"max-h-[120px] min-h-[36px] flex-1 resize-none bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none",
						"dark:text-gray-200 dark:placeholder-gray-500",
					)}
				/>

				{/* Send button */}
				<button
					type="submit"
					disabled={!canSend}
					className={cn(
						"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
						canSend
							? "bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow"
							: "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500",
					)}
				>
					<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
						/>
					</svg>
				</button>
			</div>

			{/* Hint */}
			<div className="mt-1.5 flex items-center justify-between px-1">
				<span className="text-[10px] text-gray-400">Ctrl+J pour ouvrir · Entree pour envoyer</span>
				{value.length > MAX_INPUT_LENGTH * 0.8 && (
					<span
						className={cn(
							"text-[10px]",
							value.length >= MAX_INPUT_LENGTH ? "text-error-500" : "text-gray-400",
						)}
					>
						{value.length}/{MAX_INPUT_LENGTH}
					</span>
				)}
			</div>
		</form>
	);
}
