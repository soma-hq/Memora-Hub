"use client";

// React
import { useState } from "react";
import { Tabs, Badge, Icon, Card, ProgressBar } from "@/components/ui";
import { CompetencyGrid } from "./competency-grid";
import { cn } from "@/lib/utils/cn";
import type { Junior, CompetencyLevel } from "../types";
import { pimStatusVariantMap, dispositifVariantMap, periodVariantMap, remarkTypeVariantMap } from "../types";


/** Props for the FSIPanel component */
interface FSIPanelProps {
	junior: Junior;
	onCompetencyChange?: (competencyId: string, level: CompetencyLevel) => void;
}

/** Tab definitions for the FSI panel sections */
const FSI_TABS = [
	{ id: "competences", label: "Competences", icon: "training" as const },
	{ id: "objectifs", label: "Objectifs", icon: "flag" as const },
	{ id: "bilans", label: "Bilans", icon: "document" as const },
	{ id: "notes", label: "Notes", icon: "file" as const },
	{ id: "remarques", label: "Remarques", icon: "chat" as const },
];

/**
 * Full FSI panel showing a junior profile with competency, objective, bilan, note, and remark tabs
 * @param props - Component props
 * @param props.junior - Junior data including FSI
 * @param props.onCompetencyChange - Optional callback for competency level changes
 * @returns Tabbed FSI view with junior header and progress
 */
export function FSIPanel({ junior, onCompetencyChange }: FSIPanelProps) {
	// State
	const [activeTab, setActiveTab] = useState("competences");
	const { fsi } = junior;

	// Computed
	const totalCompetencies = fsi.competencies.length;
	const acquiredCompetencies = fsi.competencies.filter((c) => c.level === "Acquise").length;

	/**
	 * Formats a date string to French locale
	 * @param dateStr - ISO date string
	 * @returns Formatted date string
	 */
	const formatDate = (dateStr: string) =>
		new Date(dateStr).toLocaleDateString("fr-FR", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});

	const tabsWithCounts = FSI_TABS.map((tab) => {
		const countMap: Record<string, number> = {
			competences: fsi.competencies.length,
			objectifs: fsi.objectives.length,
			bilans: fsi.bilans.length,
			notes: fsi.notes.length,
			remarques: fsi.remarks.length,
		};
		return { ...tab, count: countMap[tab.id] };
	});

	// Render
	return (
		<div className="space-y-6">
			{/* Junior info header */}
			<div className="space-y-4">
				<div className="flex items-start gap-4">
					{/* Avatar initial */}
					<div
						className={cn(
							"flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold",
							"bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
						)}
					>
						{junior.name.charAt(0).toUpperCase()}
					</div>

					<div className="min-w-0 flex-1">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white">{junior.name}</h2>
						<p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Referent : {junior.referent}</p>

						{/* Status badges */}
						<div className="mt-2 flex flex-wrap items-center gap-2">
							<Badge variant={dispositifVariantMap[junior.dispositif]} showDot={false}>
								{junior.dispositif}
							</Badge>
							<Badge variant={pimStatusVariantMap[junior.pimStatus]}>{junior.pimStatus}</Badge>
							<Badge variant={periodVariantMap[junior.currentPeriod]} showDot={false}>
								{junior.currentPeriod}
							</Badge>
						</div>
					</div>
				</div>

				{/* Meta row */}
				<div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
					<div className="flex items-center gap-1.5">
						<Icon name="briefcase" size="sm" className="text-gray-400" />
						<span>{junior.function}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Icon name="calendar" size="sm" className="text-gray-400" />
						<span>Debut : {formatDate(junior.startDate)}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Icon name="clock" size="sm" className="text-gray-400" />
						<span>MAJ : {formatDate(fsi.lastUpdated)}</span>
					</div>
				</div>

				{/* Overall competency progress */}
				<ProgressBar
					value={acquiredCompetencies}
					max={totalCompetencies}
					label={`${acquiredCompetencies}/${totalCompetencies} competences acquises`}
					showValue
					size="sm"
					variant={acquiredCompetencies === totalCompetencies ? "success" : "primary"}
				/>
			</div>

			<Tabs tabs={tabsWithCounts} activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Tab content */}
			<div className="mt-2">
				{activeTab === "competences" && (
					<CompetencyGrid
						competencies={fsi.competencies}
						onLevelChange={onCompetencyChange}
						readOnly={!onCompetencyChange}
					/>
				)}

				{activeTab === "objectifs" && <ObjectifsTab objectives={fsi.objectives} formatDate={formatDate} />}

				{activeTab === "bilans" && <BilansTab bilans={fsi.bilans} formatDate={formatDate} />}

				{activeTab === "notes" && <NotesTab notes={fsi.notes} formatDate={formatDate} />}

				{activeTab === "remarques" && <RemarquesTab remarks={fsi.remarks} formatDate={formatDate} />}
			</div>
		</div>
	);
}

/** Props for the ObjectifsTab sub-component */
interface ObjectifsTabProps {
	objectives: Junior["fsi"]["objectives"];
	formatDate: (d: string) => string;
}

/**
 * Displays a list of period objectives with completion status
 * @param props - Component props
 * @param props.objectives - Objective entries to display
 * @param props.formatDate - Date formatting function
 * @returns Objective list with completion indicators
 */
