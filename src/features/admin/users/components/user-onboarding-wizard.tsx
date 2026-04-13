"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button, Icon, Input, Checkbox, Card } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { createUserAction } from "../actions";
import type { CreateUserFormData } from "@/lib/validators/schemas";

interface Step {
	id: string;
	title: string;
	description: string;
	icon: string;
}

const STEPS: Step[] = [
	{
		id: "identity",
		title: "Identité",
		description: "Commence par nous dire qui tu es",
		icon: "profile",
	},
	{
		id: "email",
		title: "Email & Mot de passe",
		description: "Configure tes identifiants de connection",
		icon: "lock",
	},
	{
		id: "role",
		title: "Rôle",
		description: "Définis ton niveau d'accès",
		icon: "shield",
	},
	{
		id: "entities",
		title: "Entités",
		description: "Sélectionne les entités de travail",
		icon: "users",
	},
	{
		id: "confirm",
		title: "Confirmation",
		description: "Vérifie tes informations",
		icon: "check",
	},
];

const ENTITIES = [
	{ id: "grp-bazalthe", label: "Bazalthe", color: "primary" },
	{ id: "grp-inoxtag", label: "Inoxtag", color: "purple" },
	{ id: "grp-michou", label: "Michou", color: "amber" },
	{ id: "grp-doigby", label: "Doigby", color: "emerald" },
	{ id: "grp-anthony", label: "Anthony", color: "blue" },
];

const ROLES = [
	{ value: "Owner", label: "Owner", desc: "Accès administrateur complet" },
	{ value: "Admin", label: "Admin", desc: "Gestion des utilisateurs et contenu" },
	{ value: "Manager", label: "Manager", desc: "Gestion des projets et équipes" },
	{
		value: "Collaborator",
		label: "Collaborateur",
		desc: "Accès standard avec permissions de base",
	},
	{ value: "Guest", label: "Invité", desc: "Accès limité en lecture seule" },
];

interface UserData {
	firstName: string;
	lastName: string;
	pseudo: string;
	email: string;
	password: string;
	role: string;
	selectedEntities: string[];
}

interface FormErrors {
	[key: string]: string;
}

