"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { useUIStore } from "@/store/ui.store";
import { useHubStore } from "@/store/hub.store";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


interface NavItem {
	label: string;
	href: string;
	icon: IconName;
}

interface NavSection {
	id: string;
	title?: string;
	items: NavItem[];
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
 * Mobile sidebar overlay.
 * @returns {JSX.Element | null} Mobile sidebar or null
 */

export function MobileSidebar() {
	// State
	const pathname = usePathname();
	const isOpen = useUIStore((s) => s.mobileSidebarOpen);
	const setOpen = useUIStore((s) => s.setMobileSidebarOpen);
	const { activeGroupId } = useHubStore();
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

	if (!isOpen) return null;

	/**
	 * Closes the sidebar.
	 */

	const close = () => setOpen(false);

	// Computed
	const mainNav: NavSection[] = [
		{ id: "dashboard", items: [{ label: "Dashboard", href: `/hub/${groupId}`, icon: "home" }] },
		{
			id: "personnel",
			title: "Personnel",
			collapsible: true,
			items: [
				{ label: "Absences", href: `/hub/${groupId}/personnel/absences`, icon: "absence" },
				{ label: "Planning", href: `/hub/${groupId}/personnel/planning`, icon: "calendar" },
				{ label: "Mes projets", href: `/hub/${groupId}/personnel/projects`, icon: "folder" },
				{ label: "Mes tâches", href: `/hub/${groupId}/personnel/tasks`, icon: "tasks" },
			],
		},
		{
			id: "legacy",
			title: "Legacy",
			collapsible: true,
			items: [
				{ label: "Projets", href: `/hub/${groupId}/projects`, icon: "folder" },
				{ label: "Tâches", href: `/hub/${groupId}/tasks`, icon: "tasks" },
				{ label: "Réunions", href: `/hub/${groupId}/meetings`, icon: "calendar" },
				{ label: "Squad", href: "/users", icon: "users" },
				{ label: "Entités", href: "/admin/access", icon: "group" },
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
				{ label: "Centre d'informations", href: `/hub/${groupId}/mod-polyvalent/centre-info`, icon: "info" },
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
				{ label: "Lancement", href: `/hub/${groupId}/momentum/launch`, icon: "sparkles" },
				{ label: "Sessions PIM", href: `/hub/${groupId}/momentum/sessions`, icon: "training" },
				{ label: "Espace Momentum", href: `/hub/${groupId}/momentum/space`, icon: "document" },
				{ label: "Management", href: `/hub/${groupId}/momentum/management`, icon: "shield" },
			],
		},
		{
			id: "talent",
			title: "Talent",
			collapsible: true,
			items: [
				{ label: "Sessions", href: `/hub/${groupId}/recruitment`, icon: "recruitment" },
				{ label: "Mon espace", href: `/hub/${groupId}/recruitment/espace`, icon: "profile" },
				{ label: "Consignes", href: `/hub/${groupId}/recruitment/consignes`, icon: "document" },
				{ label: "Candidats", href: `/hub/${groupId}/recruitment/candidates`, icon: "users" },
				{ label: "Résultats", href: `/hub/${groupId}/recruitment/results`, icon: "stats" },
				{ label: "Calendrier", href: `/hub/${groupId}/recruitment/calendar`, icon: "calendar" },
				{ label: "Admin", href: `/hub/${groupId}/recruitment/admin`, icon: "shield" },
			],
		},
	];

	// Render
	return (
		<div className="fixed inset-0 z-50 lg:hidden">
			{/* Overlay */}
			<div className="fixed inset-0 z-0 bg-black/30 backdrop-blur-sm dark:bg-black/60" onClick={close} />

			{/* Panel */}
			<aside className="fixed inset-y-0 left-0 z-10 flex w-72 flex-col overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
					<span className="text-sm font-semibold text-gray-900 dark:text-white">Menu</span>
					<button
						onClick={close}
						className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
					>
						<Icon name="close" size="sm" />
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-3 py-3">
					{mainNav.map((section, idx) => {
						const hasActive = section.items.some(
							(item) => pathname === item.href || pathname.startsWith(item.href + "/"),
						);
						const isCollapsed = section.collapsible && collapsedSections[section.id] && !hasActive;

						return (
							<div key={section.id}>
								{idx > 0 && (
									<div className="mx-2 my-2">
										<div className="h-px bg-gray-100 dark:bg-gray-700/50" />
									</div>
								)}

								{section.title && (
									<button
										type="button"
										onClick={() => section.collapsible && toggleSection(section.id)}
										className={cn(
											"group mb-1.5 flex w-full items-center justify-between px-3 py-1",
											section.collapsible &&
												"cursor-pointer rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30",
										)}
									>
										<span
											className={cn(
												"text-xs font-semibold tracking-wider uppercase",
												hasActive
													? "text-primary-600 dark:text-primary-400"
													: "text-gray-500 dark:text-gray-400",
											)}
										>
											{section.title}
										</span>
										{section.collapsible && (
											<Icon
												name={isCollapsed ? "chevronRight" : "chevronDown"}
												size="xs"
												className="text-gray-400 dark:text-gray-500"
											/>
										)}
									</button>
								)}

								{!isCollapsed && (
									<ul className="space-y-0.5">
										{section.items.map((item) => {
											const isActive =
												pathname === item.href || pathname.startsWith(item.href + "/");
											return (
												<li key={item.href}>
													<Link
														href={item.href}
														onClick={close}
														className={cn(
															"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
															isActive
																? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
																: "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200",
														)}
													>
														<Icon
															name={item.icon}
															style={isActive ? "solid" : "outline"}
															size="md"
															className={cn(
																isActive
																	? "text-primary-500"
																	: "text-gray-500 dark:text-gray-400",
															)}
														/>
														{item.label}
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
			</aside>
		</div>
	);
}
