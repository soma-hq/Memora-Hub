// Constants & types
import type {
	AssistantContext,
	ChatMessage,
	Suggestion,
	IntentAction,
	MessageAttachment,
	MessageListItem,
	MessageAttachmentStats,
	MessageStatItem,
} from "./types";
import { getContextualSuggestions } from "./context-engine";
import { detectIntent } from "./intent-engine";

/** Smart command type the user can invoke with / prefix */
export interface SmartCommand {
	command: string;
	aliases: string[];
	description: string;
	category: string;
	execute: (args: string, context: AssistantContext) => SmartCommandResult;
}

/** Result of executing a smart command */
export interface SmartCommandResult {
	message: string;
	attachment?: MessageAttachment;
	suggestions?: Suggestion[];
	navigateTo?: string;
	sideEffect?: Record<string, unknown>;
}

/**
 * Check if input is a smart command (starts with /)
 * @param input User input string
 * @returns True if input begins with a / command
 */

export function isSmartCommand(input: string): boolean {
	return input.trim().startsWith("/");
}

/**
 * Parse a smart command string into command name and arguments
 * @param input Raw user input with / prefix
 * @returns Tuple of [commandName, arguments]
 */

export function parseSmartCommand(input: string): [string, string] {
	const trimmed = input.trim().substring(1);
	const spaceIndex = trimmed.indexOf(" ");
	if (spaceIndex === -1) {
		return [trimmed.toLowerCase(), ""];
	}
	return [trimmed.substring(0, spaceIndex).toLowerCase(), trimmed.substring(spaceIndex + 1).trim()];
}

