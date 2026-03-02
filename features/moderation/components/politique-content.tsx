"use client";

import { useState } from "react";
import { Card, Badge, Icon, Tag, SectionHeaderBanner } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

/** Section definition for the policy document */
interface Section {
	id: string;
	number: number;
	title: string;
	content: React.ReactNode;
}

/**
 * Invisible anchor element for scroll-to-section navigation.
 * @param {{ id: string }} props - Component props
 * @returns {JSX.Element} A hidden div with scroll offset
 */

function SectionAnchor({ id }: { id: string }) {
	return <div id={id} className="scroll-mt-24" />;
}

/**
 * Renders a list of rules with check/cross icons.
 * @param {{ items: string[], variant: "allowed" | "prohibited" }} props - Component props
 * @returns {JSX.Element} A styled list of rules
 */

function RuleList({ items, variant }: { items: string[]; variant: "allowed" | "prohibited" }) {
	const isAllowed = variant === "allowed";
	return (
		<ul className="space-y-2">
			{items.map((item, i) => (
				<li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
					<Icon
						name={isAllowed ? "check" : "close"}
						size="sm"
						className={cn("mt-0.5 shrink-0", isAllowed ? "text-success-500" : "text-error-500")}
					/>
					<span>{item}</span>
				</li>
			))}
		</ul>
	);
}

/**
 * Styled subheading for policy sections.
 * @param {{ children: React.ReactNode }} props - Component props
 * @returns {JSX.Element} A styled h4 element
 */

function SubHeading({ children }: { children: React.ReactNode }) {
	return <h4 className="mt-4 mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">{children}</h4>;
}

/**
 * Styled paragraph for policy section content.
 * @param {{ children: React.ReactNode }} props - Component props
 * @returns {JSX.Element} A styled p element
 */

function Paragraph({ children }: { children: React.ReactNode }) {
	return <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>;
}

// Section data

