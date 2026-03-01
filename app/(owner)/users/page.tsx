"use client";

// React
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Icon, Badge } from "@/components/ui";
import { TEAM_TEXT_COLORS, type Team } from "@/core/config/teams";
import { getEntities } from "@/features/users/data";
import { DIVISION_ICONS } from "@/features/users/types";
import type { UserProfile } from "@/features/users/types";
import { cn } from "@/lib/utils/cn";


const ENTITIES = ["Toutes", ...getEntities()] as const;
const TEAMS = ["Toutes", "Owner", "Executive", "Marsha Team", "Legacy", "Talent", "Momentum", "Squad"] as const;
const STATUSES = ["Tous", "Actif", "Inactif"] as const;

const TEAM_AVATAR_BG: Record<string, string> = {
	Owner: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
	Executive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
	"Marsha Team": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
	Legacy: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
	Talent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
	Momentum: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
	Squad: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

// Entity header colors
const ENTITY_COLORS: Record<string, { border: string; text: string; bg: string }> = {
	Bazalthe: {
		border: "border-primary-300 dark:border-primary-700",
		text: "text-primary-600 dark:text-primary-400",
		bg: "bg-primary-50 dark:bg-primary-900/10",
	},
	Inoxtag: {
		border: "border-purple-300 dark:border-purple-700",
		text: "text-purple-600 dark:text-purple-400",
		bg: "bg-purple-50 dark:bg-purple-900/10",
	},
	Doigby: {
		border: "border-emerald-300 dark:border-emerald-700",
		text: "text-emerald-600 dark:text-emerald-400",
		bg: "bg-emerald-50 dark:bg-emerald-900/10",
	},
	Michou: {
		border: "border-amber-300 dark:border-amber-700",
		text: "text-amber-600 dark:text-amber-400",
		bg: "bg-amber-50 dark:bg-amber-900/10",
	},
	Anthony: {
		border: "border-blue-300 dark:border-blue-700",
		text: "text-blue-600 dark:text-blue-400",
		bg: "bg-blue-50 dark:bg-blue-900/10",
	},
};

// Shared select classes
const selectClasses = cn(
	"rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
	"text-gray-700 shadow-sm transition-all duration-200",
	"focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
	"dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
);

/**
 * Users directory page with entity, team and status filtering.
 * @returns The users list page grouped by entity
 */
export default function UsersPage() {
	const router = useRouter();

	// Users state
	const [users] = useState<UserProfile[]>([]);

	// Filter state
	const [entityFilter, setEntityFilter] = useState<string>("Toutes");
	const [teamFilter, setTeamFilter] = useState<string>("Toutes");
	const [statusFilter, setStatusFilter] = useState<string>("Tous");
	const [search, setSearch] = useState("");

	// Filtered users
	const filteredUsers = useMemo(() => {
		return users.filter((u) => {
			if (entityFilter !== "Toutes" && u.entity !== entityFilter) return false;
			if (teamFilter !== "Toutes" && u.team !== teamFilter) return false;
			if (statusFilter === "Actif" && u.status !== "active") return false;
			if (statusFilter === "Inactif" && u.status !== "inactive") return false;
			if (search.trim() && !u.pseudo.toLowerCase().includes(search.trim().toLowerCase())) return false;
			return true;
		});
	}, [entityFilter, teamFilter, statusFilter, search, users]);

	// Group users by entity
	const groupedUsers = useMemo(() => {
		const groups: Record<string, typeof filteredUsers> = {};
		for (const user of filteredUsers) {
			if (!groups[user.entity]) groups[user.entity] = [];
			groups[user.entity].push(user);
		}
		return groups;
	}, [filteredUsers]);

	// Check if we're viewing a single entity
	const isSingleEntity = entityFilter !== "Toutes";
	const entityKeys = Object.keys(groupedUsers).sort();

	return (
		<PageContainer
			title="Utilisateurs"
			description="Gérez les membres de votre organisation"
			actions={
				<button
					className={cn(
						"inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white",
						"bg-primary-600 hover:bg-primary-700 shadow-sm transition-all duration-200",
						"focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 focus:outline-none",
						"dark:ring-offset-gray-900",
					)}
				>
					<Icon name="plus" size="sm" />
					Ajouter un utilisateur
				</button>
			}
		>
			{/* Filters bar */}
			<div
				className={cn(
					"mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4",
					"shadow-sm dark:border-gray-700 dark:bg-gray-800",
				)}
			>
				{/* Entity */}
				<select
					value={entityFilter}
					onChange={(e) => setEntityFilter(e.target.value)}
					className={selectClasses}
					aria-label="Filtrer par entité"
				>
					{ENTITIES.map((e) => (
						<option key={e} value={e}>
							{e === "Toutes" ? "Entité : Toutes" : e}
						</option>
					))}
				</select>

				{/* Team */}
				<select
					value={teamFilter}
					onChange={(e) => setTeamFilter(e.target.value)}
					className={selectClasses}
					aria-label="Filtrer par team"
				>
					{TEAMS.map((t) => (
						<option key={t} value={t}>
							{t === "Toutes" ? "Team : Toutes" : t}
						</option>
					))}
				</select>

				{/* Status */}
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className={selectClasses}
					aria-label="Filtrer par statut"
				>
					{STATUSES.map((s) => (
						<option key={s} value={s}>
							{s === "Tous" ? "Statut : Tous" : s}
						</option>
					))}
				</select>

				{/* Search */}
				<div className="relative ml-auto min-w-[200px] flex-1 sm:flex-none">
					<Icon
						name="search"
						size="sm"
						className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500"
					/>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Rechercher un pseudo..."
						className={cn(
							"w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-9 text-sm",
							"text-gray-700 shadow-sm transition-all duration-200",
							"focus:border-primary-500 focus:ring-primary-500 placeholder:text-gray-400 focus:ring-1 focus:outline-none",
							"dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500",
						)}
					/>
				</div>
			</div>

			{/* Result count */}
			<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
				{filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? "s" : ""}
			</p>

			{/* Empty state */}
			{filteredUsers.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 dark:border-gray-600">
					<Icon name="users" size="xl" className="mb-3 text-gray-300 dark:text-gray-600" />
					<p className="text-sm text-gray-500 dark:text-gray-400">Aucun utilisateur trouvé.</p>
				</div>
			) : isSingleEntity ? (
				// Single entity: flat grid
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{filteredUsers.map((user) => (
						<UserMiniCard key={user.id} user={user} onClick={() => router.push(`/users/${user.id}`)} />
					))}
				</div>
			) : (
				// Multiple entities: grouped by entity
				<div className="space-y-6">
					{entityKeys.map((entity) => {
						const users = groupedUsers[entity];
						const colors = ENTITY_COLORS[entity] || {
							border: "border-gray-300",
							text: "text-gray-600",
							bg: "bg-gray-50",
						};

						return (
							<div key={entity}>
								{/* Entity header */}
								<div
									className={cn(
										"mb-3 flex items-center gap-3 rounded-lg border-l-4 px-4 py-2.5",
										colors.border,
										colors.bg,
									)}
								>
									<span className={cn("text-sm font-bold", colors.text)}>{entity}</span>
									<Badge variant="neutral" showDot={false}>
										{users.length}
									</Badge>
								</div>

								{/* User cards grid */}
								<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
									{users.map((user) => (
										<UserMiniCard
											key={user.id}
											user={user}
											onClick={() => router.push(`/users/${user.id}`)}
										/>
									))}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</PageContainer>
	);
}

// Compact user card with division badge
function UserMiniCard({ user, onClick }: { user: UserProfile; onClick: () => void }) {
	const teamColor = TEAM_TEXT_COLORS[user.team as Team] ?? "text-gray-500";
	const avatarBg = TEAM_AVATAR_BG[user.team] ?? "bg-gray-100 text-gray-700";
	const initial = user.pseudo.charAt(0).toUpperCase();
	const divisionIcon = DIVISION_ICONS[user.division];

	return (
		<Card hover padding="sm" onClick={onClick} className="transition-all duration-200">
			<div className="flex items-center gap-2.5">
				{/* Division badge */}
				<div className="flex shrink-0 flex-col items-center">
					<Image
						src={divisionIcon}
						alt={`Division ${user.division}`}
						width={22}
						height={22}
						className="opacity-80"
					/>
				</div>

				{/* Avatar */}
				{user.avatar ? (
					<Image
						src={user.avatar}
						alt={user.pseudo}
						width={34}
						height={34}
						className="shrink-0 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
					/>
				) : (
					<div
						className={cn(
							"flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-xs font-bold",
							avatarBg,
						)}
					>
						{initial}
					</div>
				)}

				{/* Info */}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-1.5">
						<span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
							{user.pseudo}
						</span>
						<span
							className={cn(
								"inline-block h-1.5 w-1.5 shrink-0 rounded-full",
								user.status === "active" ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600",
							)}
							title={user.status === "active" ? "Actif" : "Inactif"}
						/>
					</div>
					<p className={cn("truncate text-xs font-medium", teamColor)}>{user.team}</p>
				</div>
			</div>
		</Card>
	);
}
