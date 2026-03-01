"use client";

// React
import { useState, useRef, useEffect, useCallback } from "react";
import { Icon, Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/store/ui.store";
import type { AlertType, SystemAlert } from "../types";
import type { IconName } from "@/core/design/icons";


/** Demo admin alerts for development */
const ADMIN_ALERTS: SystemAlert[] = [
	{
		id: "adm-001",
		type: "access_denied",
		title: "Detection inhabituelle",
		description: "Tentative de connexion depuis une IP inconnue (185.43.xx.xx) sur le compte de Thomas.",
		timestamp: "2025-02-27T15:45:00Z",
		dismissed: false,
		metadata: { ip: "185.43.xx.xx", compte: "Thomas", tentatives: "3" },
	},
	{
		id: "adm-002",
		type: "access_denied",
		title: "Acces refuse — Zone admin",
		description: "Un utilisateur non-autorise a tente d'acceder au panneau d'administration.",
		timestamp: "2025-02-27T14:20:00Z",
		dismissed: false,
		metadata: { page: "/admin/settings", utilisateur: "Marie" },
	},
	{
		id: "adm-003",
		type: "update",
		title: "Maintenance planifiee",
		description:
			"Une mise a jour du serveur est planifiee ce soir a 23h00. Les services seront indisponibles pendant 15 minutes.",
		timestamp: "2025-02-27T12:00:00Z",
		dismissed: false,
		metadata: { duree: "15 min", heure: "23h00" },
	},
	{
		id: "adm-004",
		type: "access_granted",
		title: "Nouveau moderateur valide",
		description: "Le compte de Lucas a ete approuve en tant que moderateur Discord.",
		timestamp: "2025-02-27T10:30:00Z",
		dismissed: false,
		metadata: { plateforme: "Discord", approuve_par: "Jeremy" },
	},
	{
		id: "adm-005",
		type: "access_denied",
		title: "Rate-limit atteint",
		description:
			"L'API de moderation a atteint sa limite de requetes. Les actions automatiques sont temporairement suspendues.",
		timestamp: "2025-02-26T22:15:00Z",
		dismissed: false,
		metadata: { api: "moderation/v2", limite: "1000/h" },
	},
];

/** Display config for alert types in the panel */
const ALERT_PANEL_CONFIG: Record<AlertType, { color: string; bg: string; icon: IconName }> = {
	update: {
		color: "text-info-600 dark:text-info-400",
		bg: "bg-info-100 dark:bg-info-900/30",
		icon: "news",
	},
	access_denied: {
		color: "text-error-600 dark:text-error-400",
		bg: "bg-error-100 dark:bg-error-900/30",
		icon: "shield",
	},
	access_granted: {
		color: "text-success-600 dark:text-success-400",
		bg: "bg-success-100 dark:bg-success-900/30",
		icon: "check",
	},
};

/**
 * Formats an ISO timestamp to a short relative or absolute French string.
 * @param {string} iso - ISO date string
 * @returns {string} Formatted time string
 */
function formatAlertTime(iso: string): string {
	const date = new Date(iso);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60000);
	const diffH = Math.floor(diffMin / 60);

	if (diffMin < 1) return "A l'instant";
	if (diffMin < 60) return `Il y a ${diffMin}min`;
	if (diffH < 24) return `Il y a ${diffH}h`;
	return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

/**
 * Admin-only alert bell icon with side popup panel.
 * Only visible when admin mode is active. Shows a subtle pulse animation
 * when there are unread alerts to attract attention without being intrusive.
 * @returns {JSX.Element | null} Alert bell or null if not in admin mode
 */
export function AlertBellAdmin() {
	// State
	const adminMode = useUIStore((s) => s.adminMode);
	const [panelOpen, setPanelOpen] = useState(false);
	const [alerts, setAlerts] = useState<SystemAlert[]>([]);
	const panelRef = useRef<HTMLDivElement>(null);

	// Load alerts
	useEffect(() => {
		const dismissed = JSON.parse(localStorage.getItem("memora-admin-dismissed-alerts") || "[]") as string[];
		setAlerts(ADMIN_ALERTS.filter((a) => !dismissed.includes(a.id)));
	}, []);

	// Close on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
				setPanelOpen(false);
			}
		};
		if (panelOpen) document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [panelOpen]);

	/**
	 * Dismisses a single alert and persists dismissal.
	 * @param {string} id - Alert ID to dismiss
	 * @returns {void}
	 */
	const dismissAlert = useCallback((id: string) => {
		setAlerts((prev) => prev.filter((a) => a.id !== id));
		const dismissed = JSON.parse(localStorage.getItem("memora-admin-dismissed-alerts") || "[]") as string[];
		localStorage.setItem("memora-admin-dismissed-alerts", JSON.stringify([...dismissed, id]));
	}, []);

	/**
	 * Dismisses all alerts at once.
	 * @returns {void}
	 */
	const dismissAll = useCallback(() => {
		const allIds = alerts.map((a) => a.id);
		const dismissed = JSON.parse(localStorage.getItem("memora-admin-dismissed-alerts") || "[]") as string[];
		localStorage.setItem("memora-admin-dismissed-alerts", JSON.stringify([...dismissed, ...allIds]));
		setAlerts([]);
	}, [alerts]);

	// Only visible in admin mode
	if (!adminMode) return null;

	const unreadCount = alerts.length;
	const hasUnread = unreadCount > 0;

	// Render
	return (
		<div ref={panelRef} className="relative" data-tutorial="admin-alerts">
			{/* Alert bell button */}
			<button
				onClick={() => setPanelOpen(!panelOpen)}
				className={cn(
					"relative rounded-lg p-2 transition-all duration-200",
					panelOpen
						? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
						: "text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20",
				)}
				title="Alertes admin"
			>
				<Icon name="alert" size="md" />

				{/* Unread badge */}
				{hasUnread && (
					<span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
						{unreadCount}
					</span>
				)}

				{/* Subtle pulse when there are unread alerts */}
				{hasUnread && !panelOpen && (
					<span
						className="absolute inset-0 rounded-lg"
						style={{ animation: "adminAlertPulse 3s ease-in-out infinite" }}
					/>
				)}
			</button>

			{/* Side panel */}
			{panelOpen && (
				<div className="absolute top-full right-0 z-50 mt-2 w-96 animate-[tutorialFadeIn_200ms_ease-out_both] rounded-2xl border border-red-200/50 bg-white shadow-2xl dark:border-red-900/30 dark:bg-gray-800">
					{/* Panel header */}
					<div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
						<div className="flex items-center gap-2">
							<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
								<Icon name="alert" size="sm" className="text-red-500 dark:text-red-400" />
							</div>
							<div>
								<h3 className="text-sm font-bold text-gray-900 dark:text-white">Alertes Admin</h3>
								<p className="text-[10px] text-gray-500 dark:text-gray-400">
									{unreadCount > 0
										? `${unreadCount} alerte${unreadCount > 1 ? "s" : ""} active${unreadCount > 1 ? "s" : ""}`
										: "Aucune alerte"}
								</p>
							</div>
						</div>
						{hasUnread && (
							<button
								onClick={dismissAll}
								className="rounded-md px-2 py-1 text-[10px] font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
							>
								Tout effacer
							</button>
						)}
					</div>

					{/* Alert list */}
					<div className="max-h-96 overflow-y-auto p-2">
						{alerts.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-8">
								<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
									<Icon name="check" size="md" className="text-gray-400 dark:text-gray-500" />
								</div>
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tout est calme</p>
								<p className="text-xs text-gray-400 dark:text-gray-500">Aucune alerte en cours</p>
							</div>
						) : (
							<div className="space-y-1">
								{alerts.map((alert) => {
									const config = ALERT_PANEL_CONFIG[alert.type];
									return (
										<div
											key={alert.id}
											className="group relative rounded-xl border border-gray-100 bg-gray-50 p-3 transition-all duration-200 hover:border-gray-200 hover:bg-white dark:border-gray-700/50 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800"
										>
											<div className="flex items-start gap-2.5">
												{/* Type icon */}
												<div
													className={cn(
														"mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
														config.bg,
													)}
												>
													<Icon name={config.icon} size="xs" className={config.color} />
												</div>

												{/* Content */}
												<div className="min-w-0 flex-1">
													<div className="flex items-center gap-2">
														<h4 className="text-xs font-semibold text-gray-900 dark:text-white">
															{alert.title}
														</h4>
													</div>
													<p className="mt-0.5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
														{alert.description}
													</p>

													{/* Metadata pills */}
													{alert.metadata && (
														<div className="mt-2 flex flex-wrap gap-1">
															{Object.entries(alert.metadata).map(([key, value]) => (
																<span
																	key={key}
																	className="rounded bg-gray-200/60 px-1.5 py-0.5 text-[9px] text-gray-600 dark:bg-gray-700 dark:text-gray-300"
																>
																	<span className="font-bold uppercase">{key}:</span>{" "}
																	{value}
																</span>
															))}
														</div>
													)}

													{/* Timestamp */}
													<p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
														{formatAlertTime(alert.timestamp)}
													</p>
												</div>

												{/* Dismiss button */}
												<button
													onClick={(e) => {
														e.stopPropagation();
														dismissAlert(alert.id);
													}}
													className="shrink-0 rounded-md p-1 text-gray-300 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-500 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-400"
												>
													<Icon name="close" size="xs" />
												</button>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Pulse animation */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes adminAlertPulse {
					0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3); }
					50% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
				}
				@keyframes tutorialFadeIn {
					from { opacity: 0; transform: translateY(8px); }
					to { opacity: 1; transform: translateY(0); }
				}
			`,
				}}
			/>
		</div>
	);
}
