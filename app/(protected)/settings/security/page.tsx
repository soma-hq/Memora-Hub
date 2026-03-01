"use client";

// React
import { useState } from "react";
import { Button, Input, Card, Badge, Icon } from "@/components/ui";
import { showSuccess } from "@/lib/utils/toast";


/**
 * Security settings page for password management and two-factor authentication.
 * @returns The security settings form
 */
export default function SecurityPage() {
	const [a2fEnabled, setA2fEnabled] = useState(false);

	return (
		<div className="max-w-2xl space-y-6">
			{/* Change password */}
			<Card padding="lg">
				<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Changer le mot de passe</h3>
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						showSuccess("Mot de passe modifié");
					}}
				>
					<Input
						label="Mot de passe actuel"
						type="password"
						placeholder="Votre mot de passe actuel"
						required
					/>
					<Input
						label="Nouveau mot de passe"
						type="password"
						placeholder="Nouveau mot de passe"
						hint="Minimum 8 caractères"
						required
					/>
					<Input
						label="Confirmer le nouveau mot de passe"
						type="password"
						placeholder="Confirmez le mot de passe"
						required
					/>
					<div className="flex justify-end pt-2">
						<Button type="submit">Modifier le mot de passe</Button>
					</div>
				</form>
			</Card>

			{/* A2F */}
			<Card padding="lg">
				<div className="flex items-start justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							Double authentification (A2F)
						</h3>
						<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
							Ajoutez une couche de sécurité supplémentaire à votre compte.
						</p>
					</div>
					<Badge variant={a2fEnabled ? "success" : "neutral"}>{a2fEnabled ? "Activée" : "Désactivée"}</Badge>
				</div>
				<div className="mt-4 flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
					<div className="bg-primary-100 dark:bg-primary-900/20 rounded-lg p-3">
						<Icon name="shield" style="solid" size="lg" className="text-primary-500" />
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
							{a2fEnabled
								? "La double authentification est activée pour votre compte."
								: "Protégez votre compte avec une application d'authentification."}
						</p>
					</div>
					<Button
						variant={a2fEnabled ? "outline-danger" : "primary"}
						size="sm"
						onClick={() => {
							setA2fEnabled(!a2fEnabled);
							showSuccess(a2fEnabled ? "A2F désactivée" : "A2F activée");
						}}
					>
						{a2fEnabled ? "Désactiver" : "Activer"}
					</Button>
				</div>
			</Card>

			{/* Sessions */}
			<Card padding="lg">
				<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Sessions actives</h3>
				<div className="space-y-3">
					{[
						{
							device: "MacBook Pro — Chrome",
							location: "Paris, France",
							current: true,
							lastActive: "Maintenant",
						},
						{
							device: "iPhone 15 — Safari",
							location: "Paris, France",
							current: false,
							lastActive: "Il y a 2h",
						},
					].map((session, idx) => (
						<div
							key={idx}
							className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
						>
							<div>
								<div className="flex items-center gap-2">
									<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
										{session.device}
									</p>
									{session.current && (
										<Badge variant="success" showDot={false}>
											Actuelle
										</Badge>
									)}
								</div>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{session.location} — {session.lastActive}
								</p>
							</div>
							{!session.current && (
								<Button variant="outline-danger" size="sm">
									Déconnecter
								</Button>
							)}
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}
