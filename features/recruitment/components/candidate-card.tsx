"use client";

import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Candidate } from "../types";
import { decisionVariantMap } from "../types";


/** Props for the CandidateCard component */
interface CandidateCardProps {
	candidate: Candidate;
	onClick?: () => void;
	className?: string;
}

/**
 * Candidate summary card
 * @param props.candidate - Candidate data
 * @param props.onClick - Card click handler
 * @param props.className - Extra CSS classes
 * @returns Candidate card with decision badge
 */

export function CandidateCard({ candidate, onClick, className }: CandidateCardProps) {
	// Computed
	const favorableCount = candidate.avis.filter((a) => a.decision === "Favorable").length;
	const unfavorableCount = candidate.avis.filter((a) => a.decision === "Défavorable").length;

	// Render
	return (
		<Card hover onClick={onClick} className={cn("group", className)}>
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
						{candidate.name
							.split(" ")
							.map((n) => n[0])
							.join("")
							.toUpperCase()}
					</div>
					<div>
						<h4 className="font-semibold text-gray-900 dark:text-white">{candidate.name}</h4>
						<p className="text-xs text-gray-500 dark:text-gray-400">{candidate.formId}</p>
					</div>
				</div>
				{candidate.finalDecision && (
					<Badge variant={decisionVariantMap[candidate.finalDecision]}>{candidate.finalDecision}</Badge>
				)}
			</div>

			<div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
				<span className="inline-flex items-center gap-1">
					<Icon name="profile" size="xs" className="text-gray-400" />
					{candidate.recruiter}
				</span>
				{candidate.interviewDate && (
					<span className="inline-flex items-center gap-1">
						<Icon name="calendar" size="xs" className="text-gray-400" />
						{candidate.interviewDate}
						{candidate.interviewTime && ` ${candidate.interviewTime}`}
					</span>
				)}
			</div>

			<div className="mt-2 flex items-center gap-3 text-xs">
				{favorableCount > 0 && (
					<span className="text-success-600 dark:text-success-400 inline-flex items-center gap-1">
						<Icon name="check" size="xs" />
						{favorableCount} favorable{favorableCount > 1 ? "s" : ""}
					</span>
				)}
				{unfavorableCount > 0 && (
					<span className="text-error-600 dark:text-error-400 inline-flex items-center gap-1">
						<Icon name="close" size="xs" />
						{unfavorableCount} défavorable{unfavorableCount > 1 ? "s" : ""}
					</span>
				)}
				{candidate.avis.length === 0 && <span className="text-gray-400 dark:text-gray-500">Aucun avis</span>}
			</div>
		</Card>
	);
}
