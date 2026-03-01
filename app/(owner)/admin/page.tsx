"use client";

// Next.js
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";
import type { SemanticLevel } from "@/core/design";
import { levelBorderVariant, levelIconColorVariant } from "@/core/design";

const quickStats = [
	{
		label: "Total utilisateurs",
		value: "19",
		icon: "users" as IconName,
		href: "/users",
	},
	{
		label: "Entités actives",
		value: "5",
		icon: "group" as IconName,
		sub: "Bazalthe, Inoxtag, Michou, Doigby, Anthony",
		href: "/groups",
	},
	{
		label: "Pages",
		value: "45+",
		icon: "document" as IconName,
		href: "/admin/access",
	},
	{
		label: "Accès gérés",
		value: "380+",
		icon: "shield" as IconName,
		href: "/admin/access",
	},
];

interface ActivityEntry {
	id: number;
	text: string;
	time: string;
	level: SemanticLevel;
	icon: IconName;
	href: string;
}

const recentActivity: ActivityEntry[] = [
	{
		id: 1,
		text: "Witt accès modifié par Jeremy Alpha — rôle passé de Viewer à Editor",
		time: "il y a 12 min",
		level: "warning",
		icon: "shield",
		href: "/admin/access",
	},
	{
		id: 2,
		text: "Candice ajoutée à Marsha Team en tant que membre",
		time: "il y a 34 min",
		level: "success",
		icon: "users",
		href: "/groups",
	},
	{
		id: 3,
		text: "Nouveau lien d\u2019invitation généré pour Inoxtag (expire dans 48h)",
		time: "il y a 1h",
		level: "info",
		icon: "globe",
		href: "/admin/links",
	},
	{
		id: 4,
		text: "Procy a mis à jour le planning de Bazalthe — ajout session du 15 mars",
		time: "il y a 2h",
		level: "neutral",
		icon: "calendar",
		href: "/hub",
	},
	{
		id: 5,
		text: "Permission supprimée : Andrew retiré des modérateurs Discord",
		time: "il y a 3h",
		level: "error",
		icon: "lock",
		href: "/admin/access",
	},
	{
		id: 6,
		text: "Export CSV des statistiques par Jeremy Alpha — 1 204 lignes",
		time: "il y a 5h",
		level: "neutral",
		icon: "stats",
		href: "/admin/stats",
	},
	{
		id: 7,
		text: "Événement \u2018Tournage Inoxtag\u2019 créé par Michou pour le 22 mars",
		time: "Hier à 14:30",
		level: "info",
		icon: "calendar",
		href: "/hub",
	},
	{
		id: 8,
		text: "Paramètres de notification modifiés par Doigby",
		time: "Hier à 11:15",
		level: "warning",
		icon: "settings",
		href: "/settings",
	},
	{
		id: 9,
		text: "Anthony retiré de l\u2019entité Bazalthe",
		time: "Hier à 09:00",
		level: "error",
		icon: "users",
		href: "/groups",
	},
	{
		id: 10,
		text: "Lien d\u2019accès temporaire expiré pour Marsha Team",
		time: "il y a 2 jours",
		level: "warning",
		icon: "clock",
		href: "/admin/links",
	},
];

/**
 * Admin dashboard with quick stats, recent activity and navigation cards.
 * @returns Admin home page
 */
export default function AdminDashboardPage() {
	return (
		<PageContainer title="Admin Dashboard" description="Interface d'administration complète">
			{/* Quick stats */}
			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{quickStats.map((stat) => (
					<Link key={stat.label} href={stat.href}>
						<Card
							hover
							padding="md"
							className="border border-red-100 transition-all duration-200 hover:shadow-md dark:border-red-900/20"
						>
							<div className="flex items-start justify-between">
								<div>
									<p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
									<p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
										{stat.value}
									</p>
									{stat.sub && (
										<p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{stat.sub}</p>
									)}
								</div>
								<Badge variant="error" showDot={false} className="flex items-center gap-1">
									<Icon name={stat.icon} style="solid" size="sm" />
								</Badge>
							</div>
							<div className="mt-3 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
								Voir le détail
								<Icon name="chevronRight" size="xs" />
							</div>
						</Card>
					</Link>
				))}
			</div>

			{/* Recent activity */}
			<div>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activité récente</h2>
					<Badge variant="error" showDot={false}>
						{recentActivity.length} événements
					</Badge>
				</div>
				<Card padding="sm" className="border border-red-100 dark:border-red-900/20">
					<div className="divide-y divide-gray-100 dark:divide-gray-700/50">
						{recentActivity.map((entry) => (
							<Link key={entry.id} href={entry.href}>
								<div
									className={cn(
										"flex items-center gap-3 border-l-[3px] px-4 py-3 transition-colors duration-150",
										"hover:bg-gray-50 dark:hover:bg-gray-800/40",
										levelBorderVariant[entry.level],
									)}
								>
									<div
										className={cn(
											"flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
											"bg-gray-100 dark:bg-gray-800",
										)}
									>
										<Icon
											name={entry.icon}
											size="sm"
											className={levelIconColorVariant[entry.level]}
										/>
									</div>
									<p className="flex-1 text-sm text-gray-700 dark:text-gray-300">{entry.text}</p>
									<div className="flex shrink-0 items-center gap-2">
										<span className="text-xs text-gray-400 dark:text-gray-500">{entry.time}</span>
										<Icon
											name="chevronRight"
											size="xs"
											className="text-gray-300 dark:text-gray-600"
										/>
									</div>
								</div>
							</Link>
						))}
					</div>
				</Card>
			</div>
		</PageContainer>
	);
}
