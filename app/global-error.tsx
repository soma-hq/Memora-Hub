"use client";

// Components
import { Icon, Button } from "@/components/ui";


/**
 * Global error boundary displayed when an unhandled error occurs at root level.
 * @param props - Component props
 * @param props.error - The caught error object with optional digest
 * @param props.reset - Callback to retry rendering the failed segment
 * @returns A full-page error UI with retry and home actions
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html lang="fr">
			<body className="bg-gray-50 font-sans text-gray-700 antialiased dark:bg-gray-900 dark:text-gray-300">
				<div className="flex min-h-screen flex-col items-center justify-center p-6">
					<div className="max-w-md text-center">
						<div className="mb-6 flex justify-center">
							<div className="bg-error-100 dark:bg-error-900/20 rounded-2xl p-5">
								<Icon name="error" size="xl" className="text-error-500" />
							</div>
						</div>
						<h1 className="mb-3 font-serif text-3xl font-bold text-gray-900 dark:text-white">
							Une erreur est survenue
						</h1>
						<p className="mb-8 text-sm text-gray-400">
							Quelque chose s&apos;est mal passe. Veuillez reessayer ou contacter le support.
						</p>
						<div className="flex items-center justify-center gap-3">
							<Button onClick={reset}>Reessayer</Button>
							<a href="/hub/default">
								<Button variant="outline-neutral">
									<Icon name="home" size="sm" />
									Retour a l&apos;accueil
								</Button>
							</a>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
