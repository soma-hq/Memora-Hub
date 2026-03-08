// Data & templates — Momentum ecosystem
// Voir COMMENTARIES.md pour la documentation fonctionnelle complète.

import type { CompetencyTemplate, Competency, ModerationFunction, Dispositif, PimSession, Formation } from "./types";

// ─── Templates de compétences — Mod. Live / ATRIA ────────────────────────────
// Appliqué aux Juniors Twitch et YouTube sans expérience de modération préalable.

const LIVE_ATRIA_TEMPLATES: Omit<CompetencyTemplate, "id" | "function">[] = [
	// Techniques
	{
		name: "Maîtrise des outils",
		category: "technique",
		dispositif: "ATRIA",
		description:
			"Maîtrise de Twitch, YouTube et Discord dans leurs fonctionnalités essentielles (timeout, ban, suppression de messages, gestion des utilisateurs).",
	},
	{
		name: "Réactivité",
		category: "technique",
		dispositif: "ATRIA",
		description:
			"Capacité à agir vite et s'adapter à toute situation en live : suivre les annonces Discord, relayer les infos spontanées du staff, réagir aux imprévus.",
	},
	{
		name: "Capacité rédactionnelle",
		category: "technique",
		dispositif: "ATRIA",
		description:
			"Rédiger des messages clairs, structurés et sans fautes — reflétant sérieux et professionnalisme dans les interactions avec la communauté.",
	},
	{
		name: "Vitesse de modération",
		category: "technique",
		dispositif: "ATRIA",
		description:
			"Intervenir régulièrement et de manière adaptée. Indicatif : < 10 actions/h = insuffisant, 10–30 = correct, > 30 = très satisfaisant.",
	},
	// Sociales
	{
		name: "Travail en équipe",
		category: "sociale",
		dispositif: "ATRIA",
		description:
			"Partager les informations importantes, oser poser des questions et soutenir les autres modérateurs dans leurs actions.",
	},
	{
		name: "Communication",
		category: "sociale",
		dispositif: "ATRIA",
		description:
			"S'exprimer de manière claire, précise et respectueuse — adapter le ton selon la situation sans interrompre.",
	},
	// Professionnelles
	{
		name: "Neutralité",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Rester impartial en toutes circonstances, traiter chaque spectateur de manière égale, baser les décisions sur le panel de sanctions.",
	},
	{
		name: "Gestion des conflits",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Identifier rapidement les tensions, intervenir avec un ton calme et neutre, coordonner avec les collègues si nécessaire.",
	},
	{
		name: "Veille & anticipation",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Anticiper les comportements à risque et rester vigilant pour prévenir les problèmes avant qu'ils n'affectent le live.",
	},
	{
		name: "Respect hiérarchique",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Connaître ses limites, garder les formes de politesse, écouter avant de répondre, accepter les retours comme opportunité d'apprendre.",
	},
	{
		name: "Assiduité et présences",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Lire et réagir aux annonces, annoter le salon absence, signaler rapidement toute absence ou indisponibilité.",
	},
	{
		name: "Suivi des consignes",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Appliquer les directives des référents, ne pas prendre d'initiatives non autorisées, poser des questions si les instructions ne sont pas claires.",
	},
	{
		name: "Connaissance des règles",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Connaître, comprendre et suivre les règles mises en place — se référer au règlement avant toute décision.",
	},
	{
		name: "Attitude face aux situations problématiques",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Rester calme et neutre, connaître ses limites, ne pas réagir de façon impulsive, suivre les procédures établies.",
	},
];

// ─── Templates de compétences — Mod. Live / PULSE ────────────────────────────
// Appliqué aux Juniors Twitch et YouTube avec expérience de modération préalable.

