"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Icon, Badge, SectionHeaderBanner } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "[groupId]/legacy",
	section: "legacy",
	description: "Vue Legacy de l'espace de gestion.",
});

void PAGE_CONFIG;

interface LegacyCategory {
	id: string;
	title: string;
	icon: IconName;
	description: string;
	items: LegacyCategoryItem[];
}

interface LegacyCategoryItem {
	label: string;
	href: string;
	icon: IconName;
	count?: number;
	status?: "ok" | "warning" | "error";
}

interface LegacyStat {
	label: string;
	value: string;
	icon: IconName;
	trend?: "up" | "down";
	trendValue?: string;
}

const STATS: LegacyStat[] = [
	{ label: "Membres actifs", value: "19", icon: "users", trend: "up", trendValue: "+2" },
	{ label: "Projets en cours", value: "7", icon: "folder", trend: "up", trendValue: "+1" },
	{ label: "Tâches ouvertes", value: "34", icon: "tasks", trend: "down", trendValue: "-5" },
	{ label: "Réunions planifiées", value: "3", icon: "calendar" },
];

const STATUS_VARIANT: Record<string, string> = {
	ok: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
	warning: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
	error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function LegacyEntityDashboardPage() {
	const params = useParams();
	const groupId = (params.groupId as string) ?? "default";
	const [expandedCat, setExpandedCat] = useState<string | null>("operations");

	const categories: LegacyCategory[] = [
		{
			id: "operations",
			title: "Opérations",
			icon: "tools",
			description: "Gestion des tâches, projets et opérations courantes.",
			items: [
				{ label: "Tâches", href: `/${groupId}/legacy/tasks`, icon: "tasks", count: 34, status: "warning" },
				{ label: "Projets", href: `/${groupId}/legacy/projects`, icon: "folder", count: 7 },
				{ label: "Réunions", href: `/${groupId}/legacy/meetings`, icon: "calendar", count: 3 },
			],
		},
		{
			id: "monitoring",
			title: "Supervision",
			icon: "shield",
			description: "Logs, historique des actions et suivi d'activité.",
			items: [
				{ label: "Logs", href: `/${groupId}/legacy/logs`, icon: "logs", status: "ok" },
				{ label: "Rôles & Accès", href: `/${groupId}/legacy/permissions`, icon: "lock" },
			],
		},
		{
			id: "organization",
			title: "Organisation",
			icon: "group",
			description: "Structure de l'équipe et gestion des squads.",
			items: [
				{ label: "Équipe", href: "/users", icon: "users", count: 19 },
				{ label: "Squads", href: "/groups", icon: "group" },
			],
		},
	];

	return (
		<PageContainer title="Legacy Dashboard" description="Vue d'ensemble des fonctionnalités Legacy">
			<div className="mx-auto max-w-5xl space-y-8">
				<SectionHeaderBanner
					icon="folder"
					title="Espace Legacy"
					description="Gestion des opérations, supervision et organisation de l'équipe."
					accentColor="orange-pastel"
				>
					<Badge variant="warning" showDot={false}>
						Legacy
					</Badge>
				</SectionHeaderBanner>

				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{STATS.map((stat) => (
						<div
							key={stat.label}
							className="rounded-xl border border-orange-200/50 bg-transparent p-4 transition-all duration-200 hover:border-orange-300 dark:border-orange-800/30 dark:hover:border-orange-700"
						>
							<div className="mb-3 flex items-center justify-between">
								<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
									<Icon name={stat.icon} size="sm" className="text-orange-500" />
								</div>
								{stat.trend && (
									<span
										className={cn(
											"flex items-center gap-0.5 text-xs font-semibold",
											stat.trend === "up"
												? "text-emerald-600 dark:text-emerald-400"
												: "text-red-500 dark:text-red-400",
										)}
									>
										<Icon name={stat.trend === "up" ? "trendUp" : "trendDown"} size="xs" />
										{stat.trendValue}
									</span>
								)}
							</div>
							<p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
							<p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{stat.label}</p>
						</div>
					))}
				</div>

				<div className="space-y-4">
					{categories.map((cat) => {
						const isExpanded = expandedCat === cat.id;

						return (
							<div
								key={cat.id}
								className={cn(
									"rounded-2xl border transition-all duration-200",
									isExpanded
										? "border-orange-200 bg-orange-50/30 dark:border-orange-800/40 dark:bg-orange-900/5"
										: "border-gray-200/60 bg-transparent dark:border-gray-700/40",
								)}
							>
								<button
									type="button"
									onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
									className="flex w-full items-center gap-4 p-5 text-left"
								>
									<div
										className={cn(
											"flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
											isExpanded
												? "bg-orange-100 dark:bg-orange-900/30"
												: "bg-gray-100 dark:bg-gray-800",
										)}
									>
										<Icon
											name={cat.icon}
											size="md"
											className={cn(
												"transition-colors",
												isExpanded ? "text-orange-500" : "text-gray-400 dark:text-gray-500",
											)}
										/>
									</div>
									<div className="flex-1">
										<h3
											className={cn(
												"text-sm font-bold",
												isExpanded
													? "text-orange-700 dark:text-orange-400"
													: "text-gray-900 dark:text-white",
											)}
										>
											{cat.title}
										</h3>
										<p className="text-xs text-gray-400 dark:text-gray-500">{cat.description}</p>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-[10px] text-gray-400 dark:text-gray-500">
											{cat.items.length} élément{cat.items.length > 1 ? "s" : ""}
										</span>
										<Icon
											name="chevronDown"
											size="xs"
											className={cn(
												"text-gray-400 transition-transform duration-300",
												isExpanded && "rotate-180",
											)}
										/>
									</div>
								</button>

								{isExpanded && (
									<div className="border-t border-orange-100 px-5 pb-5 dark:border-orange-900/20">
										<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
											{cat.items.map((item) => (
												<Link
													key={item.href}
													href={item.href}
													className={cn(
														"group flex items-center gap-3 rounded-xl border border-gray-200/60 p-4 transition-all duration-200",
														"bg-white hover:border-orange-200 hover:shadow-md",
														"dark:border-gray-700/40 dark:bg-gray-800/60 dark:hover:border-orange-700",
													)}
												>
													<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 transition-colors group-hover:bg-orange-100 dark:bg-orange-900/10 dark:group-hover:bg-orange-900/20">
														<Icon name={item.icon} size="sm" className="text-orange-500" />
													</div>
													<div className="flex-1">
														<span className="text-sm font-medium text-gray-900 dark:text-white">
															{item.label}
														</span>
													</div>

													{item.count !== undefined && (
														<span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
															{item.count}
														</span>
													)}

													{item.status && (
														<span
															className={cn(
																"rounded-full px-2 py-0.5 text-[10px] font-medium",
																STATUS_VARIANT[item.status],
															)}
														>
															{item.status === "ok"
																? "OK"
																: item.status === "warning"
																	? "Attention"
																	: "Erreur"}
														</span>
													)}

													<Icon
														name="chevronRight"
														size="xs"
														className="text-gray-300 transition-transform group-hover:translate-x-0.5 dark:text-gray-600"
													/>
												</Link>
											))}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</PageContainer>
	);
}
