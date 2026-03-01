"use client";

// Features & Components
import { PageContainer } from "@/components/layout/page-container";
import { Card, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { headingClasses, textClasses } from "@/core/design/typography";


/**
 * YouTube ticket system page explaining moderation ticket procedures.
 * @returns The YouTube ticket system documentation page
 */
export default function TicketsYouTubePage() {
	return (
		<PageContainer
			title="Systeme de Tickets"
			description="Procedure et fonctionnement du systeme de tickets YouTube"
		>
			{/* Important notice */}
			<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 mb-8 flex items-start gap-3 rounded-lg border p-4">
				<Icon name="warning" size="md" className="text-warning-500 mt-0.5 shrink-0" />
				<div>
					<p className="text-warning-700 dark:text-warning-400 text-sm font-medium">Rappel important</p>
					<p className="text-warning-600 dark:text-warning-500 mt-1 text-xs">
						Les discussions en messages prives concernant les cas de moderation YouTube sont strictement
						interdites. Toute communication doit passer par le systeme de tickets.
					</p>
				</div>
			</div>

			<div className="space-y-6">
				{/* Section 1 — Canal officiel */}
				<Card className="border-l-primary-500 border-l-4" padding="lg">
					<div className="mb-3 flex items-center gap-3">
						<div className="bg-primary-100 dark:bg-primary-900/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
							<Icon name="chat" size="sm" className="text-primary-500" />
						</div>
						<h3 className={headingClasses.h5}>Canal officiel de communication</h3>
					</div>
					<p className={cn(textClasses.body, "leading-relaxed")}>
						Les tickets constituent le canal officiel pour toute communication avec les membres de la
						communaute YouTube. Qu&apos;il s&apos;agisse d&apos;une demande, d&apos;une contestation de
						blocage ou d&apos;une question, les membres doivent etre rediriges vers le systeme de tickets.
					</p>
				</Card>

				{/* Section 2 — Interdiction MP */}
				<Card className="border-l-error-500 border-l-4" padding="lg">
					<div className="mb-3 flex items-center gap-3">
						<div className="bg-error-100 dark:bg-error-900/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
							<Icon name="lock" size="sm" className="text-error-500" />
						</div>
						<h3 className={headingClasses.h5}>Interdiction des messages prives</h3>
					</div>
					<p className={cn(textClasses.body, "leading-relaxed")}>
						Il est formellement interdit de traiter des cas de moderation YouTube par messages prives. Cela
						protege a la fois le moderateur et le membre, en garantissant une tracabilite et une
						transparence totale des echanges.
					</p>
				</Card>

				{/* Section 3 — Redirection */}
				<Card className="border-l-info-500 border-l-4" padding="lg">
					<div className="mb-3 flex items-center gap-3">
						<div className="bg-info-100 dark:bg-info-900/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
							<Icon name="link" size="sm" className="text-info-500" />
						</div>
						<h3 className={headingClasses.h5}>Rediriger les membres</h3>
					</div>
					<p className={cn(textClasses.body, "mb-3 leading-relaxed")}>
						Lorsqu&apos;un membre vous contacte en prive pour un sujet lie a la moderation YouTube,
						redirigez-le systematiquement vers le systeme de tickets.
					</p>
					<ul className="ml-4 list-disc space-y-1.5">
						<li className={textClasses.bodySmall}>Ne jamais engager de discussion sur le sujet en MP</li>
						<li className={textClasses.bodySmall}>Rester courtois et ferme dans la redirection</li>
						<li className={textClasses.bodySmall}>Utiliser la reponse type ci-dessous</li>
					</ul>
				</Card>

				{/* Section 4 — Reponse type */}
				<Card className="border-l-success-500 border-l-4" padding="lg">
					<div className="mb-3 flex items-center gap-3">
						<div className="bg-success-100 dark:bg-success-900/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
							<Icon name="document" size="sm" className="text-success-500" />
						</div>
						<h3 className={headingClasses.h5}>Reponse type</h3>
					</div>
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/40">
						<p className="text-sm leading-relaxed text-gray-700 italic dark:text-gray-300">
							&ldquo;Bonjour, je ne peux pas traiter votre demande en message prive. Merci d&apos;ouvrir
							un ticket via [procedure] pour que nous puissions vous repondre officiellement.&rdquo;
						</p>
					</div>
					<p className={cn(textClasses.caption, "mt-3")}>
						Copiez et adaptez cette reponse selon le contexte. Remplacez [procedure] par le lien ou la
						commande appropriee.
					</p>
				</Card>
			</div>
		</PageContainer>
	);
}
