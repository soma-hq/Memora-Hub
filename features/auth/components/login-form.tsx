"use client";

// External libraries
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Icon } from "@/components/ui";
import { loginSchema } from "@/lib/validators/schemas";
import type { LoginFormData } from "@/lib/validators/schemas";


/** Props for the LoginForm component */
interface LoginFormProps {
	onSubmit: (data: LoginFormData) => void | Promise<void>;
	isLoading?: boolean;
}

/**
 * Login form with email, password, and remember me fields
 * @param props - Component props
 * @param props.onSubmit - Callback triggered on valid form submission
 * @param props.isLoading - Whether the form is in a loading state
 * @returns Login form with demo credentials helper
 */
export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
	// State
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	// Handlers
	/**
	 * Fills the form with demo credentials
	 * @returns Nothing
	 */
	const fillDemoCredentials = () => {
		setValue("email", "admin@memora.hub");
		setValue("password", "demo1234");
	};

	// Render
	return (
		<div className="w-full max-w-md">
			<div className="mb-8 text-center">
				<h1 className="text-2xl font-bold text-white">Connexion a Memora Hub</h1>
				<p className="mt-2 text-sm text-gray-400">Entrez vos identifiants pour acceder a votre espace.</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<div>
					<label className="mb-1.5 block text-sm font-medium text-gray-300">Adresse email</label>
					<div className="relative">
						<div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
							<Icon name="mail" size="sm" className="text-gray-500" />
						</div>
						<input
							type="email"
							placeholder="admin@memora.hub"
							className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-700 bg-gray-800 py-2.5 pr-4 pl-10 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:outline-none"
							{...register("email")}
						/>
					</div>
					{errors.email && <p className="text-error-500 mt-1 text-xs">{errors.email.message}</p>}
				</div>

				<div>
					<label className="mb-1.5 block text-sm font-medium text-gray-300">Mot de passe</label>
					<div className="relative">
						<div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
							<Icon name="lock" size="sm" className="text-gray-500" />
						</div>
						<input
							type="password"
							placeholder="Votre mot de passe"
							className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-700 bg-gray-800 py-2.5 pr-4 pl-10 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:outline-none"
							{...register("password")}
						/>
					</div>
					{errors.password && <p className="text-error-500 mt-1 text-xs">{errors.password.message}</p>}
				</div>

				<div className="flex items-center justify-between">
					<label className="flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							className="text-primary-500 focus:ring-primary-500/20 h-4 w-4 rounded border-gray-600 bg-gray-800"
							{...register("rememberMe")}
						/>
						<span className="text-sm text-gray-400">Se souvenir de moi</span>
					</label>
					<button type="button" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
						Mot de passe oublie ?
					</button>
				</div>

				<Button type="submit" isLoading={isLoading} className="w-full">
					Se connecter
				</Button>
			</form>

			<div className="border-primary-800/30 bg-primary-900/10 mt-6 rounded-xl border p-4">
				<div className="flex items-start gap-3">
					<Icon name="info" size="sm" className="text-primary-400 mt-0.5 shrink-0" />
					<div className="flex-1">
						<p className="text-xs font-medium text-gray-300">Identifiants demo</p>
						<p className="mt-1 font-mono text-xs text-gray-400">admin@memora.hub / demo1234</p>
						<button
							type="button"
							onClick={fillDemoCredentials}
							className="text-primary-400 hover:text-primary-300 mt-2 text-xs font-medium underline"
						>
							Remplir automatiquement
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
