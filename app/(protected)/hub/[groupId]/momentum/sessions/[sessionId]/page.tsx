"use client";

// React
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Button, Tabs, Modal, EmptyState, Icon } from "@/components/ui";
import { JuniorCard } from "@/features/momentum/components/junior-card";
import { FSIPanel } from "@/features/momentum/components/fsi-panel";
import { FormationCard } from "@/features/momentum/components/formation-card";
import { useSessionDetail, useFormations } from "@/features/momentum/hooks";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showError } from "@/lib/utils/toast";
import type { Junior, AuthorRole, RemarkType } from "@/features/momentum/types";
import {

	sessionStatusVariantMap,
	remarkTypeVariantMap,
	PIM_STATUSES,
	DISPOSITIFS,
	MODERATION_FUNCTIONS,
} from "@/features/momentum/types";
import type { PimStatus, Dispositif, ModerationFunction } from "@/features/momentum/types";


const selectClasses = cn(
	"rounded-lg border px-3 py-2 text-sm transition-colors duration-200 appearance-none",
	"border-gray-200 bg-white text-gray-700",
	"focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none",
	"dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
	"dark:focus:border-primary-600 dark:focus:ring-primary-600",
);

const inputClasses = cn(
	"w-full rounded-lg border px-3 py-2.5 text-sm transition-colors duration-200",
	"border-gray-300 bg-white text-gray-900 placeholder-gray-400",
	"focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none",
	"dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
	"dark:focus:border-primary-500 dark:focus:ring-primary-900/30",
);

const textareaClasses = cn(
	"w-full rounded-lg border px-3 py-2.5 text-sm transition-colors duration-200 resize-none",
	"border-gray-300 bg-white text-gray-900 placeholder-gray-400",
	"focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none",
	"dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
	"dark:focus:border-primary-500 dark:focus:ring-primary-900/30",
);

const AUTHOR_ROLES: { value: AuthorRole; label: string }[] = [
	{ value: "Responsable", label: "Responsable" },
	{ value: "Marsha Teams", label: "Marsha Teams" },
	{ value: "Momentum", label: "Momentum" },
];

/**
 * Session detail page with junior tracking, formation management and reports.
 * @returns The session detail page with tabs
 */
