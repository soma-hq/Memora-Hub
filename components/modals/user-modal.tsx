"use client";

// React
import { useState } from "react";
import { Modal, ModalFooter, Button, Input, Select, Icon, Badge, Divider } from "@/components/ui";
import { showSuccess, showError } from "@/lib/utils/toast";
import type { BadgeVariant } from "@/core/design/states";


interface GroupAccess {
	groupId: string;
	groupName: string;
	role: string;
}

interface UserModalProps {
	isOpen: boolean;
	onClose: () => void;
	user?: {
		id: string;
		name: string;
		email: string;
		role: string;
		groupAccess?: GroupAccess[];
	};
}

const roleOptions = [
	{ label: "Owner", value: "Owner" },
	{ label: "Admin", value: "Admin" },
	{ label: "Manager", value: "Manager" },
	{ label: "Collaborateur", value: "Collaborator" },
	{ label: "Invite", value: "Guest" },
];

const availableGroups = [
	{ label: "Bazalthe", value: "bazalthe" },
	{ label: "Inoxtag", value: "inoxtag" },
];

const roleVariant: Record<string, BadgeVariant> = {
	Owner: "primary",
	Admin: "info",
	Manager: "warning",
	Collaborator: "success",
	Guest: "neutral",
};

/**
 * Modal form to create or edit a user with per-group role assignment.
 * @param {UserModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Callback to close the modal
 * @param {UserModalProps["user"]} [props.user] - Existing user data for edit mode
 * @returns {JSX.Element} User creation/edit modal
 */
export function UserModal({ isOpen, onClose, user }: UserModalProps) {
	// State
	const isEdit = !!user;
	const [isLoading, setIsLoading] = useState(false);
	const [groupAccess, setGroupAccess] = useState<GroupAccess[]>(
		user?.groupAccess || [{ groupId: "bazalthe", groupName: "Bazalthe", role: "Collaborator" }],
	);

	// Handlers
	/**
	 * Adds a new group access entry for an unassigned group.
	 * @returns {void}
	 */
	const addGroupAccess = () => {
		const usedIds = groupAccess.map((g) => g.groupId);
		const available = availableGroups.find((g) => !usedIds.includes(g.value));
		if (available) {
			setGroupAccess([
				...groupAccess,
				{ groupId: available.value, groupName: available.label, role: "Collaborator" },
			]);
		}
	};

	/**
	 * Removes a group access entry by index.
	 * @param {number} index - Index of the entry to remove
	 * @returns {void}
	 */
	const removeGroupAccess = (index: number) => {
		setGroupAccess(groupAccess.filter((_, i) => i !== index));
	};

	/**
	 * Updates the role for a specific group access entry.
	 * @param {number} index - Index of the entry to update
	 * @param {string} role - New role value
	 * @returns {void}
	 */
	const updateGroupRole = (index: number, role: string) => {
		const updated = [...groupAccess];
		updated[index] = { ...updated[index], role };
		setGroupAccess(updated);
	};

	/**
	 * Changes which group is assigned at the given index.
	 * @param {number} index - Index of the entry to update
	 * @param {string} groupId - New group ID
	 * @returns {void}
	 */
	const updateGroupId = (index: number, groupId: string) => {
		const group = availableGroups.find((g) => g.value === groupId);
		if (group) {
			const updated = [...groupAccess];
			updated[index] = { ...updated[index], groupId, groupName: group.label };
			setGroupAccess(updated);
		}
	};

	/**
	 * Submits the user form with simulated async save.
	 * @param {React.FormEvent} e - Form submit event
	 * @returns {Promise<void>} Resolves when save completes
	 * @throws {Error} If the save operation fails
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await new Promise((r) => setTimeout(r, 1000));
			showSuccess(isEdit ? "Utilisateur modifie" : "Utilisateur cree");
			onClose();
		} catch {
			showError("Une erreur est survenue");
		} finally {
			setIsLoading(false);
		}
	};

	// Render
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
			description={
				isEdit
					? "Modifiez les informations et les acces de l'utilisateur."
					: "Remplissez les informations et definissez les acces par groupement."
			}
			size="lg"
		>
			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Personal info */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Input label="Prenom" placeholder="John" defaultValue={user?.name?.split(" ")[0]} required />
					<Input label="Nom" placeholder="Doe" defaultValue={user?.name?.split(" ")[1]} required />
				</div>
				<Input label="Email" type="email" placeholder="john@memora.hub" defaultValue={user?.email} required />

				{!isEdit && (
					<Input
						label="Mot de passe"
						type="password"
						placeholder="Mot de passe temporaire"
						required
						hint="Minimum 8 caracteres"
					/>
				)}

				{/* Per-group access */}
				<Divider label="Acces par groupement" className="pt-2" />

				<div className="space-y-3">
					{groupAccess.map((access, idx) => (
						<div
							key={idx}
							className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
						>
							<div className="bg-primary-100 dark:bg-primary-900/20 shrink-0 rounded-lg p-2">
								<Icon name="group" size="sm" className="text-primary-500" />
							</div>

							<div className="min-w-0 flex-1">
								<Select
									options={availableGroups}
									value={access.groupId}
									onChange={(e) => updateGroupId(idx, e.target.value)}
								/>
							</div>

							<div className="w-40 shrink-0">
								<Select
									options={roleOptions}
									value={access.role}
									onChange={(e) => updateGroupRole(idx, e.target.value)}
								/>
							</div>

							<Badge
								variant={roleVariant[access.role] || "neutral"}
								showDot={false}
								className="hidden shrink-0 sm:flex"
							>
								{access.role}
							</Badge>

							{groupAccess.length > 1 && (
								<button
									type="button"
									onClick={() => removeGroupAccess(idx)}
									className="hover:bg-error-50 hover:text-error-500 shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors"
								>
									<Icon name="close" size="sm" />
								</button>
							)}
						</div>
					))}

					{groupAccess.length < availableGroups.length && (
						<button
							type="button"
							onClick={addGroupAccess}
							className="hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:border-primary-400 dark:hover:bg-primary-900/10 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-400 transition-all duration-200 dark:border-gray-600"
						>
							<Icon name="plus" size="sm" />
							Ajouter un acces groupement
						</button>
					)}
				</div>

				{/* Info note */}
				<div className="border-info-200 bg-info-50 dark:border-info-700/30 dark:bg-info-900/10 rounded-lg border p-3">
					<div className="flex gap-2">
						<Icon name="info" size="sm" className="text-info-500 mt-0.5 shrink-0" />
						<p className="text-info-700 dark:text-info-400 text-xs">
							Chaque groupement a ses propres acces. Un utilisateur peut avoir un role different dans
							chaque groupement auquel il appartient.
						</p>
					</div>
				</div>

				<ModalFooter>
					<Button variant="cancel" type="button" onClick={onClose}>
						Annuler
					</Button>
					<Button type="submit" isLoading={isLoading}>
						{isEdit ? "Enregistrer" : "Creer l'utilisateur"}
					</Button>
				</ModalFooter>
			</form>
		</Modal>
	);
}
