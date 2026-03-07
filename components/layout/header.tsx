"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui";
import { useTheme } from "@/components/providers/theme-provider";
import { EntityModal } from "@/components/modals/entity-modal";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { PatchnoteBell } from "@/features/patchnotes/components/patchnote-bell";
import { AdminModePopover } from "@/components/layout/admin-mode-popover";
import { LegacyModePopover } from "@/components/layout/legacy-mode-popover";
import { StreamerModePopover } from "@/components/layout/streamer-mode-popover";
import { AssistantButton } from "@/features/assistant/components/assistant-button";
import { AssistantModal } from "@/features/assistant/components/assistant-modal";
import { useUIStore } from "@/store/ui.store";
import { useHubStore } from "@/store/hub.store";
import { useDataStore } from "@/store/data.store";
import { ROLE_LABELS } from "@/core/config/roles";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showError } from "@/lib/utils/toast";
import { logoutAction } from "@/features/auth/actions";

interface HeaderProps {
	onMobileMenuToggle?: () => void;
	onSearchOpen?: () => void;
}

/**
 * App header with mode-aware title
 * @param {HeaderProps} props - Component props
 * @param {() => void} [props.onMobileMenuToggle] - Mobile sidebar toggle callback
 * @param {() => void} [props.onSearchOpen] - Search modal open callback
 * @returns {JSX.Element} Application header
 */

