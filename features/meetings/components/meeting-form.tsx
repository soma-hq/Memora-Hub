"use client";

// React
import { useState } from "react";
import { Input, Select, Textarea, Button, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { MeetingTypeLabel } from "../types";
import type { Meeting, MeetingFormData, MeetingTypeValue } from "../types";


/** Props for the MeetingForm component */
interface MeetingFormProps {
	meeting?: Meeting;
	onSubmit: (data: MeetingFormData) => void;
	onCancel?: () => void;
	isLoading?: boolean;
	className?: string;
}

/** Type options for select input */
const typeOptions = Object.entries(MeetingTypeLabel).map(([value, label]) => ({ label, value }));

/** Default empty form data */
const defaultFormData: MeetingFormData = {
	title: "",
	date: "",
	startTime: "",
	endTime: "",
	location: "",
	type: "reunion",
	participants: [],
	notes: "",
	isOnline: false,
	link: "",
};

/**
 * Converts a meeting entity to form data format
 * @param meeting - Meeting to convert
 * @returns Form-compatible data object
 */
function meetingToFormData(meeting: Meeting): MeetingFormData {
	return {
		title: meeting.title,
		date: meeting.date,
		startTime: meeting.startTime,
		endTime: meeting.endTime,
		location: meeting.location,
		type: meeting.type,
		participants: meeting.participants,
		notes: meeting.notes ?? "",
		isOnline: meeting.isOnline,
		link: meeting.link ?? "",
	};
}

/**
 * Form for creating or editing a meeting with participant management
 * @param props - Component props
 * @param props.meeting - Existing meeting for edit mode, undefined for create mode
 * @param props.onSubmit - Callback triggered on valid form submission
 * @param props.onCancel - Callback to cancel the form
 * @param props.isLoading - Whether the form is in a loading state
 * @param props.className - Additional CSS classes
 * @returns Meeting creation or edition form
 */
export function MeetingForm({ meeting, onSubmit, onCancel, isLoading, className }: MeetingFormProps) {
	// Computed
	const isEditing = !!meeting;

	// State
	const [formData, setFormData] = useState<MeetingFormData>(meeting ? meetingToFormData(meeting) : defaultFormData);
	const [participantInput, setParticipantInput] = useState("");
	const [errors, setErrors] = useState<Partial<Record<keyof MeetingFormData, string>>>({});

	// Handlers
	/**
	 * Updates a single form field and clears its error
	 * @param key - Field name to update
	 * @param value - New field value
	 * @returns Nothing
	 */
	function updateField<K extends keyof MeetingFormData>(key: K, value: MeetingFormData[K]) {
		setFormData((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[key];
				return next;
			});
		}
	}

	/**
	 * Adds a participant to the list if not already present
	 * @returns Nothing
	 */
	function addParticipant() {
		const name = participantInput.trim();
		if (!name) return;
		if (formData.participants.some((p) => p.name.toLowerCase() === name.toLowerCase())) return;
		updateField("participants", [...formData.participants, { userId: "", name }]);
		setParticipantInput("");
	}

	/**
	 * Removes a participant by index
	 * @param index - Index of the participant to remove
	 * @returns Nothing
	 */
	function removeParticipant(index: number) {
		updateField(
			"participants",
			formData.participants.filter((_, i) => i !== index),
		);
	}

	/**
	 * Validates all required form fields
	 * @returns True if form is valid
	 */
	function validate(): boolean {
		const newErrors: Partial<Record<keyof MeetingFormData, string>> = {};
		if (!formData.title.trim()) newErrors.title = "Le titre est requis.";
		if (!formData.date) newErrors.date = "La date est requise.";
		if (!formData.startTime) newErrors.startTime = "L'heure de debut est requise.";
		if (!formData.endTime) newErrors.endTime = "L'heure de fin est requise.";
		if (!formData.location.trim()) newErrors.location = "Le lieu est requis.";
		if (formData.isOnline && !formData.link.trim())
			newErrors.link = "Le lien est requis pour une reunion en ligne.";
		if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
			newErrors.endTime = "L'heure de fin doit etre apres l'heure de debut.";
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
		<form onSubmit={handleSubmit} className={cn("flex flex-col gap-5", className)}>
			<Input
				label="Titre"
				placeholder="Nom de la reunion"
				value={formData.title}
				onChange={(e) => updateField("title", e.target.value)}
				error={errors.title}
			/>

			<div className="grid gap-4 sm:grid-cols-3">
				<Input
					label="Date"
					type="date"
					value={formData.date}
					onChange={(e) => updateField("date", e.target.value)}
					error={errors.date}
				/>
				<Input
					label="Heure de debut"
					type="time"
					value={formData.startTime}
					onChange={(e) => updateField("startTime", e.target.value)}
					error={errors.startTime}
				/>
				<Input
					label="Heure de fin"
					type="time"
					value={formData.endTime}
					onChange={(e) => updateField("endTime", e.target.value)}
					error={errors.endTime}
				/>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Select
					label="Type de reunion"
					options={typeOptions}
					value={formData.type}
					onChange={(e) => updateField("type", e.target.value as MeetingTypeValue)}
				/>
				<Input
					label="Lieu"
					placeholder="Salle ou plateforme"
					value={formData.location}
					onChange={(e) => updateField("location", e.target.value)}
					error={errors.location}
					icon={<Icon name="location" size="sm" />}
				/>
			</div>

			<div className="flex flex-col gap-3">
				<label className="flex cursor-pointer items-center gap-2">
					<input
						type="checkbox"
						checked={formData.isOnline}
						onChange={(e) => updateField("isOnline", e.target.checked)}
						className="text-primary-500 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
					/>
					<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reunion en ligne</span>
				</label>
				{formData.isOnline && (
					<Input
						label="Lien de la reunion"
						placeholder="https://meet.google.com/..."
						value={formData.link}
						onChange={(e) => updateField("link", e.target.value)}
						error={errors.link}
					/>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<label className="text-sm font-medium text-gray-700 dark:text-gray-300">Participants</label>
				<div className="flex gap-2">
					<Input
						placeholder="Nom du participant"
						value={participantInput}
						onChange={(e) => setParticipantInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addParticipant();
							}
						}}
					/>
					<Button type="button" variant="outline-neutral" size="md" onClick={addParticipant}>
						<Icon name="plus" size="sm" />
						Ajouter
					</Button>
				</div>
				{formData.participants.length > 0 && (
					<div className="mt-1 flex flex-wrap gap-2">
						{formData.participants.map((p, idx) => (
							<span
								key={idx}
								className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
							>
								{p.name}
								<button
									type="button"
									onClick={() => removeParticipant(idx)}
									className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
								>
									<Icon name="close" size="xs" className="text-gray-400" />
								</button>
							</span>
						))}
					</div>
				)}
			</div>

			<Textarea
				label="Notes"
				placeholder="Notes ou ordre du jour..."
				value={formData.notes}
				onChange={(e) => updateField("notes", e.target.value)}
				hint="Optionnel — ajoutez des informations complementaires."
			/>

			<div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-2 dark:border-gray-700">
				{onCancel && (
					<Button type="button" variant="ghost" onClick={onCancel}>
						Annuler
					</Button>
				)}
				<Button type="submit" isLoading={isLoading}>
					<Icon name="check" size="sm" />
					{isEditing ? "Enregistrer" : "Creer la reunion"}
				</Button>
			</div>
		</form>
	);
}
