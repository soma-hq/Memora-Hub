"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Badge, Button, Icon, SectionHeaderBanner, Tag } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/core/structures";
import type { ModerationFunction, PimStatus, PimPeriod, Dispositif } from "@/features/academy/momentum/types";
import { pimStatusVariantMap, dispositifVariantMap, periodVariantMap } from "@/features/academy/momentum/types";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/training",
	section: "protected",
	module: "personnel",
	description: "Espace Momentum — suivi des PIM, formations et bilans de l'entité.",
	requiredPermissions: [{ module: "personnel", action: "view" }],
	entityScoped: true,
});

// ─── Types locaux ─────────────────────────────────────────────────────────────

interface MockJunior {
	id: string;
	name: string;
	function: ModerationFunction;
	dispositif: Dispositif;
	currentPeriod: PimPeriod;
	pimStatus: PimStatus;
	referentName: string;
	startDate: string;
	progressPercent: number;
}

interface MockEvent {
	id: string;
	type: "vocal_rrj" | "vocal_rj" | "vocal_rr" | "formation" | "integration" | "live_participation";
	title: string;
	date: string;
	time?: string;
	juniorName?: string;
}

// ─── Données mock — remplacer par des appels API ─────────────────────────────

const MOCK_JUNIORS: MockJunior[] = [
	{
		id: "j1",
		name: "Amine C.",
		function: "Modération Discord",
		dispositif: "ATRIA",
		currentPeriod: "Période 1",
		pimStatus: "En cours",
		referentName: "Thomas R.",
		startDate: "2026-02-10",
		progressPercent: 35,
	},
	{
		id: "j2",
		name: "Léa M.",
		function: "Modération Twitch",
		dispositif: "PULSE",
		currentPeriod: "Période 2",
		pimStatus: "En cours",
		referentName: "Sarah D.",
		startDate: "2026-01-15",
		progressPercent: 72,
	},
	{
		id: "j3",
		name: "Kévin L.",
		function: "Modération YouTube",
		dispositif: "ATRIA",
		currentPeriod: "Période 1",
		pimStatus: "En Stand-by",
		referentName: "Thomas R.",
		startDate: "2026-02-20",
		progressPercent: 18,
	},
];

const MOCK_EVENTS: MockEvent[] = [
	{ id: "e1", type: "vocal_rrj", title: "Vocal bilan RRJ", date: "2026-03-10", time: "19:00", juniorName: "Léa M." },
	{
		id: "e2",
		type: "formation",
		title: "Session formation — Maîtrise Marsha",
		date: "2026-03-12",
		time: "18:30",
	},
	{ id: "e3", type: "vocal_rj", title: "Vocal RJ", date: "2026-03-14", time: "20:00", juniorName: "Amine C." },
];

// ─── Helpers d'affichage ──────────────────────────────────────────────────────

const EVENT_TYPE_CONFIG: Record<
	MockEvent["type"],
	{ label: string; color: string; icon: "chat" | "training" | "calendar" | "profile" | "star" | "flag" }
> = {
	vocal_rrj: { label: "Vocal RRJ", color: "text-warning-600 dark:text-warning-400", icon: "chat" },
	vocal_rj: { label: "Vocal RJ", color: "text-primary-600 dark:text-primary-400", icon: "chat" },
	vocal_rr: { label: "Vocal RR", color: "text-gray-600 dark:text-gray-400", icon: "chat" },
	formation: { label: "Formation", color: "text-success-600 dark:text-success-400", icon: "training" },
	integration: { label: "Intégration", color: "text-info-600 dark:text-info-400", icon: "flag" },
	live_participation: { label: "Live", color: "text-error-600 dark:text-error-400", icon: "star" },
};

/**
 * Formate une date ISO en chaîne lisible française.
 * @param iso - Date au format ISO (YYYY-MM-DD)
 */
function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

// ─── Composants internes ──────────────────────────────────────────────────────

/**
 * Card de résumé pour un Junior en PIM.
 * Cliquable — renvoie vers la FSI détaillée du Junior.
 */
