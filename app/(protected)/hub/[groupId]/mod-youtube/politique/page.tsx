"use client";

// React
import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Tag } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


// Constants & types

interface Section {
	id: string;
	number: number;
	title: string;
	content: React.ReactNode;
}

// Helper components

/**
 * Invisible anchor element for scroll-to-section navigation.
 * @param props - Component props
 * @param props.id - The anchor identifier
 * @returns A hidden div with scroll offset
 */
function SectionAnchor({ id }: { id: string }) {
	return <div id={id} className="scroll-mt-24" />;
}

/**
 * Renders a list of rules with check/cross icons based on the variant.
 * @param props - Component props
 * @param props.items - List of rule strings
 * @param props.variant - Whether the rules are allowed or prohibited
 * @returns A styled unordered list of rules
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
 * @param props - Component props
 * @param props.children - The heading text content
 * @returns A styled h4 element
 */
function SubHeading({ children }: { children: React.ReactNode }) {
	return <h4 className="mt-4 mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">{children}</h4>;
}

/**
 * Styled paragraph for policy section content.
 * @param props - Component props
 * @param props.children - The paragraph text content
 * @returns A styled p element
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
					L&apos;equipe de moderation YouTube s&apos;inscrit dans une hierarchie claire. Chaque moderateur
					repond a un Responsable direct (Legacy) et s&apos;engage a respecter la chaine de commandement
					etablie.
				</Paragraph>

				<SubHeading>Chaine de commandement</SubHeading>
				<div className="flex flex-wrap items-center gap-2">
					<Tag color="primary">Direction</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="warning">Legacy (Responsables)</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="info">Moderateurs YouTube</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="gray">Moderateurs Junior</Tag>
				</div>

				<SubHeading>Le moderateur YouTube PEUT</SubHeading>
				<RuleList
					variant="allowed"
					items={[
						"Masquer ou supprimer des commentaires inappropries",
						"Bloquer temporairement ou definitivement un utilisateur de la chaine",
						"Moderer le chat en direct pendant les lives (mode lent, abonnes uniquement)",
						"Signaler des comptes a YouTube pour violation de TOS",
						"Remonter les situations complexes a son Responsable",
						"Consulter l'historique de moderation dans YouTube Studio",
					]}
				/>

				<SubHeading>Le moderateur YouTube NE PEUT PAS</SubHeading>
				<RuleList
					variant="prohibited"
					items={[
						"Modifier les parametres de la chaine ou de YouTube Studio",
						"Supprimer des videos ou modifier le contenu de la chaine",
						"Communiquer au nom du createur ou de la Legacy",
						"Partager des informations internes en dehors de l'equipe",
						"Utiliser ses pouvoirs de moderation pour des raisons personnelles",
						"Bypasser la chaine de commandement sauf urgence absolue",
					]}
				/>
			</div>
		),
	},
	{
		id: "communication",
		number: 2,
		title: "Communication et Coordination",
		content: (
			<div className="space-y-4">
				<Paragraph>
					La communication entre moderateurs YouTube est fondamentale, en particulier lors des lives ou chaque
					seconde compte. Une equipe soudee et communicante est une equipe efficace.
				</Paragraph>

				<SubHeading>Canaux officiels</SubHeading>
				<div className="grid gap-3 sm:grid-cols-2">
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<p className="text-xs font-semibold text-gray-900 dark:text-white">#yt-staff-general</p>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Discussions generales, coordination quotidienne
						</p>
					</div>
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<p className="text-xs font-semibold text-gray-900 dark:text-white">#yt-staff-sanctions</p>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Logs de sanctions, discussions sur les cas complexes
						</p>
					</div>
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<p className="text-xs font-semibold text-gray-900 dark:text-white">#yt-staff-live</p>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Coordination en temps reel pendant les streams
						</p>
					</div>
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<p className="text-xs font-semibold text-gray-900 dark:text-white">#yt-staff-urgences</p>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Alertes raids, brigading, situations critiques
						</p>
					</div>
				</div>

				<SubHeading>Procedure d&apos;absence du Responsable</SubHeading>
				<Paragraph>
					En cas d&apos;absence du Responsable direct, le moderateur doit contacter le Responsable suppleant
					designe. Si aucun Responsable n&apos;est disponible, les decisions de blocage definitif sont
					suspendues jusqu&apos;a leur retour — seuls les blocages temporaires peuvent etre appliques.
				</Paragraph>
			</div>
		),
	},
	{
		id: "absences",
		number: 3,
		title: "Gestion des Absences",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Toute absence doit etre declaree a l&apos;avance via le systeme prevu. Une absence non-declaree est
					consideree comme un manquement aux obligations, surtout lors de lives programmes.
				</Paragraph>

				<SubHeading>Procedure de declaration</SubHeading>
				<ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
					<li>Declarer l&apos;absence via le module Absences du dashboard (minimum 48h a l&apos;avance)</li>
					<li>Indiquer la duree prevue et le motif general</li>
					<li>Prevenir son Responsable direct par message</li>
					<li>S&apos;assurer qu&apos;un remplacement est organise, surtout pour les lives programmes</li>
				</ol>

				<SubHeading>Consequences</SubHeading>
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Badge variant="warning">Absence non-declaree</Badge>
						<span className="text-sm text-gray-700 dark:text-gray-300">
							Avertissement verbal au premier manquement
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="error">Absence repetee</Badge>
						<span className="text-sm text-gray-700 dark:text-gray-300">
							Avertissement ecrit puis suspension possible
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="neutral">Absence declaree</Badge>
						<span className="text-sm text-gray-700 dark:text-gray-300">
							Aucune consequence — procedure respectee
						</span>
					</div>
				</div>
			</div>
		),
	},
	{
		id: "principes",
		number: 4,
		title: "Principes de Moderation YouTube",
		content: (
			<div className="space-y-4">
				<Paragraph>
					La moderation YouTube repose sur trois piliers fondamentaux qui guident chaque decision et
					interaction avec la communaute.
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
							Aucune decision ne doit etre influencee par des affinites personnelles. La regle
							s&apos;applique de facon identique a tous les commentateurs et spectateurs.
						</p>
					</div>

					<div className="border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/10 rounded-lg border p-4">
						<div className="mb-2 flex items-center gap-2">
							<Icon name="heart" size="md" className="text-success-500" />
							<h4 className="text-success-700 dark:text-success-400 text-sm font-semibold">Humanite</h4>
						</div>
						<p className="text-success-600 dark:text-success-300 text-xs leading-relaxed">
							Chaque spectateur est une personne reelle. La moderation doit etre ferme mais respectueuse.
							Sur YouTube, le masquage est prefere au blocage quand la situation le permet.
						</p>
					</div>

					<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 rounded-lg border p-4">
						<div className="mb-2 flex items-center gap-2">
							<Icon name="star" size="md" className="text-warning-500" />
							<h4 className="text-warning-700 dark:text-warning-400 text-sm font-semibold">Reactivite</h4>
						</div>
						<p className="text-warning-600 dark:text-warning-300 text-xs leading-relaxed">
							Sur YouTube, la reactivite est cruciale, surtout en live. Un commentaire inapproprie en live
							est visible par des milliers de spectateurs en temps reel.
						</p>
					</div>
				</div>
			</div>
		),
	},
	{
		id: "disponibilite",
		number: 5,
		title: "Disponibilite et Engagement",
		content: (
			<div className="space-y-4">
				<Paragraph>
					L&apos;engagement minimum est de 30 minutes par jour de surveillance des commentaires. Pendant les
					lives, la presence active dans le chat est obligatoire durant toute la duree du stream.
				</Paragraph>

				<SubHeading>Niveaux de reactivite</SubHeading>
				<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
								<th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Situation
								</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Delai attendu
								</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Priorite
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Brigading / Raid live</td>
								<td className="px-4 py-3 text-gray-700 dark:text-gray-300">Immediat</td>
								<td className="px-4 py-3">
									<Badge variant="error">Critique</Badge>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Doxxing / Menaces</td>
								<td className="px-4 py-3 text-gray-700 dark:text-gray-300">&lt; 2 minutes</td>
								<td className="px-4 py-3">
									<Badge variant="error">Haute</Badge>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Harcelement / Insultes</td>
								<td className="px-4 py-3 text-gray-700 dark:text-gray-300">&lt; 10 minutes</td>
								<td className="px-4 py-3">
									<Badge variant="warning">Moyenne</Badge>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Spam / Self-promo</td>
								<td className="px-4 py-3 text-gray-700 dark:text-gray-300">&lt; 30 minutes</td>
								<td className="px-4 py-3">
									<Badge variant="neutral">Standard</Badge>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Commentaire signale</td>
								<td className="px-4 py-3 text-gray-700 dark:text-gray-300">&lt; 1 heure</td>
								<td className="px-4 py-3">
									<Badge variant="neutral">Standard</Badge>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<Paragraph>
					En cas de surcharge, informer immediatement le Responsable pour redistribution des taches. Ne jamais
					laisser une situation critique sans traitement, surtout en live.
				</Paragraph>
			</div>
		),
	},
	{
		id: "outils",
		number: 6,
		title: "Utilisation des Outils YouTube",
		content: (
			<div className="space-y-4">
				<Paragraph>
					La moderation YouTube s&apos;appuie sur les outils natifs de la plateforme et sur le dashboard
					interne. L&apos;utilisation d&apos;outils tiers non-approuves est strictement interdite.
				</Paragraph>

				<SubHeading>Outils autorises</SubHeading>
				<RuleList
					variant="allowed"
					items={[
						"YouTube Studio — gestion des commentaires, filtres automatiques, blocage",
						"Outils de moderation du live chat (mode lent, abonnes uniquement, masquer)",
						"Dashboard de moderation (cette plateforme)",
						"Systeme de tickets pour les signalements",
						"Signalement YouTube officiel pour les violations TOS",
					]}
				/>

				<SubHeading>Pratiques interdites</SubHeading>
				<RuleList
					variant="prohibited"
					items={[
						"Repondre aux commentaires haineux au nom de la chaine",
						"Utiliser des outils de moderation tiers non-approuves",
						"Supprimer des commentaires de moderation ou des logs",
						"Partager les identifiants YouTube Studio du staff",
						"Modifier les parametres de filtrage automatique sans autorisation",
					]}
				/>

				<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 mt-2 flex items-start gap-2 rounded-lg border px-3 py-2">
					<Icon name="warning" size="sm" className="text-warning-500 mt-0.5 shrink-0" />
					<span className="text-warning-700 dark:text-warning-400 text-xs">
						Rappel : Toute action de moderation doit etre tracable via YouTube Studio ou le dashboard
						interne. Les actions non-documentees sont considerees comme non-conformes.
					</span>
				</div>
			</div>
		),
	},
	{
		id: "sanctions-disciplinaires",
		number: 7,
		title: "Sanctions Disciplinaires",
		content: (
			<div className="space-y-4">
				<Paragraph>
					En cas de manquement aux obligations definies dans cette politique, des sanctions disciplinaires
					progressives sont appliquees.
				</Paragraph>

				<div className="space-y-3">
					{/* Step 1 */}
					<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<div className="bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
							1
						</div>
						<div>
							<p className="text-sm font-semibold text-gray-900 dark:text-white">Avertissement verbal</p>
							<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
								Entretien avec le Responsable. Discussion sur le manquement et rappel des regles. Aucune
								trace formelle au dossier.
							</p>
						</div>
					</div>

					{/* Step 2 */}
					<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<div className="bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
							2
						</div>
						<div>
							<p className="text-sm font-semibold text-gray-900 dark:text-white">Avertissement ecrit</p>
							<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
								Notification ecrite formelle consignee au dossier du moderateur. Mentionne
								l&apos;infraction, la date et les attentes de correction.
							</p>
						</div>
					</div>

					{/* Step 3 */}
					<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<div className="bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
							3
						</div>
						<div>
							<p className="text-sm font-semibold text-gray-900 dark:text-white">Suspension temporaire</p>
							<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
								Retrait temporaire des acces YouTube Studio et des fonctions de moderation pour une
								duree definie par la Legacy. Possibilite de reinstatement apres entretien.
							</p>
						</div>
					</div>

					{/* Step 4 */}
					<div className="border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-900/10 flex items-start gap-3 rounded-lg border p-3">
						<div className="bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
							4
						</div>
						<div>
							<p className="text-error-900 dark:text-error-300 text-sm font-semibold">
								Revocation definitive
							</p>
							<p className="text-error-600 dark:text-error-400 mt-0.5 text-xs">
								Retrait definitif du role de moderateur YouTube et de tous les acces. Appliquee en cas
								de faute grave ou de recidive apres suspension. Decision irrevocable prise par la
								Legacy.
							</p>
						</div>
					</div>
				</div>

				<Paragraph>
					Note : En cas de faute grave (abus de pouvoir, fuite d&apos;informations, etc.), les etapes
					intermediaires peuvent etre sautees et la revocation appliquee directement.
				</Paragraph>

				<div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
					<Icon name="document" size="xs" />
					<span>
						Document officiel — Politique de Moderation YouTube v1.0 — Derniere mise a jour : Fevrier 2025
					</span>
				</div>
			</div>
		),
	},
];

