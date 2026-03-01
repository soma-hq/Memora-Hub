"use client";

// React
import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Icon, Badge, Tabs, Divider } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


const SPACE_TABS = [
	{ id: "overview", label: "Vue d'ensemble", icon: "home" as const },
	{ id: "roles", label: "Roles & Organisation", icon: "users" as const },
	{ id: "timeline", label: "Timeline PIM", icon: "clock" as const },
	{ id: "dispositifs", label: "Dispositifs", icon: "training" as const },
	{ id: "canaux", label: "Canaux", icon: "chat" as const },
];

const TIMELINE_STEPS: {
	icon: IconName;
	title: string;
	description: string;
	involved: string;
	optional?: boolean;
}[] = [
	{
		icon: "check",
		title: "1. Admission",
		description:
			"Le Junior est admis apres une serie d'entretiens menes par la Legacy. La decision d'admission repose sur la motivation, la disponibilite et l'adequation avec les besoins de l'equipe. Une fois valide, le Junior est officiellement accueilli dans le processus Momentum.",
		involved: "Legacy, Responsable Momentum",
	},
	{
		icon: "users",
		title: "2. Attribution Referent + Dispositif",
		description:
			"Un Referent Momentum est designe pour accompagner le Junior tout au long de sa PIM. Le dispositif (ATRIA ou PULSE) est choisi en fonction du profil du Junior : ATRIA pour ceux qui decouvrent la moderation, PULSE pour ceux qui ont deja de l'experience. Le Referent devient le premier point de contact du Junior.",
		involved: "Responsable Momentum, Referent designe",
	},
	{
		icon: "training",
		title: "3. Periode 1 — Integration",
		description:
			"Phase d'integration et de decouverte. Le Junior assiste aux formations de base, observe les equipes en action, decouvre les outils et les modes operatoires internes. Les premieres competences sont evaluees par le Referent. C'est une periode d'apprentissage intense ou le Junior est accompagne pas a pas. Les sessions se font en vocal Discord avec des debriefs reguliers.",
		involved: "Referent, Tuteurs, Junior",
	},
	{
		icon: "document",
		title: "4. Bilan P1 — RRJ",
		description:
			"Le Bilan RRJ (Responsable, Referent, Junior) est une reunion formelle a trois. Le Responsable Momentum, le Referent et le Junior evaluent ensemble les acquis de la Periode 1. C'est un point de decision : soit le Junior passe en Periode 2, soit des ajustements sont necessaires. Le bilan est documente dans la FSI (Fiche de Suivi Individuelle).",
		involved: "Responsable (Legacy), Referent, Junior",
	},
	{
		icon: "sparkles",
		title: "5. Periode 2 — Approfondissement",
		description:
			"Le Junior gagne en autonomie. Des objectifs personnalises sont debloques, les formations se complexifient. Le Junior est amene a gerer des situations reelles avec moins de supervision. Les competences avancees sont evaluees. Cette periode met l'accent sur la prise de responsabilite et la capacite a travailler en equipe.",
		involved: "Referent, Junior, Equipe de moderation",
	},
	{
		icon: "document",
		title: "6. Bilan P2 — RRJ",
		description:
			"Second bilan formel avec le meme format RRJ. Evaluation finale des competences acquises. C'est le moment de decision principal : la PIM est-elle validee ? Le Junior at-il atteint le niveau attendu ? Si oui, la PIM est validee et le Junior rejoint la Marsha Squad. Sinon, une Periode Bonus peut etre accordee.",
		involved: "Responsable (Legacy), Referent, Junior",
	},
	{
		icon: "clock",
		title: "7. [Optionnel] Periode Bonus — Rattrapage",
		description:
			"Si la P2 n'est pas concluante, Legacy peut accorder une Periode Bonus. C'est une derniere chance pour le Junior de consolider ses acquis et de prouver qu'il est pret. Le suivi est renforce, avec des objectifs precis et un calendrier serre. Cette periode est decidee au cas par cas.",
		involved: "Legacy, Referent, Junior",
		optional: true,
	},
	{
		icon: "document",
		title: "8. [Optionnel] Bilan Final",
		description:
			"Dernier bilan effectue a l'issue de la Periode Bonus. Decision definitive : validation ou fin du parcours PIM. Ce bilan est l'ultime evaluation, et la decision est sans appel.",
		involved: "Responsable (Legacy), Referent, Junior",
		optional: true,
	},
	{
		icon: "shield",
		title: "9. Validation / Integration Marsha Squad",
		description:
			"Le Junior a complete sa PIM avec succes. Il rejoint officiellement la Marsha Squad en tant que membre a part entiere. Les acces sont mis a jour, le role est attribue, et le Junior est presente a l'equipe. C'est la fin du parcours Momentum et le debut d'une nouvelle etape.",
		involved: "Legacy, Marsha Teams, Momentum, Junior",
	},
];

