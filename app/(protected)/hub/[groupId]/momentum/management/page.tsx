"use client";

// React
import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Button, Tabs, Modal, EmptyState, Icon, ProgressBar, Divider } from "@/components/ui";
import { FSIPanel } from "@/features/momentum/components/fsi-panel";
import { useSessions, useManagement } from "@/features/momentum/hooks";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showError } from "@/lib/utils/toast";
import type { Junior, RemarkType } from "@/features/momentum/types";
import { sessionStatusVariantMap, pimStatusVariantMap, dispositifVariantMap } from "@/features/momentum/types";


const selectClasses = cn(
	"rounded-lg border px-3 py-2 text-sm transition-colors duration-200 appearance-none",
	"border-gray-200 bg-white text-gray-700",
	"focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none",
	"dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
	"dark:focus:border-primary-600 dark:focus:ring-primary-600",
);

const textareaClasses = cn(
	"w-full rounded-lg border px-3 py-2.5 text-sm transition-colors duration-200 resize-none",
	"border-gray-300 bg-white text-gray-900 placeholder-gray-400",
	"focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none",
	"dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
	"dark:focus:border-primary-500 dark:focus:ring-primary-900/30",
);

const BILAN_DECISIONS = [
	{ value: "Période suivante accordée", label: "Periode suivante accordee", variant: "success" as const },
	{ value: "Période suivante refusée", label: "Periode suivante refusee", variant: "error" as const },
	{ value: "PIM validée", label: "PIM validee", variant: "primary" as const },
	{ value: "En attente", label: "En attente", variant: "warning" as const },
];

const BILAN_PERIODS = ["P1", "P2", "Bonus", "Final"];

const MANAGEMENT_TABS = [
	{ id: "overview", label: "Vue d'ensemble", icon: "stats" as const },
	{ id: "bilans", label: "Bilans", icon: "document" as const },
	{ id: "suivi", label: "Suivi Juniors", icon: "users" as const },
	{ id: "actions", label: "Actions", icon: "settings" as const },
];

/**
 * Momentum management page for tracking junior progress, FSI and session stats.
 * @returns The management overview page
 */
