"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { useDataStore } from "@/store/data.store";
import { PATCHNOTES, hasSeenLatestPatchnote, markPatchnoteSeen } from "@/features/admin/patchnotes/data/patchnotes";
import {
	MISSED_EVENTS_BRIEFING,
	MISSED_EVENTS_LAST_SEEN_KEY,
	MISSED_EVENTS_PENDING_KEY,
} from "@/features/academy/scripts/onboarding/missed-events-briefing";
import type { IconName } from "@/core/design/icons";

interface RecapEntry {
	title: string;
	detail: string;
	date?: string;
}

interface RecapSection {
	id: string;
	title: string;
	subtitle: string;
	icon: IconName;
	items: RecapEntry[];
}

function parseIsoDate(date?: string): Date | null {
	if (!date) return null;
	const parsed = new Date(date);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatFrenchDate(date?: string): string {
	const parsed = parseIsoDate(date);
	if (!parsed) return "Date inconnue";
	return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function isAfter(date: string | undefined, since: Date): boolean {
	const parsed = parseIsoDate(date);
	if (!parsed) return false;
	return parsed >= since;
}

/**
 * Login-time recap modal presented by Memora AI.
 * Shows a human-friendly guided breadcrumb walkthrough of missed events.
 */
export function MissedEventsModal() {
	const currentUser = useDataStore((s) => s.currentUser);
	const getUserProjects = useDataStore((s) => s.getUserProjects);
	const getUserTasks = useDataStore((s) => s.getUserTasks);
	const getUserMeetings = useDataStore((s) => s.getUserMeetings);
	const getUserAbsences = useDataStore((s) => s.getUserAbsences);

	const [isOpen, setIsOpen] = useState<boolean>(() => {
		if (typeof window === "undefined") return false;
		return sessionStorage.getItem(MISSED_EVENTS_PENDING_KEY) === "true";
	});
	const [started, setStarted] = useState(false);
	const [stepIndex, setStepIndex] = useState(0);
	const [sinceDate] = useState<Date>(() => {
		const fallback = new Date();
		fallback.setDate(fallback.getDate() - 21);

		if (typeof window === "undefined") return fallback;
		const stored = localStorage.getItem(MISSED_EVENTS_LAST_SEEN_KEY);
		const parsed = parseIsoDate(stored || undefined);
		if (parsed) return parsed;

		return fallback;
	});

	const sections = useMemo<RecapSection[]>(() => {
		if (!currentUser) return [];

		const userProjects = getUserProjects(currentUser.id).active.filter(
			(project) =>
				isAfter(project.startDate, sinceDate) ||
				project.timeline.some((entry) => isAfter(entry.timestamp, sinceDate)),
		);
		const userTasks = getUserTasks(currentUser.id).active.filter((task) => isAfter(task.createdAt, sinceDate));
		const userMeetings = getUserMeetings(currentUser.id).upcoming.filter((meeting) =>
			isAfter(meeting.date, sinceDate),
		);
		const userAbsences = getUserAbsences(currentUser.id).filter((absence) => isAfter(absence.createdAt, sinceDate));

		const recentPatchnotes = PATCHNOTES.filter((patchnote) => isAfter(patchnote.date, sinceDate));
		const includeLatestUnseen =
			!hasSeenLatestPatchnote() && !recentPatchnotes.some((note) => note.id === PATCHNOTES[0]?.id);
		const patchnotes =
			includeLatestUnseen && PATCHNOTES[0] ? [PATCHNOTES[0], ...recentPatchnotes] : recentPatchnotes;

		const planningItems: RecapEntry[] = [
			...userMeetings.map((meeting) => ({
				title: meeting.title,
				detail: `${meeting.type} • ${meeting.startTime}-${meeting.endTime}`,
				date: meeting.date,
			})),
			...userAbsences.map((absence) => ({
				title: `Absence ${absence.status === "approved" ? "validee" : "en attente"}`,
				detail: `${absence.reason || absence.type} • ${absence.days} jour(s)`,
				date: absence.startDate,
			})),
		];

		const deliveryItems: RecapEntry[] = [
			...userProjects.map((project) => ({
				title: `Projet: ${project.name}`,
				detail: `${project.priority} • ${project.progress}% d'avancement`,
				date: project.startDate,
			})),
			...userTasks.map((task) => ({
				title: `Tache: ${task.title}`,
				detail: `${task.status} • Priorite ${task.priority}`,
				date: task.createdAt,
			})),
		];

		const patchnoteItems: RecapEntry[] = patchnotes.map((patchnote) => ({
			title: `${patchnote.version} • ${patchnote.title}`,
			detail: patchnote.summary,
			date: patchnote.date,
		}));

		return [
			{
				id: "planning",
				title: "Planning & absences",
				subtitle: `${userMeetings.length} reunion(s), ${userAbsences.length} absence(s) ajoutee(s)`,
				icon: "calendar",
				items: planningItems,
			},
			{
				id: "delivery",
				title: "Projets & taches",
				subtitle: `${userProjects.length} projet(s), ${userTasks.length} tache(s) recente(s)`,
				icon: "folder",
				items: deliveryItems,
			},
			{
				id: "updates",
				title: "Patchnotes & ameliorations",
				subtitle: `${patchnotes.length} mise(s) a jour produit`,
				icon: "news",
				items: patchnoteItems,
			},
			{
				id: "done",
				title: "Tu es a jour",
				subtitle: "Tout est en place pour repartir proprement.",
				icon: "check",
				items: [],
			},
		];
	}, [currentUser, getUserAbsences, getUserMeetings, getUserProjects, getUserTasks, sinceDate]);

	const activeStep = sections[stepIndex];
	const introStep = MISSED_EVENTS_BRIEFING.steps[0];
	const scriptStep = MISSED_EVENTS_BRIEFING.steps.find((step) => step.id === activeStep?.id);
	const totalMissed = useMemo(() => sections.reduce((count, section) => count + section.items.length, 0), [sections]);

	const closeModal = () => {
		setIsOpen(false);
		setStarted(false);
		sessionStorage.removeItem(MISSED_EVENTS_PENDING_KEY);
	};

	const finishRecap = () => {
		localStorage.setItem(MISSED_EVENTS_LAST_SEEN_KEY, new Date().toISOString());
		markPatchnoteSeen();
		closeModal();
	};

	const goNext = () => {
		if (stepIndex >= sections.length - 1) {
			finishRecap();
			return;
		}

		setStepIndex((prev) => prev + 1);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8">
			<div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={closeModal} />

			<div className="relative z-10 flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
				<div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
					<div>
						<p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
							Memora AI
						</p>
						<h2 className="text-xl font-bold text-slate-900 dark:text-white">Briefing de reprise</h2>
					</div>
					<button
						onClick={closeModal}
						className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
					>
						<Icon name="close" size="sm" />
					</button>
				</div>

				<div className="grid flex-1 gap-0 overflow-hidden md:grid-cols-[320px_1fr]">
					<div className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 md:border-r md:border-b-0 dark:border-slate-700 dark:from-slate-900 dark:to-slate-900">
						<div className="mb-4 flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
								<Image
									src="/icons/memora-ai.svg"
									alt="Memora AI"
									width={30}
									height={30}
									className="h-7 w-7"
								/>
							</div>
							<div>
								<p className="text-sm font-semibold text-slate-900 dark:text-white">Memora AI</p>
								<p className="text-xs text-slate-500 dark:text-slate-400">Assistant de reprise</p>
							</div>
						</div>

						<p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
							{started
								? scriptStep?.pearlMessage || "Je te montre maintenant ce qui compte le plus."
								: introStep.pearlMessage}
						</p>

						<div className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
							{`Depuis ta derniere connexion: ${totalMissed} evenement(s) notable(s).`}
						</div>
					</div>

					<div className="flex min-h-0 flex-col p-5">
						{!started ? (
							<div className="flex h-full flex-col justify-between gap-5">
								<div>
									<h3 className="text-2xl font-bold text-slate-900 dark:text-white">
										Hey ! T&apos;as loupe un certain nombre d&apos;evenements, tu veux que je te les dise ?
									</h3>
									<p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
										Si tu acceptes, je te fais un vrai fil d&apos;ariane: planning, absences, patchnotes,
										projets, taches et le reste. C&apos;est clair, rapide, et actionnable.
									</p>
								</div>

								<div className="flex flex-wrap items-center gap-3">
									<Button
										type="button"
										onClick={() => {
											setStarted(true);
											setStepIndex(0);
										}}
										className="min-w-[180px]"
									>
										Oui, allons-y
									</Button>
									<button
										type="button"
										onClick={closeModal}
										className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
									>
										Non, je passe.
									</button>
								</div>
							</div>
						) : (
							<>
								<div className="mb-4 flex flex-wrap items-center gap-2">
									{sections.map((section, index) => (
										<div key={section.id} className="flex items-center gap-2">
											<div
												className={cn(
													"rounded-full border px-3 py-1 text-xs font-semibold",
													index <= stepIndex
														? "border-slate-300 bg-slate-900 text-white dark:border-slate-500 dark:bg-white dark:text-slate-900"
														: "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
												)}
											>
												{section.title}
											</div>
											{index < sections.length - 1 && (
												<Icon name="chevronRight" size="xs" className="text-slate-400" />
											)}
										</div>
									))}
								</div>

								<div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
									<div className="mb-3 flex items-center gap-2">
										<Icon
											name={activeStep?.icon || "info"}
											size="sm"
											className="text-slate-500 dark:text-slate-300"
										/>
										<div>
											<h4 className="text-lg font-semibold text-slate-900 dark:text-white">
												{activeStep?.title}
											</h4>
											<p className="text-xs text-slate-500 dark:text-slate-400">
												{activeStep?.subtitle}
											</p>
										</div>
									</div>

									{activeStep?.items.length ? (
										<div className="space-y-2">
											{activeStep.items.map((item, index) => (
												<div
													key={`${activeStep.id}-${index}-${item.title}`}
													className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
												>
													<p className="text-sm font-medium text-slate-900 dark:text-white">
														{item.title}
													</p>
													<p className="text-xs text-slate-500 dark:text-slate-400">
														{item.detail}
													</p>
													<p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
														{formatFrenchDate(item.date)}
													</p>
												</div>
											))}
										</div>
									) : (
										<div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
											Rien de critique ici: tu es deja aligne sur cette partie.
										</div>
									)}
								</div>

								<div className="mt-4 flex items-center justify-between">
									<p className="text-xs text-slate-500 dark:text-slate-400">
										Etape {stepIndex + 1}/{sections.length}
									</p>
									<Button type="button" onClick={goNext} className="min-w-[160px]">
										{stepIndex >= sections.length - 1 ? "Terminer" : "Continuer"}
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
