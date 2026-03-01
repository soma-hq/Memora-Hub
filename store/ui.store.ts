import { create } from "zustand";
import type { AbsenceMode } from "@/features/absences/absence-mode";


/** Represents a currently open modal with optional payload */
interface ModalState {
	id: string;
	data?: Record<string, unknown>;
}

/** Global UI state covering sidebar, modes, modals, and panels */
interface UIState {
	// Sidebar
	sidebarCollapsed: boolean;
	mobileSidebarOpen: boolean;
	toggleSidebar: () => void;
	setSidebarCollapsed: (collapsed: boolean) => void;
	setMobileSidebarOpen: (open: boolean) => void;

	// Admin mode
	adminMode: boolean;
	setAdminMode: (active: boolean) => void;
	toggleAdminMode: () => void;

	// Streamer mode
	streamerMode: boolean;
	setStreamerMode: (active: boolean) => void;
	toggleStreamerMode: () => void;

	// Absence mode
	absenceMode: AbsenceMode;
	setAbsenceMode: (mode: AbsenceMode) => void;

	// Search
	searchOpen: boolean;
	setSearchOpen: (open: boolean) => void;

	// Modals
	activeModals: ModalState[];
	openModal: (id: string, data?: Record<string, unknown>) => void;
	closeModal: (id: string) => void;
	isModalOpen: (id: string) => boolean;
	getModalData: (id: string) => Record<string, unknown> | undefined;

	// Command palette
	commandPaletteOpen: boolean;
	setCommandPaletteOpen: (open: boolean) => void;

	// Onboarding
	showOnboarding: boolean;
	setShowOnboarding: (show: boolean) => void;
}

/**
 * Zustand store for all global UI state including sidebar, modes, and modals.
 * @returns {UIState} Complete UI state with all actions
 */

export const useUIStore = create<UIState>((set, get) => ({
	// Sidebar controls
	sidebarCollapsed: false,
	mobileSidebarOpen: false,

	/** Toggles the sidebar collapsed state */
	toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

	/**
	 * Set the sidebar collapsed state
	 * @param collapsed - Whether the sidebar is collapsed
	 */

	setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

	/**
	 * Set mobile sidebar visibility
	 * @param open - Whether the mobile sidebar is open
	 */

	setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

	// Admin mode controls
	adminMode: false,

	/**
	 * Set admin mode
	 * @param active - Whether admin mode is active
	 */

	setAdminMode: (active) => set({ adminMode: active }),

	/** Toggles admin mode on or off */
	toggleAdminMode: () => set((s) => ({ adminMode: !s.adminMode })),

	// Streamer mode controls
	streamerMode: false,

	/**
	 * Set streamer mode
	 * @param active - Whether streamer mode is active
	 */

	setStreamerMode: (active) => set({ streamerMode: active }),

	/** Toggles streamer mode on or off */
	toggleStreamerMode: () => set((s) => ({ streamerMode: !s.streamerMode })),

	// Absence mode control
	absenceMode: "none",

	/**
	 * Set absence mode
	 * @param mode - Target absence mode
	 */

	setAbsenceMode: (mode) => set({ absenceMode: mode }),

	// Search panel
	searchOpen: false,

	/**
	 * Set search modal visibility
	 * @param open - Whether search is open
	 */

	setSearchOpen: (open) => set({ searchOpen: open }),

	// Modal management
	activeModals: [],

	/**
	 * Open a modal by ID
	 * @param id - Modal identifier
	 * @param data - Optional modal payload
	 */

	openModal: (id, data) =>
		set((s) => ({
			activeModals: [...s.activeModals.filter((m) => m.id !== id), { id, data }],
		})),

	/**
	 * Close a modal by ID
	 * @param id - Modal identifier
	 */

	closeModal: (id) =>
		set((s) => ({
			activeModals: s.activeModals.filter((m) => m.id !== id),
		})),

	/**
	 * Check if a modal is open
	 * @param id - Modal identifier
	 * @returns True if the modal is open
	 */

	isModalOpen: (id) => get().activeModals.some((m) => m.id === id),

	/**
	 * Get modal data payload
	 * @param id - Modal identifier
	 * @returns Modal data or undefined
	 */

	getModalData: (id) => get().activeModals.find((m) => m.id === id)?.data,

	// Command palette
	commandPaletteOpen: false,

	/**
	 * Set command palette visibility
	 * @param open - Whether the command palette is open
	 */

	setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

	// Onboarding
	showOnboarding: false,

	/**
	 * Set onboarding overlay visibility
	 * @param show - Whether to show onboarding
	 */

	setShowOnboarding: (show) => set({ showOnboarding: show }),
}));