export function Header({ onMobileMenuToggle, onSearchOpen }: HeaderProps) {
	// State
	const pathname = usePathname();
	const router = useRouter();
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [entityModalOpen, setEntityModalOpen] = useState(false);
	const userRef = useRef<HTMLDivElement>(null);
	const adminMode = useUIStore((s) => s.adminMode);
	const legacyMode = useUIStore((s) => s.legacyMode);
	const activeGroupId = useHubStore((s) => s.activeGroupId);
	const setActiveGroup = useHubStore((s) => s.setActiveGroup);
	const entities = useDataStore((s) => s.entities);
	const getEntitiesForCurrentUser = useDataStore((s) => s.getEntitiesForCurrentUser);
	const currentUser = useDataStore((s) => s.currentUser);
	const [showChatbotBubble, setShowChatbotBubble] = useState(() => {
		if (typeof window === "undefined") return false;
		return localStorage.getItem("memora-chatbot-bubble-dismissed") !== "true";
	});
	const accessibleEntities = getEntitiesForCurrentUser();
	const fallbackEntityId = activeGroupId ?? accessibleEntities[0]?.id ?? entities[0]?.id ?? "default";

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	// Cycles light/dark/system themes
	const cycleTheme = () => {
		if (theme === "light") setTheme("dark");
		else if (theme === "dark") setTheme("system");
		else setTheme("light");
	};

	/**
	 * Clears session and redirects
	 * @returns {Promise<void>} Resolves on logout
	 * @throws {Error} If logout fails
	 */

	const handleLogout = async () => {
		try {
			localStorage.removeItem("authToken");
			sessionStorage.clear();
			showSuccess("Déconnexion réussie.");
			await logoutAction();
		} catch {
			// logoutAction redirects to /login — this catch is a fallback
			showError("La connexion a échouée");
		}
	};

	// Dismisses chatbot bubble
	const dismissChatbotBubble = () => {
		setShowChatbotBubble(false);
		localStorage.setItem("memora-chatbot-bubble-dismissed", "true");
	};

	/**
	 * Resolve next route from selected entity.
	 * @param entityId - Selected entity ID
	 * @returns Target route path
	 */
	const resolveEntityRoutePath = (entityId: string): string => {
		if (pathname.startsWith("/hub/")) {
			const segments = pathname.split("/");
			if (segments.length >= 3) {
				segments[2] = entityId;
				return segments.join("/");
			}
		}

		return `/hub/${entityId}`;
	};

	/**
	 * Handle entity selection from modal.
	 * @param entityId - Selected entity ID
	 * @returns void
	 */
	const handleEntitySelect = (entityId: string): void => {
		const selectedEntity = entities.find((entity) => entity.id === entityId);
		setActiveGroup(entityId, selectedEntity?.name ?? entityId);
		router.push(resolveEntityRoutePath(entityId));
	};

	// Computed
	const themeIcon = resolvedTheme === "dark" ? "moon" : "sun";
	const themeLabel = theme === "system" ? "Système" : theme === "dark" ? "Sombre" : "Clair";

	// Render
	return (
		<>
			<header
				className={cn(
					"sticky top-0 z-40 flex h-16 items-center justify-between border-b px-4 transition-colors duration-300 md:px-6",
					adminMode
						? "border-red-200 bg-white dark:border-red-900/40 dark:bg-gray-800"
						: legacyMode
							? "border-orange-200 bg-white dark:border-orange-900/40 dark:bg-gray-800"
							: "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
				)}
			>
				{/* Left: Mobile menu + Mode title */}
				<div className="flex items-center gap-3">
					<button
						onClick={onMobileMenuToggle}
						aria-label="Menu"
						className="rounded-lg p-3 text-gray-500 transition-all duration-200 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700"
					>
						<Icon name="menu" size="md" />
					</button>

					<div className="flex items-center gap-2.5">
						<Image
							src="/logos/memora-logo.png"
							alt="Memora"
							width={32}
							height={32}
							className={cn(
								"rounded-lg transition-all duration-300",
								adminMode && "ring-2 ring-red-500",
								legacyMode && "ring-2 ring-orange-500",
							)}
						/>
						<div className="flex items-center gap-1.5">
							{adminMode ? (
								<span className="text-2xl font-black tracking-tight text-red-500 transition-colors duration-300">
									OWNER
								</span>
							) : legacyMode ? (
								<>
									<span className="hidden text-lg font-medium text-gray-500 transition-colors duration-300 sm:inline dark:text-gray-400">
										Memora
									</span>
									<span className="text-2xl font-black tracking-tight text-orange-500 transition-colors duration-300">
										LEGACY
									</span>
								</>
							) : (
								<>
									<span className="hidden text-lg font-medium text-gray-500 transition-colors duration-300 sm:inline dark:text-gray-400">
										Memora
									</span>
									<span className="text-xl font-bold text-gray-900 transition-colors duration-300 dark:text-white">
										SQUAD
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Right: Icon actions */}
				<div className="flex items-center gap-1">
					<AdminModePopover />
					<LegacyModePopover />
					<StreamerModePopover />

					{/* Chat link */}
					<Link
						href={`/hub/${fallbackEntityId}/chat`}
						title="Chat"
						aria-label="Chat"
						className="rounded-lg p-3 text-gray-500 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
					>
						<Icon name="chat" size="md" />
					</Link>

					{/* Assistant (Chatbot) with info bubble */}
					<div className="relative" data-tutorial="assistant">
						<AssistantButton />
						{showChatbotBubble && (
							<div className="animate-fade-in absolute top-full right-0 z-50 mt-2 w-64">
								<div className="relative rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
									<div className="absolute -top-2 right-4 h-4 w-4 rotate-45 border-t border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />
									<div className="flex items-start gap-2">
										<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
											<Icon name="sparkles" size="xs" className="text-rose-400" />
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-300">
											Salut, je suis Memora AI, tu as besoin d&apos;aide sur quelque chose ?
										</p>
										<button
											onClick={dismissChatbotBubble}
											aria-label="Fermer"
											className="shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
										>
											<Icon name="close" size="xs" />
										</button>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Entity selector */}
					<button
						onClick={() => setEntityModalOpen(true)}
						title="Changer d'entité"
						aria-label="Changer d'entité"
						className="rounded-lg p-3 text-gray-500 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
					>
						<Icon name="group" size="md" />
					</button>

					{/* Search */}
					<button
						onClick={onSearchOpen}
						title="Rechercher (Ctrl+K)"
						aria-label="Rechercher"
						className="rounded-lg p-3 text-gray-500 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
						data-tutorial="search"
					>
						<Icon name="search" size="md" />
					</button>

					<div data-tutorial="patchnotes">
						<PatchnoteBell />
					</div>
					<div data-tutorial="notifications">
						<NotificationBell />
					</div>

					{/* Theme toggle */}
					<button
						onClick={cycleTheme}
						title={`Thème : ${themeLabel}`}
						aria-label={`Thème : ${themeLabel}`}
						className={cn(
							"rounded-lg p-3 text-gray-500 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
							theme === "system" && "ring-primary-300 ring-1 ring-offset-1 dark:ring-offset-gray-800",
						)}
					>
						<Icon name={themeIcon} size="md" />
					</button>

					{/* Profile / User menu */}
					<div ref={userRef} className="relative" data-tutorial="profile">
						<button
							onClick={() => setUserMenuOpen(!userMenuOpen)}
							className="flex items-center gap-2 rounded-lg p-1.5 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
								<Icon name="profile" size="sm" className="text-gray-500 dark:text-gray-300" />
							</div>
							<div className="hidden flex-col items-start md:flex">
								<span className="text-sm font-medium text-gray-700 dark:text-gray-200">
									{currentUser?.pseudo ?? "Utilisateur"}
								</span>
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{currentUser ? ROLE_LABELS[currentUser.roleId] : ""}
								</span>
							</div>
							<Icon
								name="chevronDown"
								size="xs"
								className="hidden text-gray-500 md:block dark:text-gray-400"
							/>
						</button>

						{/* User dropdown */}
						{userMenuOpen && (
							<div className="animate-slide-in absolute top-full right-0 z-50 mt-2 w-56 max-w-[calc(100vw-1rem)] rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
								<div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										{currentUser?.pseudo ?? "Utilisateur"}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{currentUser?.email ?? ""}
									</p>
								</div>
								<div className="p-1.5">
									{[
										{
											label: "Profil",
											icon: "profile" as const,
											href: "/profile",
										},
										{
											label: "Paramètres",
											icon: "settings" as const,
											href: "/settings/account",
										},
									].map((item) => (
										<a
											key={item.href}
											href={item.href}
											className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
										>
											<Icon name={item.icon} size="sm" />
											{item.label}
										</a>
									))}
								</div>
								<div className="border-t border-gray-200 p-1.5 dark:border-gray-700">
									<button
										onClick={() => {
											setUserMenuOpen(false);
											handleLogout();
										}}
										className="text-error-600 hover:bg-error-50 dark:hover:bg-error-900/10 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
									>
										<Icon name="logout" size="sm" />
										Se déconnecter
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</header>

			{/* Entity selection modal */}
			<EntityModal
				isOpen={entityModalOpen}
				onClose={() => setEntityModalOpen(false)}
				activeEntityId={fallbackEntityId}
				onSelect={handleEntitySelect}
			/>

			{/* AI Assistant modal */}
			<AssistantModal />
		</>
	);
}
