"use client";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeaderBanner } from "@/components/ui";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/mod-youtube/centre-info",
	section: "protected",
	module: "moderation_youtube",
	description: "Centre d'informations de la modération YouTube.",
	requiredPermissions: [{ module: "moderation_youtube", action: "view" }],
	entityScoped: true,
});

// Consignes opérationnelles YouTube
const CONSIGNES = [
	{
		title: "Vérification du contexte",
		description: "Croiser l'historique des commentaires et la gravité avant de bloquer un utilisateur.",
	},
	{
		title: "Justification concise",
		description: "Renseigner une raison claire pour chaque action afin de faciliter l'audit interne.",
	},
	{
		title: "Escalade sur cas sensibles",
		description: "Les cas de harcèlement ciblé ou doxxing doivent être remontés au référent sans délai.",
	},
];

/**
 * Centre d'informations YouTube — consignes opérationnelles sous forme de boxes.
 * Suit le pattern "flush-header" (SectionHeaderBanner collée à son contenu).
 * @returns La page Centre d'informations Modération YouTube
 */
export default function CentreInfoYouTubePage() {
	void PAGE_CONFIG;

	return (
		<PageContainer title="Centre d'informations" description="Consignes et procédures de modération YouTube">
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
