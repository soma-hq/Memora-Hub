"use client";

// React
import { useState } from "react";
import { Input, Textarea, Select, Button } from "@/components/ui";
import type { Group, GroupFormData, GroupStatus } from "@/features/groups/types";
import { GroupStatus as GroupStatusEnum } from "@/constants";


/** Props for the GroupForm component */
interface GroupFormProps {
	group?: Group | null;
	onSubmit: (data: GroupFormData) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

/** Status options for select input */
const statusOptions = [
	{ label: "Actif", value: GroupStatusEnum.Active },
	{ label: "Inactif", value: GroupStatusEnum.Inactive },
];

/**
 * Form for creating or editing a group
 * @param props - Component props
 * @param props.group - Existing group for edit mode, null for create mode
 * @param props.onSubmit - Callback triggered on valid form submission
 * @param props.onCancel - Callback to cancel the form
 * @param props.isLoading - Whether the form is in a loading state
 * @returns Group creation or edition form
 */
export function GroupForm({ group, onSubmit, onCancel, isLoading = false }: GroupFormProps) {
	// State
	const [name, setName] = useState(group?.name ?? "");
	const [description, setDescription] = useState(group?.description ?? "");
	const [status, setStatus] = useState<GroupStatus>(group?.status ?? GroupStatusEnum.Active);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Computed
	const isEditing = !!group;

	// Handlers
	/**
	 * Validates form fields and sets error messages
	 * @returns True if form is valid
	 */
	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!name.trim()) {
			newErrors.name = "Le nom du groupe est requis.";
		} else if (name.trim().length < 3) {
			newErrors.name = "Le nom doit contenir au moins 3 caracteres.";
		}

		if (!description.trim()) {
			newErrors.description = "La description est requise.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	/**
	 * Handles form submission after validation
	 * @param e - Form event
	 * @returns Nothing
	 */
	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!validate()) return;

		onSubmit({
			name: name.trim(),
			description: description.trim(),
			status,
		});
	}

	// Render
	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5">
			<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
				{isEditing ? "Modifier le groupe" : "Creer un groupe"}
			</h2>

			<Input
				label="Nom du groupe"
				placeholder="Ex : Equipe Produit"
				value={name}
				onChange={(e) => setName(e.target.value)}
				error={errors.name}
			/>

			<Textarea
				label="Description"
				placeholder="Decrivez l'objectif de ce groupe..."
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				error={errors.description}
			/>

			<Select
				label="Statut"
				options={statusOptions}
				value={status}
				onChange={(e) => setStatus(e.target.value as GroupStatus)}
			/>

			<div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
				<Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
					Annuler
				</Button>
				<Button type="submit" isLoading={isLoading}>
					{isEditing ? "Enregistrer" : "Creer le groupe"}
				</Button>
			</div>
		</form>
	);
}