function JuniorCard({ junior, groupId }: { junior: MockJunior; groupId: string }) {
	return (
		<Link href={`/hub/${groupId}/training/pim/${junior.id}`} className="block">
			<div className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-gray-600 dark:hover:bg-gray-900/60">
				{/* Avatar initial */}
				<div className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
					{junior.name.charAt(0)}
				</div>

				<div className="min-w-0 flex-1 space-y-1.5">
					{/* Nom + statut */}
					<div className="flex flex-wrap items-center gap-2">
						<p className="text-sm font-semibold text-gray-900 dark:text-white">{junior.name}</p>
						<Badge variant={pimStatusVariantMap[junior.pimStatus]} showDot={false}>
							{junior.pimStatus}
						</Badge>
					</div>

					{/* Fonction + dispositif + période */}
					<div className="flex flex-wrap items-center gap-1.5">
						<Tag color="gray">{junior.function}</Tag>
						<Badge variant={dispositifVariantMap[junior.dispositif]} showDot={false}>
							{junior.dispositif}
						</Badge>
						<Badge variant={periodVariantMap[junior.currentPeriod]} showDot={false}>
							{junior.currentPeriod}
						</Badge>
					</div>

					{/* Référent + date début */}
					<p className="text-xs text-gray-500 dark:text-gray-400">
						Référent : <span className="font-medium">{junior.referentName}</span>
						{" · "}
						Depuis le {formatDate(junior.startDate)}
					</p>

					{/* Barre de progression */}
					<div>
						<div className="mb-1 flex items-center justify-between">
							<span className="text-xs text-gray-500 dark:text-gray-400">Progression</span>
							<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
								{junior.progressPercent}%
							</span>
						</div>
						<div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
							<div
								className={cn(
									"h-full rounded-full transition-all",
									junior.progressPercent < 33
										? "bg-error-500"
										: junior.progressPercent < 66
											? "bg-warning-500"
											: "bg-success-500",
								)}
								style={{ width: `${junior.progressPercent}%` }}
							/>
						</div>
					</div>
				</div>

				<Icon name="chevronRight" size="sm" className="mt-1 shrink-0 text-gray-400 dark:text-gray-500" />
			</div>
		</Link>
	);
}

// ─── Page principale ──────────────────────────────────────────────────────────

/**
 * Hub principal Momentum — Marsha Academy.
 * Vue d'ensemble des PIM actives, des prochains événements et de l'espace de formation.
 * Chaque entrée est affiliée à l'entité courante (groupId) et à sa fonction.
 * @returns La page hub Momentum de l'entité
 */
