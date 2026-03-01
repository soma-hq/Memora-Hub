"use client";

import { Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Candidate, CandidateDecision } from "../types";
import { decisionVariantMap } from "../types";


/** Column definition for the recruitment kanban board */
interface KanbanColumn {
	id: CandidateDecision;
	label: string;
	headerColor: string;
	borderColor: string;
}

/** Kanban column definitions with styling per decision status */
const COLUMNS: KanbanColumn[] = [
	{
		id: "En attente",
		label: "En attente",
		headerColor: "bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400",
		borderColor: "border-warning-200 dark:border-warning-800",
	},
	{
		id: "Favorable",
		label: "Favorable",
		headerColor: "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400",
		borderColor: "border-success-200 dark:border-success-800",
	},
	{
		id: "Défavorable",
		label: "Defavorable",
		headerColor: "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400",
		borderColor: "border-error-200 dark:border-error-800",
	},
	{
		id: "Accepté",
		label: "Accepte",
		headerColor: "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400",
		borderColor: "border-primary-200 dark:border-primary-800",
	},
	{
		id: "Refusé",
		label: "Refuse",
		headerColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
		borderColor: "border-gray-200 dark:border-gray-700",
	},
];

/** Props for the KanbanBoard component */
interface KanbanBoardProps {
	candidates: Candidate[];
	onCandidateClick?: (candidate: Candidate) => void;
	className?: string;
}

/**
 * Candidates organized by decision status
 * @param props.candidates - Candidates to display
 * @param props.onCandidateClick - Card click callback
 * @param props.className - Extra CSS classes
 * @returns Multi-column kanban board
 */

export function KanbanBoard({ candidates, onCandidateClick, className }: KanbanBoardProps) {
	// Computed
	/**
	 * Filters candidates by decision
	 * @param decision - Decision to filter by
	 * @returns Matching candidates
	 */

	const getCandidatesForColumn = (decision: CandidateDecision) => {
		return candidates.filter((c) => c.finalDecision === decision);
	};

	// Render
	return (
		<div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
			{COLUMNS.map((column) => {
				const columnCandidates = getCandidatesForColumn(column.id);
				return (
					<div
						key={column.id}
						className={cn("flex min-w-[240px] flex-1 flex-col rounded-xl border", column.borderColor)}
					>
						{/* Column header */}
						<div
							className={cn(
								"flex items-center justify-between rounded-t-xl px-4 py-3",
								column.headerColor,
							)}
						>
							<span className="text-sm font-semibold">{column.label}</span>
							<span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/60 px-1.5 text-xs font-bold dark:bg-black/20">
								{columnCandidates.length}
							</span>
						</div>

						{/* Column body */}
						<div className="flex flex-1 flex-col gap-2 bg-gray-50/50 p-3 dark:bg-gray-900/30">
							{columnCandidates.length > 0 ? (
								columnCandidates.map((candidate) => (
									<div
										key={candidate.id}
										onClick={() => onCandidateClick?.(candidate)}
										className={cn(
											"rounded-lg border border-gray-200 bg-white p-3 transition-all dark:border-gray-700 dark:bg-gray-800",
											onCandidateClick && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md",
										)}
									>
										<div className="mb-2 flex items-center gap-2">
											<div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
												{candidate.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</div>
											<span className="text-sm font-medium text-gray-900 dark:text-white">
												{candidate.name}
											</span>
										</div>

										<p className="mb-2 text-xs text-gray-400 dark:text-gray-500">
											{candidate.formId}
										</p>

										<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
											<span className="inline-flex items-center gap-1">
												<Icon name="profile" size="xs" />
												{candidate.recruiter}
											</span>
											<span>{candidate.avis.length} avis</span>
										</div>
									</div>
								))
							) : (
								<div className="flex flex-1 items-center justify-center py-8">
									<p className="text-xs text-gray-400 dark:text-gray-500">Aucun candidat</p>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
