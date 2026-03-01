"use client";

import { Button, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { useQuestionnaire } from "../hooks";


/** Props for the QuestionnaireCarousel component */
interface QuestionnaireCarouselProps {
	onBack?: () => void;
	className?: string;
}

/**
 * Interview questionnaire carousel
 * @param props.onBack - Return to hub callback
 * @param props.className - Extra CSS classes
 * @returns Paginated questionnaire with tips
 */

export function QuestionnaireCarousel({ onBack, className }: QuestionnaireCarouselProps) {
	// State
	const { stages, stage, currentStage, totalStages, goNext, goPrev, goToStage, isFirst, isLast } = useQuestionnaire();

	if (!stage) return null;

	// Render
	return (
		<div
			className={cn(
				"flex min-h-[600px] overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
				className,
			)}
		>
			{/* Left panel */}
			<div className="relative hidden w-[40%] overflow-hidden lg:block">
				<div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
					<div
						className="absolute inset-0 opacity-10"
						style={{
							backgroundImage:
								"radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)",
						}}
					/>
				</div>

				<div className="relative flex h-full flex-col justify-between p-8">
					<div>
						<div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
							<Icon name="training" size="xs" className="text-white/60" />
							Questionnaire d&apos;entretien
						</div>
					</div>

					<div className="flex flex-col items-center justify-center">
						<div className="mb-4 text-[120px] leading-none font-bold text-white/[0.06]">
							{String(stage.number).padStart(2, "0")}
						</div>
						<p className="text-center text-sm font-medium tracking-widest text-white/40 uppercase">
							Etape {stage.number} sur {totalStages}
						</p>
					</div>

					{/* Stage progress dots */}
					<div className="flex items-center justify-center gap-3">
						{stages.map((s, i) => (
							<button
								key={s.id}
								onClick={() => goToStage(i)}
								className={cn(
									"h-2 rounded-full transition-all duration-300",
									i === currentStage ? "w-8 bg-white/80" : "w-2 bg-white/20 hover:bg-white/40",
								)}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Right panel */}
			<div className="relative flex flex-1 flex-col">
				{/* Vertical stage nav */}
				<div className="absolute top-6 right-6 z-10 hidden flex-col gap-2 xl:flex">
					{stages.map((s, i) => (
						<button
							key={s.id}
							onClick={() => goToStage(i)}
							className={cn(
								"flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200",
								i === currentStage
									? "bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900"
									: "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600 dark:hover:text-gray-300",
							)}
						>
							{s.number}
						</button>
					))}
				</div>

				{/* Scrollable content area */}
				<div className="flex-1 overflow-y-auto p-8 lg:p-10">
					{/* Mobile stage indicator */}
					<div className="mb-6 flex items-center gap-2 lg:hidden">
						<span className="text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
							Etape {stage.number}/{totalStages}
						</span>
						<div className="flex items-center gap-1">
							{stages.map((_, i) => (
								<div
									key={i}
									className={cn(
										"h-1.5 rounded-full transition-all",
										i === currentStage
											? "w-6 bg-gray-900 dark:bg-white"
											: "w-1.5 bg-gray-200 dark:bg-gray-700",
									)}
								/>
							))}
						</div>
					</div>

					{/* Desktop stage label */}
					<div className="mb-2 hidden lg:block">
						<span className="text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
							Etape {stage.number} sur {totalStages}
						</span>
					</div>

					<h1 className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl dark:text-white">{stage.title}</h1>

					{/* Objective block */}
					<div className="mb-6 rounded-xl border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-700 dark:bg-gray-900/50">
						<div className="mb-2 flex items-center gap-2">
							<Icon name="flag" size="sm" className="text-gray-500 dark:text-gray-400" />
							<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Objectif</span>
						</div>
						<p className="text-sm leading-relaxed font-medium text-gray-600 dark:text-gray-400">
							{stage.objective}
						</p>
					</div>

					<p className="mb-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{stage.description}</p>

					{/* Questions list */}
					<div className="mb-8">
						<h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-800 uppercase dark:text-gray-200">
							Questions / Sujets
						</h3>
						<ul className="space-y-3">
							{stage.questions.map((q, i) => (
								<li key={i} className="flex items-start gap-3">
									<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
										{i + 1}
									</span>
									<span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
										{q}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Recruiter tips */}
					<div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-5 dark:border-gray-700 dark:bg-gray-900/30">
						<div className="mb-3 flex items-center gap-2">
							<Icon name="sparkles" size="sm" className="text-gray-400" />
							<span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Conseils</span>
						</div>
						<ul className="space-y-2">
							{stage.tips.map((tip, i) => (
								<li key={i} className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
									<span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-400 dark:bg-gray-500" />
									{tip}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom navigation bar */}
				<div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
					<Button variant="ghost" size="sm" onClick={goPrev} disabled={isFirst}>
						<Icon name="chevronLeft" size="xs" />
						Page precedente
					</Button>

					{/* Progress dots */}
					<div className="hidden items-center gap-2 sm:flex">
						{stages.map((_, i) => (
							<div
								key={i}
								className={cn(
									"h-1.5 w-1.5 rounded-full transition-all",
									i === currentStage
										? "h-2 w-2 bg-gray-900 dark:bg-white"
										: i < currentStage
											? "bg-gray-400 dark:bg-gray-500"
											: "bg-gray-200 dark:bg-gray-700",
								)}
							/>
						))}
					</div>

					<div className="flex items-center gap-3">
						{onBack && (
							<Button variant="ghost" size="sm" onClick={onBack}>
								Retour au Hub
							</Button>
						)}
						<Button variant="primary" size="sm" onClick={goNext} disabled={isLast}>
							Page suivante
							<Icon name="chevronRight" size="xs" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
