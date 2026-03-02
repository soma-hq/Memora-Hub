"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { usePermission } from "@/hooks/usePermission";
import { useHubStore } from "@/store/hub.store";
import { useUIStore } from "@/store/ui.store";
import { useTranslations } from "@/core/i18n";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";
import type { Module } from "@/core/config/capabilities";

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
	/** Module required for this section to be visible (Discord-style permission check) */
	requiredModule?: Module;
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
 * Desktop sidebar navigation with animated collapsible sections.
 * Pure navigation only — no branding. Mode titles live in the header bar.
 * @returns {JSX.Element} Sidebar navigation
 */

export function Sidebar() {
	// State
	const pathname = usePathname();
	const { activeGroupId } = useHubStore();
	const { isAdmin, canAccess, isOwner } = usePermission();
	const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
	const toggleSidebar = useUIStore((s) => s.toggleSidebar);
	const adminMode = useUIStore((s) => s.adminMode);
	const legacyMode = useUIStore((s) => s.legacyMode);
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
				requiredModule: "admin" as Module,
				items: [
					{ label: "Admin Dashboard", href: "/admin", icon: "home" },
				],
			},
			{
				id: "admin-management",
				title: "Gestion",
				collapsible: true,
				requiredModule: "admin" as Module,
				items: [
					{ label: "Gestion des acces", href: "/admin/access", icon: "shield" },
					{ label: "Alertes", href: "/admin/alerts", icon: "alert" },
					{ label: "Corbeille", href: "/admin/trash", icon: "close" },
				],
			},
			{
				id: "admin-tools",
				title: "Outils",
				collapsible: true,
				requiredModule: "admin" as Module,
				items: [
					{ label: "Generation de liens", href: "/admin/links", icon: "globe" },
					{ label: "Statistiques", href: "/admin/stats", icon: "stats" },
					{ label: "Developpeur", href: "/admin/dev", icon: "tools" },
				],
			},
			{
				id: "admin-entities",
				title: "Entites",
				collapsible: true,
				requiredModule: "admin" as Module,
				items: [
					{ label: "Squad", href: "/users", icon: "users" },
					{ label: "Groupes", href: "/admin/access", icon: "group" },
				],
			},
		],
		[],
	);

	const legacyNav: NavSection[] = useMemo(
		() => [
			{
				id: "legacy-overview",
				items: [
					{ label: "Legacy Dashboard", href: "/legacy", icon: "home" },
				],
			},
			{
				id: "legacy-operations",
				title: "Opérations",
				collapsible: true,
				items: [
					{ label: "Tâches", href: `/hub/${groupId}/tasks`, icon: "tasks" },
					{ label: "Projets", href: `/hub/${groupId}/projects`, icon: "folder" },
					{ label: "Réunions", href: `/hub/${groupId}/meetings`, icon: "calendar" },
				],
			},
			{
				id: "legacy-monitoring",
				title: "Supervision",
				collapsible: true,
				items: [
					{ label: "Logs", href: `/hub/${groupId}/logs`, icon: "logs" },
					{ label: "Rôles & Accès", href: `/hub/${groupId}/permissions`, icon: "lock" },
				],
			},
			{
				id: "legacy-organization",
				title: "Organisation",
				collapsible: true,
				items: [
					{ label: "Squad", href: "/users", icon: "users" },
					{ label: "Groupes", href: "/admin/accèss", icon: "group" },
				],
			},
		],
		[groupId],
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
				requiredModule: "personnel" as Module,
				items: [
					{ label: t.nav.personnelAbsences, href: `/hub/${groupId}/personnel/absences`, icon: "absence" },
					{ label: t.nav.personnelPlanning, href: `/hub/${groupId}/personnel/planning`, icon: "calendar" },
					{ label: t.nav.personnelProjects, href: `/hub/${groupId}/personnel/projects`, icon: "folder" },
					{ label: t.nav.personnelTasks, href: `/hub/${groupId}/personnel/tasks`, icon: "tasks" },
				],
			},
			{
				id: "moderation",
				title: "Moderation Discord",
				collapsible: true,
				requiredModule: "moderation_discord" as Module,
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
				title: "Moderation Twitch",
				collapsible: true,
				requiredModule: "moderation_twitch" as Module,
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
				title: "Moderation YouTube",
				collapsible: true,
				requiredModule: "moderation_youtube" as Module,
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
				title: "Moderation Polyvalent",
				collapsible: true,
				requiredModule: "moderation_polyvalent" as Module,
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
				requiredModule: "momentum" as Module,
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
				requiredModule: "talent" as Module,
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

	const mainNav = adminMode ? adminNav : legacyMode ? legacyNav : hubNav;

	const filteredNav = mainNav.filter((section) => {
		if (section.adminOnly && !isAdmin) return false;
		// Module-based permission check (Discord-style)
		if (section.requiredModule && !canAccess(section.requiredModule)) return false;
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

	// Theme tokens based on mode

	const activeItemBg = adminMode
		? "bg-red-500/10 text-red-700 dark:bg-red-500/10 dark:text-red-400"
		: legacyMode
			? "bg-orange-500/10 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
			: "bg-primary-500/10 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400";
	const activeIconColor = adminMode ? "text-red-500" : legacyMode ? "text-orange-500" : "text-primary-500";
	const activeSectionTitle = adminMode
		? "text-red-600 dark:text-red-400"
		: legacyMode
			? "text-orange-600 dark:text-orange-400"
			: "text-primary-600 dark:text-primary-400";
	const activeIndicator = adminMode ? "bg-red-500" : legacyMode ? "bg-orange-500" : "bg-primary-500";
	const badgeColor = adminMode ? "bg-red-500" : legacyMode ? "bg-orange-500" : "bg-primary-500";

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
					"sticky top-3 flex max-h-[calc(100vh-24px)] flex-col overflow-hidden rounded-2xl border transition-all duration-300",
					adminMode
						? "border-red-200/50 bg-white dark:border-red-900/30 dark:bg-gray-900"
						: legacyMode
							? "border-orange-200/50 bg-white dark:border-orange-900/30 dark:bg-gray-900"
							: "border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900",
				)}
			>
				{/* Collapse toggle only — no branding */}
				<div
					className={cn(
						"flex items-center border-b px-3 py-2.5",
						adminMode
							? "border-red-100 dark:border-red-900/20"
							: legacyMode
								? "border-orange-100 dark:border-orange-900/20"
								: "border-gray-100 dark:border-gray-800",
					)}
				>
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

				{/* Navigation - scrollable */}
				<nav className="scrollbar-hide flex-1 overflow-y-auto px-2 py-2">
					{filteredNav.map((section, idx) => {
						const hasActive = sectionHasActive(section);
						const isCollapsed = section.collapsible && !!collapsedSections[section.id];

						return (
							<div key={section.id}>
								{/* Divider */}
								{idx > 0 && section.title && (
									<div className="mx-2 my-2">
										<div className="h-px bg-gray-100 dark:bg-gray-800" />
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
												name="chevronDown"
												size="xs"
												className={cn(
													"text-gray-300 transition-all duration-300 dark:text-gray-600",
													"opacity-0 group-hover:opacity-100",
													(isCollapsed || hasActive) && "opacity-100",
													isCollapsed && "-rotate-90",
												)}
											/>
										)}
									</button>
								)}

								{/* Collapsed icon for sidebar collapsed mode with section title */}
								{section.title && sidebarCollapsed && (
									<div className="my-1 flex justify-center">
										<div className="h-px w-6 bg-gray-200 dark:bg-gray-700" />
									</div>
								)}

								{/* Section items with height animation */}
								<CollapsibleList isOpen={!isCollapsed}>
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
								</CollapsibleList>
							</div>
						);
					})}
				</nav>
			</div>
		</aside>
	);
}

