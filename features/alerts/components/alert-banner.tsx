"use client";

// React
import { useState, useEffect } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { AlertType, SystemAlert } from "../types";
import type { IconName } from "@/core/design/icons";


/** Demo alerts for development */
const DEMO_ALERTS: SystemAlert[] = [
	{
		id: "alert-001",
		type: "update",
		title: "Mise a jour de la page Projets",
		description: "La page Projets a ete mise a jour avec un nouveau systeme de creation par modals successifs.",
		timestamp: "2025-02-27T14:00:00Z",
		dismissed: false,
		metadata: { page: "Projets", version: "1.2.0" },
	},
	{
		id: "alert-002",
		type: "access_denied",
		title: "Acces non autorise",
		description: "Un utilisateur a tente d'acceder a la page Admin sans les permissions requises.",
		timestamp: "2025-02-27T13:30:00Z",
		dismissed: false,
		metadata: { page: "/admin", utilisateur: "Utilisateur inconnu" },
	},
	{
		id: "alert-003",
		type: "access_granted",
		title: "Acces autorise",
		description: "Votre demande d'acces a la page Moderation a ete approuvee.",
		timestamp: "2025-02-27T12:00:00Z",
		dismissed: false,
		metadata: { page: "Moderation", approuve_par: "Jeremy" },
	},
];

/** Display config for each alert type */
const ALERT_CONFIG: Record<AlertType, { label: string; color: string; bg: string; border: string; icon: IconName }> = {
	update: {
		label: "Mise a jour",
		color: "text-info-600 dark:text-info-400",
		bg: "bg-info-50 dark:bg-info-900/10",
		border: "border-info-200 dark:border-info-800/40",
		icon: "news",
	},
	access_denied: {
		label: "Acces refuse",
		color: "text-error-600 dark:text-error-400",
		bg: "bg-error-50 dark:bg-error-900/10",
		border: "border-error-200 dark:border-error-800/40",
		icon: "lock",
	},
	access_granted: {
		label: "Acces autorise",
		color: "text-success-600 dark:text-success-400",
		bg: "bg-success-50 dark:bg-success-900/10",
		border: "border-success-200 dark:border-success-800/40",
		icon: "check",
	},
};

/**
 * Banner component that displays active system alerts at the top of the app.
 * When an update alert is active, it takes visual priority.
 * @returns {JSX.Element | null} Alert banner or null if no active alerts
 */
export function AlertBanner() {
	// State
	const [alerts, setAlerts] = useState<SystemAlert[]>([]);

	useEffect(() => {
		const dismissed = JSON.parse(localStorage.getItem("memora-dismissed-alerts") || "[]") as string[];
		const active = DEMO_ALERTS.filter((a) => !dismissed.includes(a.id));
		setAlerts(active);
	}, []);

	// Handlers

	/**
	 * Dismisses an alert and persists the dismissal.
	 * @param {string} id - Alert ID to dismiss
	 * @returns {void}
	 */
	const dismissAlert = (id: string) => {
		setAlerts((prev) => prev.filter((a) => a.id !== id));
		const dismissed = JSON.parse(localStorage.getItem("memora-dismissed-alerts") || "[]") as string[];
		localStorage.setItem("memora-dismissed-alerts", JSON.stringify([...dismissed, id]));
	};

	if (alerts.length === 0) return null;

	// Find the priority alert (update > access_denied > access_granted)
	const priorityAlert = alerts.find((a) => a.type === "update") || alerts[0];
	const config = ALERT_CONFIG[priorityAlert.type];

	// Render
	return (
		<div className={cn("border-b px-4 py-2.5", config.bg, config.border)}>
			<div className="mx-auto flex max-w-5xl items-center gap-3">
				<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/60 dark:bg-gray-800/60">
					<Icon name={config.icon} size="xs" className={config.color} />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className={cn("text-[10px] font-bold uppercase", config.color)}>{config.label}</span>
						<span className="text-xs font-semibold text-gray-900 dark:text-white">
							{priorityAlert.title}
						</span>
					</div>
					<p className="truncate text-xs text-gray-600 dark:text-gray-400">{priorityAlert.description}</p>
				</div>

				{/* Alert count badge */}
				{alerts.length > 1 && (
					<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-200 px-1 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
						+{alerts.length - 1}
					</span>
				)}

				<button
					onClick={() => dismissAlert(priorityAlert.id)}
					className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/50 hover:text-gray-600 dark:hover:bg-gray-800/50 dark:hover:text-gray-200"
				>
					<Icon name="close" size="xs" />
				</button>
			</div>
		</div>
	);
}
