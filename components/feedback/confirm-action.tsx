"use client";

// React
import { useState } from "react";
import { Modal, ModalFooter, Button } from "@/components/ui";


interface ConfirmActionProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void | Promise<void>;
	title: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "danger" | "warning" | "primary";
}

const variantMap = {
	danger: "outline-danger" as const,
	warning: "soft-warning" as const,
	primary: "primary" as const,
};

/**
 * Modal dialog that asks the user to confirm a potentially destructive action.
 * @param {ConfirmActionProps} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Callback to close the modal
 * @param {() => void | Promise<void>} props.onConfirm - Callback executed on confirmation
 * @param {string} props.title - Modal heading
 * @param {string} [props.description] - Optional description text
 * @param {string} [props.confirmText="Confirmer"] - Confirm button label
 * @param {string} [props.cancelText="Annuler"] - Cancel button label
 * @param {"danger" | "warning" | "primary"} [props.variant="danger"] - Visual style of the confirm button
 * @returns {JSX.Element} Confirmation modal
 */
export function ConfirmAction({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	confirmText = "Confirmer",
	cancelText = "Annuler",
	variant = "danger",
}: ConfirmActionProps) {
	// State
	const [isLoading, setIsLoading] = useState(false);

	// Handlers
	/**
	 * Executes the confirm callback with loading state management.
	 * @returns {Promise<void>} Resolves when confirmation is complete
	 */
	const handleConfirm = async () => {
		setIsLoading(true);
		try {
			await onConfirm();
			onClose();
		} finally {
			setIsLoading(false);
		}
	};

	// Render
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title} description={description} size="sm">
			<ModalFooter>
				<Button variant="cancel" onClick={onClose} disabled={isLoading}>
					{cancelText}
				</Button>
				<Button variant={variantMap[variant]} onClick={handleConfirm} isLoading={isLoading}>
					{confirmText}
				</Button>
			</ModalFooter>
		</Modal>
	);
}