const SECTIONS: Section[] = [
	{
		id: "structure",
		number: 1,
		title: "Structure et Hierarchie",
		content: (
			<div className="space-y-4">
				<Paragraph>
					L&apos;equipe de moderation s&apos;inscrit dans une hierarchie claire au sein de
					l&apos;organisation. Chaque moderateur repond a un Responsable direct (Legacy) et s&apos;engage a
					respecter la chaine de commandement etablie.
				</Paragraph>
				<SubHeading>Chaine de commandement</SubHeading>
				<div className="flex flex-wrap items-center gap-2">
					<Tag color="primary">Direction</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="warning">Legacy (Responsables)</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="info">Marsha Team (Moderateurs)</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="gray">Moderateurs Junior</Tag>
				</div>
				<SubHeading>Le moderateur PEUT</SubHeading>
				<RuleList
					variant="allowed"
					items={[
						"Appliquer les sanctions prévues dans le Panel de Sanctions",
						"Intervenir dans les salons textuels et vocaux publics",
						"Utiliser les outils de moderation officiels (bots, commandes)",
						"Remonter les situations complexes à son Responsable",
						"Participer aux réunions d'equipe et donner son avis",
						"Consulter les logs et historiques de sanctions",
					]}
				/>
				<SubHeading>Le moderateur NE PEUT PAS</SubHeading>
				<RuleList
					variant="prohibited"
					items={[
						"Modifier les roles ou permissions du serveur",
						"Prendre des decisions de ban definitif sans validation Legacy",
						"Communiquer au nom de la Direction ou de la Legacy",
						"Partager des informations internes en dehors de l'equipe",
						"Utiliser ses pouvoirs pour des raisons personnelles",
						"Bypasser la chaine de commandement sauf urgence absolue",
					]}
				/>
			</div>
		),
	},
	{
		id: "communication-hierarchique",
		number: 2,
		title: "Communication Hierarchique",
		content: (
			<div className="space-y-4">
				<Paragraph>
					La communication avec la hierarchie est essentielle au bon fonctionnement de l&apos;equipe. Chaque
					moderateur doit respecter les canaux et procedures etablis.
				</Paragraph>
				<SubHeading>Regles de contact avec le Responsable</SubHeading>
				<ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
					<li className="flex items-start gap-2">
						<Icon name="chevronRight" size="xs" className="text-primary-500 mt-1 shrink-0" />
						<span>
							<strong>Canal prioritaire :</strong> Salon dedie #staff-general pour les communications
							courantes
						</span>
					</li>
					<li className="flex items-start gap-2">
						<Icon name="chevronRight" size="xs" className="text-primary-500 mt-1 shrink-0" />
						<span>
							<strong>Urgences :</strong> DM au Responsable direct uniquement en cas d&apos;urgence (raid,
							menaces, contenu illegal)
						</span>
					</li>
					<li className="flex items-start gap-2">
						<Icon name="chevronRight" size="xs" className="text-primary-500 mt-1 shrink-0" />
						<span>
							<strong>Rapports :</strong> Compte-rendu hebdomadaire des actions de moderation via le
							formulaire dedie
						</span>
					</li>
				</ul>
				<SubHeading>Procedure d&apos;absence du Responsable</SubHeading>
				<Paragraph>
					En cas d&apos;absence du Responsable direct, le moderateur doit contacter le Responsable suppleant
					designe. Si aucun Responsable n&apos;est disponible, les decisions de ban definitif sont suspendues
					jusqu&apos;a leur retour — seules les sanctions temporaires peuvent etre appliquees.
				</Paragraph>
			</div>
		),
	},
	{
		id: "principes",
		number: 3,
		title: "Principes de Moderation",
		content: (
			<div className="space-y-4">
				<Paragraph>
					La moderation repose sur trois piliers fondamentaux qui guident chaque decision et interaction.
				</Paragraph>
				<div className="grid gap-4 sm:grid-cols-3">
					<div className="border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/10 rounded-lg border p-4">
						<div className="mb-2 flex items-center gap-2">
							<Icon name="shield" size="md" className="text-primary-500" />
							<h4 className="text-primary-700 dark:text-primary-400 text-sm font-semibold">
								Impartialite
							</h4>
						</div>
						<p className="text-primary-600 dark:text-primary-300 text-xs leading-relaxed">
							Aucune decision ne doit etre influencee par des affinites personnelles, des conflits prives
							ou des preferences individuelles.
						</p>
					</div>
					<div className="border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/10 rounded-lg border p-4">
						<div className="mb-2 flex items-center gap-2">
							<Icon name="heart" size="md" className="text-success-500" />
							<h4 className="text-success-700 dark:text-success-400 text-sm font-semibold">Humanite</h4>
						</div>
						<p className="text-success-600 dark:text-success-300 text-xs leading-relaxed">
							Chaque membre est une personne reelle. La moderation doit etre ferme mais respectueuse,
							pedagogique avant d&apos;etre punitive.
						</p>
					</div>
					<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 rounded-lg border p-4">
						<div className="mb-2 flex items-center gap-2">
							<Icon name="star" size="md" className="text-warning-500" />
							<h4 className="text-warning-700 dark:text-warning-400 text-sm font-semibold">
								Professionnalisme
							</h4>
						</div>
						<p className="text-warning-600 dark:text-warning-300 text-xs leading-relaxed">
							Le moderateur represente l&apos;equipe. Son comportement doit etre exemplaire en toutes
							circonstances.
						</p>
					</div>
				</div>
			</div>
		),
	},
	{
		id: "sanctions",
		number: 4,
		title: "Application des Sanctions",
		content: (
			<div className="space-y-4">
				<Paragraph>
					L&apos;application des sanctions suit une gradation stricte definie dans le Panel de Sanctions.
					Chaque sanction doit etre documentee et justifiee.
				</Paragraph>
				<SubHeading>Principe de gradation</SubHeading>
				<div className="flex flex-wrap items-center gap-2">
					<Tag color="gray">Warn</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="info">Tempmute</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="warning">Tempban</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="error">Ban definitif</Tag>
				</div>
				<SubHeading>Documentation obligatoire</SubHeading>
				<Paragraph>Chaque sanction appliquee doit comporter :</Paragraph>
				<ul className="mt-2 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
					<li className="flex items-start gap-2">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
						La raison precise de la sanction
					</li>
					<li className="flex items-start gap-2">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
						Les preuves (screenshots, liens vers les messages)
					</li>
					<li className="flex items-start gap-2">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
						Le contexte de l&apos;infraction
					</li>
					<li className="flex items-start gap-2">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
						La duree de la sanction si temporaire
					</li>
				</ul>
			</div>
		),
	},
	{
		id: "limites",
		number: 5,
		title: "Limites et Interdictions",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Le role de moderateur implique des responsabilites mais aussi des limites strictes.
				</Paragraph>
				<SubHeading>Interdictions absolues</SubHeading>
				<RuleList
					variant="prohibited"
					items={[
						"Abus de pouvoir : sanctionner sans raison valide",
						"Favoritisme : traitement de faveur envers des connaissances",
						"Divulgation : partager des informations staff",
						"Conflit d'interets : moderer une situation dans laquelle on est implique",
						"Insubordination : refuser une directive de la Legacy sans motif recevable",
					]}
				/>
				<SubHeading>Confidentialite</SubHeading>
				<div className="border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-900/10 rounded-lg border p-4">
					<div className="flex items-center gap-2">
						<Icon name="lock" size="md" className="text-error-500" />
						<h4 className="text-error-700 dark:text-error-400 text-sm font-semibold">
							Obligation de confidentialite
						</h4>
					</div>
					<p className="text-error-600 dark:text-error-300 mt-2 text-xs leading-relaxed">
						Toutes les informations staff sont strictement confidentielles. Toute fuite est passible de
						revocation immediate.
					</p>
				</div>
			</div>
		),
	},
];

