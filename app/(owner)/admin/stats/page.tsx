"use client";

// Features & Components
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


const overviewMetrics: {
	label: string;
	value: string;
	icon: IconName;
	change: string;
	trend: "up" | "down" | "neutral";
}[] = [
	{ label: "Utilisateurs actifs", value: "17", icon: "users", change: "+2 ce mois", trend: "up" },
	{ label: "Pages vues", value: "3 842", icon: "eye", change: "+18%", trend: "up" },
	{ label: "Modifications cette semaine", value: "127", icon: "edit", change: "-5%", trend: "down" },
	{ label: "Sanctions émises", value: "14", icon: "flag", change: "+3", trend: "neutral" },
];

const accessDistribution = [
	{ level: "Owner", count: 1, total: 19, color: "bg-red-500", percentage: 5 },
	{ level: "Marsha Teams", count: 2, total: 19, color: "bg-purple-500", percentage: 11 },
	{ level: "Legacy", count: 3, total: 19, color: "bg-amber-500", percentage: 16 },
	{ level: "Talent / Momentum", count: 3, total: 19, color: "bg-emerald-500", percentage: 16 },
	{ level: "Standard", count: 10, total: 19, color: "bg-gray-400", percentage: 53 },
];

const entityDistribution = [
	{ entity: "Bazalthe", users: 12, max: 19, color: "bg-red-500" },
	{ entity: "Inoxtag", users: 7, max: 19, color: "bg-purple-500" },
	{ entity: "Michou", users: 5, max: 19, color: "bg-amber-500" },
	{ entity: "Doigby", users: 6, max: 19, color: "bg-emerald-500" },
	{ entity: "Anthony", users: 4, max: 19, color: "bg-blue-500" },
];

const teamDistribution = [
	{ team: "Owner", users: 1, max: 19, color: "bg-red-500" },
	{ team: "Marsha Team", users: 2, max: 19, color: "bg-purple-500" },
	{ team: "Legacy", users: 3, max: 19, color: "bg-amber-500" },
	{ team: "Talent", users: 4, max: 19, color: "bg-emerald-500" },
	{ team: "Momentum", users: 1, max: 19, color: "bg-blue-500" },
	{ team: "Squad", users: 8, max: 19, color: "bg-gray-400" },
];

const divisionBreakdown = [
	{ division: "Division 0", count: 1, icon: "/icons/marshasquad/division0.webp", color: "text-red-500" },
	{ division: "Division 1", count: 4, icon: "/icons/marshasquad/division1.webp", color: "text-amber-500" },
	{ division: "Division 2", count: 6, icon: "/icons/marshasquad/division2.webp", color: "text-emerald-500" },
	{ division: "Division 3", count: 8, icon: "/icons/marshasquad/division3.webp", color: "text-gray-400" },
];

const recentSanctions = [
	{
		id: 1,
		user: "Andrew",
		target: "Utilisateur #2847",
		action: "Avertissement Discord",
		time: "il y a 2h",
		severity: "warning" as const,
	},
	{
		id: 2,
		user: "Procy",
		target: "Utilisateur #1293",
		action: "Mute Twitch (24h)",
		time: "il y a 5h",
		severity: "error" as const,
	},
	{
		id: 3,
		user: "Witt",
		target: "Utilisateur #4521",
		action: "Rappel à l'ordre",
		time: "il y a 1j",
		severity: "info" as const,
	},
	{
		id: 4,
		user: "Antwo",
		target: "Utilisateur #3178",
		action: "Ban temporaire Discord (7j)",
		time: "il y a 2j",
		severity: "error" as const,
	},
	{
		id: 5,
		user: "Candice",
		target: "Utilisateur #5012",
		action: "Avertissement YouTube",
		time: "il y a 3j",
		severity: "warning" as const,
	},
];

const severityDot: Record<string, string> = {
	warning: "bg-amber-500",
	error: "bg-red-500",
	info: "bg-blue-500",
};

/**
 * Admin statistics page with user metrics, access distribution and recent activity.
 * @returns The admin stats dashboard
 */
