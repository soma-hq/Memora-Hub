"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { usePermission } from "@/hooks/usePermission";
import { useHubStore } from "@/store/hub.store";
import { useUIStore } from "@/store/ui.store";
import { useTranslations } from "@/core/i18n";
import { useModePalette } from "@/hooks/useModePalette";
import { AdminModePopover } from "@/components/layout/admin-mode-popover";
import { LegacyModePopover } from "@/components/layout/legacy-mode-popover";
import { StreamerModePopover } from "@/components/layout/streamer-mode-popover";
import { cn } from "@/lib/utils/cn";
import { getEntitySidebarBanner } from "@/core/design/entity-banners";
import type { IconName } from "@/core/design/icons";
import type { Module } from "@/core/config/capabilities";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
	label: string;
	href: string;
	icon: IconName;
	badge?: number;
	tooltip?: string;
}

interface NavSection {
	id: string;
	title?: string;
	items: NavItem[];
	adminOnly?: boolean;
	collapsible?: boolean;
	requiredModule?: Module;
}

// ─── Storage ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "memora-sidebar-collapsed-sections";

function getCollapsedSections(): Record<string, boolean> {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

function saveCollapsedSections(sections: Record<string, boolean>) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
	} catch {
		/* silent */
	}
}

// ─── Tooltip (appears after 2 seconds hover) ─────────────────────────────────

function NavTooltip({ text, children }: { text?: string; children: React.ReactNode }) {
	const [show, setShow] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleEnter = useCallback(() => {
		if (!text) return;
		timerRef.current = setTimeout(() => setShow(true), 2000);
	}, [text]);

	const handleLeave = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = null;
		setShow(false);
	}, []);

	useEffect(
		() => () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		},
		[],
	);

	return (
		<div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
			{children}
			{show && text && (
				<div className="pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 animate-[sidebarTooltipIn_180ms_ease-out_forwards]">
					<div className="relative max-w-[200px] rounded-lg border border-gray-700/80 bg-gray-800 px-3 py-2 text-xs leading-relaxed text-gray-300 shadow-xl">
						<div className="absolute top-1/2 -left-[5px] h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b border-l border-gray-700/80 bg-gray-800" />
						{text}
					</div>
				</div>
			)}
		</div>
	);
}

// ─── CollapsibleList ─────────────────────────────────────────────────────────

