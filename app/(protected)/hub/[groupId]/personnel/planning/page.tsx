"use client";

// React
import { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button, Icon, Modal, ModalFooter } from "@/components/ui";
import { usePlanning } from "@/features/personnel/hooks";
import { PLANNING_EVENT_TYPES, planningEventTypeLabels } from "@/features/personnel/types";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showError } from "@/lib/utils/toast";
import type { PlanningEvent, PlanningEventType } from "@/features/personnel/types";


// ─── Types ──────────────────────────────────────────────────────────────────────

type ViewMode = "month" | "week" | "3day";

// ─── Constants ──────────────────────────────────────────────────────────────────

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

/** Style configuration for each event type used across all views. */
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

/** Predefined event templates that pre-fill the creation form. */
const TEMPLATES: {
	label: string;
	type: PlanningEventType;
	durationMinutes: number;
	isPublic: boolean;
}[] = [
	{ label: "Moment d'échange", type: "meeting", durationMinutes: 60, isPublic: true },
	{ label: "Entrevue personnelle", type: "personal", durationMinutes: 30, isPublic: false },
	{ label: "Entrevue personnelle annuelle", type: "personal", durationMinutes: 60, isPublic: false },
	{ label: "Live", type: "other", durationMinutes: 120, isPublic: true },
	{ label: "Events spéciaux", type: "other", durationMinutes: 180, isPublic: true },
	{ label: "Processus de dérank", type: "meeting", durationMinutes: 45, isPublic: false },
	{ label: "Entrevue Référent / Junior", type: "meeting", durationMinutes: 30, isPublic: false },
	{ label: "Entrevue Resp. / Réf. / Junior", type: "meeting", durationMinutes: 45, isPublic: false },
];

