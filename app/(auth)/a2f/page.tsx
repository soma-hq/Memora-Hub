"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { A2FForm } from "@/features/auth";
import { verifyA2FAction } from "@/features/auth/actions";
import { showSuccess, showError, showInfo } from "@/lib/utils/toast";
import { definePageConfig } from "@/structures";

const PAGE_CONFIG = definePageConfig({
	name: "a2f",
	section: "auth",
	description: "Vérification à deux facteurs.",
});

/**
 * Two-factor authentication page
 * @returns The A2F verification page
 */
export default function A2FPage() {
	const router = useRouter();

	// State
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Validates the submitted 2FA code and redirects on success
	 * @param code - The 6-digit verification code
	 * @returns A promise that resolves after verification attempt
	 */
	const handleVerify = async (code: string) => {
		setIsLoading(true);
		try {
			const result = await verifyA2FAction(code);

			if (result.success) {
				showSuccess("Vérification réussie ! Bienvenue sur Memora Hub.");
				router.push("/onboarding");
			} else {
				showError(result.error || "Code A2F invalide. Veuillez reessayer.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Triggers resending a new verification code to the user device
	 * @returns void
	 */
	const handleResend = () => {
		showInfo("Un nouveau code à ete envoye à votre appareil.");
	};

	// Render
	return (
		<div className="animate-fade-in flex flex-col items-center">
			<A2FForm onSubmit={handleVerify} isLoading={isLoading} onResend={handleResend} />

			{/* Demo hint — Only visible in development */}
			{process.env.NODE_ENV === "development" && (
				<div className="mt-8 w-full max-w-md rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
					<p className="mb-1 text-xs font-medium text-gray-500">Code de demo :</p>
					<p className="font-mono text-sm text-gray-400">123456</p>
				</div>
			)}
		</div>
	);
}