const CHANNELS: { icon: IconName; label: string; description: string; detail: string }[] = [
	{
		icon: "chat",
		label: "Salons textuels Discord",
		description: "Communication quotidienne et coordination",
		detail: "Les salons textuels sont le coeur de la communication Momentum. Chaque session PIM dispose de salons dedies pour le suivi, les annonces, et les echanges entre Referents et Juniors. Les canaux sont structures : general, questions, ressources, reporting.",
	},
	{
		icon: "video",
		label: "Vocal Discord",
		description: "Sessions en direct et formations",
		detail: "Les sessions vocales sont essentielles pour les formations, les debriefs en temps reel et les mises en situation. Les Referents utilisent le vocal pour simuler des scenarios de moderation, faire des corrections en direct, et maintenir un lien humain avec les Juniors.",
	},
	{
		icon: "mail",
		label: "Messages prives",
		description: "Accompagnement individuel confidentiel",
		detail: "Les DMs sont utilises pour l'accompagnement personnalise : feedbacks individuels, discussions sensibles, et soutien moral. Chaque Referent maintient un canal de communication prive avec ses Juniors pour un suivi confidentiel.",
	},
	{
		icon: "calendar",
		label: "Reunions planifiees",
		description: "Bilans RRJ et points d'equipe",
		detail: "Les reunions formelles (Bilans RRJ, points hebdomadaires Momentum, retrospectives) sont planifiees a l'avance. Elles suivent un format structure avec compte-rendu obligatoire. Les decisions prises en reunion sont consignees dans les FSI.",
	},
];

/**
 * Momentum space overview page with roles, PIM timeline, dispositifs and channels.
 * @returns The momentum space dashboard
 */
