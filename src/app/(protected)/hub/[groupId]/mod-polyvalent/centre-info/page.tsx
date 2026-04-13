"use client";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeaderBanner } from "@/components/ui";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/mod-polyvalent/centre-info",
	section: "protected",
	module: "moderation_polyvalent",
	description: "Centre d'informations de la modération Polyvalent.",
	requiredPermissions: [{ module: "moderation_polyvalent", action: "view" }],
	entityScoped: true,
});

// Consignes opérationnelles Polyvalent (Discord + Twitch)
const CONSIGNES = [
	{
		title: "Qualifier la plateforme",
		description: "Identifier si l'incident est Discord, Twitch ou cross-plateforme avant de statuer.",
	},
	{
		title: "Alignement des sanctions",
		description: "Assurer une réponse cohérente entre plateformes lorsqu'une infraction est partagée.",
	},
	{
		title: "Trace unifiée",
		description: "Documenter l'action dans un format unique pour faciliter les revues inter-équipes.",
	},
];

/**
 * Centre d'informations Polyvalent — consignes opérationnelles sous forme de boxes.
 * Suit le pattern "flush-header" (SectionHeaderBanner collée à son contenu).
 * @returns La page Centre d'informations Modération Polyvalente (Discord + Twitch)
 */
export default function CentreInfoPolyvalentPage() {
	void PAGE_CONFIG;

	return (
		<PageContainer
			title="Centre d'informations"
			description="Consignes et procédures de modération polyvalente — Twitch & Discord"
		>
			{/* Consignes — flush-header card (pattern identique à Agenda du Jour) */}
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
				<SectionHeaderBanner icon="flag" title="Consignes" className="rounded-none" />

				<div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
					{CONSIGNES.map((consigne) => (
						<div
							key={consigne.title}
							className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
						>
							<p className="text-sm font-semibold text-gray-900 dark:text-white">{consigne.title}</p>
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{consigne.description}</p>
						</div>
					))}
				</div>
			</div>
		</PageContainer>
	);
}
