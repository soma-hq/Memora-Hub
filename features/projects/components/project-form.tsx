"use client";

// React
import { useState } from "react";
import { Input, Textarea, Select, Button, Icon, Avatar } from "@/components/ui";
import type { Project, ProjectFormData, ProjectMember, ProjectStatusValue } from "../types";
import { ProjectStatusLabel } from "../types";


/** Status options for select input */
const STATUS_OPTIONS = Object.entries(ProjectStatusLabel).map(([value, label]) => ({ label, value }));

/** Props for the ProjectForm component */
interface ProjectFormProps {
	project?: Project;
	onSubmit: (data: ProjectFormData) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

/**
 * Form for creating or editing a project with member management
 * @param props - Component props
 * @param props.project - Existing project for edit mode, undefined for create mode
 * @param props.onSubmit - Callback triggered on valid form submission
 * @param props.onCancel - Callback to cancel the form
 * @param props.isLoading - Whether the form is in a loading state
 * @returns Project creation or edition form
 */
export function ProjectForm({ project, onSubmit, onCancel, isLoading = false }: ProjectFormProps) {
	// State
	const [name, setName] = useState(project?.name ?? "");
	const [description, setDescription] = useState(project?.description ?? "");
	const [status, setStatus] = useState<ProjectStatusValue>(project?.status ?? "todo");
	const [startDate, setStartDate] = useState(project?.startDate ?? "");
	const [endDate, setEndDate] = useState(project?.endDate ?? "");
	const [members, setMembers] = useState<ProjectMember[]>(project?.members ?? []);
	const [newMemberName, setNewMemberName] = useState("");
	const [newMemberRole, setNewMemberRole] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Computed
	const isEditing = !!project;

	// Handlers
	/**
	 * Validates all form fields and sets error messages
	 * @returns True if form is valid
	 */
	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!name.trim()) newErrors.name = "Le nom du projet est requis.";
		if (!description.trim()) newErrors.description = "La description est requise.";
		if (!startDate) newErrors.startDate = "La date de debut est requise.";
		if (!endDate) newErrors.endDate = "La date de fin est requise.";
		if (startDate && endDate && startDate > endDate) {
			newErrors.endDate = "La date de fin doit etre apres la date de debut.";
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
			startDate,
			endDate,
			members,
		});
	}

	/**
	 * Adds a member to the project members list
	 * @returns Nothing
	 */
	function addMember() {
		if (!newMemberName.trim() || !newMemberRole.trim()) return;

		setMembers((prev) => [...prev, { userId: "", name: newMemberName.trim(), role: newMemberRole.trim() }]);
		setNewMemberName("");
		setNewMemberRole("");
	}

	/**
	 * Removes a member from the project by index
	 * @param index - Index of the member to remove
	 * @returns Nothing
	 */
	function removeMember(index: number) {
		setMembers((prev) => prev.filter((_, i) => i !== index));
	}

	// Render
	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<Input
				label="Nom du projet"
				placeholder="Ex: Refonte site vitrine"
				value={name}
				onChange={(e) => setName(e.target.value)}
				error={errors.name}
			/>

			<Textarea
				label="Description"
				placeholder="Decrivez les objectifs et le perimetre du projet..."
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				error={errors.description}
			/>

			<Select
				label="Statut"
				options={STATUS_OPTIONS}
				value={status}
				onChange={(e) => setStatus(e.target.value as ProjectStatusValue)}
			/>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Input
					label="Date de debut"
					type="date"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
					error={errors.startDate}
				/>
				<Input
					label="Date de fin"
					type="date"
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
					error={errors.endDate}
				/>
			</div>

			<div className="flex flex-col gap-3">
				<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Membres du projet</span>

				{members.length > 0 && (
					<div className="flex flex-col gap-2">
						{members.map((member, index) => (
							<div
								key={index}
								className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/50"
							>
								<Avatar name={member.name} size="xs" />
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
										{member.name}
									</p>
									<p className="truncate text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
								</div>
								<button
									type="button"
									onClick={() => removeMember(index)}
									className="hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 shrink-0 rounded-md p-1 text-gray-400 transition-colors"
								>
									<Icon name="close" size="xs" />
								</button>
							</div>
						))}
					</div>
				)}

				<div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-end">
					<div className="flex-1">
						<Input
							placeholder="Nom du membre"
							value={newMemberName}
							onChange={(e) => setNewMemberName(e.target.value)}
						/>
					</div>
					<div className="flex-1">
						<Input
							placeholder="Role"
							value={newMemberRole}
							onChange={(e) => setNewMemberRole(e.target.value)}
						/>
					</div>
					<Button
						type="button"
						variant="outline-neutral"
						size="md"
						onClick={addMember}
						disabled={!newMemberName.trim() || !newMemberRole.trim()}
					>
						<Icon name="plus" size="xs" />
						Ajouter
					</Button>
				</div>
			</div>

			<div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
				<Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
					Annuler
				</Button>
				<Button type="submit" variant="primary" isLoading={isLoading}>
					<Icon name="check" size="xs" />
					{isEditing ? "Mettre a jour" : "Creer le projet"}
				</Button>
			</div>
		</form>
	);
}
