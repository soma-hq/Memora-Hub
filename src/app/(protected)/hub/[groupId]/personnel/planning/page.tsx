"use client";

// React
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Badge, Button, Icon, Modal, ModalFooter, Tabs, WizardModal, SectionHeaderBanner } from "@/components/ui";
import type { WizardStep } from "@/components/ui";
import { usePlanning } from "@/features/operations/personnel/hooks";
import { PLANNING_EVENT_TYPES, planningEventTypeLabels } from "@/features/operations/personnel/types";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showError } from "@/lib/utils/toast";
import type { PlanningEvent, PlanningEventType } from "@/features/operations/personnel/types";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/personnel/planning",
	section: "protected",
	module: "personnel",
	description: "Planning du personnel.",
	requiredPermissions: [{ module: "personnel", action: "view" }],
	entityScoped: true,
});

// Types
type ViewMode = "month" | "week" | "3day";

interface SubjectBlock {
	id: string;
	title: string;
	content: string;
}

interface CurrentUserInfo {
	id: string;
	firstName?: string | null;
	lastName?: string | null;
}

// Constants
const MONTH_NAMES = [
	"Janvier",
	"Février",
	"Mars",
	"Avril",
	"Mai",
	"Juin",
	"Juillet",
	"Août",
	"Septembre",
	"Octobre",
	"Novembre",
	"Décembre",
];

const DAY_NAMES_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const DAY_NAMES_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const HOUR_START = 8;
const HOUR_END = 20;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
const HOUR_HEIGHT = 64;

// Style configuration for each event type used across all views
const EVENT_TYPE_STYLES: Record<PlanningEventType, { bg: string; text: string; border: string }> = {
	meeting: {
		bg: "bg-primary-50 dark:bg-primary-900/20",
		text: "text-primary-700 dark:text-primary-400",
		border: "border-l-primary-500",
	},
	monthly: {
		bg: "bg-info-50 dark:bg-info-900/20",
		text: "text-info-700 dark:text-info-400",
		border: "border-l-info-500",
	},
	personal: {
		bg: "bg-success-50 dark:bg-success-900/20",
		text: "text-success-700 dark:text-success-400",
		border: "border-l-success-500",
	},
	other: {
		bg: "bg-gray-100 dark:bg-gray-700/50",
		text: "text-gray-600 dark:text-gray-300",
		border: "border-l-gray-400",
	},
};

// Predefined event templates that pre-fill the creation form
const TEMPLATES: {
	label: string;
	type: PlanningEventType;
	isPublic: boolean;
	preview: string;
	description: string;
}[] = [
	{
		label: "Moment d'échange",
		type: "meeting",
		isPublic: true,
		preview: "Session collaborative courte, cadrée autour d'un enjeu précis.",
		description: "Ouverture, point d'alignement et décisions actionnables.",
	},
	{
		label: "Entrevue personnelle",
		type: "personal",
		isPublic: false,
		preview: "Entretien individuel de suivi avec focus humain.",
		description: "Etat du moral, charge, besoins immédiats.",
	},
	{
		label: "Entrevue personnelle annuelle",
		type: "personal",
		isPublic: false,
		preview: "Bilan annuel structuré et plan de progression.",
		description: "Objectifs, feedback mutuel, projection annuelle.",
	},
	{
		label: "Live",
		type: "other",
		isPublic: true,
		preview: "Format diffusion/live avec gestion des séquences clés.",
		description: "Rythme, points de parole, pilotage en temps réel.",
	},
	{
		label: "Events spéciaux",
		type: "other",
		isPublic: true,
		preview: "Cadre événementiel avec préparation multi-acteurs.",
		description: "Brief, déroulé, contingences et communication.",
	},
	{
		label: "Processus de dérank",
		type: "meeting",
		isPublic: false,
		preview: "Cadre sensible, factuel, avec traçabilité.",
		description: "Faits, impacts, actions et clôture du processus.",
	},
	{
		label: "Entrevue Référent / Junior",
		type: "meeting",
		isPublic: false,
		preview: "Point de mentorat opérationnel.",
		description: "Blocages, progression et prochains jalons.",
	},
	{
		label: "Entrevue Resp. / Réf. / Junior",
		type: "meeting",
		isPublic: false,
		preview: "Trilatérale d'arbitrage et d'alignement.",
		description: "Décisions, responsabilités, points de contrôle.",
	},
];

// Wizard steps definition for planning event creation
const PLANNING_STEPS: WizardStep[] = [
	{
		id: "template",
		title: "Template",
		description: "Sélectionne une base visuelle, puis confirme son application.",
		icon: "sparkles",
	},
	{
		id: "informations",
		title: "Informations",
		description: "Renseigne les informations principales de l'événement.",
		icon: "document",
	},
	{
		id: "topics",
		title: "Blocs sujets",
		description: "Ajoute des sujets par bloc avec contenu markdown détaillé.",
		icon: "tasks",
	},
	{
		id: "schedule",
		title: "Date & Horaire",
		description: "Choisis la date et les horaires de l'événement.",
		icon: "clock",
	},
];

