"use client";

// React
import { createContext, useContext, useEffect, useState, useCallback } from "react";


type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
	theme: Theme;
	resolvedTheme: "light" | "dark";
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
	theme: "system",
	resolvedTheme: "light",
	setTheme: () => {},
});

/**
 * Hook to access the current theme and the setter.
 * @returns {ThemeContextValue} Current theme context value
 */
export function useTheme() {
	return useContext(ThemeContext);
}

/**
 * Detects the OS-level color scheme preference.
 * @returns {"light" | "dark"} System theme
 */
function getSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Applies the resolved theme to the document root class list.
 * @param {"light" | "dark"} resolved - Resolved theme to apply
 * @returns {void}
 */
function applyTheme(resolved: "light" | "dark") {
	const root = document.documentElement;
	if (resolved === "dark") {
		root.classList.add("dark");
	} else {
		root.classList.remove("dark");
	}
}

/**
 * Context provider that manages light/dark/system theme with localStorage persistence.
 * @param {{ children: React.ReactNode }} props - Component props
 * @param {React.ReactNode} props.children - Application tree
 * @returns {JSX.Element} Theme context provider
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
	// State
	const [theme, setThemeState] = useState<Theme>("system");
	const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
	const [mounted, setMounted] = useState(false);

	/**
	 * Resolves the actual display theme from a user preference.
	 * @param {Theme} t - User theme preference
	 * @returns {"light" | "dark"} Resolved theme
	 */
	const resolve = useCallback((t: Theme): "light" | "dark" => {
		if (t === "system") return getSystemTheme();
		return t;
	}, []);

	// Read stored theme on mount
	useEffect(() => {
		const stored = localStorage.getItem("memora-theme") as Theme | null;
		const initial = stored || "system";
		setThemeState(initial);
		const resolved = resolve(initial);
		setResolvedTheme(resolved);
		applyTheme(resolved);
		setMounted(true);
	}, [resolve]);

	// Listen for OS theme changes when in system mode
	useEffect(() => {
		if (theme !== "system") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		/**
		 * Reacts to OS color scheme changes.
		 * @returns {void}
		 */
		const handler = () => {
			const resolved = getSystemTheme();
			setResolvedTheme(resolved);
			applyTheme(resolved);
		};
		media.addEventListener("change", handler);
		return () => media.removeEventListener("change", handler);
	}, [theme]);

	/**
	 * Updates theme preference and persists to localStorage.
	 * @param {Theme} newTheme - New theme to apply
	 * @returns {void}
	 */
	const setTheme = useCallback(
		(newTheme: Theme) => {
			setThemeState(newTheme);
			localStorage.setItem("memora-theme", newTheme);
			const resolved = resolve(newTheme);
			setResolvedTheme(resolved);
			applyTheme(resolved);
		},
		[resolve],
	);

	// Prevent flash of wrong theme before mount
	if (!mounted) {
		return (
			<>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem("memora-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`,
					}}
				/>
				{children}
			</>
		);
	}

	// Render
	return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>;
}