export function UserOnboardingWizard({ onSuccess }: { onSuccess?: () => void }) {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [formErrors, setFormErrors] = useState<FormErrors>({});

	const [userData, setUserData] = useState<UserData>({
		firstName: "",
		lastName: "",
		pseudo: "",
		email: "",
		password: "",
		role: "Collaborator",
		selectedEntities: ["grp-bazalthe"],
	});

	const updateField = useCallback(
		(field: keyof UserData, value: unknown) => {
			setUserData((prev) => ({ ...prev, [field]: value }));
			if (formErrors[field]) {
				setFormErrors((prev) => {
					const { [field]: _, ...rest } = prev;
					return rest;
				});
			}
		},
		[formErrors],
	);

	const validateStep = useCallback((): boolean => {
		const errors: FormErrors = {};

		switch (currentStep) {
			case 0: // Identity
				if (!userData.firstName.trim()) errors.firstName = "Prénom requis";
				if (!userData.lastName.trim()) errors.lastName = "Nom requis";
				if (!userData.pseudo.trim()) errors.pseudo = "Pseudo requis";
				break;

			case 1: // Email & Password
				if (!userData.email.trim()) errors.email = "Email requis";
				else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) errors.email = "Email invalide";
				if (!userData.password.trim()) errors.password = "Mot de passe requis";
				else if (userData.password.length < 8) errors.password = "Minimum 8 caractères";
				break;

			case 2: // Role
				if (!userData.role) errors.role = "Rôle requis";
				break;

			case 3: // Entités
				if (userData.selectedEntities.length === 0) errors.entities = "Sélectionne au moins une entité";
				break;
		}

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			return false;
		}

		setFormErrors({});
		return true;
	}, [currentStep, userData]);

	const goToStep = useCallback((step: number) => {
		if (step >= 0 && step < STEPS.length) {
			setCurrentStep(step);
		}
	}, []);

	const handleNext = useCallback(async () => {
		if (!validateStep()) return;

		if (currentStep === STEPS.length - 1) {
			// Final submission
			await handleSubmit();
		} else {
			goToStep(currentStep + 1);
		}
	}, [currentStep, validateStep, goToStep]);

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			// Create user with all group accesses
			const groupAccess = userData.selectedEntities.map((entityId) => {
				const entity = ENTITIES.find((e) => e.id === entityId);
				return {
					groupId: entityId,
					groupName: entity?.label || entityId,
					role: userData.role as CreateUserFormData["groupAccess"][number]["role"],
					permissions: [],
				};
			});

			const formData: CreateUserFormData = {
				firstName: userData.firstName,
				lastName: userData.lastName,
				email: userData.email,
				password: userData.password,
				role: userData.role as CreateUserFormData["role"],
				groupAccess,
			};

			const result = await createUserAction(formData);

			if (result.success) {
				toast.success(`Compte créé avec succès pour ${userData.selectedEntities.length} entité(s)`);
				onSuccess?.();
				setTimeout(() => router.push("/users"), 1500);
			} else {
				toast.error(result.error || "Erreur lors de la création du compte");
			}
		} catch (error) {
			console.error("Submission error:", error);
			toast.error("Une erreur s'est produite");
		} finally {
			setIsLoading(false);
		}
	};

	const toggleEntity = (entityId: string) => {
		setUserData((prev) => ({
			...prev,
			selectedEntities: prev.selectedEntities.includes(entityId)
				? prev.selectedEntities.filter((e) => e !== entityId)
				: [...prev.selectedEntities, entityId],
		}));
	};

	return (
		<div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-gray-900">
			{/* Progress Bar - Top */}
			{currentStep > 0 && (
				<div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 backdrop-blur-md">
					<div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
						<div className="flex gap-1.5">
							{STEPS.map((step, idx) => (
								<button
									key={step.id}
									onClick={() => idx < currentStep && goToStep(idx)}
									className={cn(
										"h-1.5 rounded-full transition-all duration-300",
										idx === currentStep
											? "bg-primary-500 w-6"
											: idx < currentStep
												? "bg-primary-500/50 hover:bg-primary-500 w-1.5 cursor-pointer"
												: "w-1.5 bg-gray-700",
									)}
									title={step.title}
								/>
							))}
						</div>
						<span className="text-xs font-medium text-gray-500">
							{currentStep + 1} / {STEPS.length} — {STEPS[currentStep].title}
						</span>
					</div>
				</div>
			)}

			{/* Main Content */}
			<div className="flex-1 overflow-y-auto">
				<div className="flex min-h-full flex-col items-center justify-center px-4 py-12 sm:px-6">
					<div className="w-full max-w-2xl space-y-8">
						{/* Step Header */}
						<div className="flex items-start gap-4">
							<div
								className={cn(
									"rounded-xl p-3",
									currentStep === 0 && "from-primary-500 bg-gradient-to-br to-blue-600",
									currentStep === 1 && "bg-gradient-to-br from-amber-500 to-orange-600",
									currentStep === 2 && "bg-gradient-to-br from-purple-500 to-pink-600",
									currentStep === 3 && "bg-gradient-to-br from-emerald-500 to-teal-600",
									currentStep === 4 && "bg-gradient-to-br from-green-500 to-emerald-600",
								)}
							>
								<Icon name={STEPS[currentStep].icon as any} size="lg" className="text-white" />
							</div>
							<div className="flex-1">
								<h1 className="text-3xl font-bold text-white">{STEPS[currentStep].title}</h1>
								<p className="mt-1 text-base text-gray-400">{STEPS[currentStep].description}</p>
							</div>
						</div>

						{/* Step Content */}
						<div className="space-y-5">
							{/* Step 0: Identity */}
							{currentStep === 0 && (
								<div className="space-y-4">
									<Input
										label="Prénom *"
										placeholder="Jean"
										value={userData.firstName}
										onChange={(e) => updateField("firstName", e.target.value)}
										error={formErrors.firstName}
										icon="users"
									/>
									<Input
										label="Nom *"
										placeholder="Dupont"
										value={userData.lastName}
										onChange={(e) => updateField("lastName", e.target.value)}
										error={formErrors.lastName}
										icon="users"
									/>
									<Input
										label="Pseudo *"
										placeholder="johndoe"
										value={userData.pseudo}
										onChange={(e) => updateField("pseudo", e.target.value)}
										error={formErrors.pseudo}
										hint="Ton identifiant unique dans la plateforme"
										icon="profile"
									/>
								</div>
							)}

							{/* Step 1: Email & Password */}
							{currentStep === 1 && (
								<div className="space-y-4">
									<Input
										label="Email *"
										type="email"
										placeholder="jean@example.com"
										value={userData.email}
										onChange={(e) => updateField("email", e.target.value)}
										error={formErrors.email}
										hint="Utilise une adresse email valide"
										icon="search"
									/>
									<Input
										label="Mot de passe *"
										type="password"
										placeholder="••••••••"
										value={userData.password}
										onChange={(e) => updateField("password", e.target.value)}
										error={formErrors.password}
										hint="Minimum 8 caractères (chiffres, lettres, caractères spéciaux)"
										icon="lock"
									/>
									<p className="text-xs text-gray-400">
										💡 Partage ce mot de passe de manière sécurisée avec l'utilisateur
									</p>
								</div>
							)}

							{/* Step 2: Role */}
							{currentStep === 2 && (
								<div className="space-y-3">
									{ROLES.map((role) => (
										<Card
											key={role.value}
											hover
											padding="md"
											onClick={() => updateField("role", role.value)}
											className={cn(
												"cursor-pointer border transition-all",
												userData.role === role.value
													? "border-primary-500 bg-primary-500/10"
													: "border-gray-700/50 hover:border-gray-600",
											)}
										>
											<div className="flex items-center gap-3">
												<div
													className={cn(
														"h-4 w-4 rounded-full border-2",
														userData.role === role.value
															? "border-primary-500 bg-primary-500"
															: "border-gray-500",
													)}
												/>
												<div>
													<p className="font-medium text-white">{role.label}</p>
													<p className="text-xs text-gray-400">{role.desc}</p>
												</div>
											</div>
										</Card>
									))}
								</div>
							)}

							{/* Step 3: Entités */}
							{currentStep === 3 && (
								<div className="space-y-3">
									{ENTITIES.map((entity) => (
										<Card
											key={entity.id}
											padding="md"
											className={cn(
												"cursor-pointer border transition-all",
												userData.selectedEntities.includes(entity.id)
													? "border-primary-500 bg-primary-500/10"
													: "border-gray-700/50 hover:border-gray-600",
											)}
											onClick={() => toggleEntity(entity.id)}
										>
											<div className="flex items-center gap-3">
												<Checkbox
													label={entity.label}
													checked={userData.selectedEntities.includes(entity.id)}
													onChange={() => {}}
												/>
											</div>
										</Card>
									))}
									{formErrors.entities && (
										<p className="text-sm text-red-400">{formErrors.entities}</p>
									)}
								</div>
							)}

							{/* Step 4: Confirmation */}
							{currentStep === 4 && (
								<div className="space-y-4">
									<Card padding="lg" className="border border-gray-700/50 bg-gray-800/30">
										<div className="space-y-3">
											<div className="flex justify-between border-b border-gray-700/50 pb-2">
												<span className="text-sm text-gray-400">Prénom</span>
												<span className="font-medium text-white">{userData.firstName}</span>
											</div>
											<div className="flex justify-between border-b border-gray-700/50 pb-2">
												<span className="text-sm text-gray-400">Nom</span>
												<span className="font-medium text-white">{userData.lastName}</span>
											</div>
											<div className="flex justify-between border-b border-gray-700/50 pb-2">
												<span className="text-sm text-gray-400">Email</span>
												<span className="font-medium text-white">{userData.email}</span>
											</div>
											<div className="flex justify-between border-b border-gray-700/50 pb-2">
												<span className="text-sm text-gray-400">Rôle</span>
												<span className="font-medium text-white">{userData.role}</span>
											</div>
											<div className="flex justify-between pt-2">
												<span className="text-sm text-gray-400">Entités</span>
												<div className="flex gap-1.5">
													{userData.selectedEntities.map((entityId) => {
														const entity = ENTITIES.find((e) => e.id === entityId);
														return (
															<span
																key={entityId}
																className="bg-primary-500/20 text-primary-300 inline-block rounded-full px-2.5 py-1 text-xs font-medium"
															>
																{entity?.label}
															</span>
														);
													})}
												</div>
											</div>
										</div>
									</Card>
									<p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">
										✓ Tout semble en ordre ! Clique sur "Confirmer" pour créer le compte.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Navigation Bar - Bottom */}
			<div className="border-t border-gray-800 bg-gray-900/80 px-6 py-4 backdrop-blur-md">
				<div className="mx-auto flex max-w-3xl items-center justify-between">
					<Button
						variant="ghost"
						onClick={() => goToStep(currentStep - 1)}
						disabled={currentStep === 0}
						className="flex items-center gap-1.5"
					>
						<Icon name="chevronLeft" size="sm" />
						Retour
					</Button>

					<Button
						variant="primary"
						onClick={handleNext}
						isLoading={isLoading}
						disabled={isLoading}
						className="flex items-center gap-1.5"
					>
						{currentStep === STEPS.length - 1 ? "Confirmer" : "Suivant"}
						<Icon name="chevronRight" size="sm" />
					</Button>
				</div>
			</div>
		</div>
	);
}
