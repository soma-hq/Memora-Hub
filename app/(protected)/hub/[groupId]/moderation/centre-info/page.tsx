"use client";

// Next.js
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


interface InfoSection {
	title: string;
	href: string;
	icon: IconName;
	description: string;
}

/**
 * Information center hub page with links to priority scale, tickets and tips.
 * @returns The centre-info navigation page
 */
export default function CentreInfoPage() {
	const { groupId } = useParams<{ groupId: string }>();

	const sections: InfoSection[] = [
		{
			title: "Échelle de priorité",
			href: `/hub/${groupId}/moderation/centre-info/echelle`,
			icon: "users",
			description: "Chaîne de commandement et hiérarchie de la modération",
		},
		{
			title: "Système de Tickets",
			href: `/hub/${groupId}/moderation/centre-info/tickets`,
			icon: "chat",
			description: "Fonctionnement et procédures du système de tickets",
		},
		{
			title: "Tips",
			href: `/hub/${groupId}/moderation/centre-info/tips`,
			icon: "info",
			description: "Conseils et procédures pour les situations courantes",
		},
	];

	return (
		<PageContainer title="Centre d'informations" description="Documentation et procédures de modération">
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
