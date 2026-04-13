"use client";

// React
import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	hint?: string;
}

/**
 * Multi-line text input with label, error, and hint support.
 * @param {TextareaProps} props - Component props
 * @param {string} [props.label] - Label text above the textarea
 * @param {string} [props.error] - Error message displayed below
 * @param {string} [props.hint] - Hint text shown when there is no error
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref<HTMLTextAreaElement>} ref - Forwarded ref
 * @returns {JSX.Element} Textarea field component
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, label, error, hint, id, ...props }, ref) => {
		const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label htmlFor={textareaId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					id={textareaId}
					className={cn(
						"min-h-[100px] w-full resize-y rounded-lg border bg-white px-4 py-2.5 text-base text-gray-900 placeholder-gray-500 transition-all duration-200",
						"focus:border-primary-500 focus:ring-primary-100 focus:ring-2 focus:outline-none",
						"dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
						"disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 dark:disabled:bg-gray-900",
						error ? "border-error-500" : "border-gray-300 dark:border-gray-600",
						className,
					)}
					{...props}
				/>
				{error && <p className="text-error-600 text-sm">{error}</p>}
				{!error && hint && <p className="text-sm text-gray-400">{hint}</p>}
			</div>
		);
	},
);

Textarea.displayName = "Textarea";
