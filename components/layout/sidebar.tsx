"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui";
import { usePermission } from "@/hooks/usePermission";
import { useHubStore } from "@/store/hub.store";
import { useUIStore } from "@/store/ui.store";
import { useTranslations } from "@/core/i18n";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


interface NavItem {
	label: string;
	href: string;
	icon: IconName;
	badge?: number;
}

interface NavSection {
	id: string;
	title?: string;
	items: NavItem[];
	adminOnly?: boolean;
	collapsible?: boolean;
}

const STORAGE_KEY = "memora-sidebar-collapsed-sections";

/**
 * Gets collapsed sections from storage.
 * @returns {Record<string, boolean>} Section collapse map
 */

function getCollapsedSections(): Record<string, boolean> {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

/**
 * Saves collapsed sections to storage.
 * @param {Record<string, boolean>} sections - Section collapse map
 */

function saveCollapsedSections(sections: Record<string, boolean>) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
	} catch {
		// Silent fail
	}
}

/**
 * Desktop sidebar navigation.
 * @returns {JSX.Element} Sidebar navigation
 */

export function Sidebar() {
	// State
	const pathname = usePathname();
	const { activeGroupId } = useHubStore();
	const { isAdmin } = usePermission();
	const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
	const toggleSidebar = useUIStore((s) => s.toggleSidebar);
	const adminMode = useUIStore((s) => s.adminMode);
	const t = useTranslations();
	const groupId = activeGroupId ?? "default";
	const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

	useEffect(() => {
		setCollapsedSections(getCollapsedSections());
	}, []);

	// Handlers

	/**
	 * Toggles section collapse.
	 * @param {string} sectionId - Section ID
	 */

	const toggleSection = useCallback((sectionId: string) => {
		setCollapsedSections((prev) => {
			const next = { ...prev, [sectionId]: !prev[sectionId] };
			saveCollapsedSections(next);
			return next;
		});
	}, []);

	// Computed

	const adminNav: NavSection[] = useMemo(
		() => [
			{
				id: "admin-overview",
				items: [{ label: "Admin Dashboard", href: "/admin", icon: "home" }],
			},
			{
				id: "admin-management",
				title: "Gestion",
				collapsible: true,
				items: [
					{ label: "Gestion des accès", href: "/admin/access", icon: "shield" },
					{ label: "Alertes", href: "/admin/alerts", icon: "alert" },
					{ label: "Corbeille", href: "/admin/trash", icon: "close" },
				],
			},
			{
				id: "admin-tools",
				title: "Outils",
				collapsible: true,
				items: [
					{ label: "Génération de liens", href: "/admin/links", icon: "globe" },
					{ label: "Statistiques", href: "/admin/stats", icon: "stats" },
					{ label: "Développeur", href: "/admin/dev", icon: "tools" },
				],
			},
			{
				id: "admin-entities",
				title: "Entités",
				collapsible: true,
				items: [
					{ label: "Squad", href: "/users", icon: "users" },
					{ label: "Groupes", href: "/admin/access", icon: "group" },
				],
			},
		],
		[],
	);

	const hubNav: NavSection[] = useMemo(
		() => [
			{
				id: "dashboard",
				items: [{ label: t.nav.dashboard, href: `/hub/${groupId}`, icon: "home" }],
			},
			{
				id: "personnel",
				title: t.nav.personnel,
				collapsible: true,
				items: [
					{ label: t.nav.personnelAbsences, href: `/hub/${groupId}/personnel/absences`, icon: "absence" },
					{ label: t.nav.personnelPlanning, href: `/hub/${groupId}/personnel/planning`, icon: "calendar" },
					{ label: t.nav.personnelProjects, href: `/hub/${groupId}/personnel/projects`, icon: "folder" },
					{ label: t.nav.personnelTasks, href: `/hub/${groupId}/personnel/tasks`, icon: "tasks" },
				],
			},
			{
				id: "legacy",
				title: "Legacy",
				collapsible: true,
				items: [
					{ label: "Logs", href: `/hub/${groupId}/logs`, icon: "logs" },
					{ label: t.nav.projects, href: `/hub/${groupId}/projects`, icon: "folder" },
					{ label: t.nav.tasks, href: `/hub/${groupId}/tasks`, icon: "tasks" },
					{ label: t.nav.meetings, href: `/hub/${groupId}/meetings`, icon: "calendar" },
					{ label: "Squad", href: "/users", icon: "users" },
					{ label: t.nav.groups, href: "/admin/access", icon: "group" },
					{ label: "Permissions", href: `/hub/${groupId}/permissions`, icon: "lock" },
					{ label: "Statistiques", href: "/stats", icon: "stats" },
				],
			},
			{
				id: "moderation",
				title: "Modération Discord",
				collapsible: true,
				items: [
					{ label: "Panel", href: `/hub/${groupId}/moderation`, icon: "shield" },
					{ label: "Centre d'informations", href: `/hub/${groupId}/moderation/centre-info`, icon: "info" },
					{ label: "Marsha Bot", href: `/hub/${groupId}/moderation/marsha-bot`, icon: "tools" },
					{ label: "Sanctions", href: `/hub/${groupId}/moderation/sanctions`, icon: "flag" },
					{ label: "Consignes", href: `/hub/${groupId}/moderation/consignes`, icon: "document" },
					{ label: "Politique", href: `/hub/${groupId}/moderation/politique`, icon: "lock" },
				],
			},
			{
				id: "mod-twitch",
				title: "Modération Twitch",
				collapsible: true,
				items: [
					{ label: "Panel", href: `/hub/${groupId}/mod-twitch`, icon: "shield" },
					{ label: "Centre d'informations", href: `/hub/${groupId}/mod-twitch/centre-info`, icon: "info" },
					{ label: "Sanctions", href: `/hub/${groupId}/mod-twitch/sanctions`, icon: "flag" },
					{ label: "Consignes", href: `/hub/${groupId}/mod-twitch/consignes`, icon: "document" },
					{ label: "Politique", href: `/hub/${groupId}/mod-twitch/politique`, icon: "lock" },
				],
			},
			{
				id: "mod-youtube",
				title: "Modération YouTube",
				collapsible: true,
				items: [
					{ label: "Panel", href: `/hub/${groupId}/mod-youtube`, icon: "shield" },
					{ label: "Centre d'informations", href: `/hub/${groupId}/mod-youtube/centre-info`, icon: "info" },
					{ label: "Sanctions", href: `/hub/${groupId}/mod-youtube/sanctions`, icon: "flag" },
					{ label: "Consignes", href: `/hub/${groupId}/mod-youtube/consignes`, icon: "document" },
					{ label: "Politique", href: `/hub/${groupId}/mod-youtube/politique`, icon: "lock" },
				],
			},
			{
				id: "mod-polyvalent",
				title: "Modération Polyvalent",
				collapsible: true,
				items: [
					{ label: "Panel", href: `/hub/${groupId}/mod-polyvalent`, icon: "shield" },
					{
						label: "Centre d'informations",
						href: `/hub/${groupId}/mod-polyvalent/centre-info`,
						icon: "info",
					},
					{ label: "Marsha Bot", href: `/hub/${groupId}/mod-polyvalent/marsha-bot`, icon: "tools" },
					{ label: "Sanctions", href: `/hub/${groupId}/mod-polyvalent/sanctions`, icon: "flag" },
					{ label: "Consignes", href: `/hub/${groupId}/mod-polyvalent/consignes`, icon: "document" },
					{ label: "Politique", href: `/hub/${groupId}/mod-polyvalent/politique`, icon: "lock" },
				],
			},
			{
				id: "momentum",
				title: "Momentum",
				collapsible: true,
				items: [
					{ label: t.nav.momentumLaunch, href: `/hub/${groupId}/momentum/launch`, icon: "sparkles" },
					{ label: t.nav.momentumSessions, href: `/hub/${groupId}/momentum/sessions`, icon: "training" },
					{ label: t.nav.momentumSpace, href: `/hub/${groupId}/momentum/space`, icon: "document" },
					{ label: t.nav.momentumManagement, href: `/hub/${groupId}/momentum/management`, icon: "shield" },
				],
			},
			{
				id: "talent",
				title: "Talent",
				collapsible: true,
				items: [
					{ label: t.nav.talentSessions, href: `/hub/${groupId}/recruitment`, icon: "recruitment" },
					{ label: t.nav.talentEspace, href: `/hub/${groupId}/recruitment/espace`, icon: "profile" },
					{ label: t.nav.talentConsignes, href: `/hub/${groupId}/recruitment/consignes`, icon: "document" },
					{ label: t.nav.talentCandidates, href: `/hub/${groupId}/recruitment/candidates`, icon: "users" },
					{ label: t.nav.talentResults, href: `/hub/${groupId}/recruitment/results`, icon: "stats" },
					{ label: t.nav.talentCalendar, href: `/hub/${groupId}/recruitment/calendar`, icon: "calendar" },
					{ label: t.nav.talentAdmin, href: `/hub/${groupId}/recruitment/admin`, icon: "shield" },
				],
			},
		],
		[groupId, t],
	);

	const mainNav = adminMode ? adminNav : hubNav;

	const filteredNav = mainNav.filter((section) => {
		if (section.adminOnly && !isAdmin) return false;
		return true;
	});

	/**
	 * Checks for active route in section.
	 * @param {NavSection} section - Section to check
	 * @returns {boolean} True if section is active
	 */

	const sectionHasActive = useCallback(
		(section: NavSection) => {
			return section.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
		},
		[pathname],
	);

	// Theme tokens

	const activeItemBg = adminMode
		? "bg-red-500/10 text-red-700 dark:bg-red-500/10 dark:text-red-400"
		: "bg-primary-500/10 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400";
	const activeIconColor = adminMode ? "text-red-500" : "text-primary-500";
	const activeSectionTitle = adminMode ? "text-red-600 dark:text-red-400" : "text-primary-600 dark:text-primary-400";
	const activeIndicator = adminMode ? "bg-red-500" : "bg-primary-500";
	const badgeColor = adminMode ? "bg-red-500" : "bg-primary-500";

	// Render

	return (
		<aside
			data-tutorial="sidebar"
			className={cn(
				"hidden shrink-0 transition-all duration-300 lg:flex",
				sidebarCollapsed ? "w-[72px] pl-3" : "w-[264px] pl-3",
			)}
		>
			<div
				className={cn(
					"my-3 flex flex-1 flex-col overflow-hidden rounded-2xl border transition-all duration-300",
					adminMode
						? "border-red-200/50 bg-gradient-to-b from-red-50/30 to-white dark:border-red-900/30 dark:from-red-950/10 dark:to-gray-900"
						: "border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900",
				)}
			>
				{/* Header with logo and toggle */}
				<div
					className={cn(
						"flex items-center border-b px-3 py-3",
						adminMode ? "border-red-100 dark:border-red-900/20" : "border-gray-100 dark:border-gray-800",
					)}
				>
					{!sidebarCollapsed && (
						<div className="flex flex-1 items-center gap-2.5">
							<Image
								src="/logos/memora-logo.png"
								alt="Memora"
								width={28}
								height={28}
								className="rounded-lg"
							/>
							<div className="flex flex-col">
								<span className="font-serif text-sm font-bold text-gray-900 dark:text-white">
									{adminMode ? "Owner" : "Hub"}
								</span>
								<span className="text-[10px] leading-none text-gray-400 dark:text-gray-500">
									v1.0.0
								</span>
							</div>
						</div>
					)}
					<button
						onClick={toggleSidebar}
						className={cn(
							"flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-all duration-200",
							"hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300",
							sidebarCollapsed && "mx-auto",
						)}
						title={sidebarCollapsed ? "Agrandir" : "Réduire"}
					>
						<Icon name={sidebarCollapsed ? "chevronRight" : "chevronLeft"} size="xs" />
					</button>
				</div>

				{/* Navigation */}
				<nav className="scrollbar-hide flex-1 overflow-y-auto px-2 py-2">
					{filteredNav.map((section, idx) => {
						const hasActive = sectionHasActive(section);
						const isCollapsed = section.collapsible && collapsedSections[section.id] && !hasActive;

						return (
							<div key={section.id}>
								{/* Divider */}
								{idx > 0 && section.title && (
									<div className="mx-2 my-2">
										<div
											className={cn(
												"h-px",
												adminMode
													? "bg-red-100 dark:bg-red-900/20"
													: "bg-gray-100 dark:bg-gray-800",
											)}
										/>
									</div>
								)}

								{/* Section header */}
								{section.title && !sidebarCollapsed && (
									<button
										type="button"
										onClick={() => section.collapsible && toggleSection(section.id)}
										className={cn(
											"group mb-0.5 flex w-full items-center justify-between rounded-md px-2.5 py-1.5",
											section.collapsible &&
												"cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
											!section.collapsible && "cursor-default",
										)}
									>
										<span
											className={cn(
												"text-[10px] font-bold tracking-widest uppercase",
												hasActive ? activeSectionTitle : "text-gray-400 dark:text-gray-500",
											)}
										>
											{section.title}
										</span>
										{section.collapsible && (
											<Icon
												name={isCollapsed ? "chevronRight" : "chevronDown"}
												size="xs"
												className={cn(
													"text-gray-300 transition-all duration-200 dark:text-gray-600",
													"opacity-0 group-hover:opacity-100",
													(isCollapsed || hasActive) && "opacity-100",
												)}
											/>
										)}
									</button>
								)}

								{/* Collapsed icon for sidebar collapsed mode with section title */}
								{section.title && sidebarCollapsed && (
									<div className="my-1 flex justify-center">
										<div
											className={cn(
												"h-px w-6",
												adminMode
													? "bg-red-200 dark:bg-red-800"
													: "bg-gray-200 dark:bg-gray-700",
											)}
										/>
									</div>
								)}

								{/* Section items */}
								{!isCollapsed && (
									<ul className="space-y-0.5">
										{section.items.map((item) => {
											const isActive =
												pathname === item.href || pathname.startsWith(item.href + "/");
											return (
												<li key={item.href}>
													<Link
														href={item.href}
														title={sidebarCollapsed ? item.label : undefined}
														className={cn(
															"group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-200",
															sidebarCollapsed && "justify-center px-2",
															isActive
																? activeItemBg
																: "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200",
														)}
													>
														{/* Active indicator bar */}
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
															size="sm"
															className={cn(
																"shrink-0 transition-colors duration-200",
																isActive
																	? activeIconColor
																	: "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300",
															)}
														/>
														{!sidebarCollapsed && (
															<span className="truncate">{item.label}</span>
														)}
														{!sidebarCollapsed && item.badge && item.badge > 0 && (
															<span
																className={cn(
																	"ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white",
																	badgeColor,
																)}
															>
																{item.badge}
															</span>
														)}
													</Link>
												</li>
											);
										})}
									</ul>
								)}
							</div>
						);
					})}
				</nav>
			</div>
		</aside>
	);
}
