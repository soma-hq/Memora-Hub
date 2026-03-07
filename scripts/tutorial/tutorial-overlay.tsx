"use client";

// React
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon, Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { useModePalette } from "@/hooks/useModePalette";
import { useHubStore } from "@/store/hub.store";
import type { TutorialStep, PearlMood } from "@/scripts/types";
import {
	HUB_TUTORIAL,
	hasTutorialCompleted,
	markTutorialCompleted,
	hasMinimumRole,
} from "@/scripts/tutorial/hub-tutorial";
import { defineScriptConfig } from "@/structures";

const SCRIPT_CONFIG = defineScriptConfig({
	name: "tutorial-overlay",
	category: "tutorial",
	description: "Overlay interactif du tutoriel avec effet spotlight et guide PEARL.",
});

// Rect position
interface SpotlightRect {
	top: number;
	left: number;
	width: number;
	height: number;
}

/**
 * Computes the spotlight rectangle for a given selector, with padding.
 * @param {string} selector - CSS selector
 * @returns {SpotlightRect | null} Rect or null if element not found
 */

function getTargetRect(selector: string): SpotlightRect | null {
	const el = document.querySelector(selector);
	if (!el) return null;
	const rect = el.getBoundingClientRect();
	const pad = 8;
	return {
		top: rect.top - pad + window.scrollY,
		left: rect.left - pad,
		width: rect.width + pad * 2,
		height: rect.height + pad * 2,
	};
}

// PEARL mood visual configurations
const PEARL_MOOD_CONFIG: Record<
	PearlMood,
	{ animation: string; bgGradient: string; emoji: string; glowColor: string }
> = {
	happy: {
		animation: "pearlBounce",
		bgGradient: "from-emerald-500/20 to-teal-500/20",
		emoji: "~",
		glowColor: "rgba(16, 185, 129, 0.3)",
	},
	excited: {
		animation: "pearlSparkle",
		bgGradient: "from-amber-500/20 to-orange-500/20",
		emoji: "!",
		glowColor: "rgba(245, 158, 11, 0.3)",
	},
	curious: {
		animation: "pearlTilt",
		bgGradient: "from-blue-500/20 to-cyan-500/20",
		emoji: "?",
		glowColor: "rgba(59, 130, 246, 0.3)",
	},
	encouraging: {
		animation: "pearlNod",
		bgGradient: "from-indigo-500/20 to-blue-500/20",
		emoji: "+",
		glowColor: "rgba(99, 102, 241, 0.3)",
	},
	proud: {
		animation: "pearlGlow",
		bgGradient: "from-slate-500/20 to-gray-500/20",
		emoji: "*",
		glowColor: "rgba(100, 116, 139, 0.3)",
	},
};

/**
 * PEARL Avatar component
 * @param {Object} props - Component props
 * @param {PearlMood} props.mood - Current PEARL mood
 * @returns {JSX.Element} Animated PEARL avatar
 */
function PearlAvatar({ mood }: { mood: PearlMood }) {
	const config = PEARL_MOOD_CONFIG[mood];

	return (
		<div
			className={cn(
				"relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
				"bg-gradient-to-br",
				config.bgGradient,
				"border border-white/10",
			)}
			style={{
				animation: `${config.animation} 2s ease-in-out infinite`,
				boxShadow: `0 0 20px ${config.glowColor}, 0 0 40px ${config.glowColor}`,
			}}
		>
			<Icon name="sparkles" size="sm" className="text-white" />

			{/* Mood indicator dot */}
			<div className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-gray-800 bg-gray-900 text-[8px] font-bold text-white">
				{config.emoji}
			</div>
		</div>
	);
}

/**
 * PEARL speech bubble component
 * @param {Object} props - Component props
 * @param {string} props.message - What PEARL says
 * @param {PearlMood} props.mood - Current PEARL mood for styling
 * @returns {JSX.Element} Chat bubble with PEARL's message
 */
