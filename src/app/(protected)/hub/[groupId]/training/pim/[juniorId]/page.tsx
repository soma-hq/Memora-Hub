"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import {
	Badge,
	Button,
	Icon,
	Modal,
	ModalFooter,
	Input,
	SectionHeaderBanner,
	Tabs,
	Tag,
	Textarea,
} from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/core/structures";
import {
	pimStatusVariantMap,
	dispositifVariantMap,
	periodVariantMap,
	competencyLevelVariantMap,
	COMPETENCY_LEVELS,
	type CompetencyLevel,
} from "@/features/academy/momentum/types";
import { generateCompetenciesForJunior } from "@/features/academy/momentum/data";
import { showSuccess } from "@/lib/utils/toast";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/training/pim/[juniorId]",
	section: "protected",
	module: "personnel",
	description: "Fiche de Suivi Individuel d'un Junior en PIM.",
	requiredPermissions: [{ module: "personnel", action: "view" }],
	entityScoped: true,
});

// ─── Mock data — junior complet ───────────────────────────────────────────────

const MOCK_JUNIOR = {
	id: "j1",
	name: "Amine C.",
	function: "Modération Discord" as const,
	dispositif: "ATRIA" as const,
	currentPeriod: "Période 1" as const,
	pimStatus: "En cours" as const,
	referentName: "Thomas R.",
	startDate: "2026-02-10",
	progressPercent: 35,
	entityName: "Doigby",
};

const MOCK_BILANS = [
	{
		id: "b1",
		period: "Période 1" as const,
		date: "2026-03-01",
		responsable: "Marc V.",
		referent: "Thomas R.",
		junior: "Amine C.",
		summary:
			"Bonne progression globale. Amine maîtrise déjà les bases de Discord et commence à prendre de l'assurance dans ses sanctions. La réactivité reste à améliorer.",
		decision: "Période suivante accordée" as const,
		createdAt: "2026-03-01T18:30:00Z",
	},
];

const MOCK_NOTES = [
	{
		id: "n1",
		content: "Très motivé, pose des questions pertinentes lors des sessions.",
		author: "Thomas R.",
		authorRole: "Référent",
		createdAt: "2026-02-15T10:00:00Z",
	},
	{
		id: "n2",
		content: "À surveiller sur la capacité rédactionnelle — quelques fautes récurrentes.",
		author: "Momentum",
		authorRole: "Momentum",
		createdAt: "2026-02-20T14:30:00Z",
	},
];

const MOCK_REMARKS = [
	{
		id: "r1",
		type: "positive" as const,
		content: "Excellent travail lors du live du 18 février — 45 actions en 1h30.",
		author: "Thomas R.",
		authorRole: "Référent",
		juniorNotified: true,
		createdAt: "2026-02-19T09:00:00Z",
	},
	{
		id: "r2",
		type: "negative" as const,
		content: "A raté l'annonce du report de live du 22 février sans annoter le salon absence.",
		author: "Marc V.",
		authorRole: "Responsable",
		juniorNotified: false,
		createdAt: "2026-02-22T20:00:00Z",
	},
];

const MOCK_LIVES = [
	{
		id: "l1",
		date: "2026-02-18",
		platform: "Discord" as const,
		durationMinutes: 90,
		period: "Période 1" as const,
		referentNote: "Bon début, réactivité à améliorer.",
	},
	{
		id: "l2",
		date: "2026-02-25",
		platform: "Discord" as const,
		durationMinutes: 120,
		period: "Période 1" as const,
		referentNote: undefined,
	},
];

