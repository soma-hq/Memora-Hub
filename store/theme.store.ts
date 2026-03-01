import { create } from "zustand";


/** Available theme modes */
type Theme = "light" | "dark" | "system";

// State and actions for theme management
interface ThemeStore {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

/**
 * Zustand store managing the application theme preference.
 * @returns {ThemeStore} Theme state and setter
 */

export const useThemeStore = create<ThemeStore>((set) => ({
	theme: "light",

	/**
	 * Set the theme
	 * @param theme - Target theme mode
	 */

	setTheme: (theme) => set({ theme }),
}));
