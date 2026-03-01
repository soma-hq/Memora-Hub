"use client";

// React
import { useState, useEffect, useMemo, useCallback } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Icon, Button, Badge, Modal } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showError } from "@/lib/utils/toast";
import { useUIStore } from "@/store/ui.store";


/** Extended absence entry for the timeline display */
interface TimelineAbsence {
	id: string;
	startDate: string;
	endDate: string;
	reason: string;
	mode: "partial" | "complete";
	status: "active" | "upcoming" | "past";
}

/** Month names in French */
const MONTH_NAMES = [
	"Janvier",
	"Fevrier",
	"Mars",
	"Avril",
	"Mai",
	"Juin",
	"Juillet",
	"Aout",
	"Septembre",
	"Octobre",
	"Novembre",
	"Decembre",
];

/**
 * Calculates inclusive day count between two ISO date strings.
 * @param {string} start - Start ISO date
 * @param {string} end - End ISO date
 * @returns {number} Number of days (inclusive)
 */
function daysBetween(start: string, end: string): number {
	const ms = new Date(end).getTime() - new Date(start).getTime();
	return Math.max(1, Math.ceil(ms / 86400000) + 1);
}

/**
 * Formats an ISO date to a French readable string.
 * @param {string} iso - ISO date string
 * @returns {string} Formatted date string (e.g. "27 Fevrier 2026")
 */
