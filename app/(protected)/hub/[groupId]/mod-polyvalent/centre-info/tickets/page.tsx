"use client";

// Features & Components
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { headingClasses, textClasses } from "@/core/design/typography";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/mod-polyvalent/centre-info/tickets",
	section: "protected",
	module: "moderation_polyvalent",
	description: "Gestion des tickets Polyvalent.",
	requiredPermissions: [{ module: "moderation_polyvalent", action: "view" }],
	entityScoped: true,
});

/**
 * Cross-platform ticket system page explaining moderation ticket procedures
 * @returns The polyvalent ticket system documentation page
 */
export default function TicketsPolyvalentPage() {
	return (
		<PageContainer
			title="Système de tickets"
			description="Procédure et fonctionnement du système de tickets cross-plateforme"
		>
			{/* Platform indicator */}
			<div className="mb-6 flex items-center gap-2">
				<Badge variant="info" showDot={false}>
					Discord
				</Badge>
				<Badge variant="primary" showDot={false}>
					Twitch
				</Badge>
			</div>

			{/* Important notice */}
			<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 mb-8 flex items-start gap-3 rounded-lg border p-4">
				<Icon name="warning" size="md" className="text-warning-500 mt-0.5 shrink-0" />
				<div>
					<p className="text-warning-700 dark:text-warning-400 text-sm font-medium">Rappel important</p>
					<p className="text-warning-600 dark:text-warning-500 mt-1 text-xs">
						Les discussions en messages privés concernant les cas de modération sont strictement interdites,
						que ce soit sur Discord ou Twitch. Toute communication doit passer par nos systèmes de tickets.
					</p>
				</div>
			</div>

			<div className="space-y-6">
				{/* Section 1 -- Canal officiel */}
				<Card className="border-l-primary-500 border-l-4" padding="lg">
					<div className="mb-3 flex items-center gap-3">
						<div className="bg-primary-100 dark:bg-primary-900/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
							<Icon name="chat" size="sm" className="text-primary-500" />
						</div>
						<h3 className={headingClasses.h5}>Canal officiel de communication</h3>
					</div>
					<p className={cn(textClasses.body, "leading-relaxed")}>
						Les tickets constituent le canal officiel pour toute communication avec les membres, qu'ils
						soient sur Discord ou Twitch. Qu'il s'agisse d'une demande, d'une contestation ou d'une
						question, les membres doivent être redirigés vers le système de tickets unifié.
					</p>
				</Card>

				{/* Section 2 -- Interdiction MP */}
				<Card className="border-l-error-500 border-l-4" padding="lg">
					<div className="mb-3 flex items-center gap-3">
						<div className="bg-error-100 dark:bg-error-900/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
							<Icon name="lock" size="sm" className="text-error-500" />
						</div>
						<h3 className={headingClasses.h5}>Interdiction des messages privés</h3>
					</div>
					<p className={cn(textClasses.body, "leading-relaxed")}>
						Il est formellement interdit de traiter des cas de modération par messages privés, que ce soit
						via les DM Discord ou les whispers Twitch. Cela protège à la fois le modérateur et le membre, en
						garantissant une traçabilité et une transparence totale des échanges cross-plateforme.
					</p>
				</Card>

				{/* Section 3 -- Redirection */}
				<Card className="border-l-info-500 border-l-4" padding="lg">
					<div className="mb-3 flex items-center gap-3">
						<div className="bg-info-100 dark:bg-info-900/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
							<Icon name="link" size="sm" className="text-info-500" />
						</div>
						<h3 className={headingClasses.h5}>Rediriger les membres</h3>
					</div>
					<p className={cn(textClasses.body, "mb-3 leading-relaxed")}>
						Lorsqu'un membre te contacte en privé pour un sujet lié à la modération, redirige-le
						systématiquement vers le système de tickets.
					</p>
					<ul className="ml-4 list-disc space-y-1.5">
						<li className={textClasses.bodySmall}>
							Ne jamais engager de discussion sur le sujet en MP ou whisper
						</li>
						<li className={textClasses.bodySmall}>Rester courtois et ferme dans la redirection</li>
						<li className={textClasses.bodySmall}>Utiliser la réponse type ci-dessous</li>
						<li className={textClasses.bodySmall}>
							Préciser au membre la plateforme concernée par le ticket
						</li>
					</ul>
				</Card>

				{/* Section 4 -- Reponse type */}
				<Card className="border-l-success-500 border-l-4" padding="lg">
					<div className="mb-3 flex items-center gap-3">
						<div className="bg-success-100 dark:bg-success-900/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
							<Icon name="document" size="sm" className="text-success-500" />
						</div>
						<h3 className={headingClasses.h5}>Réponse type</h3>
					</div>
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/40">
						<p className="text-sm leading-relaxed text-gray-700 italic dark:text-gray-300">
							&ldquo;Bonjour, je ne peux pas traiter ta demande en message privé. Merci d&apos;ouvrir un
							ticket via [procédure] pour que nous puissions te répondre officiellement. Précise si ta
							demande concerne Discord ou Twitch.&rdquo;
						</p>
					</div>
					<p className={cn(textClasses.caption, "mt-3")}>
						Copie et adapte cette réponse selon le contexte. Remplace [procédure] par le lien ou la commande
						appropriée.
					</p>
				</Card>
			</div>
		</PageContainer>
	);
}
