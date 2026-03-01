"use client";

// Next.js
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


interface InfoSection {
	title: string;
	href: string;
	icon: IconName;
	description: string;
}

/**
 * Cross-platform information center hub with links to priority scale, tickets and tips.
 * @returns The polyvalent centre-info navigation page
 */
export default function CentreInfoPolyvalentPage() {
	const { groupId } = useParams<{ groupId: string }>();

	const sections: InfoSection[] = [
		{
			title: "Echelle de priorite",
			href: `/hub/${groupId}/mod-polyvalent/centre-info/echelle`,
			icon: "users",
			description: "Chaine de commandement et hierarchie de la moderation polyvalente",
		},
		{
			title: "Systeme de Tickets",
			href: `/hub/${groupId}/mod-polyvalent/centre-info/tickets`,
			icon: "chat",
			description: "Fonctionnement et procedures du systeme de tickets cross-plateforme",
		},
		{
			title: "Tips",
			href: `/hub/${groupId}/mod-polyvalent/centre-info/tips`,
			icon: "info",
			description: "Conseils et procedures pour les situations courantes sur Twitch et Discord",
		},
	];

	return (
		<PageContainer
			title="Centre d'informations"
			description="Documentation et procedures de moderation polyvalente Twitch & Discord"
		>
			{/* Platform indicator */}
			<div className="mb-6 flex items-center gap-2">
				<Badge variant="info" showDot={false}>
					Discord
				</Badge>
				<Badge variant="primary" showDot={false}>
					Twitch
				</Badge>
				<span className="text-xs text-gray-400 dark:text-gray-500">
					Ressources communes aux deux plateformes.
				</span>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{sections.map((section) => (
					<Link key={section.href} href={section.href} className="block">
						<Card hover padding="lg" className="h-full">
							<div className="flex flex-col items-start gap-3">
								<div
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-lg",
										"bg-primary-50 text-primary-600",
										"dark:bg-primary-900/20 dark:text-primary-400",
									)}
								>
									<Icon name={section.icon} size="lg" />
								</div>
								<div>
									<h3 className="text-base font-semibold text-gray-900 dark:text-white">
										{section.title}
									</h3>
									<p className="mt-1 text-sm text-gray-400 dark:text-gray-400">
										{section.description}
									</p>
								</div>
							</div>
						</Card>
					</Link>
				))}
			</div>
		</PageContainer>
	);
}
