"use client";

// React
import { useState, useMemo, useCallback } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { DEMO_LOGS } from "@/features/logs/data/demo-logs";
import type { LogLevel, LogSource, LogEntry } from "@/features/logs/types";
import type { IconName } from "@/core/design/icons";


// Number of log entries displayed per page
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

// Available source filter options
const SOURCES: LogSource[] = ["system", "moderation", "project", "user", "security", "notification"];

// Available level filter options
const LEVELS: LogLevel[] = ["info", "warning", "error", "success"];

/**
 * Format a date string into a human-readable French day label
 * @param dateStr ISO date string
 * @returns Formatted day label (Aujourd'hui, Hier, or full date)
 */

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

/**
 * Extract the date key from a timestamp for grouping purposes
 * @param timestamp ISO date string
 * @returns Date-only string (YYYY-MM-DD)
 */

function getDateKey(timestamp: string): string {
	return timestamp.split("T")[0];
}

/**
 * Format a timestamp to a short time string
 * @param timestamp ISO date string
 * @returns Time string (HH:MM)
 */

function formatTime(timestamp: string): string {
	return new Date(timestamp).toLocaleTimeString("fr-FR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * Group log entries by their date, preserving chronological order
 * @param logs Array of log entries to group
 * @returns Array of date groups, each with a label and its logs
 */

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

/**
 * Full logs page with filtering, pagination, date grouping, and summary stats.
 * Displays logs in a toast-adapted card format with colored left borders.
 * @returns {JSX.Element} Logs page
 */

export default function LogsPage() {
	// State
	const [search, setSearch] = useState("");
	const [activeLevels, setActiveLevels] = useState<LogLevel[]>([]);
	const [activeSources, setActiveSources] = useState<LogSource[]>([]);
	const [expandedLog, setExpandedLog] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	// Handlers

	/**
	 * Toggle a log level filter on or off, resetting to page 1
	 * @param {LogLevel} level Level to toggle
	 * @returns {void}
	 */

	const toggleLevel = useCallback((level: LogLevel) => {
		setActiveLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
		setCurrentPage(1);
	}, []);

	/**
	 * Toggle a log source filter on or off, resetting to page 1
	 * @param {LogSource} source Source to toggle
	 * @returns {void}
	 */

	const toggleSource = useCallback((source: LogSource) => {
		setActiveSources((prev) => (prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]));
		setCurrentPage(1);
	}, []);

	/**
	 * Clear all active filters and reset to page 1
	 * @returns {void}
	 */

	const clearFilters = useCallback(() => {
		setSearch("");
		setActiveLevels([]);
		setActiveSources([]);
		setCurrentPage(1);
	}, []);

	/**
	 * Navigate to a specific page
	 * @param {number} page Target page number
	 * @returns {void}
	 */

	const goToPage = useCallback((page: number) => {
		setCurrentPage(page);
		setExpandedLog(null);
	}, []);

	// Computed

	/** Filtered logs based on active level, source, and search filters */
	const filteredLogs = useMemo(() => {
		return DEMO_LOGS.filter((log) => {
			if (activeLevels.length > 0 && !activeLevels.includes(log.level)) return false;
			if (activeSources.length > 0 && !activeSources.includes(log.source)) return false;
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
	}, [search, activeLevels, activeSources]);

	/** Count of logs per level for the summary cards */
	const levelCounts = useMemo(() => {
		const counts: Record<LogLevel, number> = { info: 0, warning: 0, error: 0, success: 0 };
		for (const log of filteredLogs) {
			counts[log.level]++;
		}
		return counts;
	}, [filteredLogs]);

	/** Total number of pages */
	const totalPages = Math.max(1, Math.ceil(filteredLogs.length / LOGS_PER_PAGE));

	/** Logs for the current page only */
	const paginatedLogs = useMemo(() => {
		const start = (currentPage - 1) * LOGS_PER_PAGE;
		return filteredLogs.slice(start, start + LOGS_PER_PAGE);
	}, [filteredLogs, currentPage]);

	/** Paginated logs grouped by date */
	const dateGroups = useMemo(() => groupLogsByDate(paginatedLogs), [paginatedLogs]);

	/** Page numbers to display in the pagination bar */
	const pageNumbers = useMemo(() => {
		const pages: number[] = [];
		const maxVisible = 5;
		let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
		const end = Math.min(totalPages, start + maxVisible - 1);
		start = Math.max(1, end - maxVisible + 1);
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		return pages;
	}, [currentPage, totalPages]);

	const hasFilters = activeLevels.length > 0 || activeSources.length > 0 || search.length > 0;

	// Render
	return (
		<div className="mx-auto max-w-5xl px-4 py-8">
			{/* Page header */}
			<div className="mb-8 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="bg-primary-100 dark:bg-primary-900/30 flex h-11 w-11 items-center justify-center rounded-2xl">
						<Icon name="logs" size="md" className="text-primary-600 dark:text-primary-400" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Logs</h1>
						<p className="text-sm text-gray-400 dark:text-gray-400">
							Historique complet de toutes les activites
						</p>
					</div>
				</div>

				{/* Export button placeholder */}
				<button
					type="button"
					className={cn(
						"flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700",
						"transition-all duration-200",
						"hover:border-gray-400 hover:bg-gray-50",
						"dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700",
					)}
				>
					<Icon name="download" size="sm" />
					Exporter
				</button>
			</div>

			{/* Summary stats */}
			<div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
				{LEVELS.map((level) => {
					const config = LEVEL_CONFIG[level];
					const count = levelCounts[level];
					return (
						<button
							key={level}
							type="button"
							onClick={() => toggleLevel(level)}
							className={cn(
								"group relative flex items-center gap-3 overflow-hidden rounded-xl border p-4 transition-all duration-200",
								activeLevels.includes(level)
									? cn(config.statBg, "border-current/20 ring-1 ring-current/10", config.statText)
									: "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
							)}
						>
							{/* Ghost icon */}
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
										!activeLevels.includes(level) && "text-gray-900 dark:text-white",
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
			<div className="mb-6 space-y-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
				{/* Search */}
				<div className="relative">
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
							"w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm text-gray-700",
							"transition-all duration-200 outline-none placeholder:text-gray-400",
							"focus:border-primary-300 focus:ring-primary-100 focus:ring-2",
							"dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500",
							"dark:focus:border-primary-600 dark:focus:ring-primary-900/30",
						)}
					/>
				</div>

				{/* Level filters */}
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
						Niveau
					</span>
					{LEVELS.map((level) => {
						const config = LEVEL_CONFIG[level];
						const isActive = activeLevels.includes(level);
						return (
							<button
								key={level}
								type="button"
								onClick={() => toggleLevel(level)}
								className={cn(
									"flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
									isActive
										? cn(config.bg, config.color, "ring-1 ring-current/20")
										: "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600",
								)}
							>
								<Icon name={config.icon} size="xs" />
								{config.label}
							</button>
						);
					})}
				</div>

				{/* Source filters */}
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
						Source
					</span>
					{SOURCES.map((source) => {
						const config = SOURCE_CONFIG[source];
						const isActive = activeSources.includes(source);
						return (
							<button
								key={source}
								type="button"
								onClick={() => toggleSource(source)}
								className={cn(
									"flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
									isActive
										? "bg-primary-100 text-primary-700 ring-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:ring-primary-800 ring-1"
										: "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600",
								)}
							>
								<Icon name={config.icon} size="xs" />
								{config.label}
							</button>
						);
					})}
				</div>

				{/* Active filter summary */}
				{hasFilters && (
					<div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
						<span className="text-xs text-gray-500 dark:text-gray-400">
							{filteredLogs.length} resultat{filteredLogs.length !== 1 ? "s" : ""}
						</span>
						<button
							type="button"
							onClick={clearFilters}
							className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs font-medium transition-all duration-200"
						>
							Effacer les filtres
						</button>
					</div>
				)}
			</div>

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
													{/* Expand indicator */}
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
				<div className="mt-8 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
					{/* Page info */}
					<p className="text-xs text-gray-400 dark:text-gray-500">
						Page {currentPage} sur {totalPages}
						<span className="ml-2 text-gray-300 dark:text-gray-600">|</span>
						<span className="ml-2">
							{filteredLogs.length} log{filteredLogs.length !== 1 ? "s" : ""} au total
						</span>
					</p>

					{/* Page controls */}
					<div className="flex items-center gap-1">
						{/* Previous */}
						<button
							type="button"
							onClick={() => goToPage(currentPage - 1)}
							disabled={currentPage === 1}
							className={cn(
								"flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
								currentPage === 1
									? "cursor-not-allowed text-gray-300 dark:text-gray-600"
									: "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200",
							)}
						>
							<Icon name="chevronLeft" size="sm" />
						</button>

						{/* Page numbers */}
						{pageNumbers[0] > 1 && (
							<>
								<button
									type="button"
									onClick={() => goToPage(1)}
									className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
								>
									1
								</button>
								{pageNumbers[0] > 2 && (
									<span className="flex h-8 w-8 items-center justify-center text-xs text-gray-400 dark:text-gray-500">
										...
									</span>
								)}
							</>
						)}

						{pageNumbers.map((page) => (
							<button
								key={page}
								type="button"
								onClick={() => goToPage(page)}
								className={cn(
									"flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all duration-200",
									page === currentPage
										? "bg-primary-500 text-white shadow-sm"
										: "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200",
								)}
							>
								{page}
							</button>
						))}

						{pageNumbers[pageNumbers.length - 1] < totalPages && (
							<>
								{pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
									<span className="flex h-8 w-8 items-center justify-center text-xs text-gray-400 dark:text-gray-500">
										...
									</span>
								)}
								<button
									type="button"
									onClick={() => goToPage(totalPages)}
									className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
								>
									{totalPages}
								</button>
							</>
						)}

						{/* Next */}
						<button
							type="button"
							onClick={() => goToPage(currentPage + 1)}
							disabled={currentPage === totalPages}
							className={cn(
								"flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
								currentPage === totalPages
									? "cursor-not-allowed text-gray-300 dark:text-gray-600"
									: "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200",
							)}
						>
							<Icon name="chevronRight" size="sm" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
