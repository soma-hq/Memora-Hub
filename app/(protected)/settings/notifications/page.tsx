"use client";

// React
import { useState } from "react";
import { Card, Button, Icon } from "@/components/ui";
import { showSuccess } from "@/lib/utils/toast";


interface NotifSetting {
	label: string;
	description: string;
	email: boolean;
	push: boolean;
}

const defaultSettings: NotifSetting[] = [
	{ label: "Nouvelles tâches", description: "Quand une tâche vous est assignée", email: true, push: true },
	{
		label: "Mises à jour de projets",
		description: "Quand un projet auquel vous participez est modifié",
		email: true,
		push: false,
	},
	{ label: "Réunions", description: "Rappels et invitations de réunions", email: true, push: true },
	{ label: "Absences", description: "Demandes et approbations d'absences", email: false, push: true },
	{ label: "Mentions", description: "Quand vous êtes mentionné dans un commentaire", email: true, push: true },
	{ label: "Rapports", description: "Rapports hebdomadaires et mensuels", email: true, push: false },
];

/**
 * Notification settings page for configuring email and push preferences.
 * @returns The notification preferences form
 */
export default function NotificationsSettingsPage() {
	const [settings, setSettings] = useState(defaultSettings);

	const toggleSetting = (index: number, type: "email" | "push") => {
		const updated = [...settings];
		updated[index] = { ...updated[index], [type]: !updated[index][type] };
		setSettings(updated);
	};

	return (
		<div className="max-w-2xl space-y-6">
			<Card padding="lg">
				<h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
					Préférences de notifications
				</h3>
				<p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
					Choisissez comment vous souhaitez être notifié.
				</p>

				{/* Header */}
				<div className="mb-4 grid grid-cols-[1fr_80px_80px] gap-4">
					<div />
					<span className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">Email</span>
					<span className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">Push</span>
				</div>

				{/* Rows */}
				<div className="space-y-1">
					{settings.map((setting, idx) => (
						<div
							key={setting.label}
							className="grid grid-cols-[1fr_80px_80px] items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
						>
							<div>
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300">{setting.label}</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
							</div>
							<div className="flex justify-center">
								<button
									onClick={() => toggleSetting(idx, "email")}
									className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
										setting.email ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"
									}`}
								>
									<span
										className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
											setting.email ? "translate-x-5" : "translate-x-0"
										}`}
									/>
								</button>
							</div>
							<div className="flex justify-center">
								<button
									onClick={() => toggleSetting(idx, "push")}
									className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
										setting.push ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"
									}`}
								>
									<span
										className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
											setting.push ? "translate-x-5" : "translate-x-0"
										}`}
									/>
								</button>
							</div>
						</div>
					))}
				</div>
			</Card>

			<div className="flex justify-end">
				<Button onClick={() => showSuccess("Préférences de notifications enregistrées")}>Enregistrer</Button>
			</div>
		</div>
	);
}
