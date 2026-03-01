"use client";

// React
import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { themeClasses } from "@/core/design/themes";


interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	children: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeMap = {
	sm: "max-w-md",
	md: "max-w-lg",
	lg: "max-w-2xl",
	xl: "max-w-4xl",
} as const;

/**
 * Overlay modal with escape-to-close and click-outside-to-close.
 * @param {ModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Callback to close the modal
 * @param {string} [props.title] - Modal heading
 * @param {string} [props.description] - Subtitle below the heading
 * @param {React.ReactNode} props.children - Modal body content
 * @param {"sm" | "md" | "lg" | "xl"} [props.size="md"] - Max width of the modal
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element | null} Modal element or null when closed
 */
export function Modal({ isOpen, onClose, title, description, children, size = "md", className }: ModalProps) {
	/**
	 * Closes the modal when Escape is pressed.
	 * @param {KeyboardEvent} e - Keyboard event
	 * @returns {void}
	 */
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		},
		[onClose],
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [isOpen, handleKeyDown]);

	if (!isOpen) return null;

	// Render
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Overlay */}
			<div className={cn(themeClasses.overlay, "animate-fade-in fixed inset-0 z-0")} onClick={onClose} />

			{/* Modal content */}
			<div
				className={cn(
					"animate-scale-in relative z-10 w-full rounded-2xl shadow-xl",
					themeClasses.modal,
					sizeMap[size],
					className,
				)}
			>
				{/* Header */}
				{(title || description) && (
					<div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
						{title && <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>}
						{description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
					</div>
				)}

				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
				>
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				{/* Body */}
				<div className="px-6 py-4">{children}</div>
			</div>
		</div>
	);
}

/**
 * Footer row for modal action buttons.
 * @param {{ children: React.ReactNode; className?: string }} props - Component props
 * @param {React.ReactNode} props.children - Footer content (buttons)
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Modal footer
 */
export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				"flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700",
				className,
			)}
		>
			{children}
		</div>
	);
}
