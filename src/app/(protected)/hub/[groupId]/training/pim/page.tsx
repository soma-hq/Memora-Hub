"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Badge, Button, Icon, Modal, ModalFooter, Input, SectionHeaderBanner, Select, Tag } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/core/structures";
import {
	pimStatusVariantMap,
	dispositifVariantMap,
	periodVariantMap,
	DISPOSITIFS,
	MODERATION_FUNCTIONS,
	PIM_STATUSES,
	type ModerationFunction,
	type Dispositif,
	type PimStatus,
	type PimPeriod,
} from "@/features/academy/momentum/types";
import { showSuccess } from "@/lib/utils/toast";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/training/pim",
	section: "protected",
	module: "personnel",
	description: "Liste des PIM actives et archivées pour cette entité.",
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

// ─── Mock data ────────────────────────────────────────────────────────────────

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
	{
		id: "j4",
		name: "Nina B.",
		function: "Modération Discord",
		dispositif: "ATRIA",
		currentPeriod: "Période 2",
		pimStatus: "Réalisée",
		referentName: "Marc V.",
		startDate: "2025-11-01",
		progressPercent: 100,
	},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Liste des PIM de l'entité — overview de tous les Juniors avec filtres de statut.
 * La Legacy peut créer une nouvelle PIM depuis cette page.
 * @returns La page de suivi des PIM
 */
export default function PimListPage() {
	void PAGE_CONFIG;
	const { groupId } = useParams<{ groupId: string }>();
	const [statusFilter, setStatusFilter] = useState<PimStatus | "all">("all");
	const [newPimOpen, setNewPimOpen] = useState(false);

	const filtered = statusFilter === "all" ? MOCK_JUNIORS : MOCK_JUNIORS.filter((j) => j.pimStatus === statusFilter);

	return (
		<PageContainer
			title="Suivi PIM"
			description="Périodes d'intégration de modération — toutes les cohortes"
			actions={
				<Button variant="primary" size="sm" onClick={() => setNewPimOpen(true)}>
					<Icon name="plus" size="sm" />
					Nouvelle PIM
				</Button>
			}
		>
			<div className="space-y-4">
				{/* Fil d'ariane */}
				<nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
					<Link href={`/hub/${groupId}/training`} className="hover:text-gray-700 dark:hover:text-gray-200">
						Momentum
					</Link>
					<Icon name="chevronRight" size="xs" />
					<span className="font-medium text-gray-900 dark:text-white">Suivi PIM</span>
				</nav>

				{/* Filtres de statut */}
				<div className="flex flex-wrap items-center gap-2">
					<button
						onClick={() => setStatusFilter("all")}
						className={cn(
							"rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
							statusFilter === "all"
								? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
						)}
					>
						Tous ({MOCK_JUNIORS.length})
					</button>
					{PIM_STATUSES.map((status) => {
						const count = MOCK_JUNIORS.filter((j) => j.pimStatus === status).length;
						if (count === 0) return null;
						return (
							<button
								key={status}
								onClick={() => setStatusFilter(status)}
								className={cn(
									"rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
									statusFilter === status
										? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
								)}
							>
								{status} ({count})
							</button>
						);
					})}
				</div>

				{/* Liste des Juniors */}
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
					<SectionHeaderBanner
						icon="profile"
						title="Parcours individuels"
						description="Cliquer sur un Junior pour accéder à sa FSI complète"
						accentColor="primary"
						className="rounded-none"
					>
						<span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
							{filtered.length}
						</span>
					</SectionHeaderBanner>

					{filtered.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
							<Icon name="profile" size="lg" className="text-gray-300 dark:text-gray-600" />
							<p className="text-sm text-gray-500 dark:text-gray-400">Aucun Junior pour ce filtre.</p>
						</div>
					) : (
						<div className="divide-y divide-gray-100 dark:divide-gray-700/50">
							{filtered.map((junior) => (
								<Link key={junior.id} href={`/hub/${groupId}/training/pim/${junior.id}`}>
									<div className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
										{/* Avatar */}
										<div className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
											{junior.name.charAt(0)}
										</div>

										<div className="min-w-0 flex-1">
											<div className="flex flex-wrap items-center gap-2">
												<p className="text-sm font-semibold text-gray-900 dark:text-white">
													{junior.name}
												</p>
												<Badge variant={pimStatusVariantMap[junior.pimStatus]} showDot={false}>
													{junior.pimStatus}
												</Badge>
											</div>
											<div className="mt-1 flex flex-wrap items-center gap-1.5">
												<Tag color="gray">{junior.function}</Tag>
												<Badge
													variant={dispositifVariantMap[junior.dispositif]}
													showDot={false}
												>
													{junior.dispositif}
												</Badge>
												<Badge variant={periodVariantMap[junior.currentPeriod]} showDot={false}>
													{junior.currentPeriod}
												</Badge>
											</div>
										</div>

										{/* Infos droite */}
										<div className="hidden shrink-0 text-right sm:block">
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Référent : <span className="font-medium">{junior.referentName}</span>
											</p>
											<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
												Depuis {formatDate(junior.startDate)}
											</p>
										</div>

										{/* Progression */}
										<div className="hidden w-24 shrink-0 md:block">
											<div className="mb-1 flex items-center justify-between">
												<span className="text-xs text-gray-500">{junior.progressPercent}%</span>
											</div>
											<div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
												<div
													className={cn(
														"h-full rounded-full",
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

										<Icon
											name="chevronRight"
											size="sm"
											className="shrink-0 text-gray-400 dark:text-gray-500"
										/>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Modal nouvelle PIM */}
			<Modal isOpen={newPimOpen} onClose={() => setNewPimOpen(false)} title="Nouvelle PIM" size="md">
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						showSuccess("PIM créée — Le Junior recevra une notification.");
						setNewPimOpen(false);
					}}
				>
					<p className="text-sm text-gray-600 dark:text-gray-300">
						Créer une nouvelle Période d'Intégration de Modération pour un Junior de cette entité. Le Junior
						doit avoir accepté son invitation avec l'option PIM activée.
					</p>

					<Input label="Nom du Junior" placeholder="ex. Amine C." required />

					<Select
						label="Fonction"
						options={MODERATION_FUNCTIONS.map((f) => ({ value: f, label: f }))}
						required
					/>

					<Select label="Dispositif" options={DISPOSITIFS.map((d) => ({ value: d, label: d }))} required />

					<Input label="Référent assigné" placeholder="Nom du référent" required />
					<Input label="Date de début" type="date" required />

					<ModalFooter>
						<Button variant="cancel" type="button" onClick={() => setNewPimOpen(false)}>
							Annuler
						</Button>
						<Button type="submit">Créer la PIM</Button>
					</ModalFooter>
				</form>
			</Modal>
		</PageContainer>
	);
}
