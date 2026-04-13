"use client";

import { useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Badge, Button, Icon, Modal, SectionHeaderBanner, Tabs, Tag } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/mod-polyvalent/sanctions",
	section: "protected",
	module: "moderation_polyvalent",
	description: "Gestion des sanctions Polyvalent.",
	requiredPermissions: [{ module: "moderation_polyvalent", action: "view" }],
	entityScoped: true,
});

// Niveau Livecon actif (Polyvalent = fixe, défini par l'administration)
type LiveconLevel = 3 | 2;
const ACTIVE_LIVECON: LiveconLevel = 3;

type Platform = "Discord" | "Twitch" | "Both";
type PlatformTab = "common" | "discord" | "twitch";

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
	platform: Platform;
	defaultReason: string;
	sanctions: Record<LiveconLevel, SanctionRow>;
	fixed?: boolean;
	note?: string;
}

// Panel de sanctions Polyvalent (Discord + Twitch)
const SANCTION_TYPES: SanctionType[] = [
	{
		id: "insultes",
		title: "Insultes / Irrespect",
		icon: "chat",
		color: "error",
		platform: "Both",
		defaultReason: "Propos irrespectueux envers un ou plusieurs membres",
		sanctions: {
			3: { first: "Warn / Timeout 10min", repeat: "Tempmute 1h / Timeout 1h", multi: "Tempban 24h / Ban 24h" },
			2: { first: "Tempmute 2h / Timeout 2h", repeat: "Tempban 24h / Ban 24h", multi: "Ban / Ban" },
		},
	},
	{
		id: "spam",
		title: "Spam / Flood",
		icon: "warning",
		color: "warning",
		platform: "Both",
		defaultReason: "Flood ou spam perturbant Discord ou le chat Twitch",
		sanctions: {
			3: {
				first: "Warn / Timeout 5min",
				repeat: "Tempmute 30min / Timeout 30min",
				multi: "Tempmute 2h / Timeout 2h",
			},
			2: { first: "Tempmute 1h / Timeout 1h", repeat: "Tempban 12h / Ban 12h", multi: "Ban / Ban" },
		},
	},
	{
		id: "pub",
		title: "Publicité / Self-promo",
		icon: "globe",
		color: "info",
		platform: "Both",
		defaultReason: "Promotion non autorisée de contenu, lien ou serveur",
		sanctions: {
			3: {
				first: "Warn / Timeout 10min",
				repeat: "Tempmute 2h / Timeout 2h",
				multi: "Tempban 24h / Ban 24h",
			},
			2: { first: "Tempmute 2h / Timeout 2h", repeat: "Tempban 24h / Ban 24h", multi: "Ban / Ban" },
		},
	},
	{
		id: "harcelement",
		title: "Harcèlement",
		icon: "shield",
		color: "error",
		platform: "Both",
		defaultReason: "Harcèlement répété envers un membre",
		sanctions: {
			3: { first: "Tempban 7d / Ban 7d", repeat: "Ban / Ban", multi: "Ban / Ban" },
			2: { first: "Ban / Ban", repeat: "Ban / Ban", multi: "Ban / Ban" },
		},
	},
	{
		id: "usurpation",
		title: "Usurpation d'identité",
		icon: "profile",
		color: "warning",
		platform: "Both",
		defaultReason: "Usurpation d'identité d'un membre ou d'un staff",
		sanctions: {
			3: { first: "Warn + Rename / Timeout 1h", repeat: "Tempban 24h / Ban 24h", multi: "Ban / Ban" },
			2: { first: "Tempban 24h / Ban 24h", repeat: "Ban / Ban", multi: "Ban / Ban" },
		},
	},
	{
		id: "nsfw",
		title: "Contenu NSFW",
		icon: "eye",
		color: "error",
		platform: "Discord",
		defaultReason: "Diffusion de contenu explicite sur Discord",
		sanctions: {
			3: { first: "Warn", repeat: "Tempban 7d", multi: "Ban" },
			2: { first: "Tempban 7d", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "follow-botting",
		title: "Follow Botting",
		icon: "users",
		color: "warning",
		platform: "Twitch",
		defaultReason: "Utilisation de bots pour manipuler les follows",
		sanctions: {
			3: { first: "Ban 7d", repeat: "Ban", multi: "Ban" },
			2: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "hate-raid",
		title: "Hate Raid",
		icon: "flag",
		color: "error",
		platform: "Both",
		defaultReason: "Raid haineux coordonné sur Discord et/ou Twitch",
		fixed: true,
		sanctions: {
			3: { first: "Ban / Ban", repeat: "Ban / Ban", multi: "Ban / Ban" },
			2: { first: "Ban / Ban", repeat: "Ban / Ban", multi: "Ban / Ban" },
		},
	},
	{
		id: "underaged",
		title: "Underaged",
		icon: "lock",
		color: "warning",
		platform: "Both",
		defaultReason: "Compte identifié comme mineur — procédure spéciale",
		fixed: true,
		note: "Procédure spéciale : Tempban / Ban 30 jours systématique sur les deux plateformes.",
		sanctions: {
			3: {
				first: "Tempban 30d / Ban 30d",
				repeat: "Tempban 30d / Ban 30d",
				multi: "Tempban 30d / Ban 30d",
			},
			2: {
				first: "Tempban 30d / Ban 30d",
				repeat: "Tempban 30d / Ban 30d",
				multi: "Tempban 30d / Ban 30d",
			},
		},
	},
];

// Onglets de filtre par plateforme
const PLATFORM_TABS = [
	{ id: "common", label: "Communes", icon: "users" as const },
	{ id: "discord", label: "Discord", icon: "chat" as const },
	{ id: "twitch", label: "Twitch", icon: "globe" as const },
];

/**
 * Mappe une valeur de sanction Polyvalent vers une couleur de tag.
 * @param value - La valeur de la sanction
 */
function sanctionTagColor(value: string): "error" | "warning" | "gray" | "info" {
	const v = value.toLowerCase();
	if (v === "ban" || v === "ban / ban") return "error";
	if (v.includes("tempban") || v.includes("ban ")) return "warning";
	if (v.includes("tempmute") || v.includes("timeout")) return "info";
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
 * Libellé lisible pour la plateforme d'une sanction.
 * @param platform - La plateforme de la sanction
 */
function platformLabel(platform: Platform): string {
	if (platform === "Both") return "Discord + Twitch";
	return platform;
}

/**
 * Panel de sanctions Polyvalent — cards cliquables ouvrant un modal de détail.
 * Filtre par plateforme via onglets. Design unifié avec les autres panels de sanctions.
 * @returns Le panel de sanctions Polyvalent (Discord + Twitch)
 */
export default function SanctionsPolyvalentPage() {
	void PAGE_CONFIG;
	const [activeTab, setActiveTab] = useState<PlatformTab>("common");
	const [selected, setSelected] = useState<SanctionType | null>(null);
	const row = selected ? selected.sanctions[ACTIVE_LIVECON] : null;

	// Filtrage des sanctions selon l'onglet actif
	const filteredSanctions = useMemo(() => {
		if (activeTab === "discord")
			return SANCTION_TYPES.filter((s) => s.platform === "Discord" || s.platform === "Both");
		if (activeTab === "twitch")
			return SANCTION_TYPES.filter((s) => s.platform === "Twitch" || s.platform === "Both");
		return SANCTION_TYPES.filter((s) => s.platform === "Both");
	}, [activeTab]);

	return (
		<PageContainer title="Panel de Sanctions Polyvalent" description="Discord et Twitch">
			{/* Flush-header card — SectionHeaderBanner + onglets plateforme + cards */}
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
				<SectionHeaderBanner
					icon="shield"
					title="Panel sanctions multi-plateforme"
					description="Cliquer sur une infraction pour voir le détail"
					accentColor="orange"
					className="rounded-none"
				>
					<Badge variant="success">Livecon 3</Badge>
				</SectionHeaderBanner>

				{/* Onglets plateforme — intégrés dans le card wrapper */}
				<div className="border-b border-gray-200 px-4 pt-3 dark:border-gray-700">
					<Tabs
						tabs={PLATFORM_TABS}
						activeTab={activeTab}
						onTabChange={(id) => setActiveTab(id as PlatformTab)}
					/>
				</div>

				<div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
					{filteredSanctions.map((sanction) => (
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
									<span className="mr-1.5 text-gray-400">{platformLabel(sanction.platform)}</span>·
									1ère :{" "}
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
						{/* Plateforme concernée */}
						<div className="flex items-center gap-2">
							<span className="text-xs text-gray-500 dark:text-gray-400">Plateforme :</span>
							<Tag color="gray">{platformLabel(selected.platform)}</Tag>
						</div>

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
