"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/feedback/modal";
import { Button } from "@/components/ui/actions/button";
import { UserForm } from "./user-form";
import { createUserAction } from "../actions";
import type { CreateUserFormData } from "@/lib/validators/schemas";

interface CreateUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

/**
 * Modal for creating new user accounts
 * Handles form submission, loading state, and success/error feedback
 */
export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (data: CreateUserFormData) => {
		setIsLoading(true);
		try {
			const result = await createUserAction(data);

			if (result.success) {
				toast.success(`Compte créé : ${data.email}`);
				onClose();
				onSuccess?.();
			} else {
				toast.error(result.error || "Erreur lors de la création du compte");
			}
		} catch (error) {
			console.error("User creation error:", error);
			toast.error("Une erreur s'est produite lors de la création du compte");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Créer un nouveau compte"
			description="Remplissez les informations pour créer un nouvel utilisateur"
			size="lg"
		>
			<UserForm
				onSubmit={handleSubmit}
				onCancel={onClose}
				isLoading={isLoading}
			/>
		</Modal>
	);
}
