"use client";

// React
import { useState, useCallback } from "react";
import { Icon, Modal, Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { WIZARD_STEPS, PROJECT_PRIORITIES, priorityLabel, priorityVariant } from "../types";
import type { WizardStep, ProjectFormData, ProjectPriorityValue, ProjectMember } from "../types";


interface ProjectCreationWizardProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: ProjectFormData) => void;
}

/** Available emojis for project selection */
const EMOJI_OPTIONS = ["📁", "🌐", "📱", "☁️", "📚", "🔒", "🚀", "🎨", "💡", "🎯", "📊", "🔧", "🎮", "📝", "🎬", "🎵"];

/** Available team members for selection */
const AVAILABLE_MEMBERS: ProjectMember[] = [
	{ userId: "u3", name: "Andrew", role: "Chef de projet" },
	{ userId: "u6", name: "Maks", role: "Developpeur front-end" },
	{ userId: "u2", name: "Procy", role: "Designer UX" },
	{ userId: "u4", name: "Witt", role: "Chef de projet" },
	{ userId: "u7", name: "Flo", role: "Developpeur mobile" },
	{ userId: "u1", name: "Luzrod", role: "DevOps" },
	{ userId: "u19", name: "Candice", role: "Architecte cloud" },
	{ userId: "u8", name: "Antwo", role: "Developpeur back-end" },
	{ userId: "u17", name: "Pixel", role: "Responsable securite" },
];

/** Step labels for the wizard progress indicator */
const STEP_LABELS: Record<WizardStep, string> = {
	title: "Titre",
	description: "Description",
	deadline: "Deadline",
	priority: "Priorite",
	responsible: "Responsable",
	assistants: "Assistants",
};

/**
 * Multi-step modal wizard for creating a new project.
 * Guides the user through title, description, deadline, priority, responsible, and assistants.
 * @param {ProjectCreationWizardProps} props - Component props
 * @returns {JSX.Element} Project creation wizard modal
 */
