"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, Icon, Badge, Divider, Card, Tooltip } from "@/components/ui";
import { createUserSchema, updateUserSchema } from "@/lib/validators/schemas";
import type { CreateUserFormData } from "@/lib/validators/schemas";
import { UserRoles } from "@/constants";
import type { UserRole } from "@/constants";
import type { User, GroupAccess } from "@/features/users/types";
import { roleVariant, roleOptions, availableGroups } from "@/features/users/types";


/** Props for the UserForm component */
interface UserFormProps {
	user?: User;
	onSubmit: (data: CreateUserFormData) => void | Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
}

/** Role options formatted for Select component */
const roleSelectOptions = roleOptions.map((opt) => ({
	label: opt.label,
	value: opt.value,
}));

/** Group options formatted for Select component */
const groupSelectOptions = availableGroups.map((g) => ({
	label: g.label,
	value: g.value,
}));

/**
 * User creation/edit form
 * @param props - Component props
 * @param props.user - Existing user; undefined for create
 * @param props.onSubmit - Submit callback
 * @param props.onCancel - Cancel callback
 * @param props.isLoading - Loading state
 * @returns User creation or edition form
 */
export function UserForm({ user, onSubmit, onCancel, isLoading = false }: UserFormProps) {
	// Computed
	const isEdit = !!user;

	// State
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateUserFormData>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema) as any,
		defaultValues: {
			firstName: user?.name?.split(" ")[0] || "",
			lastName: user?.name?.split(" ").slice(1).join(" ") || "",
			email: user?.email || "",
			role: (user?.role as CreateUserFormData["role"]) || UserRoles.Collaborator,
			password: "",
			groupAccess: user?.groupAccess?.map((g) => ({
				groupId: g.groupId,
				groupName: g.groupName,
				role: g.role as CreateUserFormData["groupAccess"][number]["role"],
				permissions: [],
			})) || [{ groupId: "bazalthe", groupName: "Bazalthe", role: UserRoles.Collaborator, permissions: [] }],
		},
	});

	const [groupAccess, setGroupAccess] = useState<GroupAccess[]>(
		user?.groupAccess || [{ groupId: "bazalthe", groupName: "Bazalthe", role: UserRoles.Collaborator }],
	);

	// Handlers
	/**
	 * Adds next available group access entry
	 */
	const addGroupAccess = () => {
		const usedIds = groupAccess.map((g) => g.groupId);
		const available = groupSelectOptions.find((g) => !usedIds.includes(g.value));
		if (available) {
			setGroupAccess([
				...groupAccess,
				{ groupId: available.value, groupName: available.label, role: UserRoles.Collaborator },
			]);
		}
	};

	/**
	 * Removes access entry by index
	 * @param index - Entry index to remove
	 */
	const removeGroupAccess = (index: number) => {
		if (groupAccess.length > 1) {
			setGroupAccess(groupAccess.filter((_, i) => i !== index));
		}
	};

	/**
	 * Updates role for an access entry
	 * @param index - Entry index to update
	 * @param role - New role value
	 */
	const updateGroupRole = (index: number, role: string) => {
		const updated = [...groupAccess];
		updated[index] = { ...updated[index], role };
		setGroupAccess(updated);
	};

	/**
	 * Updates group ID for an access entry
	 * @param index - Entry index to update
	 * @param groupId - New group ID
	 */
	const updateGroupId = (index: number, groupId: string) => {
		const group = groupSelectOptions.find((g) => g.value === groupId);
		if (group) {
			const updated = [...groupAccess];
			updated[index] = { ...updated[index], groupId, groupName: group.label };
			setGroupAccess(updated);
		}
	};

	/**
	 * Submits form with group access injected
	 */
	const onFormSubmit = handleSubmit((data) => {
		const formData: CreateUserFormData = {
			...data,
			groupAccess: groupAccess.map((g) => ({
				groupId: g.groupId,
				groupName: g.groupName,
				role: g.role as CreateUserFormData["groupAccess"][number]["role"],
				permissions: [],
			})),
		};
		onSubmit(formData);
	});

	// Render
	return (
		<form onSubmit={onFormSubmit} className="space-y-6">
			<div>
				<h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Informations personnelles</h3>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Input
						label="Prénom"
						placeholder="John"
						error={errors.firstName?.message}
						{...register("firstName")}
					/>
					<Input label="Nom" placeholder="Doe" error={errors.lastName?.message} {...register("lastName")} />
				</div>
			</div>

			<Input
				label="Email"
				type="email"
				placeholder="john@memora.hub"
				error={errors.email?.message}
				{...register("email")}
			/>

			{!isEdit && (
				<Input
					label="Mot de passe"
					type="password"
					placeholder="Mot de passe temporaire"
					hint="Minimum 8 caractères"
					error={errors.password?.message}
					{...register("password")}
				/>
			)}

			<Select
				label="Role principal"
				options={roleSelectOptions}
				error={errors.role?.message}
				{...register("role")}
			/>

			<Divider label="Accès par entité" className="pt-2" />

			<div className="space-y-3">
				{groupAccess.map((access, idx) => (
					<div
						key={`${access.groupId}-${idx}`}
						className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
					>
						<div className="bg-primary-100 dark:bg-primary-900/20 shrink-0 rounded-lg p-2">
							<Icon name="group" size="sm" className="text-primary-500" />
						</div>

						<div className="min-w-0 flex-1">
							<Select
								options={groupSelectOptions}
								value={access.groupId}
								onChange={(e) => updateGroupId(idx, e.target.value)}
							/>
						</div>

						<div className="w-40 shrink-0">
							<Select
								options={roleSelectOptions}
								value={access.role}
								onChange={(e) => updateGroupRole(idx, e.target.value)}
							/>
						</div>

						<Badge
							variant={roleVariant[access.role as UserRole] || "neutral"}
							showDot={false}
							className="hidden shrink-0 sm:flex"
						>
							{access.role}
						</Badge>

						{groupAccess.length > 1 && (
							<Tooltip content="Retirer cet accès">
								<button
									type="button"
									onClick={() => removeGroupAccess(idx)}
									className="hover:bg-error-50 hover:text-error-500 shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors"
								>
									<Icon name="close" size="sm" />
								</button>
							</Tooltip>
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
						Ajouter un accès entité
					</button>
				)}
			</div>

			<Card padding="sm" className="border-info-200 bg-info-50 dark:border-info-700/30 dark:bg-info-900/10">
				<div className="flex gap-2">
					<Icon name="info" size="sm" className="text-info-500 mt-0.5 shrink-0" />
					<p className="text-info-700 dark:text-info-400 text-xs">
						Chaque entité a ses propres accès. Un utilisateur peut avoir un rôle différent dans chaque
						entité à laquelle il appartient.
					</p>
				</div>
			</Card>

			{errors.groupAccess?.message && <p className="text-error-600 text-sm">{errors.groupAccess.message}</p>}

			<div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
				<Button variant="cancel" type="button" onClick={onCancel}>
					Annuler
				</Button>
				<Button type="submit" isLoading={isLoading}>
					{isEdit ? "Enregistrer les modifications" : "Créer l'utilisateur"}
				</Button>
			</div>
		</form>
	);
}