export default function MomentumHubPage() {
	void PAGE_CONFIG;
	const { groupId } = useParams<{ groupId: string }>();

	const activePIMCount = MOCK_JUNIORS.filter((j) => j.pimStatus === "En cours").length;
	const standbyCount = MOCK_JUNIORS.filter((j) => j.pimStatus === "En Stand-by").length;

	return (
		<PageContainer
			title="Momentum"
			description="Marsha Academy — suivi des parcours d'intégration"
			actions={
				<Link href={`/hub/${groupId}/training/pim`}>
					<Button variant="primary" size="sm">
						<Icon name="plus" size="sm" />
						Nouvelle PIM
					</Button>
				</Link>
			}
		>
			<div className="space-y-6">
				{/* ── Section 1 : Accès rapide ── */}
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					<Link
						href={`/hub/${groupId}/training/pim`}
						className="group hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-700 dark:hover:bg-primary-900/10 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors dark:border-gray-700 dark:bg-gray-800"
					>
						<div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
							<Icon name="profile" size="md" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-sm font-semibold text-gray-900 dark:text-white">Suivi PIM</p>
							<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
								{MOCK_JUNIORS.length} Junior{MOCK_JUNIORS.length > 1 ? "s" : ""} suivis
							</p>
						</div>
						<Icon
							name="chevronRight"
							size="sm"
							className="text-gray-400 transition-transform group-hover:translate-x-0.5"
						/>
					</Link>

					<Link
						href={`/hub/${groupId}/training/formations`}
						className="group hover:border-success-300 hover:bg-success-50 dark:hover:border-success-700 dark:hover:bg-success-900/10 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors dark:border-gray-700 dark:bg-gray-800"
					>
						<div className="bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
							<Icon name="training" size="md" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-sm font-semibold text-gray-900 dark:text-white">Formations</p>
							<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
								Espace de formation autonome
							</p>
						</div>
						<Icon
							name="chevronRight"
							size="sm"
							className="text-gray-400 transition-transform group-hover:translate-x-0.5"
						/>
					</Link>

					<Link
						href={`/hub/${groupId}/training/calendar`}
						className="group hover:border-warning-300 hover:bg-warning-50 dark:hover:border-warning-700 dark:hover:bg-warning-900/10 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors dark:border-gray-700 dark:bg-gray-800"
					>
						<div className="bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
							<Icon name="calendar" size="md" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-sm font-semibold text-gray-900 dark:text-white">Calendrier</p>
							<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
								{MOCK_EVENTS.length} événement{MOCK_EVENTS.length > 1 ? "s" : ""} à venir
							</p>
						</div>
						<Icon
							name="chevronRight"
							size="sm"
							className="text-gray-400 transition-transform group-hover:translate-x-0.5"
						/>
					</Link>
				</div>

				{/* ── Section 2 : Juniors en PIM ── */}
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
					<SectionHeaderBanner
						icon="profile"
						title="Juniors en PIM"
						description="Parcours d'intégration actifs sur cette entité"
						accentColor="primary"
						className="rounded-none"
					>
						<div className="flex items-center gap-2">
							{activePIMCount > 0 && <Badge variant="warning">{activePIMCount} en cours</Badge>}
							{standbyCount > 0 && <Badge variant="neutral">{standbyCount} en stand-by</Badge>}
						</div>
					</SectionHeaderBanner>

					{MOCK_JUNIORS.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
							<Icon name="profile" size="lg" className="text-gray-300 dark:text-gray-600" />
							<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Aucun Junior en PIM pour cette entité.
							</p>
							<p className="text-xs text-gray-400 dark:text-gray-500">
								Invitez un modérateur via un lien d'invitation avec l'option PIM activée.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-2">
							{MOCK_JUNIORS.map((junior) => (
								<JuniorCard key={junior.id} junior={junior} groupId={groupId} />
							))}
						</div>
					)}
				</div>

				{/* ── Section 3 : Prochains événements ── */}
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
					<SectionHeaderBanner
						icon="calendar"
						title="Prochains événements"
						description="Vocaux bilans, formations et sessions à venir"
						accentColor="gray"
						className="rounded-none"
					>
						<Link href={`/hub/${groupId}/training/calendar`}>
							<Button variant="outline-neutral" size="sm">
								Voir tout
							</Button>
						</Link>
					</SectionHeaderBanner>

					{MOCK_EVENTS.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
							<Icon name="calendar" size="lg" className="text-gray-300 dark:text-gray-600" />
							<p className="text-sm text-gray-500 dark:text-gray-400">Aucun événement planifié.</p>
						</div>
					) : (
						<div className="divide-y divide-gray-100 dark:divide-gray-700/50">
							{MOCK_EVENTS.map((event) => {
								const cfg = EVENT_TYPE_CONFIG[event.type];
								return (
									<div key={event.id} className="flex items-center gap-4 px-4 py-3">
										{/* Date */}
										<div className="w-16 shrink-0 text-right">
											<p className="text-xs font-semibold text-gray-900 dark:text-white">
												{formatDate(event.date)}
											</p>
											{event.time && (
												<p className="text-xs text-gray-500 dark:text-gray-400">{event.time}</p>
											)}
										</div>

										{/* Séparateur vertical */}
										<div className="h-8 w-px shrink-0 bg-gray-200 dark:bg-gray-700" />

										{/* Icône type */}
										<div
											className={cn(
												"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700/50",
												cfg.color,
											)}
										>
											<Icon name={cfg.icon} size="sm" />
										</div>

										{/* Infos */}
										<div className="min-w-0 flex-1">
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{event.title}
											</p>
											{event.juniorName && (
												<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
													avec {event.juniorName}
												</p>
											)}
										</div>

										<Tag color="gray">{cfg.label}</Tag>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</PageContainer>
	);
}
