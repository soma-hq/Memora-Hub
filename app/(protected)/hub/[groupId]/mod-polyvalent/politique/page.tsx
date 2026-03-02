"use client";

import { PageContainer } from "@/components/layout/page-container";
import { PolitiqueContent } from "@/features/moderation/components/politique-content";
import { definePageConfig } from "@/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/mod-polyvalent/politique",
	section: "protected",
	module: "moderation_polyvalent",
	description: "Politique de modération Polyvalent.",
	requiredPermissions: [{ module: "moderation_polyvalent", action: "view" }],
	entityScoped: true,
});

/**
 * Polyvalent moderation policy page.
 * @returns {JSX.Element} The Polyvalent politique page
 */

export default function PolitiquePage() {
	return (
		<PageContainer
			title="Politique de Modération"
			description="Cadre d'exercice des fonctions de modération polyvalente — Dernière mise à jour : 30 Septembre"
		>
			<PolitiqueContent platform="Polyvalent" />
		</PageContainer>
	);
}
