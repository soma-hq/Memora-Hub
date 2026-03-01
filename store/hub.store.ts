import { create } from "zustand";


/** State and actions for the active hub group */
interface HubStore {
	activeGroupId: string | null;
	activeGroupName: string | null;
	setActiveGroup: (id: string, name: string) => void;
	clearActiveGroup: () => void;
}

/**
 * Zustand store tracking the currently selected hub group.
 * @returns {HubStore} Hub state with active group data and actions
 */

export const useHubStore = create<HubStore>((set) => ({
	activeGroupId: null,
	activeGroupName: null,

	/**
	 * Set the active group
	 * @param id - Group identifier
	 * @param name - Group display name
	 */

	setActiveGroup: (id, name) => set({ activeGroupId: id, activeGroupName: name }),

	/** Clears the active group selection */
	clearActiveGroup: () => set({ activeGroupId: null, activeGroupName: null }),
}));
