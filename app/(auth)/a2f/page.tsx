"use client";

// React
import { useState } from "react";
import { useRouter } from "next/navigation";
import { A2FForm } from "@/features/auth";
import { showSuccess, showError, showInfo } from "@/lib/utils/toast";


/**
 * Two-factor authentication page for verifying login with a 6-digit code.
 * @returns The A2F verification page with code input and demo hint
 */
export default function A2FPage() {
	const router = useRouter();

	// State
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Validates the submitted 2FA code and redirects on success.
	 * @param code - The 6-digit verification code
	 * @returns A promise that resolves after verification attempt
	 */
	const handleVerify = async (code: string) => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (code === "123456") {
				showSuccess("Vérification réussie ! Bienvenue sur Memora Hub.");

				// Ensure session cookie is set for middleware
				document.cookie = "memora-session=demo-token; path=/; max-age=604800";

				router.push("/onboarding");
			} else {
				showError("Code A2F invalide. Veuillez reessayer.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Triggers resending a new verification code to the user device.
	 * @returns void
	 */
	const handleResend = () => {
		showInfo("Un nouveau code a ete envoye a votre appareil.");
	};

	// Render
	return (
		<div className="animate-fade-in flex flex-col items-center">
			<A2FForm onSubmit={handleVerify} isLoading={isLoading} onResend={handleResend} />

			{/* Demo hint */}
			<div className="mt-8 w-full max-w-md rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
				<p className="mb-1 text-xs font-medium text-gray-500">Code de demo :</p>
				<p className="font-mono text-sm text-gray-400">123456</p>
			</div>
		</div>
	);
}
