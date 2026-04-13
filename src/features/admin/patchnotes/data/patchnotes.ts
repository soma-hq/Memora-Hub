import type { Patchnote } from "../types";


/** Demo patchnotes data ordered by most recent first */
export const PATCHNOTES: Patchnote[] = [
	{
		id: "v1.2.0",
		version: "1.2.0",
		title: "Système de Logs & Alertes",
		date: "2025-02-27",
		summary:
			"Nouvelle page de logs centralisée, système d'alertes intelligent et interface de patchnotes pour suivre les mises à jour.",
		changes: [
			{ type: "added", description: "Page de logs complete avec système de filtrage avancé" },
			{ type: "added", description: "Système d'alertes (mises à jour, accès, autorisations)" },
			{ type: "added", description: "Page Patchnotes avec historique complet des versions" },
			{ type: "added", description: "Notification automatique lors des nouvelles mises à jour" },
			{ type: "improved", description: "Sidebar entièrement redesignée avec meilleure navigation" },
			{ type: "improved", description: "Mode Admin en rouge avec activation double-clic" },
			{ type: "improved", description: "Mode Streamer avec détection automatique de partage d'écran" },
			{ type: "fixed", description: "Animation du mode admin trop agressive (violet -> rouge)" },
		],
		isNew: true,
	},
	{
		id: "v1.1.0",
		version: "1.1.0",
		title: "Projets & Relations",
		date: "2025-02-20",
		summary:
			"Refonte complète du système de projets avec gestion des relations, timeline chronologique et archivage automatique.",
		changes: [
			{ type: "added", description: "Création de projet par modals successifs" },
			{ type: "added", description: "Relations de projet : Tâches, Communications, Contenu, Création, Idées" },
			{ type: "added", description: "Timeline chronologique des modifications de projet" },
			{ type: "added", description: "Archivage automatique après complétion" },
			{ type: "improved", description: "Design des cartes projet complètement revu" },
			{ type: "improved", description: "Panel Livecon/Sanctions adapté et simplifié" },
			{ type: "fixed", description: "Bouton de modification Legacy+ supprime dans les sanctions" },
		],
		isNew: false,
	},
	{
		id: "v1.0.0",
		version: "1.0.0",
		title: "Lancement Memora Hub",
		date: "2025-02-10",
		summary: "Version initiale de Memora Hub avec tableau de bord, gestion d'équipe et moderation.",
		changes: [
			{ type: "added", description: "Tableau de bord principal avec statistiques" },
			{ type: "added", description: "Système de modération Discord, Twitch, YouTube" },
			{ type: "added", description: "Gestion du personnel et absences" },
			{ type: "added", description: "Système de notifications en temps reel" },
			{ type: "added", description: "Chatbot assistant intégré" },
			{ type: "added", description: "Mode streamer et mode admin" },
		],
		isNew: false,
	},
];

/**
 * Returns the latest patchnote entry.
 * @returns {Patchnote} The most recent patchnote
 */
export function getLatestPatchnote(): Patchnote {
	return PATCHNOTES[0];
}

/**
 * Checks whether the user has already seen the latest patchnote.
 * @returns {boolean} True if the latest patchnote has been acknowledged
 */
export function hasSeenLatestPatchnote(): boolean {
	if (typeof window === "undefined") return true;
	const seen = localStorage.getItem("memora-last-seen-patchnote");
	return seen === PATCHNOTES[0].id;
}

/**
 * Marks the latest patchnote as seen by persisting its ID.
 * @returns {void}
 */
export function markPatchnoteSeen(): void {
	localStorage.setItem("memora-last-seen-patchnote", PATCHNOTES[0].id);
}
