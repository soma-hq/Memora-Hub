"use client";

// React
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon, Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { useHubStore } from "@/store/hub.store";
import type { TutorialStep } from "@/scripts/types";
import {

	HUB_TUTORIAL,
	hasTutorialCompleted,
	markTutorialCompleted,
	hasMinimumRole,
} from "@/scripts/tutorial/hub-tutorial";

/** Rect position of the spotlight target */
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

/**
 * Interactive tutorial overlay with spotlight effect for first-time users.
 * Supports forced page navigation between steps and permission-based step filtering.
 * @returns {JSX.Element | null} Tutorial overlay or null if not active
 */
export function TutorialOverlay() {
	// Hooks
	const router = useRouter();
	const pathname = usePathname();
	const activeGroupId = useHubStore((s) => s.activeGroupId);

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
	 * Resolves a route template by replacing {groupId} with the active group.
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
	 * Positions the tooltip relative to the spotlight rect.
	 * @param {SpotlightRect} r - Spotlight rectangle
	 * @param {TutorialStep} s - Current step
	 * @returns {void}
	 */
	const positionTooltip = useCallback((r: SpotlightRect, s: TutorialStep) => {
		const style: React.CSSProperties = { position: "absolute" };
		const tooltipW = 360;
		const tooltipH = 180;
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
			setIsNavigating(true);
			router.push(targetPath);
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

		// Delay for animation
		setIsAnimating(true);
		const t = setTimeout(
			() => {
				updateRect();
				setIsAnimating(false);
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
								boxShadow: "0 0 0 2px rgba(236, 72, 153, 0.5), 0 0 16px rgba(236, 72, 153, 0.2)",
							}}
						/>
					</div>
				)}
			</div>

			{/* Clickable backdrop to prevent interaction behind */}
			<div className="fixed inset-0 z-[9997]" onClick={(e) => e.stopPropagation()} />

			{/* Navigation loading indicator */}
			{isNavigating && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center">
					<div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-700/50 bg-gray-900 px-8 py-6 shadow-2xl">
						<div className="border-t-primary-500 h-8 w-8 animate-spin rounded-full border-2 border-gray-600" />
						<p className="text-sm font-medium text-gray-300">Navigation en cours...</p>
					</div>
				</div>
			)}

			{/* Tooltip card */}
			{rect && !isAnimating && !isNavigating && (
				<div
					className="fixed z-[9999] w-[360px] animate-[tutorialFadeIn_300ms_ease-out_both]"
					style={tooltipStyle}
				>
					<div className="rounded-2xl border border-gray-700/50 bg-gray-900 p-5 shadow-2xl backdrop-blur-sm">
						{/* Step indicator */}
						<div className="mb-3 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="bg-primary-500/20 flex h-6 w-6 items-center justify-center rounded-full">
									<Icon name="sparkles" size="xs" className="text-primary-400" />
								</div>
								<span className="text-primary-400 text-[10px] font-bold tracking-wider uppercase">
									Etape {stepIndex + 1}/{filteredSteps.length}
								</span>
							</div>
							<button
								onClick={handleSkip}
								className="rounded-md px-2 py-1 text-[10px] font-medium text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
							>
								Passer le tutoriel
							</button>
						</div>

						{/* Content */}
						<h3 className="mb-1.5 text-base font-bold text-white">{step.title}</h3>
						<p className="mb-4 text-sm leading-relaxed text-gray-400">{step.description}</p>

						{/* Navigation indicator if step requires page change */}
						{step.navigateTo && (
							<div className="bg-primary-500/10 mb-3 flex items-center gap-1.5 rounded-lg px-3 py-1.5">
								<Icon name="chevronRight" size="xs" className="text-primary-400" />
								<span className="text-primary-300 text-[10px] font-medium">
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
											? "bg-primary-500 w-5"
											: i < stepIndex
												? "bg-primary-500/50 w-1.5"
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

			{/* Animation keyframes */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes tutorialFadeIn {
					from { opacity: 0; transform: translateY(8px); }
					to { opacity: 1; transform: translateY(0); }
				}
			`,
				}}
			/>
		</>
	);
}