export default function MomentumSessionDetailPage() {
	const params = useParams();
	const sessionId = params.sessionId as string;

	// Session detail and filters
	const {
		session,
		filteredJuniors,
		search,
		setSearch,
		statusFilter,
		setStatusFilter,
		dispositifFilter,
		setDispositifFilter,
		functionFilter,
		setFunctionFilter,
		updateCompetencyLevel,
		addNote,
		addRemark,
	} = useSessionDetail(sessionId);

	const { formations } = useFormations();

	// Local state
	const [activeTab, setActiveTab] = useState("juniors");
	const [selectedJunior, setSelectedJunior] = useState<Junior | null>(null);
	const [juniorModalOpen, setJuniorModalOpen] = useState(false);

	// Note modal
	const [noteModalOpen, setNoteModalOpen] = useState(false);
	const [noteContent, setNoteContent] = useState("");
	const [noteRole, setNoteRole] = useState<AuthorRole>("Momentum");
	const [noteJuniorId, setNoteJuniorId] = useState("");

	// Remark modal
	const [remarkModalOpen, setRemarkModalOpen] = useState(false);
	const [remarkContent, setRemarkContent] = useState("");
	const [remarkType, setRemarkType] = useState<RemarkType>("positive");
	const [remarkJuniorId, setRemarkJuniorId] = useState("");

	// Aggregated data
	const allNotes = useMemo(() => {
		if (!session) return [];
		return session.juniors
			.flatMap((j) => j.fsi.notes.map((n) => ({ ...n, juniorName: j.name, juniorId: j.id })))
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}, [session]);

	const allRemarks = useMemo(() => {
		if (!session) return [];
		return session.juniors
			.flatMap((j) => j.fsi.remarks.map((r) => ({ ...r, juniorName: j.name, juniorId: j.id })))
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}, [session]);

	// Handlers
	const handleJuniorClick = (junior: Junior) => {
		setSelectedJunior(junior);
		setJuniorModalOpen(true);
	};

	const handleCloseJuniorModal = () => {
		setJuniorModalOpen(false);
		setSelectedJunior(null);
	};

	const handleAddNote = () => {
		if (!noteContent.trim() || !noteJuniorId) return;
		addNote(noteJuniorId, {
			content: noteContent.trim(),
			author:
				noteRole === "Responsable" ? "Alex (Legacy)" : noteRole === "Marsha Teams" ? "Marsha Teams" : "Marco",
			authorRole: noteRole,
			createdAt: new Date().toISOString().split("T")[0],
		});
		showSuccess("Note ajoutee avec succes.");
		setNoteModalOpen(false);
		setNoteContent("");
		setNoteJuniorId("");
	};

	const handleAddRemark = () => {
		if (!remarkContent.trim() || !remarkJuniorId) return;
		addRemark(remarkJuniorId, {
			type: remarkType,
			content: remarkContent.trim(),
			author: "Marsha Teams",
			authorRole: "Marsha Teams",
			juniorNotified: true,
			createdAt: new Date().toISOString().split("T")[0],
		});
		showSuccess("Remarque ajoutee avec succes.");
		setRemarkModalOpen(false);
		setRemarkContent("");
		setRemarkJuniorId("");
	};

	// Format date for display
	const formatDate = (dateStr: string) =>
		new Date(dateStr).toLocaleDateString("fr-FR", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});

	// Tab configuration
	const tabItems = useMemo(
		() => [
			{ id: "juniors", label: "Juniors", icon: "users" as const, count: session?.juniors.length },
			{ id: "notes", label: "Notes", icon: "document" as const, count: allNotes.length },
			{ id: "formations", label: "Formations", icon: "training" as const, count: formations.length },
			{ id: "remarques", label: "Remarques", icon: "flag" as const, count: allRemarks.length },
		],
		[session, allNotes.length, allRemarks.length, formations.length],
	);

	// Session not found
	if (!session) {
		return (
			<PageContainer title="Session introuvable">
				<EmptyState
					icon="folder"
					title="Session introuvable"
					description="La session PIM demandee n'existe pas ou a ete supprimee."
				/>
			</PageContainer>
		);
	}

	return (
		<PageContainer title={`Session PIM — ${session.entity}`}>
			{/* Session header */}
			<Card padding="lg" className="mb-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-4">
						<div className="bg-primary-100 dark:bg-primary-900/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
							<Icon name="sparkles" style="solid" size="lg" className="text-primary-500" />
						</div>
						<div>
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white">{session.entity}</h2>
							<div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
								<span className="flex items-center gap-1">
									<Icon name="calendar" size="xs" className="text-gray-400" />
									{formatDate(session.startDate)}
								</span>
								<span className="flex items-center gap-1">
									<Icon name="profile" size="xs" className="text-gray-400" />
									{session.createdBy}
								</span>
								<span className="flex items-center gap-1">
									<Icon name="users" size="xs" className="text-gray-400" />
									{session.juniors.length} junior{session.juniors.length !== 1 ? "s" : ""}
								</span>
							</div>
						</div>
					</div>
					<Badge variant={sessionStatusVariantMap[session.status]}>{session.status}</Badge>
				</div>
			</Card>

			{/* Tabs */}
			<Tabs tabs={tabItems} activeTab={activeTab} onTabChange={setActiveTab} className="mb-8" />

			{/* Tab content : Juniors */}
			{activeTab === "juniors" && (
				<div className="space-y-5">
					{/* Filter bar */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="relative flex-1">
							<Icon
								name="search"
								size="sm"
								className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
							/>
							<input
								type="text"
								placeholder="Rechercher un Junior..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className={cn(inputClasses, "pl-9")}
							/>
						</div>

						<div className="relative">
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value as PimStatus | "")}
								className={selectClasses}
							>
								<option value="">Tous les statuts</option>
								{PIM_STATUSES.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
							<Icon
								name="chevronDown"
								size="xs"
								className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
							/>
						</div>

						<div className="relative">
							<select
								value={dispositifFilter}
								onChange={(e) => setDispositifFilter(e.target.value as Dispositif | "")}
								className={selectClasses}
							>
								<option value="">Tous les dispositifs</option>
								{DISPOSITIFS.map((d) => (
									<option key={d} value={d}>
										{d}
									</option>
								))}
							</select>
							<Icon
								name="chevronDown"
								size="xs"
								className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
							/>
						</div>

						<div className="relative">
							<select
								value={functionFilter}
								onChange={(e) => setFunctionFilter(e.target.value as ModerationFunction | "")}
								className={selectClasses}
							>
								<option value="">Toutes les fonctions</option>
								{MODERATION_FUNCTIONS.map((f) => (
									<option key={f} value={f}>
										{f}
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

					{/* Junior cards grid */}
					{filteredJuniors.length === 0 ? (
						<EmptyState
							icon="users"
							title="Aucun Junior trouve"
							description="Aucun Junior ne correspond aux filtres selectionnes."
						/>
					) : (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
							{filteredJuniors.map((junior) => (
								<JuniorCard key={junior.id} junior={junior} onClick={() => handleJuniorClick(junior)} />
							))}
						</div>
					)}
				</div>
			)}

			{/* Tab content : Notes */}
			{activeTab === "notes" && (
				<div className="space-y-5">
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{allNotes.length} note{allNotes.length !== 1 ? "s" : ""} au total
						</p>
						<Button
							variant="outline-primary"
							size="sm"
							onClick={() => {
								setNoteJuniorId(session.juniors[0]?.id || "");
								setNoteModalOpen(true);
							}}
						>
							<Icon name="plus" size="sm" />
							Ajouter une note
						</Button>
					</div>

					{allNotes.length === 0 ? (
						<EmptyState
							icon="document"
							title="Aucune note"
							description="Aucune note n'a encore ete ajoutee pour cette session."
							actionLabel="Ajouter une note"
							onAction={() => {
								setNoteJuniorId(session.juniors[0]?.id || "");
								setNoteModalOpen(true);
							}}
						/>
					) : (
						<div className="flex flex-col gap-3">
							{allNotes.map((note) => (
								<Card key={note.id} padding="md">
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1">
											<div className="mb-2 flex items-center gap-2">
												<span className="text-sm font-medium text-gray-900 dark:text-white">
													{note.juniorName}
												</span>
												<span className="text-xs text-gray-400">par {note.author}</span>
												<Badge
													variant={
														note.authorRole === "Responsable"
															? "primary"
															: note.authorRole === "Marsha Teams"
																? "info"
																: "neutral"
													}
													showDot={false}
												>
													{note.authorRole}
												</Badge>
											</div>
											<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
												{note.content}
											</p>
										</div>
										<span className="shrink-0 text-xs text-gray-400">
											{formatDate(note.createdAt)}
										</span>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			)}

			{/* Tab content : Formations */}
			{activeTab === "formations" && (
				<div>
					{formations.length === 0 ? (
						<EmptyState
							icon="training"
							title="Aucune formation"
							description="Aucune formation n'est disponible pour le moment."
						/>
					) : (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
							{formations.map((formation) => (
								<FormationCard key={formation.id} formation={formation} />
							))}
						</div>
					)}
				</div>
			)}

			{/* Tab content : Remarques */}
			{activeTab === "remarques" && (
				<div className="space-y-5">
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{allRemarks.length} remarque{allRemarks.length !== 1 ? "s" : ""} au total
						</p>
						<Button
							variant="outline-primary"
							size="sm"
							onClick={() => {
								setRemarkJuniorId(session.juniors[0]?.id || "");
								setRemarkModalOpen(true);
							}}
						>
							<Icon name="plus" size="sm" />
							Ajouter une remarque
						</Button>
					</div>

					{allRemarks.length === 0 ? (
						<EmptyState
							icon="flag"
							title="Aucune remarque"
							description="Aucune remarque n'a ete enregistree pour cette session."
							actionLabel="Ajouter une remarque"
							onAction={() => {
								setRemarkJuniorId(session.juniors[0]?.id || "");
								setRemarkModalOpen(true);
							}}
						/>
					) : (
						<div className="flex flex-col gap-3">
							{allRemarks.map((remark) => (
								<Card key={remark.id} padding="md">
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1">
											<div className="mb-2 flex flex-wrap items-center gap-2">
												<span className="text-sm font-medium text-gray-900 dark:text-white">
													{remark.juniorName}
												</span>
												<Badge variant={remarkTypeVariantMap[remark.type]} showDot>
													{remark.type === "positive" ? "Positive" : "Negative"}
												</Badge>
												{remark.juniorNotified && (
													<span className="flex items-center gap-1 text-xs text-gray-400">
														<Icon name="bell" size="xs" />
														Junior notifie
													</span>
												)}
											</div>
											<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
												{remark.content}
											</p>
											<p className="mt-1.5 text-xs text-gray-400">
												par {remark.author} ({remark.authorRole})
											</p>
										</div>
										<span className="shrink-0 text-xs text-gray-400">
											{formatDate(remark.createdAt)}
										</span>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			)}

			{/* Modal : Junior detail (FSI Panel) */}
			<Modal
				isOpen={juniorModalOpen}
				onClose={handleCloseJuniorModal}
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
						onCompetencyChange={(competencyId, level) =>
							updateCompetencyLevel(selectedJunior.id, competencyId, level)
						}
					/>
				)}
			</Modal>

			{/* Modal : Ajouter une note */}
			<Modal
				isOpen={noteModalOpen}
				onClose={() => setNoteModalOpen(false)}
				title="Ajouter une note"
				description="Ajoutez une note de suivi pour un Junior de cette session."
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
								value={noteJuniorId}
								onChange={(e) => setNoteJuniorId(e.target.value)}
								className={cn(selectClasses, "w-full")}
							>
								<option value="">Selectionner un Junior...</option>
								{session.juniors.map((j) => (
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

					{/* Role select */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Role
						</label>
						<div className="relative">
							<select
								value={noteRole}
								onChange={(e) => setNoteRole(e.target.value as AuthorRole)}
								className={cn(selectClasses, "w-full")}
							>
								{AUTHOR_ROLES.map((r) => (
									<option key={r.value} value={r.value}>
										{r.label}
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

					{/* Content */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Contenu
						</label>
						<textarea
							value={noteContent}
							onChange={(e) => setNoteContent(e.target.value)}
							placeholder="Ecrire la note..."
							rows={4}
							className={textareaClasses}
						/>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
						<Button variant="cancel" size="sm" onClick={() => setNoteModalOpen(false)}>
							Annuler
						</Button>
						<Button
							variant="primary"
							size="sm"
							onClick={handleAddNote}
							disabled={!noteContent.trim() || !noteJuniorId}
						>
							<Icon name="plus" size="sm" />
							Ajouter
						</Button>
					</div>
				</div>
			</Modal>

			{/* Modal : Ajouter une remarque */}
			<Modal
				isOpen={remarkModalOpen}
				onClose={() => setRemarkModalOpen(false)}
				title="Ajouter une remarque"
				description="Ajoutez une remarque positive ou negative pour un Junior. Le Junior sera notifie."
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
								{session.juniors.map((j) => (
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

					{/* Type select */}
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

					{/* Notification info */}
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
