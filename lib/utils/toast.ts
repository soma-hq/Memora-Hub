// External libraries
import React from "react";
import toast from "react-hot-toast";
import { ToastItem } from "@/components/providers/toast-provider";
import { useActivityStore } from "@/store/activity.store";
import type { ToastVariant } from "@/components/providers/toast-provider";
import type { ActivityLevel } from "@/store/activity.store";


const variantToLevel: Record<ToastVariant, ActivityLevel> = {
	success: "success",
	error: "error",
	warning: "warning",
	info: "info",
};

/**
 * Displays a toast notification and logs it to the activity store
 * @param message - Toast message to display
 * @param variant - Visual variant of the toast
 * @param duration - Display duration in milliseconds
 * @param source - Optional source identifier for activity logging
 * @returns void
 */
function show(message: string, variant: ToastVariant, duration: number, source?: string) {
	toast.custom((t) => React.createElement(ToastItem, { id: t.id, message, variant, visible: t.visible }), {
		duration,
		position: "top-right",
	});

	// Log notification to activity store
	try {
		useActivityStore.getState().addEntry({
			level: variantToLevel[variant],
			message,
			source,
		});
	} catch {
		// Store may not be initialized during SSR
	}
}

/**
 * Displays a success toast notification
 * @param message - Success message to display
 * @param source - Optional source identifier for activity logging
 * @returns void
 */
export function showSuccess(message: string, source?: string) {
	show(message, "success", 4000, source);
}

/**
 * Displays an error toast notification
 * @param message - Error message to display
 * @param source - Optional source identifier for activity logging
 * @returns void
 */
export function showError(message: string, source?: string) {
	show(message, "error", 5000, source);
}

/**
 * Displays a warning toast notification
 * @param message - Warning message to display
 * @param source - Optional source identifier for activity logging
 * @returns void
 */
export function showWarning(message: string, source?: string) {
	show(message, "warning", 4000, source);
}

/**
 * Displays an info toast notification
 * @param message - Info message to display
 * @param source - Optional source identifier for activity logging
 * @returns void
 */
export function showInfo(message: string, source?: string) {
	show(message, "info", 3000, source);
}
