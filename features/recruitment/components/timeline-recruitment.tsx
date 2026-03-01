"use client";

import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


/** Phase in the recruitment timeline */
interface TimelinePhase {
	id: string;
	title: string;
	icon: IconName;
	description: string;
	steps: string[];
	status: "completed" | "active" | "upcoming";
}

/** Recruitment process phases with their steps and current status */
const PHASES: TimelinePhase[] = [
	{
		id: "pre",
		title: "Pre-Entretiens",
		icon: "document",
		description: "Preparation, consignes review, candidate screening",
		steps: [
			"Lecture des consignes de recrutement",
			"Examen des candidatures recues",
			"Selection des profils a convoquer",
			"Planification des entretiens",
		],
		status: "completed",
	},
	{
		id: "in",
		title: "In-Entretiens",
		icon: "chat",
		description: "Deroulement des entretiens, utilisation du questionnaire, evaluation en direct",
		steps: [
			"Accueil et presentation du processus",
			"Deroulement du questionnaire (4 etapes)",
			"Evaluation en temps reel",
			"Saisie des avis recruteurs",
		],
		status: "active",
	},
	{
		id: "post",
		title: "Post-Entretiens",
		icon: "tasks",
		description: "Deliberation, bilans, decisions finales",
		steps: [
			"Synthese des avis par candidat",
			"Deliberation avec les Responsables",
			"Decision finale (Accepte / Refuse)",
			"Communication aux candidats",
		],
		status: "upcoming",
	},
];

/** Props for the TimelineRecruitment component */
interface TimelineRecruitmentProps {
	className?: string;
}

/**
 * Three-phase recruitment process timeline
 * @param props.className - Extra CSS classes
 * @returns Horizontal timeline with phase cards
 */

export function TimelineRecruitment({ className }: TimelineRecruitmentProps) {
	// Render
	return (
		<div className={cn("w-full", className)}>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{PHASES.map((phase, index) => (
					<div key={phase.id} className="relative">
						{/* Connector line */}
						{index < PHASES.length - 1 && (
							<div className="absolute top-8 right-0 hidden h-0.5 w-4 translate-x-full bg-gray-200 lg:block dark:bg-gray-700" />
						)}

						<div
							className={cn(
								"rounded-xl border p-5 transition-all",
								phase.status === "completed" &&
									"border-success-200 bg-success-50/50 dark:border-success-800 dark:bg-success-900/10",
								phase.status === "active" &&
									"border-primary-200 bg-primary-50/50 dark:border-primary-800 dark:bg-primary-900/10 shadow-sm",
								phase.status === "upcoming" &&
									"border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50",
							)}
						>
							{/* Phase header */}
							<div className="mb-3 flex items-center gap-3">
								<div
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-lg",
										phase.status === "completed" &&
											"bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400",
										phase.status === "active" &&
											"bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",
										phase.status === "upcoming" &&
											"bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500",
									)}
								>
									<Icon name={phase.icon} size="md" />
								</div>
								<div>
									<h3
										className={cn(
											"font-semibold",
											phase.status === "completed" && "text-success-700 dark:text-success-400",
											phase.status === "active" && "text-primary-700 dark:text-primary-400",
											phase.status === "upcoming" && "text-gray-500 dark:text-gray-400",
										)}
									>
										{phase.title}
									</h3>
									<p className="text-xs text-gray-500 dark:text-gray-400">{phase.description}</p>
								</div>
							</div>

							{/* Steps */}
							<ul className="space-y-2">
								{phase.steps.map((step, i) => (
									<li key={i} className="flex items-start gap-2 text-sm">
										<span
											className={cn(
												"mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]",
												phase.status === "completed" &&
													"bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400",
												phase.status === "active" &&
													"bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",
												phase.status === "upcoming" &&
													"bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500",
											)}
										>
											{phase.status === "completed" ? <Icon name="check" size="xs" /> : i + 1}
										</span>
										<span
											className={cn(
												phase.status === "upcoming"
													? "text-gray-400 dark:text-gray-500"
													: "text-gray-700 dark:text-gray-300",
											)}
										>
											{step}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
