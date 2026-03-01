"use client";

// React
import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Tag, Modal, Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


// Constants & types

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
		id: "spam",
		title: "Spam Commentaires",
		icon: "warning",
		color: "warning",
		defaultReason: "Envoi massif de commentaires repetitifs ou de spam dans les sections commentaires",
		sanctions: {
			3: { first: "Masquer", repeat: "Bloquer 24h", multi: "Bloquer" },
			2: { first: "Bloquer 24h", repeat: "Bloquer", multi: "Bloquer" },
			1: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
		},
	},
	{
		id: "insultes",
		title: "Insultes / Irrespect",
		icon: "chat",
		color: "error",
		defaultReason: "Commentaires irrespectueux envers le createur, le staff ou la communaute",
		sanctions: {
			3: { first: "Masquer", repeat: "Bloquer 24h", multi: "Bloquer 7d" },
			2: { first: "Bloquer 24h", repeat: "Bloquer 7d", multi: "Bloquer" },
			1: { first: "Bloquer 7d", repeat: "Bloquer", multi: "Bloquer" },
		},
	},
	{
		id: "selfpromo",
		title: "Self-promo / Liens",
		icon: "globe",
		color: "info",
		defaultReason: "Promotion non-autorisee de chaine ou diffusion de liens externes",
		sanctions: {
			3: { first: "Masquer", repeat: "Bloquer 24h", multi: "Bloquer" },
			2: { first: "Bloquer 24h", repeat: "Bloquer", multi: "Bloquer" },
			1: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
		},
	},
	{
		id: "usurpation",
		title: "Usurpation d'identite",
		icon: "profile",
		color: "warning",
		defaultReason: "Utilisation frauduleuse de l'identite du createur ou d'un membre du staff",
		sanctions: {
			3: { first: "Signalement+Bloquer", repeat: "Bloquer", multi: "Bloquer" },
			2: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
			1: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
		},
	},
	{
		id: "guidelines",
		title: "Violation guidelines communautaires",
		icon: "flag",
		color: "error",
		defaultReason: "Violation des regles de la communaute YouTube sur la chaine",
		sanctions: {
			3: { first: "Bloquer 7d", repeat: "Bloquer", multi: "Bloquer" },
			2: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
			1: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
		},
	},
	{
		id: "harcelement",
		title: "Harcelement",
		icon: "shield",
		color: "error",
		defaultReason: "Comportement de harcelement repete dans les commentaires ou le chat en direct",
		sanctions: {
			3: { first: "Bloquer 7d", repeat: "Bloquer", multi: "Bloquer" },
			2: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
			1: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
		},
	},
	{
		id: "doxxing",
		title: "Doxxing",
		icon: "lock",
		color: "error",
		defaultReason: "Partage d'informations personnelles d'un membre sans son consentement",
		fixed: true,
		sanctions: {
			3: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
			2: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
			1: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
		},
	},
	{
		id: "brigading",
		title: "Brigading",
		icon: "users",
		color: "error",
		defaultReason: "Participation a une attaque coordonnee de mass-report ou mass-dislike",
		fixed: true,
		sanctions: {
			3: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
			2: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
			1: { first: "Bloquer", repeat: "Bloquer", multi: "Bloquer" },
		},
	},
	{
		id: "underaged",
		title: "Underaged",
		icon: "eye",
		color: "warning",
		defaultReason: "Compte identifie comme mineur — procedure speciale appliquee",
		fixed: true,
		note: "Procedure speciale : Bloquer 30 jours systematique, quel que soit le Livecon.",
		sanctions: {
			3: { first: "Bloquer 30d", repeat: "Bloquer 30d", multi: "Bloquer 30d" },
			2: { first: "Bloquer 30d", repeat: "Bloquer 30d", multi: "Bloquer 30d" },
			1: { first: "Bloquer 30d", repeat: "Bloquer 30d", multi: "Bloquer 30d" },
		},
	},
];

const LIVECON_CONFIG: Record<
	LiveconLevel,
	{ label: string; bg: string; bgActive: string; text: string; ring: string; dot: string; description: string }
