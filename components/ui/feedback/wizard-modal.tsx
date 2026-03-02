"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { themeClasses } from "@/core/design/themes";
import { Icon } from "@/components/ui/display/icon";
import type { IconName } from "@/core/design/icons";

/** Configuration for a single wizard step */
export interface WizardStep {
	id: string;
	title: string;
	description: string;
	icon: IconName;
}

/** Props for the WizardModal component */
interface WizardModalProps {
	isOpen: boolean;
	onClose: () => void;
	steps: WizardStep[];
	currentStep: number;
	onStepChange: (step: number) => void;
	onSubmit: () => void;
	submitLabel?: string;
	children: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeMap = {
	sm: "max-w-md",
	md: "max-w-lg",
	lg: "max-w-2xl",
	xl: "max-w-4xl",
} as const;

/**
 * Multi-step wizard modal with breadcrumb progress indicator.
 * Includes skip-all button and step-by-step navigation with green check marks.
 * @param {WizardModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Callback to close the modal
 * @param {WizardStep[]} props.steps - Array of wizard step definitions
 * @param {number} props.currentStep - Current active step index (0-based)
 * @param {(step: number) => void} props.onStepChange - Callback when step changes
 * @param {() => void} props.onSubmit - Callback on final step submission
 * @param {string} [props.submitLabel="Declarer"] - Label for the final submit button
 * @param {React.ReactNode} props.children - Step content to render
 * @param {"sm" | "md" | "lg" | "xl"} [props.size="md"] - Max width of the modal
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element | null} Wizard modal element or null when closed
 */

export function WizardModal({
	isOpen,
	onClose,
	steps,
	currentStep,
	onStepChange,
	onSubmit,
	submitLabel = "Déclarer",
	children,
	size = "md",
	className,
}: WizardModalProps) {
	const isLastStep = currentStep === steps.length - 1;
	const isFirstStep = currentStep === 0;

	/**
	 * Closes the modal when Escape is pressed.
	 * @param {KeyboardEvent} e - Keyboard event
	 * @returns {void}
	 */

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		},
		[onClose],
	);

	// Keyboard and scroll lock
	useEffect(() => {
		if (isOpen) {
			document.addEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [isOpen, handleKeyDown]);

	if (!isOpen) return null;

	/**
	 * Navigates to the next step or submits on the last step.
	 * @returns {void}
	 */

	const handleNext = () => {
		if (isLastStep) {
			onSubmit();
		} else {
			onStepChange(currentStep + 1);
		}
	};

	/**
	 * Navigates to the previous step.
	 * @returns {void}
	 */

	const handleBack = () => {
		if (!isFirstStep) {
			onStepChange(currentStep - 1);
		}
	};

	/**
	 * Skips directly to the last step.
	 * @returns {void}
	 */

	const handleSkipAll = () => {
		onStepChange(steps.length - 1);
	};

	// Render
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Overlay */}
			<div className={cn(themeClasses.overlay, "animate-fade-in fixed inset-0 z-0")} onClick={onClose} />

			{/* Modal panel */}
			<div
				className={cn(
					"animate-scale-in relative z-10 w-full rounded-2xl shadow-xl",
					themeClasses.modal,
					sizeMap[size],
					className,
				)}
			>
				{/* Header with controls */}
				<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
					{/* Breadcrumb progress */}
					<div className="flex items-center gap-1.5">
						{steps.map((step, idx) => {
							const isCompleted = idx < currentStep;
							const isCurrent = idx === currentStep;

							return (
								<div key={step.id} className="flex items-center gap-1.5">
									{/* Step indicator */}
									<button
										type="button"
										onClick={() => idx <= currentStep && onStepChange(idx)}
										disabled={idx > currentStep}
										className={cn(
											"flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200",
											isCompleted && "bg-emerald-500 text-white",
											isCurrent &&
												"bg-primary-500 ring-primary-200 dark:ring-primary-800 text-white ring-2",
											!isCompleted &&
												!isCurrent &&
												"bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500",
											idx <= currentStep && "cursor-pointer",
											idx > currentStep && "cursor-default",
										)}
									>
										{isCompleted ? (
											<Icon name="check" size="xs" className="text-white" />
										) : (
											<span>{idx + 1}</span>
										)}
									</button>

									{/* Connector line */}
									{idx < steps.length - 1 && (
										<div
											className={cn(
												"h-px w-6 transition-colors duration-200",
												idx < currentStep ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700",
											)}
										/>
									)}
								</div>
							);
						})}
					</div>

					{/* Right controls */}
					<div className="flex items-center gap-1">
						{/* Skip all button */}
						{!isLastStep && (
							<button
								type="button"
								onClick={handleSkipAll}
								className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
								title="Passer toutes les étapes"
							>
								<Icon name="chevronRight" size="sm" />
							</button>
						)}

						{/* Close button */}
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
						>
							<Icon name="close" size="sm" />
						</button>
					</div>
				</div>

				{/* Step title and description */}
				<div className="px-6 pt-5 pb-2">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">{steps[currentStep].title}</h2>
					<p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{steps[currentStep].description}</p>
				</div>

				{/* Step content */}
				<div className="px-6 py-4">{children}</div>

				{/* Footer actions */}
				<div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
					{/* Back button */}
					<div>
						{!isFirstStep && (
							<button
								type="button"
								onClick={handleBack}
								className="flex items-center gap-1 text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							>
								<Icon name="chevronLeft" size="xs" />
								Retour
							</button>
						)}
					</div>

					{/* Next / Submit */}
					<button
						type="button"
						onClick={handleNext}
						className={cn(
							"rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200",
							isLastStep
								? "bg-primary-500 hover:bg-primary-600 text-white shadow-sm"
								: "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100",
						)}
					>
						{isLastStep ? submitLabel : "Suivant"}
					</button>
				</div>
			</div>
		</div>
	);
}
