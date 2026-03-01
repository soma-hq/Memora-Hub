"use client";

// React
import { useState } from "react";
import { Input, Textarea, Select, Button, Card, Icon } from "@/components/ui";
import type { Task, TaskFormData, TaskStatusValue, TaskPriorityValue } from "../types";
import { TaskStatusLabel, TaskPriorityLabel } from "../types";


/** Props for the TaskForm component */
interface TaskFormProps {
	task?: Task;
	onSubmit: (data: TaskFormData) => void;
	onCancel: () => void;
	isLoading?: boolean;
	className?: string;
}

/** Status options for select input */
const statusOptions = Object.entries(TaskStatusLabel).map(([value, label]) => ({ label, value }));

/** Priority options for select input */
const priorityOptions = Object.entries(TaskPriorityLabel).map(([value, label]) => ({ label, value }));

/** Project options for select input */
const projectOptions = [
	{ label: "Refonte UI", value: "proj-1" },
	{ label: "Backend API", value: "proj-2" },
	{ label: "Infrastructure", value: "proj-3" },
];

/** Assignee options for select input */
const assigneeOptions = [
	{ label: "Sophie Martin", value: "Sophie Martin" },
	{ label: "Lucas Dupont", value: "Lucas Dupont" },
	{ label: "Amelie Rousseau", value: "Amelie Rousseau" },
	{ label: "Thomas Bernard", value: "Thomas Bernard" },
];

/**
 * Form for creating or editing a task
 * @param props - Component props
 * @param props.task - Existing task for edit mode, undefined for create mode
 * @param props.onSubmit - Callback triggered on valid form submission
 * @param props.onCancel - Callback to cancel the form
 * @param props.isLoading - Whether the form is in a loading state
 * @param props.className - Additional CSS classes
 * @returns Task creation or edition form
 */
export function TaskForm({ task, onSubmit, onCancel, isLoading, className }: TaskFormProps) {
	// Computed
	const isEditing = !!task;

	// State
	const [formData, setFormData] = useState<TaskFormData>({
		title: task?.title ?? "",
		description: task?.description ?? "",
		status: task?.status ?? "todo",
		priority: task?.priority ?? "medium",
		assignee: task?.assignee.name ?? "",
		dueDate: task?.dueDate ?? "",
		projectId: task?.projectId ?? "",
	});

	const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

	// Handlers
	/**
	 * Updates a single form field and clears its error
	 * @param field - Field name to update
	 * @param value - New field value
	 * @returns Nothing
	 */
	function handleChange(field: keyof TaskFormData, value: string) {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	}

	/**
	 * Validates required form fields
	 * @returns True if form is valid
	 */
	function validate(): boolean {
		const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

		if (!formData.title.trim()) {
			newErrors.title = "Le titre est requis";
		}
		if (!formData.assignee) {
			newErrors.assignee = "L'assigne est requis";
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
		onSubmit(formData);
	}

	// Render
	return (
		<Card padding="lg" className={className}>
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="flex items-center gap-2 border-b border-gray-200 pb-4 dark:border-gray-700">
					<Icon name="tasks" size="lg" className="text-primary-500" />
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
						{isEditing ? "Modifier la tache" : "Nouvelle tache"}
					</h2>
				</div>

				<Input
					label="Titre"
					placeholder="Entrez le titre de la tache"
					value={formData.title}
					onChange={(e) => handleChange("title", e.target.value)}
					error={errors.title}
				/>

				<Textarea
					label="Description"
					placeholder="Decrivez la tache en detail..."
					value={formData.description}
					onChange={(e) => handleChange("description", e.target.value)}
				/>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Select
						label="Statut"
						options={statusOptions}
						value={formData.status}
						onChange={(e) => handleChange("status", e.target.value as TaskStatusValue)}
					/>
					<Select
						label="Priorite"
						options={priorityOptions}
						value={formData.priority}
						onChange={(e) => handleChange("priority", e.target.value as TaskPriorityValue)}
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Select
						label="Assigne"
						options={assigneeOptions}
						value={formData.assignee}
						onChange={(e) => handleChange("assignee", e.target.value)}
						placeholder="Selectionner un assigne"
						error={errors.assignee}
					/>
					<Select
						label="Projet"
						options={projectOptions}
						value={formData.projectId}
						onChange={(e) => handleChange("projectId", e.target.value)}
						placeholder="Selectionner un projet"
					/>
				</div>

				<Input
					label="Date d'echeance"
					type="date"
					value={formData.dueDate}
					onChange={(e) => handleChange("dueDate", e.target.value)}
					icon={<Icon name="calendar" size="sm" />}
				/>

				<div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
					<Button type="button" variant="ghost" onClick={onCancel}>
						Annuler
					</Button>
					<Button type="submit" isLoading={isLoading}>
						<Icon name="check" size="sm" />
						{isEditing ? "Enregistrer" : "Creer la tache"}
					</Button>
				</div>
			</form>
		</Card>
	);
}
