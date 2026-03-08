"use client";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeaderBanner } from "@/components/ui";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/moderation/centre-info",
	section: "protected",
	module: "moderation_discord",
	description: "Centre d'informations de la modération Discord.",
	requiredPermissions: [{ module: "moderation_discord", action: "view" }],
	entityScoped: true,
});

// Consignes opérationnelles Discord
const CONSIGNES = [
	{
		title: "Prise de contexte",
		description: "Vérifier l'historique, l'impact et le canal avant de statuer sur une sanction.",
	},
	{
		title: "Trace obligatoire",
		description: "Chaque action de modération doit inclure une raison claire et la preuve associée.",
	},
	{
		title: "Escalade interne",
		description: "En cas de doute, appliquer l'action minimale puis escalader vers un référent.",
	},
];

/**
 * Centre d'informations Discord — consignes opérationnelles sous forme de boxes.
 * Suit le pattern "flush-header" (SectionHeaderBanner collée à son contenu).
 * @returns La page Centre d'informations Modération Discord
 */
export default function CentreInfoPage() {
	void PAGE_CONFIG;

	return (
		<PageContainer title="Centre d'informations" description="Consignes et procédures de modération Discord">
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
