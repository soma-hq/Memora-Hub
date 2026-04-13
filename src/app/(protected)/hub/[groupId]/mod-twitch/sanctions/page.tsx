"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Badge, Button, Icon, Modal, SectionHeaderBanner, Tag } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/mod-twitch/sanctions",
	section: "protected",
	module: "moderation_twitch",
	description: "Gestion des sanctions Twitch.",
	requiredPermissions: [{ module: "moderation_twitch", action: "view" }],
	entityScoped: true,
});

type LiveconLevel = 3 | 2 | 1;

interface SanctionRow {
	first: string;
	repeat: string;
	multi: string;
}

interface SanctionType {
	id: string;
	title: string;
	icon: "warning" | "chat" | "eye" | "globe" | "shield" | "profile" | "flag" | "users" | "lock";
	color: "error" | "warning" | "info" | "success" | "primary" | "gray";
	defaultReason: string;
	sanctions: Record<LiveconLevel, SanctionRow>;
	fixed?: boolean;
	note?: string;
}

// Panel de sanctions Twitch
const SANCTION_TYPES: SanctionType[] = [
	{
		id: "spam",
		title: "Spam Chat / Flood",
		icon: "warning",
		color: "warning",
		defaultReason: "Envoi massif de messages répétitifs perturbant le chat Twitch",
		sanctions: {
			3: { first: "Timeout 5min", repeat: "Timeout 1h", multi: "Ban 24h" },
			2: { first: "Timeout 1h", repeat: "Ban 24h", multi: "Ban" },
			1: { first: "Ban 24h", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "insultes",
		title: "Insultes / Irrespect",
		icon: "chat",
		color: "error",
		defaultReason: "Messages irrespectueux envers le streamer, les viewers ou les modérateurs",
		sanctions: {
			3: { first: "Timeout 10min", repeat: "Timeout 1h", multi: "Ban 7d" },
			2: { first: "Timeout 1h", repeat: "Ban 7d", multi: "Ban" },
			1: { first: "Ban 7d", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "pub",
		title: "Publicité / Self-promo",
		icon: "globe",
		color: "info",
		defaultReason: "Promotion non-autorisée de chaîne ou lien externe dans le chat",
		sanctions: {
			3: { first: "Warn", repeat: "Timeout 2h", multi: "Ban 24h" },
			2: { first: "Timeout 2h", repeat: "Ban 24h", multi: "Ban" },
			1: { first: "Ban 7d", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "ban-evasion",
		title: "Ban Evasion",
		icon: "lock",
		color: "error",
		defaultReason: "Utilisation de comptes alternatifs pour contourner un bannissement",
		fixed: true,
		sanctions: {
			3: { first: "Ban", repeat: "Ban", multi: "Ban" },
			2: { first: "Ban", repeat: "Ban", multi: "Ban" },
			1: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "follow-botting",
		title: "Follow Botting",
		icon: "users",
		color: "warning",
		defaultReason: "Utilisation de faux followers ou de bots pour gonfler les chiffres",
		sanctions: {
			3: { first: "Warn", repeat: "Ban 7d", multi: "Ban" },
			2: { first: "Ban 7d", repeat: "Ban", multi: "Ban" },
			1: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "harcelement",
		title: "Harcèlement",
		icon: "shield",
		color: "error",
		defaultReason: "Harcèlement répété envers le streamer ou d'autres viewers",
		sanctions: {
			3: { first: "Ban 7d", repeat: "Ban", multi: "Ban" },
			2: { first: "Ban", repeat: "Ban", multi: "Ban" },
			1: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "contenu-tos",
		title: "Contenu TOS",
		icon: "eye",
		color: "error",
		defaultReason: "Violation des conditions d'utilisation de Twitch (contenu interdit)",
		sanctions: {
			3: { first: "Ban 7d", repeat: "Ban", multi: "Ban" },
			2: { first: "Ban", repeat: "Ban", multi: "Ban" },
			1: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "hate-raid",
		title: "Hate Raid",
		icon: "flag",
		color: "error",
		defaultReason: "Participation à un hate raid coordonné contre la chaîne",
		fixed: true,
		sanctions: {
			3: { first: "Ban", repeat: "Ban", multi: "Ban" },
			2: { first: "Ban", repeat: "Ban", multi: "Ban" },
			1: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "underaged",
		title: "Underaged",
		icon: "profile",
		color: "warning",
		defaultReason: "Compte identifié comme mineur — procédure spéciale appliquée",
		fixed: true,
		note: "Procédure spéciale : Tempban 30 jours systématique, quel que soit le Livecon.",
		sanctions: {
			3: { first: "Tempban 30d", repeat: "Tempban 30d", multi: "Tempban 30d" },
			2: { first: "Tempban 30d", repeat: "Tempban 30d", multi: "Tempban 30d" },
			1: { first: "Tempban 30d", repeat: "Tempban 30d", multi: "Tempban 30d" },
		},
	},
];

// Configuration visuelle des niveaux Livecon
const LIVECON_CONFIG: Record<
	LiveconLevel,
	{
		label: string;
		bgActive: string;
		text: string;
		dot: string;
		description: string;
		badge: "success" | "warning" | "error";
	}
> = {
	3: {
		label: "Livecon 3",
		bgActive: "bg-success-500 dark:bg-success-600",
		text: "text-success-700 dark:text-success-300",
		dot: "bg-success-500",
		description: "Situation calme — sanctions légères, priorité à la pédagogie.",
		badge: "success",
	},
	2: {
		label: "Livecon 2",
		bgActive: "bg-warning-500 dark:bg-warning-600",
		text: "text-warning-700 dark:text-warning-300",
		dot: "bg-warning-500",
		description: "Situation tendue — sanctions modérées, tolérance réduite.",
		badge: "warning",
	},
	1: {
		label: "Livecon 1",
		bgActive: "bg-error-500 dark:bg-error-600",
		text: "text-error-700 dark:text-error-300",
		dot: "bg-error-500",
		description: "Situation critique — sanctions maximales, tolérance zéro.",
		badge: "error",
	},
};

/**
 * Mappe une valeur de sanction Twitch vers une couleur de tag.
 * @param value - La valeur de la sanction
 */
function sanctionTagColor(value: string): "error" | "warning" | "gray" | "info" {
	const v = value.toLowerCase();
	if (v === "ban") return "error";
	if (v.startsWith("ban ")) return "warning";
	if (v.startsWith("tempban")) return "warning";
	if (v.startsWith("timeout")) return "info";
	return "gray";
}

/**
 * Classes de couleur pour les icônes de cards.
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
 * Panel de sanctions Twitch — cards cliquables ouvrant un modal de détail.
 * Le niveau Livecon est sélectionnable pour adapter les sanctions au contexte du live.
 * Design unifié : flush-header + grid de cards + modal par sanction.
 * @returns Le panel de sanctions Twitch
 */
export default function TwitchSanctionsPage() {
	void PAGE_CONFIG;
	const [livecon, setLivecon] = useState<LiveconLevel>(3);
	const [selected, setSelected] = useState<SanctionType | null>(null);
	const currentConfig = LIVECON_CONFIG[livecon];
	const row = selected ? selected.sanctions[livecon] : null;

	return (
		<PageContainer
			title="Panel de Sanctions Twitch"
			description="Sanctions par infraction — évoluent selon le Livecon actif"
		>
			{/* Sélecteur Livecon — au-dessus du panel */}
			<div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
				<div className="flex flex-wrap items-center justify-between gap-3 p-4">
					<div>
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">Niveau Livecon actif</p>
						<p className={cn("mt-0.5 text-xs", currentConfig.text)}>{currentConfig.description}</p>
					</div>
					<div className="inline-flex items-center gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
						{([3, 2, 1] as LiveconLevel[]).map((level) => {
							const cfg = LIVECON_CONFIG[level];
							const isActive = livecon === level;
							return (
								<button
									key={level}
									onClick={() => setLivecon(level)}
									className={cn(
										"flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
										isActive
											? cn(cfg.bgActive, "text-white shadow-sm")
											: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
									)}
								>
									<span className={cn("h-2 w-2 rounded-full", isActive ? "bg-white" : cfg.dot)} />
									{cfg.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Flush-header card — SectionHeaderBanner collée aux cards de sanction */}
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
				<SectionHeaderBanner
					icon="shield"
					title="Panel de Sanctions"
					description="Cliquer sur une infraction pour voir le détail"
					accentColor="orange"
					className="rounded-none"
				>
					<Badge variant={currentConfig.badge}>{currentConfig.label}</Badge>
				</SectionHeaderBanner>

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
									1ère fois : <span className="font-medium">{sanction.sanctions[livecon].first}</span>
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
						{selected.fixed && (
							<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 flex items-start gap-2 rounded-lg border px-3 py-2">
								<Icon name="info" size="sm" className="text-warning-500 mt-0.5 shrink-0" />
								<span className="text-warning-700 dark:text-warning-400 text-xs">
									Sanction identique quel que soit le Livecon actif.
								</span>
							</div>
						)}

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

						{selected.note && (
							<div className="border-info-200 bg-info-50 dark:border-info-800 dark:bg-info-900/10 flex items-start gap-2 rounded-lg border px-3 py-2">
								<Icon name="info" size="sm" className="text-info-500 mt-0.5 shrink-0" />
								<span className="text-info-700 dark:text-info-400 text-xs">{selected.note}</span>
							</div>
						)}

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
