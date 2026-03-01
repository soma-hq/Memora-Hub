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
						"Appliquer les sanctions prevues dans le Panel de Sanctions",
						"Intervenir dans les salons textuels et vocaux publics",
						"Utiliser les outils de moderation officiels (bots, commandes)",
						"Remonter les situations complexes a son Responsable",
						"Participer aux reunions d'equipe et donner son avis",
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
		id: "communication-equipe",
		number: 3,
		title: "Communication en Equipe",
		content: (
			<div className="space-y-4">
				<Paragraph>
					La collaboration entre moderateurs est fondamentale. Une equipe soudee et communicante est une
					equipe efficace.
				</Paragraph>

				<SubHeading>Canaux officiels</SubHeading>
				<div className="grid gap-3 sm:grid-cols-2">
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<p className="text-xs font-semibold text-gray-900 dark:text-white">#staff-general</p>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Discussions generales, coordination quotidienne
						</p>
					</div>
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<p className="text-xs font-semibold text-gray-900 dark:text-white">#staff-sanctions</p>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Logs de sanctions, discussions sur les cas complexes
						</p>
					</div>
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<p className="text-xs font-semibold text-gray-900 dark:text-white">#staff-urgences</p>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Alertes raids, menaces, situations critiques
						</p>
					</div>
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
						<p className="text-xs font-semibold text-gray-900 dark:text-white">#staff-reunions</p>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Comptes-rendus de reunions, planification
						</p>
					</div>
				</div>

				<SubHeading>Reunions d&apos;equipe</SubHeading>
				<Paragraph>
					Les reunions d&apos;equipe sont organisees chaque semaine par la Legacy. La presence est obligatoire
					sauf absence declaree. Un compte-rendu est publie dans #staff-reunions apres chaque session.
				</Paragraph>
			</div>
		),
	},
	{
		id: "absences",
		number: 4,
		title: "Gestion des Absences",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Toute absence doit etre declaree a l&apos;avance via le systeme prevu. Une absence non-declaree est
					consideree comme un manquement aux obligations.
				</Paragraph>

				<SubHeading>Procedure de declaration</SubHeading>
				<ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
					<li>Declarer l&apos;absence via le module Absences du dashboard (minimum 48h a l&apos;avance)</li>
					<li>Indiquer la duree prevue et le motif general</li>
					<li>Prevenir son Responsable direct par message</li>
					<li>S&apos;assurer qu&apos;un remplacement est organise si necessaire</li>
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
		number: 5,
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
							ou des preferences individuelles. La regle s&apos;applique de facon identique a tous.
						</p>
					</div>

					<div className="border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/10 rounded-lg border p-4">
						<div className="mb-2 flex items-center gap-2">
							<Icon name="heart" size="md" className="text-success-500" />
							<h4 className="text-success-700 dark:text-success-400 text-sm font-semibold">Humanite</h4>
						</div>
						<p className="text-success-600 dark:text-success-300 text-xs leading-relaxed">
							Chaque membre est une personne reelle. La moderation doit etre ferme mais respectueuse,
							pedagogique avant d&apos;etre punitive. Le dialogue est toujours la premiere approche.
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
							Le moderateur represente l&apos;equipe et l&apos;organisation. Son comportement doit etre
							exemplaire en toutes circonstances, y compris en dehors des heures de service.
						</p>
					</div>
				</div>
			</div>
		),
	},
	{
		id: "disponibilite",
		number: 6,
		title: "Disponibilite et Engagement",
		content: (
			<div className="space-y-4">
				<Paragraph>
					L&apos;engagement minimum est de 30 minutes par jour de presence active. Cela inclut la surveillance
					des salons, le traitement des signalements et la participation aux discussions staff.
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
								<td className="px-4 py-3 text-gray-900 dark:text-white">Raid / Attaque</td>
								<td className="px-4 py-3 text-gray-700 dark:text-gray-300">Immediat</td>
								<td className="px-4 py-3">
									<Badge variant="error">Critique</Badge>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Contenu NSFW / Menaces</td>
								<td className="px-4 py-3 text-gray-700 dark:text-gray-300">&lt; 5 minutes</td>
								<td className="px-4 py-3">
									<Badge variant="error">Haute</Badge>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Harcelement / Insultes</td>
								<td className="px-4 py-3 text-gray-700 dark:text-gray-300">&lt; 15 minutes</td>
								<td className="px-4 py-3">
									<Badge variant="warning">Moyenne</Badge>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Spam / Pub</td>
								<td className="px-4 py-3 text-gray-700 dark:text-gray-300">&lt; 30 minutes</td>
								<td className="px-4 py-3">
									<Badge variant="neutral">Standard</Badge>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-3 text-gray-900 dark:text-white">Signalement membre</td>
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
					laisser une situation critique sans traitement.
				</Paragraph>
			</div>
		),
	},
	{
		id: "outils",
		number: 7,
		title: "Utilisation des Outils",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Seuls les outils officiels sont autorises pour la moderation. L&apos;utilisation d&apos;outils tiers
					non-approuves est strictement interdite.
				</Paragraph>

				<SubHeading>Outils autorises</SubHeading>
				<RuleList
					variant="allowed"
					items={[
						"Commandes de moderation du bot officiel (warn, mute, kick, ban)",
						"Dashboard de moderation (cette plateforme)",
						"Systeme de tickets pour les signalements",
						"Logs automatiques du serveur",
						"Outils de verification d'age/compte si disponibles",
					]}
				/>

				<SubHeading>Pratiques interdites</SubHeading>
				<RuleList
					variant="prohibited"
					items={[
						"Moderer par DM (toute action doit etre tracable)",
						"Utiliser des bots personnels avec des permissions elevees",
						"Supprimer des logs ou messages de moderation",
						"Partager les credentials des outils staff",
						"Utiliser des commandes en dehors de leur contexte prevu",
					]}
				/>

				<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 mt-2 flex items-start gap-2 rounded-lg border px-3 py-2">
					<Icon name="warning" size="sm" className="text-warning-500 mt-0.5 shrink-0" />
					<span className="text-warning-700 dark:text-warning-400 text-xs">
						Rappel : Toute action de moderation en DM est nulle et non-avenue. Les sanctions doivent etre
						appliquees exclusivement via les canaux officiels pour garantir la tracabilite.
					</span>
				</div>
			</div>
		),
	},
	{
		id: "sanctions",
		number: 8,
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
						La raison precise de la sanction (utiliser la raison par defaut si applicable)
					</li>
					<li className="flex items-start gap-2">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
						Les preuves (screenshots, liens vers les messages)
					</li>
					<li className="flex items-start gap-2">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
						Le contexte de l&apos;infraction (Livecon actif, recidive ou non)
					</li>
					<li className="flex items-start gap-2">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
						La duree de la sanction si temporaire
					</li>
				</ul>

				<SubHeading>Cas speciaux</SubHeading>
				<Paragraph>
					Pour les infractions graves (menaces reelles, contenu illegal, doxxing), le moderateur doit
					appliquer une sanction immediate puis escalader vers la Legacy sans delai. La procedure normale de
					gradation ne s&apos;applique pas dans ces cas.
				</Paragraph>
			</div>
		),
	},
	{
		id: "limites",
		number: 9,
		title: "Limites et Interdictions",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Le role de moderateur implique des responsabilites mais aussi des limites strictes. Le non-respect
					de ces interdictions constitue une faute grave.
				</Paragraph>

				<SubHeading>Interdictions absolues</SubHeading>
				<RuleList
					variant="prohibited"
					items={[
						"Abus de pouvoir : sanctionner un membre sans raison valide ou par represailles",
						"Favoritisme : traitement de faveur envers des amis ou connaissances",
						"Divulgation : partager des informations staff, logs prives ou donnees de membres",
						"Conflit d'interets : moderer une situation dans laquelle on est implique",
						"Insubordination : refuser d'appliquer une directive de la Legacy sans motif recevable",
						"Double-jeu : communiquer des informations internes a des membres externes",
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
						Toutes les informations echangees dans les salons staff, les decisions internes, les donnees
						personnelles des membres et les procedures de moderation sont strictement confidentielles. Toute
						fuite, intentionnelle ou non, est passible de revocation immediate.
					</p>
				</div>
			</div>
		),
	},
	{
		id: "sanctions-disciplinaires",
		number: 10,
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
								Retrait temporaire des fonctions de moderation pour une duree definie par la Legacy.
								Possibilite de reinstatement apres entretien.
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
								Retrait definitif du role de moderateur. Appliquee en cas de faute grave ou de recidive
								apres suspension. Decision irrevocable prise par la Legacy.
							</p>
						</div>
					</div>
				</div>

				<Paragraph>
					Note : En cas de faute grave (abus de pouvoir, fuite d&apos;informations, etc.), les etapes
					intermediaires peuvent etre sautees et la revocation appliquee directement.
				</Paragraph>
			</div>
		),
	},
	{
		id: "dispositions-finales",
		number: 11,
		title: "Dispositions Finales",
		content: (
			<div className="space-y-4">
				<Paragraph>
					Cette politique de moderation constitue le cadre d&apos;exercice officiel des fonctions de
					moderation. Elle peut etre modifiee a tout moment par la Legacy avec un preavis raisonnable
					communique a l&apos;equipe.
				</Paragraph>

				<SubHeading>Modifications</SubHeading>
				<ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
					<li className="flex items-start gap-2">
						<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
						Les modifications sont annoncees dans #staff-general au minimum 48h avant leur prise
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

				<SubHeading>Acceptation</SubHeading>
				<div className="border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/10 rounded-lg border p-4">
					<Paragraph>
						En acceptant le role de moderateur, chaque membre s&apos;engage a respecter l&apos;integralite
						de cette politique. L&apos;ignorance d&apos;une regle ne constitue pas une excuse recevable. Il
						est de la responsabilite de chaque moderateur de se tenir informe des mises a jour.
					</Paragraph>
				</div>

				<div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
					<Icon name="document" size="xs" />
					<span>Document officiel — Politique de Moderation v2.4 — Derniere mise a jour : 30 Septembre</span>
				</div>
			</div>
		),
	},
];

/**
 * Moderation policy page with navigable sections and table of contents.
 * @returns The full moderation policy document view
 */
export default function PolitiquePage() {
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
			title="Politique de Moderation"
			description="Cadre d'exercice des fonctions de moderation — Derniere mise a jour : 30 Septembre"
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
									Politique de Moderation
								</h2>
								<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
									Document officiel definissant le cadre d&apos;exercice, les droits, les devoirs et
									les limites des moderateurs. Ce document est contraignant pour tout membre exerqant
									des fonctions de moderation.
								</p>
								<div className="mt-3 flex flex-wrap items-center gap-2">
									<Badge variant="primary">v2.4</Badge>
									<Badge variant="neutral" showDot={false}>
										11 sections
									</Badge>
									<Tag color="info">Derniere MAJ : 30 Septembre</Tag>
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
						Politique de Moderation — Document interne — Toute reproduction ou diffusion non-autorisee est
						interdite.
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
