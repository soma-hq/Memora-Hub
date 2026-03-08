"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Badge, Button, Icon, SectionHeaderBanner } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/core/structures";
import type { ModerationFunction, Dispositif, FormationStatus } from "@/features/academy/momentum/types";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/training/formations",
	section: "protected",
	module: "personnel",
	description: "Espace de formation autonome Momentum — modules par entité et fonction.",
	requiredPermissions: [{ module: "personnel", action: "view" }],
	entityScoped: true,
});

// ─── Types locaux ─────────────────────────────────────────────────────────────

interface MockFormation {
	id: string;
	title: string;
	description: string;
	banner: string;
	entityId: string | "global";
	entityName: string;
	function: ModerationFunction | "Toutes";
	dispositif: Dispositif | "Tous";
	durationMinutes: number;
	modules: string[];
	status: FormationStatus;
}

// ─── Données mock — remplacer par des appels API ──────────────────────────────

const MOCK_FORMATIONS: MockFormation[] = [
	{
		id: "f1",
		title: "Introduction à la modération Discord",
		description: "Les bases de Discord : salons, threads, logs, rôles et bonnes pratiques de communication.",
		banner: "/banners/memora-banner.png",
		entityId: "global",
		entityName: "Memora",
		function: "Modération Discord",
		dispositif: "ATRIA",
		durationMinutes: 45,
		modules: ["Navigation Discord", "Rôles & permissions", "Logs & threads", "Communication d'équipe"],
		status: "completed",
	},
	{
		id: "f2",
		title: "Maîtrise de Marsha Bot",
		description:
			"Commandes essentielles de Marsha : infractions, timeouts, suppressions de messages et cas complexes.",
		banner: "/banners/memora-banner.png",
		entityId: "global",
		entityName: "Memora",
		function: "Modération Discord",
		dispositif: "ATRIA",
		durationMinutes: 60,
		modules: ["Commandes de base", "Gestion des infractions", "Suppression de messages", "Cas complexes"],
		status: "in_progress",
	},
	{
		id: "f3",
		title: "Modération Twitch — Les fondamentaux",
		description: "Outils Twitch, chat, commandes de modération et réactivité en live.",
		banner: "/banners/anthony/anthony-banner.png",
		entityId: "anthony",
		entityName: "Anthony",
		function: "Modération Twitch",
		dispositif: "ATRIA",
		durationMinutes: 50,
		modules: ["Interface Twitch", "Commandes /ban /timeout", "Gestion du chat en live", "Coordination Discord"],
		status: "not_started",
	},
	{
		id: "f4",
		title: "Gestion avancée du chat Twitch",
		description: "Optimiser sa vitesse de modération, anticiper les raids et gérer les conflits en live.",
		banner: "/banners/anthony/anthony-banner.png",
		entityId: "anthony",
		entityName: "Anthony",
		function: "Modération Twitch",
		dispositif: "PULSE",
		durationMinutes: 40,
		modules: ["Vitesse et précision", "Gestion des raids", "Conflits en live", "Coordination d'équipe"],
		status: "not_started",
	},
	{
		id: "f5",
		title: "Modération YouTube — Spécificités de la plateforme",
		description: "Outils YouTube Studio, modération des commentaires et signalements.",
		banner: "/banners/inoxtag/inoxtag-banner.png",
		entityId: "inoxtag",
		entityName: "Inoxtag",
		function: "Modération YouTube",
		dispositif: "ATRIA",
		durationMinutes: 35,
		modules: ["YouTube Studio", "Modération des commentaires", "Signalements", "Directives communautaires"],
		status: "not_started",
	},
	{
		id: "f6",
		title: "Panel de sanctions — Application et cohérence",
		description: "Appliquer le panel de sanctions de manière impartiale et cohérente sur toutes les plateformes.",
		banner: "/banners/doigby/doigby-banner.png",
		entityId: "doigby",
		entityName: "Doigby",
		function: "Toutes",
		dispositif: "Tous",
		durationMinutes: 30,
		modules: ["Lecture du panel", "Sanctions graduées", "Récidives", "Documentation des raisons"],
		status: "not_started",
	},
	{
		id: "f7",
		title: "Gestion des conflits et sang-froid",
		description: "Garder son calme face aux provocations, désamorcer les tensions et maintenir l'impartialité.",
		banner: "/banners/memora-banner.png",
		entityId: "global",
		entityName: "Memora",
		function: "Toutes",
		dispositif: "Tous",
		durationMinutes: 25,
		modules: ["Rester neutre", "Désamorçage", "Escalade et référent", "Auto-évaluation"],
		status: "not_started",
	},
	{
		id: "f8",
		title: "Modération Polyvalente — Discord & Twitch simultanés",
		description: "Gérer efficacement deux plateformes en parallèle : priorisation, coordination et réactivité.",
		banner: "/banners/memora-banner.png",
		entityId: "global",
		entityName: "Memora",
		function: "Modération Polyvalente",
		dispositif: "Tous",
		durationMinutes: 55,
		modules: [
			"Organisation dual-platform",
			"Priorisation des actions",
			"Outils Discord + Twitch",
			"Coordination avec le staff",
		],
		status: "not_started",
	},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type FunctionFilter = ModerationFunction | "Toutes";
type DispositifFilter = Dispositif | "Tous";

const STATUS_CONFIG: Record<FormationStatus, { label: string; variant: "success" | "warning" | "neutral" }> = {
	completed: { label: "Terminé", variant: "success" },
	in_progress: { label: "En cours", variant: "warning" },
	not_started: { label: "Non commencé", variant: "neutral" },
};

const FUNCTION_FILTERS: Array<{ value: FunctionFilter; label: string }> = [
	{ value: "Toutes", label: "Toutes" },
	{ value: "Modération Discord", label: "Discord" },
	{ value: "Modération Twitch", label: "Twitch" },
	{ value: "Modération YouTube", label: "YouTube" },
	{ value: "Modération Polyvalente", label: "Polyvalente" },
];

const DISPOSITIF_FILTERS: Array<{ value: DispositifFilter; label: string }> = [
	{ value: "Tous", label: "Tous" },
	{ value: "ATRIA", label: "ATRIA" },
	{ value: "PULSE", label: "PULSE" },
];

function formatDuration(minutes: number): string {
	if (minutes < 60) return `${minutes} min`;
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return m > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`;
}

function statusLabel(status: FormationStatus): string {
	if (status === "completed") return "Revoir";
	if (status === "in_progress") return "Continuer";
	return "Commencer";
}

// ─── Composants ───────────────────────────────────────────────────────────────

/**
 * Card de formation autonome avec bannière entité.
 * Affiche le statut de complétion, la durée et les modules.
 */
function FormationCard({ formation }: { formation: MockFormation }) {
	const statusCfg = STATUS_CONFIG[formation.status];

	return (
		<div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-gray-900/40">
			{/* Bannière entité */}
			<div className="relative h-24 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
				<Image
					src={formation.banner}
					alt={formation.entityName}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
				{/* Overlay dégradé pour lisibilité */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
				{/* Nom de l'entité */}
				<p className="absolute bottom-2 left-3 text-xs font-medium text-white/90">{formation.entityName}</p>
				{/* Badge statut */}
				<div className="absolute top-2 right-2">
					<Badge variant={statusCfg.variant} showDot={false}>
						{statusCfg.label}
					</Badge>
				</div>
			</div>

			{/* Contenu */}
			<div className="flex flex-1 flex-col gap-3 p-4">
				<div>
					<p className="text-sm font-semibold text-gray-900 dark:text-white">{formation.title}</p>
					<p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
						{formation.description}
					</p>
				</div>

				{/* Méta */}
				<div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
					<Icon name="calendar" size="xs" />
					<span>{formatDuration(formation.durationMinutes)}</span>
					<span className="text-gray-300 dark:text-gray-600">·</span>
					<Icon name="training" size="xs" />
					<span>
						{formation.modules.length} module{formation.modules.length > 1 ? "s" : ""}
					</span>
				</div>

				{/* Modules */}
				<div className="flex flex-wrap gap-1">
					{formation.modules.slice(0, 3).map((mod) => (
						<span
							key={mod}
							className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
						>
							{mod}
						</span>
					))}
					{formation.modules.length > 3 && (
						<span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400 dark:bg-gray-700 dark:text-gray-500">
							+{formation.modules.length - 3}
						</span>
					)}
				</div>

				{/* Barre de progression (si en cours) */}
				{formation.status === "in_progress" && (
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
						<div className="bg-warning-500 h-full w-1/2 rounded-full" />
					</div>
				)}
				{formation.status === "completed" && (
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
						<div className="bg-success-500 h-full w-full rounded-full" />
					</div>
				)}

				{/* CTA */}
				<Button
					variant={formation.status === "completed" ? "outline-neutral" : "primary"}
					size="sm"
					className="mt-auto w-full"
				>
					{statusLabel(formation.status)}
				</Button>
			</div>
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Espace de formation autonome Momentum.
 * Modules filtrés selon la fonction et le dispositif.
 * Chaque formation affiche une bannière propre à son entité.
 * @returns La page formations Momentum
 */
export default function MomentumFormationsPage() {
	void PAGE_CONFIG;
	const { groupId } = useParams<{ groupId: string }>();
	const [funcFilter, setFuncFilter] = useState<FunctionFilter>("Toutes");
	const [dispositifFilter, setDispositifFilter] = useState<DispositifFilter>("Tous");

	const filtered = MOCK_FORMATIONS.filter((f) => {
		const funcMatch = funcFilter === "Toutes" || f.function === "Toutes" || f.function === funcFilter;
		const dispMatch = dispositifFilter === "Tous" || f.dispositif === "Tous" || f.dispositif === dispositifFilter;
		return funcMatch && dispMatch;
	});

	const completedCount = MOCK_FORMATIONS.filter((f) => f.status === "completed").length;
	const inProgressCount = MOCK_FORMATIONS.filter((f) => f.status === "in_progress").length;

	return (
		<PageContainer title="Espace de formation" description="Modules de formation autonome Momentum">
			<div className="space-y-4">
				{/* Fil d'ariane */}
				<nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
					<Link href={`/hub/${groupId}/training`} className="hover:text-gray-700 dark:hover:text-gray-200">
						Momentum
					</Link>
					<Icon name="chevronRight" size="xs" />
					<span className="font-medium text-gray-900 dark:text-white">Formations</span>
				</nav>

				{/* Carte de résumé */}
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
					<SectionHeaderBanner
						icon="training"
						title="Formations disponibles"
						description="Apprenez en autonomie selon votre fonction et votre dispositif"
						accentColor="green"
						className="rounded-none"
					>
						<div className="flex items-center gap-2">
							{completedCount > 0 && (
								<Badge variant="success" showDot={false}>
									{completedCount} terminé{completedCount > 1 ? "s" : ""}
								</Badge>
							)}
							{inProgressCount > 0 && (
								<Badge variant="warning" showDot={false}>
									{inProgressCount} en cours
								</Badge>
							)}
						</div>
					</SectionHeaderBanner>

					<div className="space-y-3 p-4">
						{/* Filtre par fonction */}
						<div className="flex flex-wrap items-center gap-2">
							<span className="text-xs font-medium text-gray-500 dark:text-gray-400">Fonction :</span>
							{FUNCTION_FILTERS.map(({ value, label }) => (
								<button
									key={value}
									onClick={() => setFuncFilter(value)}
									className={cn(
										"rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
										funcFilter === value
											? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
									)}
								>
									{label}
								</button>
							))}
						</div>

						{/* Filtre par dispositif */}
						<div className="flex flex-wrap items-center gap-2">
							<span className="text-xs font-medium text-gray-500 dark:text-gray-400">Dispositif :</span>
							{DISPOSITIF_FILTERS.map(({ value, label }) => (
								<button
									key={value}
									onClick={() => setDispositifFilter(value)}
									className={cn(
										"rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
										dispositifFilter === value
											? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
									)}
								>
									{label}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Grille de formations */}
				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-12 text-center dark:border-gray-700 dark:bg-gray-800">
						<Icon name="training" size="lg" className="text-gray-300 dark:text-gray-600" />
						<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Aucune formation pour ces filtres.
						</p>
						<p className="text-xs text-gray-400 dark:text-gray-500">
							Essayez de modifier la fonction ou le dispositif.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{filtered.map((formation) => (
							<FormationCard key={formation.id} formation={formation} />
						))}
					</div>
				)}
			</div>
		</PageContainer>
	);
}
