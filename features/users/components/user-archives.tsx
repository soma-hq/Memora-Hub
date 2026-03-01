"use client";

import { useState, useMemo } from "react";
import { Badge, Card, Icon } from "@/components/ui";
import {

	ProjectStatusLabel,
	TaskStatusLabel,
	TaskPriorityLabel,
	MeetingTypeLabel,
	AbsenceTypeLabel,
	AbsenceStatusLabel,
} from "@/constants";
import {

	projectStatusVariant,
	taskStatusVariant,
	taskPriorityVariant,
	meetingTypeVariant,
	absenceStatusVariant,
	absenceTypeVariant,
} from "@/core/design/states";
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";
import type { Meeting } from "@/features/meetings/types";
import type { Absence } from "@/features/absences/types";
import type { IconName } from "@/core/design/icons";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/date";
import { useUserRelations } from "@/hooks/use-data-store";


// ── Constants ─────────────────────────────────────────────────────────────────

type ArchiveTab = "projets" | "taches" | "reunions" | "absences";

interface TabConfig {
	id: ArchiveTab;
	label: string;
	icon: IconName;
}

const ARCHIVE_TABS: TabConfig[] = [
	{ id: "projets", label: "Projets", icon: "folder" },
	{ id: "taches", label: "Tâches", icon: "tasks" },
	{ id: "reunions", label: "Réunions", icon: "calendar" },
	{ id: "absences", label: "Absences", icon: "absence" },
];

const ITEMS_PER_PAGE = 8;

// ── Shared table styles ───────────────────────────────────────────────────────

const thClass = "pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500";
const tdClass = "py-3 pr-4 text-sm";
const rowBase =
	"border-b border-gray-50 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50";

// ── Props ─────────────────────────────────────────────────────────────────────

