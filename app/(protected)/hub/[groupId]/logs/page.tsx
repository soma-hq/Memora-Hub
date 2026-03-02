"use client";

import { useState, useMemo, useCallback } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Icon, Button, SelectMenu, Pagination } from "@/components/ui";
import type { SelectMenuOption } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { DEMO_LOGS } from "@/features/logs/data/demo-logs";
import type { LogLevel, LogSource, LogEntry } from "@/features/logs/types";
import type { IconName } from "@/core/design/icons";
import { definePageConfig } from "@/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/logs",
	section: "protected",
	module: "logs",
	description: "Journal d'activité et logs du groupe.",
	requiredPermissions: [{ module: "logs", action: "view" }],
	entityScoped: true,
});

// Number of log
const LOGS_PER_PAGE = 10;

// Display config for each log level
const LEVEL_CONFIG: Record<
	LogLevel,
	{ label: string; color: string; bg: string; border: string; icon: IconName; statBg: string; statText: string }
> = {
	info: {
		label: "Info",
		color: "text-info-600 dark:text-info-400",
		bg: "bg-info-100 dark:bg-info-900/30",
		border: "border-l-info-500",
		icon: "info",
		statBg: "bg-info-50 dark:bg-info-900/20",
		statText: "text-info-700 dark:text-info-300",
	},
	warning: {
		label: "Alerte",
		color: "text-warning-600 dark:text-warning-400",
		bg: "bg-warning-100 dark:bg-warning-900/30",
		border: "border-l-warning-500",
		icon: "warning",
		statBg: "bg-warning-50 dark:bg-warning-900/20",
		statText: "text-warning-700 dark:text-warning-300",
	},
	error: {
		label: "Erreur",
		color: "text-error-600 dark:text-error-400",
		bg: "bg-error-100 dark:bg-error-900/30",
		border: "border-l-error-500",
		icon: "error",
		statBg: "bg-error-50 dark:bg-error-900/20",
		statText: "text-error-700 dark:text-error-300",
	},
	success: {
		label: "Succes",
		color: "text-success-600 dark:text-success-400",
		bg: "bg-success-100 dark:bg-success-900/30",
		border: "border-l-success-500",
		icon: "success",
		statBg: "bg-success-50 dark:bg-success-900/20",
		statText: "text-success-700 dark:text-success-300",
	},
};

// Display config for each log source
const SOURCE_CONFIG: Record<LogSource, { label: string; icon: IconName }> = {
	system: { label: "Systeme", icon: "tools" },
	moderation: { label: "Moderation", icon: "shield" },
	project: { label: "Projet", icon: "folder" },
	user: { label: "Utilisateur", icon: "profile" },
	security: { label: "Securite", icon: "lock" },
	notification: { label: "Notification", icon: "bell" },
};

// Filter options for SelectMenu
const LEVEL_OPTIONS: SelectMenuOption[] = [
	{ label: "Tous les niveaux", value: "", icon: "filter" },
	{ label: "Info", value: "info", icon: "info" },
	{ label: "Alerte", value: "warning", icon: "warning" },
	{ label: "Erreur", value: "error", icon: "error" },
	{ label: "Succes", value: "success", icon: "success" },
];

const SOURCE_OPTIONS: SelectMenuOption[] = [
	{ label: "Toutes les sources", value: "", icon: "filter" },
	{ label: "Systeme", value: "system", icon: "tools" },
	{ label: "Moderation", value: "moderation", icon: "shield" },
	{ label: "Projet", value: "project", icon: "folder" },
	{ label: "Utilisateur", value: "user", icon: "profile" },
	{ label: "Securite", value: "security", icon: "lock" },
	{ label: "Notification", value: "notification", icon: "bell" },
];