> = {
	3: {
		label: "Livecon 3",
		bg: "bg-success-50 dark:bg-success-900/10",
		bgActive: "bg-success-500 dark:bg-success-600",
		text: "text-success-700 dark:text-success-300",
		ring: "ring-success-300 dark:ring-success-700",
		dot: "bg-success-500",
		description: "Situation calme. Sanctions legeres, priorite a la pedagogie.",
	},
	2: {
		label: "Livecon 2",
		bg: "bg-warning-50 dark:bg-warning-900/10",
		bgActive: "bg-warning-500 dark:bg-warning-600",
		text: "text-warning-700 dark:text-warning-300",
		ring: "ring-warning-300 dark:ring-warning-700",
		dot: "bg-warning-500",
		description: "Situation tendue. Sanctions moderees, tolerance reduite.",
	},
	1: {
		label: "Livecon 1",
		bg: "bg-error-50 dark:bg-error-900/10",
		bgActive: "bg-error-500 dark:bg-error-600",
		text: "text-error-700 dark:text-error-300",
		ring: "ring-error-300 dark:ring-error-700",
		dot: "bg-error-500",
		description: "Situation critique. Sanctions maximales, tolerance zero.",
	},
};

/** Active consignes displayed above the sanctions panel */
const ACTIVE_CONSIGNES = [
	"Toujours privilegier la desescalade avant toute sanction",
	"Documenter chaque sanction avec la raison dans le systeme",
	"En cas de doute, consulter un moderateur senior",
];

/** Currently active Livecon level (read-only, set by administration) */
const CURRENT_LIVECON: LiveconLevel = 3;

/**
 * Returns a tag color variant based on the sanction action value.
 * @param {string} value - The sanction action label
 * @returns {"error" | "warning" | "gray" | "info"} The color variant for the tag component
 */
function sanctionTagColor(value: string): "error" | "warning" | "gray" | "info" {
	const v = value.toLowerCase();
	if (v === "bloquer") return "error";
	if (v.startsWith("bloquer ")) return "warning";
	if (v === "masquer") return "info";
	if (v.startsWith("signalement")) return "gray";
	return "gray";
}

/**
 * YouTube sanctions reference page adapted to the active Livecon level (read-only).
 * Sanctions panel reflects the current Livecon without modification controls.
 * @returns {JSX.Element} YouTube sanctions panel
 */
