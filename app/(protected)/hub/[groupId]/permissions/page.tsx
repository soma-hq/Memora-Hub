"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Tag, SectionHeaderBanner } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";
import { definePageConfig } from "@/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/permissions",
	section: "protected",
	module: "admin",
	description: "Gestion des permissions du groupe.",
	requiredRole: "marsha_teams",
	requiredPermissions: [{ module: "admin", action: "view" }],
	entityScoped: true,
});

/** Role definition for the permissions matrix */
interface RoleDef {
	id: string;
	label: string;
	icon: IconName;
	color: string;
	description: string;
	permissions: string[];
}

/** Permission category */
interface PermissionCategory {
	id: string;
	label: string;
	icon: IconName;
	permissions: string[];
}

// Roles

const ROLES: RoleDef[] = [
	{
		id: "owner",
		label: "Owner",
		icon: "shield",
		color: "text-red-500",
		description: "Accès total à toutes les fonctionnalités.",
		permissions: [
			"manage_roles",
			"manage_members",
			"manage_settings",
			"view_logs",
			"manage_projects",
			"manage_tasks",
			"manage_meetings",
			"manage_sanctions",
			"manage_planning",
			"view_stats",
			"export_data",
		],
	},
	{
		id: "legacy",
		label: "Legacy (Responsable)",
		icon: "star",
		color: "text-orange-500",
		description: "Gestion de l'équipe et supervision.",
		permissions: [
			"manage_members",
			"view_logs",
			"manage_projects",
			"manage_tasks",
			"manage_meetings",
			"manage_sanctions",
			"manage_planning",
			"view_stats",
		],
	},
	{
		id: "moderator",
		label: "Modérateur",
		icon: "flag",
		color: "text-primary-500",
		description: "Modération et suivi des infractions.",
		permissions: ["view_logs", "manage_sanctions", "manage_tasks"],
	},
	{
		id: "member",
		label: "Membre",
		icon: "profile",
		color: "text-gray-500",
		description: "Accès basique en lecture.",
		permissions: ["view_logs"],
	},
];

// Permission categories

const CATEGORIES: PermissionCategory[] = [
	{
		id: "administration",
		label: "Administration",
		icon: "shield",
		permissions: ["manage_roles", "manage_members", "manage_settings"],
	},
	{
		id: "operations",
		label: "Opérations",
		icon: "tools",
		permissions: ["manage_projects", "manage_tasks", "manage_meetings", "manage_planning"],
	},
	{
		id: "moderation",
		label: "Modération",
		icon: "flag",
		permissions: ["manage_sanctions"],
	},
	{
		id: "monitoring",
		label: "Surveillance",
		icon: "logs",
		permissions: ["view_logs", "view_stats", "export_data"],
	},
];

/** Human-readable permission labels */
const PERM_LABELS: Record<string, string> = {
	manage_roles: "Gérer les rôles",
	manage_members: "Gérer les membres",
	manage_settings: "Modifier les paramètres",
	view_logs: "Consulter les logs",
	manage_projects: "Gérer les projets",
	manage_tasks: "Gérer les tâches",
	manage_meetings: "Gérer les réunions",
	manage_sanctions: "Appliquer les sanctions",
	manage_planning: "Gérer le planning",
	view_stats: "Voir les statistiques",
	export_data: "Exporter les données",
};

/**
 * Hub-level roles and permissions matrix page.
 * Displays role cards and a permission matrix showing what each role can do.
 * @returns {JSX.Element} Permissions page
 */

export default function PermissionsPage() {
	const params = useParams();
	const [selectedRole, setSelectedRole] = useState<string>("owner");

	return (
		<PageContainer
			title="Rôles & Accès"
			description="Matrice des permissions par rôle au sein du groupe"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Header */}
				<SectionHeaderBanner
					icon="lock"
					title="Rôles & Accès"
					description="Visualisez les permissions accordées à chaque rôle."
					accentColor="orange"
				>
					<Badge variant="warning" showDot={false}>
						{ROLES.length} rôles
					</Badge>
				</SectionHeaderBanner>

				{/* Role cards */}
				<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
					{ROLES.map((role) => (
						<button
							key={role.id}
							type="button"
							onClick={() => setSelectedRole(role.id)}
							className={cn(
								"rounded-xl border p-4 text-left transition-all duration-200",
								selectedRole === role.id
									? "border-orange-300 bg-orange-50/50 dark:border-orange-700 dark:bg-orange-900/10"
									: "border-gray-200/60 bg-transparent hover:border-gray-300 dark:border-gray-700/40 dark:hover:border-gray-600",
							)}
						>
							<div className="mb-2 flex items-center gap-2">
								<Icon name={role.icon} size="sm" className={role.color} />
								<span className="text-sm font-bold text-gray-900 dark:text-white">{role.label}</span>
							</div>
							<p className="text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
								{role.description}
							</p>
							<p className="mt-2 text-[10px] font-medium text-gray-500 dark:text-gray-400">
								{role.permissions.length} permission{role.permissions.length > 1 ? "s" : ""}
							</p>
						</button>
					))}
				</div>

				{/* Permission matrix */}
				<Card padding="lg">
					<h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Matrice de permissions</h3>

					<div className="space-y-4">
						{CATEGORIES.map((cat) => (
							<div key={cat.id}>
								{/* Category header */}
								<div className="mb-2 flex items-center gap-2">
									<Icon name={cat.icon} size="sm" className="text-gray-400 dark:text-gray-500" />
									<span className="text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
										{cat.label}
									</span>
								</div>

								{/* Permission rows */}
								<div className="overflow-hidden rounded-lg border border-gray-200/60 dark:border-gray-700/40">
									{cat.permissions.map((perm, idx) => (
										<div
											key={perm}
											className={cn(
												"flex items-center justify-between px-4 py-2.5",
												idx > 0 && "border-t border-gray-100 dark:border-gray-800",
											)}
										>
											<span className="text-sm text-gray-700 dark:text-gray-300">
												{PERM_LABELS[perm] || perm}
											</span>

											{/* Role indicators */}
											<div className="flex items-center gap-3">
												{ROLES.map((role) => {
													const has = role.permissions.includes(perm);
													return (
														<div
															key={role.id}
															title={`${role.label}: ${has ? "Oui" : "Non"}`}
															className={cn(
																"flex h-6 w-6 items-center justify-center rounded-full transition-colors",
																selectedRole === role.id &&
																	"ring-2 ring-orange-400 dark:ring-orange-600",
																has
																	? "bg-emerald-100 dark:bg-emerald-900/30"
																	: "bg-gray-100 dark:bg-gray-800",
															)}
														>
															<Icon
																name={has ? "check" : "close"}
																size="xs"
																className={
																	has
																		? "text-emerald-600 dark:text-emerald-400"
																		: "text-gray-300 dark:text-gray-600"
																}
															/>
														</div>
													);
												})}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>

					{/* Legend */}
					<div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
						{ROLES.map((role) => (
							<div key={role.id} className="flex items-center gap-1.5">
								<Icon name={role.icon} size="xs" className={role.color} />
								<span className="text-[11px] text-gray-500 dark:text-gray-400">{role.label}</span>
							</div>
						))}
					</div>
				</Card>
			</div>
		</PageContainer>
	);
}
