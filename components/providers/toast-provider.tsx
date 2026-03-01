"use client";

// External libraries
import { Toaster, toast } from "react-hot-toast";
import {

	CheckCircleIcon,
	ExclamationTriangleIcon,
	ExclamationCircleIcon,
	InformationCircleIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";

export type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastConfig {
	Icon: React.ComponentType<{ className?: string }>;
	borderClass: string;
	bgClass: string;
	iconClass: string;
	bigIconClass: string;
}

const TOAST_CONFIG: Record<ToastVariant, ToastConfig> = {
	success: {
		Icon: CheckCircleIcon,
		borderClass: "border-l-[#22c55e]",
		bgClass: "bg-[#f0fdf4]/95 dark:bg-[#052e16]/90",
		iconClass: "text-[#16a34a] dark:text-[#4ade80]",
		bigIconClass: "text-[#22c55e]",
	},
	error: {
		Icon: ExclamationCircleIcon,
		borderClass: "border-l-[#ef4444]",
		bgClass: "bg-[#fef2f2]/95 dark:bg-[#450a0a]/90",
		iconClass: "text-[#dc2626] dark:text-[#f87171]",
		bigIconClass: "text-[#ef4444]",
	},
	warning: {
		Icon: ExclamationTriangleIcon,
		borderClass: "border-l-[#f59e0b]",
		bgClass: "bg-[#fffbeb]/95 dark:bg-[#451a03]/90",
		iconClass: "text-[#d97706] dark:text-[#fbbf24]",
		bigIconClass: "text-[#f59e0b]",
	},
	info: {
		Icon: InformationCircleIcon,
		borderClass: "border-l-[#3b82f6]",
		bgClass: "bg-[#eff6ff]/95 dark:bg-[#172554]/90",
		iconClass: "text-[#2563eb] dark:text-[#60a5fa]",
		bigIconClass: "text-[#3b82f6]",
	},
};

export interface ToastItemProps {
	id: string;
	message: string;
	variant: ToastVariant;
	visible: boolean;
}

/**
 * Individual toast notification with icon, message, and close button.
 * @param {ToastItemProps} props - Component props
 * @param {string} props.id - Unique toast ID for dismiss
 * @param {string} props.message - Toast message text
 * @param {ToastVariant} props.variant - Visual severity
 * @param {boolean} props.visible - Whether the toast is entering or leaving
 * @returns {JSX.Element} Toast notification card
 */
export function ToastItem({ id, message, variant, visible }: ToastItemProps) {
	const cfg = TOAST_CONFIG[variant];
	const { Icon } = cfg;

	return (
		<div
			className={[
				"relative flex max-w-sm min-w-[300px] items-center gap-3 overflow-hidden rounded-xl border-l-4 px-4 py-3.5 pr-9",
				"shadow-lg backdrop-blur-sm",
				"ring-1 ring-black/[0.06] dark:ring-white/[0.06]",
				cfg.borderClass,
				cfg.bgClass,
				visible ? "animate-enter" : "animate-leave",
			].join(" ")}
		>
			<Icon className={`h-5 w-5 shrink-0 ${cfg.iconClass}`} />

			<p className="flex-1 text-sm leading-snug font-medium text-gray-800 dark:text-gray-100">{message}</p>

			<button
				onClick={() => toast.dismiss(id)}
				className="absolute top-2 right-2 rounded-lg p-0.5 text-gray-400 transition-colors hover:bg-black/[0.06] hover:text-gray-700 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-200"
				aria-label="Fermer"
			>
				<XMarkIcon className="h-3.5 w-3.5" />
			</button>

			<Icon
				className={`pointer-events-none absolute -top-3 -right-2 h-16 w-16 opacity-[0.10] ${cfg.bigIconClass}`}
				aria-hidden
			/>
		</div>
	);
}

/**
 * Global toast container positioned at top-right.
 * @returns {JSX.Element} react-hot-toast Toaster instance
 */
export function ToastProvider() {
	return <Toaster position="top-right" gutter={8} containerStyle={{ top: 72 }} />;
}