const LIVE_PULSE_TEMPLATES: Omit<CompetencyTemplate, "id" | "function">[] = [
	// Techniques
	{
		name: "Capacité rédactionnelle",
		category: "technique",
		dispositif: "PULSE",
		description: "Maintenir une rédaction soignée, structurée, sans fautes — même face à un rythme exigeant.",
	},
	{
		name: "Vitesse de modération",
		category: "technique",
		dispositif: "PULSE",
		description:
			"Maintenir un rythme efficace et précis. Indicatif : < 30 actions/h = limité, 30–50 = efficace, > 50 = excellent.",
	},
	{
		name: "Apprentissage des outils spécifiques",
		category: "technique",
		dispositif: "PULSE",
		description: "Connaître les outils spécifiques du créateur de contenu et s'adapter aux méthodes apprises.",
	},
	// Sociales
	{
		name: "Compréhension de la culture communautaire",
		category: "sociale",
		dispositif: "PULSE",
		description: "Comprendre le ton, l'humour, les habitudes et les valeurs de la communauté avant d'agir.",
	},
	{
		name: "Communication avec l'équipe",
		category: "sociale",
		dispositif: "PULSE",
		description:
			"Informer les collègues de ses actions, relayer les situations complexes, ne pas prendre d'initiatives sans en parler au référent.",
	},
	// Professionnelles
	{
		name: "Transposition d'expérience",
		category: "professionnelle",
		dispositif: "PULSE",
		description:
			"Réutiliser les acquis des expériences passées tout en s'adaptant aux nouvelles méthodes et spécificités de la communauté.",
	},
	{
		name: "Adaptation aux nouvelles règles",
		category: "professionnelle",
		dispositif: "PULSE",
		description:
			"Se tenir informé des nouvelles directives, les appliquer de façon cohérente même si elles diffèrent des pratiques précédentes.",
	},
	{
		name: "Cohérence d'application",
		category: "professionnelle",
		dispositif: "PULSE",
		description: "Agir selon le panel de sanctions de manière impartiale, quelle que soit la personne concernée.",
	},
	{
		name: "Gestion des conflits",
		category: "professionnelle",
		dispositif: "PULSE",
		description:
			"Identifier rapidement les tensions, intervenir avec un ton calme et neutre, coordonner avec les collègues si nécessaire.",
	},
	{
		name: "Respect hiérarchique",
		category: "professionnelle",
		dispositif: "PULSE",
		description:
			"Connaître ses limites, garder les formes de politesse, écouter avant de répondre, accepter les retours.",
	},
	{
		name: "Assiduité et présences",
		category: "professionnelle",
		dispositif: "PULSE",
		description: "Lire et réagir aux annonces, annoter le salon absence, signaler toute absence rapidement.",
	},
	{
		name: "Suivi des consignes",
		category: "professionnelle",
		dispositif: "PULSE",
		description:
			"Appliquer les directives des référents, respecter l'ordre hiérarchique, poser des questions si nécessaire.",
	},
	{
		name: "Attitude face aux situations problématiques",
		category: "professionnelle",
		dispositif: "PULSE",
		description:
			"Rester calme, connaître ses limites, ne pas réagir de façon impulsive, suivre les procédures établies.",
	},
];

// ─── Templates de compétences — Mod. Discord / ATRIA ─────────────────────────
// Appliqué aux Juniors Discord sans expérience de modération préalable.

const DISCORD_ATRIA_TEMPLATES: Omit<CompetencyTemplate, "id" | "function">[] = [
	// Techniques
	{
		name: "Maîtrise de Discord",
		category: "technique",
		dispositif: "ATRIA",
		description: "Utiliser les bons salons, maîtriser les threads et les logs Discord.",
	},
	{
		name: "Maîtrise de Marsha",
		category: "technique",
		dispositif: "ATRIA",
		description:
			"Créer, consulter, modifier et supprimer des infractions dans Marsha. Supprimer des messages correctement.",
	},
	{
		name: "Réactivité",
		category: "technique",
		dispositif: "ATRIA",
		description:
			"Suivre les annonces Discord, prendre en compte les reports rapidement, s'adapter aux consignes spontanées du staff.",
	},
	{
		name: "Capacité rédactionnelle",
		category: "technique",
		dispositif: "ATRIA",
		description: "Rédiger des messages clairs, structurés et sans fautes — reflétant sérieux et professionnalisme.",
	},
	// Sociales
	{
		name: "Travail en équipe",
		category: "sociale",
		dispositif: "ATRIA",
		description:
			"Partager les informations importantes, oser poser des questions et soutenir les autres modérateurs.",
	},
	{
		name: "Communication",
		category: "sociale",
		dispositif: "ATRIA",
		description: "S'exprimer de manière claire, précise et respectueuse — adapter le ton selon la situation.",
	},
	// Professionnelles
	{
		name: "Sanctions graduées",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Identifier la sanction appropriée (warn, mute, kick, ban), l'appliquer de manière cohérente et juste.",
	},
	{
		name: "Raisons de sanctions professionnelles",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Documenter clairement les motifs d'une sanction — précis, compréhensibles, reliés aux règles enfreintes.",
	},
	{
		name: "Preuves sur les sanctions",
		category: "professionnelle",
		dispositif: "ATRIA",
		description: "Collecter les captures d'écran ou logs pertinents et les associer correctement aux sanctions.",
	},
	{
		name: "Gestion des conflits",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Identifier rapidement les tensions, intervenir de manière neutre et efficace, proposer des solutions adaptées.",
	},
	{
		name: "Gestion des tickets",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Répondre correctement aux tickets, les suivre jusqu'à leur clôture, les prioriser selon l'urgence.",
	},
	{
		name: "Gestion des signalements",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Analyser les signalements, évaluer leur validité, appliquer une action appropriée, suivre jusqu'à résolution.",
	},
	{
		name: "Sang-froid & impartialité",
		category: "professionnelle",
		dispositif: "ATRIA",
		description: "Rester neutre face aux conflits et provocations, appliquer les règles sans favoritisme.",
	},
	{
		name: "Diplomatie et communication",
		category: "professionnelle",
		dispositif: "ATRIA",
		description: "Expliquer les décisions de manière respectueuse, assurer une médiation pacifique des tensions.",
	},
	{
		name: "Prise de décision rapide",
		category: "professionnelle",
		dispositif: "ATRIA",
		description:
			"Réagir rapidement aux incidents, choisir la sanction appropriée sans hésitation, prioriser selon l'urgence.",
	},
];

