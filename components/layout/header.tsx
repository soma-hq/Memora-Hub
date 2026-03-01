"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { useTheme } from "@/components/providers/theme-provider";
import { EntityModal } from "@/components/modals/entity-modal";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { PatchnoteBell } from "@/features/patchnotes/components/patchnote-bell";
import { AdminModePopover } from "@/components/layout/admin-mode-popover";
import { StreamerModePopover } from "@/components/layout/streamer-mode-popover";
import { AssistantButton } from "@/features/assistant/components/assistant-button";
import { AssistantModal } from "@/features/assistant/components/assistant-modal";
import { useUIStore } from "@/store/ui.store";
import { useHubStore } from "@/store/hub.store";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showError } from "@/lib/utils/toast";


interface HeaderProps {
	onMobileMenuToggle?: () => void;
	onSearchOpen?: () => void;
}

/**
 * App header.
 * @param {HeaderProps} props - Component props
 * @param {() => void} [props.onMobileMenuToggle] - Mobile sidebar toggle callback
 * @param {() => void} [props.onSearchOpen] - Search modal open callback
 * @returns {JSX.Element} Application header
 */

export function Header({ onMobileMenuToggle, onSearchOpen }: HeaderProps) {
	// State
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [entityModalOpen, setEntityModalOpen] = useState(false);
	const [activeEntityId, setActiveEntityId] = useState("bazalthe");
	const userRef = useRef<HTMLDivElement>(null);
	const adminMode = useUIStore((s) => s.adminMode);
	const activeGroupId = useHubStore((s) => s.activeGroupId);
	const [showChatbotBubble, setShowChatbotBubble] = useState(false);

	useEffect(() => {
		setShowChatbotBubble(localStorage.getItem("memora-chatbot-bubble-dismissed") !== "true");
	}, []);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	// Handlers
	/**
	 * Cycles light/dark/system themes.
	 */

	const cycleTheme = () => {
		if (theme === "light") setTheme("dark");
		else if (theme === "dark") setTheme("system");
		else setTheme("light");
	};

	/**
	 * Clears session and redirects.
	 * @returns {Promise<void>} Resolves on logout
	 * @throws {Error} If logout fails
	 */

	const handleLogout = async () => {
		try {
			document.cookie = "memora-session=; path=/; max-age=0";
			localStorage.removeItem("authToken");
			sessionStorage.clear();
			showSuccess("Deconnexion reussie.");
			window.location.href = "/login";
		} catch (error) {
			showError("Erreur lors de la deconnexion.");
		}
	};

	/**
	 * Dismisses chatbot bubble.
	 */

	const dismissChatbotBubble = () => {
		setShowChatbotBubble(false);
		localStorage.setItem("memora-chatbot-bubble-dismissed", "true");
	};

	// Computed
	const themeIcon = resolvedTheme === "dark" ? "moon" : "sun";
	const themeLabel = theme === "system" ? "Systeme" : theme === "dark" ? "Sombre" : "Clair";

	// Render
	return (
		<>
			<header
				className={cn(
					"sticky top-0 z-40 flex h-16 items-center justify-between border-b px-4 transition-colors duration-300 md:px-6",
					adminMode
						? "border-red-200 bg-white dark:border-red-900/40 dark:bg-gray-800"
						: "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
				)}
			>
				{/* Left: Mobile menu + Logo */}
				<div className="flex items-center gap-3">
					<button
						onClick={onMobileMenuToggle}
						className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700"
					>
						<Icon name="menu" size="md" />
					</button>

					<div className="flex items-center gap-2">
						<Image
							src="/logos/memora-logo.png"
							alt="Memora"
							width={32}
							height={32}
							className={cn("rounded-lg transition-all duration-300", adminMode && "ring-2 ring-red-500")}
						/>
						<span
							className={cn(
								"hidden font-serif text-xl font-bold transition-colors duration-300 sm:block",
								adminMode ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white",
							)}
						>
							{adminMode ? "Memora Owner" : "Memora Hub"}
						</span>
					</div>
				</div>

				{/* Right: Icon actions */}
				<div className="flex items-center gap-1">
					<AdminModePopover />
					<StreamerModePopover />

					{/* Chat link */}
					<Link
						href={`/hub/${activeGroupId}/chat`}
						title="Chat"
						className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
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
											Salut, je suis ton ChatBot, tu as besoin d&apos;aide ?
										</p>
										<button
											onClick={dismissChatbotBubble}
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
						title="Changer d'entite"
						className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
					>
						<Icon name="group" size="md" />
					</button>

					{/* Search */}
					<button
						onClick={onSearchOpen}
						title="Rechercher (Ctrl+K)"
						className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
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
						title={`Theme : ${themeLabel}`}
						className={cn(
							"rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
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
									Utilisateur
								</span>
								<span className="text-xs text-gray-500 dark:text-gray-400"></span>
							</div>
							<Icon
								name="chevronDown"
								size="xs"
								className="hidden text-gray-500 md:block dark:text-gray-400"
							/>
						</button>

						{/* User dropdown */}
						{userMenuOpen && (
							<div className="animate-slide-in absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
								<div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
									<p className="text-sm font-medium text-gray-900 dark:text-white">Utilisateur</p>
									<p className="text-xs text-gray-500 dark:text-gray-400"></p>
								</div>
								<div className="p-1.5">
									{[
										{
											label: "Mon profil",
											icon: "profile" as const,
											href: "/profile",
										},
										{
											label: "Parametres",
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
										Se deconnecter
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
				activeEntityId={activeEntityId}
				onSelect={(id) => setActiveEntityId(id)}
			/>

			{/* AI Assistant modal */}
			<AssistantModal />
		</>
	);
}