export default function MomentumManagementPage() {
	const params = useParams();
	const groupId = params.groupId as string;
	const router = useRouter();

	// Session hooks and management
	const { sessions } = useSessions();
	const { allJuniors, allBilans, addBilan, performAction, addManagementRemark } = useManagement(sessions);

	// Local state
	const [activeTab, setActiveTab] = useState("overview");

	// Junior FSI modal
	const [fsiModalOpen, setFsiModalOpen] = useState(false);
	const [selectedJunior, setSelectedJunior] = useState<Junior | null>(null);

	// New bilan modal
	const [bilanModalOpen, setBilanModalOpen] = useState(false);
	const [bilanSessionId, setBilanSessionId] = useState("");
	const [bilanJuniorId, setBilanJuniorId] = useState("");
	const [bilanPeriod, setBilanPeriod] = useState("P1");
	const [bilanDecision, setBilanDecision] = useState("En attente");
	const [bilanSummary, setBilanSummary] = useState("");

	// Action confirmation modal
	const [actionModalOpen, setActionModalOpen] = useState(false);
	const [currentAction, setCurrentAction] = useState<{ label: string; type: string } | null>(null);
	const [actionSessionId, setActionSessionId] = useState("");
	const [actionJuniorId, setActionJuniorId] = useState("");

	// Remark modal
	const [remarkModalOpen, setRemarkModalOpen] = useState(false);
	const [remarkJuniorId, setRemarkJuniorId] = useState("");
	const [remarkContent, setRemarkContent] = useState("");
	const [remarkType, setRemarkType] = useState<RemarkType>("negative");

	// Computed data
	const activeSessions = useMemo(() => sessions.filter((s) => s.status === "Active"), [sessions]);

	const sessionOverviews = useMemo(() => {
		return activeSessions.map((session) => {
			const total = session.juniors.length;
			const completed = session.juniors.filter((j) => j.pimStatus === "Réalisée").length;
			const inProgress = session.juniors.filter((j) => j.pimStatus === "En cours").length;
			const standBy = session.juniors.filter((j) => j.pimStatus === "En Stand-by").length;
			return {
				...session,
				stats: { total, completed, inProgress, standBy },
				progress: total > 0 ? Math.round((completed / total) * 100) : 0,
			};
		});
	}, [activeSessions]);

	const availableJuniorsForSession = useMemo(() => {
		const session = sessions.find((s) => s.id === bilanSessionId);
		return session?.juniors || [];
	}, [sessions, bilanSessionId]);

	// Format date for display
	const formatDate = (dateStr: string) =>
		new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

	// Event handlers

	const handleJuniorClick = (junior: Junior) => {
		setSelectedJunior(junior);
		setFsiModalOpen(true);
	};

	const handleNavigateToSession = (sessionId: string) => {
		router.push(`/hub/${groupId}/momentum/sessions/${sessionId}`);
	};

	const handleCreateBilan = () => {
		if (!bilanSessionId || !bilanJuniorId || !bilanSummary.trim()) return;
		const junior = allJuniors.find((j) => j.junior.id === bilanJuniorId);
		addBilan({
			juniorName: junior?.junior.name || "Unknown",
			sessionId: bilanSessionId,
			period: bilanPeriod,
			decision: bilanDecision,
			summary: bilanSummary.trim(),
			date: new Date().toISOString().split("T")[0],
		});
		showSuccess("Bilan cree avec succes.");
		setBilanModalOpen(false);
		setBilanSessionId("");
		setBilanJuniorId("");
		setBilanPeriod("P1");
		setBilanDecision("En attente");
		setBilanSummary("");
	};

	const handleOpenAction = (action: { label: string; type: string }) => {
		setCurrentAction(action);
		setActionSessionId("");
		setActionJuniorId("");
		setActionModalOpen(true);
	};

	const handleConfirmAction = () => {
		if (!actionSessionId || !actionJuniorId || !currentAction) return;
		try {
			performAction(currentAction.type, actionSessionId, actionJuniorId);
			showSuccess(`Action "${currentAction.label}" appliquee avec succes.`);
			setActionModalOpen(false);
		} catch {
			showError("Erreur lors de l'action.");
		}
	};

	const handleAddRemark = () => {
		if (!remarkJuniorId || !remarkContent.trim()) return;
		addManagementRemark(remarkJuniorId, {
			type: remarkType,
			content: remarkContent.trim(),
			author: "Marsha Teams",
			authorRole: "Marsha Teams",
			juniorNotified: true,
			createdAt: new Date().toISOString().split("T")[0],
		});
		showSuccess("Remarque ajoutee. Le Junior a ete notifie.");
		setRemarkModalOpen(false);
		setRemarkContent("");
		setRemarkJuniorId("");
	};

	// Quick actions
	const QUICK_ACTIONS = [
		{
			label: "Valider une PIM",
			type: "validate_pim",
			icon: "check" as const,
			description: "Valider definitivement la PIM d'un Junior et confirmer son integration.",
			color: "bg-success-100 dark:bg-success-900/20",
			iconColor: "text-success-500",
		},
		{
			label: "Accorder Periode 2",
			type: "grant_p2",
			icon: "sparkles" as const,
			description: "Autoriser le passage en Periode 2 apres un bilan P1 concluant.",
			color: "bg-primary-100 dark:bg-primary-900/20",
			iconColor: "text-primary-500",
		},
		{
			label: "Refuser Periode 2",
			type: "deny_p2",
			icon: "close" as const,
			description: "Refuser le passage en Periode 2 suite a un bilan P1 insuffisant.",
			color: "bg-error-100 dark:bg-error-900/20",
			iconColor: "text-error-500",
		},
		{
			label: "Mettre en stand-by",
			type: "standby",
			icon: "clock" as const,
			description: "Mettre temporairement la PIM en pause pour raisons organisationnelles.",
			color: "bg-warning-100 dark:bg-warning-900/20",
			iconColor: "text-warning-500",
		},
		{
			label: "Annuler une PIM",
			type: "cancel_pim",
			icon: "delete" as const,
			description: "Annuler definitivement la PIM d'un Junior. Action irreversible.",
			color: "bg-gray-100 dark:bg-gray-700",
			iconColor: "text-gray-500",
		},
	];

	return (
		<PageContainer title="Management" description="Tableau de bord de pilotage pour Marsha Teams et Legacy.">
			{/* Access restriction banner */}
			<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/20 mb-6 flex items-center gap-3 rounded-lg border px-4 py-2.5">
				<Icon name="shield" size="sm" className="text-warning-500 shrink-0" />
				<span className="text-warning-700 dark:text-warning-400 text-sm">
					Acces restreint — Cette section est reservee aux membres de Marsha Teams et Legacy.
				</span>
			</div>

			{/* Tabs */}
			<Tabs tabs={MANAGEMENT_TABS} activeTab={activeTab} onTabChange={setActiveTab} className="mb-8" />

			{/* Tab : Vue d'ensemble */}
			{activeTab === "overview" && (
				<div className="space-y-6">
					{sessionOverviews.length === 0 ? (
						<EmptyState
							icon="folder"
							title="Aucune session active"
							description="Il n'y a actuellement aucune session PIM active a piloter."
						/>
					) : (
						<div className="space-y-4">
							{sessionOverviews.map((session) => (
								<Card
									key={session.id}
									padding="lg"
									hover
									onClick={() => handleNavigateToSession(session.id)}
								>
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex items-center gap-4">
											<div className="bg-primary-100 dark:bg-primary-900/20 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
												<Icon
													name="folder"
													style="solid"
													size="md"
													className="text-primary-500"
												/>
											</div>
											<div>
												<h3 className="text-sm font-semibold text-gray-900 dark:text-white">
													{session.entity}
												</h3>
												<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
													{formatDate(session.startDate)} &middot; {session.createdBy}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-4">
											<div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
												<span className="flex items-center gap-1">
													<span className="bg-success-400 inline-block h-2 w-2 rounded-full" />
													{session.stats.completed} valide
													{session.stats.completed !== 1 ? "s" : ""}
												</span>
												<span className="flex items-center gap-1">
													<span className="bg-primary-400 inline-block h-2 w-2 rounded-full" />
													{session.stats.inProgress} en cours
												</span>
												{session.stats.standBy > 0 && (
													<span className="flex items-center gap-1">
														<span className="bg-warning-400 inline-block h-2 w-2 rounded-full" />
														{session.stats.standBy} stand-by
													</span>
												)}
											</div>
											<Badge variant={sessionStatusVariantMap[session.status]}>
												{session.status}
											</Badge>
											<Icon
												name="chevronRight"
												size="sm"
												className="text-gray-300 dark:text-gray-600"
											/>
										</div>
									</div>

									<div className="mt-4">
										<div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
											<span>Progression globale</span>
											<span>{session.progress}%</span>
										</div>
										<ProgressBar
											value={session.progress}
											max={100}
											variant={
												session.progress >= 80
													? "success"
													: session.progress >= 40
														? "primary"
														: "warning"
											}
											size="sm"
										/>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			)}

			{/* Tab : Bilans */}
			{activeTab === "bilans" && (
				<div className="space-y-5">
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{allBilans.length} bilan{allBilans.length !== 1 ? "s" : ""} enregistre
							{allBilans.length !== 1 ? "s" : ""}
						</p>
						<Button
							variant="primary"
							size="sm"
							onClick={() => {
								setBilanSessionId(activeSessions[0]?.id || "");
								setBilanModalOpen(true);
							}}
						>
							<Icon name="plus" size="sm" />
							Nouveau bilan
						</Button>
					</div>

					{allBilans.length === 0 ? (
						<EmptyState
							icon="document"
							title="Aucun bilan"
							description="Aucun bilan n'a encore ete enregistre. Creez le premier bilan pour commencer le suivi."
							actionLabel="Nouveau bilan"
							onAction={() => {
								setBilanSessionId(activeSessions[0]?.id || "");
								setBilanModalOpen(true);
							}}
						/>
					) : (
						<div className="flex flex-col gap-3">
							{allBilans.map((bilan) => {
								const decisionConfig = BILAN_DECISIONS.find((d) => d.value === bilan.decision);
								return (
									<Card key={bilan.id} padding="md">
										<div className="flex items-start justify-between gap-3">
											<div>
												<div className="mb-2 flex flex-wrap items-center gap-2">
													<span className="text-sm font-medium text-gray-900 dark:text-white">
														{bilan.juniorName}
													</span>
													<Badge variant="neutral" showDot={false}>
														{bilan.period}
													</Badge>
													<Badge variant={decisionConfig?.variant || "neutral"} showDot>
														{decisionConfig?.label || bilan.decision}
													</Badge>
												</div>
												<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
													{bilan.summary}
												</p>
											</div>
											<span className="shrink-0 text-xs text-gray-400">
												{formatDate(bilan.date)}
											</span>
										</div>
									</Card>
								);
							})}
						</div>
					)}
				</div>
			)}

			{/* Tab : Suivi Juniors */}
			{activeTab === "suivi" && (
				<div className="space-y-5">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{allJuniors.length} Junior{allJuniors.length !== 1 ? "s" : ""} toutes sessions confondues.
					</p>

					{allJuniors.length === 0 ? (
						<EmptyState
							icon="users"
							title="Aucun Junior"
							description="Aucun Junior n'est actuellement suivi dans les sessions PIM."
						/>
					) : (
						<Card padding="sm" className="overflow-hidden !p-0">
							<div className="overflow-x-auto">
								<table className="w-full min-w-[900px] text-left text-sm">
									<thead>
										<tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium tracking-wider text-gray-500 uppercase dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
											<th className="px-4 py-3">Nom</th>
											<th className="px-4 py-3">Session</th>
											<th className="px-4 py-3">Dispositif</th>
											<th className="px-4 py-3">Fonction</th>
											<th className="px-4 py-3">Statut</th>
											<th className="px-4 py-3">Periode</th>
											<th className="px-4 py-3">Competences</th>
											<th className="px-4 py-3">Referent</th>
										</tr>
									</thead>
									<tbody>
										{allJuniors.map((item) => {
											const acquired = item.junior.fsi.competencies.filter(
												(c) => c.level === "Acquise",
											).length;
											const total = item.junior.fsi.competencies.length;

											return (
												<tr
													key={item.junior.id}
													onClick={() => handleJuniorClick(item.junior)}
													className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
												>
													<td className="px-4 py-3">
														<span className="font-medium text-gray-900 dark:text-white">
															{item.junior.name}
														</span>
													</td>
													<td className="px-4 py-3 text-gray-600 dark:text-gray-300">
														{item.sessionEntity}
													</td>
													<td className="px-4 py-3">
														<Badge
															variant={dispositifVariantMap[item.junior.dispositif]}
															showDot={false}
														>
															{item.junior.dispositif}
														</Badge>
													</td>
													<td className="px-4 py-3 text-gray-600 dark:text-gray-300">
														{item.junior.function}
													</td>
													<td className="px-4 py-3">
														<Badge
															variant={pimStatusVariantMap[item.junior.pimStatus]}
															showDot
														>
															{item.junior.pimStatus}
														</Badge>
													</td>
													<td className="px-4 py-3 text-gray-600 dark:text-gray-300">
														{item.junior.currentPeriod}
													</td>
													<td className="px-4 py-3">
														<div className="flex items-center gap-2">
															<ProgressBar
																value={acquired}
																max={total}
																variant={acquired === total ? "success" : "primary"}
																size="sm"
																className="w-20"
															/>
															<span className="text-xs text-gray-500 dark:text-gray-400">
																{acquired}/{total}
															</span>
														</div>
													</td>
													<td className="px-4 py-3 text-gray-600 dark:text-gray-300">
														{item.junior.referent}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</Card>
					)}
				</div>
			)}

			{/* Tab : Actions */}
			{activeTab === "actions" && (
				<div className="space-y-6">
					{/* Quick actions grid */}
					<div>
						<h3 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Actions rapides</h3>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
							{QUICK_ACTIONS.map((action) => (
								<Card key={action.type} padding="md" hover onClick={() => handleOpenAction(action)}>
									<div className="flex items-start gap-3">
										<div className={cn("shrink-0 rounded-lg p-2.5", action.color)}>
											<Icon name={action.icon} size="sm" className={action.iconColor} />
										</div>
										<div className="flex-1">
											<h4 className="text-sm font-medium text-gray-900 dark:text-white">
												{action.label}
											</h4>
											<p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
												{action.description}
											</p>
										</div>
										<Icon
											name="chevronRight"
											size="sm"
											className="mt-0.5 text-gray-300 dark:text-gray-600"
										/>
									</div>
								</Card>
							))}
						</div>
					</div>

					<Divider />

					{/* Remarks section */}
					<div>
						<div className="mb-3 flex items-center justify-between">
							<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Remarques Marsha / Legacy
							</h3>
							<Button
								variant="outline-primary"
								size="sm"
								onClick={() => {
									setRemarkJuniorId(allJuniors[0]?.junior.id || "");
									setRemarkModalOpen(true);
								}}
							>
								<Icon name="plus" size="sm" />
								Ajouter une remarque
							</Button>
						</div>
						<Card padding="md" className="border-dashed">
							<div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
								<Icon name="bell" size="sm" className="text-gray-400" />
								<p>
									Les remarques negatives sont automatiquement notifiees aux Juniors concernes.
									Utilisez cette fonctionnalite avec discernement.
								</p>
							</div>
						</Card>
					</div>
				</div>
			)}

			{/* Modal : Junior FSI */}
			<Modal
				isOpen={fsiModalOpen}
				onClose={() => {
					setFsiModalOpen(false);
					setSelectedJunior(null);
				}}
				title={selectedJunior?.name}
				description={
					selectedJunior
						? `${selectedJunior.dispositif} — ${selectedJunior.function} — ${selectedJunior.currentPeriod}`
						: undefined
				}
				size="xl"
			>
				{selectedJunior && (
					<FSIPanel
						junior={selectedJunior}
						onCompetencyChange={() => {
							// read-only in management view
						}}
					/>
				)}
			</Modal>

			{/* Modal : Nouveau bilan */}
			<Modal
				isOpen={bilanModalOpen}
				onClose={() => setBilanModalOpen(false)}
				title="Nouveau bilan"
				description="Creez un bilan RRJ pour documenter l'evaluation d'un Junior."
				size="md"
			>
				<div className="space-y-4">
					{/* Session select */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Session
						</label>
						<div className="relative">
							<select
								value={bilanSessionId}
								onChange={(e) => {
									setBilanSessionId(e.target.value);
									setBilanJuniorId("");
								}}
								className={cn(selectClasses, "w-full")}
							>
								<option value="">Selectionner une session...</option>
								{activeSessions.map((s) => (
									<option key={s.id} value={s.id}>
										{s.entity}
									</option>
								))}
							</select>
							<Icon
								name="chevronDown"
								size="xs"
								className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
							/>
						</div>
					</div>

					{/* Junior select */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Junior
						</label>
						<div className="relative">
							<select
								value={bilanJuniorId}
								onChange={(e) => setBilanJuniorId(e.target.value)}
								className={cn(selectClasses, "w-full")}
								disabled={!bilanSessionId}
							>
								<option value="">Selectionner un Junior...</option>
								{availableJuniorsForSession.map((j) => (
									<option key={j.id} value={j.id}>
										{j.name}
									</option>
								))}
							</select>
							<Icon
								name="chevronDown"
								size="xs"
								className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
							/>
						</div>
					</div>

					{/* Period select */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Periode
						</label>
						<div className="relative">
							<select
								value={bilanPeriod}
								onChange={(e) => setBilanPeriod(e.target.value)}
								className={cn(selectClasses, "w-full")}
							>
								{BILAN_PERIODS.map((p) => (
									<option key={p} value={p}>
										{p}
									</option>
								))}
							</select>
							<Icon
								name="chevronDown"
								size="xs"
								className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
							/>
						</div>
					</div>

					{/* Decision select */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Decision
						</label>
						<div className="flex flex-wrap gap-2">
							{BILAN_DECISIONS.map((d) => (
								<button
									key={d.value}
									type="button"
									onClick={() => setBilanDecision(d.value)}
									className={cn(
										"rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
										bilanDecision === d.value
											? d.variant === "success"
												? "border-success-300 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20 dark:text-success-400"
												: d.variant === "error"
													? "border-error-300 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20 dark:text-error-400"
													: d.variant === "primary"
														? "border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
														: "border-warning-300 bg-warning-50 text-warning-700 dark:border-warning-700 dark:bg-warning-900/20 dark:text-warning-400"
											: "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
									)}
								>
									{d.label}
								</button>
							))}
						</div>
					</div>

					{/* Summary */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Resume du bilan
						</label>
						<textarea
							value={bilanSummary}
							onChange={(e) => setBilanSummary(e.target.value)}
							placeholder="Rediger le resume du bilan RRJ..."
							rows={4}
							className={textareaClasses}
						/>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
						<Button variant="cancel" size="sm" onClick={() => setBilanModalOpen(false)}>
							Annuler
						</Button>
						<Button
							variant="primary"
							size="sm"
							onClick={handleCreateBilan}
							disabled={!bilanSessionId || !bilanJuniorId || !bilanSummary.trim()}
						>
							<Icon name="plus" size="sm" />
							Valider le bilan
						</Button>
					</div>
				</div>
			</Modal>

			{/* Modal : Action confirmation */}
			<Modal
				isOpen={actionModalOpen}
				onClose={() => setActionModalOpen(false)}
				title={currentAction?.label}
				description="Selectionnez la session et le Junior concernes par cette action."
				size="md"
			>
				<div className="space-y-4">
					{/* Session select */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Session
						</label>
						<div className="relative">
							<select
								value={actionSessionId}
								onChange={(e) => {
									setActionSessionId(e.target.value);
									setActionJuniorId("");
								}}
								className={cn(selectClasses, "w-full")}
							>
								<option value="">Selectionner une session...</option>
								{activeSessions.map((s) => (
									<option key={s.id} value={s.id}>
										{s.entity}
									</option>
								))}
							</select>
							<Icon
								name="chevronDown"
								size="xs"
								className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
							/>
						</div>
					</div>

					{/* Junior select */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Junior
						</label>
						<div className="relative">
							<select
								value={actionJuniorId}
								onChange={(e) => setActionJuniorId(e.target.value)}
								className={cn(selectClasses, "w-full")}
								disabled={!actionSessionId}
							>
								<option value="">Selectionner un Junior...</option>
								{(sessions.find((s) => s.id === actionSessionId)?.juniors || []).map((j) => (
									<option key={j.id} value={j.id}>
										{j.name}
									</option>
								))}
							</select>
							<Icon
								name="chevronDown"
								size="xs"
								className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
							/>
						</div>
					</div>

					{/* Warning for destructive actions */}
					{currentAction?.type === "cancel_pim" && (
						<div className="border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-900/20 flex items-center gap-2 rounded-lg border px-3 py-2">
							<Icon name="flag" size="sm" className="text-error-500 shrink-0" />
							<span className="text-error-700 dark:text-error-400 text-xs">
								Cette action est irreversible. La PIM sera definitivement annulee.
							</span>
						</div>
					)}

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
						<Button variant="cancel" size="sm" onClick={() => setActionModalOpen(false)}>
							Annuler
						</Button>
						<Button
							variant={
								currentAction?.type === "cancel_pim" || currentAction?.type === "deny_p2"
									? "outline-danger"
									: "primary"
							}
							size="sm"
							onClick={handleConfirmAction}
							disabled={!actionSessionId || !actionJuniorId}
						>
							Confirmer
						</Button>
					</div>
				</div>
			</Modal>

			{/* Modal : Ajouter une remarque */}
			<Modal
				isOpen={remarkModalOpen}
				onClose={() => setRemarkModalOpen(false)}
				title="Ajouter une remarque"
				description="Ajoutez une remarque pour un Junior. Les remarques negatives sont notifiees."
				size="md"
			>
				<div className="space-y-4">
					{/* Junior select */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Junior
						</label>
						<div className="relative">
							<select
								value={remarkJuniorId}
								onChange={(e) => setRemarkJuniorId(e.target.value)}
								className={cn(selectClasses, "w-full")}
							>
								<option value="">Selectionner un Junior...</option>
								{allJuniors.map((item) => (
									<option key={item.junior.id} value={item.junior.id}>
										{item.junior.name} ({item.sessionEntity})
									</option>
								))}
							</select>
							<Icon
								name="chevronDown"
								size="xs"
								className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
							/>
						</div>
					</div>

					{/* Type */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Type
						</label>
						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => setRemarkType("positive")}
								className={cn(
									"flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
									remarkType === "positive"
										? "border-success-300 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20 dark:text-success-400"
										: "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
								)}
							>
								Positive
							</button>
							<button
								type="button"
								onClick={() => setRemarkType("negative")}
								className={cn(
									"flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
									remarkType === "negative"
										? "border-error-300 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20 dark:text-error-400"
										: "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
								)}
							>
								Negative
							</button>
						</div>
					</div>

					{/* Content */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Contenu
						</label>
						<textarea
							value={remarkContent}
							onChange={(e) => setRemarkContent(e.target.value)}
							placeholder="Ecrire la remarque..."
							rows={4}
							className={textareaClasses}
						/>
					</div>

					{/* Notification warning */}
					<div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
						<Icon name="bell" size="sm" className="text-gray-400" />
						<span className="text-xs text-gray-500 dark:text-gray-400">
							Le Junior sera automatiquement notifie de cette remarque.
						</span>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
						<Button variant="cancel" size="sm" onClick={() => setRemarkModalOpen(false)}>
							Annuler
						</Button>
						<Button
							variant="primary"
							size="sm"
							onClick={handleAddRemark}
							disabled={!remarkContent.trim() || !remarkJuniorId}
						>
							<Icon name="plus" size="sm" />
							Ajouter
						</Button>
					</div>
				</div>
			</Modal>
		</PageContainer>
	);
}
