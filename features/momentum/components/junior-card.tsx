"use client";

import { Card, Badge, Icon, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Junior } from "../types";
import { pimStatusVariantMap, dispositifVariantMap, periodVariantMap } from "../types";

// Props for the JuniorCard component
interface JuniorCardProps {
	junior: Junior;
	onClick: () => void;
}

/**
 * Junior summary card with progress
 * @param props.junior - Junior data
 * @param props.onClick - Card click handler
 * @returns Junior card
 */

export function JuniorCard({ junior, onClick }: JuniorCardProps) {
	// Computed
	const initial = junior.name.charAt(0).toUpperCase();
	const totalCompetencies = junior.fsi.competencies.length;
	const acquiredCompetencies = junior.fsi.competencies.filter((c) => c.level === "Acquise").length;
	const progressPercent = totalCompetencies > 0 ? (acquiredCompetencies / totalCompetencies) * 100 : 0;

	// Render
	return (
		<Card hover onClick={onClick} className="group">
			<div className="flex items-start gap-3">
				{/* Avatar initial */}
				<div
					className={cn(
						"flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
						"bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
					)}
				>
					{initial}
				</div>

				<div className="min-w-0 flex-1">
					<h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{junior.name}</h4>
					<p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">Ref. {junior.referent}</p>

					{/* Status badges */}
					<div className="mt-2 flex flex-wrap items-center gap-1.5">
						<Badge variant={dispositifVariantMap[junior.dispositif]} showDot={false}>
							{junior.dispositif}
						</Badge>
						<Badge variant={pimStatusVariantMap[junior.pimStatus]}>{junior.pimStatus}</Badge>
						<Badge variant={periodVariantMap[junior.currentPeriod]} showDot={false}>
							{junior.currentPeriod}
						</Badge>
					</div>

					<p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{junior.function}</p>

					{/* Competency progress */}
					<div className="mt-3">
						<ProgressBar
							value={acquiredCompetencies}
							max={totalCompetencies}
							label="Competences acquises"
							showValue
							size="sm"
							variant={progressPercent === 100 ? "success" : "primary"}
						/>
					</div>
				</div>
			</div>
		</Card>
	);
}
