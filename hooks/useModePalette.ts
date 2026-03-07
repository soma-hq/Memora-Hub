"use client";

import { useMemo } from "react";
import { useUIStore } from "@/store/ui.store";

/** Mode-aware UI palette used across dashboard and layout surfaces */
interface ModePalette {
	mode: "owner" | "legacy" | "default";
	sectionAccent: "red-pastel" | "orange-pastel" | "gray-pastel";
	linkClass: string;
	chipClass: string;
	sidebarShellClass: string;
	sidebarBorderClass: string;
	sidebarActiveItemClass: string;
	sidebarActiveIconClass: string;
	sidebarActiveIndicatorClass: string;
	sidebarActiveSectionClass: string;
	sidebarBadgeClass: string;
	bubbleBorderClass: string;
	bubbleIconWrapClass: string;
	bubbleIconClass: string;
	bubbleActionClass: string;
}

/**
 * Resolves visual tokens from current mode.
 * @returns Mode-specific palette
 */
export function useModePalette(): ModePalette {
	const adminMode = useUIStore((state) => state.adminMode);
	const legacyMode = useUIStore((state) => state.legacyMode);

	return useMemo<ModePalette>(() => {
		if (adminMode) {
			return {
				mode: "owner",
				sectionAccent: "red-pastel",
				linkClass: "text-red-500 hover:text-red-600",
				chipClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
				sidebarShellClass: "bg-red-50/75 dark:bg-red-950/40",
				sidebarBorderClass: "border-red-200/80 dark:border-red-900/40",
				sidebarActiveItemClass: "bg-red-100/90 text-red-700 dark:bg-red-900/30 dark:text-red-200",
				sidebarActiveIconClass: "text-red-600 dark:text-red-300",
				sidebarActiveIndicatorClass: "bg-red-400",
				sidebarActiveSectionClass: "text-red-500 dark:text-red-300",
				sidebarBadgeClass: "bg-red-500",
				bubbleBorderClass: "border-red-200/90 dark:border-red-800/60",
				bubbleIconWrapClass: "bg-red-100 dark:bg-red-900/30",
				bubbleIconClass: "text-red-500 dark:text-red-300",
				bubbleActionClass: "text-red-600 hover:text-red-700 dark:text-red-300",
			};
		}

		if (legacyMode) {
			return {
				mode: "legacy",
				sectionAccent: "orange-pastel",
				linkClass: "text-orange-500 hover:text-amber-600",
				chipClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
				sidebarShellClass: "bg-orange-50/80 dark:bg-orange-950/35",
				sidebarBorderClass: "border-orange-200/80 dark:border-orange-900/40",
				sidebarActiveItemClass: "bg-orange-100/90 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200",
				sidebarActiveIconClass: "text-orange-600 dark:text-orange-300",
				sidebarActiveIndicatorClass: "bg-orange-400",
				sidebarActiveSectionClass: "text-orange-500 dark:text-orange-300",
				sidebarBadgeClass: "bg-orange-500",
				bubbleBorderClass: "border-orange-200/90 dark:border-orange-800/60",
				bubbleIconWrapClass: "bg-orange-100 dark:bg-orange-900/30",
				bubbleIconClass: "text-orange-500 dark:text-orange-300",
				bubbleActionClass: "text-orange-600 hover:text-orange-700 dark:text-orange-300",
			};
		}

		return {
			mode: "default",
			sectionAccent: "gray-pastel",
			linkClass: "text-slate-500 hover:text-slate-700 dark:text-slate-300",
			chipClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
			sidebarShellClass: "bg-slate-50/85 dark:bg-slate-900/65",
			sidebarBorderClass: "border-slate-200/90 dark:border-slate-700/50",
			sidebarActiveItemClass: "bg-slate-200/70 text-slate-800 dark:bg-slate-700/50 dark:text-slate-100",
			sidebarActiveIconClass: "text-slate-700 dark:text-slate-200",
			sidebarActiveIndicatorClass: "bg-slate-500",
			sidebarActiveSectionClass: "text-slate-600 dark:text-slate-300",
			sidebarBadgeClass: "bg-slate-500",
			bubbleBorderClass: "border-slate-200/90 dark:border-slate-700/60",
			bubbleIconWrapClass: "bg-slate-100 dark:bg-slate-800",
			bubbleIconClass: "text-slate-600 dark:text-slate-300",
			bubbleActionClass: "text-slate-600 hover:text-slate-800 dark:text-slate-200",
		};
	}, [adminMode, legacyMode]);
}
