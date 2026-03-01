"use client";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Competency, CompetencyLevel } from "../types";
import { competencyLevelVariantMap, COMPETENCY_LEVELS } from "../types";


/** Props for the CompetencyGrid component */
interface CompetencyGridProps {
	competencies: Competency[];
	onLevelChange?: (competencyId: string, level: CompetencyLevel) => void;
	readOnly?: boolean;
}

/**
 * Competency grid with clickable level cycling
 * @param props.competencies - Competency items
 * @param props.onLevelChange - Level change callback
 * @param props.readOnly - Disables level cycling
 * @returns Competency list with level badges
 */

export function CompetencyGrid({ competencies, onLevelChange, readOnly = false }: CompetencyGridProps) {
	// Handlers
	/**
	 * Cycles a competency to its next level
	 * @param competency - Competency to cycle
	 */

	function handleCycleLevel(competency: Competency) {
		if (readOnly || !onLevelChange) return;

		const currentIndex = COMPETENCY_LEVELS.indexOf(competency.level);
		const nextIndex = (currentIndex + 1) % COMPETENCY_LEVELS.length;
		onLevelChange(competency.id, COMPETENCY_LEVELS[nextIndex]);
	}

	if (competencies.length === 0) {
		return <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">Aucune competence definie.</p>;
	}

	// Render
	return (
		<div className="grid gap-3">
			{competencies.map((competency) => (
				<div
					key={competency.id}
					className={cn(
						"flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700",
						"bg-white dark:bg-gray-800/50",
					)}
				>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-medium text-gray-900 dark:text-white">{competency.name}</p>
						<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{competency.description}</p>
						{competency.evaluatedBy && competency.evaluatedAt && (
							<p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
								Evalue par {competency.evaluatedBy} le{" "}
								{new Date(competency.evaluatedAt).toLocaleDateString("fr-FR")}
							</p>
						)}
					</div>

					{/* Level badge -- clickable in interactive mode */}
					<button
						type="button"
						onClick={() => handleCycleLevel(competency)}
						disabled={readOnly || !onLevelChange}
						className={cn(
							"shrink-0",
							!readOnly && onLevelChange && "cursor-pointer transition-transform hover:scale-105",
							(readOnly || !onLevelChange) && "cursor-default",
						)}
					>
						<Badge variant={competencyLevelVariantMap[competency.level]}>{competency.level}</Badge>
					</button>
				</div>
			))}
		</div>
	);
}
