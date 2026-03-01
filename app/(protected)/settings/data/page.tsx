"use client";

// React
import { useState } from "react";
import { Card, Button, Icon, Badge } from "@/components/ui";
import { ConfirmAction } from "@/components/feedback/confirm-action";
import { showSuccess, showInfo } from "@/lib/utils/toast";
import type { IconName } from "@/core/design/icons";


const exportFormats = [
	{
		id: "json",
		label: "JSON",
		description: "Format brut, idéal pour la portabilité",
		icon: "folder" as const,
		size: "~2.4 Mo",
	},
	{
		id: "csv",
		label: "CSV",
		description: "Tableur, compatible Excel et Google Sheets",
		icon: "stats" as const,
		size: "~1.8 Mo",
	},
	{
		id: "pdf",
		label: "PDF",
		description: "Document formaté, lisible et imprimable",
		icon: "file" as const,
		size: "~3.1 Mo",
	},
];

const dataCategories = [
	{ label: "Informations personnelles", count: "1 fichier", checked: true },
	{ label: "Projets et tâches", count: "47 éléments", checked: true },
	{ label: "Réunions", count: "12 éléments", checked: true },
	{ label: "Absences", count: "3 éléments", checked: true },
	{ label: "Activite et logs", count: "156 entrees", checked: false },
];

/**
 * Data management page for exporting, importing and deleting account data.
 * @returns The data settings page
 */
export default function SettingsDataPage() {
	const [selectedFormat, setSelectedFormat] = useState("json");
	const [isExporting, setIsExporting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [categories, setCategories] = useState(dataCategories);

	const toggleCategory = (index: number) => {
		const updated = [...categories];
		updated[index] = { ...updated[index], checked: !updated[index].checked };
		setCategories(updated);
	};

	const handleExport = async () => {
		setIsExporting(true);
		await new Promise((r) => setTimeout(r, 2000));
		setIsExporting(false);
		showSuccess(`Export ${selectedFormat.toUpperCase()} généré avec succès`);
	};

	const handleDeleteAccount = async () => {
		await new Promise((r) => setTimeout(r, 1500));
		showInfo("Demande de suppression envoyée. Vous recevrez un email de confirmation.");
		setShowDeleteConfirm(false);
	};

	return (
		<div className="space-y-6">
			{/* Export section */}
			<Card padding="lg">
				<div className="mb-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exporter mes données</h3>
					<p className="mt-1 text-sm text-gray-400">
						Télécharger une copie de vos données conformément au RGPD (Art. 20 — Droit à la portabilité).
					</p>
				</div>

				{/* Data categories */}
				<div className="mb-6">
					<p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Données à inclure</p>
					<div className="space-y-2">
						{categories.map((cat, idx) => (
							<label
								key={cat.label}
								className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
							>
								<input
									type="checkbox"
									checked={cat.checked}
									onChange={() => toggleCategory(idx)}
									className="text-primary-500 focus:ring-primary-100 h-4 w-4 rounded border-gray-300"
								/>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.label}</p>
								</div>
								<span className="text-xs text-gray-400">{cat.count}</span>
							</label>
						))}
					</div>
				</div>

				{/* Format selection */}
				<div className="mb-6">
					<p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Format d&apos;export</p>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
						{exportFormats.map((format) => (
							<button
								key={format.id}
								type="button"
								onClick={() => setSelectedFormat(format.id)}
								className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${
									selectedFormat === format.id
										? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
										: "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
								}`}
							>
								<div className="mb-2 flex items-center gap-2">
									<Icon
										name={format.icon}
										size="sm"
										className={selectedFormat === format.id ? "text-primary-500" : "text-gray-400"}
									/>
									<span className="font-semibold text-gray-900 dark:text-white">{format.label}</span>
									<Badge variant="neutral" showDot={false}>
										{format.size}
									</Badge>
								</div>
								<p className="text-xs text-gray-400">{format.description}</p>
							</button>
						))}
					</div>
				</div>

				<Button onClick={handleExport} isLoading={isExporting}>
					<Icon name="download" size="xs" />
					Exporter mes données
				</Button>
			</Card>

			{/* Data usage */}
			<Card padding="lg">
				<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Utilisation des données</h3>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{[
						{ label: "Stockage utilisé", value: "24.7 Mo", icon: "folder" as IconName },
						{ label: "Fichiers uploadés", value: "18", icon: "file" as IconName },
						{ label: "Dernière connexion", value: "Aujourd'hui", icon: "clock" as IconName },
						{ label: "Compte créé", value: "Jan. 2024", icon: "calendar" as IconName },
					].map((item) => (
						<div key={item.label} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
							<Icon name={item.icon} size="sm" className="mb-2 text-gray-400" />
							<p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
							<p className="text-xs text-gray-400">{item.label}</p>
						</div>
					))}
				</div>
			</Card>

			{/* Danger zone */}
			<Card padding="lg" className="border-error-200 dark:border-error-800">
				<div className="flex items-start gap-4">
					<div className="bg-error-100 dark:bg-error-900/20 shrink-0 rounded-lg p-2">
						<Icon name="warning" size="md" className="text-error-500" />
					</div>
					<div className="flex-1">
						<h3 className="text-error-700 dark:text-error-400 text-lg font-semibold">
							Supprimer mon compte
						</h3>
						<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
							Cette action est définitive. Toutes vos données seront supprimées de manière permanente
							après un délai de 30 jours. Vous recevrez un email de confirmation avant la suppression.
						</p>
						<Button
							variant="outline-danger"
							size="sm"
							className="mt-4"
							onClick={() => setShowDeleteConfirm(true)}
						>
							<Icon name="delete" size="xs" />
							Supprimer mon compte
						</Button>
					</div>
				</div>
			</Card>

			<ConfirmAction
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={handleDeleteAccount}
				title="Supprimer votre compte ?"
				description="Cette action est irréversible. Toutes vos données personnelles, projets, tâches et historique seront définitivement supprimés après un délai de 30 jours."
				confirmText="Oui, supprimer mon compte"
				variant="danger"
			/>
		</div>
	);
}
