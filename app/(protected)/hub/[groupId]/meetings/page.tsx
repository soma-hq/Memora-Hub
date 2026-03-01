"use client";

// React
import { useState } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Icon, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showInfo } from "@/lib/utils/toast";


type MeetingStatus = "planifiee" | "en_cours" | "terminee";

interface Participant {
	initials: string;
	color: string;
}

interface UpcomingMeeting {
	id: string;
	title: string;
	description: string;
	date: Date;
	duration: string;
	location: string;
	locationType: "visio" | "presentiel";
	status: MeetingStatus;
	participants: Participant[];
}

interface PastMeeting {
	id: string;
	title: string;
	date: Date;
	participantCount: number;
	duration: string;
}

// Status config

const statusConfig: Record<MeetingStatus, { label: string; variant: "info" | "warning" | "success" }> = {
	planifiee: { label: "Planifiee", variant: "info" },
	en_cours: { label: "En cours", variant: "warning" },
	terminee: { label: "Terminee", variant: "success" },
};

// Mock data — upcoming meetings

const UPCOMING_MEETINGS: UpcomingMeeting[] = [
	{
		id: "m1",
		title: "Sprint planning S10",
		description: "Planification du sprint 10 : priorisation du backlog et estimation des stories.",
		date: new Date("2026-03-02T09:00:00"),
		duration: "1h30",
		location: "Google Meet",
		locationType: "visio",
		status: "planifiee",
		participants: [
			{ initials: "JD", color: "bg-primary-500" },
			{ initials: "AL", color: "bg-success-500" },
			{ initials: "MR", color: "bg-warning-500" },
			{ initials: "SC", color: "bg-error-500" },
			{ initials: "PL", color: "bg-info-500" },
		],
	},
	{
		id: "m2",
		title: "Revue design systeme",
		description: "Validation des composants UI et harmonisation de la charte graphique.",
		date: new Date("2026-03-04T14:00:00"),
		duration: "1h",
		location: "Salle Voltaire",
		locationType: "presentiel",
		status: "planifiee",
		participants: [
			{ initials: "JD", color: "bg-primary-500" },
			{ initials: "NB", color: "bg-info-500" },
			{ initials: "KT", color: "bg-success-500" },
		],
	},
	{
		id: "m3",
		title: "Point quotidien equipe",
		description: "Stand-up quotidien : avancement, blocages et synchronisation.",
		date: new Date("2026-03-05T09:30:00"),
		duration: "15min",
		location: "Microsoft Teams",
		locationType: "visio",
		status: "en_cours",
		participants: [
			{ initials: "JD", color: "bg-primary-500" },
			{ initials: "AL", color: "bg-success-500" },
			{ initials: "MR", color: "bg-warning-500" },
			{ initials: "SC", color: "bg-error-500" },
		],
	},
	{
		id: "m4",
		title: "Reunion client — Bilan mensuel",
		description: "Presentation des livrables du mois et recueil du feedback client.",
		date: new Date("2026-03-10T10:00:00"),
		duration: "2h",
		location: "Salle de conference A3",
		locationType: "presentiel",
		status: "planifiee",
		participants: [
			{ initials: "JD", color: "bg-primary-500" },
			{ initials: "PL", color: "bg-info-500" },
			{ initials: "NB", color: "bg-success-500" },
			{ initials: "AL", color: "bg-warning-500" },
			{ initials: "SC", color: "bg-error-500" },
			{ initials: "KT", color: "bg-primary-400" },
		],
	},
	{
		id: "m5",
		title: "Retrospective sprint 9",
		description: "Retour sur le sprint 9 : points positifs, axes d'amelioration et actions.",
		date: new Date("2026-03-12T16:00:00"),
		duration: "1h",
		location: "Zoom",
		locationType: "visio",
		status: "planifiee",
		participants: [
			{ initials: "JD", color: "bg-primary-500" },
			{ initials: "AL", color: "bg-success-500" },
			{ initials: "MR", color: "bg-warning-500" },
		],
	},
];

// Mock data — past meetings