/** All available smart commands */
export const SMART_COMMANDS: SmartCommand[] = [
	{
		command: "aide",
		aliases: ["help", "h", "?"],
		description: "Afficher la liste des commandes",
		category: "system",
		execute: () => {
			const commandList = SMART_COMMANDS.map((cmd) => `- **/${cmd.command}** — ${cmd.description}`).join("\n");

			return {
				message: `Voici les commandes disponibles :\n\n${commandList}\n\nVous pouvez aussi écrire en langage naturel !`,
			};
		},
	},
	{
		command: "tâche",
		aliases: ["task", "t"],
		description: "Créer une tâche rapidement (/tâche Mon titre)",
		category: "task",
		execute: (args, context) => {
			if (!args) {
				return {
					message: "Usage : **/tâche [titre]**\n\nExemple : `/tâche Corriger le bug de login`",
				};
			}
			return {
				message:
					`Tâche **"${args}"** créée avec succès !\n\n` +
					"- Statut : À faire\n" +
					"- Priorité : Moyenne\n\n" +
					"Vous pouvez la retrouver dans votre liste de tâches.",
				suggestions: [
					{
						id: "sc-view-tasks",
						label: "Voir mes tâches",
						icon: "tasks",
						query: "Montre-moi mes tâches",
						category: "task",
					},
					{
						id: "sc-another-task",
						label: "Créer une autre tâche",
						icon: "plus",
						query: "/tâche ",
						category: "task",
					},
				],
			};
		},
	},
	{
		command: "projet",
		aliases: ["project", "p"],
		description: "Créer un projet rapidement (/projet Mon projet)",
		category: "project",
		execute: (args) => {
			if (!args) {
				return {
					message: "Usage : **/projet [nom]**\n\nExemple : `/projet Refonte du dashboard`",
				};
			}
			return {
				message:
					`Projet **"${args}"** créé avec succès !\n\n` +
					"- Statut : À faire\n\n" +
					"Ajoutez-y des tâches pour commencer.",
				suggestions: [
					{
						id: "sc-view-projects",
						label: "Voir les projets",
						icon: "folder",
						query: "Liste des projets",
						category: "project",
					},
					{
						id: "sc-add-task",
						label: "Ajouter une tâche",
						icon: "plus",
						query: "Créer une tâche",
						category: "task",
					},
				],
			};
		},
	},
	{
		command: "réunion",
		aliases: ["meeting", "meet", "m"],
		description: "Planifier une réunion (/réunion Titre)",
		category: "meeting",
		execute: (args) => {
			if (!args) {
				return {
					message:
						"Usage : **/réunion [titre]**\n\nExemple : `/réunion Standup quotidien`\n\nJe vous guiderai pour les détails.",
				};
			}
			return {
				message: `Lancement de la planification de la réunion **"${args}"**.\n\nÀ quelle date ? (format : AAAA-MM-JJ)`,
			};
		},
	},
	{
		command: "aller",
		aliases: ["go", "nav", "navigate"],
		description: "Naviguer vers une page (/aller projets)",
		category: "navigation",
		execute: (args, context) => {
			if (!args) {
				return {
					message:
						"Usage : **/aller [page]**\n\nPages disponibles : accueil, projets, tâches, réunions, absences, profil, paramètres, statistiques, admin",
				};
			}

			// Reuse intent detection for navigation
			const intent = detectIntent(`emmene-moi vers ${args}`);
			if (intent.action === "navigate_to" && intent.entities.target) {
				return {
					message: `Navigation vers **${args}**...`,
					navigateTo: intent.entities.target,
				};
			}

			return {
				message: `Page **"${args}"** non trouvée. Essayez : accueil, projets, tâches, réunions`,
			};
		},
	},
	{
		command: "chercher",
		aliases: ["search", "find", "s"],
		description: "Rechercher dans l'application (/chercher mot-clé)",
		category: "search",
		execute: (args) => {
			if (!args) {
				return {
					message: "Usage : **/chercher [terme]**\n\nExemple : `/chercher Sophie Martin`",
				};
			}

			return {
				message: `Résultats pour **"${args}"** :`,
				attachment: {
					type: "list",
					title: `Recherche : ${args}`,
					items: [],
					emptyText: "Aucun résultat.",
				},
			};
		},
	},
	{
		command: "conge",
		aliases: ["absence", "leave"],
		description: "Poser un congé (/conge)",
		category: "absence",
		execute: () => {
			return {
				message:
					"Je vais vous guider pour poser votre congé.\n\n**Quel type d'absence ?**\n\n1. Congé payé\n2. RTT\n3. Maladie\n4. Autre",
				suggestions: [
					{ id: "sc-cp", label: "Congé payé", icon: "calendar", query: "Congé payé", category: "absence" },
					{ id: "sc-rtt", label: "RTT", icon: "calendar", query: "RTT", category: "absence" },
					{ id: "sc-maladie", label: "Maladie", icon: "calendar", query: "Maladie", category: "absence" },
				],
			};
		},
	},
	{
		command: "theme",
		aliases: ["dark", "light"],
		description: "Changer le thème (/theme sombre)",
		category: "settings",
		execute: (args) => {
			const themeName = args.toLowerCase();
			if (themeName.includes("sombre") || themeName.includes("dark")) {
				return {
					message: "Thème sombre activé.",
					sideEffect: { theme: "dark" },
				};
			}
			if (themeName.includes("clair") || themeName.includes("light")) {
				return {
					message: "Thème clair activé.",
					sideEffect: { theme: "light" },
				};
			}
			return {
				message: "Usage : **/theme sombre** ou **/theme clair**",
			};
		},
	},
	{
		command: "stats",
		aliases: ["statistiques", "kpi", "indicateurs"],
		description: "Voir les statistiques rapides",
		category: "stats",
		execute: () => {
			return {
				message: "Voici vos indicateurs clés :",
				attachment: {
					type: "stats",
					title: "KPIs",
					stats: [],
				},
			};
		},
	},
	{
		command: "export",
		aliases: ["exporter", "download", "dl"],
		description: "Exporter des données (/export pdf)",
		category: "export",
		execute: (args) => {
			const format = args?.toLowerCase() || "pdf";
			const validFormats = ["pdf", "csv", "excel", "json"];
			if (!validFormats.includes(format)) {
				return {
					message: `Format non supporté. Formats disponibles : ${validFormats.join(", ")}`,
				};
			}
			return {
				message: `Export **${format.toUpperCase()}** lancé. Vous recevrez une notification quand le fichier sera prêt.`,
			};
		},
	},
	{
		command: "notifs",
		aliases: ["notifications", "bell"],
		description: "Voir vos notifications",
		category: "notification",
		execute: () => {
			return {
				message: "Voici vos notifications récentes :",
				attachment: {
					type: "list",
					title: "Notifications",
					items: [],
					emptyText: "Aucune notification.",
				},
				suggestions: [
					{
						id: "sc-mark-read",
						label: "Tout marquer lu",
						icon: "check",
						query: "Marquer toutes les notifications comme lues",
						category: "notification",
					},
				],
			};
		},
	},
	{
		command: "clear",
		aliases: ["cls", "reset", "nouveau"],
		description: "Effacer la conversation et recommencer",
		category: "system",
		execute: () => {
			return {
				message: "__CLEAR_CONVERSATION__",
			};
		},
	},
	{
		command: "equipe",
		aliases: ["team", "membres", "users"],
		description: "Voir les membres de l'équipe",
		category: "user",
		execute: () => {
			return {
				message: "Voici les membres de votre équipe :",
				attachment: {
					type: "list",
					title: "Équipe",
					items: [],
					emptyText: "Aucun membre.",
				},
			};
		},
	},
	{
		command: "recap",
		aliases: ["resume", "summary", "aujourd'hui"],
		description: "Récapitulatif de votre journée",
		category: "stats",
		execute: (_, context) => {
			const hour = new Date().getHours();
			const timeOfDay = hour < 12 ? "ce matin" : hour < 18 ? "cet après-midi" : "ce soir";

			return {
				message:
					`Voici votre récapitulatif pour ${timeOfDay} :\n\n` +
					"Aucune donnée disponible pour le moment.\n\n" +
					"Besoin de détails sur un point spécifique ?",
				suggestions: [
					{
						id: "sc-tasks-detail",
						label: "Détail tâches",
						icon: "tasks",
						query: "Montre-moi mes tâches en cours",
						category: "task",
					},
					{
						id: "sc-meetings-detail",
						label: "Détail réunions",
						icon: "calendar",
						query: "Mes réunions du jour",
						category: "meeting",
					},
					{
						id: "sc-notifs-detail",
						label: "Notifications",
						icon: "bell",
						query: "/notifs",
						category: "notification",
					},
				],
			};
		},
	},
	{
		command: "raccourcis",
		aliases: ["shortcuts", "keys"],
		description: "Voir les raccourcis clavier",
		category: "system",
		execute: () => {
			return {
				message:
					"**Raccourcis clavier :**\n\n" +
					"- **Ctrl+J** — Ouvrir/fermer l'assistant\n" +
					"- **Ctrl+K** — Recherche globale\n" +
					"- **Echap** — Fermer / Annuler le formulaire\n" +
					"- **Entrée** — Envoyer un message\n" +
					"- **Shift+Entree** — Saut de ligne\n\n" +
					"**Commandes rapides :**\n\n" +
					"- **/tâche** — Créer une tâche\n" +
					"- **/projet** — Créer un projet\n" +
					"- **/réunion** — Planifier une réunion\n" +
					"- **/chercher** — Rechercher\n" +
					"- **/stats** — Statistiques\n" +
					"- **/recap** — Récapitulatif du jour\n" +
					"- **/clear** — Nouvelle conversation",
			};
		},
	},
];

