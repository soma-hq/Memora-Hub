"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { buttonVariants, type ButtonVariant, type ButtonSize } from "@/core/design/buttons";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
}

/**
 * Button component.
 * @param {ButtonProps} props - Component props
 * @param {ButtonVariant} [props.variant="primary"] - Visual style variant
 * @param {ButtonSize} [props.size="md"] - Button size
 * @param {boolean} [props.isLoading] - Loading spinner state
 * @param {string} [props.className] - Extra CSS classes
 * @param {React.ReactNode} [props.children] - Button content
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref
 * @returns {JSX.Element} Button element
 */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(buttonVariants({ variant, size }), className)}
				disabled={disabled || isLoading}
				{...props}
			>
				{isLoading && (
					<svg
						className="h-4 w-4 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				)}
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";
