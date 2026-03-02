"use client";

import { PageContainer } from "@/components/layout/page-container";
import { PolitiqueContent } from "@/features/moderation/components/politique-content";
import { definePageConfig } from "@/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/moderation/politique",
	section: "protected",
	module: "moderation_discord",
	description: "Politique de modération Discord.",
	requiredPermissions: [{ module: "moderation_discord", action: "view" }],
	entityScoped: true,
});

/**
 * Discord moderation policy page.
 * @returns {JSX.Element} The Discord politique page
 */

export default function PolitiquePage() {
	return (
		<PageContainer
			title="Politique de Modération"
			description="Cadre d'exercice des fonctions de modération Discord — Dernière mise à jour : 30 Septembre"
		>
			<PolitiqueContent platform="Discord" />
		</PageContainer>
	);
}
