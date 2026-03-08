"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Badge, Button, Icon, Modal, ModalFooter, Input, SectionHeaderBanner, Select, Tag } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/core/structures";
import { CALENDAR_EVENT_LABELS, calendarEventTypeVariantMap, type CalendarEventType } from "@/features/academy/momentum/types";
import { showSuccess } from "@/lib/utils/toast";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/training/calendar",
	section: "protected",
	module: "personnel",
	description: "Calendrier Momentum — sessions, vocaux bilans et lives.",
	requiredPermissions: [{ module: "personnel", action: "view" }],
	entityScoped: true,
});

// ─── Mock data ────────────────────────────────────────────────────────────────

interface MockCalendarEvent {
	id: string;
	type: CalendarEventType;
	title: string;
	description?: string;
	date: string;
	time?: string;
	juniorName?: string;
	participantNames: string[];
}

const MOCK_EVENTS: MockCalendarEvent[] = [
	{
		id: "e1",
		type: "vocal_rrj",
		title: "Vocal bilan RRJ — Léa M.",
		description: "Bilan de fin de Période 1. Décision sur le passage en Période 2.",
		date: "2026-03-10",
		time: "19:00",
		juniorName: "Léa M.",
		participantNames: ["Marc V.", "Sarah D.", "Léa M."],
	},
	{
		id: "e2",
		type: "formation",
		title: "Session formation — Maîtrise Marsha",
		description: "Module pratique sur les commandes Marsha et la gestion des infractions.",
		date: "2026-03-12",
		time: "18:30",
		participantNames: ["Amine C.", "Kévin L."],
	},
	{
		id: "e3",
		type: "vocal_rj",
		title: "Vocal RJ — Amine C.",
		description: "Point de suivi hebdomadaire.",
		date: "2026-03-14",
		time: "20:00",
		juniorName: "Amine C.",
		participantNames: ["Thomas R.", "Amine C."],
	},
	{
		id: "e4",
		type: "live_participation",
		title: "Live Discord — session de modération",
		description: "Session de 2h sur le serveur. Kévin en observation.",
		date: "2026-03-15",
		time: "21:00",
		juniorName: "Kévin L.",
		participantNames: ["Thomas R.", "Kévin L."],
	},
	{
		id: "e5",
		type: "integration",
		title: "Session d'intégration — nouveau Junior",
		description: "Première rencontre avec le nouveau modérateur en attente de confirmation.",
		date: "2026-03-18",
		time: "17:00",
		participantNames: ["Marc V.", "Thomas R."],
	},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});
}

const EVENT_ICON: Record<CalendarEventType, "chat" | "training" | "calendar" | "profile" | "star" | "flag"> = {
	vocal_rrj: "chat",
	vocal_rj: "chat",
	vocal_rr: "chat",
	formation: "training",
	integration: "flag",
	live_participation: "star",
};