const PAST_MEETINGS: PastMeeting[] = [
	{
		id: "p1",
		title: "Kick-off projet Memora",
		date: new Date("2026-01-15T10:00:00"),
		participantCount: 8,
		duration: "2h",
	},
	{
		id: "p2",
		title: "Atelier architecture technique",
		date: new Date("2026-01-22T14:00:00"),
		participantCount: 5,
		duration: "1h30",
	},
	{
		id: "p3",
		title: "Revue de code — module authentification",
		date: new Date("2026-02-05T11:00:00"),
		participantCount: 4,
		duration: "45min",
	},
	{
		id: "p4",
		title: "Demo sprint 8",
		date: new Date("2026-02-18T15:00:00"),
		participantCount: 12,
		duration: "1h",
	},
];

// Tab definition

type TabKey = "upcoming" | "history";

interface TabItem {
	key: TabKey;
	label: string;
	icon: "calendar" | "clock";
}

const TABS: TabItem[] = [
	{ key: "upcoming", label: "Prochaines reunions", icon: "calendar" },
	{ key: "history", label: "Historique", icon: "clock" },
];

// Helpers

const MONTHS_SHORT = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];

function formatTime(d: Date): string {
	return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function formatFullDate(d: Date): string {
	return d.toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

// Circle colors for calendar day badges — cycle based on month
const dateCircleColors: Record<number, string> = {
	0: "bg-error-500",
	1: "bg-primary-500",
	2: "bg-success-500",
	3: "bg-warning-500",
	4: "bg-info-500",
	5: "bg-primary-600",
	6: "bg-error-400",
	7: "bg-success-600",
	8: "bg-warning-600",
	9: "bg-info-600",
	10: "bg-primary-400",
	11: "bg-error-600",
};

// Sub-components

function ParticipantAvatars({ participants }: { participants: Participant[] }) {
	const maxVisible = 4;
	const visible = participants.slice(0, maxVisible);
	const overflow = participants.length - maxVisible;

	return (
		<div className="flex items-center -space-x-2">
			{visible.map((p, i) => (
				<div
					key={i}
					className={cn(
						"flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-white transition-all duration-200 dark:ring-gray-800",
						p.color,
					)}
					title={p.initials}
				>
					{p.initials}
				</div>
			))}
			{overflow > 0 && (
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600 ring-2 ring-white transition-all duration-200 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-800">
					+{overflow}
				</div>
			)}
		</div>
	);
}

function UpcomingMeetingCard({ meeting }: { meeting: UpcomingMeeting }) {
	const day = meeting.date.getDate();
	const month = MONTHS_SHORT[meeting.date.getMonth()];
	const circleColor = dateCircleColors[meeting.date.getMonth()] ?? "bg-primary-500";
	const { label: statusLabel, variant: statusVariant } = statusConfig[meeting.status];

	return (
		<Card className="transition-all duration-200 hover:shadow-md">
			<div className="flex gap-4">
				{/* Date column */}
				<div className="flex shrink-0 flex-col items-center">
					<div
						className={cn(
							"flex h-14 w-14 flex-col items-center justify-center rounded-full text-white transition-all duration-200",
							circleColor,
						)}
					>
						<span className="text-lg leading-none font-bold">{day}</span>
						<span className="text-[10px] leading-tight uppercase opacity-90">{month}</span>
					</div>
					<span className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{formatTime(meeting.date)}</span>
				</div>

				{/* Content column */}
				<div className="min-w-0 flex-1">
					{/* Title row */}
					<div className="flex flex-wrap items-start justify-between gap-2">
						<h3 className="text-base font-semibold text-gray-900 transition-all duration-200 dark:text-white">
							{meeting.title}
						</h3>
						<Badge variant={statusVariant}>{statusLabel}</Badge>
					</div>

					{/* Description */}
					<p className="mt-1 text-sm text-gray-600 transition-all duration-200 dark:text-gray-400">
						{meeting.description}
					</p>

					{/* Meta row */}
					<div className="mt-3 flex flex-wrap items-center gap-3">
						{/* Location badge */}
						<Badge variant="neutral" showDot={false} className="gap-1.5">
							<Icon name={meeting.locationType === "visio" ? "video" : "location"} size="xs" />
							{meeting.location}
						</Badge>

						{/* Duration */}
						<span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
							<Icon name="clock" size="xs" />
							{meeting.duration}
						</span>
					</div>

					{/* Bottom row: participants + action */}
					<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
						<ParticipantAvatars participants={meeting.participants} />

						{meeting.status === "planifiee" && (
							<Button
								variant="soft-primary"
								size="sm"
								onClick={() => showSuccess(`Vous avez rejoint la reunion "${meeting.title}".`)}
							>
								<Icon name="video" size="sm" />
								Rejoindre
							</Button>
						)}

						{meeting.status === "en_cours" && (
							<Button
								variant="soft-warning"
								size="sm"
								onClick={() => showSuccess(`Vous avez rejoint la reunion "${meeting.title}".`)}
							>
								<Icon name="video" size="sm" />
								Rejoindre maintenant
							</Button>
						)}
					</div>
				</div>
			</div>
		</Card>
	);
}

function PastMeetingRow({ meeting }: { meeting: PastMeeting }) {
	return (
		<div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-3 transition-all duration-200 dark:border-gray-700/50 dark:bg-gray-800/40">
			{/* Icon */}
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-all duration-200 dark:bg-gray-700 dark:text-gray-400">
				<Icon name="calendar" size="sm" />
			</div>

			{/* Info */}
			<div className="min-w-0 flex-1">
				<h4 className="truncate text-sm font-medium text-gray-700 transition-all duration-200 dark:text-gray-200">
					{meeting.title}
				</h4>
				<p className="text-xs text-gray-500 transition-all duration-200 dark:text-gray-400">
					{formatFullDate(meeting.date)}
				</p>
			</div>

			{/* Stats */}
			<div className="hidden items-center gap-4 sm:flex">
				<span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
					<Icon name="users" size="xs" />
					{meeting.participantCount} participants
				</span>
				<span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
					<Icon name="clock" size="xs" />
					{meeting.duration}
				</span>
			</div>

			{/* Status */}
			<Badge variant="success">Terminee</Badge>
		</div>
	);
}

// Main page

/**
 * Meetings page with upcoming and past meetings, creation and notes.
 * @returns The meetings management page
 */
export default function MeetingsPage() {
	const params = useParams();
	const _groupId = params.groupId as string;

	const [activeTab, setActiveTab] = useState<TabKey>("upcoming");

	// Sort upcoming meetings by date ascending
	const sortedUpcoming = [...UPCOMING_MEETINGS].sort((a, b) => a.date.getTime() - b.date.getTime());

	// Sort past meetings by date descending (most recent first)
	const sortedPast = [...PAST_MEETINGS].sort((a, b) => b.date.getTime() - a.date.getTime());

	return (
		<PageContainer
			title="Reunions"
			description="Planifiez et gerez les reunions de votre groupe"
			actions={
				<Button
					variant="primary"
					onClick={() => showInfo("Fonctionnalite a venir : planification de reunion.")}
				>
					<Icon name="plus" size="sm" />
					Planifier une reunion
				</Button>
			}
		>
			{/* Tabs */}
			<div className="mb-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 transition-all duration-200 dark:border-gray-700 dark:bg-gray-800">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						onClick={() => setActiveTab(tab.key)}
						className={cn(
							"flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
							activeTab === tab.key
								? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
								: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
						)}
					>
						<Icon name={tab.icon} size="sm" />
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab content — Upcoming meetings */}
			{activeTab === "upcoming" && (
				<div className="flex flex-col gap-4">
					{sortedUpcoming.length === 0 ? (
						<Card className="py-12 text-center">
							<Icon name="calendar" size="xl" className="mx-auto text-gray-300 dark:text-gray-600" />
							<p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Aucune reunion a venir.</p>
						</Card>
					) : (
						sortedUpcoming.map((meeting) => <UpcomingMeetingCard key={meeting.id} meeting={meeting} />)
					)}
				</div>
			)}

			{/* Tab content — History */}
			{activeTab === "history" && (
				<div className="flex flex-col gap-3">
					{sortedPast.length === 0 ? (
						<Card className="py-12 text-center">
							<Icon name="clock" size="xl" className="mx-auto text-gray-300 dark:text-gray-600" />
							<p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Aucune reunion passee.</p>
						</Card>
					) : (
						sortedPast.map((meeting) => <PastMeetingRow key={meeting.id} meeting={meeting} />)
					)}
				</div>
			)}
		</PageContainer>
	);
}
