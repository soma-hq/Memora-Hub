"use client";

// Features & Components
import { useRecruiterEspace } from "@/features/recruitment/hooks";
import { CandidateCard } from "@/features/recruitment/components/candidate-card";
import { decisionVariantMap } from "@/features/recruitment/types";
import { PageContainer } from "@/components/layout/page-container";
import { StatCard, Card, Badge, Icon, EmptyState } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


/**
 * Recruiter personal space with stats, today interviews and assigned candidates.
 * @returns The recruiter espace page
 */
export default function EspacePage() {
	const { stats, todayInterviews, myCandidates } = useRecruiterEspace();

	// Pie chart data
	const total = stats.favorable + stats.unfavorable + stats.pending;
	const favorablePercent = total > 0 ? (stats.favorable / total) * 100 : 0;
	const unfavorablePercent = total > 0 ? (stats.unfavorable / total) * 100 : 0;
	const pendingPercent = total > 0 ? (stats.pending / total) * 100 : 0;

	return (
		<PageContainer title="Mon espace" description="Votre espace recruteur personnel">
			{/* Stats row */}
			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					label="Candidats total"
					value={stats.totalCandidates}
					icon="users"
					iconColor="bg-primary-100 text-primary-500 dark:bg-primary-900/20"
				/>
				<StatCard
					label="Avis favorables"
					value={`${total > 0 ? Math.round((stats.favorable / total) * 100) : 0}%`}
					icon="check"
					iconColor="bg-success-100 text-success-500 dark:bg-success-900/20"
				/>
				<StatCard
					label="Entretiens aujourd'hui"
					value={stats.todayInterviews}
					icon="calendar"
					iconColor="bg-warning-100 text-warning-500 dark:bg-warning-900/20"
				/>
				<StatCard
					label="En attente"
					value={stats.pending}
					icon="clock"
					iconColor="bg-info-100 text-info-500 dark:bg-info-900/20"
				/>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Left column — Today's tasks and candidates */}
				<div className="space-y-8 lg:col-span-2">
					{/* Today's interviews */}
					<div>
						<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
							A faire aujourd&apos;hui
						</h2>
						{todayInterviews.length > 0 ? (
							<div className="space-y-3">
								{todayInterviews.map((candidate) => (
									<div
										key={candidate.id}
										className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
									>
										<div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
											{candidate.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</div>
										<div className="flex-1">
											<p className="font-medium text-gray-900 dark:text-white">
												Entretien avec {candidate.name}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{candidate.interviewTime || "Heure non definie"} — {candidate.formId}
											</p>
										</div>
										{candidate.finalDecision && (
											<Badge variant={decisionVariantMap[candidate.finalDecision]}>
												{candidate.finalDecision}
											</Badge>
										)}
									</div>
								))}
							</div>
						) : (
							<Card padding="md">
								<div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
									<Icon name="check" size="md" className="text-success-500" />
									Aucun entretien prevu aujourd&apos;hui. Bonne journee !
								</div>
							</Card>
						)}
					</div>

					{/* My candidates */}
					<div>
						<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Mes candidats</h2>
						{myCandidates.length > 0 ? (
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{myCandidates.map((candidate) => (
									<CandidateCard key={candidate.id} candidate={candidate} />
								))}
							</div>
						) : (
							<EmptyState
								icon="users"
								title="Aucun candidat"
								description="Aucun candidat ne vous est attribue pour le moment."
							/>
						)}
					</div>
				</div>

				{/* Right column — Pie chart */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Repartition des avis</h2>
					<Card padding="lg">
						<div className="flex flex-col items-center gap-6">
							{/* CSS Pie chart */}
							<div
								className="h-40 w-40 rounded-full"
								style={{
									background:
										total > 0
											? `conic-gradient(
											#22c55e 0% ${favorablePercent}%,
											#ef4444 ${favorablePercent}% ${favorablePercent + unfavorablePercent}%,
											#f59e0b ${favorablePercent + unfavorablePercent}% 100%
										)`
											: "#e5e7eb",
								}}
							/>

							{/* Legend */}
							<div className="w-full space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="bg-success-500 h-3 w-3 rounded-full" />
										<span className="text-sm text-gray-600 dark:text-gray-400">Favorable</span>
									</div>
									<span className="text-sm font-semibold text-gray-900 dark:text-white">
										{stats.favorable} ({Math.round(favorablePercent)}%)
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="bg-error-500 h-3 w-3 rounded-full" />
										<span className="text-sm text-gray-600 dark:text-gray-400">Defavorable</span>
									</div>
									<span className="text-sm font-semibold text-gray-900 dark:text-white">
										{stats.unfavorable} ({Math.round(unfavorablePercent)}%)
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="bg-warning-500 h-3 w-3 rounded-full" />
										<span className="text-sm text-gray-600 dark:text-gray-400">En attente</span>
									</div>
									<span className="text-sm font-semibold text-gray-900 dark:text-white">
										{stats.pending} ({Math.round(pendingPercent)}%)
									</span>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</PageContainer>
	);
}
