"use client";

import { PageContainer } from "@/components/layout/page-container";
import { PolitiqueContent } from "@/features/moderation/components/politique-content";
import { definePageConfig } from "@/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/mod-twitch/politique",
	section: "protected",
	module: "moderation_twitch",
	description: "Politique de modération Twitch.",
	requiredPermissions: [{ module: "moderation_twitch", action: "view" }],
	entityScoped: true,
});

/**
 * Twitch moderation policy page.
 * @returns {JSX.Element} The Twitch politique page
 */

export default function PolitiquePage() {
	return (
		<PageContainer
			title="Politique de Modération"
			description="Cadre d'exercice des fonctions de modération Twitch — Dernière mise à jour : 30 Septembre"
		>
			<PolitiqueContent platform="Twitch" />
		</PageContainer>
	);
}
