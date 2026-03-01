// Components
import { Card, Badge, Icon, Avatar, Tooltip } from "@/components/ui";
import type { BadgeVariant } from "@/core/design/states";


interface UserCardProps {
	user: {
		id: string;
		name: string;
		email: string;
		role: string;
		avatar: string;
		group: string;
		status: "active" | "inactive";
	};
	onEdit?: () => void;
	onDelete?: () => void;
}

const roleVariant: Record<string, BadgeVariant> = {
	Owner: "primary",
	Admin: "info",
	Manager: "warning",
	Collaborator: "success",
	Guest: "neutral",
};

/**
 * Displays a user row with avatar, role badge, status, and action buttons.
 * @param {UserCardProps} props - Component props
 * @param {UserCardProps["user"]} props.user - User data to display
 * @param {() => void} [props.onEdit] - Callback when edit button is clicked
 * @param {() => void} [props.onDelete] - Callback when delete button is clicked
 * @returns {JSX.Element} User card component
 */
export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
	return (
		<Card hover padding="md">
			<div className="flex items-center gap-4">
				{/* Avatar */}
				<Avatar src={user.avatar} name={user.name} size="lg" />

				{/* Info */}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<p className="truncate font-medium text-gray-900 dark:text-white">{user.name}</p>
						<Badge variant={roleVariant[user.role] || "neutral"} showDot={false}>
							{user.role}
						</Badge>
					</div>
					<p className="truncate text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
					<p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
						<Icon name="group" size="xs" />
						{user.group}
					</p>
				</div>

				{/* Status */}
				<div className="flex shrink-0 items-center gap-2">
					<Badge variant={user.status === "active" ? "success" : "neutral"}>
						{user.status === "active" ? "Actif" : "Inactif"}
					</Badge>
				</div>

				{/* Actions */}
				<div className="flex shrink-0 items-center gap-1">
					<Tooltip content="Modifier">
						<button
							onClick={onEdit}
							className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
						>
							<Icon name="edit" size="sm" />
						</button>
					</Tooltip>
					<Tooltip content="Supprimer">
						<button
							onClick={onDelete}
							className="hover:bg-error-50 dark:hover:bg-error-900/20 hover:text-error-600 dark:hover:text-error-500 rounded-lg p-2 text-gray-400 transition-all duration-200"
						>
							<Icon name="delete" size="sm" />
						</button>
					</Tooltip>
				</div>
			</div>
		</Card>
	);
}
