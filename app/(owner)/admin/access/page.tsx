"use client";

// React
import { useState, useMemo, useCallback } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Button, Tag, Tabs } from "@/components/ui";
import { TEAMS, TEAM_DESCRIPTIONS, TEAM_TEXT_COLORS, TEAM_SCOPE, TEAM_HIERARCHY, type Team } from "@/core/config/teams";

const accessUsers: Record<string, Record<string, unknown>> = {};

// Utils & hooks
import { cn } from "@/lib/utils/cn";
import { showSuccess, showWarning, showError } from "@/lib/utils/toast";

type AccessLevel = "owner" | "marsha_teams" | "legacy" | "talent_momentum" | "standard";
type PageAccessMode = "read_only" | "editable" | "full_access";

interface AccessUser {
	id: string;
	pseudo: string;
	team: string;
	accessLevel: AccessLevel;
	role?: string;
	entities: string[];
	pages: Record<string, PageAccessMode>;
}

interface CorbeilleEntry {
	user: AccessUser;
	type: "archived" | "restricted" | "deleted";
	duration?: string;
	date: Date;
}

interface MockUser {
	id: string;
	name: string;
	entity: string;
	team: Team;
	status: "active" | "inactive";
}

const parsedUsers: AccessUser[] = Object.entries(accessUsers).map(([id, user]) => ({
	id,
	pseudo: (user as Record<string, unknown>).pseudo as string,
	team: (user as Record<string, unknown>).team as string,
	accessLevel: (user as Record<string, unknown>).accessLevel as AccessLevel,
	role: (user as Record<string, unknown>).role as string | undefined,
	entities: (user as Record<string, unknown>).entities as string[],
	pages: (user as Record<string, unknown>).pages as Record<string, PageAccessMode>,
}));

const teamSortOrder: Record<string, number> = {
	"Marsha Team": 0,
	Legacy: 1,
	Talent: 2,
	Momentum: 3,
	Squad: 4,
	Owner: 5,
};

const accessLevelColors: Record<AccessLevel, { row: string; badge: string; label: string }> = {
	owner: {
		row: "border-l-4 border-l-red-500",
		badge: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
		label: "Owner",
	},
	marsha_teams: {
		row: "border-l-4 border-l-purple-500",
		badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
		label: "Marsha Teams",
	},
	legacy: {
		row: "border-l-4 border-l-amber-500",
		badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
		label: "Legacy",
	},
	talent_momentum: {
		row: "border-l-4 border-l-emerald-500",
		badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
		label: "Talent / Momentum",
	},
	standard: {
		row: "border-l-4 border-l-gray-400",
		badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
		label: "Standard",
	},
};

const pageAccessConfig: Record<PageAccessMode, { color: "gray" | "info" | "success"; label: string }> = {
	read_only: { color: "gray", label: "Lecture seule" },
	editable: { color: "info", label: "Editable" },
	full_access: { color: "success", label: "Accès complet" },
};

const permissionCycle: Record<PageAccessMode, PageAccessMode> = {
	read_only: "editable",
	editable: "full_access",
	full_access: "read_only",
};

const allTeams = ["Tous", ...Array.from(new Set(parsedUsers.map((u) => u.team)))];
const allAccessLevels: { value: string; label: string }[] = [
	{ value: "all", label: "Tous les niveaux" },
	{ value: "marsha_teams", label: "Marsha Teams" },
	{ value: "legacy", label: "Legacy" },
	{ value: "talent_momentum", label: "Talent / Momentum" },
	{ value: "standard", label: "Standard" },
	{ value: "owner", label: "Owner" },
];

// Restriction duration options
const restrictDurations = [
	{ value: "24h", label: "24 heures" },
	{ value: "7j", label: "7 jours" },
	{ value: "30j", label: "30 jours" },
	{ value: "indefini", label: "Indéfini" },
];

// Shared select classes with red accent
const selectClasses = cn(
	"rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
	"text-gray-700 shadow-sm transition-all duration-200",
	"focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500",
	"dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
);

// --- Teams section constants ---
const TEAM_DOT: Record<Team, string> = {
	Owner: "bg-primary-500",
	Executive: "bg-red-500",
	"Marsha Team": "bg-purple-500",
	Legacy: "bg-amber-500",
	Talent: "bg-emerald-500",
	Momentum: "bg-blue-500",
	Squad: "bg-gray-400",
};

