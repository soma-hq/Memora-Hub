"use client";

// React
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LoginForm } from "@/features/auth";
import { showSuccess, showError } from "@/lib/utils/toast";
import type { LoginFormData } from "@/lib/validators/schemas";


/**
 * Login page with email/password authentication and demo credentials.
 * @returns The login page with form and mobile logo
 */
export default function LoginPage() {
	const router = useRouter();

	// State
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Handles login form submission with demo credential validation.
	 * @param data - The login form data containing email and password
	 * @returns A promise that resolves after authentication attempt
	 */
	const handleLogin = async (data: LoginFormData) => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));

			if (data.email === "admin@memora.hub" && data.password === "demo1234") {
				showSuccess("Connexion réussie ! Redirection...");

				// Set session cookie for middleware
				document.cookie = "memora-session=demo-token; path=/; max-age=604800";

				router.push("/a2f");
			} else {
				showError("Email ou mot de passe incorrect");
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
				<Image src="/logos/memora.png" alt="Memora" width={40} height={40} className="rounded-lg" />
				<span className="font-serif text-2xl font-bold text-white">Memora Hub</span>
			</div>

			<LoginForm onSubmit={handleLogin} isLoading={isLoading} />
		</div>
	);
}
