"use client";

// React
import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


// Constants & types

type LiveconLevel = 1 | 2 | 3;

interface LiveconConfig {
	level: LiveconLevel;
	label: string;
	subtitle: string;
	description: string;
	color: {
		ring: string;
		bg: string;
		bgSoft: string;
		text: string;
		dot: string;
		border: string;
		selectedBorder: string;
		iconBg: string;
		iconText: string;
		glow: string;
		badge: string;
		badgeText: string;
		badgeDot: string;
	};
	consignes: string[];
}

const LIVECON_LEVELS: LiveconConfig[] = [
	{
		level: 3,
		label: "Livecon 3",
		subtitle: "Periode Normale",
		description:
			"Tout est normal sur Discord et Twitch, gestion habituelle. Mobilisation standard, reponses classiques, panel de sanction inchange sur les deux plateformes.",
		color: {
			ring: "ring-emerald-500/30",
			bg: "bg-emerald-500",
			bgSoft: "bg-emerald-50 dark:bg-emerald-900/20",
			text: "text-emerald-600 dark:text-emerald-400",
			dot: "bg-emerald-500",
			border: "border-emerald-200 dark:border-emerald-800",
			selectedBorder: "border-emerald-500 dark:border-emerald-500",
			iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
			iconText: "text-emerald-600 dark:text-emerald-400",
			glow: "shadow-emerald-500/20",
			badge: "bg-emerald-100 dark:bg-emerald-900/20",
			badgeText: "text-emerald-700 dark:text-emerald-400",
			badgeDot: "bg-emerald-500",
		},
		consignes: [
			"Panel de sanction standard en vigueur sur Discord et Twitch.",
			"Gestion habituelle des conflits entre membres sur les deux plateformes.",
			"Les moderateurs suivent la procedure classique pour les infractions Discord et les timeouts Twitch.",
			"Les membres de l'equipe peuvent apparaitre normalement sur le serveur Discord et le chat Twitch.",
			"Reponses dans un delai classique (24h max).",
		],
	},
	{
		level: 2,
		label: "Livecon 2",
		subtitle: "Vigilance renforcee",
		description:
			"Periode instable, drama a petite echelle sur Discord et/ou Twitch. Moderation plus stricte, panel durci, reduction d'apparition de l'equipe sur les deux plateformes.",
		color: {
			ring: "ring-amber-500/30",
			bg: "bg-amber-500",
			bgSoft: "bg-amber-50 dark:bg-amber-900/20",
			text: "text-amber-600 dark:text-amber-400",
			dot: "bg-amber-500",
			border: "border-amber-200 dark:border-amber-800",
			selectedBorder: "border-amber-500 dark:border-amber-500",
			iconBg: "bg-amber-100 dark:bg-amber-900/30",
			iconText: "text-amber-600 dark:text-amber-400",
			glow: "shadow-amber-500/20",
			badge: "bg-amber-100 dark:bg-amber-900/20",
			badgeText: "text-amber-700 dark:text-amber-400",
			badgeDot: "bg-amber-500",
		},
		consignes: [
			"Panel de sanction durci — tolerances reduites, sanctions plus rapides sur Discord et Twitch.",
			"Surveillance accrue des salons Discord (textuels et vocaux) et du chat Twitch.",
			"Reduction drastique de l'apparition de l'equipe sur les deux plateformes.",
			"Les moderateurs doivent prioriser la deescalade et eviter de nourrir le drama cross-plateforme.",
			"Signalement immediat de tout incident a la hierarchie, quelle que soit la plateforme d'origine.",
			"Reponses aux situations critiques en moins de 2 heures.",
		],
	},
	{
		level: 1,
		label: "Livecon 1",
		subtitle: "Periode critique",
		description:
			"Harcelement, drama a grande echelle affectant Discord et Twitch. Moderation tres stricte, bannissements definitifs frequents, interdiction totale d'apparition de l'equipe.",
		color: {
			ring: "ring-red-500/30",
			bg: "bg-red-500",
			bgSoft: "bg-red-50 dark:bg-red-900/20",
			text: "text-red-600 dark:text-red-400",
			dot: "bg-red-500",
			border: "border-red-200 dark:border-red-800",
			selectedBorder: "border-red-500 dark:border-red-500",
			iconBg: "bg-red-100 dark:bg-red-900/30",
			iconText: "text-red-600 dark:text-red-400",
			glow: "shadow-red-500/20",
			badge: "bg-red-100 dark:bg-red-900/20",
			badgeText: "text-red-700 dark:text-red-400",
			badgeDot: "bg-red-500",
		},
		consignes: [
			"Tolerance zero — tout manquement entraine un bannissement definitif sur les deux plateformes.",
			"Interdiction totale d'apparition de l'equipe de moderation sur Discord et Twitch.",
			"Les discussions liees au drama sont immediatement supprimees sur Discord et le chat Twitch.",
			"Les membres impliques dans le harcelement sont bannis sans avertissement, cross-plateforme.",
			"Verrouillage possible de certains salons Discord et activation du mode emote-only sur Twitch.",
			"Communication uniquement via les canaux officiels. Aucune declaration personnelle.",
			"Rapport detaille de chaque incident a Legacy dans l'heure, incluant la plateforme d'origine.",
		],
	},
];

