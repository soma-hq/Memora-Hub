"use client";

// Features & Components
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Button, Icon, ProgressBar } from "@/components/ui";
import { downloadCsv } from "@/lib/export";
import { showSuccess } from "@/lib/utils/toast";
import type { IconName } from "@/core/design/icons";


// Mock data

const overviewStats: {
	label: string;
	value: string;
	icon: IconName;
	iconColor: string;
	change: string;
	trend: "up" | "down" | "neutral";
}[] = [
	{
		label: "Total utilisateurs",
		value: "128",
		icon: "users",
		iconColor: "bg-primary-100 text-primary-500 dark:bg-primary-900/20",
		change: "+12%",
		trend: "up",
	},
	{
		label: "Projets actifs",
		value: "34",
		icon: "folder",
		iconColor: "bg-info-100 text-info-500 dark:bg-info-900/20",
		change: "+5%",
		trend: "up",
	},
	{
		label: "Tâches terminées",
		value: "847",
		icon: "tasks",
		iconColor: "bg-success-100 text-success-500 dark:bg-success-900/20",
		change: "+23%",
		trend: "up",
	},
	{
		label: "Taux de présence",
		value: "94%",
		icon: "calendar",
		iconColor: "bg-warning-100 text-warning-500 dark:bg-warning-900/20",
		change: "-2%",
		trend: "down",
	},
];

const roleDistribution = [
	{ role: "Owner", count: 2, total: 128, color: "primary" as const },
	{ role: "Admin", count: 6, total: 128, color: "info" as const },
	{ role: "Manager", count: 18, total: 128, color: "success" as const },
	{ role: "Collaborateur", count: 89, total: 128, color: "warning" as const },
	{ role: "Invité", count: 13, total: 128, color: "error" as const },
];

const taskStats = [
	{ status: "A faire", count: 63, total: 312, variant: "info" as const, badgeVariant: "neutral" as const },
	{ status: "En cours", count: 114, total: 312, variant: "warning" as const, badgeVariant: "info" as const },
	{ status: "Termine", count: 135, total: 312, variant: "success" as const, badgeVariant: "success" as const },
];

const projectStatuses = [
	{
		status: "En cours",
		count: 18,
		total: 34,
		icon: "folder" as IconName,
		variant: "primary" as const,
		badgeVariant: "info" as const,
		iconWrap: "bg-primary-100 text-primary-500 dark:bg-primary-900/20",
	},
	{
		status: "En attente",
		count: 7,
		total: 34,
		icon: "clock" as IconName,
		variant: "warning" as const,
		badgeVariant: "warning" as const,
		iconWrap: "bg-warning-100 text-warning-500 dark:bg-warning-900/20",
	},
	{
		status: "Termine",
		count: 6,
		total: 34,
		icon: "check" as IconName,
		variant: "success" as const,
		badgeVariant: "success" as const,
		iconWrap: "bg-success-100 text-success-500 dark:bg-success-900/20",
	},
	{
		status: "Annule",
		count: 3,
		total: 34,
		icon: "close" as IconName,
		variant: "error" as const,
		badgeVariant: "error" as const,
		iconWrap: "bg-error-100 text-error-500 dark:bg-error-900/20",
	},
];

const monthlyActivity = [
	{ month: "Sept", tasks: 42 },
	{ month: "Oct", tasks: 67 },
	{ month: "Nov", tasks: 53 },
	{ month: "Dec", tasks: 78 },
	{ month: "Jan", tasks: 91 },
	{ month: "Fev", tasks: 85 },
];

const topContributors = [
	{ name: "Alice Dupont", initials: "AD", tasks: 47, completion: 94, color: "bg-primary-500" },
	{ name: "Benoit Martin", initials: "BM", tasks: 39, completion: 87, color: "bg-info-500" },
	{ name: "Clara Lefebvre", initials: "CL", tasks: 35, completion: 91, color: "bg-success-500" },
	{ name: "David Moreau", initials: "DM", tasks: 28, completion: 82, color: "bg-warning-500" },
	{ name: "Emma Bernard", initials: "EB", tasks: 24, completion: 78, color: "bg-error-500" },
];

// CSV export handler

/**
 * Exports top contributors data as a downloadable CSV file.
 * @returns void
 */
function handleExportCsv() {
	const data = topContributors.map((c) => ({
		nom: c.name,
		taches: c.tasks,
		completion: `${c.completion}%`,
	}));

	downloadCsv({
		title: "Statistiques",
		columns: [
			{ key: "nom", label: "Nom" },
			{ key: "taches", label: "Tâches" },
			{ key: "completion", label: "Taux de complétion" },
		],
		data,
	});

	showSuccess("Export CSV lancé avec succès");
}

/**
 * Platform statistics page with overview metrics, activity charts and contributors.
 * @returns The stats dashboard page
 */