/** Props for the CollapsibleList animation wrapper */
interface CollapsibleListProps {
	isOpen: boolean;
	children: React.ReactNode;
}

/**
 * Animated collapsible container that smoothly transitions height.
 * @param {CollapsibleListProps} props - Component props
 * @param {boolean} props.isOpen - Whether the content is expanded
 * @param {React.ReactNode} props.children - Content to show/hide
 * @returns {JSX.Element} Animated collapsible wrapper
 */

function CollapsibleList({ isOpen, children }: CollapsibleListProps) {
	const contentRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState<number | "auto">(isOpen ? "auto" : 0);
	const [isAnimating, setIsAnimating] = useState(false);
	const prevOpen = useRef(isOpen);

	// Measure and animate height changes
	useEffect(() => {
		if (prevOpen.current === isOpen) return;
		prevOpen.current = isOpen;

		const el = contentRef.current;
		if (!el) return;

		if (isOpen) {
			setHeight(0);
			setIsAnimating(true);
			requestAnimationFrame(() => {
				setHeight(el.scrollHeight);
				const onEnd = () => {
					setHeight("auto");
					setIsAnimating(false);
					el.removeEventListener("transitionend", onEnd);
				};
				el.addEventListener("transitionend", onEnd);
			});
		} else {
			setHeight(el.scrollHeight);
			setIsAnimating(true);
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setHeight(0);
					const onEnd = () => {
						setIsAnimating(false);
						el.removeEventListener("transitionend", onEnd);
					};
					el.addEventListener("transitionend", onEnd);
				});
			});
		}
	}, [isOpen]);

	return (
		<div
			ref={contentRef}
			style={{ height: typeof height === "number" ? `${height}px` : "auto" }}
			className={cn(
				"overflow-hidden transition-[height] duration-300 ease-in-out",
				!isOpen && !isAnimating && "hidden",
			)}
		>
			{children}
		</div>
	);
}
