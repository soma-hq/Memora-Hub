"use client";

// Features & Components
import { Select, Button, Icon, SectionHeaderBanner } from "@/components/ui";
import { showSuccess } from "@/lib/utils/toast";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "settings/preferences",
	section: "protected",
	description: "Préférences d'affichage et de langue.",
});

/**
 * Preferences settings page for theme, language and display options.
 * @returns The preferences settings form
 */
export default function PreferencesPage() {
	return (
		<div className="max-w-2xl space-y-6">
			{/* Theme */}
		<div className="space-y-2">
			<SectionHeaderBanner icon="sun" title="Apparence" />
			<div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
				<div className="grid grid-cols-3 gap-3">
					{[
						{ label: "Clair", icon: "sun" as const, active: true },
						{ label: "Sombre", icon: "moon" as const, active: false },
						{ label: "Système", icon: "settings" as const, active: false },
					].map((theme) => (
						<button
							key={theme.label}
							className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
								theme.active
									? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/10"
									: "border-gray-200 text-gray-400 hover:border-gray-300 dark:border-gray-700"
							}`}
						>
							<Icon name={theme.icon} size="lg" />
							<span className="text-sm font-medium">{theme.label}</span>
						</button>
					))}
				</div>
			</div>
		</div>

		{/* Language */}
		<div className="space-y-2">
			<SectionHeaderBanner icon="globe" title="Langue et région" />
			<div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
				<div className="space-y-4">
					<Select
						label="Langue"
						options={[
							{ label: "Français", value: "fr" },
							{ label: "English", value: "en" },
						]}
						defaultValue="fr"
					/>
					<Select
						label="Format de date"
						options={[
							{ label: "DD/MM/YYYY", value: "dmy" },
							{ label: "MM/DD/YYYY", value: "mdy" },
							{ label: "YYYY-MM-DD", value: "ymd" },
						]}
						defaultValue="dmy"
					/>
					<Select
						label="Fuseau horaire"
						options={[
							{ label: "Europe/Paris (UTC+1)", value: "europe-paris" },
							{ label: "America/New_York (UTC-5)", value: "us-east" },
						]}
						defaultValue="europe-paris"
					/>
				</div>
			</div>
		</div>

		{/* Data */}
		<div className="space-y-2">
			<SectionHeaderBanner icon="shield" title="Données personnelles" />
			<div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
				<p className="mb-4 text-sm text-gray-400">Exportez vos données conformément au RGPD.</p>
				<div className="flex gap-3">
					<Button variant="outline-primary" size="sm" onClick={() => showSuccess("Export lancé")}>
						<Icon name="download" size="xs" />
						Exporter mes données
					</Button>
				</div>
			</div>
		</div>
				<Button onClick={() => showSuccess("Préférences enregistrées")}>Enregistrer</Button>
			</div>
		</div>
	);
}