const VIEW_MODE_OPTIONS: { value: ViewMode; label: string }[] = [
	{ value: "month", label: "Mois" },
	{ value: "week", label: "Semaine" },
	{ value: "3day", label: "3 jours" },
];

// Helpers

// Formats year/month/date into an ISO date string (YYYY-MM-DD)
function toDateString(year: number, month: number, date: number): string {
	return `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
}

// Converts a Date object into an ISO date string (YYYY-MM-DD)
function dateToString(d: Date): string {
	return toDateString(d.getFullYear(), d.getMonth(), d.getDate());
}

// Returns a 42-element grid for the given month, including overflow from adjacent months
function getCalendarDays(year: number, month: number) {
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);

	let startDow = firstDay.getDay() - 1;
	if (startDow < 0) startDow = 6;

	const days: { date: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

	const prevMonthLast = new Date(year, month, 0).getDate();
	for (let i = startDow - 1; i >= 0; i--) {
		const prevMonth = month === 0 ? 11 : month - 1;
		const prevYear = month === 0 ? year - 1 : year;
		days.push({ date: prevMonthLast - i, month: prevMonth, year: prevYear, isCurrentMonth: false });
	}

	for (let d = 1; d <= lastDay.getDate(); d++) {
		days.push({ date: d, month, year, isCurrentMonth: true });
	}

	const remaining = 42 - days.length;
	const nextMonth = month === 11 ? 0 : month + 1;
	const nextYear = month === 11 ? year + 1 : year;
	for (let d = 1; d <= remaining; d++) {
		days.push({ date: d, month: nextMonth, year: nextYear, isCurrentMonth: false });
	}

	return days;
}

// Returns the Monday of the week that contains the given date
function getMonday(d: Date): Date {
	const result = new Date(d);
	const day = result.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	result.setDate(result.getDate() + diff);
	result.setHours(0, 0, 0, 0);
	return result;
}

// Returns 7 Date objects (Mon-Sun) for the week containing the anchor
function getWeekDates(anchor: Date): Date[] {
	const monday = getMonday(anchor);
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		return d;
	});
}

// Returns 3 Date objects centered on the anchor
function getThreeDayDates(anchor: Date): Date[] {
	return Array.from({ length: 3 }, (_, i) => {
		const d = new Date(anchor);
		d.setDate(anchor.getDate() + (i - 1));
		return d;
	});
}

// Adds a number of minutes to a time string (HH:mm) and returns the result
function addMinutesToTime(time: string, minutes: number): string {
	const [h, m] = time.split(":").map(Number);
	const totalMin = h * 60 + m + minutes;
	const newH = Math.floor(totalMin / 60) % 24;
	const newM = totalMin % 60;
	return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

// Converts a time string (HH:mm) to a fractional hour offset from HOUR_START
function timeToOffset(time: string): number {
	const [h, m] = time.split(":").map(Number);
	return h + m / 60 - HOUR_START;
}

/** Returns a Monday-based day-of-week index (0=Mon, 6=Sun). */
function getDowIndex(d: Date): number {
	const dow = d.getDay();
	return dow === 0 ? 6 : dow - 1;
}

/**
 * Planning page with monthly, weekly, and 3-day calendar views
 * @returns The planning calendar page
 */
export default function PlanningPage() {
	const params = useParams();
	const groupId = (params.groupId as string) ?? "";
	const { events, currentMonth, goToNextMonth, goToPrevMonth, goToToday, addEvent, deleteEvent } =
		usePlanning(groupId);

	// View State
	const [viewMode, setViewMode] = useState<ViewMode>("month");
	const [anchorDate, setAnchorDate] = useState(() => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		return now;
	});

	// Modal State
	const [modalOpen, setModalOpen] = useState(false);
	const [wizardStep, setWizardStep] = useState(0);
	const [detailEvent, setDetailEvent] = useState<PlanningEvent | null>(null);
	const [detailTab, setDetailTab] = useState<"informations" | "sujets">("informations");
	const [currentUser, setCurrentUser] = useState<CurrentUserInfo | null>(null);
	const [formTitle, setFormTitle] = useState("");
	const [formDescription, setFormDescription] = useState("");
	const [formDate, setFormDate] = useState("");
	const [formStartTime, setFormStartTime] = useState("");
	const [formEndTime, setFormEndTime] = useState("");
	const [formType, setFormType] = useState<PlanningEventType>("meeting");
	const [formIsPublic, setFormIsPublic] = useState(true);
	const [formLocation, setFormLocation] = useState("");
	const [selectedTemplate, setSelectedTemplate] = useState<(typeof TEMPLATES)[number] | null>(null);
	const [subjectBlocks, setSubjectBlocks] = useState<SubjectBlock[]>([
		{ id: `sb-${Date.now()}`, title: "Introduction", content: "- Contexte\n- Objectif" },
	]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form Helpers
	function resetForm() {
		setFormTitle("");
		setFormDescription("");
		setFormDate("");
		setFormStartTime("");
		setFormEndTime("");
		setFormType("meeting");
		setFormIsPublic(true);
		setFormLocation("");
		setSelectedTemplate(null);
		setSubjectBlocks([{ id: `sb-${Date.now()}`, title: "Introduction", content: "- Contexte\n- Objectif" }]);
		setWizardStep(0);
	}

	function openModal(prefillDate?: string) {
		resetForm();
		if (prefillDate) setFormDate(prefillDate);
		setModalOpen(true);
	}

	function previewTemplate(template: (typeof TEMPLATES)[number]) {
		setSelectedTemplate(template);
	}

	function applyTemplate(template: (typeof TEMPLATES)[number], accept: boolean) {
		if (!accept) {
			setSelectedTemplate(null);
			return;
		}

		setFormTitle(template.label);
		setFormType(template.type);
		setFormIsPublic(template.isPublic);
		setFormDescription(template.description);

		const baseTime = formStartTime || "09:00";
		setFormStartTime(baseTime);
		setFormEndTime(addMinutesToTime(baseTime, 60));
		setSelectedTemplate(template);
	}

	function addSubjectBlock() {
		setSubjectBlocks((prev) => [
			...prev,
			{ id: `sb-${Date.now()}-${prev.length}`, title: `Sujet ${prev.length + 1}`, content: "" },
		]);
	}

	function updateSubjectBlock(id: string, key: "title" | "content", value: string) {
		setSubjectBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, [key]: value } : block)));
	}

	function removeSubjectBlock(id: string) {
		setSubjectBlocks((prev) => {
			if (prev.length <= 1) return prev;
			return prev.filter((block) => block.id !== id);
		});
	}

	async function handleSubmit() {
		if (!formTitle.trim() || !formDate || !formStartTime || !formEndTime) {
			showError("Veuillez remplir tous les champs obligatoires.");
			return;
		}

		if (formStartTime >= formEndTime) {
			showError("L'heure de fin doit être postérieure à l'heure de début.");
			return;
		}

		setIsSubmitting(true);

		const normalizedBlocks = subjectBlocks
			.map((block) => ({ title: block.title.trim(), content: block.content.trim() }))
			.filter((block) => block.title || block.content);

		const topicsMarkdown = normalizedBlocks
			.map((block) => {
				const header = block.title ? `## ${block.title}` : "## Sujet";
				return `${header}\n${block.content || "- A completer"}`;
			})
			.join("\n\n");

		const metadata = `<!--memora:authorId=${currentUser?.id ?? "user-1"};authorName=${[currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") || "Equipe"};template=${selectedTemplate?.label ?? "libre"};public=${formIsPublic ? "1" : "0"}-->`;
		const mergedDescription = [metadata, formDescription.trim(), topicsMarkdown].filter(Boolean).join("\n\n");

		const created = await addEvent({
			title: formTitle.trim(),
			description: mergedDescription,
			date: formDate,
			startTime: formStartTime,
			endTime: formEndTime,
			type: formType,
			isPublic: formIsPublic,
			authorId: currentUser?.id ?? "user-1",
			authorName: [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") || "Jeremy Alpha",
			location: formLocation.trim() || undefined,
		});

		setIsSubmitting(false);

		if (!created) {
			showError("Impossible de créer l'événement pour le moment.");
			return;
		}

		setModalOpen(false);
		showSuccess("Événement créé avec succès.");
	}

	function handleDelete(eventId: string) {
		deleteEvent(eventId);
		setDetailEvent(null);
		showSuccess("Événement supprimé.");
	}

	useEffect(() => {
		let isMounted = true;

		async function loadCurrentUser() {
			try {
				const response = await fetch("/api/users/me", { cache: "no-store" });
				if (!response.ok) return;
				const payload = (await response.json()) as { user?: CurrentUserInfo };
				if (!isMounted || !payload.user) return;
				setCurrentUser(payload.user);
			} catch {
				// Keep fallback values when user profile cannot be loaded.
			}
		}

		void loadCurrentUser();

		return () => {
			isMounted = false;
		};
	}, []);

	// Calendar Data
	const calendarDays = useMemo(() => getCalendarDays(currentMonth.year, currentMonth.month), [currentMonth]);

	const eventsByDate = useMemo(() => {
		const map: Record<string, PlanningEvent[]> = {};
		for (const evt of events) {
			if (!map[evt.date]) map[evt.date] = [];
			map[evt.date].push(evt);
		}
		return map;
	}, [events]);

	const todayStr = useMemo(() => dateToString(new Date()), []);

	const viewDates = useMemo(() => {
		if (viewMode === "week") return getWeekDates(anchorDate);
		if (viewMode === "3day") return getThreeDayDates(anchorDate);
		return [];
	}, [viewMode, anchorDate]);

	// Navigation
	function handlePrev() {
		if (viewMode === "month") {
			goToPrevMonth();
		} else if (viewMode === "week") {
			setAnchorDate((prev) => {
				const d = new Date(prev);
				d.setDate(d.getDate() - 7);
				return d;
			});
		} else {
			setAnchorDate((prev) => {
				const d = new Date(prev);
				d.setDate(d.getDate() - 3);
				return d;
			});
		}
	}

	function handleNext() {
		if (viewMode === "month") {
			goToNextMonth();
		} else if (viewMode === "week") {
			setAnchorDate((prev) => {
				const d = new Date(prev);
				d.setDate(d.getDate() + 7);
				return d;
			});
		} else {
			setAnchorDate((prev) => {
				const d = new Date(prev);
				d.setDate(d.getDate() + 3);
				return d;
			});
		}
	}

	function handleToday() {
		goToToday();
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		setAnchorDate(now);
	}

	const navigationLabel = useMemo(() => {
		if (viewMode === "month") {
			return `${MONTH_NAMES[currentMonth.month]} ${currentMonth.year}`;
		}
		if (viewDates.length === 0) return "";
		const first = viewDates[0];
		const last = viewDates[viewDates.length - 1];
		if (first.getMonth() === last.getMonth()) {
			return `${first.getDate()} — ${last.getDate()} ${MONTH_NAMES[first.getMonth()]} ${first.getFullYear()}`;
		}
		return `${first.getDate()} ${MONTH_NAMES[first.getMonth()]} — ${last.getDate()} ${MONTH_NAMES[last.getMonth()]} ${last.getFullYear()}`;
	}, [viewMode, currentMonth, viewDates]);

	// Current Time Indicator
	const currentTimeOffset = useMemo(() => {
		const now = new Date();
		const hours = now.getHours() + now.getMinutes() / 60;
		if (hours < HOUR_START || hours >= HOUR_END) return null;
		return (hours - HOUR_START) * HOUR_HEIGHT;
	}, []);

	const detailSubjects = useMemo(() => {
		if (!detailEvent?.description) return [] as Array<{ title: string; content: string }>;
		const chunks = detailEvent.description
			.split(/\n(?=##\s+)/)
			.map((chunk) => chunk.trim())
			.filter((chunk) => chunk.startsWith("## "));

		return chunks.map((chunk) => {
			const [header, ...rest] = chunk.split("\n");
			return {
				title: header.replace(/^##\s+/, "").trim(),
				content: rest.join("\n").trim(),
			};
		});
	}, [detailEvent?.description]);

	useEffect(() => {
		setDetailTab("informations");
	}, [detailEvent?.id]);

	// Styles
	const inputClasses = cn(
		"w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900",
		"placeholder-gray-400 transition-colors",
		"focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none",
		"dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
		"dark:focus:border-primary-600 dark:focus:ring-primary-600",
	);

	// Render
	return (
		<PageContainer
			title="Planning"
			description="Consultez et gérez votre planning personnel et les événements partagés."
			actions={
				<Button size="sm" onClick={() => openModal()}>
					<Icon name="plus" size="xs" />
					Nouvel événement
				</Button>
			}
		>
			<SectionHeaderBanner
				icon="calendar"
				title="Planning"
				description="Consultez et gérez votre planning et les événements partagés."
				className="mb-6"
			/>
			{/* ─── Toolbar ─── */}
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				{/* View mode toggle */}
				<div
					className={cn(
						"inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5",
						"dark:border-gray-700 dark:bg-gray-800",
					)}
				>
					{VIEW_MODE_OPTIONS.map((mode) => (
						<button
							key={mode.value}
							onClick={() => setViewMode(mode.value)}
							className={cn(
								"rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
								viewMode === mode.value
									? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
									: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
							)}
						>
							{mode.label}
						</button>
					))}
				</div>

				{/* Navigation */}
				<div className="flex items-center gap-2">
					<button
						onClick={handlePrev}
						className={cn(
							"flex h-8 w-8 items-center justify-center rounded-lg",
							"text-gray-500 hover:bg-gray-100 hover:text-gray-700",
							"dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
							"transition-all duration-200",
						)}
					>
						<Icon name="chevronLeft" size="sm" />
					</button>
					<h2 className="min-w-[240px] text-center text-lg font-semibold text-gray-900 dark:text-white">
						{navigationLabel}
					</h2>
					<button
						onClick={handleNext}
						className={cn(
							"flex h-8 w-8 items-center justify-center rounded-lg",
							"text-gray-500 hover:bg-gray-100 hover:text-gray-700",
							"dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
							"transition-all duration-200",
						)}
					>
						<Icon name="chevronRight" size="sm" />
					</button>
					<Button variant="ghost" size="sm" onClick={handleToday}>
						Aujourd&apos;hui
					</Button>
				</div>
			</div>

			{/* ─── Monthly View ─── */}
			{viewMode === "month" && (
				<MonthlyView
					calendarDays={calendarDays}
					eventsByDate={eventsByDate}
					todayStr={todayStr}
					onAddEvent={openModal}
					onSelectEvent={setDetailEvent}
				/>
			)}

			{/* ─── Weekly / 3-Day View ─── */}
			{(viewMode === "week" || viewMode === "3day") && (
				<TimeGridView
					viewMode={viewMode}
					dates={viewDates}
					eventsByDate={eventsByDate}
					todayStr={todayStr}
					currentTimeOffset={currentTimeOffset}
					onAddEvent={openModal}
					onSelectEvent={setDetailEvent}
				/>
			)}

			{/* ─── Event Detail Modal ─── */}
			{detailEvent && (
				<Modal
					isOpen={!!detailEvent}
					onClose={() => setDetailEvent(null)}
					title={detailEvent.title}
					description={planningEventTypeLabels[detailEvent.type]}
					size="md"
				>
					<div className="space-y-4">
						<Tabs
							tabs={[
								{ id: "informations", label: "Informations", icon: "info" },
								{ id: "sujets", label: "Sujets", icon: "document", count: detailSubjects.length },
							]}
							activeTab={detailTab}
							onTabChange={(tab) => setDetailTab(tab as "informations" | "sujets")}
						/>

						{detailTab === "informations" && (
							<div className="space-y-3">
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<Icon name="calendar" size="sm" />
									<span>
										{new Date(detailEvent.date).toLocaleDateString("fr-FR", {
											weekday: "long",
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<Icon name="clock" size="sm" />
									<span>
										{detailEvent.startTime} — {detailEvent.endTime}
									</span>
								</div>
								{detailEvent.location && (
									<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
										<Icon name="location" size="sm" />
										<span>{detailEvent.location}</span>
									</div>
								)}
								<div className="flex items-center gap-2 text-xs text-gray-400">
									<span>Par {detailEvent.authorName}</span>
									<span>&middot;</span>
									<span>{detailEvent.isPublic ? "Public" : "Privé"}</span>
								</div>
							</div>
						)}

						{detailTab === "sujets" && (
							<div className="space-y-2">
								{detailSubjects.length === 0 ? (
									<p className="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
										Aucun bloc sujet déclaré pour cet événement.
									</p>
								) : (
									detailSubjects.map((subject) => (
										<div
											key={`${subject.title}-${subject.content}`}
											className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60"
										>
											<p className="text-sm font-semibold text-gray-900 dark:text-white">
												{subject.title}
											</p>
											<p className="mt-1 text-xs whitespace-pre-wrap text-gray-600 dark:text-gray-300">
												{subject.content || "-"}
											</p>
										</div>
									))
								)}
							</div>
						)}
					</div>

					<ModalFooter className="-mx-6 mt-4 -mb-4">
						{detailEvent.authorId === "user-1" && (
							<Button variant="cancel" size="sm" onClick={() => handleDelete(detailEvent.id)}>
								Supprimer
							</Button>
						)}
						<Button variant="ghost" size="sm" onClick={() => setDetailEvent(null)}>
							Fermer
						</Button>
					</ModalFooter>
				</Modal>
			)}

			{/* ─── New Event Wizard Modal ─── */}
			<WizardModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				steps={PLANNING_STEPS}
				currentStep={wizardStep}
				onStepChange={setWizardStep}
				onSubmit={handleSubmit}
				submitLabel="Créer l'événement"
				size="lg"
			>
				{/* Step 1: Template selection */}
				{wizardStep === 0 && (
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr]">
						<div className="space-y-2">
							{TEMPLATES.map((tpl) => {
								const isSelected = selectedTemplate?.label === tpl.label;
								return (
									<button
										key={tpl.label}
										type="button"
										onClick={() => previewTemplate(tpl)}
										className={cn(
											"w-full rounded-xl border px-4 py-3 text-left transition-all duration-200",
											isSelected
												? "border-primary-400 bg-primary-50 dark:border-primary-600 dark:bg-primary-900/20"
												: "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
										)}
									>
										<p className="text-sm font-semibold text-gray-900 dark:text-white">
											{tpl.label}
										</p>
										<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{tpl.preview}</p>
									</button>
								);
							})}
						</div>

						<div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
							{selectedTemplate ? (
								<>
									<p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
										Prévisualisation
									</p>
									<h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
										{selectedTemplate.label}
									</h3>
									<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
										{selectedTemplate.description}
									</p>
									<div className="mt-3 flex items-center gap-2 text-xs">
										<Badge variant="neutral" showDot={false}>
											{planningEventTypeLabels[selectedTemplate.type]}
										</Badge>
										<Badge
											variant={selectedTemplate.isPublic ? "success" : "warning"}
											showDot={false}
										>
											{selectedTemplate.isPublic ? "Public" : "Privé"}
										</Badge>
									</div>
									<div className="mt-4 flex gap-2">
										<Button size="sm" onClick={() => applyTemplate(selectedTemplate, true)}>
											Oui, appliquer ce template
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => applyTemplate(selectedTemplate, false)}
										>
											Non, je passe en manuel
										</Button>
									</div>
								</>
							) : (
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Clique sur un template à gauche pour afficher son visuel, puis confirme si tu veux
									l'utiliser.
								</p>
							)}
						</div>
					</div>
				)}

				{/* Step 2: Informations */}
				{wizardStep === 1 && (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{/* Title */}
						<div className="sm:col-span-2">
							<label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
								Titre *
							</label>
							<input
								type="text"
								value={formTitle}
								onChange={(e) => setFormTitle(e.target.value)}
								placeholder="Nom de l'événement"
								className={inputClasses}
							/>
						</div>

						{/* Type */}
						<div>
							<label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
								Type
							</label>
							<select
								value={formType}
								onChange={(e) => setFormType(e.target.value as PlanningEventType)}
								className={inputClasses}
							>
								{PLANNING_EVENT_TYPES.map((type) => (
									<option key={type} value={type}>
										{planningEventTypeLabels[type]}
									</option>
								))}
							</select>
						</div>

						{/* Location */}
						<div>
							<label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
								Lieu
							</label>
							<input
								type="text"
								value={formLocation}
								onChange={(e) => setFormLocation(e.target.value)}
								placeholder="Salle, lien visio..."
								className={inputClasses}
							/>
						</div>

						{/* Description */}
						<div className="sm:col-span-2">
							<label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
								Contexte
							</label>
							<textarea
								value={formDescription}
								onChange={(e) => setFormDescription(e.target.value)}
								rows={4}
								placeholder="Contexte global, objectifs, contraintes..."
								className={cn(inputClasses, "resize-none")}
							/>
						</div>

						{/* Public checkbox */}
						<div className="sm:col-span-2">
							<label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
								<input
									type="checkbox"
									checked={formIsPublic}
									onChange={(e) => setFormIsPublic(e.target.checked)}
									className={cn(
										"h-4 w-4 rounded border-gray-300",
										"text-primary-500 focus:ring-primary-500",
										"dark:border-gray-600 dark:bg-gray-800",
									)}
								/>
								Événement public
							</label>
						</div>
					</div>
				)}

				{/* Step 3: Subject blocks */}
				{wizardStep === 2 && (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<p className="text-sm text-gray-600 dark:text-gray-300">
								Ajoute des sujets par bloc. Chaque bloc accepte du markdown libre.
							</p>
							<Button variant="ghost" size="sm" onClick={addSubjectBlock}>
								<Icon name="plus" size="xs" />
								Ajouter un nouveau sujet
							</Button>
						</div>

						<div className="space-y-3">
							{subjectBlocks.map((block, index) => (
								<div
									key={block.id}
									className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
								>
									<div className="mb-2 flex items-center justify-between gap-2">
										<input
											type="text"
											value={block.title}
											onChange={(e) => updateSubjectBlock(block.id, "title", e.target.value)}
											placeholder={`Sujet ${index + 1}`}
											className={cn(inputClasses, "py-1.5")}
										/>
										<button
											type="button"
											onClick={() => removeSubjectBlock(block.id)}
											disabled={subjectBlocks.length <= 1}
											className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-gray-800"
										>
											<Icon name="close" size="sm" />
										</button>
									</div>
									<textarea
										rows={4}
										value={block.content}
										onChange={(e) => updateSubjectBlock(block.id, "content", e.target.value)}
										placeholder="- Point 1\n- Point 2\n- Decision"
										className={cn(inputClasses, "resize-y py-2")}
									/>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Step 4: Date & Time */}
				{wizardStep === 3 && (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						{/* Date */}
						<div>
							<label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
								Date *
							</label>
							<input
								type="date"
								value={formDate}
								onChange={(e) => setFormDate(e.target.value)}
								className={inputClasses}
							/>
						</div>

						{/* Start time */}
						<div>
							<label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
								Début *
							</label>
							<input
								type="time"
								value={formStartTime}
								onChange={(e) => setFormStartTime(e.target.value)}
								className={inputClasses}
							/>
						</div>

						{/* End time */}
						<div>
							<label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
								Fin *
							</label>
							<input
								type="time"
								value={formEndTime}
								onChange={(e) => setFormEndTime(e.target.value)}
								className={inputClasses}
							/>
						</div>
					</div>
				)}
			</WizardModal>
		</PageContainer>
	);
}

// Monthly View
interface MonthlyViewProps {
	calendarDays: ReturnType<typeof getCalendarDays>;
	eventsByDate: Record<string, PlanningEvent[]>;
	todayStr: string;
	onAddEvent: (dateStr: string) => void;
	onSelectEvent: (event: PlanningEvent) => void;
}

function MonthlyView({ calendarDays, eventsByDate, todayStr, onAddEvent, onSelectEvent }: MonthlyViewProps) {
	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
			{/* Day names header */}
			<div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
				{DAY_NAMES_SHORT.map((day) => (
					<div
						key={day}
						className={cn(
							"py-2.5 text-center text-[11px] font-semibold tracking-wider uppercase",
							"text-gray-500 dark:text-gray-400",
							"bg-gray-50 dark:bg-gray-800/80",
						)}
					>
						{day}
					</div>
				))}
			</div>

			{/* Calendar cells */}
			<div className="grid grid-cols-7">
				{calendarDays.map((day, index) => {
					const dateStr = toDateString(day.year, day.month, day.date);
					const dayEvents = eventsByDate[dateStr] || [];
					const isToday = dateStr === todayStr;

					return (
						<div
							key={index}
							className={cn(
								"group relative min-h-[100px] border-r border-b p-1.5",
								"border-gray-100 dark:border-gray-800",
								"transition-colors duration-150",
								day.isCurrentMonth ? "bg-white dark:bg-gray-900" : "bg-gray-50/70 dark:bg-gray-900/60",
								!isToday && "hover:bg-gray-50 dark:hover:bg-gray-800/60",
								isToday && "ring-0",
							)}
						>
							{/* Top row: + button (left) and date number (right) */}
							<div className="mb-1 flex items-center justify-between">
								<button
									onClick={() => onAddEvent(dateStr)}
									className={cn(
										"flex h-5 w-5 items-center justify-center rounded",
										"hover:bg-primary-100 hover:text-primary-600 text-gray-300",
										"dark:hover:bg-primary-900/30 dark:hover:text-primary-400 dark:text-gray-600",
										"opacity-0 transition-all duration-150 group-hover:opacity-100",
									)}
									title="Ajouter un événement"
								>
									<Icon name="plus" size="xs" />
								</button>

								<span
									className={cn(
										"flex h-7 w-7 items-center justify-center rounded-full text-xs",
										isToday
											? "border border-amber-500 font-bold text-amber-600 dark:text-amber-400"
											: day.isCurrentMonth
												? "font-medium text-gray-800 dark:text-gray-200"
												: "text-gray-300 dark:text-gray-600",
									)}
								>
									{day.date}
								</span>
							</div>

							{/* Event tags */}
							<div className="flex flex-col gap-0.5">
								{dayEvents.slice(0, 3).map((evt) => {
									const styles = EVENT_TYPE_STYLES[evt.type];
									return (
										<button
											key={evt.id}
											onClick={() => onSelectEvent(evt)}
											className={cn(
												"w-full truncate rounded border-l-2 px-1.5 py-0.5 text-left",
												"text-[10px] leading-tight font-semibold",
												"transition-all duration-150 hover:shadow-sm",
												styles.bg,
												styles.text,
												styles.border,
											)}
										>
											{evt.title}
										</button>
									);
								})}
								{dayEvents.length > 3 && (
									<span className="px-1.5 text-[9px] font-medium text-gray-400 dark:text-gray-500">
										+{dayEvents.length - 3} autre{dayEvents.length - 3 > 1 ? "s" : ""}
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

// ─── Time Grid View (Weekly / 3-Day) ────────────────────────────────────────────

interface TimeGridViewProps {
	viewMode: "week" | "3day";
	dates: Date[];
	eventsByDate: Record<string, PlanningEvent[]>;
	todayStr: string;
	currentTimeOffset: number | null;
	onAddEvent: (dateStr: string) => void;
	onSelectEvent: (event: PlanningEvent) => void;
}

function TimeGridView({
	viewMode,
	dates,
	eventsByDate,
	todayStr,
	currentTimeOffset,
	onAddEvent,
	onSelectEvent,
}: TimeGridViewProps) {
	const gridCols = viewMode === "week" ? "grid-cols-[56px_repeat(7,1fr)]" : "grid-cols-[56px_repeat(3,1fr)]";

	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
			{/* Header: day names and dates */}
			<div className={cn("grid border-b border-gray-200 dark:border-gray-700", gridCols)}>
				{/* Empty corner cell */}
				<div className="border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/80" />

				{dates.map((d, i) => {
					const isToday = dateToString(d) === todayStr;
					const dowIdx = getDowIndex(d);

					return (
						<div
							key={i}
							className={cn(
								"flex flex-col items-center gap-0.5 py-2.5",
								"border-r border-gray-200 last:border-r-0",
								"bg-gray-50 dark:border-gray-700 dark:bg-gray-800/80",
							)}
						>
							<span
								className={cn(
									"text-[11px] font-semibold tracking-wider uppercase",
									isToday ? "text-amber-600 dark:text-amber-400" : "text-gray-500 dark:text-gray-400",
								)}
							>
								{viewMode === "week" ? DAY_NAMES_SHORT[dowIdx] : DAY_NAMES_FULL[dowIdx]}
							</span>
							<span
								className={cn(
									"flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
									isToday
										? "border border-amber-500 text-amber-600 dark:text-amber-400"
										: "text-gray-700 dark:text-gray-300",
								)}
							>
								{d.getDate()}
							</span>
						</div>
					);
				})}
			</div>

			{/* Scrollable time grid */}
			<div className="overflow-y-auto" style={{ maxHeight: "640px" }}>
				<div className={cn("relative grid", gridCols)}>
					{/* Hour labels column */}
					<div className="border-r border-gray-200 dark:border-gray-700">
						{HOURS.map((hour) => (
							<div
								key={hour}
								className="relative flex justify-end pr-2"
								style={{ height: `${HOUR_HEIGHT}px` }}
							>
								<span className="relative -top-2 text-[10px] font-medium text-gray-400 tabular-nums dark:text-gray-500">
									{String(hour).padStart(2, "0")}:00
								</span>
							</div>
						))}
					</div>

					{/* Day columns */}
					{dates.map((d, colIdx) => {
						const dateStr = dateToString(d);
						const dayEvents = (eventsByDate[dateStr] || []).sort((a, b) =>
							a.startTime.localeCompare(b.startTime),
						);
						const isToday = dateStr === todayStr;

						return (
							<div
								key={colIdx}
								className={cn(
									"group relative border-r border-gray-200 last:border-r-0 dark:border-gray-700",
									isToday && "bg-amber-50/40 dark:bg-amber-950/10",
								)}
							>
								{/* Hour grid lines */}
								{HOURS.map((hour) => (
									<div
										key={hour}
										className="border-b border-gray-100 dark:border-gray-800"
										style={{ height: `${HOUR_HEIGHT}px` }}
									/>
								))}

								{/* Add button (top-left corner, visible on hover) */}
								<button
									onClick={() => onAddEvent(dateStr)}
									className={cn(
										"absolute top-1 left-1 z-20 flex h-5 w-5 items-center justify-center rounded",
										"hover:bg-primary-100 hover:text-primary-600 text-gray-300",
										"dark:hover:bg-primary-900/30 dark:hover:text-primary-400 dark:text-gray-600",
										"opacity-0 transition-all duration-150 group-hover:opacity-100",
									)}
									title="Ajouter un événement"
								>
									<Icon name="plus" size="xs" />
								</button>

								{/* Current time indicator */}
								{isToday && currentTimeOffset !== null && (
									<div
										className="pointer-events-none absolute right-0 left-0 z-30"
										style={{ top: `${currentTimeOffset}px` }}
									>
										<div className="relative flex items-center">
											<div className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
											<div className="h-[2px] w-full bg-red-500" />
										</div>
									</div>
								)}

								{/* Positioned events */}
								{dayEvents.map((evt) => {
									const topOffset = Math.max(0, timeToOffset(evt.startTime)) * HOUR_HEIGHT;
									const bottomOffset = Math.max(0, timeToOffset(evt.endTime)) * HOUR_HEIGHT;
									const height = Math.max(bottomOffset - topOffset, 22);
									const styles = EVENT_TYPE_STYLES[evt.type];

									return (
										<button
											key={evt.id}
											onClick={() => onSelectEvent(evt)}
											className={cn(
												"absolute inset-x-1 z-10 overflow-hidden rounded-md border-l-2 px-1.5 py-1",
												"text-left transition-shadow duration-150 hover:shadow-md",
												styles.bg,
												styles.text,
												styles.border,
											)}
											style={{ top: `${topOffset}px`, height: `${height}px` }}
										>
											<p className="truncate text-[11px] leading-tight font-semibold">
												{evt.title}
											</p>
											{height >= 38 && (
												<p className="mt-0.5 truncate text-[10px] opacity-70">
													{evt.startTime} — {evt.endTime}
												</p>
											)}
										</button>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
