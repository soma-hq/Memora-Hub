"use client";

// React
import { useState, useMemo, useCallback } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Button, Tag, Tooltip, Modal, ModalFooter, Input, Toggle } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";
import {
	levelBorderVariant,
	levelBorderTopVariant,
	levelBgIconVariant,
	levelTextIconVariant,
	levelDotVariant,
} from "@/core/design";

// Types

type AlertType = "access_denied" | "update" | "access_granted";
type ViewMode = "list" | "timeline";

interface AlertMetadata {
	[key: string]: string;
}

interface Alert {
	id: string;
	type: AlertType;
	title: string;
	description: string;
	timestamp: string;
	metadata: AlertMetadata;
}

interface AlertState {
	read: boolean;
	dismissed: boolean;
	expanded: boolean;
}

// Alert type visual configuration
interface AlertTypeConfig {
	icon: IconName;
	label: string;
	summaryLabel: string;
	level: "error" | "info" | "success";
}

const alertTypeConfig: Record<AlertType, AlertTypeConfig> = {
	access_denied: {
		icon: "shield",
		label: "Acces refuse",
		summaryLabel: "Critiques",
		level: "error",
	},
	update: {
		icon: "news",
		label: "Mise a jour",
		summaryLabel: "Informations",
		level: "info",
	},
	access_granted: {
		icon: "check",
		label: "Acces accorde",
		summaryLabel: "Resolues",
		level: "success",
	},
};

// Alerts source (replaced demo data)
const demoAlerts: Alert[] = [];

// Shared styles

const selectClasses = cn(
	"rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
	"text-gray-700 shadow-sm transition-all duration-200",
	"focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500",
	"dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
);

// Utility functions

/**
 * Formats an ISO timestamp to a human-readable French locale date string.
 * @param isoString - ISO 8601 date string
 * @returns Formatted date and time string (e.g. "27 fev. 2025, 15:45")
 */
function formatTimestamp(isoString: string): string {
	const date = new Date(isoString);
	return date.toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * Computes relative time from now for a given ISO timestamp.
 * @param isoString - ISO 8601 date string
 * @returns Relative time string in French (e.g. "il y a 2h")
 */
function relativeTime(isoString: string): string {
	const now = new Date();
	const date = new Date(isoString);
	const diffMs = now.getTime() - date.getTime();
	const diffMinutes = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMinutes < 1) return "a l'instant";
	if (diffMinutes < 60) return `il y a ${diffMinutes} min`;
	if (diffHours < 24) return `il y a ${diffHours}h`;
	if (diffDays === 1) return "hier";
	return `il y a ${diffDays}j`;
}

/**
 * Extracts the date portion from an ISO timestamp for date range filtering.
 * @param isoString - ISO 8601 date string
 * @returns Date string in YYYY-MM-DD format
 */
function extractDate(isoString: string): string {
	return isoString.split("T")[0];
}

// Component

/**
 * Admin alerts management page with filtering, dismissal, and timeline views.
 * Displays system alerts categorized by type (access_denied, update, access_granted)
 * with summary cards, search/filter controls, and expandable alert details.
 * @returns The admin alerts page
 */
