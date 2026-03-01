"use client";

// React
import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Tag } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


// Constants & types
type Priority = "Haute" | "Moyenne" | "Standard";

interface Consigne {
	id: string;
	title: string;
	description: string;
	priority: Priority;
	activeSince: string;
}

const PRIORITY_BADGE_VARIANT: Record<Priority, "error" | "warning" | "neutral"> = {
	Haute: "error",
	Moyenne: "warning",
	Standard: "neutral",
};

const PRIORITY_ICON_COLOR: Record<Priority, string> = {
	Haute: "text-error-500",
	Moyenne: "text-warning-500",
	Standard: "text-gray-400 dark:text-gray-500",
};

// Mock current user — belongs to "Marsha Team" (NOT Legacy)
const CURRENT_USER = {
	name: "Alex M.",
	team: "Marsha Team",
	isLegacy: false,
};

/**
 * Twitch active moderation instructions page with expandable consigne cards.
 * @returns The Twitch consignes management view
 */
export default function TwitchConsignesPage() {
	const [consignes] = useState<Consigne[]>([]);
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [showPermissionNotice, setShowPermissionNotice] = useState(false);

	/**
	 * Toggles a consigne card expansion state.
	 * @param id - The consigne identifier to toggle
	 */
	function toggleCard(id: string) {
		setExpandedId((prev) => (prev === id ? null : id));
	}

	/**
	 * Shows the permission notice when a non-Legacy user tries to edit.
	 */
	function handleEditAttempt() {
		if (!CURRENT_USER.isLegacy) {
			setShowPermissionNotice(true);
			setTimeout(() => setShowPermissionNotice(false), 4000);
		}
	}

	return (
		<PageContainer title="Consignes Twitch" description="Consignes actives — modifiable par la Legacy uniquement">
			{/* Info banner */}
			<div className="border-info-200 bg-info-50 dark:border-info-800 dark:bg-info-900/10 mb-6 flex items-start gap-3 rounded-lg border p-4">
				<Icon name="info" size="md" className="text-info-500 mt-0.5 shrink-0" />
				<div>
					<p className="text-info-700 dark:text-info-400 text-sm font-medium">Zone a acces restreint</p>
					<p className="text-info-600 dark:text-info-500 mt-1 text-xs">
						Seuls les membres de la Legacy peuvent creer ou modifier les consignes. Les autres equipes ont
						un acces en lecture seule.
					</p>
				</div>
			</div>

			{/* Current user context */}
			<div className="mb-6 flex items-center gap-3">
				<div className="flex items-center gap-2">
					<div className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold">
						{CURRENT_USER.name.charAt(0)}
					</div>
					<span className="text-sm font-medium text-gray-900 dark:text-white">{CURRENT_USER.name}</span>
					<Badge variant="neutral" showDot={false}>
						{CURRENT_USER.team}
					</Badge>
				</div>
				<Tag color="warning">Lecture seule</Tag>
			</div>

			{/* Permission notice toast */}
			{showPermissionNotice && (
				<div className="border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-900/10 mb-4 flex items-center gap-2 rounded-lg border px-4 py-3">
					<Icon name="lock" size="sm" className="text-error-500 shrink-0" />
					<p className="text-error-700 dark:text-error-400 text-sm">
						Permission refusee — Seule la Legacy peut modifier les consignes. Vous etes connecte en tant que{" "}
						<strong>{CURRENT_USER.team}</strong>.
					</p>
				</div>
			)}

			{/* Consignes list */}
			<div className="space-y-4">
				{consignes.length === 0 && (
					<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 dark:border-gray-600">
						<Icon name="flag" size="xl" className="mb-3 text-gray-300 dark:text-gray-600" />
						<p className="text-sm text-gray-500 dark:text-gray-400">Aucune consigne active.</p>
					</div>
				)}

				{consignes.map((consigne) => {
					const isExpanded = expandedId === consigne.id;

					return (
						<Card
							key={consigne.id}
							padding={isExpanded ? "lg" : "md"}
							hover={!isExpanded}
							onClick={() => toggleCard(consigne.id)}
							className="transition-all duration-200"
						>
							{/* Header row */}
							<div className="flex items-start gap-3">
								{/* Priority indicator */}
								<div className="mt-0.5 shrink-0">
									<Icon
										name="flag"
										style="solid"
										size="md"
										className={PRIORITY_ICON_COLOR[consigne.priority]}
									/>
								</div>

								{/* Content */}
								<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-center gap-2">
										<h3 className="text-sm font-semibold text-gray-900 dark:text-white">
											{consigne.title}
										</h3>
										<Badge variant={PRIORITY_BADGE_VARIANT[consigne.priority]} showDot>
											{consigne.priority}
										</Badge>
									</div>

									{!isExpanded && (
										<p className="mt-1 line-clamp-1 text-xs text-gray-400 dark:text-gray-500">
											{consigne.description}
										</p>
									)}
								</div>

								{/* Expand / collapse indicator */}
								<div className="flex shrink-0 items-center gap-2">
									<span className="hidden text-xs text-gray-400 sm:inline dark:text-gray-500">
										Depuis le {consigne.activeSince}
									</span>
									<Icon
										name={isExpanded ? "chevronUp" : "chevronDown"}
										size="sm"
										className="text-gray-400 dark:text-gray-500"
									/>
								</div>
							</div>

							{/* Expanded body */}
							{isExpanded && (
								<div className="mt-4 space-y-4">
									{/* Full description */}
									<div className="rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
										<p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
											{consigne.description}
										</p>
									</div>

									{/* Meta row */}
									<div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
										<div className="flex items-center gap-1.5">
											<Icon name="calendar" size="xs" />
											<span>Active depuis le {consigne.activeSince}</span>
										</div>
										<div className="flex items-center gap-1.5">
											<Icon name="shield" size="xs" />
											<span>Emise par la Legacy</span>
										</div>
									</div>

									{/* Edit button (restricted) */}
									<div className="flex items-center justify-end border-t border-gray-200 pt-3 dark:border-gray-700">
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleEditAttempt();
											}}
											className={cn(
												"flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
												CURRENT_USER.isLegacy
													? "bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30"
													: "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500",
											)}
										>
											<Icon name="edit" size="xs" />
											Editer
											{!CURRENT_USER.isLegacy && (
												<Icon name="lock" size="xs" className="ml-0.5" />
											)}
										</button>
									</div>
								</div>
							)}
						</Card>
					);
				})}
			</div>

			{/* Footer note */}
			<div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
				{consignes.length} consigne{consignes.length > 1 ? "s" : ""} active
				{consignes.length > 1 ? "s" : ""}
				{" — "}Derniere mise a jour par la Legacy
			</div>
		</PageContainer>
	);
}
