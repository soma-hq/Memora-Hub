"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";


interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	label?: string;
	description?: string;
}

/**
 * Checkbox input.
 * @param {CheckboxProps} props - Component props
 * @param {string} [props.label] - Label text
 * @param {string} [props.description] - Helper text
 * @param {string} [props.className] - Extra CSS classes
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref
 * @returns {JSX.Element} Checkbox with label
 */

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, label, description, id, ...props }, ref) => {
		const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className="flex items-start gap-3">
				<input
					ref={ref}
					id={checkboxId}
					type="checkbox"
					className={cn(
						"text-primary-500 mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 transition-all duration-200",
						"focus:ring-primary-100 focus:ring-2 focus:ring-offset-0",
						"dark:border-gray-600 dark:bg-gray-800",
						"disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					{...props}
				/>
				{(label || description) && (
					<div className="flex flex-col">
						{label && (
							<label
								htmlFor={checkboxId}
								className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								{label}
							</label>
						)}
						{description && <span className="text-sm text-gray-400">{description}</span>}
					</div>
				)}
			</div>
		);
	},
);

Checkbox.displayName = "Checkbox";
