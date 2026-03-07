"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LoginForm } from "@/features/auth";
import { loginAction } from "@/features/auth/actions";
import { showSuccess, showError } from "@/lib/utils/toast";
import type { LoginFormData } from "@/lib/validators/schemas";
import { definePageConfig } from "@/structures";
import { MISSED_EVENTS_PENDING_KEY } from "@/scripts/onboarding/missed-events-briefing";

const PAGE_CONFIG = definePageConfig({
	name: "login",
	section: "auth",
	description: "Page de connexion à Memora Hub.",
});

void PAGE_CONFIG;

/**
 * Login page with email/password authentication
 * @returns The login page with form and mobile logo
 */
export default function LoginPage() {
	const router = useRouter();

	// State
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Handles login form submission
	 * @param data - The login form data containing email and password
	 * @returns A promise that resolves after authentication attempt
	 */
	const handleLogin = async (data: LoginFormData) => {
		setIsLoading(true);
		try {
			const result = await loginAction(data);

			if (result.success) {
				showSuccess("Connexion réussie ! Redirection...");
				sessionStorage.setItem(MISSED_EVENTS_PENDING_KEY, "true");

				if (result.requireA2F) {
					router.push("/a2f");
				} else {
					router.push("/hub/default");
				}
			} else {
				showError(result.error || "Email ou mot de passe incorrect");
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Render
	return (
		<div className="animate-fade-in flex flex-col items-center">
			{/* Mobile logo */}
			<div className="mb-8 flex items-center gap-3 lg:hidden">
				<Image src="/logos/memora-logo.png" alt="Memora" width={40} height={40} className="rounded-lg" />
				<span className="font-serif text-2xl font-bold text-white">Memora Hub</span>
			</div>

			<LoginForm onSubmit={handleLogin} isLoading={isLoading} />
		</div>
	);
}