/**
 * Cross-platform moderation panel page with Livecon vigilance level system.
 * @returns The Livecon level management dashboard for polyvalent moderation
 */
export default function ModPolyvalentPanelPage() {
	const [currentLevel, setCurrentLevel] = useState<LiveconLevel>(3);
	const [isLegacy, setIsLegacy] = useState(false);

	const activeConfig = LIVECON_LEVELS.find((l) => l.level === currentLevel)!;

	/**
	 * Changes the Livecon level if the user has Legacy access.
	 * @param level - The target Livecon level
	 */
	const handleLevelChange = (level: LiveconLevel) => {
		if (!isLegacy) return;
		setCurrentLevel(level);
	};

	return (
		<PageContainer title="Panel Polyvalent" description="Systeme Livecon — Niveaux de vigilance Twitch & Discord">
			{/* ------------------------------------------------------------------ */}
			{/* Platform indicator                                                 */}
			{/* ------------------------------------------------------------------ */}
			<div className="mb-6 flex items-center gap-2">
				<Badge variant="info" showDot={false}>
					Discord
				</Badge>
				<Badge variant="primary" showDot={false}>
					Twitch
				</Badge>
				<span className="text-xs text-gray-400 dark:text-gray-500">
					Ce panel couvre la moderation sur les deux plateformes simultanement.
				</span>
			</div>

			{/* Current status indicator */}
			<Card padding="lg" className="mb-8">
				<div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
					{/* Pulsing dot */}
					<div className="relative flex shrink-0 items-center justify-center">
						<span
							className={cn(
								"absolute h-16 w-16 animate-ping rounded-full opacity-20",
								activeConfig.color.bg,
							)}
						/>
						<span
							className={cn(
								"relative h-14 w-14 rounded-full shadow-lg ring-4",
								activeConfig.color.bg,
								activeConfig.color.ring,
								activeConfig.color.glow,
							)}
						/>
					</div>

					{/* Text */}
					<div className="flex-1 text-center sm:text-left">
						<div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeConfig.label}</h2>
							<span
								className={cn(
									"inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
									activeConfig.color.badge,
									activeConfig.color.badgeText,
								)}
							>
								<span className={cn("h-1.5 w-1.5 rounded-full", activeConfig.color.badgeDot)} />
								{activeConfig.subtitle}
							</span>
						</div>
						<p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
							{activeConfig.description}
						</p>
					</div>
				</div>
			</Card>

			{/* Legacy access toggle */}
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Icon name="shield" size="sm" className="text-gray-400" />
					<span className="text-sm text-gray-500 dark:text-gray-400">
						Seuls les membres{" "}
						<span className="font-semibold text-gray-700 dark:text-gray-200">Legacy+</span> peuvent modifier
						le niveau Livecon.
					</span>
				</div>
				<button
					type="button"
					onClick={() => setIsLegacy(!isLegacy)}
					className={cn(
						"relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200",
						isLegacy ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600",
					)}
				>
					<span
						className={cn(
							"inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
							isLegacy ? "translate-x-6" : "translate-x-1",
						)}
					/>
				</button>
			</div>

			{/* Level selector cards */}
			<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
				{LIVECON_LEVELS.map((config) => {
					const isActive = config.level === currentLevel;
					const canSelect = isLegacy;

					return (
						<button
							key={config.level}
							type="button"
							disabled={!canSelect}
							onClick={() => handleLevelChange(config.level)}
							className={cn(
								"group relative rounded-xl border-2 p-5 text-left transition-all duration-200",
								"bg-white dark:bg-gray-800",
								isActive
									? cn(config.color.selectedBorder, "shadow-md", config.color.glow)
									: "border-gray-200 dark:border-gray-700",
								canSelect &&
									!isActive &&
									"hover:border-gray-300 hover:shadow-sm dark:hover:border-gray-600",
								!canSelect && "cursor-not-allowed opacity-60",
							)}
						>
							{/* Active indicator */}
							{isActive && (
								<div className="absolute -top-2.5 right-4">
									<span
										className={cn(
											"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm",
											config.color.bg,
										)}
									>
										Actif
									</span>
								</div>
							)}

							{/* Level header */}
							<div className="mb-3 flex items-center gap-3">
								<div
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-lg",
										config.color.iconBg,
									)}
								>
									<Icon
										name={config.level === 3 ? "check" : config.level === 2 ? "warning" : "error"}
										style="solid"
										size="md"
										className={config.color.iconText}
									/>
								</div>
								<div>
									<h3 className="text-sm font-bold text-gray-900 dark:text-white">{config.label}</h3>
									<p className={cn("text-xs font-medium", config.color.text)}>{config.subtitle}</p>
								</div>
							</div>

							{/* Description */}
							<p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
								{config.description}
							</p>

							{/* Bottom colored bar */}
							<div
								className={cn(
									"mt-4 h-1 w-full rounded-full transition-opacity",
									config.color.bg,
									isActive ? "opacity-100" : "opacity-20",
								)}
							/>
						</button>
					);
				})}
			</div>

			{/* Active consignes */}
			<div>
				<div className="mb-4 flex items-center gap-2">
					<Icon name="flag" style="solid" size="md" className={activeConfig.color.iconText} />
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Consignes actives</h2>
					<Badge variant={currentLevel === 3 ? "success" : currentLevel === 2 ? "warning" : "error"}>
						{activeConfig.label}
					</Badge>
				</div>

				<Card padding="lg">
					<div className="space-y-3">
						{activeConfig.consignes.map((consigne, index) => (
							<div key={index} className="flex items-start gap-3">
								<div className="mt-1.5 shrink-0">
									<span className={cn("block h-2 w-2 rounded-full", activeConfig.color.dot)} />
								</div>
								<p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{consigne}</p>
							</div>
						))}
					</div>

					{/* Severity footer */}
					<div
						className={cn(
							"mt-6 flex items-center gap-3 rounded-lg border p-3",
							activeConfig.color.border,
							activeConfig.color.bgSoft,
						)}
					>
						<Icon
							name={currentLevel === 3 ? "info" : currentLevel === 2 ? "warning" : "error"}
							size="sm"
							className={activeConfig.color.iconText}
						/>
						<p className={cn("text-xs font-medium", activeConfig.color.text)}>
							{currentLevel === 3 &&
								"Situation stable — Aucune mesure extraordinaire requise sur Discord ni Twitch."}
							{currentLevel === 2 &&
								"Vigilance requise — Les moderateurs doivent appliquer les consignes renforcees immediatement sur les deux plateformes."}
							{currentLevel === 1 &&
								"Situation critique — Toutes les mesures d'urgence sont en vigueur sur Discord et Twitch. Aucune exception toleree."}
						</p>
					</div>
				</Card>
			</div>

			{/* All levels reference */}
			<div className="mt-8">
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Reference des niveaux</h2>
				<div className="space-y-4">
					{LIVECON_LEVELS.map((config) => (
						<Card key={config.level} padding="md">
							<div className="flex items-start gap-4">
								<div
									className={cn(
										"mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
										config.color.iconBg,
									)}
								>
									<Icon
										name={config.level === 3 ? "check" : config.level === 2 ? "warning" : "error"}
										style="solid"
										size="sm"
										className={config.color.iconText}
									/>
								</div>
								<div className="flex-1">
									<div className="mb-1 flex flex-wrap items-center gap-2">
										<h3 className="text-sm font-semibold text-gray-900 dark:text-white">
											{config.label}
										</h3>
										<span className={cn("text-xs font-medium", config.color.text)}>
											{config.subtitle}
										</span>
										{config.level === currentLevel && (
											<Badge variant="primary" showDot={false}>
												Actuel
											</Badge>
										)}
									</div>
									<p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
										{config.description}
									</p>
								</div>
							</div>
						</Card>
					))}
				</div>
			</div>
		</PageContainer>
	);
}
