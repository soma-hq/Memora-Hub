"use client";

// Components
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { ProjectViewMode } from "../types";


/** Props for the ProjectViewToggle component */
interface ProjectViewToggleProps {
	mode: ProjectViewMode;
	onChange: (mode: ProjectViewMode) => void;
	className?: string;
}

/**
 * Toggle button group for switching between grid and kanban views
 * @param props - Component props
 * @param props.mode - Currently active view mode
 * @param props.onChange - Callback when view mode changes
 * @param props.className - Additional CSS classes
 * @returns Two-button toggle for view mode selection
 */
export function ProjectViewToggle({ mode, onChange, className }: ProjectViewToggleProps) {
	// Render
	return (
		<div className={cn("flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700", className)}>
			<button
				type="button"
				onClick={() => onChange("grid")}
				className={cn(
					"flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150",
					mode === "grid"
						? "bg-primary-500 text-white shadow-sm"
						: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
				)}
			>
				<Icon name="folder" size="xs" />
				Grille
			</button>
			<button
				type="button"
				onClick={() => onChange("kanban")}
				className={cn(
					"flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150",
					mode === "kanban"
						? "bg-primary-500 text-white shadow-sm"
						: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
				)}
			>
				<Icon name="tasks" size="xs" />
				Kanban
			</button>
		</div>
	);
}
