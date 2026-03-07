"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui";

/**
 * Error boundary for admin pages.
 * Displays a user-friendly error message with a retry button.
 */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error("[Admin Error]", error);
	}, [error]);

	return (
		<div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
			<div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
				<Icon name="warning" size="lg" className="text-red-500" />
			</div>
			<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Erreur administration</h2>
			<p className="max-w-md text-center text-sm text-gray-500 dark:text-gray-400">
				Le chargement de la page admin a echoue. Veuillez reessayer.
			</p>
			<button
				onClick={reset}
				className="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
			>
				Reessayer
			</button>
		</div>
	);
}