export default function AdminAlertsPage() {
	// State

	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<AlertType | "all">("all");
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const [alertStates, setAlertStates] = useState<Record<string, AlertState>>(() => {
		const initial: Record<string, AlertState> = {};
		for (const alert of demoAlerts) {
			initial[alert.id] = {
				read: false,
				dismissed: false,
				expanded: false,
			};
		}
		return initial;
	});
	const [detailModal, setDetailModal] = useState<Alert | null>(null);

	// Derived counts

	/** Counts alerts per type, excluding dismissed ones. */
	const alertCounts = useMemo(() => {
		const active = demoAlerts.filter((a) => !alertStates[a.id]?.dismissed);
		return {
			total: active.length,
			access_denied: active.filter((a) => a.type === "access_denied").length,
			update: active.filter((a) => a.type === "update").length,
			access_granted: active.filter((a) => a.type === "access_granted").length,
		};
	}, [alertStates]);

	// Filtered alerts

	/** Applies search, type, date, and dismissal filters to the alert list. */
	const filteredAlerts = useMemo(() => {
		return demoAlerts.filter((alert) => {
			// Exclude dismissed alerts
			if (alertStates[alert.id]?.dismissed) return false;

			// Type filter
			if (typeFilter !== "all" && alert.type !== typeFilter) return false;

			// Search filter across title, description, and metadata values
			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase();
				const matchesTitle = alert.title.toLowerCase().includes(query);
				const matchesDesc = alert.description.toLowerCase().includes(query);
				const matchesMeta = Object.values(alert.metadata).some((v) => v.toLowerCase().includes(query));
				if (!matchesTitle && !matchesDesc && !matchesMeta) return false;
			}

			// Date range filter
			const alertDate = extractDate(alert.timestamp);
			if (dateFrom && alertDate < dateFrom) return false;
			if (dateTo && alertDate > dateTo) return false;

			return true;
		});
	}, [searchQuery, typeFilter, dateFrom, dateTo, alertStates]);

	// Callbacks

	/**
	 * Marks an alert as read in local state.
	 * @param alertId - ID of the alert to mark as read
	 */
	const handleMarkAsRead = useCallback((alertId: string) => {
		setAlertStates((prev) => ({
			...prev,
			[alertId]: { ...prev[alertId], read: true },
		}));
	}, []);

	/**
	 * Dismisses an alert so it no longer appears in the list.
	 * @param alertId - ID of the alert to dismiss
	 */
	const handleDismiss = useCallback((alertId: string) => {
		setAlertStates((prev) => ({
			...prev,
			[alertId]: { ...prev[alertId], dismissed: true },
		}));
	}, []);

	/**
	 * Toggles the expanded state of an alert card.
	 * @param alertId - ID of the alert to expand or collapse
	 */
	const handleToggleExpand = useCallback((alertId: string) => {
		setAlertStates((prev) => ({
			...prev,
			[alertId]: {
				...prev[alertId],
				expanded: !prev[alertId]?.expanded,
			},
		}));
	}, []);

	/** Resets all filters to their default values. */
	const handleClearFilters = useCallback(() => {
		setSearchQuery("");
		setTypeFilter("all");
		setDateFrom("");
		setDateTo("");
	}, []);

	/** Checks whether any filter is currently active. */
	const hasActiveFilters = searchQuery.trim() !== "" || typeFilter !== "all" || dateFrom !== "" || dateTo !== "";

	// Summary cards data
	const summaryCards: {
		label: string;
		count: number;
		icon: IconName;
		level: "neutral" | "error" | "info" | "success";
	}[] = [
		{
			label: "Total alertes",
			count: alertCounts.total,
			icon: "alert",
			level: "neutral",
		},
		{
			label: "Critiques",
			count: alertCounts.access_denied,
			icon: "shield",
			level: "error",
		},
		{
			label: "Informations",
			count: alertCounts.update,
			icon: "news",
			level: "info",
		},
		{
			label: "Resolues",
			count: alertCounts.access_granted,
			icon: "check",
			level: "success",
		},
	];

	// Render helpers

	/**
	 * Renders a single alert card in list view mode.
	 * @param alert - The alert data to render
	 * @returns Alert card JSX element
	 */
	const renderAlertCard = (alert: Alert) => {
		const config = alertTypeConfig[alert.type];
		const state = alertStates[alert.id];
		const isRead = state?.read;
		const isExpanded = state?.expanded;

		return (
			<div key={alert.id} className="group">
				<Card
					padding="md"
					className={cn(
						"relative overflow-hidden border-l-4 transition-all duration-200",
						levelBorderVariant[config.level],
						!isRead && "ring-1 ring-gray-200 dark:ring-gray-700",
						isRead && "opacity-75",
					)}
				>
					<div className="flex gap-4">
						{/* Large type icon */}
						<div
							className={cn(
								"flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
								levelBgIconVariant[config.level],
							)}
						>
							<Icon
								name={config.icon}
								style="solid"
								size="lg"
								className={levelTextIconVariant[config.level]}
							/>
						</div>

						{/* Main content */}
						<div className="min-w-0 flex-1">
							{/* Header row */}
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-center gap-2">
										<h3
											className={cn(
												"text-base font-semibold text-gray-900 dark:text-white",
												isRead && "text-gray-600 dark:text-gray-400",
											)}
										>
											{alert.title}
										</h3>
										<Badge variant={config.level} showDot>
											{config.label}
										</Badge>
										{isRead && <Tag color="gray">Lu</Tag>}
									</div>
									<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{alert.description}</p>
								</div>

								{/* Timestamp */}
								<Tooltip content={formatTimestamp(alert.timestamp)}>
									<span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
										<Icon name="clock" size="xs" />
										{relativeTime(alert.timestamp)}
									</span>
								</Tooltip>
							</div>

							{/* Metadata pills */}
							<div className="mt-3 flex flex-wrap gap-2">
								{Object.entries(alert.metadata).map(([key, value]) => (
									<span
										key={key}
										className={cn(
											"inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs",
											"bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
										)}
									>
										<span className="font-bold uppercase">{key}</span>
										<span className="text-gray-500 dark:text-gray-400">{value}</span>
									</span>
								))}
							</div>

							{/* Actions row */}
							<div className="mt-3 flex flex-wrap items-center gap-2">
								{!isRead && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleMarkAsRead(alert.id)}
										className="gap-1.5 text-gray-600 dark:text-gray-400"
									>
										<Icon name="check" size="sm" />
										Marquer comme lu
									</Button>
								)}
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleDismiss(alert.id)}
									className="hover:text-error-600 dark:hover:text-error-400 gap-1.5 text-gray-600 dark:text-gray-400"
								>
									<Icon name="close" size="sm" />
									Ignorer
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleToggleExpand(alert.id)}
									className="gap-1.5 text-gray-600 dark:text-gray-400"
								>
									<Icon name={isExpanded ? "chevronUp" : "chevronDown"} size="sm" />
									{isExpanded ? "Reduire" : "Details"}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setDetailModal(alert)}
									className="gap-1.5 text-gray-600 dark:text-gray-400"
								>
									<Icon name="chevronRight" size="sm" />
									Voir plus
								</Button>
							</div>

							{/* Expandable detail section */}
							{isExpanded && (
								<div
									className={cn(
										"mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4",
										"dark:border-gray-700 dark:bg-gray-800/50",
									)}
								>
									<p className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
										Informations detaillees
									</p>

									<div className="space-y-2">
										<div className="flex items-center gap-2 text-sm">
											<span className="font-medium text-gray-700 dark:text-gray-300">ID :</span>
											<code className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
												{alert.id}
											</code>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<span className="font-medium text-gray-700 dark:text-gray-300">Type :</span>
											<Tag color={config.level}>{config.label}</Tag>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<span className="font-medium text-gray-700 dark:text-gray-300">
												Date exacte :
											</span>
											<span className="text-gray-600 dark:text-gray-400">
												{formatTimestamp(alert.timestamp)}
											</span>
										</div>
										<div className="text-sm">
											<span className="font-medium text-gray-700 dark:text-gray-300">
												Metadonnees :
											</span>
											<div className="mt-1 space-y-1 pl-4">
												{Object.entries(alert.metadata).map(([key, value]) => (
													<div key={key} className="flex gap-2">
														<span className="font-semibold text-gray-600 uppercase dark:text-gray-400">
															{key}:
														</span>
														<span className="text-gray-500 dark:text-gray-500">
															{value}
														</span>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</Card>
			</div>
		);
	};

	/**
	 * Renders the timeline view showing alerts chronologically with a vertical line.
	 * @returns Timeline view JSX element
	 */
	const renderTimelineView = () => (
		<div className="relative">
			{/* Timeline vertical line */}
			<div className="absolute top-0 bottom-0 left-6 w-px bg-gray-200 dark:bg-gray-700" />

			<div className="space-y-6">
				{filteredAlerts.map((alert) => {
					const config = alertTypeConfig[alert.type];
					const state = alertStates[alert.id];
					const isRead = state?.read;

					return (
						<div key={alert.id} className="relative flex items-start gap-4 pl-14">
							{/* Timeline dot */}
							<span
								className={cn(
									"absolute top-2 left-[18px] h-4 w-4 rounded-full ring-4 ring-white transition-all duration-200 dark:ring-gray-900",
									levelDotVariant[config.level],
								)}
							/>

							{/* Content card */}
							<Card
								padding="md"
								className={cn(
									"flex-1 border-l-4 transition-all duration-200",
									levelBorderVariant[config.level],
									isRead && "opacity-75",
								)}
							>
								<div className="flex items-start justify-between gap-3">
									<div className="flex items-center gap-3">
										<div
											className={cn(
												"flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
												levelBgIconVariant[config.level],
											)}
										>
											<Icon
												name={config.icon}
												style="solid"
												size="md"
												className={levelTextIconVariant[config.level]}
											/>
										</div>
										<div>
											<div className="flex flex-wrap items-center gap-2">
												<h3
													className={cn(
														"text-sm font-semibold text-gray-900 dark:text-white",
														isRead && "text-gray-600 dark:text-gray-400",
													)}
												>
													{alert.title}
												</h3>
												<Badge variant={config.level} showDot>
													{config.label}
												</Badge>
											</div>
											<p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
												{alert.description}
											</p>
										</div>
									</div>
									<span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
										<Icon name="clock" size="xs" />
										{relativeTime(alert.timestamp)}
									</span>
								</div>

								{/* Metadata pills */}
								<div className="mt-3 flex flex-wrap gap-2 pl-12">
									{Object.entries(alert.metadata).map(([key, value]) => (
										<span
											key={key}
											className={cn(
												"inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs",
												"bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
											)}
										>
											<span className="font-bold uppercase">{key}</span>
											<span className="text-gray-500 dark:text-gray-400">{value}</span>
										</span>
									))}
								</div>

								{/* Actions */}
								<div className="mt-2 flex flex-wrap gap-2 pl-12">
									{!isRead && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleMarkAsRead(alert.id)}
											className="gap-1.5 text-gray-600 dark:text-gray-400"
										>
											<Icon name="check" size="sm" />
											Lu
										</Button>
									)}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleDismiss(alert.id)}
										className="hover:text-error-600 dark:hover:text-error-400 gap-1.5 text-gray-600 dark:text-gray-400"
									>
										<Icon name="close" size="sm" />
										Ignorer
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setDetailModal(alert)}
										className="gap-1.5 text-gray-600 dark:text-gray-400"
									>
										<Icon name="chevronRight" size="sm" />
										Voir plus
									</Button>
								</div>
							</Card>
						</div>
					);
				})}
			</div>
		</div>
	);

	// Render

	return (
		<PageContainer
			title="Alertes systeme"
			description="Surveillance et gestion des alertes de securite, mises a jour et acces"
		>
			{/* Summary cards */}
			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{summaryCards.map((card) => (
					<Card
						key={card.label}
						padding="lg"
						className={cn("border-t-4 transition-all duration-200", levelBorderTopVariant[card.level])}
					>
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
								<p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{card.count}</p>
							</div>
							<div
								className={cn(
									"flex h-12 w-12 items-center justify-center rounded-xl",
									levelBgIconVariant[card.level],
								)}
							>
								<Icon
									name={card.icon}
									style="solid"
									size="lg"
									className={levelTextIconVariant[card.level]}
								/>
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* Filter bar */}
			<div
				className={cn(
					"mb-6 flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4 shadow-sm",
					"border-red-200 dark:border-red-900/40 dark:bg-gray-800",
				)}
			>
				{/* Search input */}
				<div className="min-w-0 flex-1">
					<Input
						icon="search"
						placeholder="Rechercher une alerte..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="!py-2 !text-sm"
					/>
				</div>

				{/* Type filter */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-gray-500 dark:text-gray-400">Type</label>
					<select
						value={typeFilter}
						onChange={(e) => setTypeFilter(e.target.value as AlertType | "all")}
						className={cn(selectClasses, typeFilter !== "all" && "border-red-400 ring-1 ring-red-400")}
						aria-label="Filtrer par type"
					>
						<option value="all">Tous les types</option>
						<option value="access_denied">Acces refuse</option>
						<option value="update">Mise a jour</option>
						<option value="access_granted">Acces accorde</option>
					</select>
				</div>

				{/* Date from */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-gray-500 dark:text-gray-400">Du</label>
					<input
						type="date"
						value={dateFrom}
						onChange={(e) => setDateFrom(e.target.value)}
						className={cn(selectClasses, dateFrom && "border-red-400 ring-1 ring-red-400")}
					/>
				</div>

				{/* Date to */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-gray-500 dark:text-gray-400">Au</label>
					<input
						type="date"
						value={dateTo}
						onChange={(e) => setDateTo(e.target.value)}
						className={cn(selectClasses, dateTo && "border-red-400 ring-1 ring-red-400")}
					/>
				</div>

				{/* Reset filters */}
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleClearFilters}
						className="text-red-600 dark:text-red-400"
					>
						<Icon name="close" size="sm" />
						Reinitialiser
					</Button>
				)}

				{/* Results count */}
				<span className="ml-auto text-sm text-gray-400">
					{filteredAlerts.length} alerte
					{filteredAlerts.length !== 1 ? "s" : ""}
				</span>
			</div>

			{/* View toggle and section header */}
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
					Fil des alertes
					<Badge variant="neutral" showDot={false} className="ml-2">
						{filteredAlerts.length}
					</Badge>
				</h2>

				<div className="flex items-center gap-3">
					<Toggle
						checked={viewMode === "timeline"}
						onChange={(checked) => setViewMode(checked ? "timeline" : "list")}
						size="sm"
						label={viewMode === "timeline" ? "Chronologie" : "Liste"}
					/>
				</div>
			</div>

			{/* Alert list or timeline */}
			{filteredAlerts.length > 0 ? (
				viewMode === "list" ? (
					<div className="space-y-3">{filteredAlerts.map(renderAlertCard)}</div>
				) : (
					renderTimelineView()
				)
			) : (
				// Empty state
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-20 dark:border-gray-600">
					<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
						<Icon name="alert" size="xl" className="text-gray-300 dark:text-gray-600" />
					</div>
					<p className="text-base font-medium text-gray-500 dark:text-gray-400">
						Aucune alerte ne correspond aux filtres
					</p>
					<p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
						Modifiez vos criteres de recherche ou reinitialiser les filtres.
					</p>
					{hasActiveFilters && (
						<Button
							variant="outline-neutral"
							size="sm"
							onClick={handleClearFilters}
							className="mt-4 gap-1.5"
						>
							<Icon name="refresh" size="sm" />
							Reinitialiser les filtres
						</Button>
					)}
				</div>
			)}

			{/* Detail modal */}
			<Modal
				isOpen={!!detailModal}
				onClose={() => setDetailModal(null)}
				title={detailModal?.title}
				description={detailModal ? alertTypeConfig[detailModal.type].label : undefined}
				size="lg"
			>
				{detailModal && (
					<div className="space-y-5">
						{/* Type badge and timestamp */}
						<div className="flex flex-wrap items-center gap-3">
							<Badge variant={alertTypeConfig[detailModal.type].level} showDot>
								{alertTypeConfig[detailModal.type].label}
							</Badge>
							<span className="flex items-center gap-1 text-sm text-gray-500">
								<Icon name="clock" size="sm" />
								{formatTimestamp(detailModal.timestamp)}
							</span>
						</div>

						{/* Full description */}
						<div>
							<p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
								Description
							</p>
							<p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
								{detailModal.description}
							</p>
						</div>

						{/* Metadata table */}
						<div>
							<p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
								Metadonnees
							</p>
							<div
								className={cn(
									"divide-y divide-gray-200 rounded-lg border border-gray-200",
									"dark:divide-gray-700 dark:border-gray-700",
								)}
							>
								{Object.entries(detailModal.metadata).map(([key, value]) => (
									<div key={key} className="flex items-center justify-between px-4 py-2.5">
										<span className="text-sm font-bold text-gray-600 uppercase dark:text-gray-400">
											{key}
										</span>
										<span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
									</div>
								))}
							</div>
						</div>

						{/* Alert ID */}
						<div className="flex items-center gap-2 text-xs text-gray-400">
							<span>ID :</span>
							<code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-700">
								{detailModal.id}
							</code>
						</div>
					</div>
				)}

				<ModalFooter>
					{!alertStates[detailModal?.id ?? ""]?.read && (
						<Button
							variant="outline-primary"
							size="sm"
							onClick={() => {
								if (detailModal) handleMarkAsRead(detailModal.id);
							}}
							className="gap-1.5"
						>
							<Icon name="check" size="sm" />
							Marquer comme lu
						</Button>
					)}
					<Button
						variant="outline-danger"
						size="sm"
						onClick={() => {
							if (detailModal) {
								handleDismiss(detailModal.id);
								setDetailModal(null);
							}
						}}
						className="gap-1.5"
					>
						<Icon name="close" size="sm" />
						Ignorer
					</Button>
					<Button variant="cancel" size="sm" onClick={() => setDetailModal(null)}>
						Fermer
					</Button>
				</ModalFooter>
			</Modal>
		</PageContainer>
	);
}
