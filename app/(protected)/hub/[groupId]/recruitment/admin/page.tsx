"use client";

// React
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useCandidates } from "@/features/recruitment/hooks";
import { decisionVariantMap, avisRoleVariantMap } from "@/features/recruitment/types";
import { PageContainer } from "@/components/layout/page-container";
import { StatCard, Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


/**
 * Recruitment admin dashboard with session stats, decision charts and activity.
 * @returns The recruitment admin overview page
 */
export default function AdminPage() {
	const params = useParams();
	const groupId = params.groupId as string;
	const { sessions, allCandidates } = useCandidates();

	const stats = useMemo(() => {
		const activeSessions = sessions.filter((s) => s.status === "Active").length;
		const totalCandidates = allCandidates.length;
		const pendingDecisions = allCandidates.filter(
			(c) => c.finalDecision === "En attente" || !c.finalDecision,
		).length;
		const decidedCandidates = allCandidates.filter(
			(c) => c.finalDecision && c.finalDecision !== "En attente",
		).length;
		const completionRate = totalCandidates > 0 ? Math.round((decidedCandidates / totalCandidates) * 100) : 0;
		return { activeSessions, totalCandidates, pendingDecisions, completionRate };
	}, [sessions, allCandidates]);

	// Recent activity: latest avis across all candidates
	const recentActivity = useMemo(() => {
		const allAvis = allCandidates.flatMap((c) =>
			c.avis.map((a) => ({ ...a, candidateName: c.name, candidateId: c.id })),
		);
		return allAvis.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);
	}, [allCandidates]);

	// Quick links
	const quickLinks = [
		{
			label: "Sessions",
			href: `/hub/${groupId}/recruitment`,
			icon: "folder" as const,
			description: "Gerer les sessions",
		},
		{
			label: "Candidats",
			href: `/hub/${groupId}/recruitment/candidates`,
			icon: "users" as const,
			description: "Voir tous les candidats",
		},
		{
			label: "Resultats",
			href: `/hub/${groupId}/recruitment/results`,
			icon: "stats" as const,
			description: "Kanban des decisions",
		},
		{
			label: "Calendrier",
			href: `/hub/${groupId}/recruitment/calendar`,
			icon: "calendar" as const,
			description: "Planning des entretiens",
		},
		{
			label: "Consignes",
			href: `/hub/${groupId}/recruitment/consignes`,
			icon: "document" as const,
			description: "Directives de recrutement",
		},
		{
			label: "Mon espace",
			href: `/hub/${groupId}/recruitment/espace`,
			icon: "profile" as const,
			description: "Espace recruteur",
		},
	];

	return (
		<PageContainer title="Admin" description="Espace d'administration du recrutement">
			{/* Access banner */}
			<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 mb-6 flex items-start gap-3 rounded-lg border p-4">
				<Icon name="shield" size="md" className="text-warning-500 mt-0.5 shrink-0" />
				<div>
					<p className="text-warning-700 dark:text-warning-400 text-sm font-medium">
						Espace d&apos;administration du recrutement
					</p>
					<p className="text-warning-600 dark:text-warning-500 mt-1 text-xs">
						Cet espace est reserve aux Responsables (Legacy) et Marsha Teams. Vous avez acces a
						l&apos;ensemble des donnees de recrutement et aux outils de gestion.
					</p>
				</div>
			</div>

			{/* Overview cards */}
			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					label="Sessions actives"
					value={stats.activeSessions}
					icon="folder"
					iconColor="bg-success-100 text-success-500 dark:bg-success-900/20"
				/>
				<StatCard
					label="Candidats total"
					value={stats.totalCandidates}
					icon="users"
					iconColor="bg-primary-100 text-primary-500 dark:bg-primary-900/20"
				/>
				<StatCard
					label="Decisions en attente"
					value={stats.pendingDecisions}
					icon="clock"
					iconColor="bg-warning-100 text-warning-500 dark:bg-warning-900/20"
				/>
				<StatCard
					label="Taux de completion"
					value={`${stats.completionRate}%`}
					icon="stats"
					iconColor="bg-info-100 text-info-500 dark:bg-info-900/20"
				/>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Recent activity */}
				<div className="lg:col-span-2">
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Activite recente</h2>
					<Card padding="sm">
						<div className="divide-y divide-gray-100 dark:divide-gray-700">
							{recentActivity.map((activity) => (
								<div key={activity.id} className="flex items-center gap-3 px-4 py-3">
									<div
										className={cn(
											"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
											activity.decision === "Favorable" || activity.decision === "Accepté"
												? "bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400"
												: activity.decision === "Défavorable" || activity.decision === "Refusé"
													? "bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400"
													: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
										)}
									>
										{activity.decision === "Favorable" || activity.decision === "Accepté" ? (
											<Icon name="check" size="xs" />
										) : activity.decision === "Défavorable" || activity.decision === "Refusé" ? (
											<Icon name="close" size="xs" />
										) : (
											<Icon name="clock" size="xs" />
										)}
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-sm text-gray-900 dark:text-white">
											<span className="font-medium">{activity.author}</span> a donne un avis{" "}
											<Badge variant={decisionVariantMap[activity.decision]} showDot={false}>
												{activity.decision}
											</Badge>{" "}
											pour <span className="font-medium">{activity.candidateName}</span>
										</p>
										<div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
											<Badge variant={avisRoleVariantMap[activity.authorRole]} showDot={false}>
												{activity.authorRole}
											</Badge>
											<span>{activity.createdAt}</span>
										</div>
									</div>
								</div>
							))}
							{recentActivity.length === 0 && (
								<div className="py-8 text-center text-sm text-gray-400">Aucune activite recente.</div>
							)}
						</div>
					</Card>
				</div>

				{/* Quick links */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Acces rapide</h2>
					<div className="space-y-2">
						{quickLinks.map((link) => (
							<a
								key={link.label}
								href={link.href}
								className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
							>
								<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
									<Icon name={link.icon} size="sm" className="text-gray-500 dark:text-gray-400" />
								</div>
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">{link.label}</p>
									<p className="text-xs text-gray-400 dark:text-gray-500">{link.description}</p>
								</div>
								<Icon
									name="chevronRight"
									size="xs"
									className="ml-auto text-gray-400 dark:text-gray-500"
								/>
							</a>
						))}
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