export default function AdminStatsPage() {
	return (
		<PageContainer title="Statistiques avancées" description="Analyses détaillées de l'utilisation et des accès">
			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{overviewMetrics.map((metric) => (
					<Card key={metric.label} padding="md">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
								<p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
							</div>
							<div className={cn("rounded-lg bg-red-100 p-2 dark:bg-red-900/20")}>
								<Icon
									name={metric.icon}
									style="solid"
									size="lg"
									className="text-red-500 dark:text-red-400"
								/>
							</div>
						</div>
						<div className="mt-3 flex items-center gap-1 text-sm">
							<span
								className={cn(
									metric.trend === "up" && "text-emerald-600",
									metric.trend === "down" && "text-red-600",
									metric.trend === "neutral" && "text-gray-400",
								)}
							>
								{metric.change}
							</span>
						</div>
					</Card>
				))}
			</div>

			<div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Access distribution */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Distribution des niveaux d&apos;accès
					</h2>
					<Card padding="lg">
						<div className="space-y-4">
							{accessDistribution.map((item) => (
								<div key={item.level} className="flex items-center gap-4">
									<span className="w-36 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
										{item.level}
									</span>
									<div className="flex-1">
										<div className="h-5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
											<div
												className={cn(
													"h-full rounded-full transition-all duration-500",
													item.color,
												)}
												style={{ width: `${item.percentage}%` }}
											/>
										</div>
									</div>
									<span className="w-8 text-right text-sm font-semibold text-gray-900 dark:text-white">
										{item.count}
									</span>
									<span className="w-12 text-right text-xs text-gray-400">{item.percentage}%</span>
								</div>
							))}
						</div>
					</Card>
				</div>

				{/* Entity distribution */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Utilisateurs par entité
					</h2>
					<Card padding="lg">
						<div className="space-y-4">
							{entityDistribution.map((item) => (
								<div key={item.entity} className="flex items-center gap-4">
									<span className="w-24 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
										{item.entity}
									</span>
									<div className="flex-1">
										<div className="h-5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
											<div
												className={cn(
													"h-full rounded-full transition-all duration-500",
													item.color,
												)}
												style={{ width: `${(item.users / item.max) * 100}%` }}
											/>
										</div>
									</div>
									<span className="w-8 text-right text-sm font-semibold text-gray-900 dark:text-white">
										{item.users}
									</span>
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>

			<div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Team distribution */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Utilisateurs par team</h2>
					<Card padding="lg">
						<div className="space-y-4">
							{teamDistribution.map((item) => (
								<div key={item.team} className="flex items-center gap-4">
									<span className="w-28 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
										{item.team}
									</span>
									<div className="flex-1">
										<div className="h-5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
											<div
												className={cn(
													"h-full rounded-full transition-all duration-500",
													item.color,
												)}
												style={{ width: `${(item.users / item.max) * 100}%` }}
											/>
										</div>
									</div>
									<span className="w-8 text-right text-sm font-semibold text-gray-900 dark:text-white">
										{item.users}
									</span>
								</div>
							))}
						</div>
					</Card>
				</div>

				{/* Division breakdown */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Répartition par division
					</h2>
					<Card padding="lg">
						<div className="grid grid-cols-2 gap-4">
							{divisionBreakdown.map((div) => (
								<div
									key={div.division}
									className={cn(
										"flex items-center gap-3 rounded-lg border border-gray-200 p-3",
										"dark:border-gray-700",
									)}
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={div.icon} alt={div.division} className="h-8 w-8 opacity-80" />
									<div>
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{div.division}
										</p>
										<p className={cn("text-lg font-bold", div.color)}>{div.count}</p>
									</div>
								</div>
							))}
						</div>
						<div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-400">Total membres</span>
								<span className="font-semibold text-gray-900 dark:text-white">
									{divisionBreakdown.reduce((acc, d) => acc + d.count, 0)}
								</span>
							</div>
						</div>
					</Card>
				</div>
			</div>

			<div>
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Activité sanctions récente</h2>
				<Card padding="lg">
					<div className="relative">
						{/* Timeline line */}
						<div className="absolute top-0 bottom-0 left-3 w-px bg-gray-200 dark:bg-gray-700" />

						<div className="space-y-6">
							{recentSanctions.map((sanction) => (
								<div key={sanction.id} className="relative flex items-start gap-4 pl-8">
									{/* Dot */}
									<span
										className={cn(
											"absolute top-1 left-2 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800",
											severityDot[sanction.severity],
										)}
									/>

									{/* Content */}
									<div className="flex-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="font-medium text-gray-900 dark:text-white">
												{sanction.user}
											</span>
											<Icon name="chevronRight" size="xs" className="text-gray-400" />
											<span className="text-sm text-gray-600 dark:text-gray-400">
												{sanction.target}
											</span>
										</div>
										<p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
											{sanction.action}
										</p>
									</div>

									{/* Time */}
									<span className="shrink-0 text-xs text-gray-400">{sanction.time}</span>
								</div>
							))}
						</div>
					</div>
				</Card>
			</div>
		</PageContainer>
	);
}
