"use client";

// React
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";


interface PopoverProps {
	trigger: React.ReactNode;
	children: React.ReactNode;
	align?: "bottom" | "top";
	className?: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

/**
 * Click-triggered popover with outside-click and Escape key dismissal.
 * @param {PopoverProps} props - Component props
 * @param {React.ReactNode} props.trigger - Element that toggles the popover
 * @param {React.ReactNode} props.children - Popover panel content
 * @param {"bottom" | "top"} [props.align="bottom"] - Vertical alignment relative to the trigger
 * @param {string} [props.className] - Additional CSS classes for the panel
 * @param {boolean} [props.open] - Controlled open state
 * @param {(open: boolean) => void} [props.onOpenChange] - Callback when open state changes
 * @returns {JSX.Element} Popover with trigger and dropdown panel
 */
export function Popover({ trigger, children, align = "bottom", className, open, onOpenChange }: PopoverProps) {
	// State
	const [internalOpen, setInternalOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Computed
	const isOpen = open !== undefined ? open : internalOpen;

	/**
	 * Updates the open state via controlled or internal mode.
	 * @param {boolean} value - New open state
	 * @returns {void}
	 */
	const setOpen = useCallback(
		(value: boolean) => {
			if (open !== undefined) {
				onOpenChange?.(value);
			} else {
				setInternalOpen(value);
			}
		},
		[open, onOpenChange],
	);

	// Close on click outside or Escape
	useEffect(() => {
		if (!isOpen) return;

		/**
		 * Closes popover when clicking outside the container.
		 * @param {MouseEvent} e - Mouse event
		 * @returns {void}
		 */
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};

		/**
		 * Closes popover on Escape key.
		 * @param {KeyboardEvent} e - Keyboard event
		 * @returns {void}
		 */
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, setOpen]);

	// Render
	return (
		<div ref={containerRef} className="relative">
			<div onClick={() => setOpen(!isOpen)} className="cursor-pointer">
				{trigger}
			</div>
			{isOpen && (
				<div
					className={cn(
						"absolute right-0 z-50 min-w-[220px] rounded-xl border border-gray-200 bg-white p-3 shadow-lg",
						"animate-scale-in",
						"dark:border-gray-700 dark:bg-gray-800",
						align === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
						className,
					)}
				>
					{children}
				</div>
			)}
		</div>
	);
}
