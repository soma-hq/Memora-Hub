"use client";

// React
import { forwardRef, useState } from "react";
import { Icon } from "../display/icon";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	hint?: string;
	icon?: IconName | React.ReactElement;
}

/**
 * Text input with optional label, icon, error/hint messages, and password toggle.
 * @param {InputProps} props - Component props
 * @param {string} [props.label] - Input label text
 * @param {string} [props.error] - Error message displayed below the input
 * @param {string} [props.hint] - Hint text shown when there is no error
 * @param {IconName | React.ReactElement} [props.icon] - Left icon (name string or element)
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref
 * @returns {JSX.Element} Input field component
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, label, error, hint, icon, id, type, ...props }, ref) => {
		// State
		const [showPassword, setShowPassword] = useState(false);

		// Computed
		const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
		const isPassword = type === "password";
		const renderedIcon = icon && typeof icon === "string" ? <Icon name={icon as IconName} size="sm" /> : icon;

		// Render
		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
						{label}
					</label>
				)}

				<div className="relative">
					{icon && (
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
							{renderedIcon}
						</div>
					)}

					<input
						ref={ref}
						id={inputId}
						type={isPassword && showPassword ? "text" : type}
						className={cn(
							"w-full rounded-lg border bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 transition-all duration-200",
							"focus:border-primary-500 focus:ring-primary-100 focus:ring-2 focus:outline-none",
							"dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
							"disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 dark:disabled:bg-gray-900",
							error ? "border-error-500" : "border-gray-300 dark:border-gray-600",
							icon && "pl-10",
							isPassword && "pr-10",
							className,
						)}
						{...props}
					/>

					{isPassword && (
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
						>
							<Icon name={showPassword ? "eyeSlash" : "eye"} size="sm" />
						</button>
					)}
				</div>

				{error && <p className="text-error-600 text-sm">{error}</p>}
				{!error && hint && <p className="text-sm text-gray-400">{hint}</p>}
			</div>
		);
	},
);

Input.displayName = "Input";
