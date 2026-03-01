"use client";

// Features & Components
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { headingClasses, textClasses } from "@/core/design/typography";
import type { IconName } from "@/core/design/icons";


// Data
interface Tip {
	title: string;
	icon: IconName;
	badgeLabel: string;
	badgeVariant: "error" | "warning" | "info" | "primary" | "success";
	borderColor: string;
	iconBgColor: string;
	iconColor: string;
	points: string[];
}

const TIPS: Tip[] = [
	{
		title: "Underaged (-13 ans)",
		icon: "shield",
		badgeLabel: "Critique",
		badgeVariant: "error",
		borderColor: "border-l-error-500",
		iconBgColor: "bg-error-100 dark:bg-error-900/20",
		iconColor: "text-error-500",
		points: [
			"Reglementation Discord TOS : 13 ans minimum (certains pays ont des ages differents).",
			"Ne JAMAIS demander l'age a un utilisateur pour ensuite le bannir.",
			"Eviter toute discussion concernant l'age avec les membres.",
			'Procedure : copier le lien du message, signaler au Trust & Safety, puis ban avec la raison "Underaged X age" pendant 30 jours en joignant une capture.',
		],
	},
	{
		title: "Debannissements",
		icon: "refresh",
		badgeLabel: "Procedure",
		badgeVariant: "warning",
		borderColor: "border-l-warning-500",
		iconBgColor: "bg-warning-100 dark:bg-warning-900/20",
		iconColor: "text-warning-500",
		points: [
			"Les demandes de debannissement passent par un Google Form externe.",
			"L'administration traite les demandes une fois par mois, en fin de mois.",
			"Si un membre demande un traitement plus rapide : refuser poliment.",
			"S'il insiste : escalader vers un responsable. Ne jamais ceder.",
		],
	},
	{
		title: "Contestation de sanction",
		icon: "chat",
		badgeLabel: "Important",
		badgeVariant: "info",
		borderColor: "border-l-info-500",
		iconBgColor: "bg-info-100 dark:bg-info-900/20",
		iconColor: "text-info-500",
		points: [
			"Inviter le membre a ouvrir un ticket pour contester.",
			"Ne jamais intervenir si vous etes a l'origine de la sanction (conflit d'interet).",
			"Seul un responsable est habilite a gerer ce type d'echange.",
		],
	},
	{
		title: "Vocal (insultes, soundboard, cris)",
		icon: "phone",
		badgeLabel: "Vocal",
		badgeVariant: "primary",
		borderColor: "border-l-primary-500",
		iconBgColor: "bg-primary-100 dark:bg-primary-900/20",
		iconColor: "text-primary-500",
		points: [
			"Copier l'ID Discord de la personne concernee immediatement.",
			"Faire appel a d'autres moderateurs si la situation vous depasse.",
		],
	},
	{
		title: "Personne signalee / comportement suspect",
		icon: "flag",
		badgeLabel: "Surveillance",
		badgeVariant: "success",
		borderColor: "border-l-success-500",
		iconBgColor: "bg-success-100 dark:bg-success-900/20",
		iconColor: "text-success-500",
		points: [
			"Creer une note avec les elements suspects observes (messages, comportements, liens).",
			"Ne pas confronter directement — documenter d'abord, agir ensuite selon la procedure.",
		],
	},
];

// Page
/**
 * Moderation tips page with best practices and special case procedures.
 * @returns The tips and guidelines reference page
 */
export default function TipsPage() {
	return (
		<PageContainer title="Tips" description="Conseils et procedures pour les situations courantes">
			{/* Intro banner */}
			<div className="border-info-200 bg-info-50 dark:border-info-800 dark:bg-info-900/10 mb-8 flex items-start gap-3 rounded-lg border p-4">
				<Icon name="sparkles" size="md" className="text-info-500 mt-0.5 shrink-0" />
				<p className="text-info-700 dark:text-info-400 text-sm">
					Ces conseils couvrent les situations les plus frequentes. En cas de doute, n&apos;hesitez pas a
					contacter un referent ou un responsable.
				</p>
			</div>

			{/* Tips grid */}
			<div className="space-y-6">
				{TIPS.map((tip, idx) => (
					<Card key={tip.title} className={cn("border-l-4", tip.borderColor)} padding="lg">
						{/* Tip header */}
						<div className="mb-4 flex flex-wrap items-center gap-3">
							<div
								className={cn(
									"flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
									tip.iconBgColor,
								)}
							>
								<Icon name={tip.icon} style="solid" size="sm" className={tip.iconColor} />
							</div>
							<div className="min-w-0 flex-1">
								<h3 className={headingClasses.h5}>{tip.title}</h3>
							</div>
							<Badge variant={tip.badgeVariant} showDot={false}>
								{tip.badgeLabel}
							</Badge>
						</div>

						{/* Tip points */}
						<ul className="space-y-2.5">
							{tip.points.map((point, pIdx) => (
								<li key={pIdx} className="flex items-start gap-2.5">
									<div
										className={cn(
											"mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
											tip.iconColor.replace("text-", "bg-"),
										)}
									/>
									<p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{point}</p>
								</li>
							))}
						</ul>
					</Card>
				))}
			</div>
		</PageContainer>
	);
}