// ─── Templates de compétences — Mod. Discord / PULSE ─────────────────────────
// En cours de définition par l'équipe Momentum — fallback vers ATRIA pour l'instant.

const DISCORD_PULSE_TEMPLATES: Omit<CompetencyTemplate, "id" | "function">[] = [
	{
		name: "Maîtrise des outils spécifiques",
		category: "technique",
		dispositif: "PULSE",
		description: "S'adapter aux outils et pratiques Discord propres à la communauté rejointe.",
	},
	{
		name: "Cohérence d'application",
		category: "professionnelle",
		dispositif: "PULSE",
		description: "Agir selon le panel de sanctions de manière impartiale, quelle que soit la personne concernée.",
	},
	{
		name: "Transposition d'expérience",
		category: "professionnelle",
		dispositif: "PULSE",
		description: "Réutiliser les acquis des expériences passées tout en s'adaptant aux nouvelles méthodes.",
	},
	{
		name: "Adaptation aux nouvelles règles",
		category: "professionnelle",
		dispositif: "PULSE",
		description: "Intégrer rapidement les nouvelles directives Discord de la communauté.",
	},
	{
		name: "Gestion des conflits",
		category: "professionnelle",
		dispositif: "PULSE",
		description: "Désamorcer les tensions et maintenir un environnement respectueux.",
	},
	{
		name: "Prise de décision rapide",
		category: "professionnelle",
		dispositif: "PULSE",
		description: "Agir rapidement face aux incidents avec précision et pertinence.",
	},
];

// ─── Index des templates par fonction + dispositif ────────────────────────────

type TemplateKey = `${ModerationFunction}|${Dispositif}`;

/**
 * Mappe une fonction + un dispositif vers les templates de compétences correspondants.
 * Les fonctions Live (Twitch, YouTube) partagent les mêmes templates.
 */
const TEMPLATE_MAP: Record<TemplateKey, Omit<CompetencyTemplate, "id" | "function">[]> = {
	"Modération Twitch|ATRIA": LIVE_ATRIA_TEMPLATES,
	"Modération Twitch|PULSE": LIVE_PULSE_TEMPLATES,
	"Modération YouTube|ATRIA": LIVE_ATRIA_TEMPLATES,
	"Modération YouTube|PULSE": LIVE_PULSE_TEMPLATES,
	"Modération Discord|ATRIA": DISCORD_ATRIA_TEMPLATES,
	"Modération Discord|PULSE": DISCORD_PULSE_TEMPLATES,
	"Modération Polyvalente|ATRIA": [...DISCORD_ATRIA_TEMPLATES, ...LIVE_ATRIA_TEMPLATES.slice(0, 4)],
	"Modération Polyvalente|PULSE": [...DISCORD_PULSE_TEMPLATES, ...LIVE_PULSE_TEMPLATES.slice(0, 3)],
};

/**
 * Génère les compétences initiales pour un Junior selon sa fonction et son dispositif.
 * Toutes les compétences sont initialisées à "Non acquise".
 *
 * @param func - Fonction de modération du Junior
 * @param dispositif - Dispositif de formation (ATRIA ou PULSE)
 * @param overrides - Surcharges optionnelles de niveau par nom de compétence
 * @returns Tableau de compétences hydratées prêtes pour la FSI
 */
export function generateCompetenciesForJunior(
	func: ModerationFunction,
	dispositif: Dispositif,
	overrides: Partial<Record<string, { level: Competency["level"]; evaluatedBy?: string; evaluatedAt?: string }>> = {},
): Competency[] {
	const key: TemplateKey = `${func}|${dispositif}`;
	const templates = TEMPLATE_MAP[key] ?? [];

	return templates.map((t, i) => {
		const override = overrides[t.name];
		return {
			id: `comp-${func.replace(/[\s.]/g, "").toLowerCase()}-${dispositif.toLowerCase()}-${i}`,
			name: t.name,
			description: t.description,
			category: t.category,
			function: func,
			dispositif: t.dispositif,
			level: override?.level ?? "Non acquise",
			evaluatedBy: override?.evaluatedBy,
			evaluatedAt: override?.evaluatedAt,
		};
	});
}

// ─── Données initiales ────────────────────────────────────────────────────────

/** Sessions PIM actives — initialement vide, alimenté via l'API */
export const sessions: PimSession[] = [];

/** Formations disponibles — initialement vide, alimenté via l'API ou le CMS */
export const formations: Formation[] = [];

// ─── Legacy export (rétrocompatibilité) ──────────────────────────────────────

/**
 * @deprecated Utiliser generateCompetenciesForJunior à la place.
 * Conservé pour éviter les imports cassés dans les composants existants.
 */
export const COMPETENCY_TEMPLATES = TEMPLATE_MAP;
