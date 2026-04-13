"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";


interface SelectOption {
	label: string;
	value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	hint?: string;
	icon?: React.ReactNode;
	options: SelectOption[];
	placeholder?: string;
}

/**
 * Native select field.
 * @param {SelectProps} props - Component props
 * @param {string} [props.label] - Label text
 * @param {string} [props.error] - Error message
 * @param {string} [props.hint] - Hint text
 * @param {React.ReactNode} [props.icon] - Left icon element
 * @param {SelectOption[]} props.options - Available option items
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.className] - Extra CSS classes
 * @param {React.Ref<HTMLSelectElement>} ref - Forwarded ref
 * @returns {JSX.Element} Select field component
 */

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ className, label, error, hint, icon, options, placeholder, id, ...props }, ref) => {
		const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label htmlFor={selectId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
						{label}
					</label>
				)}

				<div className="relative">
					{icon && (
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
							{icon}
						</div>
					)}

					<select
						ref={ref}
						id={selectId}
						className={cn(
							"w-full appearance-none rounded-lg border bg-white px-4 py-2 pr-10 text-base text-gray-900 transition-all duration-200",
							"focus:border-primary-500 focus:ring-primary-100 focus:ring-2 focus:outline-none",
							"dark:border-gray-600 dark:bg-gray-800 dark:text-white",
							"disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-900",
							error ? "border-error-500" : "border-gray-300 dark:border-gray-600",
							icon && "pl-10",
							className,
						)}
						{...props}
					>
						{placeholder && (
							<option value="" disabled>
								{placeholder}
							</option>
						)}
						{options.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>

					{/* Chevron */}
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
						<svg
							className="h-4 w-4 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
						</svg>
					</div>
				</div>

				{error && <p className="text-error-600 text-sm">{error}</p>}
				{!error && hint && <p className="text-sm text-gray-400">{hint}</p>}
			</div>
		);
	},
);

Select.displayName = "Select";