export default function SanctionsYouTubePage() {
	// State
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [refModalOpen, setRefModalOpen] = useState(false);

	const livecon = CURRENT_LIVECON;
	const currentConfig = LIVECON_CONFIG[livecon];

	/**
	 * Toggles a sanction card open or closed.
	 * @param {string} id - Sanction type ID to toggle
	 * @returns {void}
	 */
	function toggleCard(id: string) {
		setExpandedId((prev) => (prev === id ? null : id));
	}

	return (
		<PageContainer
			title="Panel de Sanctions YouTube"
			description="Sanctions adaptees au Livecon actif — consultation uniquement"
		>
			{/* Top bar: Active consignes + Livecon logo + Reference button */}
			<div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
				<div className="mb-3 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
							Consignes actives
						</span>
						<button
							onClick={() => setRefModalOpen(true)}
							className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
						>
							<Icon name="info" size="xs" />
							Ref. niveaux
						</button>
					</div>

					{/* Small Livecon logo top-right */}
					<div className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1", currentConfig.bg)}>
						<span className={cn("h-2 w-2 rounded-full", currentConfig.dot)} />
						<span className={cn("text-xs font-bold", currentConfig.text)}>{currentConfig.label}</span>
					</div>
				</div>

				{/* Consignes list */}
				<ul className="space-y-1.5">
					{ACTIVE_CONSIGNES.map((consigne, idx) => (
						<li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
							<span className="bg-primary-400 mt-1 h-1 w-1 shrink-0 rounded-full" />
							{consigne}
						</li>
					))}
				</ul>
			</div>

			{/* Sanction cards — compact */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{SANCTION_TYPES.map((sanction) => {
					const isExpanded = expandedId === sanction.id;
					const row = sanction.sanctions[livecon];

					return (
						<div key={sanction.id} className={cn(isExpanded && "sm:col-span-2 lg:col-span-3")}>
							<Card
								hover={!isExpanded}
								padding="sm"
								onClick={() => toggleCard(sanction.id)}
								className="cursor-pointer transition-all duration-200"
							>
								{/* Compact card header */}
								<div className="flex items-center gap-2.5">
									<div
										className={cn(
											"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
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
										<Icon name={sanction.icon} size="sm" />
									</div>
									<div className="min-w-0 flex-1">
										<h3 className="text-xs font-semibold text-gray-900 dark:text-white">
											{sanction.title}
										</h3>
										{!isExpanded && (
											<p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
												1ere : <span className="font-medium">{row.first}</span>
											</p>
										)}
									</div>
									<Icon
										name={isExpanded ? "chevronUp" : "chevronDown"}
										size="xs"
										className="text-gray-400 dark:text-gray-500"
									/>
								</div>

								{/* Expanded — sanctions table */}
								{isExpanded && (
									<div className="mt-3 space-y-3">
										{sanction.fixed && (
											<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 flex items-start gap-2 rounded-lg border px-2.5 py-1.5">
												<Icon
													name="info"
													size="xs"
													className="text-warning-500 mt-0.5 shrink-0"
												/>
												<span className="text-warning-700 dark:text-warning-400 text-[10px]">
													Sanction identique quel que soit le Livecon.
												</span>
											</div>
										)}

										{/* Compact table */}
										<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
											<table className="w-full text-xs">
												<thead>
													<tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
														<th className="px-3 py-2 text-left text-[10px] font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
															1ere fois
														</th>
														<th className="px-3 py-2 text-left text-[10px] font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
															Recidive
														</th>
														<th className="px-3 py-2 text-left text-[10px] font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
															Multi-recidive
														</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td className="px-3 py-2">
															<Tag color={sanctionTagColor(row.first)}>{row.first}</Tag>
														</td>
														<td className="px-3 py-2">
															<Tag color={sanctionTagColor(row.repeat)}>{row.repeat}</Tag>
														</td>
														<td className="px-3 py-2">
															<Tag color={sanctionTagColor(row.multi)}>{row.multi}</Tag>
														</td>
													</tr>
												</tbody>
											</table>
										</div>

										{sanction.note && (
											<div className="border-info-200 bg-info-50 dark:border-info-800 dark:bg-info-900/10 flex items-start gap-2 rounded-lg border px-2.5 py-1.5">
												<Icon name="info" size="xs" className="text-info-500 mt-0.5 shrink-0" />
												<span className="text-info-700 dark:text-info-400 text-[10px]">
													{sanction.note}
												</span>
											</div>
										)}

										{/* Default reason — read-only */}
										<div>
											<label className="mb-1 block text-[10px] font-medium text-gray-400 dark:text-gray-500">
												Raison par defaut
											</label>
											<div className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
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

			{/* Reference levels modal */}
			<Modal
				isOpen={refModalOpen}
				onClose={() => setRefModalOpen(false)}
				title="Reference des niveaux Livecon"
				size="sm"
			>
				<div className="space-y-3">
					{([3, 2, 1] as LiveconLevel[]).map((level) => {
						const cfg = LIVECON_CONFIG[level];
						const isActive = level === CURRENT_LIVECON;
						return (
							<div
								key={level}
								className={cn(
									"rounded-lg border p-3",
									isActive
										? cn(cfg.bg, "border-current/10 ring-1", cfg.ring)
										: "border-gray-200 dark:border-gray-700",
								)}
							>
								<div className="flex items-center gap-2">
									<span className={cn("h-2.5 w-2.5 rounded-full", cfg.dot)} />
									<span className={cn("text-sm font-bold", cfg.text)}>{cfg.label}</span>
									{isActive && (
										<Badge variant={level === 3 ? "success" : level === 2 ? "warning" : "error"}>
											Actif
										</Badge>
									)}
								</div>
								<p className="mt-1 pl-4.5 text-xs text-gray-500 dark:text-gray-400">
									{cfg.description}
								</p>
							</div>
						);
					})}
				</div>
				<div className="mt-4">
					<Button variant="primary" onClick={() => setRefModalOpen(false)} className="w-full">
						Compris
					</Button>
				</div>
			</Modal>
		</PageContainer>
	);
}
