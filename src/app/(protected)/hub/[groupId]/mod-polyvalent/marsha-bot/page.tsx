"use client";

import { useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeaderBanner, Tabs } from "@/components/ui";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/mod-polyvalent/marsha-bot",
	section: "protected",
	module: "moderation_polyvalent",
	description: "Configuration du bot Marsha pour la modération polyvalente.",
	requiredPermissions: [{ module: "moderation_polyvalent", action: "manage" }],
	entityScoped: true,
});

interface CommandItem {
	syntax: string;
	description: string;
}

// Commandes de modération — actions directes (slash commands Discord)
const MODERATION_COMMANDS: CommandItem[] = [
	{ syntax: "/warn <@/ID> [Raison]", description: "Avertir un membre" },
	{ syntax: "/tempmute <@/ID> <Duree> [Raison]", description: "Mute temporaire" },
	{ syntax: "/mute <@/ID> [Raison]", description: "Mute permanent" },
	{ syntax: "/unmute <@/ID> [Raison]", description: "Retirer un mute" },
	{ syntax: "/kick <@/ID> [Raison]", description: "Expulser" },
	{ syntax: "/tempban <@/ID> <Duree> [Raison]", description: "Ban temporaire" },
	{ syntax: "/ban <@/ID> [Raison]", description: "Bannir" },
	{ syntax: "/unban <ID> [Raison]", description: "Retirer un ban" },
	{ syntax: "/clear <N> [@/ID]", description: "Supprimer des messages" },
];

// Commandes utilitaires — consultation et gestion du serveur
const UTILITY_COMMANDS: CommandItem[] = [
	{ syntax: "/userinfo <@/ID>", description: "Infos Discord d'un utilisateur" },
	{ syntax: "/logs [N] [@/ID]", description: "Consulter les logs de modération" },
	{ syntax: "/serverinfo", description: "Infos du serveur" },
	{ syntax: "/roles", description: "Lister les rôles" },
	{ syntax: "/avatar <@/ID>", description: "Afficher l'avatar" },
	{ syntax: "/slowmode <Duree>", description: "Activer le mode lent" },
	{ syntax: "/lock [salon] [Raison]", description: "Verrouiller un salon" },
	{ syntax: "/unlock [salon]", description: "Déverrouiller un salon" },
	{ syntax: "/announce <salon> <Message>", description: "Envoyer une annonce" },
	{ syntax: "/ping", description: "Latence du bot" },
	{ syntax: "/help [commande]", description: "Aide sur les commandes" },
];

const COMMAND_TABS = [
	{ id: "mod", label: "Modération", icon: "shield" as const },
	{ id: "util", label: "Utilitaires", icon: "info" as const },
];

/**
 * Référentiel opérationnel Marsha Bot — Polyvalent (Discord + Twitch).
 * Design identique à Mod. Discord : flush-header + table compacte avec onglets.
 * @returns La page de référence des commandes Marsha pour la modération polyvalente
 */
export default function MarshaBotPolyvalentPage() {
	void PAGE_CONFIG;
	const [activeTab, setActiveTab] = useState<"mod" | "util">("mod");
	const rows = useMemo(() => (activeTab === "mod" ? MODERATION_COMMANDS : UTILITY_COMMANDS), [activeTab]);

	return (
		<PageContainer title="Marsha Bot" description="Référentiel opérationnel des commandes">
			{/* Flush-header card — SectionHeaderBanner collée au contenu (pattern Agenda du Jour) */}
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
				<SectionHeaderBanner
					icon="chat"
					title="Référence opérationnelle"
					description="Commandes staff pour Discord & Twitch"
					accentColor="orange"
					className="rounded-none"
				/>

				<div className="space-y-3 p-3">
					<Tabs
						tabs={COMMAND_TABS}
						activeTab={activeTab}
						onTabChange={(id) => setActiveTab(id as "mod" | "util")}
					/>

					<div className="overflow-x-auto">
						<table className="w-full min-w-[760px] text-sm">
							<thead>
								<tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/60">
									<th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
										Commande
									</th>
									<th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
										Usage
									</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((cmd) => (
									<tr
										key={cmd.syntax}
										className="border-b border-gray-100 last:border-b-0 dark:border-gray-700/70"
									>
										<td className="px-3 py-2.5 font-mono text-xs text-gray-800 dark:text-gray-200">
											{cmd.syntax}
										</td>
										<td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
											{cmd.description}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