function CollapsibleList({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
	return (
		<div
			className={cn(
				"grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out",
				isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70",
			)}
		>
			<div className="overflow-hidden">{children}</div>
		</div>
	);
}

// ─── Main Sidebar ────────────────────────────────────────────────────────────

export function Sidebar() {
	const pathname = usePathname();
	const { activeGroupId } = useHubStore();
	const { isAdmin, canAccess } = usePermission();
	const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
	const toggleSidebar = useUIStore((s) => s.toggleSidebar);
	const adminMode = useUIStore((s) => s.adminMode);
	const legacyMode = useUIStore((s) => s.legacyMode);
	const palette = useModePalette();
	const t = useTranslations();
	const groupId = activeGroupId ?? "default";
	const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

	useEffect(() => {
		setCollapsedSections(getCollapsedSections());
	}, []);

	const toggleSection = useCallback((sectionId: string) => {
		setCollapsedSections((prev) => {
			const next = { ...prev, [sectionId]: !prev[sectionId] };
			saveCollapsedSections(next);
			return next;
		});
	}, []);

	// ── Navigation definitions ──────────────────────────────────────────────

	const adminNav: NavSection[] = useMemo(
		() => [
			{
				id: "admin-management",
				title: "Gestion",
				collapsible: true,
				requiredModule: "admin" as Module,
				items: [
					{
						label: "Accès",
						href: "/admin/access",
						icon: "shield",
						tooltip: "Gérer les rôles, permissions et accès utilisateurs",
					},
					{
						label: "Alertes",
						href: "/admin/alerts",
						icon: "alert",
						tooltip: "Notifications système et alertes de sécurité",
					},
					{
						label: "Corbeille",
						href: "/admin/trash",
						icon: "close",
						tooltip: "Éléments supprimés récupérables",
					},
				],
			},
			{
				id: "admin-tools",
				title: "Outils",
				collapsible: true,
				requiredModule: "admin" as Module,
				items: [
					{
						label: "Liens",
						href: "/admin/links",
						icon: "globe",
						tooltip: "Générer des liens d'invitation et de partage",
					},
					{
						label: "Stats",
						href: "/admin/stats",
						icon: "stats",
						tooltip: "Métriques d'utilisation et rapports",
					},
					{
						label: "Dev",
						href: "/admin/dev",
						icon: "tools",
						tooltip: "Outils de debug et configuration avancée",
					},
				],
			},
			{
				id: "admin-entities",
				title: "Squads",
				collapsible: true,
				requiredModule: "admin" as Module,
				items: [
					{ label: "Équipe", href: "/users", icon: "users", tooltip: "Membres et profils de l'équipe" },
					{
						label: "Squads",
						href: "/groups",
						icon: "group",
						tooltip: "Gestion des squads",
					},
				],
			},
		],
		[],
	);

	const legacyNav: NavSection[] = useMemo(
		() => [
			{
				id: "legacy-operations",
				title: "Opérations",
				collapsible: true,
				items: [
					{
						label: "Tâches",
						href: `/${groupId}/legacy/tasks`,
						icon: "tasks",
						tooltip: "Tâches assignées et en cours",
					},
					{
						label: "Projets",
						href: `/${groupId}/legacy/projects`,
						icon: "folder",
						tooltip: "Projets en cours et planifiés",
					},
					{
						label: "Réunions",
						href: `/${groupId}/legacy/meetings`,
						icon: "calendar",
						tooltip: "Réunions prévues et historique",
					},
				],
			},
			{
				id: "legacy-monitoring",
				title: "Supervision",
				collapsible: true,
				items: [
					{
						label: "Logs",
						href: `/${groupId}/legacy/logs`,
						icon: "logs",
						tooltip: "Journal d'activité et historique",
					},
					{
						label: "Accès",
						href: `/${groupId}/legacy/permissions`,
						icon: "lock",
						tooltip: "Matrice des permissions par rôle",
					},
				],
			},
			{
				id: "legacy-organization",
				title: "Organisation",
				collapsible: true,
				items: [
					{ label: "Équipe", href: "/users", icon: "users", tooltip: "Membres de l'équipe" },
					{ label: "Squads", href: "/admin/access", icon: "group", tooltip: "Groupes et squads" },
				],
			},
		],
		[groupId],
	);

	const hubNav: NavSection[] = useMemo(
		() => [
			{
				id: "personnel",
				title: t.nav.personnel,
				collapsible: true,
				requiredModule: "personnel" as Module,
				items: [
					{
						label: t.nav.personnelAbsences,
						href: `/hub/${groupId}/personnel/absences`,
						icon: "absence",
						tooltip: "Déclarer et consulter les absences",
					},
					{
						label: t.nav.personnelPlanning,
						href: `/hub/${groupId}/personnel/planning`,
						icon: "calendar",
						tooltip: "Planning de modération et emploi du temps",
					},
					{
						label: t.nav.personnelProjects,
						href: `/hub/${groupId}/personnel/projects`,
						icon: "folder",
						tooltip: "Tes projets personnels en cours",
					},
					{
						label: t.nav.personnelTasks,
						href: `/hub/${groupId}/personnel/tasks`,
						icon: "tasks",
						tooltip: "Tes tâches assignées à compléter",
					},
				],
			},
			{
				id: "moderation",
				title: "Mod. Discord",
				collapsible: true,
				requiredModule: "moderation_discord" as Module,
				items: [
					{
						label: "Centre d'infos",
						href: `/hub/${groupId}/moderation/centre-info`,
						icon: "info",
						tooltip: "Infos clés : échelle, tickets, tips",
					},
					{
						label: "Marsha Bot",
						href: `/hub/${groupId}/moderation/marsha-bot`,
						icon: "tools",
						tooltip: "Configuration et logs du bot",
					},
					{
						label: "Sanctions",
						href: `/hub/${groupId}/moderation/sanctions`,
						icon: "flag",
						tooltip: "Historique et gestion des sanctions",
					},
				],
			},
			{
				id: "mod-twitch",
				title: "Mod. Twitch",
				collapsible: true,
				requiredModule: "moderation_twitch" as Module,
				items: [
					{
						label: "Centre d'infos",
						href: `/hub/${groupId}/mod-twitch/centre-info`,
						icon: "info",
						tooltip: "Infos pour la modération live",
					},
					{
						label: "Sanctions",
						href: `/hub/${groupId}/mod-twitch/sanctions`,
						icon: "flag",
						tooltip: "Sanctions Twitch en cours et passées",
					},
				],
			},
			{
				id: "mod-youtube",
				title: "Mod. YouTube",
				collapsible: true,
				requiredModule: "moderation_youtube" as Module,
				items: [
					{
						label: "Centre d'infos",
						href: `/hub/${groupId}/mod-youtube/centre-info`,
						icon: "info",
						tooltip: "Guidelines YouTube",
					},
					{
						label: "Sanctions",
						href: `/hub/${groupId}/mod-youtube/sanctions`,
						icon: "flag",
						tooltip: "Sanctions YouTube",
					},
				],
			},
			{
				id: "mod-polyvalent",
				title: "Mod. Polyvalent",
				collapsible: true,
				requiredModule: "moderation_polyvalent" as Module,
				items: [
					{
						label: "Centre d'infos",
						href: `/hub/${groupId}/mod-polyvalent/centre-info`,
						icon: "info",
						tooltip: "Infos de modération transverses",
					},
					{
						label: "Marsha Bot",
						href: `/hub/${groupId}/mod-polyvalent/marsha-bot`,
						icon: "tools",
						tooltip: "Bot polyvalent Marsha",
					},
					{
						label: "Sanctions",
						href: `/hub/${groupId}/mod-polyvalent/sanctions`,
						icon: "flag",
						tooltip: "Sanctions polyvalentes",
					},
				],
			},
			{
				id: "momentum",
				title: "Momentum",
				collapsible: true,
				requiredModule: "momentum" as Module,
				items: [
					{
						label: t.nav.momentumLaunch,
						href: `/hub/${groupId}/momentum/launch`,
						icon: "sparkles",
						tooltip: "Lancer et gérer les sessions Momentum",
					},
					{
						label: t.nav.momentumSessions,
						href: `/hub/${groupId}/momentum/sessions`,
						icon: "training",
						tooltip: "Historique des sessions PIM",
					},
					{
						label: t.nav.momentumSpace,
						href: `/hub/${groupId}/momentum/space`,
						icon: "document",
						tooltip: "Espace de ressources Momentum",
					},
					{
						label: t.nav.momentumManagement,
						href: `/hub/${groupId}/momentum/management`,
						icon: "shield",
						tooltip: "Administration du système Momentum",
					},
				],
			},
			{
				id: "talent",
				title: "Talent",
				collapsible: true,
				requiredModule: "talent" as Module,
				items: [
					{
						label: t.nav.talentSessions,
						href: `/hub/${groupId}/recruitment`,
						icon: "recruitment",
						tooltip: "Sessions de recrutement actives",
					},
					{
						label: t.nav.talentEspace,
						href: `/hub/${groupId}/recruitment/espace`,
						icon: "profile",
						tooltip: "Ton espace recrutement personnel",
					},
					{
						label: t.nav.talentConsignes,
						href: `/hub/${groupId}/recruitment/consignes`,
						icon: "document",
						tooltip: "Consignes et process de recrutement",
					},
					{
						label: t.nav.talentCandidates,
						href: `/hub/${groupId}/recruitment/candidates`,
						icon: "users",
						tooltip: "Liste et suivi des candidats",
					},
					{
						label: t.nav.talentResults,
						href: `/hub/${groupId}/recruitment/results`,
						icon: "stats",
						tooltip: "Résultats et analytics",
					},
					{
						label: t.nav.talentCalendar,
						href: `/hub/${groupId}/recruitment/calendar`,
						icon: "calendar",
						tooltip: "Calendrier des entretiens",
					},
					{
						label: t.nav.talentAdmin,
						href: `/hub/${groupId}/recruitment/admin`,
						icon: "shield",
						tooltip: "Administration du module Talent",
					},
				],
			},
		],
		[groupId, t],
	);

	const mainNav = adminMode ? adminNav : legacyMode ? legacyNav : hubNav;
	const filteredNav = mainNav.filter((section) => {
		if (section.adminOnly && !isAdmin) return false;
		if (section.requiredModule && !canAccess(section.requiredModule)) return false;
		return true;
	});

	/**
	 * Check whether a nav item matches the current route.
	 * @param item - Navigation item to evaluate
	 * @returns True if item is active
	 */
	const isItemActive = useCallback(
		(item: NavItem): boolean => {
			const isHubRoot = /^\/hub\/[^/]+$/.test(item.href);
			const isLegacyRoot = /^\/[^/]+\/legacy$/.test(item.href);
			const isSinglePageRoot = item.href === "/admin" || isLegacyRoot;
			if (isHubRoot || isSinglePageRoot) {
				return pathname === item.href;
			}

			return pathname === item.href || pathname.startsWith(item.href + "/");
		},
		[pathname],
	);

	const sectionHasActive = useCallback(
		(section: NavSection) => section.items.some((item) => isItemActive(item)),
		[isItemActive],
	);

	// Theme tokens
	const activeItemBg = palette.sidebarActiveItemClass;
	const activeIconColor = palette.sidebarActiveIconClass;
	const activeSectionTitle = palette.sidebarActiveSectionClass;
	const activeIndicator = palette.sidebarActiveIndicatorClass;
	const badgeColor = palette.sidebarBadgeClass;
	const modeLabel = adminMode ? "OWNER" : legacyMode ? "LEGACY" : "SQUAD";
	const sidebarBanner = getEntitySidebarBanner(activeGroupId, adminMode);
	const modeTagClass =
		palette.mode === "owner"
			? "border-red-200/80 bg-red-100/80 text-red-700 dark:border-red-800/60 dark:bg-red-900/30 dark:text-red-200"
			: palette.mode === "legacy"
				? "border-orange-200/80 bg-orange-100/80 text-orange-700 dark:border-orange-800/60 dark:bg-orange-900/30 dark:text-orange-200"
				: "border-slate-200/80 bg-slate-100/80 text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-200";
	const dashboardHref = adminMode ? "/admin" : legacyMode ? `/${groupId}/legacy` : `/hub/${groupId}`;
	const isDashboardActive = pathname === dashboardHref;

	return (
		<>
			<style
				dangerouslySetInnerHTML={{
					__html: `@keyframes sidebarTooltipIn { from { opacity: 0; transform: translateX(-4px) translateY(-50%); } to { opacity: 1; transform: translateX(0) translateY(-50%); } }`,
				}}
			/>

			<aside
				data-tutorial="sidebar"
				className={cn(
					"relative hidden w-[264px] shrink-0 transition-all duration-300 lg:flex",
					"justify-start pl-4",
				)}
			>
				{/* Centered floating container */}
				<div
					className={cn(
						"fixed top-1/2 left-4 flex -translate-y-1/2 flex-col overflow-hidden rounded-2xl border",
						"transition-[width,box-shadow] duration-300",
						sidebarCollapsed ? "w-[84px]" : "w-[236px]",
						palette.sidebarBorderClass,
						palette.sidebarShellClass,
						"shadow-[0_18px_45px_-24px_rgba(15,23,42,0.55)]",
					)}
					style={{ maxHeight: "calc(100vh - 10px)" }}
				>
					{sidebarBanner && (
						<div
							className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.18]"
							style={{ backgroundImage: `url('${sidebarBanner}')` }}
						/>
					)}
					<div className="pointer-events-none absolute inset-0 bg-white/76 dark:bg-slate-950/74" />

					{/* Collapse toggle */}
					<button
						onClick={toggleSidebar}
						className={cn(
							"absolute top-1/2 -right-3 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition-all hover:scale-105 dark:bg-gray-900",
							palette.sidebarBorderClass,
						)}
						title={sidebarCollapsed ? "Agrandir" : "Réduire"}
					>
						<Icon
							name={sidebarCollapsed ? "chevronRight" : "chevronLeft"}
							size="xs"
							className="text-gray-500"
						/>
					</button>

					<div
						className={cn(
							"relative z-10 flex items-center justify-center border-b px-2.5 py-2",
							palette.sidebarBorderClass,
						)}
					>
						<div className={cn("flex items-center gap-2", sidebarCollapsed && "justify-center")}>
							{!sidebarCollapsed && (
								<span className="text-[11px] font-bold tracking-[0.22em] text-gray-500 uppercase dark:text-gray-300">
									Memora
								</span>
							)}
							<span
								className={cn(
									"rounded-full border px-2.5 py-1 text-[11px] font-extrabold tracking-[0.18em] uppercase",
									modeTagClass,
									sidebarCollapsed && "px-3",
								)}
							>
								{modeLabel}
							</span>
						</div>
					</div>

					<div
						className={cn(
							"relative z-10 flex items-center justify-center gap-1.5 px-2 py-2",
							palette.sidebarBorderClass,
						)}
					>
						<Link
							href={dashboardHref}
							title="Dashboards"
							className={cn(
								"rounded-lg p-2 transition-colors",
								isDashboardActive
									? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
									: "text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
							)}
						>
							<Icon name="home" size="sm" />
						</Link>
						<AdminModePopover />
						<LegacyModePopover />
						<StreamerModePopover />
					</div>

					{/* Navigation */}
					<nav
						aria-label="Navigation principale"
						className="scrollbar-hide relative z-10 flex-1 overflow-y-auto px-1.5 py-1.5"
					>
						{filteredNav.map((section, idx) => {
							const hasActive = sectionHasActive(section);
							const isCollapsed =
								section.collapsible && !!collapsedSections[section.id] && !sidebarCollapsed;

							return (
								<div
									key={section.id}
									className={cn(sidebarCollapsed ? "mb-2" : idx === 0 ? "mb-3" : "mt-3 mb-3")}
								>
									{section.title && !sidebarCollapsed && (
										<button
											type="button"
											onClick={() => section.collapsible && toggleSection(section.id)}
											className={cn(
												"group mb-1.5 flex w-full items-center justify-between rounded-md px-2 py-1",
												section.collapsible &&
													"cursor-pointer transition-colors hover:bg-gray-800/50",
												!section.collapsible && "cursor-default",
											)}
										>
											<span
												className={cn(
													"text-[10px] font-bold tracking-widest uppercase",
													hasActive ? activeSectionTitle : "text-gray-500",
												)}
											>
												{section.title}
											</span>
										</button>
									)}

									<div
										className={cn(
											"px-1",
											!sidebarCollapsed && "rounded-xl border px-1.5 py-1",
											!sidebarCollapsed && palette.sidebarBorderClass,
										)}
									>
										<CollapsibleList isOpen={sidebarCollapsed ? true : !isCollapsed}>
											<ul className="space-y-px">
												{section.items.map((item) => {
													const isActive = isItemActive(item);
													return (
														<li key={item.href}>
															<NavTooltip
																text={sidebarCollapsed ? item.label : item.tooltip}
															>
																<Link
																	href={item.href}
																	title={sidebarCollapsed ? item.label : undefined}
																	aria-current={isActive ? "page" : undefined}
																	className={cn(
																		"group relative flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium transition-all duration-200",
																		sidebarCollapsed &&
																			"mx-auto h-11 w-11 justify-center rounded-xl border border-gray-200/70 bg-white/80 px-0 shadow-sm dark:border-gray-700/70 dark:bg-gray-900/70",
																		isActive
																			? activeItemBg
																			: "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200",
																	)}
																>
																	{isActive && !sidebarCollapsed && (
																		<span
																			className={cn(
																				"absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-r-full",
																				activeIndicator,
																			)}
																		/>
																	)}

																	<Icon
																		name={item.icon}
																		style={isActive ? "solid" : "outline"}
																		size={sidebarCollapsed ? "md" : "sm"}
																		className={cn(
																			"shrink-0 transition-colors duration-200",
																			isActive
																				? activeIconColor
																				: "text-gray-500 group-hover:text-gray-300",
																		)}
																	/>
																	{!sidebarCollapsed && (
																		<span className="truncate">{item.label}</span>
																	)}
																	{!sidebarCollapsed &&
																		item.badge &&
																		item.badge > 0 && (
																			<span
																				className={cn(
																					"ml-auto flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white",
																					badgeColor,
																				)}
																			>
																				{item.badge}
																			</span>
																		)}
																</Link>
															</NavTooltip>
														</li>
													);
												})}
											</ul>
										</CollapsibleList>
									</div>
								</div>
							);
						})}
					</nav>
				</div>
			</aside>
		</>
	);
}