function PearlBubble({ message, mood }: { message: string; mood: PearlMood }) {
	const config = PEARL_MOOD_CONFIG[mood];

	return (
		<div className="relative ml-2 flex-1">
			{/* Tail pointer */}
			<div className="absolute top-3 -left-1.5 h-3 w-3 rotate-45 border-b border-l border-white/5 bg-gray-800" />
			{/* Bubble body */}
			<div
				className="relative rounded-xl rounded-tl-sm border border-white/5 bg-gray-800 px-3.5 py-2.5"
				style={{
					boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 8px rgba(0,0,0,0.2)`,
				}}
			>
				<p className="text-[13px] leading-relaxed text-gray-200">{message}</p>
				{/* PEARL signature */}
				<div className="mt-1.5 flex items-center gap-1">
					<div
						className={cn("h-1 w-1 rounded-full bg-gradient-to-r", config.bgGradient)}
						style={{ animation: "pearlPulse 1.5s ease-in-out infinite" }}
					/>
					<span className="text-[9px] font-semibold tracking-widest text-gray-600 uppercase">PEARL</span>
				</div>
			</div>
		</div>
	);
}

/**
 * Supports forced page navigation between steps and permission-based step filtering
 * @returns {JSX.Element | null} Tutorial overlay or null if not active
 */
export function TutorialOverlay() {
	// Hooks
	const router = useRouter();
	const pathname = usePathname();
	const activeGroupId = useHubStore((s) => s.activeGroupId);
	const palette = useModePalette();

	// State
	const [active, setActive] = useState(false);
	const [stepIndex, setStepIndex] = useState(0);
	const [rect, setRect] = useState<SpotlightRect | null>(null);
	const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
	const [isAnimating, setIsAnimating] = useState(false);
	const [isNavigating, setIsNavigating] = useState(false);
	const resizeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [userRole] = useState(() => {
		if (typeof window === "undefined") return "Junior";
		return localStorage.getItem("memora-user-role") || "Owner";
	});

	// Filter steps based on user permissions
	const filteredSteps = HUB_TUTORIAL.steps.filter((s) => !s.requiredRole || hasMinimumRole(userRole, s.requiredRole));

	const step: TutorialStep | undefined = filteredSteps[stepIndex];

	// Check if tutorial should be shown on mount
	useEffect(() => {
		if (!hasTutorialCompleted(HUB_TUTORIAL.storageKey)) {
			const t = setTimeout(() => setActive(true), 1500);
			return () => clearTimeout(t);
		}
	}, []);

	/**
	 * Resolves a route template
	 * @param {string} route - Route template
	 * @returns {string} Resolved route
	 */

	const resolveRoute = useCallback(
		(route: string): string => {
			return route.replace("{groupId}", activeGroupId || "default");
		},
		[activeGroupId],
	);

	/**
	 * Positions the tooltip relative to the spotlight rect
	 * @param {SpotlightRect} r - Spotlight rectangle
	 * @param {TutorialStep} s - Current step
	 * @returns {void}
	 */

	const positionTooltip = useCallback((r: SpotlightRect, s: TutorialStep) => {
		const style: React.CSSProperties = { position: "absolute" };
		const tooltipW = 400;
		const tooltipH = 260;
		const gap = 16;

		switch (s.placement) {
			case "right":
				style.top = r.top + r.height / 2 - tooltipH / 2;
				style.left = r.left + r.width + gap;
				break;
			case "left":
				style.top = r.top + r.height / 2 - tooltipH / 2;
				style.left = r.left - tooltipW - gap;
				break;
			case "bottom":
				style.top = r.top + r.height + gap;
				style.left = r.left + r.width / 2 - tooltipW / 2;
				break;
			case "top":
				style.top = r.top - tooltipH - gap;
				style.left = r.left + r.width / 2 - tooltipW / 2;
				break;
		}

		// Clamp within viewport
		const maxLeft = window.innerWidth - tooltipW - 16;
		const minLeft = 16;
		if ((style.left as number) > maxLeft) style.left = maxLeft;
		if ((style.left as number) < minLeft) style.left = minLeft;
		if ((style.top as number) < 16) style.top = 16;

		setTooltipStyle(style);
	}, []);

	// Navigate when step requires it
	useEffect(() => {
		if (!active || !step || !step.navigateTo) return;

		const targetPath = resolveRoute(step.navigateTo);
		if (pathname !== targetPath) {
			const navigationFlagTimer = setTimeout(() => setIsNavigating(true), 0);
			router.push(targetPath);

			return () => clearTimeout(navigationFlagTimer);
		}
	}, [active, stepIndex, step, pathname, resolveRoute, router]);

	// After navigation, wait for page to load then position
	useEffect(() => {
		if (!isNavigating) return;

		const handle = setTimeout(() => {
			setIsNavigating(false);
		}, step?.delay || 800);

		return () => clearTimeout(handle);
	}, [isNavigating, pathname, step?.delay]);

	// Update rect when step changes or navigation completes
	useEffect(() => {
		if (!active || !step || isNavigating) return;

		const updateRect = () => {
			const r = getTargetRect(step.targetSelector);
			setRect(r);
			if (r) positionTooltip(r, step);
		};

		// Delay for smoother spotlight positioning after layout updates
		const t = setTimeout(
			() => {
				updateRect();
			},
			step.delay ? step.delay : 150,
		);

		// Reposition on resize/scroll
		const handleResize = () => {
			if (resizeRef.current) clearTimeout(resizeRef.current);
			resizeRef.current = setTimeout(updateRect, 100);
		};

		window.addEventListener("resize", handleResize);
		window.addEventListener("scroll", handleResize, true);

		return () => {
			clearTimeout(t);
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("scroll", handleResize, true);
		};
	}, [active, stepIndex, step, isNavigating, positionTooltip]);

	// Handlers

	/**
	 * Advances to the next tutorial step or completes the tutorial.
	 * @returns {void}
	 */
	const handleNext = useCallback(() => {
		if (stepIndex < filteredSteps.length - 1) {
			setIsAnimating(true);
			setStepIndex((prev) => prev + 1);
		} else {
			markTutorialCompleted(HUB_TUTORIAL.storageKey);
			setActive(false);
		}
	}, [stepIndex, filteredSteps.length]);

	/**
	 * Returns to the previous tutorial step.
	 * @returns {void}
	 */
	const handlePrev = useCallback(() => {
		if (stepIndex > 0) {
			setIsAnimating(true);
			setStepIndex((prev) => prev - 1);
		}
	}, [stepIndex]);

	/**
	 * Skips the entire tutorial and marks it as complete.
	 * @returns {void}
	 */
	const handleSkip = useCallback(() => {
		markTutorialCompleted(HUB_TUTORIAL.storageKey);
		setActive(false);
	}, []);

	if (!active || !step) return null;

	const moodConfig = PEARL_MOOD_CONFIG[step.pearlMood];
	const overlayCardClass =
		palette.mode === "owner"
			? "border-red-200/70 bg-red-50/95 dark:border-red-900/40 dark:bg-gray-900"
			: palette.mode === "legacy"
				? "border-orange-200/70 bg-orange-50/95 dark:border-orange-900/40 dark:bg-gray-900"
				: "border-slate-200/80 bg-white/95 dark:border-slate-700/50 dark:bg-gray-900";
	const stepAccentClass =
		palette.mode === "owner"
			? "text-red-500"
			: palette.mode === "legacy"
				? "text-orange-500"
				: "text-slate-600 dark:text-slate-300";

	// Render
	return (
		<>
			{/* Full-screen overlay with spotlight cutout */}
			<div className="fixed inset-0 z-[9998]" style={{ pointerEvents: "none" }}>
				{rect && !isNavigating && (
					<div
						className="transition-all duration-500 ease-out"
						style={{
							position: "absolute",
							top: rect.top,
							left: rect.left,
							width: rect.width,
							height: rect.height,
							borderRadius: "12px",
							boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.65)",
							pointerEvents: "none",
							zIndex: 9998,
						}}
					>
						{/* Pulse ring around spotlight */}
						<div
							className="absolute inset-0 animate-pulse rounded-xl"
							style={{
								boxShadow: `0 0 0 2px ${moodConfig.glowColor}, 0 0 16px ${moodConfig.glowColor}`,
							}}
						/>
					</div>
				)}
			</div>

			{/* Clickable backdrop to prevent interaction behind */}
			<div className="fixed inset-0 z-[9997]" onClick={(e) => e.stopPropagation()} />

			{/* Navigation loading indicator with PEARL */}
			{isNavigating && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center">
					<div
						className={cn(
							"flex flex-col items-center gap-3 rounded-2xl border px-8 py-6 shadow-2xl",
							overlayCardClass,
						)}
					>
						<div
							className="from-primary-500/20 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br to-slate-500/20"
							style={{ animation: "pearlSparkle 1s ease-in-out infinite" }}
						>
							<Icon name="sparkles" size="md" className="text-primary-400" />
						</div>
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">Memora AI te guide...</p>
					</div>
				</div>
			)}

			{/* Tooltip card with PEARL guide */}
			{rect && !isAnimating && !isNavigating && (
				<div
					className="fixed z-[9999] w-[400px] animate-[tutorialFadeIn_300ms_ease-out_both]"
					style={tooltipStyle}
				>
					<div className={cn("rounded-2xl border p-5 shadow-2xl backdrop-blur-sm", overlayCardClass)}>
						{/* Step indicator + skip */}
						<div className="mb-3 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div
									className={cn(
										"flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br",
										moodConfig.bgGradient,
									)}
								>
									<Icon name="sparkles" size="xs" className="text-white" />
								</div>
								<span className={cn("text-[10px] font-bold tracking-wider uppercase", stepAccentClass)}>
									Etape {stepIndex + 1}/{filteredSteps.length}
								</span>
							</div>
							<button
								onClick={handleSkip}
								className="rounded-md px-2 py-1 text-[10px] font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
							>
								Passer le tutoriel
							</button>
						</div>

						<div className="mb-2 rounded-lg bg-white/70 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-gray-600 uppercase dark:bg-gray-800/70 dark:text-gray-300">
							Assistant IA
						</div>

						{/* PEARL chat bubble section */}
						<div className="mb-4 flex items-start">
							<PearlAvatar mood={step.pearlMood} />
							<PearlBubble message={step.pearlMessage} mood={step.pearlMood} />
						</div>

						{/* Step title (secondary info below PEARL's message) */}
						<h3 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">{step.title}</h3>
						<p className="mb-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
							{step.description}
						</p>

						{/* Navigation indicator if step requires page change */}
						{step.navigateTo && (
							<div className="mb-3 flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800/60">
								<Icon name="chevronRight" size="xs" className="text-slate-500" />
								<span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
									Navigation automatique vers cette page
								</span>
							</div>
						)}

						{/* Progress dots */}
						<div className="mb-4 flex items-center justify-center gap-1.5">
							{filteredSteps.map((_, i) => (
								<div
									key={i}
									className={cn(
										"h-1.5 rounded-full transition-all duration-300",
										i === stepIndex
											? cn("w-5", palette.sidebarBadgeClass)
											: i < stepIndex
												? cn(
														"w-1.5",
														palette.mode === "default" ? "bg-slate-400" : "bg-white/40",
													)
												: "w-1.5 bg-gray-700",
									)}
								/>
							))}
						</div>

						{/* Navigation buttons */}
						<div className="flex items-center justify-between">
							<button
								onClick={handlePrev}
								disabled={stepIndex === 0}
								className={cn(
									"flex items-center gap-1 text-xs font-medium transition-colors",
									stepIndex === 0
										? "cursor-not-allowed text-gray-700"
										: "text-gray-400 hover:text-white",
								)}
							>
								<Icon name="chevronLeft" size="xs" />
								Precedent
							</button>
							<Button variant="primary" size="sm" onClick={handleNext} className="group gap-1.5">
								{step.nextLabel || "Suivant"}
								<Icon
									name="chevronRight"
									size="xs"
									className="transition-transform group-hover:translate-x-0.5"
								/>
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* PEARL animation keyframes */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes tutorialFadeIn {
					from { opacity: 0; transform: translateY(8px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@keyframes pearlBounce {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-3px); }
				}
				@keyframes pearlSparkle {
					0%, 100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
					25% { transform: scale(1.08) rotate(3deg); filter: brightness(1.3); }
					50% { transform: scale(1) rotate(-2deg); filter: brightness(1.1); }
					75% { transform: scale(1.05) rotate(1deg); filter: brightness(1.2); }
				}
				@keyframes pearlTilt {
					0%, 100% { transform: rotate(0deg); }
					25% { transform: rotate(8deg); }
					75% { transform: rotate(-5deg); }
				}
				@keyframes pearlNod {
					0%, 100% { transform: translateY(0) scale(1); }
					30% { transform: translateY(-2px) scale(1.03); }
					60% { transform: translateY(1px) scale(0.98); }
				}
				@keyframes pearlGlow {
					0%, 100% { filter: brightness(1) drop-shadow(0 0 4px rgba(236, 72, 153, 0.3)); }
					50% { filter: brightness(1.15) drop-shadow(0 0 12px rgba(236, 72, 153, 0.6)); }
				}
				@keyframes pearlPulse {
					0%, 100% { opacity: 0.4; transform: scale(1); }
					50% { opacity: 1; transform: scale(1.5); }
				}
			`,
				}}
			/>
		</>
	);
}