// Format a date string
function formatDayLabel(dateStr: string): string {
	const date = new Date(dateStr);
	const today = new Date("2025-02-27T23:59:59Z");
	const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	const logDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const diffDays = Math.floor((todayDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "Aujourd'hui";
	if (diffDays === 1) return "Hier";

	return date.toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function getDateKey(timestamp: string): string {
	return timestamp.split("T")[0];
}

function formatTime(timestamp: string): string {
	return new Date(timestamp).toLocaleTimeString("fr-FR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

function groupLogsByDate(logs: LogEntry[]): { dateKey: string; label: string; logs: LogEntry[] }[] {
	const groups: Map<string, LogEntry[]> = new Map();

	for (const log of logs) {
		const key = getDateKey(log.timestamp);
		if (!groups.has(key)) {
			groups.set(key, []);
		}
		groups.get(key)!.push(log);
	}

	return Array.from(groups.entries()).map(([dateKey, dateLogs]) => ({
		dateKey,
		label: formatDayLabel(dateLogs[0].timestamp),
		logs: dateLogs,
	}));
}

// Full logs page with filtering
export default function LogsPage() {
	// State
	const [search, setSearch] = useState("");
	const [levelFilter, setLevelFilter] = useState("");
	const [sourceFilter, setSourceFilter] = useState("");
	const [expandedLog, setExpandedLog] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	// Computed
	const filteredLogs = useMemo(() => {
		return DEMO_LOGS.filter((log) => {
			if (levelFilter && log.level !== levelFilter) return false;
			if (sourceFilter && log.source !== sourceFilter) return false;
			if (search) {
				const q = search.toLowerCase();
				return (
					log.title.toLowerCase().includes(q) ||
					log.description.toLowerCase().includes(q) ||
					log.user?.toLowerCase().includes(q)
				);
			}
			return true;
		});
	}, [search, levelFilter, sourceFilter]);

	const levelCounts = useMemo(() => {
		const counts: Record<LogLevel, number> = { info: 0, warning: 0, error: 0, success: 0 };
		for (const log of filteredLogs) {
			counts[log.level]++;
		}
		return counts;
	}, [filteredLogs]);

	const totalPages = Math.max(1, Math.ceil(filteredLogs.length / LOGS_PER_PAGE));

	const paginatedLogs = useMemo(() => {
		const start = (currentPage - 1) * LOGS_PER_PAGE;
		return filteredLogs.slice(start, start + LOGS_PER_PAGE);
	}, [filteredLogs, currentPage]);

	const dateGroups = useMemo(() => groupLogsByDate(paginatedLogs), [paginatedLogs]);

	const hasFilters = levelFilter !== "" || sourceFilter !== "" || search.length > 0;

	const clearFilters = useCallback(() => {
		setSearch("");
		setLevelFilter("");
		setSourceFilter("");
		setCurrentPage(1);
	}, []);

	// Render
	return (
		<PageContainer
			title="Logs"
			description="Historique complet de toutes les activités"
			actions={
				<Button variant="outline-neutral" onClick={() => {}}>
					<Icon name="download" size="sm" />
					Exporter
				</Button>
			}
		>
			{/* Summary stats */}
			<div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
				{(["info", "warning", "error", "success"] as LogLevel[]).map((level) => {
					const config = LEVEL_CONFIG[level];
					const count = levelCounts[level];
					const isActive = levelFilter === level;
					return (
						<button
							key={level}
							type="button"
							onClick={() => {
								setLevelFilter(isActive ? "" : level);
								setCurrentPage(1);
							}}
							className={cn(
								"group relative flex items-center gap-3 overflow-hidden rounded-xl border p-4 transition-all duration-200",
								isActive
									? cn(config.statBg, "border-current/20 ring-1 ring-current/10", config.statText)
									: "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
							)}
						>
							<div className="absolute -right-2 -bottom-2 opacity-[0.06]">
								<Icon name={config.icon} size="xl" className="h-16 w-16" />
							</div>
							<div
								className={cn(
									"flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
									config.bg,
								)}
							>
								<Icon name={config.icon} size="sm" className={config.color} />
							</div>
							<div className="text-left">
								<p
									className={cn(
										"text-xl font-bold",
										config.statText,
										!isActive && "text-gray-900 dark:text-white",
									)}
								>
									{count}
								</p>
								<p className="text-xs text-gray-400 dark:text-gray-500">{config.label}</p>
							</div>
						</button>
					);
				})}
			</div>

			{/* Filter bar */}
			<div className="mb-6 flex flex-wrap items-center gap-3">
				{/* Search */}
				<div className="relative min-w-[240px] flex-1">
					<Icon name="search" size="sm" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher dans les logs..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setCurrentPage(1);
						}}
						className={cn(
							"w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-700",
							"transition-all duration-200 outline-none placeholder:text-gray-400",
							"focus:border-primary-300 focus:ring-primary-100 focus:ring-2",
							"dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500",
							"dark:focus:border-primary-600 dark:focus:ring-primary-900/30",
						)}
					/>
				</div>

				{/* Level filter */}
				<SelectMenu
					options={LEVEL_OPTIONS}
					value={levelFilter}
					onChange={(v) => {
						setLevelFilter(v as string);
						setCurrentPage(1);
					}}
					placeholder="Niveau"
					triggerIcon="filter"
					className="w-[180px]"
				/>

				{/* Source filter */}
				<SelectMenu
					options={SOURCE_OPTIONS}
					value={sourceFilter}
					onChange={(v) => {
						setSourceFilter(v as string);
						setCurrentPage(1);
					}}
					placeholder="Source"
					triggerIcon="folder"
					className="w-[200px]"
				/>

				{/* Clear filters */}
				{hasFilters && (
					<button
						type="button"
						onClick={clearFilters}
						className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs font-medium transition-all duration-200"
					>
						Effacer les filtres
					</button>
				)}
			</div>

			{/* Result count */}
			{hasFilters && (
				<p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
					{filteredLogs.length} resultat{filteredLogs.length !== 1 ? "s" : ""}
				</p>
			)}

			{/* Log entries */}
			{filteredLogs.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 dark:border-gray-700 dark:bg-gray-800">
					<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700">
						<Icon name="search" size="lg" className="text-gray-300 dark:text-gray-500" />
					</div>
					<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aucun log trouve</p>
					<p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Essayez de modifier vos filtres</p>
					{hasFilters && (
						<button
							type="button"
							onClick={clearFilters}
							className="bg-primary-500 hover:bg-primary-600 mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200"
						>
							Reinitialiser les filtres
						</button>
					)}
				</div>
			) : (
				<div className="space-y-6">
					{dateGroups.map((group) => (
						<div key={group.dateKey}>
							{/* Date header */}
							<div className="mb-3 flex items-center gap-3">
								<div className="flex items-center gap-2">
									<Icon name="calendar" size="sm" className="text-gray-400 dark:text-gray-500" />
									<h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
										{group.label}
									</h2>
								</div>
								<div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
								<span className="text-xs text-gray-400 dark:text-gray-500">
									{group.logs.length} log{group.logs.length !== 1 ? "s" : ""}
								</span>
							</div>

							{/* Log cards */}
							<div className="space-y-2">
								{group.logs.map((log) => {
									const levelConfig = LEVEL_CONFIG[log.level];
									const sourceConfig = SOURCE_CONFIG[log.source];
									const isExpanded = expandedLog === log.id;

									return (
										<button
											key={log.id}
											type="button"
											onClick={() => setExpandedLog(isExpanded ? null : log.id)}
											className={cn(
												"group w-full rounded-xl border border-l-4 p-4 text-left",
												"transition-all duration-200",
												levelConfig.border,
												"border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
												"hover:-translate-y-0.5 hover:shadow-md",
												"dark:hover:border-gray-600",
												isExpanded && "ring-primary-200 dark:ring-primary-800 shadow-md ring-1",
											)}
										>
											<div className="flex items-start gap-3">
												{/* Level icon */}
												<div
													className={cn(
														"mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
														levelConfig.bg,
													)}
												>
													<Icon
														name={levelConfig.icon}
														size="sm"
														className={levelConfig.color}
													/>
												</div>

												{/* Content */}
												<div className="min-w-0 flex-1">
													<div className="flex items-center gap-2">
														<h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
															{log.title}
														</h3>
														<span
															className={cn(
																"shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase",
																levelConfig.bg,
																levelConfig.color,
															)}
														>
															{levelConfig.label}
														</span>
													</div>
													<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
														{log.description}
													</p>

													{/* Expanded metadata */}
													<div
														className={cn(
															"grid transition-all duration-200",
															isExpanded && log.metadata
																? "mt-3 grid-rows-[1fr] opacity-100"
																: "grid-rows-[0fr] opacity-0",
														)}
													>
														<div className="overflow-hidden">
															{log.metadata && (
																<div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
																	{Object.entries(log.metadata).map(
																		([key, value]) => (
																			<span
																				key={key}
																				className="rounded-md bg-gray-100 px-2 py-1 text-[10px] text-gray-600 dark:bg-gray-700 dark:text-gray-300"
																			>
																				<span className="font-bold uppercase">
																					{key}:
																				</span>{" "}
																				{value}
																			</span>
																		),
																	)}
																</div>
															)}
															{!log.metadata && isExpanded && (
																<p className="border-t border-gray-100 pt-3 text-[10px] text-gray-400 italic dark:border-gray-700 dark:text-gray-500">
																	Aucune metadonnee disponible
																</p>
															)}
														</div>
													</div>
												</div>

												{/* Meta info */}
												<div className="flex shrink-0 flex-col items-end gap-1.5">
													<div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
														<Icon name={sourceConfig.icon} size="xs" />
														<span>{sourceConfig.label}</span>
													</div>
													<span className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
														{formatTime(log.timestamp)}
													</span>
													{log.user && (
														<span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
															{log.user}
														</span>
													)}
													<Icon
														name="chevronDown"
														size="xs"
														className={cn(
															"text-gray-300 transition-all duration-200 dark:text-gray-600",
															isExpanded &&
																"text-primary-500 dark:text-primary-400 rotate-180",
														)}
													/>
												</div>
											</div>
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Pagination */}
			{filteredLogs.length > LOGS_PER_PAGE && (
				<div className="mt-8">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={(page) => {
							setCurrentPage(page);
							setExpandedLog(null);
						}}
					/>
				</div>
			)}
		</PageContainer>
	);
}