const VIEW_MODE_OPTIONS: { value: ViewMode; label: string }[] = [
	{ value: "month", label: "Mois" },
	{ value: "week", label: "Semaine" },
	{ value: "3day", label: "3 jours" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

/** Formats year/month/date into an ISO date string (YYYY-MM-DD). */
function toDateString(year: number, month: number, date: number): string {
	return `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
}

/** Converts a Date object into an ISO date string (YYYY-MM-DD). */
function dateToString(d: Date): string {
	return toDateString(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Returns a 42-element grid for the given month, including overflow from adjacent months. */
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

/** Returns the Monday of the week that contains the given date. */
function getMonday(d: Date): Date {
	const result = new Date(d);
	const day = result.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	result.setDate(result.getDate() + diff);
	result.setHours(0, 0, 0, 0);
	return result;
}

/** Returns 7 Date objects (Mon-Sun) for the week containing the anchor. */
function getWeekDates(anchor: Date): Date[] {
	const monday = getMonday(anchor);
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		return d;
	});
}

/** Returns 3 Date objects centered on the anchor (prev day, anchor, next day). */
function getThreeDayDates(anchor: Date): Date[] {
	return Array.from({ length: 3 }, (_, i) => {
		const d = new Date(anchor);
		d.setDate(anchor.getDate() + (i - 1));
		return d;
	});
}

/** Adds a number of minutes to a time string (HH:mm) and returns the result. */
function addMinutesToTime(time: string, minutes: number): string {
	const [h, m] = time.split(":").map(Number);
	const totalMin = h * 60 + m + minutes;
	const newH = Math.floor(totalMin / 60) % 24;
	const newM = totalMin % 60;
	return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

/** Converts a time string (HH:mm) to a fractional hour offset from HOUR_START. */
function timeToOffset(time: string): number {
	const [h, m] = time.split(":").map(Number);
	return h + m / 60 - HOUR_START;
}

/** Returns a Monday-based day-of-week index (0=Mon, 6=Sun). */
function getDowIndex(d: Date): number {
	const dow = d.getDay();
	return dow === 0 ? 6 : dow - 1;
}

// ─── Component ──────────────────────────────────────────────────────────────────

/**
 * Planning page with monthly, weekly, and 3-day calendar views.
 * Supports event creation with predefined templates, event viewing, and deletion.
 * @returns The planning calendar page
 */
export default function PlanningPage() {
	const { events, currentMonth, goToNextMonth, goToPrevMonth, goToToday, addEvent, deleteEvent } = usePlanning();

	// ─── View State ──────────────────────────────────────────────────────────
	const [viewMode, setViewMode] = useState<ViewMode>("month");
	const [anchorDate, setAnchorDate] = useState(() => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		return now;
	});

	// ─── Modal State ─────────────────────────────────────────────────────────
	const [modalOpen, setModalOpen] = useState(false);
	const [detailEvent, setDetailEvent] = useState<PlanningEvent | null>(null);
	const [formTitle, setFormTitle] = useState("");
	const [formDescription, setFormDescription] = useState("");
	const [formDate, setFormDate] = useState("");
	const [formStartTime, setFormStartTime] = useState("");
	const [formEndTime, setFormEndTime] = useState("");
	const [formType, setFormType] = useState<PlanningEventType>("meeting");
	const [formIsPublic, setFormIsPublic] = useState(true);
	const [formLocation, setFormLocation] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// ─── Form Helpers ────────────────────────────────────────────────────────

	function resetForm() {
		setFormTitle("");
		setFormDescription("");
		setFormDate("");
		setFormStartTime("");
		setFormEndTime("");
		setFormType("meeting");
		setFormIsPublic(true);
		setFormLocation("");
	}

	function openModal(prefillDate?: string) {
		resetForm();
		if (prefillDate) setFormDate(prefillDate);
		setModalOpen(true);
	}

	function applyTemplate(template: (typeof TEMPLATES)[number]) {
		setFormTitle(template.label);
		setFormType(template.type);
		setFormIsPublic(template.isPublic);

		const baseTime = formStartTime || "09:00";
		setFormStartTime(baseTime);
		setFormEndTime(addMinutesToTime(baseTime, template.durationMinutes));
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
		await new Promise((resolve) => setTimeout(resolve, 300));

		addEvent({
			title: formTitle.trim(),
			description: formDescription.trim() || undefined,
			date: formDate,
			startTime: formStartTime,
			endTime: formEndTime,
			type: formType,
			isPublic: formIsPublic,
			authorId: "user-1",
			authorName: "Jeremy Alpha",
			location: formLocation.trim() || undefined,
		});

		setIsSubmitting(false);
		setModalOpen(false);
		showSuccess("Événement créé avec succès.");
	}

	function handleDelete(eventId: string) {
		deleteEvent(eventId);
		setDetailEvent(null);
		showSuccess("Événement supprimé.");
	}

	// ─── Calendar Data ───────────────────────────────────────────────────────

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

	// ─── Navigation ──────────────────────────────────────────────────────────

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

	// ─── Current Time Indicator ──────────────────────────────────────────────

	const currentTimeOffset = useMemo(() => {
		const now = new Date();
		const hours = now.getHours() + now.getMinutes() / 60;
		if (hours < HOUR_START || hours >= HOUR_END) return null;
		return (hours - HOUR_START) * HOUR_HEIGHT;
	}, []);

	// ─── Styles ──────────────────────────────────────────────────────────────

	const inputClasses = cn(
		"w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900",
		"placeholder-gray-400 transition-colors",
		"focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none",
		"dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
		"dark:focus:border-primary-600 dark:focus:ring-primary-600",
	);

	// ─── Render ──────────────────────────────────────────────────────────────

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
						{detailEvent.description && (
							<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{detailEvent.description}</p>
						)}
						<div className="flex items-center gap-2 text-xs text-gray-400">
							<span>Par {detailEvent.authorName}</span>
							<span>&middot;</span>
							<span>{detailEvent.isPublic ? "Public" : "Privé"}</span>
						</div>
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

			{/* ─── New Event Modal ─── */}
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Nouvel événement"
				description="Créez un nouvel événement dans votre planning."
				size="lg"
			>
				{/* Templates */}
				<div className="mb-5">
					<p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
						Templates
					</p>
					<div className="flex flex-wrap gap-1.5">
						{TEMPLATES.map((tpl) => {
							const isActive = formTitle === tpl.label;
							return (
								<button
									key={tpl.label}
									type="button"
									onClick={() => applyTemplate(tpl)}
									className={cn(
										"rounded-full border px-2.5 py-1 text-xs font-medium transition-colors duration-150",
										isActive
											? "border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
											: cn(
													"border-gray-200 text-gray-600 dark:border-gray-600 dark:text-gray-300",
													"hover:border-primary-200 hover:bg-primary-50/60 hover:text-primary-600",
													"dark:hover:border-primary-700 dark:hover:bg-primary-900/15 dark:hover:text-primary-400",
												),
									)}
								>
									{tpl.label}
								</button>
							);
						})}
					</div>
				</div>

				{/* Form */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{/* Title */}
					<div className="sm:col-span-2">
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
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

					{/* Description */}
					<div className="sm:col-span-2">
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Description
						</label>
						<textarea
							value={formDescription}
							onChange={(e) => setFormDescription(e.target.value)}
							rows={2}
							placeholder="Description optionnelle..."
							className={cn(inputClasses, "resize-none")}
						/>
					</div>

					{/* Date */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Date *
						</label>
						<input
							type="date"
							value={formDate}
							onChange={(e) => setFormDate(e.target.value)}
							className={inputClasses}
						/>
					</div>

					{/* Type */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
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

					{/* Start time */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Heure de début *
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
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Heure de fin *
						</label>
						<input
							type="time"
							value={formEndTime}
							onChange={(e) => setFormEndTime(e.target.value)}
							className={inputClasses}
						/>
					</div>

					{/* Location */}
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
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

					{/* Public checkbox */}
					<div className="flex items-end pb-2">
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

				<ModalFooter className="-mx-6 mt-4 -mb-4">
					<Button variant="cancel" size="sm" onClick={() => setModalOpen(false)}>
						Annuler
					</Button>
					<Button size="sm" onClick={handleSubmit} isLoading={isSubmitting}>
						Créer l&apos;événement
					</Button>
				</ModalFooter>
			</Modal>
		</PageContainer>
	);
}

// ─── Monthly View ───────────────────────────────────────────────────────────────

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
								isToday &&
									"bg-primary-50/50 ring-primary-200 dark:bg-primary-950/30 dark:ring-primary-800 ring-1 ring-inset",
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
											? "bg-primary-500 shadow-primary-500/25 font-bold text-white shadow-sm"
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
									isToday
										? "text-primary-600 dark:text-primary-400"
										: "text-gray-500 dark:text-gray-400",
								)}
							>
								{viewMode === "week" ? DAY_NAMES_SHORT[dowIdx] : DAY_NAMES_FULL[dowIdx]}
							</span>
							<span
								className={cn(
									"flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
									isToday
										? "bg-primary-500 shadow-primary-500/25 text-white shadow-sm"
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
									isToday && "bg-primary-50/30 dark:bg-primary-950/15",
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