export default function StatsPage() {
	const maxMonthlyTasks = Math.max(...monthlyActivity.map((m) => m.tasks));

	return (
		<PageContainer
			title="Statistiques"
			description="Analyse et suivi de votre organisation"
			actions={
				<Button variant="outline-primary" onClick={handleExportCsv}>
					<Icon name="download" size="sm" className="mr-2" />
					Exporter CSV
				</Button>
			}
		>
			{/* ----------------------------------------------------------------- */}
			{/* Stats overview                                                    */}
			{/* ----------------------------------------------------------------- */}
			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{overviewStats.map((stat) => (
					<Card key={stat.label} padding="md">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm text-gray-400">{stat.label}</p>
								<p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
							</div>
							<div className={`rounded-lg p-2 ${stat.iconColor}`}>
								<Icon name={stat.icon} style="solid" size="lg" />
							</div>
						</div>
						<div className="mt-3 flex items-center gap-1 text-sm">
							<span
								className={
									stat.trend === "up"
										? "text-success-600"
										: stat.trend === "down"
											? "text-error-600"
											: "text-gray-400"
								}
							>
								{stat.change}
							</span>
							<span className="text-gray-400">vs. mois dernier</span>
						</div>
					</Card>
				))}
			</div>

			{/* ----------------------------------------------------------------- */}
			{/* Repartition par role                                              */}
			{/* ----------------------------------------------------------------- */}
			<div className="mb-8">
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Repartition par role</h2>
				<Card padding="lg">
					<div className="space-y-4">
						{roleDistribution.map((item) => (
							<div key={item.role} className="flex items-center gap-4">
								<span className="w-32 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
									{item.role}
								</span>
								<div className="flex-1">
									<ProgressBar value={item.count} max={item.total} variant={item.color} size="md" />
								</div>
								<span className="w-16 text-right text-sm font-semibold text-gray-900 dark:text-white">
									{item.count}
								</span>
								<Badge variant={item.color} showDot={false} className="w-16 justify-center">
									{Math.round((item.count / item.total) * 100)}%
								</Badge>
							</div>
						))}
					</div>
				</Card>
			</div>

			{/* ----------------------------------------------------------------- */}
			{/* Statistiques des taches                                           */}
			{/* ----------------------------------------------------------------- */}
			<div className="mb-8">
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Statistiques des tâches</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					{taskStats.map((item) => (
						<Card key={item.status} padding="lg">
							<div className="mb-3 flex items-center justify-between">
								<Badge variant={item.badgeVariant}>{item.status}</Badge>
								<span className="text-2xl font-bold text-gray-900 dark:text-white">{item.count}</span>
							</div>
							<ProgressBar
								value={item.count}
								max={item.total}
								variant={item.variant}
								size="lg"
								showValue
							/>
							<p className="mt-2 text-xs text-gray-400">sur {item.total} tâches au total</p>
						</Card>
					))}
				</div>
			</div>

			{/* ----------------------------------------------------------------- */}
			{/* Projets par statut                                                */}
			{/* ----------------------------------------------------------------- */}
			<div className="mb-8">
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Projets par statut</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{projectStatuses.map((item) => (
						<Card key={item.status} padding="lg">
							<div className="mb-3 flex items-center gap-3">
								<div className={`rounded-lg p-2 ${item.iconWrap}`}>
									<Icon name={item.icon} style="solid" size="md" />
								</div>
								<div>
									<p className="text-sm text-gray-400">{item.status}</p>
									<p className="text-xl font-bold text-gray-900 dark:text-white">{item.count}</p>
								</div>
							</div>
							<ProgressBar
								value={item.count}
								max={item.total}
								variant={item.variant}
								size="sm"
								showValue
							/>
						</Card>
					))}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* ------------------------------------------------------------- */}
				{/* Activite mensuelle                                            */}
				{/* ------------------------------------------------------------- */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Activite mensuelle</h2>
					<Card padding="lg">
						<div className="flex items-end justify-between gap-3" style={{ height: 200 }}>
							{monthlyActivity.map((item) => {
								const heightPercent = (item.tasks / maxMonthlyTasks) * 100;
								return (
									<div key={item.month} className="flex flex-1 flex-col items-center gap-2">
										<span className="text-xs font-semibold text-gray-900 dark:text-white">
											{item.tasks}
										</span>
										<div className="relative w-full flex-1">
											<div
												className="bg-primary-500 absolute bottom-0 w-full rounded-t-md transition-all duration-500"
												style={{ height: `${heightPercent}%` }}
											/>
										</div>
										<span className="text-xs text-gray-500 dark:text-gray-400">{item.month}</span>
									</div>
								);
							})}
						</div>
						<div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-400">Total sur 6 mois</span>
								<span className="font-semibold text-gray-900 dark:text-white">
									{monthlyActivity.reduce((acc, m) => acc + m.tasks, 0)} tâches
								</span>
							</div>
						</div>
					</Card>
				</div>

				{/* ------------------------------------------------------------- */}
				{/* Top contributeurs                                             */}
				{/* ------------------------------------------------------------- */}
				<div>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Top contributeurs</h2>
					<Card padding="lg">
						<div className="space-y-5">
							{topContributors.map((user, idx) => (
								<div key={user.name} className="flex items-center gap-4">
									{/* Rank */}
									<span className="w-5 text-center text-sm font-bold text-gray-400">{idx + 1}</span>

									{/* Avatar */}
									<div
										className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${user.color}`}
									>
										{user.initials}
									</div>

									{/* Info */}
									<div className="min-w-0 flex-1">
										<div className="flex items-center justify-between">
											<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
												{user.name}
											</p>
											<Badge variant="neutral" showDot={false} className="ml-2 shrink-0">
												{user.tasks} tâches
											</Badge>
										</div>
										<ProgressBar
											value={user.completion}
											max={100}
											variant={
												user.completion >= 90
													? "success"
													: user.completion >= 80
														? "primary"
														: "warning"
											}
											size="sm"
											showValue
											className="mt-1.5"
										/>
									</div>
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>
		</PageContainer>
	);
}
