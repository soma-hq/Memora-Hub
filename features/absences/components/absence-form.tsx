"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Input, Select, Textarea, Icon } from "@/components/ui";
import type { AbsenceFormData, AbsenceTypeValue } from "../types";
import { absenceTypeOptions } from "../types";


/** Props for the AbsenceForm component */
interface AbsenceFormProps {
	onSubmit: (data: AbsenceFormData) => void | Promise<void>;
	onCancel?: () => void;
	isLoading?: boolean;
	className?: string;
}

/**
 * New absence request form
 * @param props - Component props
 * @param props.onSubmit - Submit callback
 * @param props.onCancel - Cancel callback
 * @param props.isLoading - Loading state
 * @param props.className - Additional CSS classes
 * @returns Absence request form
 */

export function AbsenceForm({ onSubmit, onCancel, isLoading = false, className }: AbsenceFormProps) {
	// State
	const [type, setType] = useState<AbsenceTypeValue>("conge_paye");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [reason, setReason] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Handlers
	/**
	 * Validate form fields
	 * @returns True if form is valid
	 */
	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!startDate) {
			newErrors.startDate = "La date de debut est requise";
		}
		if (!endDate) {
			newErrors.endDate = "La date de fin est requise";
		}
		if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
			newErrors.endDate = "La date de fin doit etre apres la date de debut";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	/**
	 * Submit after validation and reset
	 * @param e - Form event
	 * @returns Nothing
	 */
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!validate()) return;

		await onSubmit({
			type,
			startDate,
			endDate,
			reason: reason.trim() || undefined,
		});

		setType("conge_paye");
		setStartDate("");
		setEndDate("");
		setReason("");
		setErrors({});
	}

	// Render
	return (
		<Card className={className}>
			<form onSubmit={handleSubmit}>
				<CardHeader>
					<div className="flex items-center gap-3">
						<Icon name="plus" size="md" className="text-primary-500" />
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							Nouvelle demande d&apos;absence
						</h2>
					</div>
				</CardHeader>

				<CardBody>
					<div className="space-y-4">
						<Select
							label="Type d'absence"
							options={[...absenceTypeOptions]}
							value={type}
							onChange={(e) => setType(e.target.value as AbsenceTypeValue)}
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
								hint="Identique a la date de debut pour un seul jour"
							/>
						</div>

						<Textarea
							label="Motif (optionnel)"
							placeholder="Indiquez la raison de votre absence..."
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							rows={3}
						/>
					</div>
				</CardBody>

				<CardFooter>
					{onCancel && (
						<Button type="button" variant="ghost" size="md" onClick={onCancel} disabled={isLoading}>
							Annuler
						</Button>
					)}
					<Button type="submit" variant="primary" size="md" isLoading={isLoading} disabled={isLoading}>
						<Icon name="check" size="sm" />
						Soumettre la demande
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
