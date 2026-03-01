"use client";

import { useState, useMemo } from "react";
import { Input, SelectMenu, Badge, Icon, Avatar, Card, Button, Pagination, EmptyState, SkeletonTable, Tooltip } from "@/components/ui";
import type { SelectMenuOption } from "@/components/ui";
import type { User } from "@/features/users/types";
import type { UserRole } from "@/constants";
import { roleVariant, roleOptions, statusLabels } from "@/features/users/types";


const ITEMS_PER_PAGE = 6;

/** Role filter options including a "show all" entry */
const ROLE_FILTER_OPTIONS: SelectMenuOption[] = [
	{ label: "Tous les roles", value: "", icon: "filter" },
	...roleOptions.map((opt) => ({ label: opt.label, value: opt.value, icon: "profile" }) as SelectMenuOption),
];

/** Props for the UserList component */
interface UserListProps {
	users: User[];
	isLoading?: boolean;
	search: string;
	onSearchChange: (value: string) => void;
	roleFilter: string;
	onRoleFilterChange: (value: string) => void;
	onEdit?: (user: User) => void;
	onDelete?: (user: User) => void;
	onCreate?: () => void;
}

/**
 * Paginated user list with role filtering
 * @param props - Component props
 * @param props.users - Array of users to display
 * @param props.isLoading - Loading state for skeleton display
 * @param props.search - Current search query
 * @param props.onSearchChange - Search query change callback
 * @param props.roleFilter - Current role filter value
 * @param props.onRoleFilterChange - Role filter change callback
 * @param props.onEdit - Edit user callback
 * @param props.onDelete - Delete user callback
 * @param props.onCreate - Create user callback
 * @returns User list with search, filters, and pagination
 */
export function UserList({
	users,
	isLoading = false,
	search,
	onSearchChange,
	roleFilter,
	onRoleFilterChange,
	onEdit,
	onDelete,
	onCreate,
}: UserListProps) {
	// State
	const [currentPage, setCurrentPage] = useState(1);

	// Handlers
	/**
	 * Updates search and resets to first page
	 * @param value - New search query
	 */
	const handleSearchChange = (value: string) => {
		onSearchChange(value);
		setCurrentPage(1);
	};

	/**
	 * Updates role filter and resets to first page
	 * @param value - New role filter value
	 */
	const handleRoleFilterChange = (value: string) => {
		onRoleFilterChange(value);
		setCurrentPage(1);
	};

	// Computed
	const totalPages = Math.max(1, Math.ceil(users.length / ITEMS_PER_PAGE));

	const paginatedUsers = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return users.slice(start, start + ITEMS_PER_PAGE);
	}, [users, currentPage]);

	// Render
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
					<div className="max-w-sm flex-1">
						<Input
							placeholder="Rechercher un utilisateur..."
							value={search}
							onChange={(e) => handleSearchChange(e.target.value)}
							icon={<Icon name="search" size="sm" />}
						/>
					</div>

					<div className="w-full sm:w-48">
						<SelectMenu
							options={ROLE_FILTER_OPTIONS}
							value={roleFilter}
							onChange={(val) => handleRoleFilterChange(val as string)}
							triggerIcon="filter"
							placeholder="Tous les roles"
						/>
					</div>
				</div>

				{onCreate && (
					<Button onClick={onCreate} size="md">
						<Icon name="plus" size="sm" />
						Nouvel utilisateur
					</Button>
				)}
			</div>

			<div className="flex items-center justify-between">
				<p className="text-sm text-gray-400">
					{users.length} utilisateur{users.length !== 1 ? "s" : ""} trouve{users.length !== 1 ? "s" : ""}
				</p>
				{(search || roleFilter) && (
					<button
						onClick={() => {
							handleSearchChange("");
							handleRoleFilterChange("");
						}}
						className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors"
					>
						Réinitialiser les filtres
					</button>
				)}
			</div>

			{isLoading && <SkeletonTable rows={ITEMS_PER_PAGE} />}

			{!isLoading && users.length === 0 && (
				<EmptyState
					icon="users"
					title="Aucun utilisateur trouve"
					description={
						search || roleFilter
							? "Essayez de modifier vos critères de recherche ou de filtre."
							: "Commencez par ajouter un premier utilisateur a votre equipe."
					}
					actionLabel={!search && !roleFilter ? "Nouvel utilisateur" : undefined}
					onAction={!search && !roleFilter ? onCreate : undefined}
				/>
			)}

			{!isLoading && users.length > 0 && (
				<div className="space-y-3">
					{paginatedUsers.map((user) => (
						<Card key={user.id} hover padding="md">
							<div className="flex items-center gap-4">
								<Avatar src={user.avatar || null} name={user.name} size="lg" />

								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<p className="truncate font-medium text-gray-900 dark:text-white">
											{user.name}
										</p>
										<Badge
											variant={roleVariant[user.role as UserRole] || "neutral"}
											showDot={false}
										>
											{user.role}
										</Badge>
									</div>
									<p className="truncate text-sm text-gray-400">{user.email}</p>
									<p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
										<Icon name="group" size="xs" />
										{user.group}
										{user.groupAccess && user.groupAccess.length > 1 && (
											<span className="text-gray-300 dark:text-gray-600">
												{" "}
												+{user.groupAccess.length - 1} autre
												{user.groupAccess.length - 1 > 1 ? "s" : ""}
											</span>
										)}
									</p>
								</div>

								<div className="hidden shrink-0 items-center sm:flex">
									<Badge variant={user.status === "active" ? "success" : "neutral"}>
										{statusLabels[user.status]}
									</Badge>
								</div>

								<div className="flex shrink-0 items-center gap-1">
									{onEdit && (
										<Tooltip content="Modifier">
											<button
												onClick={() => onEdit(user)}
												className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
											>
												<Icon name="edit" size="sm" />
											</button>
										</Tooltip>
									)}
									{onDelete && (
										<Tooltip content="Supprimer">
											<button
												onClick={() => onDelete(user)}
												className="hover:bg-error-50 hover:text-error-600 rounded-lg p-2 text-gray-400 transition-all duration-200"
											>
												<Icon name="delete" size="sm" />
											</button>
										</Tooltip>
									)}
								</div>
							</div>
						</Card>
					))}
				</div>
			)}

			{!isLoading && totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					className="pt-2"
				/>
			)}
		</div>
	);
}