const AVATAR_BG: Record<string, string> = {
	A: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	B: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
	C: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
	D: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	E: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
	F: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
	G: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
	H: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
	I: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
	J: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
	K: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
	L: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
	M: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
	N: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
	R: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
	T: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function getAvatarBg(name: string) {
	const letter = name.charAt(0).toUpperCase();
	return AVATAR_BG[letter] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
}

const ORDERED_TEAMS = Object.values(TEAMS).sort((a, b) => TEAM_HIERARCHY[b] - TEAM_HIERARCHY[a]);

// View tabs
const VIEW_TABS = [
	{ id: "access" as const, label: "Accès" },
	{ id: "teams" as const, label: "Teams" },
];

/**
 * Unified permissions page: user access management + team hierarchy.
 * @returns The admin access control page
 */
export default function AdminAccessPage() {
	// View state
	const [activeView, setActiveView] = useState<"access" | "teams">("access");

	// Access state
	const [teamFilter, setTeamFilter] = useState("Tous");
	const [levelFilter, setLevelFilter] = useState("all");
	const [expandedUser, setExpandedUser] = useState<string | null>(null);

	// Editable permissions state
	const [userPermissions, setUserPermissions] = useState<Record<string, Record<string, PageAccessMode>>>(() => {
		const initial: Record<string, Record<string, PageAccessMode>> = {};
		for (const user of parsedUsers) {
			initial[user.id] = { ...user.pages };
		}
		return initial;
	});

	// Corbeille state
	const [corbeille, setCorbeille] = useState<CorbeilleEntry[]>([]);
	const corbeilleIds = useMemo(() => new Set(corbeille.map((e) => e.user.id)), [corbeille]);

	// Restrict UI state
	const [restrictingUser, setRestrictingUser] = useState<string | null>(null);

	// Delete confirm UI state
	const [confirmDeleteUser, setConfirmDeleteUser] = useState<string | null>(null);

	// Teams state
	const [teamMembers] = useState<MockUser[]>([]);
	const [expandedTeam, setExpandedTeam] = useState<Team | null>(null);

	const membersByTeam = useMemo(() => {
		const map: Record<string, MockUser[]> = {};
		for (const team of ORDERED_TEAMS) {
			map[team] = teamMembers.filter((u) => u.team === team);
		}
		return map;
	}, [teamMembers]);

	const toggleTeam = (team: Team) => {
		setExpandedTeam((prev) => (prev === team ? null : team));
	};

	const cyclePermission = useCallback((userId: string, page: string) => {
		setUserPermissions((prev) => {
			const current = prev[userId]?.[page];
			if (!current) return prev;
			const next = permissionCycle[current];
			return {
				...prev,
				[userId]: {
					...prev[userId],
					[page]: next,
				},
			};
		});
		showSuccess("Permission mise à jour");
	}, []);

	const handleArchive = useCallback((user: AccessUser) => {
		setCorbeille((prev) => [...prev, { user, type: "archived", date: new Date() }]);
		setExpandedUser(null);
		showWarning(`${user.pseudo} a été archivé`);
	}, []);

	const handleRestrict = useCallback((user: AccessUser, duration: string) => {
		setCorbeille((prev) => [...prev, { user, type: "restricted", duration, date: new Date() }]);
		setRestrictingUser(null);
		setExpandedUser(null);
		showWarning(`${user.pseudo} a été restreint (${duration})`);
	}, []);

	const handleDelete = useCallback((user: AccessUser) => {
		setCorbeille((prev) => [...prev, { user, type: "deleted", date: new Date() }]);
		setConfirmDeleteUser(null);
		setExpandedUser(null);
		showError(`${user.pseudo} a été supprimé (réversible 30 jours)`);
	}, []);

	const filteredUsers = useMemo(() => {
		return parsedUsers
			.filter((u) => {
				if (corbeilleIds.has(u.id)) return false;
				if (teamFilter !== "Tous" && u.team !== teamFilter) return false;
				if (levelFilter !== "all" && u.accessLevel !== levelFilter) return false;
				return true;
			})
			.sort((a, b) => {
				const orderA = teamSortOrder[a.team] ?? 99;
				const orderB = teamSortOrder[b.team] ?? 99;
				if (orderA !== orderB) return orderA - orderB;
				return a.pseudo.localeCompare(b.pseudo);
			});
	}, [teamFilter, levelFilter, corbeilleIds]);

	return (
		<PageContainer title="Permissions & Accès" description="Gestion des rôles, teams et accès détaillés">
			{/* View tabs */}
			<div className="mb-6 border-b border-gray-200 dark:border-gray-700">
				<Tabs
					tabs={VIEW_TABS}
					activeTab={activeView}
					onTabChange={(id) => setActiveView(id as "access" | "teams")}
					variant="underline"
				/>
			</div>

			{activeView === "teams" ? (
				/* ═══ Teams hierarchy section ═══ */
				<Card padding="lg">
					<div className="mb-4 flex items-center gap-2">
						<Icon name="shield" size="md" className="text-gray-500 dark:text-gray-400" />
						<h3 className="text-base font-semibold text-gray-900 dark:text-white">Teams</h3>
					</div>

					<div className="divide-y divide-gray-100 dark:divide-gray-700/50">
						{ORDERED_TEAMS.map((team) => {
							const members = membersByTeam[team] || [];
							const isOpen = expandedTeam === team;

							return (
								<div key={team}>
									{/* Team row */}
									<div className="flex items-center gap-4 py-3.5">
										{/* Color dot */}
										<span className={cn("h-3 w-3 shrink-0 rounded-full", TEAM_DOT[team])} />

										{/* Name + description */}
										<div className="min-w-0 flex-1">
											<p className={cn("text-sm font-semibold", TEAM_TEXT_COLORS[team])}>
												{team}
											</p>
											<p className="truncate text-xs text-gray-500 dark:text-gray-400">
												{TEAM_DESCRIPTIONS[team]}
											</p>
										</div>

										{/* Scope badge */}
										<span className="hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500 sm:inline dark:bg-gray-700 dark:text-gray-400">
											{TEAM_SCOPE[team] === "all" ? "Toutes entités" : "Entité spécifique"}
										</span>

										{/* Member count */}
										<span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
											{members.length} membre{members.length !== 1 ? "s" : ""}
										</span>

										{/* View members button */}
										<Button
											variant="ghost"
											size="sm"
											onClick={() => toggleTeam(team)}
											className="shrink-0"
										>
											<Icon name={isOpen ? "chevronDown" : "chevronRight"} size="xs" />
											{isOpen ? "Masquer" : "Voir"}
										</Button>
									</div>

									{/* Expanded members list */}
									{isOpen && (
										<div className="mb-3 ml-7 rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700/50 dark:bg-gray-800/30">
											{members.length === 0 ? (
												<p className="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
													Aucun membre dans cette team.
												</p>
											) : (
												<div className="space-y-1">
													{members.map((user) => (
														<div
															key={user.id}
															className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/40"
														>
															{/* Avatar initial */}
															<span
																className={cn(
																	"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
																	getAvatarBg(user.name),
																)}
															>
																{user.name.charAt(0)}
															</span>

															{/* Name + entity */}
															<div className="min-w-0 flex-1">
																<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
																	{user.name}
																</p>
																<p className="text-xs text-gray-500 dark:text-gray-400">
																	{user.entity}
																</p>
															</div>

															{/* Status dot */}
															<span
																className={cn(
																	"h-2 w-2 shrink-0 rounded-full",
																	user.status === "active"
																		? "bg-emerald-400"
																		: "bg-gray-300 dark:bg-gray-600",
																)}
															/>
														</div>
													))}
												</div>
											)}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</Card>
			) : (
				/* ═══ Access management section ═══ */
				<>
					{/* Filters */}
					<div
						className={cn(
							"mb-6 flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 shadow-sm",
							"border-red-200 dark:border-red-900/40 dark:bg-gray-800",
						)}
					>
						<select
							value={teamFilter}
							onChange={(e) => setTeamFilter(e.target.value)}
							className={cn(selectClasses, teamFilter !== "Tous" && "border-red-400 ring-1 ring-red-400")}
							aria-label="Filtrer par team"
						>
							{allTeams.map((t) => (
								<option key={t} value={t}>
									{t === "Tous" ? "Team : Toutes" : t}
								</option>
							))}
						</select>

						<select
							value={levelFilter}
							onChange={(e) => setLevelFilter(e.target.value)}
							className={cn(selectClasses, levelFilter !== "all" && "border-red-400 ring-1 ring-red-400")}
							aria-label="Filtrer par niveau d'accès"
						>
							{allAccessLevels.map((l) => (
								<option key={l.value} value={l.value}>
									{l.value === "all" ? "Niveau : Tous" : l.label}
								</option>
							))}
						</select>

						{/* Reset filters */}
						{(teamFilter !== "Tous" || levelFilter !== "all") && (
							<button
								onClick={() => {
									setTeamFilter("Tous");
									setLevelFilter("all");
								}}
								className="rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
							>
								Réinitialiser
							</button>
						)}

						<span className="ml-auto text-sm text-gray-400">
							{filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? "s" : ""}
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
						<span className="w-28">Team</span>
						<span className="w-36">Niveau d&apos;accès</span>
						<span className="w-40">Entités</span>
						<span className="w-24 text-center"># Pages</span>
						<span className="flex-1 text-right">Détails</span>
					</div>

					{/* User rows */}
					<div className="space-y-2">
						{filteredUsers.map((user) => {
							const colors = accessLevelColors[user.accessLevel];
							const isExpanded = expandedUser === user.id;
							const permissions = userPermissions[user.id] ?? user.pages;
							const pageCount = Object.keys(permissions).length;

							return (
								<div key={user.id}>
									{/* Row */}
									<Card
										padding="md"
										hover
										className={cn(
											colors.row,
											"cursor-pointer border border-red-100 dark:border-red-900/20",
										)}
										onClick={() => setExpandedUser(isExpanded ? null : user.id)}
									>
										<div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
											{/* Pseudo */}
											<div className="flex w-36 items-center gap-2">
												<div
													className={cn(
														"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
														colors.badge,
													)}
												>
													{user.pseudo.charAt(0)}
												</div>
												<span className="font-semibold text-gray-900 dark:text-white">
													{user.pseudo}
												</span>
											</div>

											{/* Team */}
											<span className="w-28 text-sm text-gray-600 dark:text-gray-400">
												{user.team}
											</span>

											{/* Access level */}
											<div className="w-36">
												<span
													className={cn(
														"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
														colors.badge,
													)}
												>
													{colors.label}
												</span>
											</div>

											{/* Entities */}
											<div className="flex w-40 flex-wrap gap-1">
												{user.entities.map((entity) => (
													<span
														key={entity}
														className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
													>
														{entity}
													</span>
												))}
											</div>

											{/* Page count */}
											<div className="w-24 text-center">
												<Badge variant="neutral" showDot={false}>
													{pageCount} pages
												</Badge>
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
												"mt-1 rounded-lg border border-red-100 bg-gray-50 p-4",
												"dark:border-red-900/30 dark:bg-gray-800/50",
											)}
										>
											{/* Permissions section */}
											<p className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
												Permissions par page
												<span className="ml-2 font-normal text-gray-400 normal-case">
													(cliquer pour modifier)
												</span>
											</p>
											<div className="flex flex-wrap gap-2">
												{Object.entries(permissions).map(([page, mode]) => {
													const access = pageAccessConfig[mode];
													return (
														<button
															key={page}
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																cyclePermission(user.id, page);
															}}
															className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
														>
															<Tag color={access.color} className="pointer-events-none">
																<span className="font-medium">{page}</span>
																<span className="ml-1 opacity-70">
																	({access.label})
																</span>
															</Tag>
														</button>
													);
												})}
											</div>

											{/* Role info */}
											{user.role && (
												<p className="mt-3 text-xs text-gray-400">
													Role :{" "}
													<span className="font-medium text-gray-600 dark:text-gray-300">
														{user.role}
													</span>
												</p>
											)}

											{/* Divider */}
											<div className="my-4 border-t border-gray-200 dark:border-gray-700" />

											{/* Squad actions */}
											<p className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
												Actions
											</p>
											<div className="flex flex-wrap items-start gap-3">
												{/* Archiver */}
												<Button
													variant="ghost"
													size="sm"
													className={cn(
														"gap-1.5 border border-amber-300 bg-amber-50 text-amber-700",
														"hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40",
													)}
													onClick={(e) => {
														e.stopPropagation();
														handleArchive(user);
													}}
												>
													<Icon name="folder" size="sm" />
													Archiver
												</Button>

												{/* Restreindre */}
												{restrictingUser === user.id ? (
													<div
														className={cn(
															"flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-50 p-2",
															"dark:border-orange-700 dark:bg-orange-900/20",
														)}
														onClick={(e) => e.stopPropagation()}
													>
														<span className="text-xs font-medium text-orange-700 dark:text-orange-400">
															Durée :
														</span>
														{restrictDurations.map((d) => (
															<button
																key={d.value}
																type="button"
																onClick={(e) => {
																	e.stopPropagation();
																	handleRestrict(user, d.label);
																}}
																className={cn(
																	"rounded-md px-2 py-1 text-xs font-medium transition-colors",
																	"bg-orange-100 text-orange-700 hover:bg-orange-200",
																	"dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50",
																)}
															>
																{d.label}
															</button>
														))}
														<button
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																setRestrictingUser(null);
															}}
															className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
														>
															<Icon name="close" size="xs" />
														</button>
													</div>
												) : (
													<Button
														variant="ghost"
														size="sm"
														className={cn(
															"gap-1.5 border border-orange-300 bg-orange-50 text-orange-700",
															"hover:bg-orange-100 dark:border-orange-700 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/40",
														)}
														onClick={(e) => {
															e.stopPropagation();
															setRestrictingUser(user.id);
															setConfirmDeleteUser(null);
														}}
													>
														<Icon name="lock" size="sm" />
														Restreindre
													</Button>
												)}

												{/* Supprimer */}
												{confirmDeleteUser === user.id ? (
													<div
														className={cn(
															"flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-2",
															"dark:border-red-700 dark:bg-red-900/20",
														)}
														onClick={(e) => e.stopPropagation()}
													>
														<span className="text-xs font-medium text-red-700 dark:text-red-400">
															Confirmer la suppression ?
														</span>
														<Button
															variant="outline-danger"
															size="sm"
															onClick={(e) => {
																e.stopPropagation();
																handleDelete(user);
															}}
														>
															Oui, supprimer
														</Button>
														<button
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																setConfirmDeleteUser(null);
															}}
															className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
														>
															<Icon name="close" size="xs" />
														</button>
													</div>
												) : (
													<Button
														variant="outline-danger"
														size="sm"
														className="gap-1.5"
														onClick={(e) => {
															e.stopPropagation();
															setConfirmDeleteUser(user.id);
															setRestrictingUser(null);
														}}
													>
														<Icon name="close" size="sm" />
														Supprimer
													</Button>
												)}
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
								Aucun utilisateur ne correspond aux filtres.
							</p>
						</div>
					)}

					{/* Corbeille section */}
					{corbeille.length > 0 && (
						<div className="mt-8">
							<div className="mb-3 flex items-center gap-2">
								<Icon name="folder" size="sm" className="text-red-500" />
								<h2 className="text-sm font-semibold tracking-wider text-red-600 uppercase dark:text-red-400">
									Corbeille
								</h2>
								<span className="text-xs text-gray-400">({corbeille.length})</span>
							</div>
							<div className="space-y-2">
								{corbeille.map((entry, idx) => {
									const typeConfig = {
										archived: {
											label: "Archivé",
											tagColor: "warning" as const,
											icon: "folder" as const,
										},
										restricted: {
											label: `Restreint${entry.duration ? ` (${entry.duration})` : ""}`,
											tagColor: "error" as const,
											icon: "lock" as const,
										},
										deleted: {
											label: "Supprimé (réversible 30j)",
											tagColor: "error" as const,
											icon: "close" as const,
										},
									};
									const config = typeConfig[entry.type];

									return (
										<Card
											key={`${entry.user.id}-${idx}`}
											padding="sm"
											className="border border-gray-200 opacity-60 dark:border-gray-700"
										>
											<div className="flex items-center gap-3">
												<Icon name={config.icon} size="sm" className="text-gray-400" />
												<span className="font-medium text-gray-600 dark:text-gray-300">
													{entry.user.pseudo}
												</span>
												<Tag color={config.tagColor}>{config.label}</Tag>
												<span className="ml-auto text-xs text-gray-400">{entry.user.team}</span>
												<Button
													variant="ghost"
													size="sm"
													className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
													onClick={() => {
														setCorbeille((prev) => prev.filter((_, i) => i !== idx));
														showSuccess(`${entry.user.pseudo} a été restauré`);
													}}
												>
													Restaurer
												</Button>
											</div>
										</Card>
									);
								})}
							</div>
						</div>
					)}
				</>
			)}
		</PageContainer>
	);
}
