"use client";

import { PageContainer } from "@/components/layout/page-container";
import { PolitiqueContent } from "@/features/moderation/components/politique-content";
import { definePageConfig } from "@/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/mod-youtube/politique",
	section: "protected",
	module: "moderation_youtube",
	description: "Politique de modération YouTube.",
	requiredPermissions: [{ module: "moderation_youtube", action: "view" }],
	entityScoped: true,
});

/**
 * YouTube moderation policy page.
 * @returns {JSX.Element} The YouTube politique page
 */

export default function PolitiquePage() {
	return (
		<PageContainer
			title="Politique de Modération"
			description="Cadre d'exercice des fonctions de modération YouTube — Dernière mise à jour : 30 Septembre"
		>
			<PolitiqueContent platform="YouTube" />
		</PageContainer>
	);
}
