"use client";

// Components
import { Card, Input, Badge, Icon, AvatarGroup, EmptyState } from "@/components/ui";
import type { Group } from "@/features/groups/types";
import { statusVariantMap, statusLabelMap } from "@/features/groups/types";


/** Props for the GroupList component */
interface GroupListProps {
	groups: Group[];
	search: string;
	onSearchChange: (value: string) => void;
	onSelect?: (group: Group) => void;
	onCreateNew?: () => void;
}

/**
 * Searchable grid of group cards with empty state
 * @param props - Component props
 * @param props.groups - Array of groups to display
 * @param props.search - Current search query
 * @param props.onSearchChange - Callback when search query changes
 * @param props.onSelect - Callback when a group card is clicked
 * @param props.onCreateNew - Callback to create a new group
 * @returns Group list with search bar and card grid
 */
export function GroupList({ groups, search, onSearchChange, onSelect, onCreateNew }: GroupListProps) {
	// Render
	return (
		<div className="flex flex-col gap-6">
			<div className="max-w-md">
				<Input
					placeholder="Rechercher un groupe..."
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					icon={<Icon name="search" size="sm" className="text-gray-400" />}
				/>
			</div>

			{groups.length === 0 ? (
				<EmptyState
					icon="group"
					title="Aucun groupe trouve"
					description={
						search
							? "Aucun groupe ne correspond a votre recherche. Essayez avec d'autres termes."
							: "Vous n'avez pas encore de groupes. Creez-en un pour commencer."
					}
					actionLabel={!search ? "Creer un groupe" : undefined}
					onAction={!search ? onCreateNew : undefined}
				/>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{groups.map((group) => (
						<GroupCard key={group.id} group={group} onClick={() => onSelect?.(group)} />
					))}
				</div>
			)}
		</div>
	);
}

/** Props for the GroupCard component */
interface GroupCardProps {
	group: Group;
	onClick?: () => void;
}

/**
 * Card displaying group summary with members, projects, and status
 * @param props - Component props
 * @param props.group - Group data to display
 * @param props.onClick - Callback when card is clicked
 * @returns Group summary card
 */
function GroupCard({ group, onClick }: GroupCardProps) {
	// Computed
	const avatarUsers = group.members.map((m) => ({
		name: m.name,
		src: m.avatar ?? null,
	}));

	// Render
	return (
		<Card hover padding="lg" onClick={onClick}>
			<div className="flex flex-col gap-4">
				<div className="flex items-start justify-between gap-3">
					<div className="flex min-w-0 items-center gap-2.5">
						<div className="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
							<Icon name="group" size="md" className="text-primary-600 dark:text-primary-400" />
						</div>
						<h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{group.name}</h3>
					</div>
					<Badge variant={statusVariantMap[group.status]}>{statusLabelMap[group.status]}</Badge>
				</div>

				<p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{group.description}</p>

				{group.members.length > 0 && <AvatarGroup users={avatarUsers} max={5} size="sm" />}

				<div className="flex items-center gap-4 border-t border-gray-200 pt-3 dark:border-gray-700">
					<div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
						<Icon name="users" size="xs" />
						<span>
							{group.members.length} {group.members.length > 1 ? "membres" : "membre"}
						</span>
					</div>
					<div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
						<Icon name="folder" size="xs" />
						<span>
							{group.projects} {group.projects > 1 ? "projets" : "projet"}
						</span>
					</div>
					<div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
						<Icon name="calendar" size="xs" />
						<span>{group.createdAt}</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
