"use client";

// React
import { useEffect, useCallback } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { SearchModal } from "@/components/modals/search-modal";
import { ErrorBoundary } from "@/components/error-boundary";
import { AlertBanner } from "@/features/admin/alerts/components/alert-banner";
import { TutorialOverlay } from "@/features/academy/scripts/tutorial/tutorial-overlay";
import { AssistantModal } from "@/features/system/assistant/components/assistant-modal";
import { MissedEventsModal } from "@/components/modals/missed-events-modal";
import { Icon } from "@/components/ui";
import { useUIStore } from "@/store/ui.store";
import { useDataStore } from "@/store/data.store";

/**
 * Protected layout providing sidebar, header and mobile navigation for authenticated pages.
 * @param props - Component props
 * @param props.children - Nested page content
 * @returns The protected section layout with navigation shell
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const searchOpen = useUIStore((s) => s.searchOpen);
	const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);
	const setSearchOpen = useUIStore((s) => s.setSearchOpen);
	const currentUser = useDataStore((s) => s.currentUser);
	const setCurrentUser = useDataStore((s) => s.setCurrentUser);
	const users = useDataStore((s) => s.users);

	// Initialize demo user on first protected page load
	useEffect(() => {
		if (!currentUser && users.length > 0) {
			setCurrentUser(users[0].id);
		}
	}, [currentUser, setCurrentUser, users]);

	/**
	 * Handles Cmd+P / Ctrl+P keyboard shortcut to open search.
	 * @param e - The keyboard event
	 * @returns void
	 */
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") {
				e.preventDefault();
				setSearchOpen(true);
			}
		},
		[setSearchOpen],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	// Handlers
	const openMobileSidebar = useCallback(() => setMobileSidebarOpen(true), [setMobileSidebarOpen]);
	const openSearch = useCallback(() => setSearchOpen(true), [setSearchOpen]);
	const closeSearch = useCallback(() => setSearchOpen(false), [setSearchOpen]);

	// Render
	return (
		<div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
			<header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-3 lg:hidden dark:border-gray-700 dark:bg-gray-800">
				<button
					onClick={openMobileSidebar}
					aria-label="Menu"
					className="rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
				>
					<Icon name="menu" size="md" />
				</button>
				<div className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
					Memora
				</div>
				<button
					onClick={openSearch}
					aria-label="Rechercher"
					className="rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
				>
					<Icon name="search" size="md" />
				</button>
			</header>
			<div className="flex flex-1">
				<Sidebar />
				<main className="flex-1 pb-16 lg:pr-[108px] lg:pb-0">
					<ErrorBoundary>{children}</ErrorBoundary>
				</main>
				<RightSidebar onSearchOpen={openSearch} />
			</div>
			<MobileNav />
			<MobileSidebar />
			<SearchModal isOpen={searchOpen} onClose={closeSearch} />
			<AssistantModal />
			<MissedEventsModal />
			<AlertBanner />
			<TutorialOverlay />
		</div>
	);
}
