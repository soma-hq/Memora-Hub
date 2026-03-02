"use client";

// Features & Components
import { Select, Button, Icon, SectionCard } from "@/components/ui";
import { showSuccess } from "@/lib/utils/toast";
import { definePageConfig } from "@/structures";

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
			<SectionCard title="Apparence" icon="sun" color="primary" padding="lg">
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
			</SectionCard>

			{/* Language */}
			<SectionCard title="Langue et région" icon="globe" color="primary" padding="lg">
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
			</SectionCard>

			{/* Data */}
			<SectionCard title="Données personnelles" icon="shield" color="primary" padding="lg">
				<p className="mb-4 text-sm text-gray-400">Exportez vos données conformément au RGPD.</p>
				<div className="flex gap-3">
					<Button variant="outline-primary" size="sm" onClick={() => showSuccess("Export lancé")}>
						<Icon name="download" size="xs" />
						Exporter mes données
					</Button>
				</div>
			</SectionCard>

			<div className="flex justify-end">
				<Button onClick={() => showSuccess("Préférences enregistrées")}>Enregistrer</Button>
			</div>
		</div>
	);
}