/**
 * Find and execute a smart command from user input
 * @param input User input starting with /
 * @param context Current application context
 * @returns Command result or null if command not found
 */

export function executeSmartCommand(input: string, context: AssistantContext): SmartCommandResult | null {
	const [commandName, args] = parseSmartCommand(input);

	// Find matching command
	const command = SMART_COMMANDS.find((cmd) => cmd.command === commandName || cmd.aliases.includes(commandName));

	if (!command) {
		return {
			message: `Commande **/${commandName}** non reconnue.\n\nTapez **/aide** pour voir les commandes disponibles.`,
			suggestions: [
				{
					id: "sc-help",
					label: "Voir les commandes",
					icon: "info",
					query: "/aide",
					category: "help",
				},
			],
		};
	}

	return command.execute(args, context);
}

/**
 * Get autocomplete suggestions for smart commands as the user types
 * @param partial Partial command input (including /)
 * @returns Matching commands for autocomplete
 */

export function getCommandAutocompleteSuggestions(partial: string): Suggestion[] {
	const search = partial.substring(1).toLowerCase();

	return SMART_COMMANDS.filter(
		(cmd) => cmd.command.startsWith(search) || cmd.aliases.some((a) => a.startsWith(search)),
	)
		.slice(0, 6)
		.map((cmd) => ({
			id: `cmd-${cmd.command}`,
			label: `/${cmd.command}`,
			icon: "sparkles",
			description: cmd.description,
			query: `/${cmd.command} `,
			category: "help" as const,
		}));
}

/**
 * Get all command suggestions for display
 * @returns All available commands as suggestions
 */

export function getAllCommandSuggestions(): Suggestion[] {
	return SMART_COMMANDS.map((cmd) => ({
		id: `cmd-${cmd.command}`,
		label: `/${cmd.command}`,
		icon: "sparkles",
		description: cmd.description,
		query: `/${cmd.command} `,
		category: cmd.category as any,
	}));
}