/** Props for the PolitiqueContent component */
interface PolitiqueContentProps {
	platform?: string;
}

/**
 * Shared politique/policy document with navigable sections and table of contents.
 * Reusable across all moderation modules (Discord, Twitch, YouTube, Polyvalent).
 * @param {PolitiqueContentProps} props - Component props
 * @param {string} [props.platform] - Optional platform name to display in the header
 * @returns {JSX.Element} Full policy document view
 */

export function PolitiqueContent({ platform }: PolitiqueContentProps) {
	const [activeSection, setActiveSection] = useState<string | null>(null);

	const title = platform ? `Politique de Modération ${platform}` : "Politique de Modération";

	/**
	 * Scrolls to a section and marks it as active.
	 * @param {string} id - The section anchor id
	 * @returns {void}
	 */

	function scrollToSection(id: string) {
		setActiveSection(id);
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}

	return (
		<div className="flex flex-col gap-8 lg:flex-row">
			{/* Sticky table of contents */}
			<aside className="shrink-0 lg:sticky lg:top-6 lg:h-fit lg:w-64">
				<Card padding="md">
					<h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
						Sommaire
					</h3>
					<nav className="space-y-1">
						{SECTIONS.map((section) => (
							<button
								key={section.id}
								onClick={() => scrollToSection(section.id)}
								className={cn(
									"flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors",
									activeSection === section.id
										? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-medium"
										: "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
								)}
							>
								<span
									className={cn(
										"flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold",
										activeSection === section.id
											? "bg-primary-500 text-white"
											: "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
									)}
								>
									{section.number}
								</span>
								<span className="truncate">{section.title}</span>
							</button>
						))}
					</nav>
				</Card>
			</aside>

			{/* Main content */}
			<div className="min-w-0 flex-1 space-y-6">
				{/* Document header */}
				<Card padding="lg">
					<div className="flex items-start gap-3">
						<div className="bg-primary-100 dark:bg-primary-900/30 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
							<Icon name="shield" size="lg" className="text-primary-600 dark:text-primary-400" />
						</div>
						<div>
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
							<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
								Document officiel definissant le cadre d&apos;exercice, les droits, les devoirs et les
								limites des moderateurs.
							</p>
							<div className="mt-3 flex flex-wrap items-center gap-2">
								<Badge variant="primary">v2.4</Badge>
								<Badge variant="neutral" showDot={false}>
									{SECTIONS.length} sections
								</Badge>
								<Tag color="info">Dernière MAJ : 30 Septembre</Tag>
							</div>
						</div>
					</div>
				</Card>

				{/* Sections */}
				{SECTIONS.map((section) => (
					<div key={section.id}>
						<SectionAnchor id={section.id} />
						<Card padding="lg">
							<SectionHeaderBanner icon="shield" title={section.title} accentColor="rose" className="mb-4">
								<span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
									{section.number}
								</span>
							</SectionHeaderBanner>
							{section.content}
						</Card>
					</div>
				))}

				{/* Document footer */}
				<div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
					{title} — Document interne — Toute reproduction ou diffusion non-autorisee est interdite.
				</div>
			</div>
		</div>
	);
}
