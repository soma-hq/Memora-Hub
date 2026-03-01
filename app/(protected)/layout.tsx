"use client";

// React
import { useEffect, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { SearchModal } from "@/components/modals/search-modal";
import { ErrorBoundary } from "@/components/error-boundary";
import { UpdateAnnouncement } from "@/features/patchnotes/components/update-announcement";
import { AlertBanner } from "@/features/alerts/components/alert-banner";
import { TutorialOverlay } from "@/scripts/tutorial/tutorial-overlay";
import { useUIStore } from "@/store/ui.store";


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

	/**
	 * Handles Cmd+K / Ctrl+K keyboard shortcut to toggle search.
	 * @param e - The keyboard event
	 * @returns void
	 */
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setSearchOpen(!searchOpen);
			}
		},
		[searchOpen, setSearchOpen],
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
			<Header onMobileMenuToggle={openMobileSidebar} onSearchOpen={openSearch} />
			<div className="flex flex-1">
				<Sidebar />
				<main className="flex-1 pb-16 lg:pb-0">
					<ErrorBoundary>{children}</ErrorBoundary>
				</main>
			</div>
			<MobileNav />
			<MobileSidebar />
			<SearchModal isOpen={searchOpen} onClose={closeSearch} />
			<UpdateAnnouncement />
			<AlertBanner />
			<TutorialOverlay />
		</div>
	);
}
