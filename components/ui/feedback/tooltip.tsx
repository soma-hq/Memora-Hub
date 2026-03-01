"use client";

// React
import { useState } from "react";
import { cn } from "@/lib/utils/cn";


interface TooltipProps {
	content: string;
	children: React.ReactNode;
	position?: "top" | "bottom" | "left" | "right";
	className?: string;
}

const positionMap = {
	top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
	bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
	left: "right-full top-1/2 -translate-y-1/2 mr-2",
	right: "left-full top-1/2 -translate-y-1/2 ml-2",
} as const;

/**
 * Hover-triggered tooltip displaying text near the wrapped element.
 * @param {TooltipProps} props - Component props
 * @param {string} props.content - Tooltip text
 * @param {React.ReactNode} props.children - Element that triggers the tooltip
 * @param {"top" | "bottom" | "left" | "right"} [props.position="top"] - Position relative to children
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Tooltip wrapper
 */
export function Tooltip({ content, children, position = "top", className }: TooltipProps) {
	// State
	const [visible, setVisible] = useState(false);

	// Render
	return (
		<div
			className="relative inline-flex"
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
		>
			{children}
			{visible && (
				<div
					className={cn(
						"animate-fade-in pointer-events-none absolute z-50 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-lg dark:bg-gray-700",
						positionMap[position],
						className,
					)}
				>
					{content}
				</div>
			)}
		</div>
	);
}
