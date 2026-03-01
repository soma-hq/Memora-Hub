"use client";

// React
import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Tag } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


// Types

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
	/** When true the sanction is identical across all Livecon levels */
	fixed?: boolean;
	/** Special note displayed below the table */
	note?: string;
}

// Data

const SANCTION_TYPES: SanctionType[] = [
	{
		id: "insultes",
		title: "Insultes / Irrespect",
		icon: "chat",
		color: "error",
		defaultReason: "Propos irrespectueux envers un ou plusieurs membres de la communaute",
		sanctions: {
			3: { first: "Warn", repeat: "Tempmute 1h", multi: "Tempban 24h" },
			2: { first: "Tempmute 2h", repeat: "Tempban 24h", multi: "Ban" },
			1: { first: "Tempban 24h", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "spam",
		title: "Spam / Flood",
		icon: "warning",
		color: "warning",
		defaultReason: "Envoi massif de messages repetitifs perturbant les salons textuels",
		sanctions: {
			3: { first: "Warn", repeat: "Tempmute 30min", multi: "Tempmute 2h" },
			2: { first: "Tempmute 1h", repeat: "Tempban 12h", multi: "Ban" },
			1: { first: "Tempban 12h", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "nsfw",
		title: "Contenu NSFW",
		icon: "eye",
		color: "error",
		defaultReason: "Diffusion de contenu a caractere explicite ou inapproprie",
		sanctions: {
			3: { first: "Warn", repeat: "Tempban 7d", multi: "Ban" },
			2: { first: "Tempban 7d", repeat: "Ban", multi: "Ban" },
			1: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "pub",
		title: "Publicite / Self-promo",
		icon: "globe",
		color: "info",
		defaultReason: "Promotion non-autorisee de contenu ou serveur externe",
		sanctions: {
			3: { first: "Warn", repeat: "Tempmute 2h", multi: "Tempban 24h" },
			2: { first: "Tempmute 2h", repeat: "Tempban 24h", multi: "Ban" },
			1: { first: "Tempban 7d", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "harcelement",
		title: "Harcelement",
		icon: "shield",
		color: "error",
		defaultReason: "Comportement de harcelement repete envers un ou plusieurs membres",
		sanctions: {
			3: { first: "Tempban 7d", repeat: "Ban", multi: "Ban" },
			2: { first: "Ban", repeat: "Ban", multi: "Ban" },
			1: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "usurpation",
		title: "Usurpation d'identite",
		icon: "profile",
		color: "warning",
		defaultReason: "Utilisation frauduleuse de l'identite d'un autre membre ou du staff",
		sanctions: {
			3: { first: "Warn + Rename", repeat: "Tempban 24h", multi: "Ban" },
			2: { first: "Tempban 24h", repeat: "Ban", multi: "Ban" },
			1: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "menaces",
		title: "Menaces",
		icon: "flag",
		color: "error",
		defaultReason: "Proferation de menaces envers un membre ou le serveur",
		sanctions: {
			3: { first: "Tempban 7d", repeat: "Ban", multi: "Ban" },
			2: { first: "Ban", repeat: "Ban", multi: "Ban" },
			1: { first: "Ban", repeat: "Ban", multi: "Ban" },
		},
	},
	{
		id: "raid",
		title: "Raid / Attaque coordonnee",
		icon: "users",
		color: "error",
		defaultReason: "Participation a une attaque coordonnee contre le serveur",
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
		icon: "lock",
		color: "warning",
		defaultReason: "Compte identifie comme mineur — procedure speciale appliquee",
		fixed: true,
		note: "Procedure speciale : Tempban 30 jours systematique, quel que soit le Livecon.",
		sanctions: {
			3: { first: "Tempban 30d", repeat: "Tempban 30d", multi: "Tempban 30d" },
			2: { first: "Tempban 30d", repeat: "Tempban 30d", multi: "Tempban 30d" },
			1: { first: "Tempban 30d", repeat: "Tempban 30d", multi: "Tempban 30d" },
		},
	},
];

const LIVECON_CONFIG: Record<
	LiveconLevel,
	{ label: string; bg: string; bgActive: string; text: string; ring: string; dot: string }
> = {
	3: {
		label: "Livecon 3",
		bg: "bg-success-50 dark:bg-success-900/10",
		bgActive: "bg-success-500 dark:bg-success-600",
		text: "text-success-700 dark:text-success-300",
		ring: "ring-success-300 dark:ring-success-700",
		dot: "bg-success-500",
	},
	2: {
		label: "Livecon 2",
		bg: "bg-warning-50 dark:bg-warning-900/10",
		bgActive: "bg-warning-500 dark:bg-warning-600",
		text: "text-warning-700 dark:text-warning-300",
		ring: "ring-warning-300 dark:ring-warning-700",
		dot: "bg-warning-500",
	},
	1: {
		label: "Livecon 1",
		bg: "bg-error-50 dark:bg-error-900/10",
		bgActive: "bg-error-500 dark:bg-error-600",
		text: "text-error-700 dark:text-error-300",
		ring: "ring-error-300 dark:ring-error-700",
		dot: "bg-error-500",
	},
};

// Helpers

/**
 * Returns the Tag color variant for a given sanction type.
 * @param value - The sanction type string
 * @returns The Tag color variant
 */
function sanctionTagColor(value: string): "error" | "warning" | "gray" | "info" {
	const v = value.toLowerCase();
	if (v === "ban") return "error";
	if (v.startsWith("tempban")) return "warning";
	if (v.startsWith("tempmute")) return "info";
	return "gray";
}

// Component

/**
 * Sanctions management page for tracking bans, mutes and moderation actions.
 * @returns The sanctions list page
 */
export default function SanctionsPage() {
	const [livecon, setLivecon] = useState<LiveconLevel>(3);
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const currentConfig = LIVECON_CONFIG[livecon];

	function toggleCard(id: string) {
		setExpandedId((prev) => (prev === id ? null : id));
	}

	return (
		<PageContainer
			title="Panel de Sanctions"
			description="Tableau de sanctions par infraction — evolue selon le Livecon"
		>
			{/* ----------------------------------------------------------------- */}
			{/* Livecon selector                                                  */}
			{/* ----------------------------------------------------------------- */}
			<div className="mb-6">
				<p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Niveau Livecon actif</p>
				<div className="inline-flex items-center gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
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

			{/* ----------------------------------------------------------------- */}
			{/* Active Livecon badge                                              */}
			{/* ----------------------------------------------------------------- */}
			<div className="mb-6 flex items-center gap-3">
				<Badge variant={livecon === 3 ? "success" : livecon === 2 ? "warning" : "error"}>
					{currentConfig.label} actif
				</Badge>
				<span className="text-xs text-gray-400 dark:text-gray-500">
					Les sanctions ci-dessous correspondent au niveau selectionne.
				</span>
			</div>

			{/* ----------------------------------------------------------------- */}
			{/* Sanction gallery                                                  */}
			{/* ----------------------------------------------------------------- */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{SANCTION_TYPES.map((sanction) => {
					const isExpanded = expandedId === sanction.id;
					const row = sanction.sanctions[livecon];

					return (
						<div key={sanction.id} className={cn(isExpanded && "sm:col-span-2 lg:col-span-3")}>
							<Card
								hover={!isExpanded}
								padding={isExpanded ? "lg" : "md"}
								onClick={() => toggleCard(sanction.id)}
								className="transition-all duration-200"
							>
								{/* Card header — always visible */}
								<div className="flex items-center gap-3">
									<div
										className={cn(
											"flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
											sanction.color === "error" &&
												"bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400",
											sanction.color === "warning" &&
												"bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400",
											sanction.color === "info" &&
												"bg-info-100 text-info-600 dark:bg-info-900/30 dark:text-info-400",
											sanction.color === "success" &&
												"bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400",
											sanction.color === "primary" &&
												"bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",
											sanction.color === "gray" &&
												"bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
										)}
									>
										<Icon name={sanction.icon} size="md" />
									</div>
									<div className="min-w-0 flex-1">
										<h3 className="text-sm font-semibold text-gray-900 dark:text-white">
											{sanction.title}
										</h3>
										{!isExpanded && (
											<p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
												1ere : <span className="font-medium">{row.first}</span>
											</p>
										)}
									</div>
									<Icon
										name={isExpanded ? "chevronUp" : "chevronDown"}
										size="sm"
										className="text-gray-400 dark:text-gray-500"
									/>
								</div>

								{/* Expanded content — sanctions table */}
								{isExpanded && (
									<div className="mt-4 space-y-4">
										{/* Fixed-level notice */}
										{sanction.fixed && (
											<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 flex items-start gap-2 rounded-lg border px-3 py-2">
												<Icon
													name="info"
													size="sm"
													className="text-warning-500 mt-0.5 shrink-0"
												/>
												<span className="text-warning-700 dark:text-warning-400 text-xs">
													Cette infraction applique la meme sanction quel que soit le Livecon.
												</span>
											</div>
										)}

										{/* Table */}
										<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
											<table className="w-full text-sm">
												<thead>
													<tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
														<th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
															Infraction
														</th>
														<th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
															1ere fois
														</th>
														<th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
															Recidive
														</th>
														<th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
															Multi-recidive
														</th>
													</tr>
												</thead>
												<tbody>
													<tr className="border-b border-gray-100 dark:border-gray-700/50">
														<td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
															{sanction.title}
														</td>
														<td className="px-4 py-3">
															<Tag color={sanctionTagColor(row.first)}>{row.first}</Tag>
														</td>
														<td className="px-4 py-3">
															<Tag color={sanctionTagColor(row.repeat)}>{row.repeat}</Tag>
														</td>
														<td className="px-4 py-3">
															<Tag color={sanctionTagColor(row.multi)}>{row.multi}</Tag>
														</td>
													</tr>
												</tbody>
											</table>
										</div>

										{/* Special note */}
										{sanction.note && (
											<div className="border-info-200 bg-info-50 dark:border-info-800 dark:bg-info-900/10 flex items-start gap-2 rounded-lg border px-3 py-2">
												<Icon name="info" size="sm" className="text-info-500 mt-0.5 shrink-0" />
												<span className="text-info-700 dark:text-info-400 text-xs">
													{sanction.note}
												</span>
											</div>
										)}

										{/* Default warn reason */}
										<div>
											<label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
												Raison par defaut pour le systeme de warn
											</label>
											<div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
												{sanction.defaultReason}
											</div>
										</div>
									</div>
								)}
							</Card>
						</div>
					);
				})}
			</div>
		</PageContainer>
	);
}