const MOCK_OBJECTIVES = [
	{
		id: "o1",
		title: "Améliorer la capacité rédactionnelle",
		description: "Réduire les fautes et structurer les messages de modération.",
		completed: false,
		unlockedAt: "2026-03-01",
		period: "Période 2" as const,
	},
	{
		id: "o2",
		title: "Atteindre 30 actions/heure",
		description: "Maintenir un rythme de modération satisfaisant sur les sessions Discord.",
		completed: false,
		unlockedAt: "2026-03-01",
		period: "Période 2" as const,
	},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateTime(iso: string): string {
	return new Date(iso).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

// ─── Page principale ──────────────────────────────────────────────────────────

const FSI_TABS = [
	{ id: "competences", label: "Compétences", icon: "star" as const },
	{ id: "objectifs", label: "Objectifs", icon: "flag" as const },
	{ id: "bilans", label: "Bilans RRJ", icon: "chat" as const },
	{ id: "lives", label: "Lives", icon: "profile" as const },
	{ id: "notes", label: "Notes & Remarques", icon: "info" as const },
];

type FsiTab = "competences" | "objectifs" | "bilans" | "lives" | "notes";

/**
 * Fiche de Suivi Individuel (FSI) d'un Junior en PIM.
 * Accessible aux référents, Momentum, Legacy et Owner.
 * Contient : compétences, objectifs, bilans RRJ, suivi des lives et notes.
 * @returns La page FSI du Junior
 */
export default function JuniorFsiPage() {
	void PAGE_CONFIG;
	const { groupId } = useParams<{ groupId: string }>();
	const [activeTab, setActiveTab] = useState<FsiTab>("competences");
	const [bilanOpen, setBilanOpen] = useState(false);
	const [noteOpen, setNoteOpen] = useState(false);

	// Génération des compétences à partir du template (toutes à "Non acquise" par défaut)
	const competencies = generateCompetenciesForJunior(MOCK_JUNIOR.function, MOCK_JUNIOR.dispositif);

	// Grouper les compétences par catégorie
	const grouped = competencies.reduce<Record<string, typeof competencies>>((acc, c) => {
		if (!acc[c.category]) acc[c.category] = [];
		acc[c.category].push(c);
		return acc;
	}, {});

	const categoryLabel: Record<string, string> = {
		technique: "Compétences techniques",
		sociale: "Compétences sociales",
		professionnelle: "Compétences professionnelles",
	};

	const acquired = competencies.filter((c) => c.level === "Acquise").length;
	const total = competencies.length;

	return (
		<PageContainer
			title={MOCK_JUNIOR.name}
			description={`FSI — ${MOCK_JUNIOR.function} · ${MOCK_JUNIOR.entityName}`}
		>
			<div className="space-y-4">
				{/* Fil d'ariane */}
				<nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
					<Link href={`/hub/${groupId}/training`} className="hover:text-gray-700 dark:hover:text-gray-200">
						Momentum
					</Link>
					<Icon name="chevronRight" size="xs" />
					<Link
						href={`/hub/${groupId}/training/pim`}
						className="hover:text-gray-700 dark:hover:text-gray-200"
					>
						Suivi PIM
					</Link>
					<Icon name="chevronRight" size="xs" />
					<span className="font-medium text-gray-900 dark:text-white">{MOCK_JUNIOR.name}</span>
				</nav>

				{/* Header Junior */}
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
					<SectionHeaderBanner
						icon="profile"
						title={MOCK_JUNIOR.name}
						description={`${MOCK_JUNIOR.function} · ${MOCK_JUNIOR.entityName}`}
						accentColor="primary"
						className="rounded-none"
					>
						<Badge variant={pimStatusVariantMap[MOCK_JUNIOR.pimStatus]} showDot>
							{MOCK_JUNIOR.pimStatus}
						</Badge>
					</SectionHeaderBanner>

					<div className="flex flex-wrap items-center gap-4 p-4">
						<div className="flex flex-wrap items-center gap-2">
							<Tag color="gray">{MOCK_JUNIOR.function}</Tag>
							<Badge variant={dispositifVariantMap[MOCK_JUNIOR.dispositif]} showDot={false}>
								{MOCK_JUNIOR.dispositif}
							</Badge>
							<Badge variant={periodVariantMap[MOCK_JUNIOR.currentPeriod]} showDot={false}>
								{MOCK_JUNIOR.currentPeriod}
							</Badge>
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-400">
							Référent :{" "}
							<span className="font-medium text-gray-700 dark:text-gray-300">
								{MOCK_JUNIOR.referentName}
							</span>
							{" · "}
							Début : <span className="font-medium">{formatDate(MOCK_JUNIOR.startDate)}</span>
						</div>
						<div className="ml-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
							<span>
								Compétences acquises :{" "}
								<span className="font-semibold text-gray-900 dark:text-white">
									{acquired}/{total}
								</span>
							</span>
						</div>
					</div>
				</div>

				{/* Onglets FSI */}
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
					<div className="border-b border-gray-200 px-4 pt-3 dark:border-gray-700">
						<Tabs tabs={FSI_TABS} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as FsiTab)} />
					</div>

					<div className="p-4">
						{/* ── Tab : Compétences ── */}
						{activeTab === "competences" && (
							<div className="space-y-6">
								{Object.entries(grouped).map(([category, comps]) => (
									<div key={category}>
										<h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
											{categoryLabel[category] ?? category}
										</h3>
										<div className="space-y-2">
											{comps.map((comp) => (
												<div
													key={comp.id}
													className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
												>
													<div className="min-w-0 flex-1">
														<p className="text-sm font-medium text-gray-900 dark:text-white">
															{comp.name}
														</p>
														<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
															{comp.description}
														</p>
													</div>
													<Badge
														variant={competencyLevelVariantMap[comp.level]}
														showDot={false}
													>
														{comp.level}
													</Badge>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						)}

						{/* ── Tab : Objectifs ── */}
						{activeTab === "objectifs" && (
							<div className="space-y-3">
								{MOCK_OBJECTIVES.length === 0 ? (
									<p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
										Aucun objectif débloqué pour cette période.
									</p>
								) : (
									MOCK_OBJECTIVES.map((obj) => (
										<div
											key={obj.id}
											className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
										>
											<div
												className={cn(
													"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
													obj.completed
														? "border-success-500 bg-success-500"
														: "border-gray-300 dark:border-gray-600",
												)}
											>
												{obj.completed && (
													<Icon name="check" size="xs" className="text-white" />
												)}
											</div>
											<div className="min-w-0 flex-1">
												<p
													className={cn(
														"text-sm font-medium",
														obj.completed
															? "text-gray-400 line-through dark:text-gray-500"
															: "text-gray-900 dark:text-white",
													)}
												>
													{obj.title}
												</p>
												<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
													{obj.description}
												</p>
												<p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
													Débloqué le {formatDate(obj.unlockedAt)} · {obj.period}
												</p>
											</div>
										</div>
									))
								)}
							</div>
						)}

						{/* ── Tab : Bilans RRJ ── */}
						{activeTab === "bilans" && (
							<div className="space-y-4">
								<Button variant="soft-primary" size="sm" onClick={() => setBilanOpen(true)}>
									<Icon name="plus" size="sm" />
									Créer un bilan
								</Button>

								{MOCK_BILANS.length === 0 ? (
									<p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
										Aucun bilan RRJ pour ce Junior.
									</p>
								) : (
									MOCK_BILANS.map((bilan) => (
										<div
											key={bilan.id}
											className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
										>
											<div className="mb-2 flex flex-wrap items-center gap-2">
												<Badge variant={periodVariantMap[bilan.period]} showDot={false}>
													{bilan.period}
												</Badge>
												<span className="text-xs text-gray-500 dark:text-gray-400">
													{formatDate(bilan.date)}
												</span>
												<Badge
													variant={
														bilan.decision === "PIM validée"
															? "success"
															: bilan.decision === "Période suivante accordée"
																? "info"
																: bilan.decision === "Période suivante refusée"
																	? "error"
																	: "neutral"
													}
													showDot={false}
												>
													{bilan.decision}
												</Badge>
											</div>
											<p className="text-sm text-gray-700 dark:text-gray-300">{bilan.summary}</p>
											<p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
												{bilan.responsable} · {bilan.referent} · {bilan.junior}
											</p>
										</div>
									))
								)}
							</div>
						)}

						{/* ── Tab : Lives ── */}
						{activeTab === "lives" && (
							<div className="space-y-3">
								{MOCK_LIVES.length === 0 ? (
									<p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
										Aucun live enregistré.
									</p>
								) : (
									MOCK_LIVES.map((live) => (
										<div
											key={live.id}
											className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
										>
											<div className="bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
												<Icon name="star" size="sm" />
											</div>
											<div className="min-w-0 flex-1">
												<div className="flex flex-wrap items-center gap-2">
													<p className="text-sm font-medium text-gray-900 dark:text-white">
														{formatDate(live.date)}
													</p>
													<Tag color="gray">{live.platform}</Tag>
													<Badge variant={periodVariantMap[live.period]} showDot={false}>
														{live.period}
													</Badge>
												</div>
												<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
													Durée : {live.durationMinutes} min
												</p>
												{live.referentNote && (
													<p className="mt-1 text-xs text-gray-400 italic dark:text-gray-500">
														"{live.referentNote}"
													</p>
												)}
											</div>
										</div>
									))
								)}
							</div>
						)}

						{/* ── Tab : Notes & Remarques ── */}
						{activeTab === "notes" && (
							<div className="space-y-4">
								<Button variant="soft-primary" size="sm" onClick={() => setNoteOpen(true)}>
									<Icon name="plus" size="sm" />
									Ajouter une note
								</Button>

								{/* Notes internes */}
								<div>
									<h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
										Notes internes
									</h3>
									<div className="space-y-2">
										{MOCK_NOTES.map((note) => (
											<div
												key={note.id}
												className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
											>
												<p className="text-sm text-gray-700 dark:text-gray-300">
													{note.content}
												</p>
												<p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
													{note.author} · {note.authorRole} · {formatDateTime(note.createdAt)}
												</p>
											</div>
										))}
									</div>
								</div>

								{/* Remarques */}
								<div>
									<h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
										Remarques
									</h3>
									<div className="space-y-2">
										{MOCK_REMARKS.map((remark) => (
											<div
												key={remark.id}
												className={cn(
													"rounded-lg border p-3",
													remark.type === "positive"
														? "border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/10"
														: "border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-900/10",
												)}
											>
												<div className="flex items-start gap-2">
													<Icon
														name={remark.type === "positive" ? "star" : "warning"}
														size="sm"
														className={
															remark.type === "positive"
																? "text-success-500 mt-0.5"
																: "text-error-500 mt-0.5"
														}
													/>
													<div className="min-w-0 flex-1">
														<p
															className={cn(
																"text-sm",
																remark.type === "positive"
																	? "text-success-700 dark:text-success-300"
																	: "text-error-700 dark:text-error-300",
															)}
														>
															{remark.content}
														</p>
														<div className="mt-1 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
															<span>
																{remark.author} · {remark.authorRole}
															</span>
															{remark.juniorNotified && (
																<Badge variant="success" showDot={false}>
																	Junior notifié
																</Badge>
															)}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Modal bilan RRJ */}
			<Modal isOpen={bilanOpen} onClose={() => setBilanOpen(false)} title="Créer un bilan RRJ" size="md">
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						showSuccess("Bilan créé et enregistré dans la FSI.");
						setBilanOpen(false);
					}}
				>
					<Input label="Date du bilan" type="date" required />
					<div className="grid grid-cols-2 gap-3">
						<Input label="Responsable" placeholder="Nom du responsable" required />
						<Input label="Référent" placeholder="Nom du référent" required />
					</div>
					<Textarea label="Synthèse" placeholder="Résumé du bilan de période..." required />
					<Select
						label="Décision"
						options={[
							{ value: "Période suivante accordée", label: "Période suivante accordée" },
							{ value: "Période suivante refusée", label: "Période suivante refusée" },
							{ value: "PIM validée", label: "PIM validée" },
							{ value: "En attente", label: "En attente" },
						]}
						required
					/>
					<ModalFooter>
						<Button variant="cancel" type="button" onClick={() => setBilanOpen(false)}>
							Annuler
						</Button>
						<Button type="submit">Enregistrer le bilan</Button>
					</ModalFooter>
				</form>
			</Modal>

			{/* Modal note interne */}
			<Modal isOpen={noteOpen} onClose={() => setNoteOpen(false)} title="Ajouter une note" size="sm">
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						showSuccess("Note ajoutée à la FSI.");
						setNoteOpen(false);
					}}
				>
					<Textarea label="Note" placeholder="Observation interne sur ce Junior..." required />
					<ModalFooter>
						<Button variant="cancel" type="button" onClick={() => setNoteOpen(false)}>
							Annuler
						</Button>
						<Button type="submit">Ajouter</Button>
					</ModalFooter>
				</form>
			</Modal>
		</PageContainer>
	);
}