/**
 * YouTube moderation policy page with navigable sections and table of contents.
 * @returns The full YouTube moderation policy document view
 */
export default function PolitiqueYouTubePage() {
	const [activeSection, setActiveSection] = useState<string | null>(null);

	/**
	 * Scrolls to a section and marks it as active.
	 * @param id - The section anchor id
	 */
	function scrollToSection(id: string) {
		setActiveSection(id);
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}

	return (
		<PageContainer
			title="Politique de Moderation YouTube"
			description="Cadre d'exercice des fonctions de moderation YouTube — Derniere mise a jour : Fevrier 2025"
		>
			<div className="flex flex-col gap-8 lg:flex-row">
				{/* Sticky table of contents (desktop sidebar) */}
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
								<Icon name="video" size="lg" className="text-primary-600 dark:text-primary-400" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
									Politique de Moderation YouTube
								</h2>
								<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
									Document officiel definissant le cadre d&apos;exercice, les droits, les devoirs et
									les limites des moderateurs YouTube. Ce document est contraignant pour tout membre
									exerqant des fonctions de moderation sur la chaine.
								</p>
								<div className="mt-3 flex flex-wrap items-center gap-2">
									<Badge variant="primary">v1.0</Badge>
									<Badge variant="neutral" showDot={false}>
										7 sections
									</Badge>
									<Tag color="info">Derniere MAJ : Fevrier 2025</Tag>
								</div>
							</div>
						</div>
					</Card>

					{/* Sections */}
					{SECTIONS.map((section) => (
						<div key={section.id}>
							<SectionAnchor id={section.id} />
							<Card padding="lg">
								<div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
									<span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
										{section.number}
									</span>
									<h3 className="text-base font-semibold text-gray-900 dark:text-white">
										{section.title}
									</h3>
								</div>
								{section.content}
							</Card>
						</div>
					))}

					{/* Document footer */}
					<div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
						Politique de Moderation YouTube — Document interne — Toute reproduction ou diffusion
						non-autorisee est interdite.
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
