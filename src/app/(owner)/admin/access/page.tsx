"use client";

import { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Button, Tabs, SectionHeaderBanner } from "@/components/ui";
import { useDataStore } from "@/store/data.store";
import { ROLES_LIST, ROLE_LABELS, ROLE_BADGE_CLASSES, ROLE_DESCRIPTIONS, type RoleId } from "@/core/config/roles";
import { MODULE_LABELS, ALL_MODULES, PERMISSION_LABELS, type Module } from "@/core/config/capabilities";
import { getPermissionsForModule, getAccessibleModules } from "@/core/permissions/capabilityMap";
import { ENTITIES, resolveEntityAccess } from "@/core/data/entities";
import { getTeamForRole } from "@/core/config/teams";
import { cn } from "@/lib/utils/cn";
import { showSuccess } from "@/lib/utils/toast";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "admin/access",
	section: "owner",
	module: "admin",
	description: "Gestion des accès et permissions.",
	requiredRole: "owner",
	requiredPermissions: [{ module: "admin", action: "manage" }],
	ownerOnly: true,
});

// Avatar background helper
const AVATAR_BG: Record<string, string> = {
	A: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	B: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
	C: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
	D: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	E: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
	F: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
	G: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
	I: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
	J: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
	L: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
	M: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
	P: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
	S: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
	W: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function getAvatarBg(name: string) {
	const letter = name.charAt(0).toUpperCase();
	return AVATAR_BG[letter] ?? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
}

// Role border colors for user rows
const ROLE_BORDER: Record<RoleId, string> = {
	owner: "border-l-red-500",
	marsha_teams: "border-l-primary-500",
	legacy_resp_live: "border-l-amber-500",
	legacy_resp_discord: "border-l-amber-500",
	legacy_resp_polyvalent: "border-l-amber-500",
	momentum_talent: "border-l-purple-500",
};

// Permission badge colors
const PERM_COLORS: Record<string, string> = {
	view: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
	create: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
	edit: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
	delete: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
	manage: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
};

// View tabs
const VIEW_TABS = [
	{ id: "members" as const, label: "Membres" },
	{ id: "roles" as const, label: "Rôles" },
	{ id: "matrix" as const, label: "Matrice" },
];

// Select classes
const selectClasses = cn(
	"rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
	"text-gray-700 shadow-sm transition-all duration-200",
	"focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500",
	"dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
);

/**
 * Owner Access Management page with Discord-style permission system
 * @returns {JSX.Element} Access management page
 */
export default function AdminAccessPage() {
	// State
	const [activeView, setActiveView] = useState<"members" | "roles" | "matrix">("members");
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [entityFilter, setEntityFilter] = useState<string>("all");
	const [expandedUser, setExpandedUser] = useState<string | null>(null);
	const [expandedRole, setExpandedRole] = useState<string | null>(null);

	// Data store
	const users = useDataStore((s) => s.users);
	const updateUser = useDataStore((s) => s.updateUser);

	// Filtered users
	const filteredUsers = useMemo(() => {
		return users
			.filter((u) => {
				if (roleFilter !== "all" && u.roleId !== roleFilter) return false;
				if (entityFilter !== "all") {
					if (!u.entityAccess.includes("*") && !u.entityAccess.includes(entityFilter)) return false;
				}
				return true;
			})
			.sort((a, b) => {
				const levelA = ROLES_LIST.find((r) => r.id === a.roleId)?.level ?? 0;
				const levelB = ROLES_LIST.find((r) => r.id === b.roleId)?.level ?? 0;
				if (levelB !== levelA) return levelB - levelA;
				return a.pseudo.localeCompare(b.pseudo);
			});
	}, [users, roleFilter, entityFilter]);

	// Role filter options
	const roleFilterOptions = useMemo(
		() => [{ value: "all", label: "Rôle : Tous" }, ...ROLES_LIST.map((r) => ({ value: r.id, label: r.label }))],
		[],
	);

	// Entity filter options
	const entityFilterOptions = useMemo(
		() => [{ value: "all", label: "Entité : Toutes" }, ...ENTITIES.map((e) => ({ value: e.id, label: e.name }))],
		[],
	);

	// Users per role count
	const usersPerRole = useMemo(() => {
		const map: Record<string, number> = {};
		for (const role of ROLES_LIST) {
			map[role.id] = users.filter((u) => u.roleId === role.id).length;
		}
		return map;
	}, [users]);

	// Handlers
	const handleRoleChange = (userId: string, newRoleId: RoleId) => {
		updateUser(userId, { roleId: newRoleId });
		showSuccess(`Rôle mis à jour`);
	};

	const toggleEntityAccess = (userId: string, entityId: string) => {
		const user = users.find((u) => u.id === userId);
		if (!user) return;

		let newAccess: string[];
		if (user.entityAccess.includes("*")) {
			// Wildcard: switching to specific entities, remove the target one
			newAccess = ENTITIES.map((e) => e.id).filter((id) => id !== entityId);
		} else if (user.entityAccess.includes(entityId)) {
			newAccess = user.entityAccess.filter((id) => id !== entityId);
		} else {
			newAccess = [...user.entityAccess, entityId];
		}

		updateUser(userId, { entityAccess: newAccess });
		showSuccess(`Accès entité mis à jour`);
	};

	const setWildcardAccess = (userId: string) => {
		updateUser(userId, { entityAccess: ["*"] });
		showSuccess(`Accès toutes entités activé`);
	};

	const toggle2FA = (userId: string) => {
		const user = users.find((u) => u.id === userId);
		if (!user) return;
		updateUser(userId, { twoFactorEnabled: !user.twoFactorEnabled });
		showSuccess(`2FA ${user.twoFactorEnabled ? "désactivé" : "activé"}`);
	};

	// Render
	return (
		<PageContainer
			title="Gestion des accès"
			description="Système de permissions Discord-style. Rôles, entités et modules."
		>
			{/* View tabs */}
			<div className="mb-6 border-b border-gray-200 dark:border-gray-700">
				<Tabs
					tabs={VIEW_TABS}
					activeTab={activeView}
					onTabChange={(id) => setActiveView(id as "members" | "roles" | "matrix")}
					variant="underline"
				/>
			</div>

			{/* Members */}
			{activeView === "members" && (
				<>
					{/* Filters */}
					<div
						className={cn(
							"mb-6 flex flex-wrap items-center gap-3 rounded-xl border bg-transparent p-4",
							"border-red-200 dark:border-red-900/40",
						)}
					>
						<select
							value={roleFilter}
							onChange={(e) => setRoleFilter(e.target.value)}
							className={cn(selectClasses, roleFilter !== "all" && "border-red-400 ring-1 ring-red-400")}
							aria-label="Filtrer par rôle"
						>
							{roleFilterOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>

						<select
							value={entityFilter}
							onChange={(e) => setEntityFilter(e.target.value)}
							className={cn(
								selectClasses,
								entityFilter !== "all" && "border-red-400 ring-1 ring-red-400",
							)}
							aria-label="Filtrer par entité"
						>
							{entityFilterOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>

						{(roleFilter !== "all" || entityFilter !== "all") && (
							<button
								onClick={() => {
									setRoleFilter("all");
									setEntityFilter("all");
								}}
								className="rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
							>
								Réinitialiser
							</button>
						)}

						<span className="ml-auto text-sm text-gray-400">
							{filteredUsers.length} membre{filteredUsers.length !== 1 ? "s" : ""}
						</span>
					</div>

					{/* Table header */}
					<div
						className={cn(
							"mb-2 hidden items-center gap-4 rounded-lg px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase md:flex",
							"dark:text-gray-400",
						)}
					>
						<span className="w-36">Pseudo</span>
						<span className="w-36">Rôle</span>
						<span className="w-44">Entités</span>
						<span className="w-28 text-center">Modules</span>
						<span className="w-20 text-center">2FA</span>
						<span className="flex-1 text-right">Détails</span>
					</div>

					{/* User rows */}
					<div className="space-y-2">
						{filteredUsers.map((user) => {
							const isExpanded = expandedUser === user.id;
							const resolvedEntities = resolveEntityAccess(user.entityAccess);
							const isWildcard = user.entityAccess.includes("*");
							const accessibleModules = getAccessibleModules(user.roleId);

							return (
								<div key={user.id}>
									{/* Row */}
									<Card
										padding="md"
										hover
										className={cn(
											"cursor-pointer border border-l-4 border-red-100 dark:border-red-900/20",
											ROLE_BORDER[user.roleId],
										)}
										onClick={() => setExpandedUser(isExpanded ? null : user.id)}
									>
										<div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
											{/* Pseudo */}
											<div className="flex w-36 items-center gap-2">
												<div
													className={cn(
														"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
														getAvatarBg(user.pseudo),
													)}
												>
													{user.pseudo.charAt(0)}
												</div>
												<div className="min-w-0">
													<span className="block truncate font-semibold text-gray-900 dark:text-white">
														{user.pseudo}
													</span>
													<span className="block truncate text-[10px] text-gray-400">
														{user.email}
													</span>
												</div>
											</div>

											{/* Role badge */}
											<div className="w-36">
												<span
													className={cn(
														"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
														ROLE_BADGE_CLASSES[user.roleId],
													)}
												>
													{ROLE_LABELS[user.roleId]}
												</span>
											</div>

											{/* Entities */}
											<div className="flex w-44 flex-wrap gap-1">
												{isWildcard ? (
													<span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
														Toutes les entités
													</span>
												) : (
													resolvedEntities.map((entity) => (
														<span
															key={entity.id}
															className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs"
															style={{
																backgroundColor: entity.color + "20",
																color: entity.color,
															}}
														>
															<span
																className="h-1.5 w-1.5 rounded-full"
																style={{ backgroundColor: entity.color }}
															/>
															{entity.name}
														</span>
													))
												)}
											</div>

											{/* Module count */}
											<div className="w-28 text-center">
												<Badge variant="neutral" showDot={false}>
													{accessibleModules.length} modules
												</Badge>
											</div>

											{/* 2FA status */}
											<div className="w-20 text-center">
												<span
													className={cn(
														"inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
														user.twoFactorEnabled
															? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
															: "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500",
													)}
												>
													<Icon name={user.twoFactorEnabled ? "check" : "close"} size="xs" />
												</span>
											</div>

											{/* Expand chevron */}
											<div className="flex flex-1 justify-end">
												<Icon
													name={isExpanded ? "chevronUp" : "chevronDown"}
													size="sm"
													className="text-gray-400"
												/>
											</div>
										</div>
									</Card>

									{/* Expanded detail */}
									{isExpanded && (
										<div
											className={cn(
												"mt-1 rounded-lg border border-red-100 bg-gray-50 p-5",
												"dark:border-red-900/30 dark:bg-gray-800/50",
											)}
										>
											{/* Section: Role */}
											<div className="mb-5">
												<p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
													Rôle
												</p>
												<div className="flex flex-wrap items-center gap-2">
													{ROLES_LIST.map((role) => (
														<button
															key={role.id}
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																handleRoleChange(user.id, role.id);
															}}
															className={cn(
																"rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
																user.roleId === role.id
																	? cn(
																			ROLE_BADGE_CLASSES[role.id],
																			"border-current ring-1 ring-current",
																		)
																	: "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500",
															)}
														>
															{role.label}
														</button>
													))}
												</div>
												<p className="mt-1.5 text-xs text-gray-400">
													{ROLE_DESCRIPTIONS[user.roleId]}
												</p>
											</div>

											{/* Divider */}
											<div className="my-4 border-t border-gray-200 dark:border-gray-700" />

											{/* Section: Entity Access */}
											<div className="mb-5">
												<div className="mb-2 flex items-center gap-2">
													<p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
														Accès aux entités
													</p>
													{!isWildcard && (
														<button
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																setWildcardAccess(user.id);
															}}
															className="rounded-md px-2 py-0.5 text-[10px] font-medium text-purple-600 transition-colors hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
														>
															Activer toutes les entités
														</button>
													)}
												</div>
												<div className="flex flex-wrap gap-2">
													{ENTITIES.map((entity) => {
														const hasAccess =
															isWildcard || user.entityAccess.includes(entity.id);
														return (
															<button
																key={entity.id}
																type="button"
																onClick={(e) => {
																	e.stopPropagation();
																	toggleEntityAccess(user.id, entity.id);
																}}
																className={cn(
																	"flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
																	hasAccess
																		? "border-current"
																		: "border-gray-200 text-gray-400 opacity-50 dark:border-gray-600",
																)}
																style={
																	hasAccess
																		? {
																				backgroundColor: entity.color + "15",
																				color: entity.color,
																				borderColor: entity.color + "60",
																			}
																		: undefined
																}
															>
																<span
																	className={cn(
																		"h-3 w-3 rounded-full",
																		!hasAccess && "bg-gray-300 dark:bg-gray-600",
																	)}
																	style={
																		hasAccess
																			? { backgroundColor: entity.color }
																			: undefined
																	}
																/>
																{entity.name}
																{hasAccess && <Icon name="check" size="xs" />}
															</button>
														);
													})}
												</div>
											</div>

											{/* Divider */}
											<div className="my-4 border-t border-gray-200 dark:border-gray-700" />

											{/* Section: Module Permissions */}
											<div className="mb-5">
												<p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
													Permissions par module ({ROLE_LABELS[user.roleId]})
												</p>
												<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
													{ALL_MODULES.map((mod) => {
														const perms = getPermissionsForModule(user.roleId, mod);
														const hasAccess = perms.length > 0;

														return (
															<div
																key={mod}
																className={cn(
																	"flex items-center gap-3 rounded-lg border px-3 py-2",
																	hasAccess
																		? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
																		: "border-gray-100 bg-gray-50/50 opacity-40 dark:border-gray-800 dark:bg-gray-900/30",
																)}
															>
																<span
																	className={cn(
																		"h-2 w-2 shrink-0 rounded-full",
																		hasAccess
																			? "bg-emerald-400"
																			: "bg-gray-300 dark:bg-gray-600",
																	)}
																/>
																<span
																	className={cn(
																		"min-w-[120px] text-xs font-medium",
																		hasAccess
																			? "text-gray-900 dark:text-white"
																			: "text-gray-400",
																	)}
																>
																	{MODULE_LABELS[mod]}
																</span>
																<div className="flex flex-wrap gap-1">
																	{perms.map((p) => (
																		<span
																			key={p}
																			className={cn(
																				"rounded px-1.5 py-0.5 text-[10px] font-medium",
																				PERM_COLORS[p],
																			)}
																		>
																			{PERMISSION_LABELS[p]}
																		</span>
																	))}
																</div>
															</div>
														);
													})}
												</div>
											</div>

											{/* Divider */}
											<div className="my-4 border-t border-gray-200 dark:border-gray-700" />

											{/* Section: Security */}
											<div>
												<p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
													Sécurité
												</p>
												<div className="flex items-center gap-4">
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															toggle2FA(user.id);
														}}
														className={cn(
															"flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
															user.twoFactorEnabled
																? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
																: "border-gray-200 text-gray-500 dark:border-gray-600 dark:text-gray-400",
														)}
													>
														<Icon
															name={user.twoFactorEnabled ? "lock" : "lock"}
															size="sm"
														/>
														2FA {user.twoFactorEnabled ? "Activé" : "Désactivé"}
													</button>
													<span className="text-xs text-gray-400">
														Team : {getTeamForRole(user.roleId)}
													</span>
												</div>
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>

					{/* Empty state */}
					{filteredUsers.length === 0 && (
						<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 dark:border-gray-600">
							<Icon name="shield" size="xl" className="mb-3 text-gray-300 dark:text-gray-600" />
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Aucun membre ne correspond aux filtres.
							</p>
						</div>
					)}
				</>
			)}

			{/* Roles */}
			{activeView === "roles" && (
				<div className="space-y-3">
					{ROLES_LIST.map((role) => {
						const isExpanded = expandedRole === role.id;
						const memberCount = usersPerRole[role.id] ?? 0;
						const modules = getAccessibleModules(role.id);

						return (
							<div key={role.id}>
								<Card
									padding="md"
									hover
									className={cn(
										"cursor-pointer border-l-4",
										ROLE_BORDER[role.id],
										"border border-gray-200 dark:border-gray-700",
									)}
									onClick={() => setExpandedRole(isExpanded ? null : role.id)}
								>
									<div className="flex items-center gap-4">
										{/* Role badge */}
										<span
											className={cn(
												"inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
												ROLE_BADGE_CLASSES[role.id],
											)}
										>
											{role.label}
										</span>

										{/* Level */}
										<span className="hidden rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-500 sm:inline dark:bg-gray-700 dark:text-gray-400">
											Lvl {role.level}
										</span>

										{/* Description */}
										<p className="hidden flex-1 truncate text-xs text-gray-500 md:block dark:text-gray-400">
											{ROLE_DESCRIPTIONS[role.id]}
										</p>

										{/* Module count */}
										<Badge variant="neutral" showDot={false}>
											{modules.length} modules
										</Badge>

										{/* Member count */}
										<span className="text-xs text-gray-500 dark:text-gray-400">
											{memberCount} membre{memberCount !== 1 ? "s" : ""}
										</span>

										{/* Chevron */}
										<Icon
											name={isExpanded ? "chevronUp" : "chevronDown"}
											size="sm"
											className="text-gray-400"
										/>
									</div>
								</Card>

								{/* Expanded: modules + permissions */}
								{isExpanded && (
									<div
										className={cn(
											"mt-1 rounded-lg border bg-gray-50 p-5",
											"border-gray-200 dark:border-gray-700 dark:bg-gray-800/50",
										)}
									>
										{/* Description */}
										<p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
											{ROLE_DESCRIPTIONS[role.id]}
										</p>

										{/* Members */}
										<div className="mb-4">
											<p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
												Membres ({memberCount})
											</p>
											<div className="flex flex-wrap gap-2">
												{users
													.filter((u) => u.roleId === role.id)
													.map((u) => (
														<span
															key={u.id}
															className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200"
														>
															<span
																className={cn(
																	"flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold",
																	getAvatarBg(u.pseudo),
																)}
															>
																{u.pseudo.charAt(0)}
															</span>
															{u.pseudo}
														</span>
													))}
												{memberCount === 0 && (
													<span className="text-xs text-gray-400">Aucun membre</span>
												)}
											</div>
										</div>

										{/* Module permissions grid */}
										<p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
											Permissions par module
										</p>
										<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
											{ALL_MODULES.map((mod) => {
												const perms = getPermissionsForModule(role.id, mod);
												const hasAccess = perms.length > 0;

												return (
													<div
														key={mod}
														className={cn(
															"flex items-center gap-3 rounded-lg border px-3 py-2",
															hasAccess
																? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
																: "border-gray-100 bg-gray-50/50 opacity-40 dark:border-gray-800 dark:bg-gray-900/30",
														)}
													>
														<span
															className={cn(
																"h-2 w-2 shrink-0 rounded-full",
																hasAccess
																	? "bg-emerald-400"
																	: "bg-gray-300 dark:bg-gray-600",
															)}
														/>
														<span
															className={cn(
																"min-w-[120px] text-xs font-medium",
																hasAccess
																	? "text-gray-900 dark:text-white"
																	: "text-gray-400",
															)}
														>
															{MODULE_LABELS[mod]}
														</span>
														<div className="flex flex-wrap gap-1">
															{perms.map((p) => (
																<span
																	key={p}
																	className={cn(
																		"rounded px-1.5 py-0.5 text-[10px] font-medium",
																		PERM_COLORS[p],
																	)}
																>
																	{PERMISSION_LABELS[p]}
																</span>
															))}
														</div>
													</div>
												);
											})}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}

			{/* Permission Matrix */}
			{activeView === "matrix" && (
				<Card padding="lg">
					<SectionHeaderBanner
						icon="shield"
						title="Matrice des permissions"
						accentColor="red"
						className="mb-4"
					/>

					{/* Legend */}
					<div className="mb-4 flex flex-wrap gap-3">
						{Object.entries(PERM_COLORS).map(([perm, cls]) => (
							<span key={perm} className={cn("rounded px-2 py-0.5 text-[10px] font-medium", cls)}>
								{PERMISSION_LABELS[perm as keyof typeof PERMISSION_LABELS]}
							</span>
						))}
						<span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-400 dark:bg-gray-700">
							Aucun acces
						</span>
					</div>

					{/* Matrix table */}
					<div className="overflow-x-auto">
						<table className="w-full border-collapse text-xs">
							{/* Header: Roles */}
							<thead>
								<tr>
									<th className="sticky left-0 z-10 min-w-[140px] border-r border-b border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-500 dark:border-gray-700 dark:bg-gray-800">
										Module
									</th>
									{ROLES_LIST.map((role) => (
										<th
											key={role.id}
											className="min-w-[120px] border-b border-gray-200 px-2 py-2 text-center dark:border-gray-700"
										>
											<span
												className={cn(
													"inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
													ROLE_BADGE_CLASSES[role.id],
												)}
											>
												{role.label}
											</span>
										</th>
									))}
								</tr>
							</thead>

							{/* Modules x Roles */}
							<tbody>
								{ALL_MODULES.map((mod, idx) => (
									<tr
										key={mod}
										className={cn(
											idx % 2 === 0
												? "bg-white dark:bg-gray-900"
												: "bg-gray-50/50 dark:bg-gray-800/50",
										)}
									>
										{/* Module name */}
										<td className="sticky left-0 z-10 border-r border-gray-200 bg-inherit px-3 py-2.5 font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200">
											{MODULE_LABELS[mod]}
										</td>

										{/* Permission cells per role */}
										{ROLES_LIST.map((role) => {
											const perms = getPermissionsForModule(role.id, mod);
											const hasManage = perms.includes("manage");

											return (
												<td
													key={role.id}
													className="border-gray-200 px-2 py-2.5 text-center dark:border-gray-700"
												>
													{perms.length === 0 ? (
														<span className="text-gray-300 dark:text-gray-600">--</span>
													) : hasManage ? (
														<span
															className={cn(
																"rounded px-1.5 py-0.5 text-[10px] font-medium",
																PERM_COLORS.manage,
															)}
														>
															Tout
														</span>
													) : (
														<div className="flex flex-wrap justify-center gap-0.5">
															{perms.map((p) => (
																<span
																	key={p}
																	className={cn(
																		"rounded px-1 py-0.5 text-[9px] font-medium",
																		PERM_COLORS[p],
																	)}
																	title={PERMISSION_LABELS[p]}
																>
																	{p.charAt(0).toUpperCase()}
																</span>
															))}
														</div>
													)}
												</td>
											);
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Entity access summary */}
					<div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
						<SectionHeaderBanner
							icon="shield"
							title="Accès aux entités par rôle"
							accentColor="red"
							className="mb-3"
						/>
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
							{ROLES_LIST.map((role) => {
								const roleUsers = users.filter((u) => u.roleId === role.id);
								const hasWildcard = roleUsers.some((u) => u.entityAccess.includes("*"));

								return (
									<div
										key={role.id}
										className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
									>
										<div className="mb-2 flex items-center gap-2">
											<span
												className={cn(
													"rounded-full px-2 py-0.5 text-[10px] font-semibold",
													ROLE_BADGE_CLASSES[role.id],
												)}
											>
												{role.label}
											</span>
										</div>
										{hasWildcard ? (
											<span className="text-xs text-purple-500">Toutes les entités</span>
										) : (
											<div className="flex flex-wrap gap-1">
												{ENTITIES.map((entity) => {
													const usersWithAccess = roleUsers.filter((u) =>
														u.entityAccess.includes(entity.id),
													);
													if (usersWithAccess.length === 0) return null;

													return (
														<span
															key={entity.id}
															className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium"
															style={{
																backgroundColor: entity.color + "20",
																color: entity.color,
															}}
														>
															<span
																className="h-1.5 w-1.5 rounded-full"
																style={{ backgroundColor: entity.color }}
															/>
															{entity.name}
															<span className="ml-0.5 opacity-60">
																({usersWithAccess.length})
															</span>
														</span>
													);
												})}
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</Card>
			)}
		</PageContainer>
	);
}
