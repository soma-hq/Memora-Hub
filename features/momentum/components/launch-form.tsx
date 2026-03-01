"use client";

import { useState } from "react";
import { Button, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { LaunchSessionFormData } from "../types";

// Props for the LaunchForm component
interface LaunchFormProps {
	onSubmit: (data: LaunchSessionFormData) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

// Available entity
const ENTITIES = [
	{ value: "Inoxtag", label: "Inoxtag" },
	{ value: "Michou", label: "Michou" },
	{ value: "Doigby", label: "Doigby" },
	{ value: "Anthony", label: "Anthony" },
];

// Shared select field classes
const selectClasses = cn(
	"w-full rounded-lg border px-3 py-2.5 text-sm transition-colors duration-200 appearance-none",
	"border-gray-300 bg-white text-gray-900",
	"focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none",
	"dark:border-gray-600 dark:bg-gray-800 dark:text-white",
	"dark:focus:border-primary-500 dark:focus:ring-primary-900/30",
	"disabled:cursor-not-allowed disabled:opacity-50",
);

// Shared input field classes
const inputClasses = cn(
	"w-full rounded-lg border px-3 py-2.5 text-sm transition-colors duration-200",
	"border-gray-300 bg-white text-gray-900 placeholder-gray-400",
	"focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none",
	"dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
	"dark:focus:border-primary-500 dark:focus:ring-primary-900/30",
	"disabled:cursor-not-allowed disabled:opacity-50",
);

// Shared label classes
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

/**
 * PIM session launch form
 * @param props.onSubmit - Submit callback with form data
 * @param props.onCancel - Cancel handler
 * @param props.isLoading - Loading state flag
 * @returns Session launch form
 */

export function LaunchForm({ onSubmit, onCancel, isLoading = false }: LaunchFormProps) {
	// State
	const [entity, setEntity] = useState("");
	const [startDate, setStartDate] = useState("");

	// Computed
	const isValid = entity.length > 0 && startDate.length > 0;

	// Handlers
	/**
	 * Validates and submits the form
	 * @param e - Form submit event
	 */

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!isValid || isLoading) return;
		onSubmit({ entity, startDate });
	}

	// Render
	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Entity select */}
			<div>
				<label htmlFor="launch-entity" className={labelClasses}>
					Entite
				</label>
				<div className="relative">
					<select
						id="launch-entity"
						value={entity}
						onChange={(e) => setEntity(e.target.value)}
						className={selectClasses}
						disabled={isLoading}
					>
						<option value="">Selectionner une entite...</option>
						{ENTITIES.map((e) => (
							<option key={e.value} value={e.value}>
								{e.label}
							</option>
						))}
					</select>
					<Icon
						name="chevronDown"
						size="sm"
						className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
					/>
				</div>
			</div>

			{/* Start date */}
			<div>
				<label htmlFor="launch-date" className={labelClasses}>
					Date de debut
				</label>
				<input
					id="launch-date"
					type="date"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
					className={inputClasses}
					disabled={isLoading}
				/>
			</div>

			{/* Actions */}
			<div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
				<Button type="button" variant="cancel" size="sm" onClick={onCancel} disabled={isLoading}>
					Annuler
				</Button>
				<Button
					type="submit"
					variant="primary"
					size="sm"
					isLoading={isLoading}
					disabled={!isValid || isLoading}
				>
					<Icon name="sparkles" size="sm" />
					Lancer la session
				</Button>
			</div>
		</form>
	);
}
