"use client";

// React
import { useState } from "react";
import { Avatar, Badge, Button, Icon, Input, Select, EmptyState, Tag } from "@/components/ui";
import type { GroupMember, GroupRole } from "@/features/groups/types";
import { roleVariantMap, roleLabelMap } from "@/features/groups/types";
import type { BadgeVariant } from "@/core/design/states";


/** Props for the GroupMembers component */
interface GroupMembersProps {
	members: GroupMember[];
	onAddMember?: (member: Omit<GroupMember, "id">) => void;
	onRemoveMember?: (memberId: string) => void;
	readOnly?: boolean;
}

/** Role options for the add member form */
const roleOptions = [
	{ label: "Administrateur", value: "admin" },
	{ label: "Gestionnaire", value: "manager" },
	{ label: "Collaborateur", value: "collaborator" },
	{ label: "Invite", value: "guest" },
];

/**
 * Displays group members with search, add, and remove capabilities
 * @param props - Component props
 * @param props.members - Array of group members
 * @param props.onAddMember - Callback to add a new member
 * @param props.onRemoveMember - Callback to remove a member by ID
 * @param props.readOnly - Disables add and remove actions
 * @returns Member list with management controls
 */
export function GroupMembers({ members, onAddMember, onRemoveMember, readOnly = false }: GroupMembersProps) {
	// State
	const [showAddForm, setShowAddForm] = useState(false);
	const [newName, setNewName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newRole, setNewRole] = useState<GroupRole>("collaborator");
	const [searchMember, setSearchMember] = useState("");

	// Computed
	const filteredMembers = searchMember.trim()
		? members.filter(
				(m) =>
					m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
					m.email.toLowerCase().includes(searchMember.toLowerCase()),
			)
		: members;

	// Handlers
	/**
	 * Submits new member data and resets the form
	 * @returns Nothing
	 */
	function handleAddMember() {
		if (!newName.trim() || !newEmail.trim()) return;

		onAddMember?.({
			name: newName.trim(),
			email: newEmail.trim(),
			role: newRole,
		});

		setNewName("");
		setNewEmail("");
		setNewRole("collaborator");
		setShowAddForm(false);
	}

	/**
	 * Cancels member addition and resets the form
	 * @returns Nothing
	 */
	function handleCancelAdd() {
		setNewName("");
		setNewEmail("");
		setNewRole("collaborator");
		setShowAddForm(false);
	}

	// Render
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h3 className="text-sm font-semibold text-gray-900 dark:text-white">Membres</h3>
					<Tag color="gray">{members.length}</Tag>
				</div>
				{!readOnly && !showAddForm && (
					<Button size="sm" variant="outline-neutral" onClick={() => setShowAddForm(true)}>
						<Icon name="plus" size="xs" />
						Ajouter
					</Button>
				)}
			</div>

			{showAddForm && (
				<div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
					<p className="text-sm font-medium text-gray-700 dark:text-gray-300">Nouveau membre</p>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<Input placeholder="Nom complet" value={newName} onChange={(e) => setNewName(e.target.value)} />
						<Input
							placeholder="Adresse email"
							type="email"
							value={newEmail}
							onChange={(e) => setNewEmail(e.target.value)}
						/>
					</div>
					<Select
						label="Role"
						options={roleOptions}
						value={newRole}
						onChange={(e) => setNewRole(e.target.value as GroupRole)}
					/>
					<div className="flex items-center justify-end gap-2">
						<Button size="sm" variant="ghost" onClick={handleCancelAdd}>
							Annuler
						</Button>
						<Button size="sm" onClick={handleAddMember} disabled={!newName.trim() || !newEmail.trim()}>
							Ajouter le membre
						</Button>
					</div>
				</div>
			)}

			{members.length > 3 && (
				<Input
					placeholder="Rechercher un membre..."
					value={searchMember}
					onChange={(e) => setSearchMember(e.target.value)}
					icon={<Icon name="search" size="sm" className="text-gray-400" />}
				/>
			)}

			{filteredMembers.length === 0 ? (
				<EmptyState
					icon="users"
					title="Aucun membre"
					description={
						searchMember
							? "Aucun membre ne correspond a votre recherche."
							: "Ce groupe n'a pas encore de membres."
					}
				/>
			) : (
				<ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
					{filteredMembers.map((member) => (
						<MemberRow
							key={member.id}
							member={member}
							onRemove={
								!readOnly && member.role !== "owner" ? () => onRemoveMember?.(member.id) : undefined
							}
						/>
					))}
				</ul>
			)}
		</div>
	);
}

/** Props for the MemberRow component */
interface MemberRowProps {
	member: GroupMember;
	onRemove?: () => void;
}

/**
 * Single member row with avatar, info, role badge, and remove action
 * @param props - Component props
 * @param props.member - Member data to display
 * @param props.onRemove - Callback to remove this member
 * @returns Member row element
 */
function MemberRow({ member, onRemove }: MemberRowProps) {
	// Computed
	const variant: BadgeVariant = roleVariantMap[member.role as GroupRole] ?? "neutral";
	const label = roleLabelMap[member.role as GroupRole] ?? member.role;

	// Render
	return (
		<li className="flex items-center justify-between gap-3 py-3">
			<div className="flex min-w-0 items-center gap-3">
				<Avatar name={member.name} src={member.avatar ?? null} size="sm" />
				<div className="min-w-0">
					<p className="truncate text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
					<p className="truncate text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
				</div>
			</div>

			<div className="flex shrink-0 items-center gap-2">
				<Badge variant={variant}>{label}</Badge>
				{onRemove && (
					<button
						type="button"
						onClick={onRemove}
						className="hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-900/30 dark:hover:text-error-400 rounded-md p-1 text-gray-400 transition-colors"
						title="Retirer du groupe"
					>
						<Icon name="close" size="xs" />
					</button>
				)}
			</div>
		</li>
	);
}
