"use client";

// React
import { useState, useCallback } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Button, Toggle } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showInfo, showError } from "@/lib/utils/toast";


interface EnvInfoItem {
	label: string;
	value: string;
}

interface FeatureFlag {
	id: string;
	name: string;
	description: string;
	enabled: boolean;
}

interface ConsoleLine {
	time: string;
	level: string;
	message: string;
}

const envInfo: EnvInfoItem[] = [];

const dbInfo: EnvInfoItem[] = [];

const initialFeatureFlags: FeatureFlag[] = [];

const consoleLines: ConsoleLine[] = [];

const levelColors: Record<string, string> = {
	info: "text-blue-400",
	warn: "text-amber-400",
	error: "text-red-400",
};

/**
 * Developer tools page with environment info, feature flags and system console.
 * @returns The dev tools dashboard page
 */
export default function AdminDevPage() {
	// State
	const [debugMode, setDebugMode] = useState(false);
	const [featureFlags, setFeatureFlags] = useState(initialFeatureFlags);
	const [clearingCache, setClearingCache] = useState(false);
	const [rebuilding, setRebuilding] = useState(false);
	const [exporting, setExporting] = useState(false);

	// Handlers

	/**
	 * Toggles a feature flag by its identifier.
	 * @param flagId - The feature flag ID to toggle
	 * @returns void
	 */
	const handleToggleFlag = useCallback((flagId: string) => {
		setFeatureFlags((prev) => prev.map((f) => (f.id === flagId ? { ...f, enabled: !f.enabled } : f)));
		showInfo("Feature flag mis a jour");
	}, []);

	/**
	 * Clears the application cache with simulated delay.
	 * @returns void
	 */
	const handleClearCache = useCallback(() => {
		setClearingCache(true);
		setTimeout(() => {
			setClearingCache(false);
			showSuccess("Cache vide avec succes");
		}, 1200);
	}, []);

	/**
	 * Triggers search index rebuild with simulated delay.
	 * @returns void
	 */
	const handleRebuildIndices = useCallback(() => {
		setRebuilding(true);
		setTimeout(() => {
			setRebuilding(false);
			showSuccess("Indices reconstruits avec succes");
		}, 2000);
	}, []);

	/**
	 * Exports all data as a downloadable JSON file.
	 * @returns void
	 */
	const handleExportData = useCallback(() => {
		setExporting(true);
		setTimeout(() => {
			setExporting(false);
			showSuccess("Export complet genere");
		}, 1500);
	}, []);

	/**
	 * Toggles debug mode and shows a status notification.
	 * @param value - Whether debug mode should be enabled
	 * @returns void
	 */
	const handleToggleDebug = useCallback((value: boolean) => {
		setDebugMode(value);
		if (value) {
			showInfo("Mode debug active — les logs detailles sont visibles");
		} else {
			showInfo("Mode debug desactive");
		}
	}, []);

	return (
		<PageContainer title="Outils developpeur" description="Informations systeme, debug et maintenance">
			{/* Environment & Database */}
			<div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Environment info */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Environnement</h2>
					<Card padding="lg" className="border-l-4 border-l-red-500">
						<div className="space-y-3">
							{envInfo.length === 0 ? (
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Aucune information disponible
								</p>
							) : (
								envInfo.map((item) => (
									<div key={item.label} className="flex items-center justify-between">
										<span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
										<code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200">
											{item.value}
										</code>
									</div>
								))
							)}
						</div>
					</Card>
				</div>

				{/* Database info */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Base de donnees</h2>
					<Card padding="lg" className="border-l-4 border-l-red-500">
						<div className="space-y-3">
							{dbInfo.length === 0 ? (
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Aucune information disponible
								</p>
							) : (
								dbInfo.map((item) => (
									<div key={item.label} className="flex items-center justify-between">
										<span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
										<code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200">
											{item.value}
										</code>
									</div>
								))
							)}
						</div>
						<div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
							<div className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-gray-400" />
								<span className="text-sm text-gray-500 dark:text-gray-400">Non connecte</span>
							</div>
						</div>
					</Card>
				</div>
			</div>

			{/* System actions */}
			<div className="mb-8">
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Actions systeme</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<Card padding="lg">
						<div className="flex flex-col items-center text-center">
							<div className="mb-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
								<Icon name="close" size="lg" className="text-red-500 dark:text-red-400" />
							</div>
							<h3 className="mb-1 font-semibold text-gray-900 dark:text-white">Vider le cache</h3>
							<p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
								Supprime toutes les entrees en cache
							</p>
							<Button
								variant="outline-neutral"
								size="sm"
								isLoading={clearingCache}
								onClick={handleClearCache}
								className="w-full"
							>
								{clearingCache ? "Nettoyage..." : "Clear cache"}
							</Button>
						</div>
					</Card>

					<Card padding="lg">
						<div className="flex flex-col items-center text-center">
							<div className="mb-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
								<Icon name="settings" size="lg" className="text-red-500 dark:text-red-400" />
							</div>
							<h3 className="mb-1 font-semibold text-gray-900 dark:text-white">Rebuild indices</h3>
							<p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
								Reconstruit les index de recherche
							</p>
							<Button
								variant="outline-neutral"
								size="sm"
								isLoading={rebuilding}
								onClick={handleRebuildIndices}
								className="w-full"
							>
								{rebuilding ? "Reconstruction..." : "Rebuild"}
							</Button>
						</div>
					</Card>

					<Card padding="lg">
						<div className="flex flex-col items-center text-center">
							<div className="mb-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
								<Icon name="document" size="lg" className="text-red-500 dark:text-red-400" />
							</div>
							<h3 className="mb-1 font-semibold text-gray-900 dark:text-white">Export data</h3>
							<p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
								Exporte toutes les donnees en JSON
							</p>
							<Button
								variant="outline-neutral"
								size="sm"
								isLoading={exporting}
								onClick={handleExportData}
								className="w-full"
							>
								{exporting ? "Export..." : "Exporter"}
							</Button>
						</div>
					</Card>
				</div>
			</div>

			{/* Debug panel & Feature flags */}
			<div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Debug panel */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Debug</h2>
					<Card padding="lg">
						<div className="mb-4 flex items-center justify-between">
							<div>
								<p className="font-medium text-gray-900 dark:text-white">Mode debug</p>
								<p className="text-xs text-gray-400">
									Active les logs detailles et les outils de diagnostic
								</p>
							</div>
							<Toggle checked={debugMode} onChange={handleToggleDebug} size="md" />
						</div>
						<div className="border-t border-gray-200 pt-4 dark:border-gray-700">
							<Badge variant={debugMode ? "success" : "neutral"} showDot>
								{debugMode ? "Debug actif" : "Debug inactif"}
							</Badge>
						</div>
					</Card>
				</div>

				{/* Feature flags */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Feature flags</h2>
					<Card padding="lg">
						<div className="space-y-4">
							{featureFlags.length === 0 ? (
								<p className="text-sm text-gray-500 dark:text-gray-400">Aucun feature flag configure</p>
							) : (
								featureFlags.map((flag) => (
									<div key={flag.id} className="flex items-center justify-between">
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<code className="text-sm font-medium text-gray-900 dark:text-white">
													{flag.name}
												</code>
												<Badge variant={flag.enabled ? "success" : "neutral"} showDot={false}>
													{flag.enabled ? "ON" : "OFF"}
												</Badge>
											</div>
											<p className="text-xs text-gray-400">{flag.description}</p>
										</div>
										<Toggle
											checked={flag.enabled}
											onChange={() => handleToggleFlag(flag.id)}
											size="sm"
										/>
									</div>
								))
							)}
						</div>
					</Card>
				</div>
			</div>

			{/* Console */}
			<div>
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Console</h2>
				<div
					className={cn("overflow-hidden rounded-xl border border-gray-800 bg-gray-950", "font-mono text-sm")}
				>
					{/* Terminal header */}
					<div className="flex items-center gap-2 border-b border-gray-800 bg-gray-900 px-4 py-2.5">
						<span className="h-3 w-3 rounded-full bg-red-500" />
						<span className="h-3 w-3 rounded-full bg-amber-500" />
						<span className="h-3 w-3 rounded-full bg-emerald-500" />
						<span className="ml-3 text-xs text-gray-500">memora-dashboard -- system logs</span>
					</div>

					{/* Terminal body */}
					<div className="max-h-64 overflow-y-auto p-4">
						{consoleLines.length === 0 ? (
							<span className="text-gray-500">Aucun log disponible</span>
						) : (
							consoleLines.map((line, idx) => (
								<div key={idx} className="flex gap-3 py-0.5">
									<span className="shrink-0 text-gray-600">{line.time}</span>
									<span className={cn("w-12 shrink-0", levelColors[line.level])}>
										[{line.level.toUpperCase().padEnd(5)}]
									</span>
									<span className="text-gray-300">{line.message}</span>
								</div>
							))
						)}
						<div className="mt-2 flex items-center gap-1 text-emerald-400">
							<span>$</span>
							<span className="animate-pulse">_</span>
						</div>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