function formatDate(iso: string): string {
	const d = new Date(iso);
	return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Formats an ISO date to short form.
 * @param {string} iso - ISO date string
 * @returns {string} Short date (e.g. "27 Fev")
 */
function formatShort(iso: string): string {
	const d = new Date(iso);
	return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
}

/**
 * Groups absences by month-year key.
 * @param {TimelineAbsence[]} abs - List of absences
 * @returns {Map<string, TimelineAbsence[]>} Grouped absences
 */
function groupByMonth(abs: TimelineAbsence[]): Map<string, TimelineAbsence[]> {
	const map = new Map<string, TimelineAbsence[]>();
	for (const a of abs) {
		const d = new Date(a.startDate);
		const key = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
		if (!map.has(key)) map.set(key, []);
		map.get(key)!.push(a);
	}
	return map;
}

/**
 * Absence management page with timeline chronology and absence mode integration.
 * Features status banners, active absence card with progress, expandable past absences,
 * and a modal form for declaring new absences.
 * @returns {JSX.Element} Absence page
 */
export default function AbsencesPage() {
	// Store
	const absenceMode = useUIStore((s) => s.absenceMode);
	const setAbsenceMode = useUIStore((s) => s.setAbsenceMode);

	// State
	const [absences, setAbsences] = useState<TimelineAbsence[]>([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedMode, setSelectedMode] = useState<"partial" | "complete">("partial");
	const [formStart, setFormStart] = useState("");
	const [formEnd, setFormEnd] = useState("");
	const [formReason, setFormReason] = useState("");
	const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

	// Derived data
	const activeAbsence = useMemo(() => absences.find((a) => a.status === "active"), [absences]);
	const pastAbsences = useMemo(
		() =>
			absences
				.filter((a) => a.status === "past")
				.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
		[absences],
	);
	const pastGrouped = useMemo(() => groupByMonth(pastAbsences), [pastAbsences]);

	// Sync absence mode on mount if there's an active absence
	useEffect(() => {
		if (activeAbsence && absenceMode === "none") {
			setAbsenceMode(activeAbsence.mode === "complete" ? "complete" : "partial");
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Handlers

	/**
	 * Toggles a month group open/closed in the timeline.
	 * @param {string} key - Month-year key
	 * @returns {void}
	 */
	const toggleMonth = useCallback((key: string) => {
		setExpandedMonths((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
	}, []);

	/**
	 * Toggles an individual absence detail expanded/collapsed.
	 * @param {string} id - Absence ID
	 * @returns {void}
	 */
	const toggleDetail = useCallback((id: string) => {
		setExpandedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	/**
	 * Cancels the active absence and resets absence mode.
	 * @returns {void}
	 */
	const handleCancel = useCallback(() => {
		setAbsences((prev) => prev.filter((a) => a.status !== "active"));
		setAbsenceMode("none");
		showSuccess("Absence annulee avec succes.");
	}, [setAbsenceMode]);

	/**
	 * Resets the form fields.
	 * @returns {void}
	 */
	const resetForm = useCallback(() => {
		setSelectedMode("partial");
		setFormStart("");
		setFormEnd("");
		setFormReason("");
	}, []);

	/**
	 * Submits a new absence declaration.
	 * @returns {void}
	 */
	const handleSubmit = useCallback(() => {
		if (!formStart || !formEnd || !formReason.trim()) {
			showError("Remplis tous les champs.");
			return;
		}
		if (new Date(formEnd) <= new Date(formStart)) {
			showError("La date de fin doit etre apres la date de debut.");
			return;
		}
		const days = daysBetween(formStart, formEnd);
		if (days < 5) {
			showError("La duree minimale est de 5 jours.");
			return;
		}

		const newAbsence: TimelineAbsence = {
			id: `tl-${Date.now()}`,
			startDate: formStart,
			endDate: formEnd,
			reason: formReason.trim(),
			mode: selectedMode,
			status: "active",
		};

		setAbsences((prev) => [newAbsence, ...prev.filter((a) => a.status !== "active")]);
		setAbsenceMode(selectedMode === "complete" ? "complete" : "partial");
		setModalOpen(false);
		resetForm();
		showSuccess("Absence declaree avec succes.");
	}, [formStart, formEnd, formReason, selectedMode, setAbsenceMode, resetForm]);

	// Progress calculation for active absence
	const progress = useMemo(() => {
		if (!activeAbsence) return { elapsed: 0, total: 0, pct: 0 };
		const now = new Date();
		const start = new Date(activeAbsence.startDate);
		const total = daysBetween(activeAbsence.startDate, activeAbsence.endDate);
		const elapsed = Math.max(0, Math.ceil((now.getTime() - start.getTime()) / 86400000) + 1);
		return { elapsed: Math.min(elapsed, total), total, pct: Math.min(100, Math.round((elapsed / total) * 100)) };
	}, [activeAbsence]);

	// Form day count
	const formDays =
		formStart && formEnd && new Date(formEnd) > new Date(formStart) ? daysBetween(formStart, formEnd) : 0;

	// Render
	return (
		<PageContainer
			title="Absences"
			description={`${absences.length} absence${absences.length > 1 ? "s" : ""} enregistree${absences.length > 1 ? "s" : ""}`}
			actions={
				<Button variant="primary" onClick={() => setModalOpen(true)} className="gap-2">
					<Icon name="plus" size="sm" />
					Declarer une absence
				</Button>
			}
		>
			<div className="space-y-6">
				{/* Status Banner */}
				{absenceMode !== "none" && (
					<div
						className={cn(
							"flex items-center justify-between rounded-xl border px-5 py-4 transition-all duration-200",
							absenceMode === "partial"
								? "border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-900/10"
								: "border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-900/10",
						)}
					>
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"flex h-10 w-10 items-center justify-center rounded-lg",
									absenceMode === "partial"
										? "bg-amber-100 dark:bg-amber-900/30"
										: "bg-red-100 dark:bg-red-900/30",
								)}
							>
								<Icon
									name="absence"
									size="md"
									className={
										absenceMode === "partial"
											? "text-amber-600 dark:text-amber-400"
											: "text-red-600 dark:text-red-400"
									}
								/>
							</div>
							<div>
								<p
									className={cn(
										"text-sm font-semibold",
										absenceMode === "partial"
											? "text-amber-800 dark:text-amber-200"
											: "text-red-800 dark:text-red-200",
									)}
								>
									{absenceMode === "partial"
										? "Absence partielle en cours"
										: "Absence totale en cours"}
								</p>
								<p
									className={cn(
										"text-xs",
										absenceMode === "partial"
											? "text-amber-600 dark:text-amber-400"
											: "text-red-600 dark:text-red-400",
									)}
								>
									{absenceMode === "partial"
										? "Tu conserves tes acces mais tes notifications sont desactivees."
										: "Aucune mention ni notification ne te seront adressees. Tes acces aux projets et taches sont restreints."}
								</p>
							</div>
						</div>
						<Button variant="ghost" size="sm" onClick={handleCancel}>
							Annuler l&apos;absence
						</Button>
					</div>
				)}

				{/* Active Absence Card */}
				{activeAbsence && (
					<div
						className={cn(
							"rounded-xl border-2 p-6 transition-all duration-200",
							activeAbsence.mode === "partial"
								? "border-amber-300 bg-white dark:border-amber-700 dark:bg-gray-800"
								: "border-red-300 bg-white dark:border-red-700 dark:bg-gray-800",
						)}
					>
						<div className="mb-4 flex items-start justify-between">
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex h-12 w-12 items-center justify-center rounded-xl",
										activeAbsence.mode === "partial"
											? "bg-amber-100 dark:bg-amber-900/30"
											: "bg-red-100 dark:bg-red-900/30",
									)}
								>
									<Icon
										name="absence"
										size="lg"
										className={
											activeAbsence.mode === "partial"
												? "text-amber-600 dark:text-amber-400"
												: "text-red-600 dark:text-red-400"
										}
									/>
								</div>
								<div>
									<div className="flex items-center gap-2">
										<h3 className="text-lg font-bold text-gray-900 dark:text-white">
											Absence en cours
										</h3>
										<Badge variant={activeAbsence.mode === "partial" ? "warning" : "error"}>
											{activeAbsence.mode === "partial" ? "Partielle" : "Totale"}
										</Badge>
									</div>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{formatDate(activeAbsence.startDate)} — {formatDate(activeAbsence.endDate)}
									</p>
								</div>
							</div>
							<Button variant="cancel" size="sm" onClick={handleCancel}>
								Annuler
							</Button>
						</div>

						{/* Reason */}
						<p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{activeAbsence.reason}</p>

						{/* Progress bar */}
						<div className="space-y-2">
							<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
								<span>
									Jour {progress.elapsed} sur {progress.total}
								</span>
								<span>{progress.pct}%</span>
							</div>
							<div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
								<div
									className={cn(
										"h-full rounded-full transition-all duration-500",
										activeAbsence.mode === "partial" ? "bg-amber-500" : "bg-red-500",
									)}
									style={{ width: `${progress.pct}%` }}
								/>
							</div>
						</div>
					</div>
				)}

				{/* Timeline Chronology */}
				{pastAbsences.length > 0 && (
					<div>
						<h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Historique
						</h3>

						<div className="relative">
							{/* Vertical line */}
							<div className="absolute top-0 bottom-0 left-3 w-px bg-gray-200 dark:bg-gray-700" />

							<div className="space-y-1">
								{Array.from(pastGrouped.entries()).map(([monthKey, monthAbsences]) => (
									<div key={monthKey}>
										{/* Month header */}
										<button
											onClick={() => toggleMonth(monthKey)}
											className="group relative mb-1 flex w-full items-center gap-3 py-2 text-left"
										>
											<div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
												<div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500" />
											</div>
											<span className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
												{monthKey}
											</span>
											<span className="ml-1 text-[10px] text-gray-400 dark:text-gray-600">
												({monthAbsences.length})
											</span>
											<Icon
												name="chevronDown"
												size="xs"
												className={cn(
													"ml-auto text-gray-400 transition-transform duration-200",
													expandedMonths.has(monthKey) && "rotate-180",
												)}
											/>
										</button>

										{/* Month entries */}
										{expandedMonths.has(monthKey) && (
											<div className="space-y-1 pb-2">
												{monthAbsences.map((absence) => (
													<div
														key={absence.id}
														className="relative flex items-start gap-3 pl-0"
													>
														{/* Timeline dot */}
														<div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
															<div
																className={cn(
																	"h-3 w-3 rounded-full",
																	absence.mode === "partial"
																		? "bg-amber-400/60 dark:bg-amber-500/40"
																		: "bg-red-400/60 dark:bg-red-500/40",
																)}
															/>
														</div>

														{/* Content */}
														<button
															onClick={() => toggleDetail(absence.id)}
															className={cn(
																"flex-1 rounded-lg border border-gray-100 bg-gray-50 p-3 text-left transition-all duration-200",
																"hover:border-gray-200 hover:bg-white",
																"dark:border-gray-700/50 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800",
															)}
														>
															<div className="flex items-center justify-between">
																<div className="flex items-center gap-2">
																	<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
																		{formatShort(absence.startDate)} —{" "}
																		{formatShort(absence.endDate)}
																	</span>
																	<Badge
																		variant={
																			absence.mode === "partial"
																				? "warning"
																				: "error"
																		}
																	>
																		{absence.mode === "partial"
																			? "Partielle"
																			: "Totale"}
																	</Badge>
																</div>
																<span className="text-[10px] text-gray-400 dark:text-gray-500">
																	{daysBetween(absence.startDate, absence.endDate)}j
																</span>
															</div>

															{/* Expanded detail */}
															{expandedIds.has(absence.id) && (
																<div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
																	<p className="text-xs text-gray-500 dark:text-gray-400">
																		{absence.reason}
																	</p>
																	<p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
																		{formatDate(absence.startDate)} —{" "}
																		{formatDate(absence.endDate)}
																	</p>
																</div>
															)}
														</button>
													</div>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Empty state */}
				{absences.length === 0 && (
					<div className="flex flex-col items-center justify-center py-16">
						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
							<Icon name="absence" size="lg" className="text-gray-400 dark:text-gray-500" />
						</div>
						<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aucune absence declaree</p>
						<p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
							Declare ta prochaine absence pour prevenir ton equipe.
						</p>
					</div>
				)}
			</div>

			{/* Declaration Modal */}
			<Modal
				isOpen={modalOpen}
				onClose={() => {
					setModalOpen(false);
					resetForm();
				}}
				title="Declarer une absence"
			>
				<div className="space-y-5">
					{/* Type selection */}
					<div>
						<label className="mb-2 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Type d&apos;absence
						</label>
						<div className="grid grid-cols-2 gap-3">
							{/* Partial */}
							<button
								type="button"
								onClick={() => setSelectedMode("partial")}
								className={cn(
									"rounded-xl border-2 p-4 text-left transition-all duration-200",
									selectedMode === "partial"
										? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20"
										: "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
								)}
							>
								<div className="mb-2 flex items-center gap-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
										<Icon name="absence" size="sm" className="text-amber-600 dark:text-amber-400" />
									</div>
									<span className="text-sm font-bold text-gray-900 dark:text-white">Partielle</span>
								</div>
								<p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
									Tu gardes tes acces mais ne recois aucune notification.
								</p>
							</button>

							{/* Complete */}
							<button
								type="button"
								onClick={() => setSelectedMode("complete")}
								className={cn(
									"rounded-xl border-2 p-4 text-left transition-all duration-200",
									selectedMode === "complete"
										? "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
										: "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
								)}
							>
								<div className="mb-2 flex items-center gap-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
										<Icon name="absence" size="sm" className="text-red-600 dark:text-red-400" />
									</div>
									<span className="text-sm font-bold text-gray-900 dark:text-white">Totale</span>
								</div>
								<p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
									Acces restreints : pas de projets, taches ni mentions.
								</p>
							</button>
						</div>
					</div>

					{/* Date range */}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
								Date de debut
							</label>
							<input
								type="date"
								value={formStart}
								onChange={(e) => setFormStart(e.target.value)}
								className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all duration-200 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							/>
						</div>
						<div>
							<label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
								Date de fin
							</label>
							<input
								type="date"
								value={formEnd}
								onChange={(e) => setFormEnd(e.target.value)}
								className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all duration-200 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							/>
						</div>
					</div>

					{/* Duration indicator */}
					{formDays > 0 && (
						<div
							className={cn(
								"flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
								formDays < 5
									? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
									: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
							)}
						>
							<Icon name={formDays < 5 ? "warning" : "clock"} size="xs" />
							{formDays < 5
								? `Duree de ${formDays} jour${formDays > 1 ? "s" : ""} — minimum requis : 5 jours`
								: `Duree totale : ${formDays} jours`}
						</div>
					)}

					{/* Reason */}
					<div>
						<label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
							Motif
						</label>
						<textarea
							value={formReason}
							onChange={(e) => setFormReason(e.target.value)}
							rows={3}
							placeholder="Decris brievement la raison de ton absence..."
							className="focus:border-primary-500 focus:ring-primary-500 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all duration-200 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
						/>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-2">
						<Button
							variant="ghost"
							onClick={() => {
								setModalOpen(false);
								resetForm();
							}}
						>
							Annuler
						</Button>
						<Button variant="primary" onClick={handleSubmit}>
							Declarer
						</Button>
					</div>
				</div>
			</Modal>
		</PageContainer>
	);
}