function ObjectifsTab({ objectives, formatDate }: ObjectifsTabProps) {
	if (objectives.length === 0) {
		return (
			<p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
				Aucun objectif defini pour le moment.
			</p>
		);
	}

	// Render
	return (
		<div className="grid gap-3">
			{objectives.map((obj) => (
				<div
					key={obj.id}
					className={cn(
						"flex items-start gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700",
						"bg-white dark:bg-gray-800/50",
					)}
				>
					{/* Completion circle */}
					<div
						className={cn(
							"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
							obj.completed
								? "border-success-500 bg-success-500 text-white"
								: "border-gray-300 dark:border-gray-600",
						)}
					>
						{obj.completed && (
							<svg
								className="h-3 w-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={3}
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						)}
					</div>

					<div className="min-w-0 flex-1">
						<p
							className={cn(
								"text-sm font-medium",
								obj.completed
									? "text-gray-500 line-through dark:text-gray-400"
									: "text-gray-900 dark:text-white",
							)}
						>
							{obj.title}
						</p>
						<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{obj.description}</p>
						<div className="mt-1.5 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
							<span>{obj.period}</span>
							<span>&middot;</span>
							<span>Debloque le {formatDate(obj.unlockedAt)}</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

/** Props for the BilansTab sub-component */
interface BilansTabProps {
	bilans: Junior["fsi"]["bilans"];
	formatDate: (d: string) => string;
}

/**
 * Displays bilan cards with period, decision badge, and summary
 * @param props - Component props
 * @param props.bilans - Bilan entries to display
 * @param props.formatDate - Date formatting function
 * @returns Bilan card list
 */
function BilansTab({ bilans, formatDate }: BilansTabProps) {
	if (bilans.length === 0) {
		return <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">Aucun bilan disponible.</p>;
	}

	/** Badge variant mapping for bilan decisions */
	const decisionVariantMap: Record<string, "success" | "error" | "primary" | "warning" | "neutral"> = {
		"Periode suivante accordee": "success",
		"Periode suivante refusee": "error",
		"PIM validee": "primary",
		"En attente": "warning",
		"Période suivante accordée": "success",
		"Période suivante refusée": "error",
		"PIM validée": "primary",
	};

	// Render
	return (
		<div className="grid gap-4">
			{bilans.map((bilan) => (
				<Card key={bilan.id} padding="md">
					<div className="flex items-start justify-between gap-3">
						<div>
							<h4 className="text-sm font-semibold text-gray-900 dark:text-white">
								Bilan {bilan.period}
							</h4>
							<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
								{formatDate(bilan.date)} &middot; {bilan.responsable}
							</p>
						</div>
						<Badge variant={decisionVariantMap[bilan.decision] ?? "neutral"}>{bilan.decision}</Badge>
					</div>

					<p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bilan.summary}</p>

					<div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
						<span>Referent : {bilan.referent}</span>
						<span>&middot;</span>
						<span>Junior : {bilan.junior}</span>
					</div>
				</Card>
			))}
		</div>
	);
}

/** Props for the NotesTab sub-component */
interface NotesTabProps {
	notes: Junior["fsi"]["notes"];
	formatDate: (d: string) => string;
}

/**
 * Displays note entries with author, role badge, and date
 * @param props - Component props
 * @param props.notes - Note entries to display
 * @param props.formatDate - Date formatting function
 * @returns Note list
 */
function NotesTab({ notes, formatDate }: NotesTabProps) {
	if (notes.length === 0) {
		return <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">Aucune note enregistree.</p>;
	}

	// Render
	return (
		<div className="grid gap-3">
			{notes.map((note) => (
				<div
					key={note.id}
					className={cn(
						"rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700",
						"bg-white dark:bg-gray-800/50",
					)}
				>
					<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
						<span className="font-medium text-gray-700 dark:text-gray-300">{note.author}</span>
						<Badge variant="neutral" showDot={false}>
							{note.authorRole}
						</Badge>
						<span className="ml-auto">{formatDate(note.createdAt)}</span>
					</div>
					<p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{note.content}</p>
				</div>
			))}
		</div>
	);
}

/** Props for the RemarquesTab sub-component */
interface RemarquesTabProps {
	remarks: Junior["fsi"]["remarks"];
	formatDate: (d: string) => string;
}

/**
 * Displays remarks with type-based coloring and notification indicators
 * @param props - Component props
 * @param props.remarks - Remark entries to display
 * @param props.formatDate - Date formatting function
 * @returns Remark list with colored borders
 */
function RemarquesTab({ remarks, formatDate }: RemarquesTabProps) {
	if (remarks.length === 0) {
		return (
			<p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">Aucune remarque enregistree.</p>
		);
	}

	// Render
	return (
		<div className="grid gap-3">
			{remarks.map((remark) => (
				<div
					key={remark.id}
					className={cn(
						"rounded-lg border px-4 py-3",
						remark.type === "positive"
							? "border-success-200 bg-success-50/50 dark:border-success-800/50 dark:bg-success-900/10"
							: "border-error-200 bg-error-50/50 dark:border-error-800/50 dark:bg-error-900/10",
					)}
				>
					<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
						<Badge variant={remarkTypeVariantMap[remark.type]} showDot={false}>
							{remark.type === "positive" ? "Positive" : "Negative"}
						</Badge>
						<span className="font-medium text-gray-700 dark:text-gray-300">{remark.author}</span>
						<span className="ml-auto">{formatDate(remark.createdAt)}</span>
					</div>
					<p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{remark.content}</p>

					{remark.juniorNotified && (
						<div className="mt-2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
							<Icon name="bell" size="xs" />
							<span>Junior notifie</span>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
