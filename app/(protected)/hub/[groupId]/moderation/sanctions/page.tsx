"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Badge, Button, Icon, Modal, SectionHeaderBanner, Tag } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/moderation/sanctions",
	section: "protected",
	module: "moderation_discord",
	description: "Gestion des sanctions Discord.",
	requiredPermissions: [{ module: "moderation_discord", action: "view" }],
	entityScoped: true,
});

// Niveau Livecon actif (Discord = fixe, défini par l'administration)
type LiveconLevel = 3 | 2;
const ACTIVE_LIVECON: LiveconLevel = 3;

interface SanctionRow {
	first: string;
	repeat: string;
	multi: string;
}

interface SanctionType {
	id: string;
	title: string;
	icon: "chat" | "warning" | "eye" | "globe" | "shield" | "profile" | "flag" | "users" | "lock";
	color: "error" | "warning" | "info" | "success" | "primary" | "gray";
	defaultReason: string;
	sanctions: Record<LiveconLevel, SanctionRow>;
	/** Sanction identique quel que soit le Livecon */
	fixed?: boolean;
	/** Note spéciale affichée dans le modal */
	note?: string;
}

// Panel de sanctions Discord
const SANCTION_TYPES: SanctionType[] = [
	{
		id: "insultes",
		title: "Insultes / Irrespect",
		icon: "chat",
		color: "error",
		defaultReason: "Propos irrespectueux envers un ou plusieurs membres",
		sanctions: {
			3: { first: "Warn", repeat: "Tempmute 1h", multi: "Tempban 24h" },
			2: { first: "Tempmute 2h", repeat: "Tempban 24h", multi: "Ban" },
		},
	},
	{
		id: "spam",
		title: "Spam / Flood",
		icon: "warning",
		color: "warning",
		defaultReason: "Envoi massif de messages répétitifs perturbant les salons",
		sanctions: {
			3: { first: "Warn", repeat: "Tempmute 30min", multi: "Tempmute 2h" },
			2: { first: "Tempmute 1h", repeat: "Tempban 12h", multi: "Ban" },
		},
	},
	{
		id: "nsfw",
		title: "Contenu NSFW",
		icon: "eye",
		color: "error",
		defaultReason: "Diffusion de contenu à caractère explicite ou inapproprié",
		sanctions: {
			3: { first: "Warn", repeat: "Tempban 7d", multi: "Ban" },
			2: { first: "Tempban 7d", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "pub",
		title: "Publicité / Self-promo",
		icon: "globe",
		color: "info",
		defaultReason: "Promotion non autorisée de contenu ou serveur externe",
		sanctions: {
			3: { first: "Warn", repeat: "Tempmute 2h", multi: "Tempban 24h" },
			2: { first: "Tempmute 2h", repeat: "Tempban 24h", multi: "Ban" },
		},
	},
	{
		id: "harcelement",
		title: "Harcèlement",
		icon: "shield",
		color: "error",
		defaultReason: "Comportement de harcèlement répété envers un ou plusieurs membres",
		sanctions: {
			3: { first: "Tempban 7d", repeat: "Ban", multi: "Ban" },
			2: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "usurpation",
		title: "Usurpation d'identité",
		icon: "profile",
		color: "warning",
		defaultReason: "Utilisation frauduleuse de l'identité d'un membre ou du staff",
		sanctions: {
			3: { first: "Warn + Rename", repeat: "Tempban 24h", multi: "Ban" },
			2: { first: "Tempban 24h", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "menaces",
		title: "Menaces",
		icon: "flag",
		color: "error",
		defaultReason: "Proférations de menaces envers un membre ou le serveur",
		sanctions: {
			3: { first: "Tempban 7d", repeat: "Ban", multi: "Ban" },
			2: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "raid",
		title: "Raid / Attaque coordonnée",
		icon: "users",
		color: "error",
		defaultReason: "Participation à une attaque coordonnée contre le serveur",
		fixed: true,
		sanctions: {
			3: { first: "Ban", repeat: "Ban", multi: "Ban" },
			2: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "underaged",
		title: "Underaged",
		icon: "lock",
		color: "warning",
		defaultReason: "Compte identifié comme mineur — procédure spéciale appliquée",
		fixed: true,
		note: "Procédure spéciale : Tempban 30 jours systématique, quel que soit le Livecon.",
		sanctions: {
			3: { first: "Tempban 30d", repeat: "Tempban 30d", multi: "Tempban 30d" },
			2: { first: "Tempban 30d", repeat: "Tempban 30d", multi: "Tempban 30d" },
		},
	},
];

/**
 * Mappe une valeur de sanction vers une couleur de tag.
 * @param value - La valeur de la sanction
 */
function sanctionTagColor(value: string): "error" | "warning" | "gray" | "info" {
	const v = value.toLowerCase();
	if (v === "ban") return "error";
	if (v.startsWith("tempban")) return "warning";
	if (v.startsWith("tempmute")) return "info";
	return "gray";
}

/**
 * Classes de couleur pour les icônes de cards selon la sévérité.
 * @param color - La couleur associée au type de sanction
 */
function iconColorClasses(color: SanctionType["color"]): string {
	return cn(
		"flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
		color === "error" && "bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400",
		color === "warning" && "bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400",
		color === "info" && "bg-info-100 text-info-600 dark:bg-info-900/30 dark:text-info-400",
		color === "gray" && "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
	);
}

/**
 * Panel de sanctions Discord — cards cliquables ouvrant un modal de détail.
 * Design unifié : flush-header + grid de cards + modal par sanction.
 * @returns Le panel de sanctions Discord
 */
export default function SanctionsDiscordPage() {
	void PAGE_CONFIG;
	const [selected, setSelected] = useState<SanctionType | null>(null);
	const row = selected ? selected.sanctions[ACTIVE_LIVECON] : null;

	return (
		<PageContainer title="Panel de Sanctions" description="Modération Discord">
			{/* Flush-header card — SectionHeaderBanner collée au contenu */}
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
				<SectionHeaderBanner
					icon="shield"
					title="Sanctions opérationnelles"
					description="Cliquer sur une infraction pour voir le détail"
					accentColor="red"
					className="rounded-none"
				/>

				<div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
					{SANCTION_TYPES.map((sanction) => (
						<button
							key={sanction.id}
							onClick={() => setSelected(sanction)}
							className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-gray-600 dark:hover:bg-gray-900/60"
						>
							<div className={iconColorClasses(sanction.color)}>
								<Icon name={sanction.icon} size="md" />
							</div>

							<div className="min-w-0 flex-1">
								<p className="text-sm font-semibold text-gray-900 dark:text-white">{sanction.title}</p>
								<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
									1ère fois :{" "}
									<span className="font-medium">{sanction.sanctions[ACTIVE_LIVECON].first}</span>
								</p>
							</div>

							{sanction.fixed && (
								<Badge variant="warning" showDot={false}>
									Fixe
								</Badge>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Modal de détail — affiché au clic sur une sanction */}
			<Modal isOpen={selected !== null} onClose={() => setSelected(null)} title={selected?.title ?? ""} size="sm">
				{selected && row && (
					<div className="space-y-4">
						{/* Avertissement si sanction fixe */}
						{selected.fixed && (
							<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 flex items-start gap-2 rounded-lg border px-3 py-2">
								<Icon name="info" size="sm" className="text-warning-500 mt-0.5 shrink-0" />
								<span className="text-warning-700 dark:text-warning-400 text-xs">
									Sanction identique quel que soit le Livecon actif.
								</span>
							</div>
						)}

						{/* Tableau des sanctions */}
						<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
										<th className="px-3 py-2 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
											1ère fois
										</th>
										<th className="px-3 py-2 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
											Récidive
										</th>
										<th className="px-3 py-2 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
											Multi-récidive
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="px-3 py-2.5">
											<Tag color={sanctionTagColor(row.first)}>{row.first}</Tag>
										</td>
										<td className="px-3 py-2.5">
											<Tag color={sanctionTagColor(row.repeat)}>{row.repeat}</Tag>
										</td>
										<td className="px-3 py-2.5">
											<Tag color={sanctionTagColor(row.multi)}>{row.multi}</Tag>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						{/* Note spéciale (ex : underaged) */}
						{selected.note && (
							<div className="border-info-200 bg-info-50 dark:border-info-800 dark:bg-info-900/10 flex items-start gap-2 rounded-lg border px-3 py-2">
								<Icon name="info" size="sm" className="text-info-500 mt-0.5 shrink-0" />
								<span className="text-info-700 dark:text-info-400 text-xs">{selected.note}</span>
							</div>
						)}

						{/* Raison par défaut */}
						<div>
							<p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
								Raison par défaut
							</p>
							<div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
								{selected.defaultReason}
							</div>
						</div>

						<Button variant="primary" onClick={() => setSelected(null)} className="w-full">
							Fermer
						</Button>
					</div>
				)}
			</Modal>
		</PageContainer>
	);
}