const EVENT_COLOR: Record<CalendarEventType, string> = {
	vocal_rrj: "bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400",
	vocal_rj: "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",
	vocal_rr: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
	formation: "bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400",
	integration: "bg-info-100 text-info-600 dark:bg-info-900/30 dark:text-info-400",
	live_participation: "bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Calendrier Momentum — toutes les sessions, bilans et lives de l'entité.
 * Chaque événement est affilié à l'entité courante et à ses Juniors.
 * @returns La page calendrier Momentum
 */
export default function MomentumCalendarPage() {
	void PAGE_CONFIG;
	const { groupId } = useParams<{ groupId: string }>();
	const [selected, setSelected] = useState<MockCalendarEvent | null>(null);
	const [newEventOpen, setNewEventOpen] = useState(false);
	const [typeFilter, setTypeFilter] = useState<CalendarEventType | "all">("all");

	const filtered = typeFilter === "all" ? MOCK_EVENTS : MOCK_EVENTS.filter((e) => e.type === typeFilter);

	const eventTypes: CalendarEventType[] = [
		"vocal_rrj",
		"vocal_rj",
		"vocal_rr",
		"formation",
		"integration",
		"live_participation",
	];

	return (
		<PageContainer
			title="Calendrier Momentum"
			description="Sessions, bilans et lives de l'entité"
			actions={
				<Button variant="primary" size="sm" onClick={() => setNewEventOpen(true)}>
					<Icon name="plus" size="sm" />
					Ajouter un événement
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
					<span className="font-medium text-gray-900 dark:text-white">Calendrier</span>
				</nav>

				{/* Filtres de type */}
				<div className="flex flex-wrap items-center gap-2">
					<button
						onClick={() => setTypeFilter("all")}
						className={cn(
							"rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
							typeFilter === "all"
								? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
						)}
					>
						Tous ({MOCK_EVENTS.length})
					</button>
					{eventTypes.map((type) => {
						const count = MOCK_EVENTS.filter((e) => e.type === type).length;
						if (count === 0) return null;
						return (
							<button
								key={type}
								onClick={() => setTypeFilter(type)}
								className={cn(
									"rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
									typeFilter === type
										? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
								)}
							>
								{CALENDAR_EVENT_LABELS[type]} ({count})
							</button>
						);
					})}
				</div>

				{/* Liste d'événements */}
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
					<SectionHeaderBanner
						icon="calendar"
						title="Événements à venir"
						description="Cliquer sur un événement pour voir le détail"
						accentColor="gray"
						className="rounded-none"
					/>

					{filtered.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
							<Icon name="calendar" size="lg" className="text-gray-300 dark:text-gray-600" />
							<p className="text-sm text-gray-500 dark:text-gray-400">Aucun événement pour ce filtre.</p>
						</div>
					) : (
						<div className="divide-y divide-gray-100 dark:divide-gray-700/50">
							{filtered.map((event) => (
								<button
									key={event.id}
									onClick={() => setSelected(event)}
									className="flex w-full cursor-pointer items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
								>
									{/* Icône type */}
									<div
										className={cn(
											"flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
											EVENT_COLOR[event.type],
										)}
									>
										<Icon name={EVENT_ICON[event.type]} size="md" />
									</div>

									<div className="min-w-0 flex-1">
										<p className="text-sm font-semibold text-gray-900 dark:text-white">
											{event.title}
										</p>
										<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
											{formatDate(event.date)}
											{event.time && ` à ${event.time}`}
										</p>
									</div>

									<Badge variant={calendarEventTypeVariantMap[event.type]} showDot={false}>
										{CALENDAR_EVENT_LABELS[event.type]}
									</Badge>

									<Icon
										name="chevronRight"
										size="sm"
										className="shrink-0 text-gray-400 dark:text-gray-500"
									/>
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Modal détail événement */}
			<Modal isOpen={selected !== null} onClose={() => setSelected(null)} title={selected?.title ?? ""} size="sm">
				{selected && (
					<div className="space-y-4">
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant={calendarEventTypeVariantMap[selected.type]} showDot={false}>
								{CALENDAR_EVENT_LABELS[selected.type]}
							</Badge>
							<Tag color="gray">
								{formatDate(selected.date)}
								{selected.time && ` à ${selected.time}`}
							</Tag>
						</div>

						{selected.description && (
							<p className="text-sm text-gray-700 dark:text-gray-300">{selected.description}</p>
						)}

						{selected.juniorName && (
							<div>
								<p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
									Junior concerné
								</p>
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									{selected.juniorName}
								</p>
							</div>
						)}

						{selected.participantNames.length > 0 && (
							<div>
								<p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
									Participants ({selected.participantNames.length})
								</p>
								<div className="flex flex-wrap gap-1.5">
									{selected.participantNames.map((name) => (
										<Tag key={name} color="gray">
											{name}
										</Tag>
									))}
								</div>
							</div>
						)}

						<Button variant="primary" onClick={() => setSelected(null)} className="w-full">
							Fermer
						</Button>
					</div>
				)}
			</Modal>

			{/* Modal nouvel événement */}
			<Modal isOpen={newEventOpen} onClose={() => setNewEventOpen(false)} title="Ajouter un événement" size="md">
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						showSuccess("Événement ajouté au calendrier Momentum.");
						setNewEventOpen(false);
					}}
				>
					<Input label="Titre" placeholder="ex. Vocal bilan RRJ — Amine C." required />
					<Select
						label="Type d'événement"
						options={eventTypes.map((t) => ({ value: t, label: CALENDAR_EVENT_LABELS[t] }))}
						required
					/>
					<div className="grid grid-cols-2 gap-3">
						<Input label="Date" type="date" required />
						<Input label="Heure" type="time" />
					</div>
					<Input label="Junior concerné (optionnel)" placeholder="Nom du Junior" />
					<Input label="Participants" placeholder="ex. Thomas R., Amine C." />
					<Input label="Description (optionnel)" placeholder="Contexte ou objectif de la session" />
					<ModalFooter>
						<Button variant="cancel" type="button" onClick={() => setNewEventOpen(false)}>
							Annuler
						</Button>
						<Button type="submit">Ajouter</Button>
					</ModalFooter>
				</form>
			</Modal>
		</PageContainer>
	);
}
