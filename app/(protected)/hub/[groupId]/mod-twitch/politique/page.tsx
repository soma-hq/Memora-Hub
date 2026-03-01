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
		id: "introduction",
		number: 1,
		title: "Introduction",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Cette politique de moderation definit le cadre d&apos;exercice des fonctions de moderation sur la
					chaine Twitch. Elle s&apos;applique a l&apos;ensemble des moderateurs actifs pendant les lives et en
					dehors des periodes de diffusion.
				</Paragraph>

				<Paragraph>
					La moderation Twitch repose sur trois principes fondamentaux : la protection de la communaute, le
					respect des conditions d&apos;utilisation de Twitch (TOS), et le maintien d&apos;un environnement
					sain et accueillant pour tous les viewers.
				</Paragraph>

				<div className="grid gap-4 sm:grid-cols-3">
					<div className="border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/10 rounded-lg border p-4">
						<div className="mb-2 flex items-center gap-2">
							<Icon name="shield" size="md" className="text-primary-500" />
							<h4 className="text-primary-700 dark:text-primary-400 text-sm font-semibold">Protection</h4>
						</div>
						<p className="text-primary-600 dark:text-primary-300 text-xs leading-relaxed">
							Proteger le streamer et les viewers contre le harcelement, le spam, les hate raids et tout
							comportement nuisible dans le chat.
						</p>
					</div>

					<div className="border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/10 rounded-lg border p-4">
						<div className="mb-2 flex items-center gap-2">
							<Icon name="heart" size="md" className="text-success-500" />
							<h4 className="text-success-700 dark:text-success-400 text-sm font-semibold">
								Conformite TOS
							</h4>
						</div>
						<p className="text-success-600 dark:text-success-300 text-xs leading-relaxed">
							Garantir le respect des conditions d&apos;utilisation de Twitch pour eviter tout risque de
							sanction sur la chaine.
						</p>
					</div>

					<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 rounded-lg border p-4">
						<div className="mb-2 flex items-center gap-2">
							<Icon name="star" size="md" className="text-warning-500" />
							<h4 className="text-warning-700 dark:text-warning-400 text-sm font-semibold">
								Environnement sain
							</h4>
						</div>
						<p className="text-warning-600 dark:text-warning-300 text-xs leading-relaxed">
							Maintenir un chat agreable et inclusif ou chaque viewer se sent le bienvenu, tout en gardant
							une ambiance dynamique.
						</p>
					</div>
				</div>
			</div>
		),
	},
	{
		id: "regles-de-base",
		number: 2,
		title: "Regles de base",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Les regles de base s&apos;appliquent en permanence dans le chat Twitch, quel que soit le Livecon
					actif. Elles constituent le socle minimum de comportement attendu des viewers.
				</Paragraph>

				<SubHeading>Comportements autorises</SubHeading>
				<RuleList
					variant="allowed"
					items={[
						"Participer activement au chat de maniere respectueuse",
						"Utiliser les emotes et les commandes du chat normalement",
						"Poser des questions au streamer ou aux moderateurs",
						"Partager des liens autorises par le streamer (clips, etc.)",
						"Signaler des comportements suspects aux moderateurs",
					]}
				/>

				<SubHeading>Comportements interdits</SubHeading>
				<RuleList
					variant="prohibited"
					items={[
						"Spam ou flood de messages repetes dans le chat",
						"Insultes, propos haineux ou discriminatoires",
						"Promotion non-autorisee de chaines, liens ou contenus externes",
						"Contournement de ban via des comptes alternatifs",
						"Diffusion de contenu contraire aux TOS de Twitch",
						"Harcelement envers le streamer, les viewers ou les moderateurs",
						"Utilisation de bots de follow ou de spam",
					]}
				/>
			</div>
		),
	},
	{
		id: "systeme-livecon",
		number: 3,
		title: "Systeme Livecon",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Le systeme Livecon definit trois niveaux de vigilance qui modulent la severite des sanctions et le
					comportement attendu des moderateurs. Le niveau est fixe par la Legacy et communique a
					l&apos;equipe.
				</Paragraph>

				<div className="space-y-3">
					{/* Livecon 3 */}
					<div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/10">
						<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
							3
						</div>
						<div>
							<p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">
								Livecon 3 — Periode Normale
							</p>
							<p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
								Moderation standard. Panel de sanctions classique. Gestion habituelle du chat.
							</p>
						</div>
					</div>

					{/* Livecon 2 */}
					<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/10">
						<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
							2
						</div>
						<div>
							<p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
								Livecon 2 — Vigilance renforcee
							</p>
							<p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
								Panel durci, surveillance accrue. Tolerances reduites. Mode emote-only possible.
							</p>
						</div>
					</div>

					{/* Livecon 1 */}
					<div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/10">
						<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
							1
						</div>
						<div>
							<p className="text-sm font-semibold text-red-900 dark:text-red-300">
								Livecon 1 — Periode critique
							</p>
							<p className="mt-0.5 text-xs text-red-600 dark:text-red-400">
								Tolerance zero. Bans definitifs frequents. Mode sub-only ou emote-only active. Aucune
								exception.
							</p>
						</div>
					</div>
				</div>

				<Paragraph>
					Le passage d&apos;un niveau a l&apos;autre est decide exclusivement par la Legacy. Les moderateurs
					sont notifies immediatement et doivent adapter leur comportement en consequence.
				</Paragraph>
			</div>
		),
	},
	{
		id: "echelle-sanctions",
		number: 4,
		title: "Echelle de sanctions",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Les sanctions sur Twitch suivent une echelle specifique adaptee aux outils de la plateforme
					(timeout, ban). Chaque infraction a un panel de sanctions qui evolue selon le Livecon actif.
				</Paragraph>

				<SubHeading>Outils de sanction Twitch</SubHeading>
				<div className="flex flex-wrap items-center gap-2">
					<Tag color="gray">Warn (message)</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="info">Timeout</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="warning">Ban temporaire</Tag>
					<Icon name="chevronRight" size="xs" className="text-gray-400" />
					<Tag color="error">Ban definitif</Tag>
				</div>

				<SubHeading>Infractions et sanctions</SubHeading>
				<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
								<th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Infraction
								</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Severite
								</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Fixe
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Spam / Flood</td>
								<td className="px-4 py-3">
									<Badge variant="warning">Moyenne</Badge>
								</td>
								<td className="px-4 py-3 text-gray-500 dark:text-gray-400">Non</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Insultes / Irrespect</td>
								<td className="px-4 py-3">
									<Badge variant="error">Haute</Badge>
								</td>
								<td className="px-4 py-3 text-gray-500 dark:text-gray-400">Non</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Publicite / Self-promo</td>
								<td className="px-4 py-3">
									<Badge variant="neutral">Standard</Badge>
								</td>
								<td className="px-4 py-3 text-gray-500 dark:text-gray-400">Non</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Ban Evasion</td>
								<td className="px-4 py-3">
									<Badge variant="error">Critique</Badge>
								</td>
								<td className="px-4 py-3 text-gray-500 dark:text-gray-400">Oui — Ban</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Follow Botting</td>
								<td className="px-4 py-3">
									<Badge variant="warning">Moyenne</Badge>
								</td>
								<td className="px-4 py-3 text-gray-500 dark:text-gray-400">Non</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Harcelement</td>
								<td className="px-4 py-3">
									<Badge variant="error">Haute</Badge>
								</td>
								<td className="px-4 py-3 text-gray-500 dark:text-gray-400">Non</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Contenu TOS</td>
								<td className="px-4 py-3">
									<Badge variant="error">Haute</Badge>
								</td>
								<td className="px-4 py-3 text-gray-500 dark:text-gray-400">Non</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Hate Raid</td>
								<td className="px-4 py-3">
									<Badge variant="error">Critique</Badge>
								</td>
								<td className="px-4 py-3 text-gray-500 dark:text-gray-400">Oui — Ban</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Underaged</td>
								<td className="px-4 py-3">
									<Badge variant="warning">Speciale</Badge>
								</td>
								<td className="px-4 py-3 text-gray-500 dark:text-gray-400">Oui — Tempban 30d</td>
							</tr>
						</tbody>
					</table>
				</div>

				<Paragraph>
					Consultez le Panel de Sanctions pour le detail complet des sanctions par Livecon et par niveau de
					recidive.
				</Paragraph>
			</div>
		),
	},
	{
		id: "procedures-speciales",
		number: 5,
		title: "Procedures speciales",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Certaines situations necessitent des procedures specifiques qui derogent au panel de sanctions
					classique. Ces procedures doivent etre connues et maitrisees par chaque moderateur.
				</Paragraph>

				<SubHeading>Ban Evasion</SubHeading>
				<div className="border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-900/10 rounded-lg border p-4">
					<Paragraph>
						Lorsqu&apos;un viewer banni revient avec un compte alternatif, le nouveau compte doit etre banni
						immediatement sans avertissement. Il est essentiel de documenter le lien entre les comptes
						(similitude de pseudo, de comportement, aveu dans le chat) et de signaler le cas a la
						hierarchie.
					</Paragraph>
				</div>

				<SubHeading>Hate Raids</SubHeading>
				<div className="border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-900/10 rounded-lg border p-4">
					<div className="flex items-center gap-2">
						<Icon name="warning" size="md" className="text-error-500" />
						<h4 className="text-error-700 dark:text-error-400 text-sm font-semibold">
							Procedure d&apos;urgence
						</h4>
					</div>
					<ol className="mt-2 list-inside list-decimal space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
						<li>Activer immediatement le mode emote-only ou sub-only</li>
						<li>Bannir en masse les comptes participants</li>
						<li>Signaler l&apos;incident a Twitch via les outils de reporting</li>
						<li>Alerter la Legacy dans les 15 minutes</li>
						<li>Documenter l&apos;incident (screenshots, logs)</li>
						<li>Ne pas engager de dialogue avec les raiders</li>
					</ol>
				</div>

				<SubHeading>Violations TOS</SubHeading>
				<Paragraph>
					Tout contenu violant les conditions d&apos;utilisation de Twitch (contenu sexuel, violence extreme,
					propos haineux, etc.) doit etre sanctionne immediatement par un ban. Le moderateur doit egalement
					signaler le contenu a Twitch Trust &amp; Safety pour proteger la chaine contre d&apos;eventuelles
					sanctions.
				</Paragraph>

				<SubHeading>Underaged</SubHeading>
				<Paragraph>
					Les comptes identifies comme mineurs de moins de 13 ans font l&apos;objet d&apos;un tempban
					systematique de 30 jours. Ne jamais demander l&apos;age d&apos;un viewer. Si l&apos;information est
					partagee spontanement, appliquer la procedure et signaler au Trust &amp; Safety.
				</Paragraph>
			</div>
		),
	},
	{
		id: "droits-devoirs",
		number: 6,
		title: "Droits et devoirs des moderateurs",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Le role de moderateur Twitch implique des droits specifiques mais aussi des devoirs et limites
					strictes. Le non-respect de ces obligations constitue une faute pouvant mener a la revocation.
				</Paragraph>

				<SubHeading>Le moderateur PEUT</SubHeading>
				<RuleList
					variant="allowed"
					items={[
						"Appliquer les timeouts et bans prevus dans le Panel de Sanctions",
						"Supprimer les messages inappropries du chat",
						"Activer les modes restrictifs (emote-only, sub-only, slow mode) en cas d'urgence",
						"Signaler du contenu a Twitch Trust & Safety",
						"Remonter les situations complexes a son Responsable",
						"Consulter les logs du chat et l'historique des sanctions",
					]}
				/>

				<SubHeading>Le moderateur NE PEUT PAS</SubHeading>
				<RuleList
					variant="prohibited"
					items={[
						"Modifier les parametres de la chaine (hors modes chat d'urgence)",
						"Prendre des decisions de ban definitif sans validation Legacy (hors infractions fixes)",
						"Communiquer au nom du streamer ou de la Legacy",
						"Partager des informations internes en dehors de l'equipe",
						"Utiliser ses pouvoirs pour des raisons personnelles",
						"Moderer sous l'emprise d'emotions personnelles (conflit d'interet)",
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
						Toutes les informations echangees dans les salons staff, les decisions internes, les donnees des
						viewers et les procedures de moderation sont strictement confidentielles. Toute fuite,
						intentionnelle ou non, est passible de revocation immediate.
					</p>
				</div>

				<SubHeading>Sanctions disciplinaires</SubHeading>
				<div className="space-y-3">
					<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<div className="bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
							1
						</div>
						<div>
							<p className="text-sm font-semibold text-gray-900 dark:text-white">Avertissement verbal</p>
							<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
								Entretien avec le Responsable. Rappel des regles.
							</p>
						</div>
					</div>
					<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<div className="bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
							2
						</div>
						<div>
							<p className="text-sm font-semibold text-gray-900 dark:text-white">Avertissement ecrit</p>
							<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
								Notification formelle consignee au dossier.
							</p>
						</div>
					</div>
					<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<div className="bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
							3
						</div>
						<div>
							<p className="text-sm font-semibold text-gray-900 dark:text-white">Suspension temporaire</p>
							<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
								Retrait temporaire des fonctions de moderation.
							</p>
						</div>
					</div>
					<div className="border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-900/10 flex items-start gap-3 rounded-lg border p-3">
						<div className="bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
							4
						</div>
						<div>
							<p className="text-error-900 dark:text-error-300 text-sm font-semibold">
								Revocation definitive
							</p>
							<p className="text-error-600 dark:text-error-400 mt-0.5 text-xs">
								Retrait definitif du role de moderateur. Decision irrevocable.
							</p>
						</div>
					</div>
				</div>
			</div>
		),
	},
	{
		id: "revision-mises-a-jour",
		number: 7,
		title: "Revision et mises a jour",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Cette politique de moderation Twitch constitue le cadre d&apos;exercice officiel. Elle peut etre
					modifiee a tout moment par la Legacy avec un preavis raisonnable communique a l&apos;equipe.
				</Paragraph>

				<SubHeading>Modifications</SubHeading>
				<ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
					<li className="flex items-start gap-2">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
						Les modifications sont annoncees dans le salon staff au minimum 48h avant leur prise
						d&apos;effet
					</li>
					<li className="flex items-start gap-2">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
						Le Panel de Sanctions peut etre ajuste en fonction du Livecon sans preavis
					</li>
					<li className="flex items-start gap-2">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
						Le document mis a jour est toujours disponible sur cette page
					</li>
				</ul>

				<SubHeading>Cycle de revision</SubHeading>
				<Paragraph>
					La politique est revisee formellement chaque trimestre par la Legacy. Les moderateurs peuvent
					soumettre des suggestions d&apos;amelioration via le systeme de tickets interne. Chaque revision
					majeure fait l&apos;objet d&apos;une communication et d&apos;un briefing equipe.
				</Paragraph>

				<SubHeading>Acceptation</SubHeading>
				<div className="border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/10 rounded-lg border p-4">
					<Paragraph>
						En acceptant le role de moderateur Twitch, chaque membre s&apos;engage a respecter
						l&apos;integralite de cette politique. L&apos;ignorance d&apos;une regle ne constitue pas une
						excuse recevable. Il est de la responsabilite de chaque moderateur de se tenir informe des mises
						a jour.
					</Paragraph>
				</div>

				<div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
					<Icon name="document" size="xs" />
					<span>
						Document officiel — Politique de Moderation Twitch v1.0 — Derniere mise a jour : Fevrier 2025
					</span>
				</div>
			</div>
		),
	},
];

/**
 * Twitch moderation policy page with navigable sections and table of contents.
 * @returns The full Twitch moderation policy document view
 */
export default function TwitchPolitiquePage() {
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
			title="Politique de Moderation Twitch"
			description="Cadre d'exercice des fonctions de moderation Twitch — Derniere mise a jour : Fevrier 2025"
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
								<Icon name="shield" size="lg" className="text-primary-600 dark:text-primary-400" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
									Politique de Moderation Twitch
								</h2>
								<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
									Document officiel definissant le cadre d&apos;exercice, les droits, les devoirs et
									les limites des moderateurs Twitch. Ce document est contraignant pour tout membre
									exercant des fonctions de moderation sur la chaine.
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
						Politique de Moderation Twitch — Document interne — Toute reproduction ou diffusion
						non-autorisee est interdite.
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