interface UserArchivesProps {
	userId: string;
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * User historical activity archives
 */

export function UserArchives({ userId }: UserArchivesProps) {
	const { projects, tasks, meetings, absences } = useUserRelations(userId);
	const [activeTab, setActiveTab] = useState<ArchiveTab>("projets");
	const [page, setPage] = useState(0);

	// Switch tab and reset pagination
	const handleTabChange = (tab: ArchiveTab) => {
		setActiveTab(tab);
		setPage(0);
	};

	// Combine active + archived for each entity type
	const allProjects = useMemo(() => [...projects.active, ...projects.archived], [projects]);
	const archivedProjectIds = useMemo(() => new Set(projects.archived.map((p) => p.id)), [projects.archived]);

	const allTasks = useMemo(() => [...tasks.active, ...tasks.archived], [tasks]);
	const archivedTaskIds = useMemo(() => new Set(tasks.archived.map((t) => t.id)), [tasks.archived]);

	const allMeetings = useMemo(() => [...meetings.upcoming, ...meetings.past], [meetings]);
	const pastMeetingIds = useMemo(() => new Set(meetings.past.map((m) => m.id)), [meetings.past]);

	// Determine if an absence is past (endDate before today)
	const isAbsencePast = (absence: Absence): boolean => {
		return new Date(absence.endDate) < new Date();
	};

	// Item count for current tab
	const getItemCount = (): number => {
		switch (activeTab) {
			case "projets":
				return allProjects.length;
			case "taches":
				return allTasks.length;
			case "reunions":
				return allMeetings.length;
			case "absences":
				return absences.length;
		}
	};

	const totalItems = getItemCount();
	const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
	const startIdx = page * ITEMS_PER_PAGE;
	const endIdx = startIdx + ITEMS_PER_PAGE;

	return (
		<Card padding="lg">
			{/* Header */}
			<div className="mb-5 flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
					<Icon name="logs" size="md" className="text-primary-500" />
				</div>
				<div>
					<h3 className="font-semibold text-gray-900 dark:text-white">Archives & Historique</h3>
					<p className="text-sm text-gray-400">Activité complète à travers tous les modules</p>
				</div>
			</div>

			{/* Filter tabs */}
			<div className="mb-4 border-b border-gray-200 dark:border-gray-700">
				<nav className="-mb-px flex gap-0 overflow-x-auto">
					{ARCHIVE_TABS.map((tab) => (
						<button
							key={tab.id}
							onClick={() => handleTabChange(tab.id)}
							className={cn(
								"flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200",
								activeTab === tab.id
									? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/10 dark:text-primary-400"
									: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
							)}
						>
							<Icon
								name={tab.icon}
								size="xs"
								className={cn(
									activeTab === tab.id ? "text-primary-500" : "text-gray-400 dark:text-gray-500",
								)}
							/>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			{/* Table content */}
			{totalItems === 0 ? (
				<EmptyState tab={activeTab} />
			) : (
				<>
					<div className="overflow-x-auto">
						{activeTab === "projets" && (
							<ProjetsTable
								items={allProjects.slice(startIdx, endIdx)}
								archivedIds={archivedProjectIds}
								userId={userId}
							/>
						)}
						{activeTab === "taches" && (
							<TachesTable items={allTasks.slice(startIdx, endIdx)} archivedIds={archivedTaskIds} />
						)}
						{activeTab === "reunions" && (
							<ReunionsTable items={allMeetings.slice(startIdx, endIdx)} pastIds={pastMeetingIds} />
						)}
						{activeTab === "absences" && (
							<AbsencesTable items={absences.slice(startIdx, endIdx)} isArchived={isAbsencePast} />
						)}
					</div>

					{/* Pagination */}
					{totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
				</>
			)}
		</Card>
	);
}

// ── Archived badge ────────────────────────────────────────────────────────────

function ArchivedBadge() {
	return (
		<span className="ml-1.5 inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
			Archivé
		</span>
	);
}

// ── Empty state ───────────────────────────────────────────────────────────────

const EMPTY_LABELS: Record<ArchiveTab, string> = {
	projets: "Aucun projet trouvé pour cet utilisateur",
	taches: "Aucune tâche trouvée pour cet utilisateur",
	reunions: "Aucune réunion trouvée pour cet utilisateur",
	absences: "Aucune absence trouvée pour cet utilisateur",
};

const EMPTY_ICONS: Record<ArchiveTab, IconName> = {
	projets: "folder",
	taches: "tasks",
	reunions: "calendar",
	absences: "absence",
};

function EmptyState({ tab }: { tab: ArchiveTab }) {
	return (
		<div className="flex flex-col items-center justify-center py-12">
			<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
				<Icon name={EMPTY_ICONS[tab]} size="lg" className="text-gray-300 dark:text-gray-600" />
			</div>
			<p className="text-sm text-gray-500 dark:text-gray-400">{EMPTY_LABELS[tab]}</p>
		</div>
	);
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange: (p: number) => void;
}) {
	return (
		<div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700/50">
			<button
				onClick={() => onPageChange(Math.max(0, page - 1))}
				disabled={page === 0}
				className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
			>
				<Icon name="chevronLeft" size="sm" />
			</button>
			<span className="text-xs text-gray-500 dark:text-gray-400">
				{page + 1} / {totalPages}
			</span>
			<button
				onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
				disabled={page === totalPages - 1}
				className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
			>
				<Icon name="chevronRight" size="sm" />
			</button>
		</div>
	);
}

// ── Projets table ─────────────────────────────────────────────────────────────

/**
 * Projects sub-table
 */

function ProjetsTable({ items, archivedIds, userId }: { items: Project[]; archivedIds: Set<string>; userId: string }) {
	// Resolve the user's role within a project
	const getUserRole = (project: Project): string => {
		if (project.responsible.userId === userId) return project.responsible.role;
		const assistant = project.assistants.find((a) => a.userId === userId);
		if (assistant) return assistant.role;
		const member = project.members.find((m) => m.userId === userId);
		return member?.role || "Membre";
	};

	return (
		<table className="w-full text-left">
			<thead>
				<tr className="border-b border-gray-200 dark:border-gray-700">
					<th className={thClass}>Nom</th>
					<th className={thClass}>Statut</th>
					<th className={cn(thClass, "hidden sm:table-cell")}>Rôle</th>
					<th className={cn(thClass, "hidden md:table-cell")}>Date de fin</th>
				</tr>
			</thead>
			<tbody>
				{items.map((project) => {
					const isArchived = archivedIds.has(project.id);
					return (
						<tr key={project.id} className={cn(rowBase, isArchived && "opacity-60")}>
							<td className={tdClass}>
								<div className="flex items-center gap-2">
									<span>{project.emoji}</span>
									<span className="font-medium text-gray-900 dark:text-white">{project.name}</span>
									{isArchived && <ArchivedBadge />}
								</div>
							</td>
							<td className={tdClass}>
								<Badge variant={projectStatusVariant[project.status]} showDot>
									{ProjectStatusLabel[project.status]}
								</Badge>
							</td>
							<td className={cn(tdClass, "hidden text-gray-700 sm:table-cell dark:text-gray-300")}>
								{getUserRole(project)}
							</td>
							<td className={cn(tdClass, "hidden text-gray-500 md:table-cell dark:text-gray-400")}>
								{formatDate(project.endDate, "d MMM yyyy")}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

// ── Taches table ──────────────────────────────────────────────────────────────

/**
 * Tasks sub-table
 */

function TachesTable({ items, archivedIds }: { items: Task[]; archivedIds: Set<string> }) {
	return (
		<table className="w-full text-left">
			<thead>
				<tr className="border-b border-gray-200 dark:border-gray-700">
					<th className={thClass}>Titre</th>
					<th className={thClass}>Statut</th>
					<th className={cn(thClass, "hidden sm:table-cell")}>Priorité</th>
					<th className={cn(thClass, "hidden md:table-cell")}>Échéance</th>
				</tr>
			</thead>
			<tbody>
				{items.map((task) => {
					const isArchived = archivedIds.has(task.id);
					return (
						<tr key={task.id} className={cn(rowBase, isArchived && "opacity-60")}>
							<td className={tdClass}>
								<div className="flex items-center gap-2">
									<span className="font-medium text-gray-900 dark:text-white">{task.title}</span>
									{isArchived && <ArchivedBadge />}
								</div>
							</td>
							<td className={tdClass}>
								<Badge variant={taskStatusVariant[task.status]} showDot>
									{TaskStatusLabel[task.status]}
								</Badge>
							</td>
							<td className={cn(tdClass, "hidden sm:table-cell")}>
								<Badge variant={taskPriorityVariant[task.priority]} showDot={false}>
									{TaskPriorityLabel[task.priority]}
								</Badge>
							</td>
							<td className={cn(tdClass, "hidden text-gray-500 md:table-cell dark:text-gray-400")}>
								{task.dueDate ? formatDate(task.dueDate, "d MMM yyyy") : "—"}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

// ── Reunions table ────────────────────────────────────────────────────────────

/**
 * Meetings sub-table
 */

function ReunionsTable({ items, pastIds }: { items: Meeting[]; pastIds: Set<string> }) {
	return (
		<table className="w-full text-left">
			<thead>
				<tr className="border-b border-gray-200 dark:border-gray-700">
					<th className={thClass}>Titre</th>
					<th className={thClass}>Type</th>
					<th className={cn(thClass, "hidden sm:table-cell")}>Date</th>
					<th className={cn(thClass, "hidden md:table-cell")}>Participants</th>
				</tr>
			</thead>
			<tbody>
				{items.map((meeting) => {
					const isPast = pastIds.has(meeting.id);
					return (
						<tr key={meeting.id} className={cn(rowBase, isPast && "opacity-60")}>
							<td className={tdClass}>
								<div className="flex items-center gap-2">
									<span className="font-medium text-gray-900 dark:text-white">{meeting.title}</span>
									{isPast && <ArchivedBadge />}
								</div>
							</td>
							<td className={tdClass}>
								<Badge variant={meetingTypeVariant[meeting.type]} showDot>
									{MeetingTypeLabel[meeting.type]}
								</Badge>
							</td>
							<td className={cn(tdClass, "hidden text-gray-500 sm:table-cell dark:text-gray-400")}>
								{formatDate(meeting.date, "d MMM yyyy")}
							</td>
							<td className={cn(tdClass, "hidden md:table-cell")}>
								<span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
									<Icon name="users" size="xs" className="text-gray-400" />
									{meeting.participants.length}
								</span>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

// ── Absences table ────────────────────────────────────────────────────────────

/**
 * Absences sub-table
 */

function AbsencesTable({ items, isArchived }: { items: Absence[]; isArchived: (a: Absence) => boolean }) {
	return (
		<table className="w-full text-left">
			<thead>
				<tr className="border-b border-gray-200 dark:border-gray-700">
					<th className={thClass}>Type</th>
					<th className={thClass}>Début</th>
					<th className={cn(thClass, "hidden sm:table-cell")}>Fin</th>
					<th className={cn(thClass, "hidden md:table-cell")}>Statut</th>
				</tr>
			</thead>
			<tbody>
				{items.map((absence) => {
					const past = isArchived(absence);
					return (
						<tr key={absence.id} className={cn(rowBase, past && "opacity-60")}>
							<td className={tdClass}>
								<div className="flex items-center gap-2">
									<Badge variant={absenceTypeVariant[absence.type]} showDot>
										{AbsenceTypeLabel[absence.type]}
									</Badge>
									{past && <ArchivedBadge />}
								</div>
							</td>
							<td className={cn(tdClass, "text-gray-700 dark:text-gray-300")}>
								{formatDate(absence.startDate, "d MMM yyyy")}
							</td>
							<td className={cn(tdClass, "hidden text-gray-500 sm:table-cell dark:text-gray-400")}>
								{formatDate(absence.endDate, "d MMM yyyy")}
							</td>
							<td className={cn(tdClass, "hidden md:table-cell")}>
								<Badge variant={absenceStatusVariant[absence.status]} showDot>
									{AbsenceStatusLabel[absence.status]}
								</Badge>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