export default function MomentumSpacePage() {
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<PageContainer
			title="Espace Momentum"
			description="Referentiel interne — mission, organisation, processus et ressources."
		>
			{/* Tabs */}
			<Tabs tabs={SPACE_TABS} activeTab={activeTab} onTabChange={setActiveTab} className="mb-8" />

			{/* Vue d'ensemble */}
			{activeTab === "overview" && (
				<div className="space-y-6">
					{/* Mission card */}
					<Card padding="lg">
						<div className="flex items-start gap-4">
							<div className="bg-primary-100 dark:bg-primary-900/20 shrink-0 rounded-xl p-3">
								<Icon name="shield" style="solid" size="lg" className="text-primary-500" />
							</div>
							<div className="space-y-3">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
									La mission Momentum
								</h2>
								<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
									Momentum est le pole de formation et d&apos;integration de la Marsha Academy. Son
									role est d&apos;accueillir, former et evaluer les Juniors qui rejoignent les equipes
									de moderation. A travers un parcours structure (la PIM), chaque Junior est
									accompagne individuellement par un Referent pour acquerir les competences
									necessaires a son poste.
								</p>
								<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
									Le Momentum agit comme un pont entre le recrutement et l&apos;integration
									definitive. Il garantit que chaque membre de la Marsha Squad a ete forme selon les
									memes standards de qualite et partage les memes valeurs.
								</p>
							</div>
						</div>
					</Card>

					{/* Marsha Academy */}
					<Card padding="lg">
						<div className="flex items-start gap-4">
							<div className="bg-info-100 dark:bg-info-900/20 shrink-0 rounded-xl p-3">
								<Icon name="training" style="solid" size="lg" className="text-info-500" />
							</div>
							<div className="space-y-3">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Marsha Academy</h2>
								<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
									La Marsha Academy est l&apos;ecosysteme global de formation au sein duquel opere
									Momentum. Elle regroupe les ressources pedagogiques, les formations certifiantes, et
									les parcours d&apos;evolution pour l&apos;ensemble des equipes de moderation.
								</p>
								<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
									Chaque Junior qui passe par Momentum suit un cursus adapte a son profil et a sa
									fonction (Discord, Twitch, YouTube). Les formations couvrent les aspects techniques,
									relationnels et organisationnels du metier de moderateur.
								</p>
							</div>
						</div>
					</Card>

					{/* PIM process intro */}
					<Card padding="lg">
						<div className="flex items-start gap-4">
							<div className="bg-warning-100 dark:bg-warning-900/20 shrink-0 rounded-xl p-3">
								<Icon name="sparkles" style="solid" size="lg" className="text-warning-500" />
							</div>
							<div className="space-y-3">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
									Le processus PIM
								</h2>
								<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
									La PIM (Periode d&apos;Integration Momentum) est le parcours que chaque Junior doit
									completer pour integrer officiellement la Marsha Squad. Elle se compose de periodes
									successives (P1, P2, et optionnellement une Periode Bonus), ponctuees de bilans
									formels (RRJ).
								</p>
								<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
									Chaque PIM est personnalisee : le dispositif (ATRIA ou PULSE) determine
									l&apos;intensite de l&apos;accompagnement, et les competences evaluees dependent de
									la fonction assignee. Le suivi est consigne dans la FSI (Fiche de Suivi
									Individuelle), un document centraliseur de toutes les donnees du Junior.
								</p>
								<div className="mt-2 flex flex-wrap gap-3">
									<Badge variant="primary" showDot={false}>
										ATRIA
									</Badge>
									<Badge variant="info" showDot={false}>
										PULSE
									</Badge>
									<Badge variant="neutral" showDot={false}>
										FSI
									</Badge>
									<Badge variant="warning" showDot={false}>
										Bilans RRJ
									</Badge>
								</div>
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* Roles & Organisation */}
			{activeTab === "roles" && (
				<div className="space-y-6">
					{/* Referents & Tuteurs side by side */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Referents */}
						<Card padding="lg">
							<div className="mb-4 flex items-center gap-3">
								<div className="bg-warning-100 dark:bg-warning-900/20 rounded-xl p-2.5">
									<Icon name="star" style="solid" size="md" className="text-warning-500" />
								</div>
								<div>
									<h3 className="text-base font-semibold text-gray-900 dark:text-white">Referents</h3>
									<p className="text-xs text-gray-500 dark:text-gray-400">Piliers du Momentum</p>
								</div>
							</div>
							<p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
								Les Referents sont les membres cles du Momentum. Chaque Junior se voit attribuer un
								Referent dedie qui l&apos;accompagne tout au long de sa PIM. Le Referent est responsable
								de la formation, de l&apos;evaluation des competences et du suivi quotidien.
							</p>
							<Divider className="my-4" />
							<h4 className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
								Responsabilites
							</h4>
							<ul className="space-y-2">
								{[
									"Former le Junior sur les outils et les procedures",
									"Evaluer les competences dans la FSI",
									"Mener les formations vocales et pratiques",
									"Participer aux bilans RRJ",
									"Remonter les difficultes au Responsable",
									"Maintenir la motivation et la bienveillance",
								].map((item) => (
									<li
										key={item}
										className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
									>
										<Icon name="check" size="xs" className="text-warning-500 mt-0.5 shrink-0" />
										{item}
									</li>
								))}
							</ul>
							<Divider className="my-4" />
							<h4 className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
								Principes cles
							</h4>
							<ul className="space-y-2">
								{[
									"Bienveillance et patience dans l'accompagnement",
									"Rigueur dans l'evaluation des acquis",
									"Communication transparente avec la hierarchie",
								].map((item) => (
									<li
										key={item}
										className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
									>
										<Icon name="shield" size="xs" className="text-warning-500 mt-0.5 shrink-0" />
										{item}
									</li>
								))}
							</ul>
						</Card>

						{/* Tuteurs */}
						<Card padding="lg">
							<div className="mb-4 flex items-center gap-3">
								<div className="bg-info-100 dark:bg-info-900/20 rounded-xl p-2.5">
									<Icon name="heart" style="solid" size="md" className="text-info-500" />
								</div>
								<div>
									<h3 className="text-base font-semibold text-gray-900 dark:text-white">Tuteurs</h3>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Support et expertise terrain
									</p>
								</div>
							</div>
							<p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
								Les Tuteurs sont des membres experimentes de la Marsha Squad qui viennent en appui des
								Referents. Ils partagent leur expertise, aident ponctuellement les Juniors et peuvent
								intervenir en cas de surcharge ou d&apos;absence d&apos;un Referent. Leur role est
								complementaire et flexible.
							</p>
							<Divider className="my-4" />
							<h4 className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
								Responsabilites
							</h4>
							<ul className="space-y-2">
								{[
									"Assister les Referents lors des formations",
									"Partager l'experience terrain avec les Juniors",
									"Intervenir en renfort si necessaire",
									"Contribuer a l'ambiance positive du Momentum",
									"Signaler les progres ou difficultes observes",
								].map((item) => (
									<li
										key={item}
										className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
									>
										<Icon name="check" size="xs" className="text-info-500 mt-0.5 shrink-0" />
										{item}
									</li>
								))}
							</ul>
							<Divider className="my-4" />
							<h4 className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
								Principes cles
							</h4>
							<ul className="space-y-2">
								{[
									"Disponibilite et flexibilite",
									"Esprit d'equipe et solidarite",
									"Transmission du savoir-faire acquis",
								].map((item) => (
									<li
										key={item}
										className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
									>
										<Icon name="shield" size="xs" className="text-info-500 mt-0.5 shrink-0" />
										{item}
									</li>
								))}
							</ul>
						</Card>
					</div>

					{/* Hierarchy card */}
					<Card padding="lg">
						<div className="mb-4 flex items-center gap-3">
							<div className="rounded-xl bg-gray-100 p-2.5 dark:bg-gray-700">
								<Icon name="group" size="md" className="text-gray-500 dark:text-gray-400" />
							</div>
							<div>
								<h3 className="text-base font-semibold text-gray-900 dark:text-white">
									Hierarchie organisationnelle
								</h3>
								<p className="text-xs text-gray-500 dark:text-gray-400">Structure de commandement</p>
							</div>
						</div>

						<div className="flex flex-col gap-3">
							{[
								{
									badge: "error" as const,
									label: "Legacy",
									description:
										"Direction strategique. Decisions finales sur les validations PIM, les exclusions et les orientations globales. Supervise Marsha Teams et Momentum.",
								},
								{
									badge: "primary" as const,
									label: "Marsha Teams",
									description:
										"Management operationnel. Coordonne les equipes de moderation, gere les plannings, et assure la liaison entre Legacy et les equipes terrain. Supervise le Momentum.",
								},
								{
									badge: "warning" as const,
									label: "Momentum",
									description:
										"Pole de formation et d'integration. Les Referents et Tuteurs forment et evaluent les Juniors. Le Responsable Momentum rapporte a Marsha Teams et Legacy.",
								},
								{
									badge: "neutral" as const,
									label: "Juniors",
									description:
										"Membres en cours d'integration (PIM). Suivent le parcours de formation, sont evalues par les Referents, et aspirent a rejoindre la Marsha Squad.",
								},
							].map((item, index) => (
								<div key={item.label}>
									<div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
										<Badge variant={item.badge} showDot={false} className="mt-0.5 shrink-0">
											{item.label}
										</Badge>
										<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
											{item.description}
										</p>
									</div>
									{index < 3 && (
										<div className="flex justify-center py-1">
											<Icon
												name="chevronDown"
												size="sm"
												className="text-gray-300 dark:text-gray-600"
											/>
										</div>
									)}
								</div>
							))}
						</div>
					</Card>
				</div>
			)}

			{/* Timeline PIM */}
			{activeTab === "timeline" && (
				<div className="space-y-0">
					{TIMELINE_STEPS.map((step, index) => (
						<div key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
							{/* Vertical line */}
							{index < TIMELINE_STEPS.length - 1 && (
								<div className="absolute top-12 left-5 h-[calc(100%-2rem)] w-px bg-gray-200 dark:bg-gray-700" />
							)}

							{/* Icon circle */}
							<div
								className={cn(
									"relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
									step.optional
										? "border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800"
										: index === 0
											? "border-primary-500 bg-primary-100 dark:bg-primary-900/30"
											: index === TIMELINE_STEPS.length - 1
												? "border-success-500 bg-success-100 dark:bg-success-900/30"
												: "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800",
								)}
							>
								<Icon
									name={step.icon}
									size="sm"
									className={cn(
										step.optional
											? "text-gray-400 dark:text-gray-500"
											: index === 0
												? "text-primary-500"
												: index === TIMELINE_STEPS.length - 1
													? "text-success-500"
													: "text-gray-500 dark:text-gray-400",
									)}
								/>
							</div>

							{/* Content card */}
							<Card padding="md" className={cn("flex-1", step.optional && "border-dashed")}>
								<div className="flex items-start justify-between gap-3">
									<h3 className="text-sm font-semibold text-gray-900 dark:text-white">
										{step.title}
									</h3>
									{step.optional && (
										<Badge variant="neutral" showDot={false}>
											Optionnel
										</Badge>
									)}
								</div>
								<p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
									{step.description}
								</p>
								<div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
									<Icon name="users" size="xs" />
									<span>{step.involved}</span>
								</div>
							</Card>
						</div>
					))}
				</div>
			)}

			{/* Dispositifs */}
			{activeTab === "dispositifs" && (
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{/* ATRIA */}
					<Card padding="lg">
						<div className="mb-4 flex items-center gap-3">
							<div className="bg-primary-100 dark:bg-primary-900/20 rounded-xl p-2.5">
								<Icon name="training" style="solid" size="md" className="text-primary-500" />
							</div>
							<div>
								<Badge variant="primary" showDot={false} className="text-sm">
									ATRIA
								</Badge>
								<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
									Parcours intensif et encadre
								</p>
							</div>
						</div>
						<p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
							Le parcours ATRIA est concu pour les Juniors qui n&apos;ont aucune ou peu d&apos;experience
							en moderation. L&apos;accompagnement est complet et structure : chaque aspect du metier est
							couvert depuis les bases. Le Referent est tres present et les sessions de formation sont
							frequentes.
						</p>
						<Divider className="my-4" />
						<div className="space-y-3">
							<div>
								<h4 className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Public cible
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Juniors debutants, sans experience significative en moderation de communautes en
									ligne.
								</p>
							</div>
							<div>
								<h4 className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Approche
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Formation progressive et tres encadree. Les competences sont abordees une par une
									avec des exercices pratiques. Le rythme est soutenu mais adapte au Junior. Beaucoup
									de sessions vocales et de mises en situation.
								</p>
							</div>
							<div>
								<h4 className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Duree estimee
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									4 a 6 semaines pour la P1, 3 a 4 semaines pour la P2. Variable selon la progression.
								</p>
							</div>
							<div>
								<h4 className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Focus
								</h4>
								<div className="flex flex-wrap gap-2">
									<Badge variant="neutral" showDot={false}>
										Bases de la moderation
									</Badge>
									<Badge variant="neutral" showDot={false}>
										Outils et bots
									</Badge>
									<Badge variant="neutral" showDot={false}>
										Gestion des conflits
									</Badge>
									<Badge variant="neutral" showDot={false}>
										Communication
									</Badge>
									<Badge variant="neutral" showDot={false}>
										Procedures internes
									</Badge>
								</div>
							</div>
						</div>
					</Card>

					{/* PULSE */}
					<Card padding="lg">
						<div className="mb-4 flex items-center gap-3">
							<div className="bg-info-100 dark:bg-info-900/20 rounded-xl p-2.5">
								<Icon name="sparkles" style="solid" size="md" className="text-info-500" />
							</div>
							<div>
								<Badge variant="info" showDot={false} className="text-sm">
									PULSE
								</Badge>
								<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
									Parcours allege et autonome
								</p>
							</div>
						</div>
						<p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
							Le parcours PULSE est destine aux Juniors qui possedent deja une experience en moderation.
							Ils connaissent les bases et doivent principalement s&apos;adapter aux modes operatoires et
							a la culture specifique de l&apos;equipe. L&apos;accompagnement est plus leger mais tout
							aussi structure.
						</p>
						<Divider className="my-4" />
						<div className="space-y-3">
							<div>
								<h4 className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Public cible
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Juniors experimentes, ayant deja modere des communautes en ligne (Discord, Twitch,
									ou autre).
								</p>
							</div>
							<div>
								<h4 className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Approche
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Formation ciblee sur les specificites internes. Le Junior est rapidement mis en
									autonomie partielle. L&apos;accent est sur l&apos;adaptation aux procedures et a la
									culture d&apos;equipe plutot que sur les competences de base.
								</p>
							</div>
							<div>
								<h4 className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Duree estimee
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									2 a 3 semaines pour la P1, 2 semaines pour la P2. Souvent plus rapide qu&apos;ATRIA.
								</p>
							</div>
							<div>
								<h4 className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Focus
								</h4>
								<div className="flex flex-wrap gap-2">
									<Badge variant="neutral" showDot={false}>
										Modes operatoires
									</Badge>
									<Badge variant="neutral" showDot={false}>
										Culture d&apos;equipe
									</Badge>
									<Badge variant="neutral" showDot={false}>
										Procedures specifiques
									</Badge>
									<Badge variant="neutral" showDot={false}>
										Coordination
									</Badge>
								</div>
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* Canaux */}
			{activeTab === "canaux" && (
				<div className="space-y-4">
					<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
						Les canaux de communication utilises par Momentum pour le suivi et la formation des Juniors.
					</p>
					{CHANNELS.map((channel) => (
						<Card key={channel.label} padding="lg">
							<div className="flex items-start gap-4">
								<div className="shrink-0 rounded-xl bg-gray-100 p-3 dark:bg-gray-700">
									<Icon name={channel.icon} size="md" className="text-gray-500 dark:text-gray-400" />
								</div>
								<div className="space-y-2">
									<div>
										<h3 className="text-sm font-semibold text-gray-900 dark:text-white">
											{channel.label}
										</h3>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{channel.description}
										</p>
									</div>
									<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
										{channel.detail}
									</p>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</PageContainer>
	);
}