export function ProjectCreationWizard({ isOpen, onClose, onSubmit }: ProjectCreationWizardProps) {
	// State
	const [step, setStep] = useState<WizardStep>("title");
	const [name, setName] = useState("");
	const [emoji, setEmoji] = useState("📁");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [priority, setPriority] = useState<ProjectPriorityValue>("P2");
	const [responsible, setResponsible] = useState<ProjectMember | null>(null);
	const [assistants, setAssistants] = useState<ProjectMember[]>([]);

	const currentStepIndex = WIZARD_STEPS.indexOf(step);
	const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;

	// Handlers

	/**
	 * Advances to the next wizard step or submits the form on the last step.
	 * @returns {void}
	 */
	const handleNext = useCallback(() => {
		if (isLastStep) {
			onSubmit({
				name,
				emoji,
				description,
				status: "todo",
				priority,
				startDate,
				endDate,
				responsible: responsible ?? { userId: "", name: "Non defini", role: "" },
				assistants,
				members: [responsible ?? { userId: "", name: "Non defini", role: "" }, ...assistants],
			});
			handleReset();
			onClose();
		} else {
			setStep(WIZARD_STEPS[currentStepIndex + 1]);
		}
	}, [
		isLastStep,
		currentStepIndex,
		name,
		emoji,
		description,
		priority,
		startDate,
		endDate,
		responsible,
		assistants,
		onSubmit,
		onClose,
	]);

	/**
	 * Returns to the previous wizard step.
	 * @returns {void}
	 */
	const handleBack = useCallback(() => {
		if (currentStepIndex > 0) {
			setStep(WIZARD_STEPS[currentStepIndex - 1]);
		}
	}, [currentStepIndex]);

	/**
	 * Resets all wizard form state.
	 * @returns {void}
	 */
	const handleReset = () => {
		setStep("title");
		setName("");
		setEmoji("📁");
		setDescription("");
		setStartDate("");
		setEndDate("");
		setPriority("P2");
		setResponsible(null);
		setAssistants([]);
	};

	/**
	 * Toggles a member in the assistants list.
	 * @param {ProjectMember} member - Member to toggle
	 * @returns {void}
	 */
	const toggleAssistant = (member: ProjectMember) => {
		setAssistants((prev) =>
			prev.find((a) => a.name === member.name) ? prev.filter((a) => a.name !== member.name) : [...prev, member],
		);
	};

	/**
	 * Checks if the current step has valid input to proceed.
	 * @returns {boolean} True if the current step is valid
	 */
	const isStepValid = (): boolean => {
		switch (step) {
			case "title":
				return name.trim().length > 0;
			case "description":
				return true;
			case "deadline":
				return endDate.length > 0;
			case "priority":
				return true;
			case "responsible":
				return responsible !== null;
			case "assistants":
				return true;
			default:
				return false;
		}
	};

	// Render
	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				handleReset();
				onClose();
			}}
			title="Nouveau projet"
			size="md"
		>
			{/* Progress bar */}
			<div className="mb-6">
				<div className="mb-2 flex items-center justify-between">
					{WIZARD_STEPS.map((s, idx) => (
						<div
							key={s}
							className={cn(
								"flex items-center gap-1.5",
								idx <= currentStepIndex
									? "text-primary-600 dark:text-primary-400"
									: "text-gray-300 dark:text-gray-600",
							)}
						>
							<div
								className={cn(
									"flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
									idx < currentStepIndex && "bg-primary-500 text-white",
									idx === currentStepIndex &&
										"bg-primary-100 text-primary-700 ring-primary-500 dark:bg-primary-900/30 dark:text-primary-400 ring-2",
									idx > currentStepIndex && "bg-gray-100 text-gray-400 dark:bg-gray-800",
								)}
							>
								{idx < currentStepIndex ? <Icon name="check" size="xs" /> : idx + 1}
							</div>
							<span className="hidden text-[10px] font-medium sm:block">{STEP_LABELS[s]}</span>
						</div>
					))}
				</div>
				<div className="h-1 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
					<div
						className="bg-primary-500 h-full rounded-full transition-all duration-300"
						style={{ width: `${((currentStepIndex + 1) / WIZARD_STEPS.length) * 100}%` }}
					/>
				</div>
			</div>

			{/* Step content */}
			<div className="min-h-[200px]">
				{/* Step 1: Title + Emoji */}
				{step === "title" && (
					<div className="space-y-4">
						<div>
							<label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
								Emoji du projet
							</label>
							<div className="flex flex-wrap gap-2">
								{EMOJI_OPTIONS.map((e) => (
									<button
										key={e}
										onClick={() => setEmoji(e)}
										className={cn(
											"flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all duration-200",
											emoji === e
												? "bg-primary-100 ring-primary-500 dark:bg-primary-900/30 ring-2"
												: "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700",
										)}
									>
										{e}
									</button>
								))}
							</div>
						</div>
						<div>
							<label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
								Titre du projet
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Ex: Refonte du site vitrine"
								className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-all outline-none placeholder:text-gray-400 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
								autoFocus
							/>
						</div>
					</div>
				)}

				{/* Step 2: Description */}
				{step === "description" && (
					<div>
						<label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
							Description du projet
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Decrivez les objectifs et le perimetre du projet..."
							rows={5}
							className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-all outline-none placeholder:text-gray-400 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
							autoFocus
						/>
					</div>
				)}

				{/* Step 3: Deadline */}
				{step === "deadline" && (
					<div className="space-y-4">
						<div>
							<label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
								Date de debut
							</label>
							<input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-all outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
							/>
						</div>
						<div>
							<label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
								Date de fin (deadline)
							</label>
							<input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-all outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
							/>
						</div>
					</div>
				)}

				{/* Step 4: Priority */}
				{step === "priority" && (
					<div>
						<label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-200">
							Niveau de priorite
						</label>
						<div className="space-y-2">
							{PROJECT_PRIORITIES.map((p: ProjectPriorityValue) => (
								<button
									key={p}
									onClick={() => setPriority(p)}
									className={cn(
										"flex w-full items-center gap-3 rounded-lg border p-3 transition-all duration-200",
										priority === p
											? "border-primary-300 bg-primary-50 ring-primary-200 dark:border-primary-700 dark:bg-primary-900/10 ring-1"
											: "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
									)}
								>
									<Badge variant={priorityVariant[p]}>{p}</Badge>
									<span className="text-sm font-medium text-gray-700 dark:text-gray-200">
										{priorityLabel[p]}
									</span>
								</button>
							))}
						</div>
					</div>
				)}

				{/* Step 5: Responsible */}
				{step === "responsible" && (
					<div>
						<label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-200">
							Responsable du projet
						</label>
						<div className="space-y-2">
							{AVAILABLE_MEMBERS.map((member) => (
								<button
									key={member.name}
									onClick={() => setResponsible(member)}
									className={cn(
										"flex w-full items-center gap-3 rounded-lg border p-3 transition-all duration-200",
										responsible?.name === member.name
											? "border-primary-300 bg-primary-50 ring-primary-200 dark:border-primary-700 dark:bg-primary-900/10 ring-1"
											: "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
									)}
								>
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
										{member.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</div>
									<div className="text-left">
										<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
											{member.name}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
									</div>
									{responsible?.name === member.name && (
										<Icon name="check" size="sm" className="text-primary-500 ml-auto" />
									)}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Step 6: Assistants */}
				{step === "assistants" && (
					<div>
						<label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
							Assistants
						</label>
						<p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
							Selectionnez les membres qui assisteront le responsable (optionnel)
						</p>
						<div className="space-y-2">
							{AVAILABLE_MEMBERS.filter((m) => m.name !== responsible?.name).map((member) => {
								const isSelected = assistants.some((a) => a.name === member.name);
								return (
									<button
										key={member.name}
										onClick={() => toggleAssistant(member)}
										className={cn(
											"flex w-full items-center gap-3 rounded-lg border p-3 transition-all duration-200",
											isSelected
												? "border-primary-300 bg-primary-50 ring-primary-200 dark:border-primary-700 dark:bg-primary-900/10 ring-1"
												: "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
										)}
									>
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
											{member.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</div>
										<div className="text-left">
											<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
												{member.name}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
										</div>
										{isSelected && (
											<Icon name="check" size="sm" className="text-primary-500 ml-auto" />
										)}
									</button>
								);
							})}
						</div>
					</div>
				)}
			</div>

			{/* Actions */}
			<div className="mt-6 flex items-center justify-between">
				<Button
					variant="outline-neutral"
					onClick={
						currentStepIndex === 0
							? () => {
									handleReset();
									onClose();
								}
							: handleBack
					}
				>
					{currentStepIndex === 0 ? "Annuler" : "Retour"}
				</Button>
				<Button variant="primary" onClick={handleNext} disabled={!isStepValid()}>
					{isLastStep ? "Creer le projet" : "Suivant"}
				</Button>
			</div>
		</Modal>
	);
}
