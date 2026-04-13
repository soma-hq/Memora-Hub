"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, SectionHeaderBanner } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/core/structures";
import { MODULE_LABELS } from "@/core/config/capabilities";
import type { Module } from "@/core/config/capabilities";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/permissions",
	section: "protected",
	module: "admin",
	description: "Gestion des permissions de la squad.",
	requiredRole: "marsha_teams",
	requiredPermissions: [{ module: "admin", action: "view" }],
	entityScoped: true,
});
void PAGE_CONFIG;

interface RoleTemplate {
	key: string;
	label: string;
	modules: Module[];
}

interface BlueprintPayload {
	blueprint?: {
		roles?: RoleTemplate[];
	};
}

const FALLBACK_ROLES: RoleTemplate[] = [
	{
		key: "owner",
		label: "Owner",
		modules: ["admin", "personnel", "projects", "tasks", "meetings", "logs", "groups", "notifications"],
	},
	{
		key: "manager",
		label: "Manager",
		modules: ["personnel", "projects", "tasks", "meetings", "logs", "notifications"],
	},
	{
		key: "member",
		label: "Membre",
		modules: ["personnel", "tasks", "notifications"],
	},
];

/**
 * Entity-level role and module access matrix.
 * Uses the persisted blueprint created when the entity is created.
 */
export default function PermissionsPage() {
	const params = useParams();
	const groupId = params.groupId as string;
	const [roles, setRoles] = useState<RoleTemplate[]>(FALLBACK_ROLES);
	const [selectedRole, setSelectedRole] = useState<string>(FALLBACK_ROLES[0].key);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const loadBlueprint = async () => {
			setLoading(true);
			try {
				const response = await fetch(`/api/groups/${groupId}/invitations`, { cache: "no-store" });
				if (!response.ok) return;
				const payload = (await response.json()) as BlueprintPayload;
				const nextRoles = payload.blueprint?.roles?.length ? payload.blueprint.roles : FALLBACK_ROLES;
				if (!cancelled) {
					setRoles(nextRoles);
					setSelectedRole((prev) => (nextRoles.some((role) => role.key === prev) ? prev : nextRoles[0].key));
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void loadBlueprint();

		return () => {
			cancelled = true;
		};
	}, [groupId]);

	const allModules = useMemo<Module[]>(() => {
		const unique = new Set<Module>();
		roles.forEach((role) => role.modules.forEach((module) => unique.add(module)));
		return Array.from(unique);
	}, [roles]);

	return (
		<PageContainer
			title="Permissions de squad"
			description="Matrice des acces par role, basee sur la configuration de creation"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<SectionHeaderBanner
					icon="lock"
					title="Roles et permissions"
					description="Modele de permissions de type Discord (roles -> modules)."
					accentColor="orange"
				>
					<Badge variant="warning" showDot={false}>
						{roles.length} roles
					</Badge>
				</SectionHeaderBanner>

				<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
					{roles.map((role) => {
						const selected = role.key === selectedRole;
						return (
							<button
								key={role.key}
								type="button"
								onClick={() => setSelectedRole(role.key)}
								className={cn(
									"rounded-xl border p-4 text-left transition-all duration-200",
									selected
										? "border-orange-300 bg-orange-50/50 dark:border-orange-700 dark:bg-orange-900/10"
										: "border-gray-200/60 bg-transparent hover:border-gray-300 dark:border-gray-700/40 dark:hover:border-gray-600",
								)}
							>
								<div className="flex items-center gap-2">
									<Icon name="shield" size="sm" className="text-orange-500" />
									<span className="text-sm font-bold text-gray-900 dark:text-white">
										{role.label}
									</span>
								</div>
								<p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
									{role.modules.length} modules accessibles
								</p>
							</button>
						);
					})}
				</div>

				<Card padding="lg">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-sm font-semibold text-gray-900 dark:text-white">Matrice modules / roles</h3>
						{loading && (
							<span className="text-xs text-gray-400">
								<Icon name="clock" size="xs" className="mr-1 inline-block" />
								Chargement
							</span>
						)}
					</div>

					<div className="space-y-2">
						{allModules.map((moduleKey) => (
							<div
								key={moduleKey}
								className="flex items-center justify-between rounded-lg border border-gray-200/60 px-3 py-2 dark:border-gray-700/50"
							>
								<span className="text-sm text-gray-700 dark:text-gray-300">
									{MODULE_LABELS[moduleKey]}
								</span>
								<div className="flex items-center gap-2">
									{roles.map((role) => {
										const has = role.modules.includes(moduleKey);
										const isSelectedRole = role.key === selectedRole;
										return (
											<div
												key={`${role.key}-${moduleKey}`}
												title={`${role.label}: ${has ? "Oui" : "Non"}`}
												className={cn(
													"flex h-6 w-6 items-center justify-center rounded-full",
													isSelectedRole && "ring-2 ring-orange-400 dark:ring-orange-600",
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
				</Card>
			</div>
		</PageContainer>
	);
}
