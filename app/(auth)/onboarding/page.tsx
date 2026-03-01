"use client";

// React
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Icon, Input, Checkbox, Toggle } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


// Types

interface FormData {
	pseudo: string;
	prenom: string;
	nom: string;
	email: string;
	telephone: string;
	dateNaissance: string;
	langues: string[];
	anniversaire: boolean;
	discordId: string;
	twitter: string;
	instagram: string;
	twitch: string;
	youtube: string;
}

interface FormErrors {
	pseudo?: string;
	prenom?: string;
	nom?: string;
	email?: string;
	discordId?: string;
}

// Constants

const TOTAL_STEPS = 9;

const LANGUES_OPTIONS = ["Francais", "Anglais", "Espagnol", "Arabe", "Portugais", "Autre"] as const;

const DIVISION_LEVELS = [
	{ src: "/icons/marsha/marshaSquad0.png", label: "Division 0 — Academy", delay: "0ms" },
	{ src: "/icons/marsha/marshaSquad1.png", label: "Division 1 — Agent", delay: "150ms" },
	{ src: "/icons/marsha/marshaSquad2.png", label: "Division 2 — Veteran", delay: "300ms" },
	{ src: "/icons/marsha/marshaSquad3.png", label: "Division 3 — Elite", delay: "450ms" },
];

const HUB_FEATURES = [
	{ icon: "shield" as const, label: "Moderation", desc: "Sanctions, consignes, tickets" },
	{ icon: "stats" as const, label: "Momentum", desc: "Sessions, performances, objectifs" },
	{ icon: "users" as const, label: "Talent", desc: "Recrutement, formations" },
	{ icon: "flag" as const, label: "Legacy", desc: "Projets, historique, impact" },
];

const PLATFORMS = [
	{ name: "Twitch", icon: "video" as const, color: "from-purple-500 to-purple-700" },
	{ name: "Discord", icon: "chat" as const, color: "from-indigo-500 to-indigo-700" },
	{ name: "YouTube", icon: "video" as const, color: "from-red-500 to-red-700" },
	{ name: "Reddit", icon: "globe" as const, color: "from-orange-500 to-orange-700" },
];

const PIM_PHASE1_ITEMS = [
	{ icon: "document" as const, label: "Nos standards" },
	{ icon: "shield" as const, label: "Nos methodes d'intervention" },
	{ icon: "users" as const, label: "Notre facon de travailler" },
];

const PIM_PHASE2_ITEMS = [
	{ icon: "profile" as const, label: "La posture", desc: "Savoir se positionner face aux situations" },
	{ icon: "chat" as const, label: "La communication", desc: "Etre clair, precis et bienveillant" },
	{ icon: "sparkles" as const, label: "La prise de decision", desc: "Reagir avec discernement" },
	{ icon: "shield" as const, label: "La rigueur", desc: "Etre fiable et constant" },
];

/** Step labels for the progress indicator */
const STEP_LABELS = [
	"Bienvenue",
	"Marsha",
	"Position",
	"PIM 1",
	"PIM 2",
	"Donnees",
	"Formulaire",
	"Suite",
	"Celebration",
];

/** Hierarchy levels for the position pyramid visual */
const HIERARCHY_LEVELS = [
	{ label: "Owner", color: "from-amber-400 to-yellow-600" },
	{ label: "Manager", color: "from-purple-400 to-purple-600" },
	{ label: "Senior", color: "from-blue-400 to-blue-600" },
	{ label: "Agent", color: "from-teal-400 to-teal-600" },
	{ label: "Junior", color: "from-rose-400 to-rose-600", highlight: true },
];

/** Team stats displayed on the Marsha step */
const TEAM_STATS = [
	{ value: "50+", label: "Membres actifs", icon: "users" as const },
	{ value: "4", label: "Plateformes", icon: "globe" as const },
	{ value: "24/7", label: "Couverture", icon: "clock" as const },
];

/** Trust indicator badges on the data explanation step */
const TRUST_BADGES = [
	{ icon: "lock" as const, label: "Chiffre" },
	{ icon: "shield" as const, label: "Protege" },
	{ icon: "check" as const, label: "Conforme" },
];

/** Phase milestones for PIM Phase 1 progress visual */
const PHASE_MILESTONES = ["Onboarding", "Phase 1", "Phase 2", "Agent"];

/** Mini dashboard icons shown in the after-form preview strip */
const DASHBOARD_PREVIEW_ICONS = ["stats", "users", "calendar", "settings", "bell"] as const;

/**
 * Animated confetti particle for the final celebration step.
 * Each particle has unique size, color, shape, and animation timing.
 * @param {{ index: number }} props - Particle index for color and randomization
 * @returns {JSX.Element} A positioned div with falling animation
 */
function ConfettiParticle({ index }: { index: number }) {
	const style = useMemo(() => {
		const colors = [
			"#ec4899", "#f472b6", "#db2777", "#f59e0b", "#22c55e",
			"#3b82f6", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316",
		];
		const shapes = ["50%", "2px", "0"];
		const color = colors[index % colors.length];
		const left = Math.random() * 100;
		const animDuration = 2.5 + Math.random() * 2;
		const animDelay = Math.random() * 1.5;
		const size = 6 + Math.random() * 8;
		const rotation = Math.random() * 360;

		return {
			position: "absolute" as const,
			left: `${left}%`,
			top: "-10px",
			width: `${size}px`,
			height: `${size}px`,
			backgroundColor: color,
			borderRadius: shapes[index % shapes.length],
			transform: `rotate(${rotation}deg)`,
			animation: `confettiFall ${animDuration}s ease-in ${animDelay}s forwards`,
			opacity: 0,
		};
	}, [index]);

	return <div style={style} />;
}

/**
 * Floating particle component for ambient decorative effects.
 * Creates a dot that floats upward with a gentle sway.
 * @param {{ index: number; color?: string }} props - Particle index and optional color
 * @returns {JSX.Element} A floating decorative dot
 */
function FloatingParticle({ index, color = "rgba(236, 72, 153, 0.4)" }: { index: number; color?: string }) {
	const style = useMemo(() => {
		const left = 10 + Math.random() * 80;
		const duration = 4 + Math.random() * 6;
		const delay = Math.random() * 5;
		const size = 2 + Math.random() * 4;

		return {
			position: "absolute" as const,
			left: `${left}%`,
			bottom: "-10px",
			width: `${size}px`,
			height: `${size}px`,
			backgroundColor: color,
			borderRadius: "50%",
			animation: `floatUp ${duration}s ease-in-out ${delay}s infinite`,
			opacity: 0,
		};
	}, [index, color]);

	return <div style={style} />;
}

/**
 * Step overview drawer showing all 9 step names with completion indicators.
 * Collapsible via a toggle button positioned at the right edge of the screen.
 * @param {{ currentStep: number; isOpen: boolean; onToggle: () => void }} props
 * @returns {JSX.Element} The step overview drawer
 */
function StepOverviewDrawer({
	currentStep,
	isOpen,
	onToggle,
}: {
	currentStep: number;
	isOpen: boolean;
	onToggle: () => void;
}) {
	return (
		<>
			{/* Toggle button */}
			<button
				onClick={onToggle}
				className={cn(
					"fixed top-1/2 z-[60] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-l-xl border border-r-0 border-gray-700/50 bg-gray-800/90 text-gray-400 backdrop-blur-md transition-all duration-300 hover:text-white",
					isOpen ? "right-[220px]" : "right-0",
				)}
				aria-label="Toggle step overview"
			>
				<Icon name={isOpen ? "chevronRight" : "chevronLeft"} size="sm" />
			</button>

			{/* Drawer panel */}
			<div
				className={cn(
					"fixed top-0 right-0 z-[55] flex h-full w-[220px] flex-col border-l border-gray-700/50 bg-gray-900/95 pt-20 pb-6 backdrop-blur-md transition-transform duration-300",
					isOpen ? "translate-x-0" : "translate-x-full",
				)}
			>
				<div className="px-4 pb-3">
					<p className="text-xs font-bold tracking-wider text-gray-500 uppercase">Etapes</p>
				</div>
				<div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
					{STEP_LABELS.map((label, i) => (
						<div
							key={i}
							className={cn(
								"flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
								i === currentStep
									? "bg-primary-500/15 font-semibold text-primary-400"
									: i < currentStep
										? "text-gray-400"
										: "text-gray-600",
							)}
						>
							<div
								className={cn(
									"flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
									i < currentStep
										? "bg-primary-500/20 text-primary-400"
										: i === currentStep
											? "bg-primary-500 text-white"
											: "bg-gray-800 text-gray-600",
								)}
							>
								{i < currentStep ? (
									<Icon name="check" size="xs" />
								) : (
									<span>{i + 1}</span>
								)}
							</div>
							<span className="truncate">{label}</span>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

/**
 * Multi-step onboarding wizard with full Marsha narrative for new squad members.
 * Steps: Introduction > Marsha > Position > PIM Phase 1 > PIM Phase 2 > Data Explanation > Form > After Form > Celebration
 * Includes decorative illustrations, smooth transitions, and a step overview drawer.
 * @returns {JSX.Element} Full-screen onboarding flow
 */
export default function OnboardingPage() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);
	const [direction, setDirection] = useState<"forward" | "backward">("forward");
	const [isAnimating, setIsAnimating] = useState(false);
	const [stepKey, setStepKey] = useState(0);
	const [drawerOpen, setDrawerOpen] = useState(false);

	// Form state
	const [formData, setFormData] = useState<FormData>({
		pseudo: "",
		prenom: "",
		nom: "",
		email: "",
		telephone: "",
		dateNaissance: "",
		langues: [],
		anniversaire: false,
		discordId: "",
		twitter: "",
		instagram: "",
		twitch: "",
		youtube: "",
	});
	const [formErrors, setFormErrors] = useState<FormErrors>({});

	// Welcome animation state (step 0)
	const [logoVisible, setLogoVisible] = useState(false);
	const [titleVisible, setTitleVisible] = useState(false);
	const [subtitleVisible, setSubtitleVisible] = useState(false);
	const [bodyVisible, setBodyVisible] = useState(false);
	const [buttonVisible, setButtonVisible] = useState(false);

	// Team stats counter animation (step 1)
	const [statsVisible, setStatsVisible] = useState(false);

	useEffect(() => {
		if (currentStep === 0) {
			const t1 = setTimeout(() => setLogoVisible(true), 200);
			const t2 = setTimeout(() => setTitleVisible(true), 700);
			const t3 = setTimeout(() => setSubtitleVisible(true), 1100);
			const t4 = setTimeout(() => setBodyVisible(true), 1500);
			const t5 = setTimeout(() => setButtonVisible(true), 2000);
			return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
		}
	}, [currentStep]);

	useEffect(() => {
		if (currentStep === 1) {
			const t = setTimeout(() => setStatsVisible(true), 1200);
			return () => clearTimeout(t);
		}
		setStatsVisible(false);
	}, [currentStep]);

	/**
	 * Computes form completion percentage based on required fields filled.
	 * @returns {number} Completion percentage from 0 to 100
	 */
	const formProgress = useMemo(() => {
		const requiredFields: (keyof FormData)[] = ["pseudo", "prenom", "nom", "email", "discordId"];
		const filled = requiredFields.filter((f) => {
			const val = formData[f];
			return typeof val === "string" && val.trim().length > 0;
		}).length;
		return Math.round((filled / requiredFields.length) * 100);
	}, [formData]);

	// Navigation

	/**
	 * Navigates to a specific onboarding step with slide animation.
	 * @param {number} target - Target step index
	 * @returns {void}
	 */
	const goToStep = useCallback(
		(target: number) => {
			if (isAnimating || target < 0 || target >= TOTAL_STEPS) return;
			setDirection(target > currentStep ? "forward" : "backward");
			setIsAnimating(true);
			setTimeout(() => {
				setCurrentStep(target);
				setStepKey((k) => k + 1);
				setTimeout(() => setIsAnimating(false), 500);
			}, 50);
		},
		[isAnimating, currentStep],
	);

	/**
	 * Advances to the next step, validating the form on the form step (6).
	 * @returns {void}
	 */
	const nextStep = useCallback(() => {
		if (currentStep === 6) {
			const errors: FormErrors = {};
			if (!formData.pseudo.trim()) errors.pseudo = "Le pseudo est requis";
			if (!formData.prenom.trim()) errors.prenom = "Le prenom est requis";
			if (!formData.nom.trim()) errors.nom = "Le nom est requis";
			if (!formData.email.trim()) errors.email = "L'email est requis";
			else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Email invalide";
			if (!formData.discordId.trim()) errors.discordId = "Le Discord ID est requis";
			if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
			setFormErrors({});
		}
		goToStep(currentStep + 1);
	}, [currentStep, formData, goToStep]);

	/**
	 * Returns to the previous onboarding step.
	 * @returns {void}
	 */
	const prevStep = useCallback(() => { goToStep(currentStep - 1); }, [goToStep, currentStep]);

	/**
	 * Handles final completion: sets localStorage flags and navigates to the hub.
	 * The tutorial flag is removed so the tutorial triggers on first hub visit.
	 * @returns {void}
	 */
	const handleComplete = useCallback(() => {
		localStorage.setItem("memora-onboarding-completed", "true");
		localStorage.removeItem("memora-tutorial-completed");
		router.push("/hub/default");
	}, [router]);

	// Form helpers

	/**
	 * Updates a single form field and clears its validation error.
	 * @param {keyof FormData} field - The form field to update
	 * @param {string | boolean | string[]} value - The new value
	 * @returns {void}
	 */
	const updateField = useCallback((field: keyof FormData, value: string | boolean | string[]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setFormErrors((prev) => ({ ...prev, [field]: undefined }));
	}, []);

	/**
	 * Toggles a language in the selected languages list.
	 * @param {string} langue - Language to toggle
	 * @returns {void}
	 */
	const toggleLangue = useCallback((langue: string) => {
		setFormData((prev) => ({
			...prev,
			langues: prev.langues.includes(langue) ? prev.langues.filter((l) => l !== langue) : [...prev.langues, langue],
		}));
	}, []);

	// Slide animation class for step transitions
	const slideClass =
		direction === "forward"
			? "animate-[onboardSlideInRight_500ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
			: "animate-[onboardSlideInLeft_500ms_cubic-bezier(0.16,1,0.3,1)_forwards]";

	// ─── Step 0: Introduction ─────────────────────────────────────────────

	/**
	 * Renders the introduction welcome page with animated reveal,
	 * floating particles, pulsing rings, and animated Memora logo text.
	 * @returns {JSX.Element} Welcome step
	 */
	const renderIntroduction = () => (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
			{/* Background layers */}
			<div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-red-950/40 to-gray-950" />
			<div className="from-primary-500/20 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br to-transparent blur-[120px]" />
			<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.4) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

			{/* Floating particles */}
			<div className="absolute inset-0 overflow-hidden">
				{Array.from({ length: 20 }).map((_, i) => (
					<FloatingParticle key={`p-${i}`} index={i} color={i % 2 === 0 ? "rgba(236, 72, 153, 0.3)" : "rgba(139, 92, 246, 0.3)"} />
				))}
			</div>

			{/* Pulsing rings behind logo */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<div className="absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-500/10 animate-[pulseRing_3s_ease-out_infinite]" />
				<div className="absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-500/10 animate-[pulseRing_3s_ease-out_1s_infinite]" />
				<div className="absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-500/10 animate-[pulseRing_3s_ease-out_2s_infinite]" />
			</div>

			<div className="relative z-10 flex max-w-xl flex-col items-center gap-6 text-center">
				<div className={cn("transition-all duration-1000 ease-out", logoVisible ? "scale-100 opacity-100" : "scale-50 opacity-0")}>
					<div className="relative animate-[onboardPulse_3s_ease-in-out_infinite]">
						<div className="from-primary-500/30 absolute inset-0 rounded-full bg-gradient-to-br to-transparent blur-3xl" />
						<Image src="/logos/memora-logo.png" alt="Memora" width={120} height={120} className="relative drop-shadow-2xl" priority />
					</div>
				</div>

				{/* Animated MEMORA letter text */}
				<div className={cn("flex items-center gap-1 transition-all duration-700 ease-out", logoVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
					{"MEMORA".split("").map((char, i) => (
						<span
							key={i}
							className="text-primary-400/60 text-xs font-bold tracking-[0.3em] animate-[letterGlow_2s_ease-in-out_infinite]"
							style={{ animationDelay: `${i * 200}ms` }}
						>
							{char}
						</span>
					))}
				</div>

				<h1 className={cn("font-serif text-4xl font-bold text-white transition-all duration-700 ease-out sm:text-5xl", titleVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
					Bienvenue dans ton espace <span className="text-primary-400">Marsha</span>
				</h1>

				<p className={cn("text-lg leading-relaxed text-gray-300 transition-all duration-700 ease-out", subtitleVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")}>
					Si tu es ici, c&apos;est que tu as deja franchi une premiere etape importante. Tes echanges avec nous ont montre ton potentiel et nous sommes ravis de t&apos;accueillir parmi nous !
				</p>

				<div className={cn("max-w-md transition-all duration-700 ease-out", bodyVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")}>
					<p className="text-base text-gray-400">
						A partir d&apos;ici, ton integration commence pour de vrai. Pas de panique, tu ne seras jamais seul(e).
					</p>
				</div>

				<div className={cn("transition-all duration-700 ease-out", buttonVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")}>
					<Button variant="primary" size="lg" onClick={nextStep} className="group mt-4 gap-2 px-8">
						Commencer
						<Icon name="chevronRight" size="sm" className="transition-transform group-hover:translate-x-1" />
					</Button>
				</div>
			</div>

			<div className="absolute bottom-6 text-xs text-gray-600">Memora Hub v1.0</div>
		</div>
	);

	// ─── Step 1: Marsha, concretement ─────────────────────────────────────

	/**
	 * Renders the Marsha platforms and team overview with hover effects
	 * on platform cards and animated team stats counters.
	 * @returns {JSX.Element} Marsha concrete explanation step
	 */
	const renderMarshaConcretement = () => (
		<div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
			<div className="flex max-w-3xl flex-col items-center gap-10">
				<div className="flex animate-[onboardFadeUp_600ms_ease-out_200ms_both] flex-col items-center gap-4 text-center">
					<div className="from-primary-500 to-primary-700 relative rounded-2xl bg-gradient-to-br p-3">
						<Icon name="shield" size="lg" className="text-white" />
						{/* Decorative glow */}
						<div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-primary-500/30 to-primary-700/30 blur-lg" />
					</div>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Marsha, concretement</h2>
					<p className="max-w-lg text-lg leading-relaxed text-gray-300">
						Marsha intervient sur plusieurs plateformes : la ou se retrouvent des communautes actives qui ont besoin d&apos;un cadre sain.
					</p>
				</div>

				{/* Platforms grid with hover effects */}
				<div className="grid w-full max-w-lg animate-[onboardFadeUp_600ms_ease-out_400ms_both] grid-cols-2 gap-3">
					{PLATFORMS.map((platform, i) => (
						<div
							key={platform.name}
							className="group flex animate-[onboardScaleIn_400ms_ease-out_both] items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-800/60 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-gray-600/60 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-gray-900/50"
							style={{ animationDelay: `${500 + i * 100}ms` }}
						>
							<div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br transition-transform duration-300 group-hover:scale-110", platform.color)}>
								<Icon name={platform.icon} size="sm" className="text-white" />
							</div>
							<span className="text-sm font-semibold text-white">{platform.name}</span>
						</div>
					))}
				</div>

				{/* Team stats counters */}
				<div className="grid w-full max-w-lg animate-[onboardFadeUp_600ms_ease-out_600ms_both] grid-cols-3 gap-3">
					{TEAM_STATS.map((stat, i) => (
						<div
							key={stat.label}
							className={cn(
								"flex flex-col items-center gap-1 rounded-xl border border-gray-700/30 bg-gray-800/40 p-4 transition-all duration-500",
								statsVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
							)}
							style={{ transitionDelay: `${i * 150}ms` }}
						>
							<Icon name={stat.icon} size="sm" className="mb-1 text-primary-400" />
							<span className="text-xl font-bold text-white">{stat.value}</span>
							<span className="text-[10px] text-gray-500">{stat.label}</span>
						</div>
					))}
				</div>

				{/* Key points */}
				<div className="flex max-w-lg animate-[onboardFadeUp_600ms_ease-out_700ms_both] flex-col gap-4">
					<p className="text-center text-base text-gray-400">Derriere ce travail, il y a :</p>
					{[
						"Des equipes organisees et chill",
						"Des responsables pour t'accompagner",
						"Des methodes internes pour faciliter ton quotidien",
					].map((item, i) => (
						<div key={i} className="flex items-center gap-3 rounded-lg border border-gray-700/30 bg-gray-800/40 px-4 py-3">
							<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500/20">
								<Icon name="check" size="xs" className="text-primary-400" />
							</div>
							<span className="text-sm text-gray-300">{item}</span>
						</div>
					))}
				</div>

				<p className="animate-[onboardFadeUp_600ms_ease-out_1000ms_both] text-center text-sm text-gray-500">
					Tu n&apos;as pas besoin de tout comprendre maintenant, tu comprendras plus facilement au fil du temps
				</p>
			</div>
		</div>
	);

	// ─── Step 2: Ta position actuelle ─────────────────────────────────────

	/**
	 * Renders the current position / Marsha Academy explanation
	 * with a visual hierarchy pyramid showing the Junior to Owner path.
	 * @returns {JSX.Element} Position step
	 */
	const renderPosition = () => (
		<div className="flex min-h-screen flex-col items-center justify-center px-6 py-20 lg:flex-row lg:gap-16 lg:px-20">
			<div className="flex max-w-lg flex-1 animate-[onboardFadeUp_600ms_ease-out_200ms_both] flex-col gap-6">
				<div className="flex items-center gap-3">
					<div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-2.5">
						<Icon name="training" size="lg" className="text-white" />
					</div>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Ta position actuelle</h2>
				</div>

				<p className="text-lg leading-relaxed text-gray-300">
					Des maintenant, tu entres dans la <span className="font-bold text-amber-400">Marsha Academy</span>, notre programme d&apos;integration
				</p>

				<p className="text-lg leading-relaxed text-gray-400">
					Pendant cette periode, tu es considere(e) comme <span className="font-semibold text-white">Junior.</span>
				</p>

				<div className="rounded-xl border border-gray-700/50 bg-gray-800/60 p-5 backdrop-blur-sm">
					<p className="text-sm leading-relaxed text-gray-300">
						Concretement, ca veut dire que tu es en phase d&apos;apprentissage, tu es encadre(e) et tu peux poser toutes tes questions. A noter que tu n&apos;es <span className="font-bold text-amber-400">pas encore</span> moderateur officiel.
					</p>
				</div>

				<p className="text-base text-gray-400">
					L&apos;objectif est simple : <span className="text-white">te former, t&apos;evaluer et t&apos;aider a atteindre le niveau attendu</span> et a ton rythme.
				</p>

				{/* Hierarchy pyramid */}
				<div className="mt-4 flex animate-[onboardFadeUp_600ms_ease-out_800ms_both] flex-col items-center gap-1.5">
					<p className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Hierarchie</p>
					{HIERARCHY_LEVELS.map((level, i) => (
						<div
							key={level.label}
							className={cn(
								"flex items-center justify-center rounded-lg py-1.5 text-xs font-bold text-white/90 animate-[onboardScaleIn_400ms_ease-out_both]",
								`bg-gradient-to-r ${level.color}`,
								level.highlight ? "ring-2 ring-white/30 ring-offset-2 ring-offset-gray-900" : "",
							)}
							style={{
								width: `${100 + i * 30}px`,
								animationDelay: `${900 + i * 100}ms`,
							}}
						>
							{level.label}
							{level.highlight && (
								<span className="ml-1.5 rounded bg-white/20 px-1.5 py-0.5 text-[10px]">Toi</span>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Division levels */}
			<div className="mt-10 flex flex-1 flex-col items-center gap-4 lg:mt-0">
				<div className="mb-4 animate-[onboardScaleIn_600ms_ease-out_400ms_both]">
					<div className="relative">
						<div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/20 to-transparent blur-2xl" />
						<Image src="/icons/marsha/marshaSquad.png" alt="Marsha Squad" width={100} height={100} className="relative drop-shadow-xl" />
					</div>
				</div>

				<div className="relative flex flex-col items-center gap-3">
					<div className="from-primary-500/40 via-primary-500/20 absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 animate-[onboardLineGrow_800ms_ease-out_600ms_both] bg-gradient-to-b to-transparent" />
					{DIVISION_LEVELS.map((div, i) => (
						<div
							key={div.label}
							className={cn(
								"relative z-10 flex animate-[onboardFadeUp_500ms_ease-out_both] items-center gap-4 rounded-2xl border px-5 py-3 shadow-xl backdrop-blur-sm",
								i === 0
									? "border-amber-500/40 bg-amber-900/20"
									: "border-gray-700/50 bg-gray-800/80",
							)}
							style={{ animationDelay: `${600 + i * 150}ms` }}
						>
							<Image src={div.src} alt={div.label} width={40} height={40} className="shrink-0" />
							<div className="flex flex-col">
								<span className="text-sm font-semibold text-white">{div.label}</span>
								<span className="text-xs text-gray-500">Niveau {i}</span>
							</div>
							{i === 0 && (
								<span className="ml-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-2.5 py-0.5 text-xs font-bold text-white">
									Toi
								</span>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);

	// ─── Step 3: PIM Phase 1 ──────────────────────────────────────────────

	/**
	 * Renders PIM Phase 1: L'apprentissage, with progress milestones
	 * and animated checklist items that pop in sequentially.
	 * @returns {JSX.Element} PIM Phase 1 step
	 */
	const renderPIMPhase1 = () => (
		<div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
			<div className="flex max-w-2xl flex-col items-center gap-8">
				<div className="flex animate-[onboardFadeUp_600ms_ease-out_200ms_both] flex-col items-center gap-4 text-center">
					<div className="flex items-center gap-2">
						<span className="rounded-full bg-primary-500/20 px-3 py-1 text-xs font-bold text-primary-400">PHASE 1</span>
					</div>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">La PIM : l&apos;apprentissage</h2>
					<p className="max-w-md text-base text-gray-400">
						Ta periode d&apos;integration de moderation commence ici. Dans cette premiere phase, tu vas decouvrir :
					</p>
				</div>

				{/* Phase milestones progress bar */}
				<div className="w-full max-w-md animate-[onboardFadeUp_600ms_ease-out_400ms_both]">
					<div className="relative flex items-center justify-between">
						{/* Connecting line */}
						<div className="absolute top-4 right-6 left-6 h-0.5 bg-gray-700">
							<div className="h-full w-1/3 animate-[progressGrow_1s_ease-out_800ms_both] bg-gradient-to-r from-primary-500 to-primary-400" />
						</div>
						{PHASE_MILESTONES.map((milestone, i) => (
							<div key={milestone} className="relative z-10 flex flex-col items-center gap-2">
								<div
									className={cn(
										"flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold animate-[onboardScaleIn_400ms_ease-out_both]",
										i === 0
											? "bg-primary-500 text-white"
											: i === 1
												? "border-2 border-primary-500/50 bg-gray-800 text-primary-400"
												: "border border-gray-700 bg-gray-800 text-gray-500",
									)}
									style={{ animationDelay: `${600 + i * 150}ms` }}
								>
									{i === 0 ? <Icon name="check" size="xs" /> : i + 1}
								</div>
								<span className={cn("text-[10px] font-medium", i <= 1 ? "text-primary-400" : "text-gray-600")}>{milestone}</span>
							</div>
						))}
					</div>
				</div>

				{/* Checklist items with animated check marks */}
				<div className="flex w-full max-w-md animate-[onboardFadeUp_600ms_ease-out_500ms_both] flex-col gap-3">
					{PIM_PHASE1_ITEMS.map((item, i) => (
						<div
							key={item.label}
							className="flex animate-[onboardSlideCardIn_500ms_ease-out_both] items-center gap-4 rounded-xl border border-gray-700/50 bg-gray-800/60 p-4 backdrop-blur-sm"
							style={{ animationDelay: `${600 + i * 150}ms` }}
						>
							<div className="bg-primary-500/15 text-primary-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
								<Icon name={item.icon} size="md" />
							</div>
							<span className="flex-1 text-sm font-medium text-white">{item.label}</span>
							<div
								className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/10 animate-[checkPop_400ms_ease-out_both]"
								style={{ animationDelay: `${1000 + i * 200}ms` }}
							>
								<Icon name="check" size="xs" className="text-primary-400" />
							</div>
						</div>
					))}
				</div>

				<div className="max-w-md animate-[onboardFadeUp_600ms_ease-out_900ms_both] rounded-xl border border-indigo-500/20 bg-indigo-900/10 p-5">
					<div className="mb-2 flex items-center gap-2">
						<Icon name="profile" size="sm" className="text-indigo-400" />
						<span className="text-sm font-bold text-indigo-300">Ton Referent</span>
					</div>
					<p className="text-sm leading-relaxed text-gray-400">
						Tu seras accompagne(e) par un <span className="text-white">Referent</span>. Son role va etre de te guider, de repondre a tes questions, de te donner des retours constructifs et de t&apos;aider a progresser tout au long de ton apprentissage
					</p>
				</div>
			</div>
		</div>
	);

	// ─── Step 4: PIM Phase 2 ──────────────────────────────────────────────

	/**
	 * Renders PIM Phase 2: Le perfectionnement, with skill cards
	 * that use a flip-in animation on appear and hover effects.
	 * @returns {JSX.Element} PIM Phase 2 step
	 */
	const renderPIMPhase2 = () => (
		<div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
			<div className="flex max-w-2xl flex-col items-center gap-8">
				<div className="flex animate-[onboardFadeUp_600ms_ease-out_200ms_both] flex-col items-center gap-4 text-center">
					<div className="flex items-center gap-2">
						<span className="rounded-full bg-success-500/20 px-3 py-1 text-xs font-bold text-success-400">PHASE 2</span>
					</div>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Le perfectionnement</h2>
					<p className="max-w-md text-base text-gray-400">
						Si la premiere phase est validee, tu passes au perfectionnement ! On va alors travailler sur tes axes d&apos;amelioration :
					</p>
				</div>

				{/* Skill cards with flip-in animation */}
				<div className="grid w-full max-w-lg animate-[onboardFadeUp_600ms_ease-out_500ms_both] grid-cols-1 gap-3 sm:grid-cols-2">
					{PIM_PHASE2_ITEMS.map((item, i) => (
						<div
							key={item.label}
							className="animate-[flipIn_600ms_ease-out_both]"
							style={{ animationDelay: `${600 + i * 120}ms` }}
						>
							<div className="group relative flex flex-col gap-2 rounded-xl border border-gray-700/50 bg-gray-800/60 p-4 backdrop-blur-sm transition-all duration-300 hover:border-success-500/30 hover:bg-gray-800/80">
								{/* Decorative corner accent */}
								<div className="absolute top-0 right-0 h-12 w-12 overflow-hidden rounded-tr-xl">
									<div className="absolute -top-6 -right-6 h-12 w-12 rotate-45 bg-gradient-to-br from-success-500/10 to-transparent" />
								</div>
								<div className="flex items-center gap-2">
									<div className="bg-success-500/15 text-success-400 flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110">
										<Icon name={item.icon} size="sm" />
									</div>
									<span className="text-sm font-semibold text-white">{item.label}</span>
								</div>
								<p className="text-xs text-gray-400">{item.desc}</p>
							</div>
						</div>
					))}
				</div>

				<div className="max-w-md animate-[onboardFadeUp_600ms_ease-out_1000ms_both] rounded-xl border border-gray-700/30 bg-gray-800/40 p-5 text-center">
					<p className="text-sm leading-relaxed text-gray-400">
						Il ne s&apos;agit pas d&apos;etre parfait. Le but est d&apos;etre <span className="font-semibold text-white">fiable et a l&apos;aise</span> dans ton role. La validation dependra de ton niveau reel, pas du temps passe
					</p>
				</div>
			</div>
		</div>
	);

	// ─── Step 5: Avant de commencer (Data explanation) ────────────────────

	/**
	 * Renders the data collection explanation and privacy notice
	 * with an animated shield visual and trust indicator badges.
	 * @returns {JSX.Element} Data explanation step
	 */
	const renderAvantDeCommencer = () => (
		<div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
			<div className="flex max-w-2xl flex-col items-center gap-8">
				<div className="flex animate-[onboardFadeUp_600ms_ease-out_200ms_both] flex-col items-center gap-4 text-center">
					{/* Animated shield visual with pulsing rings */}
					<div className="relative">
						<div className="rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-3">
							<Icon name="shield" size="lg" className="text-white" />
						</div>
						<div className="absolute -inset-3 rounded-3xl border border-teal-500/20 animate-[shieldPulse_2s_ease-in-out_infinite]" />
						<div className="absolute -inset-6 rounded-3xl border border-teal-500/10 animate-[shieldPulse_2s_ease-in-out_0.5s_infinite]" />
					</div>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Avant de commencer</h2>
					<p className="max-w-md text-base text-gray-400">
						Avant d&apos;entrer officiellement dans ta PIM, une derniere etape est necessaire. Tu vas remplir un formulaire de donnees personnelles.
					</p>
				</div>

				<div className="w-full max-w-lg animate-[onboardFadeUp_600ms_ease-out_500ms_both]">
					<p className="mb-4 text-center text-sm font-semibold text-gray-300">Pourquoi ca ?</p>
					<div className="flex flex-col gap-3">
						{[
							{ icon: "profile" as const, text: "Identifier chaque membre correctement" },
							{ icon: "lock" as const, text: "Attribuer les bons acces" },
							{ icon: "stats" as const, text: "Assurer un suivi fiable" },
							{ icon: "shield" as const, text: "Respecter nos obligations legales" },
						].map((item, i) => (
							<div
								key={i}
								className="flex animate-[onboardSlideCardIn_400ms_ease-out_both] items-center gap-3 rounded-lg border border-gray-700/30 bg-gray-800/40 px-4 py-3"
								style={{ animationDelay: `${600 + i * 100}ms` }}
							>
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400">
									<Icon name={item.icon} size="sm" />
								</div>
								<span className="text-sm text-gray-300">{item.text}</span>
							</div>
						))}
					</div>
				</div>

				{/* Trust indicator badges */}
				<div className="flex w-full max-w-lg animate-[onboardFadeUp_600ms_ease-out_800ms_both] items-center justify-center gap-6">
					{TRUST_BADGES.map((trust, i) => (
						<div key={trust.label} className="flex flex-col items-center gap-1.5">
							<div
								className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/10 animate-[trustFadeIn_500ms_ease-out_both]"
								style={{ animationDelay: `${900 + i * 150}ms` }}
							>
								<Icon name={trust.icon} size="sm" className="text-teal-400" />
							</div>
							<span className="text-[10px] font-medium text-teal-400/70">{trust.label}</span>
						</div>
					))}
				</div>

				{/* Phone number explanation */}
				<div className="max-w-lg animate-[onboardFadeUp_600ms_ease-out_900ms_both] rounded-xl border border-info-500/20 bg-info-900/10 p-5">
					<div className="mb-2 flex items-center gap-2">
						<Icon name="phone" size="sm" className="text-info-400" />
						<span className="text-sm font-bold text-info-300">A propos du telephone</span>
					</div>
					<p className="text-xs leading-relaxed text-gray-400">
						Nous le stockerons dans le cas ou, meme si on te le souhaitera jamais, tu aurais un souci urgent comme un probleme de sante et que tu ne reponds plus. Nous nous permettront de t&apos;appeler pour s&apos;assurer que tout va bien. Ca ne sera qu&apos;un usage professionnel.
					</p>
				</div>

				{/* Privacy badge */}
				<div className="flex animate-[onboardFadeUp_600ms_ease-out_1100ms_both] items-center gap-2 rounded-full border border-gray-700/30 bg-gray-800/30 px-4 py-2">
					<Icon name="lock" size="xs" className="text-primary-400" />
					<span className="text-xs text-gray-400">Tes donnees restent strictement internes, elles ne seront ni revendues ni partagees en dehors.</span>
				</div>
			</div>
		</div>
	);

	// ─── Step 6: Formulaire ───────────────────────────────────────────────

	/**
	 * Renders the personal data form with identity, languages, and social fields.
	 * Includes a subtle progress bar indicating form completion percentage.
	 * @returns {JSX.Element} Form step
	 */
	const renderForm = () => (
		<div className="flex min-h-screen flex-col items-center justify-start px-4 py-16 sm:px-6 lg:justify-center">
			<div className="w-full max-w-2xl animate-[onboardFadeUp_500ms_ease-out_both]">
				<div className="mb-8 flex flex-col items-center gap-2 text-center">
					<div className="mb-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5">
						<Icon name="profile" size="lg" className="text-white" />
					</div>
					<h2 className="font-serif text-3xl font-bold text-white">Tes informations</h2>
					<p className="text-gray-400">Prends bien le temps de verifier tes informations</p>

					{/* Form progress indicator */}
					<div className="mt-3 flex w-full max-w-xs items-center gap-3">
						<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
							<div
								className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
								style={{ width: `${formProgress}%` }}
							/>
						</div>
						<span className="text-xs font-medium text-gray-500">{formProgress}%</span>
					</div>
				</div>

				<div className="flex flex-col gap-8 rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 shadow-xl backdrop-blur-sm sm:p-8">
					{/* Identity */}
					<div className="flex flex-col gap-5">
						<h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
							<Icon name="profile" size="xs" />Identite
						</h3>
						<div className="grid gap-4 sm:grid-cols-2">
							<Input label="Pseudo (Discord) *" placeholder="TonPseudo#0000" value={formData.pseudo} onChange={(e) => updateField("pseudo", e.target.value)} error={formErrors.pseudo} icon="chat" />
							<Input label="Discord ID *" placeholder="123456789012345678" value={formData.discordId} onChange={(e) => updateField("discordId", e.target.value)} error={formErrors.discordId} icon="lock" />
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<Input label="Prenom *" placeholder="Ton prenom" value={formData.prenom} onChange={(e) => updateField("prenom", e.target.value)} error={formErrors.prenom} />
							<Input label="Nom *" placeholder="Ton nom" value={formData.nom} onChange={(e) => updateField("nom", e.target.value)} error={formErrors.nom} />
						</div>
						<Input label="Email *" type="email" placeholder="ton@email.com" value={formData.email} onChange={(e) => updateField("email", e.target.value)} error={formErrors.email} icon="globe" />
						<div className="grid gap-4 sm:grid-cols-2">
							<Input label="Telephone" type="tel" placeholder="+33 6 12 34 56 78" value={formData.telephone} onChange={(e) => updateField("telephone", e.target.value)} />
							<Input label="Date de naissance" type="date" value={formData.dateNaissance} onChange={(e) => updateField("dateNaissance", e.target.value)} />
						</div>
					</div>
					<div className="h-px bg-gray-700/50" />
					{/* Languages */}
					<div className="flex flex-col gap-4">
						<h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-400 uppercase"><Icon name="globe" size="xs" />Langues parlees</h3>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{LANGUES_OPTIONS.map((langue) => (<Checkbox key={langue} label={langue} checked={formData.langues.includes(langue)} onChange={() => toggleLangue(langue)} />))}
						</div>
					</div>
					<div className="h-px bg-gray-700/50" />
					{/* Preferences */}
					<div className="flex flex-col gap-4">
						<h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-400 uppercase"><Icon name="bell" size="xs" />Preferences</h3>
						<Toggle checked={formData.anniversaire} onChange={(checked) => updateField("anniversaire", checked)} label="Souhait d'anniversaire" description="Recevoir un message de l'equipe le jour de ton anniversaire" />
					</div>
					<div className="h-px bg-gray-700/50" />
					{/* Social */}
					<div className="flex flex-col gap-4">
						<h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-400 uppercase"><Icon name="globe" size="xs" />Reseaux sociaux <span className="text-xs font-normal text-gray-500 normal-case">(optionnel)</span></h3>
						<div className="grid gap-4 sm:grid-cols-2">
							<Input label="Twitter / X" placeholder="@tonpseudo" value={formData.twitter} onChange={(e) => updateField("twitter", e.target.value)} />
							<Input label="Instagram" placeholder="@tonpseudo" value={formData.instagram} onChange={(e) => updateField("instagram", e.target.value)} />
							<Input label="Twitch" placeholder="tonpseudo" value={formData.twitch} onChange={(e) => updateField("twitch", e.target.value)} />
							<Input label="YouTube" placeholder="Lien de ta chaine" value={formData.youtube} onChange={(e) => updateField("youtube", e.target.value)} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	// ─── Step 7: Apres le formulaire ──────────────────────────────────────

	/**
	 * Renders the post-form step explaining what comes next,
	 * with animated feature preview cards for Hub modules and a preview strip.
	 * @returns {JSX.Element} After form step
	 */
	const renderApresFormulaire = () => (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20">
			<div className="absolute inset-0 z-0">
				<Image src="/banners/inoxtag-banner.png" alt="" fill className="object-cover opacity-[0.07] blur-xl" priority={false} />
				<div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/95 to-gray-900" />
			</div>

			<div className="relative z-10 flex max-w-2xl flex-col items-center gap-8 text-center">
				<div className="flex animate-[onboardScaleIn_600ms_ease-out_200ms_both] flex-col items-center gap-4">
					<div className="animate-[celebrateBounce_1s_ease-out_both] text-4xl">🎉</div>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Formulaire valide !</h2>
					<p className="text-lg leading-relaxed text-gray-300">
						Tu entres officiellement dans ta PIM. Tu auras ensuite acces a <span className="font-bold text-primary-400">Memora Hub</span>, qui regroupe tout ce dont tu auras besoin :
					</p>
				</div>

				{/* Feature preview cards with hover interactions */}
				<div className="flex w-full max-w-md flex-col gap-3">
					{HUB_FEATURES.map((feature, i) => (
						<div
							key={feature.label}
							className="group flex animate-[onboardSlideCardIn_500ms_cubic-bezier(0.16,1,0.3,1)_both] items-center gap-4 rounded-2xl border border-gray-700/50 bg-gray-800/60 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-600/50 hover:bg-gray-800/80"
							style={{ animationDelay: `${400 + i * 150}ms` }}
						>
							<div className={cn(
								"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
								i === 0 && "bg-primary-500/15 text-primary-400",
								i === 1 && "bg-info-500/15 text-info-400",
								i === 2 && "bg-success-500/15 text-success-400",
								i === 3 && "bg-warning-500/15 text-warning-400",
							)}>
								<Icon name={feature.icon} size="md" />
							</div>
							<div className="flex flex-col text-left">
								<span className="text-sm font-semibold text-white">{feature.label}</span>
								<span className="text-xs text-gray-400">{feature.desc}</span>
							</div>
							<Icon name="chevronRight" size="xs" className="ml-auto text-gray-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-400" />
						</div>
					))}
				</div>

				{/* Mini dashboard preview strip */}
				<div className="flex animate-[onboardFadeUp_600ms_ease-out_950ms_both] items-center gap-4 rounded-xl border border-gray-700/20 bg-gray-800/30 px-5 py-3">
					{DASHBOARD_PREVIEW_ICONS.map((icon, i) => (
						<div
							key={icon}
							className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/30 text-gray-500 animate-[onboardScaleIn_300ms_ease-out_both]"
							style={{ animationDelay: `${1000 + i * 80}ms` }}
						>
							<Icon name={icon} size="sm" />
						</div>
					))}
				</div>

				<div className="max-w-md animate-[onboardFadeUp_600ms_ease-out_1000ms_both] rounded-xl border border-gray-700/30 bg-gray-800/40 p-5">
					<p className="text-sm text-gray-400">
						Mais pour l&apos;instant, ton objectif est simple : <span className="font-semibold text-white">apprendre, progresser et trouver ta place dans l&apos;equipe.</span>
					</p>
					<p className="mt-3 text-sm text-gray-500">On est heureux de t&apos;avoir avec nous</p>
				</div>
			</div>
		</div>
	);

	// ─── Step 8: Celebration ──────────────────────────────────────────────

	/**
	 * Renders the final celebration with enhanced confetti, holographic squad card,
	 * animated letter-by-letter welcome text, and completion handler with localStorage flags.
	 * @returns {JSX.Element} Celebration step
	 */
	const renderCelebration = () => (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
			{/* Background */}
			<div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
			<div className="from-primary-500/15 absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br to-transparent blur-[150px]" />

			{/* Additional drifting glow effects */}
			<div className="absolute top-1/4 left-1/4 h-[200px] w-[200px] rounded-full bg-purple-500/10 blur-[100px] animate-[driftSlow_8s_ease-in-out_infinite]" />
			<div className="absolute right-1/4 bottom-1/4 h-[200px] w-[200px] rounded-full bg-pink-500/10 blur-[100px] animate-[driftSlow_8s_ease-in-out_2s_infinite]" />

			{/* Confetti layer with more variety */}
			<div className="absolute inset-0 overflow-hidden">
				{Array.from({ length: 80 }).map((_, i) => (<ConfettiParticle key={i} index={i} />))}
			</div>

			{/* Floating sparkle particles */}
			<div className="absolute inset-0 overflow-hidden">
				{Array.from({ length: 12 }).map((_, i) => (
					<FloatingParticle key={`sp-${i}`} index={i} color={i % 3 === 0 ? "rgba(236, 72, 153, 0.4)" : i % 3 === 1 ? "rgba(139, 92, 246, 0.4)" : "rgba(59, 130, 246, 0.4)"} />
				))}
			</div>

			<div className="relative z-10 flex flex-col items-center gap-6 text-center">
				<div className="animate-[onboardScaleIn_600ms_ease-out_300ms_both]">
					<div className="relative">
						<div className="from-primary-500/30 absolute inset-0 rounded-full bg-gradient-to-br to-transparent blur-2xl" />
						<Image src="/icons/marsha/marshaSquad0.png" alt="Marsha Academy" width={100} height={100} className="relative drop-shadow-xl" />
						{/* Celebration pulsing rings */}
						<div className="absolute -inset-4 rounded-full border border-primary-500/20 animate-[pulseRing_2s_ease-out_infinite]" />
						<div className="absolute -inset-8 rounded-full border border-primary-500/10 animate-[pulseRing_2s_ease-out_0.6s_infinite]" />
					</div>
				</div>

				{/* Animated welcome text with letter-by-letter reveal */}
				<div className="animate-[onboardFadeUp_600ms_ease-out_500ms_both]">
					<h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">
						{"Bienvenue, ".split("").map((char, i) => (
							<span key={i} className="inline-block animate-[letterReveal_400ms_ease-out_both]" style={{ animationDelay: `${600 + i * 40}ms` }}>
								{char === " " ? "\u00a0" : char}
							</span>
						))}
						<span className="text-primary-400 animate-[onboardFadeUp_500ms_ease-out_1100ms_both]">{formData.pseudo || "Recrue"}</span>
						<span className="animate-[onboardFadeUp_500ms_ease-out_1200ms_both]"> !</span>
					</h1>
				</div>

				<div className="flex animate-[onboardFadeUp_600ms_ease-out_700ms_both] flex-col gap-3">
					<p className="text-lg text-gray-300">Tu es desormais membre de la Marsha Squad.</p>
					<div className="mx-auto mt-2 inline-flex items-center gap-2 rounded-full border border-gray-700/50 bg-gray-800/60 px-5 py-2 backdrop-blur-sm">
						<Image src="/icons/marsha/marshaSquad0.png" alt="" width={24} height={24} />
						<span className="text-sm font-semibold text-white">Ta division : Marsha Academy (Division 0)</span>
					</div>
					<p className="mt-4 text-lg font-medium text-gray-400">Ton aventure commence maintenant.</p>
				</div>

				{/* Holographic squad card */}
				<div className="holoCard mt-2 w-full max-w-sm animate-[onboardFadeUp_600ms_ease-out_900ms_both] rounded-2xl border border-gray-700/50 p-5 backdrop-blur-sm">
					<div className="mb-3 flex items-center gap-2">
						<Icon name="users" size="sm" className="text-primary-400" />
						<span className="text-xs font-bold tracking-wider text-primary-400 uppercase">Carte Squad creee</span>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-lg font-bold text-white">
							{formData.pseudo ? formData.pseudo[0].toUpperCase() : "R"}
						</div>
						<div className="text-left">
							<p className="text-sm font-semibold text-white">{formData.pseudo || "Recrue"}</p>
							<p className="text-xs text-gray-400">{formData.prenom || "Nouveau"} {formData.nom || "Membre"}</p>
							<p className="text-[10px] text-gray-500">Junior — Marsha Academy</p>
						</div>
					</div>
				</div>

				<div className="mt-4 animate-[onboardFadeUp_600ms_ease-out_1100ms_both]">
					<Button variant="primary" size="lg" onClick={handleComplete} className="group shadow-primary-500/20 gap-2 px-10 shadow-lg">
						Acceder au Hub
						<Icon name="chevronRight" size="sm" className="transition-transform group-hover:translate-x-1" />
					</Button>
				</div>

				<div className="mt-3 flex animate-[onboardFadeUp_600ms_ease-out_1300ms_both] items-center gap-2 text-gray-500">
					<Icon name="sparkles" size="xs" />
					<span className="text-xs">Bonne chance, Agent.</span>
					<Icon name="sparkles" size="xs" />
				</div>
			</div>
		</div>
	);

	// Step map
	const steps = [
		renderIntroduction,
		renderMarshaConcretement,
		renderPosition,
		renderPIMPhase1,
		renderPIMPhase2,
		renderAvantDeCommencer,
		renderForm,
		renderApresFormulaire,
		renderCelebration,
	];

	// Render
	return (
		<>
			<style dangerouslySetInnerHTML={{ __html: `
				/* Slide transitions */
				@keyframes onboardSlideInRight {
					from { transform: translateX(60px); opacity: 0; }
					to { transform: translateX(0); opacity: 1; }
				}
				@keyframes onboardSlideInLeft {
					from { transform: translateX(-60px); opacity: 0; }
					to { transform: translateX(0); opacity: 1; }
				}

				/* Basic element animations */
				@keyframes onboardFadeUp {
					from { transform: translateY(24px); opacity: 0; }
					to { transform: translateY(0); opacity: 1; }
				}
				@keyframes onboardScaleIn {
					from { transform: scale(0.6); opacity: 0; }
					to { transform: scale(1); opacity: 1; }
				}
				@keyframes onboardPulse {
					0%, 100% { transform: scale(1); }
					50% { transform: scale(1.05); }
				}
				@keyframes onboardLineGrow {
					from { transform: translateX(-50%) scaleY(0); transform-origin: top; }
					to { transform: translateX(-50%) scaleY(1); transform-origin: top; }
				}
				@keyframes onboardSlideCardIn {
					from { transform: translateX(40px) translateY(10px); opacity: 0; }
					to { transform: translateX(0) translateY(0); opacity: 1; }
				}

				/* Confetti */
				@keyframes confettiFall {
					0% { transform: translateY(0) rotate(0deg); opacity: 1; }
					100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
				}

				/* Progress indicator pulse */
				@keyframes progressPulse {
					0%, 100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4); }
					50% { box-shadow: 0 0 0 6px rgba(236, 72, 153, 0); }
				}

				/* Floating particles */
				@keyframes floatUp {
					0% { transform: translateY(0) translateX(0); opacity: 0; }
					10% { opacity: 0.6; }
					90% { opacity: 0.6; }
					100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
				}

				/* Pulsing rings */
				@keyframes pulseRing {
					0% { transform: scale(1); opacity: 0.5; }
					100% { transform: scale(2.5); opacity: 0; }
				}

				/* Letter glow for MEMORA text */
				@keyframes letterGlow {
					0%, 100% { opacity: 0.4; text-shadow: 0 0 4px transparent; }
					50% { opacity: 1; text-shadow: 0 0 8px rgba(236, 72, 153, 0.5); }
				}

				/* Flip-in for skill cards */
				@keyframes flipIn {
					from { transform: perspective(800px) rotateY(90deg); opacity: 0; }
					to { transform: perspective(800px) rotateY(0deg); opacity: 1; }
				}

				/* Shield pulse */
				@keyframes shieldPulse {
					0%, 100% { transform: scale(1); opacity: 0.3; }
					50% { transform: scale(1.1); opacity: 0.1; }
				}

				/* Trust indicator fade in */
				@keyframes trustFadeIn {
					from { transform: scale(0.5); opacity: 0; }
					to { transform: scale(1); opacity: 1; }
				}

				/* Progress bar grow */
				@keyframes progressGrow {
					from { width: 0; }
					to { width: 33.3%; }
				}

				/* Check pop */
				@keyframes checkPop {
					0% { transform: scale(0); opacity: 0; }
					70% { transform: scale(1.2); }
					100% { transform: scale(1); opacity: 1; }
				}

				/* Letter reveal */
				@keyframes letterReveal {
					from { transform: translateY(20px) rotateX(90deg); opacity: 0; }
					to { transform: translateY(0) rotateX(0deg); opacity: 1; }
				}

				/* Celebrate bounce */
				@keyframes celebrateBounce {
					0% { transform: scale(0); }
					50% { transform: scale(1.3); }
					70% { transform: scale(0.9); }
					100% { transform: scale(1); }
				}

				/* Slow drift for glow blobs */
				@keyframes driftSlow {
					0%, 100% { transform: translate(0, 0); }
					50% { transform: translate(20px, -20px); }
				}

				/* Holographic card effect */
				.holoCard {
					background: linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(31, 41, 55, 0.8) 50%, rgba(31, 41, 55, 0.6) 100%);
					position: relative;
					overflow: hidden;
				}
				.holoCard::before {
					content: '';
					position: absolute;
					top: -50%;
					left: -50%;
					width: 200%;
					height: 200%;
					background: linear-gradient(
						45deg,
						transparent 30%,
						rgba(139, 92, 246, 0.05) 40%,
						rgba(236, 72, 153, 0.08) 50%,
						rgba(59, 130, 246, 0.05) 60%,
						transparent 70%
					);
					animation: holoSheen 4s ease-in-out infinite;
				}
				@keyframes holoSheen {
					0% { transform: translateX(-30%) translateY(-30%) rotate(0deg); }
					100% { transform: translateX(30%) translateY(30%) rotate(0deg); }
				}
			` }} />

			<div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
				{/* Progress bar — visible on steps 1-7 */}
				{currentStep > 0 && currentStep < 8 && (
					<div className="absolute top-0 right-0 left-0 z-50 flex animate-[onboardFadeUp_300ms_ease-out_both] items-center gap-4 bg-gray-900/80 px-6 py-4 backdrop-blur-md">
						<button
							onClick={prevStep}
							disabled={isAnimating}
							className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-400 transition-all hover:border-gray-600 hover:text-white disabled:opacity-40"
						>
							<Icon name="chevronLeft" size="sm" />
						</button>

						<div className="flex flex-1 items-center justify-center gap-1.5">
							{Array.from({ length: TOTAL_STEPS }).map((_, i) => (
								<div
									key={i}
									className={cn(
										"h-1.5 rounded-full transition-all duration-500",
										i === currentStep ? "bg-primary-500 w-6" : i < currentStep ? "bg-primary-500/50 w-1.5" : "w-1.5 bg-gray-700",
									)}
									style={i === currentStep ? { animation: "progressPulse 2s ease-in-out infinite" } : {}}
								/>
							))}
						</div>

						<span className="shrink-0 text-xs font-medium text-gray-500">{STEP_LABELS[currentStep]}</span>
					</div>
				)}

				{/* Step overview drawer */}
				{currentStep > 0 && (
					<StepOverviewDrawer
						currentStep={currentStep}
						isOpen={drawerOpen}
						onToggle={() => setDrawerOpen((o) => !o)}
					/>
				)}

				{/* Step content */}
				<div key={stepKey} className={cn("flex-1 overflow-y-auto", currentStep > 0 ? slideClass : "")}>
					{steps[currentStep]()}
				</div>

				{/* Bottom navigation — visible on steps 1-7 */}
				{currentStep > 0 && currentStep < 8 && (
					<div className="border-t border-gray-800 bg-gray-900/80 px-6 py-4 backdrop-blur-md">
						<div className="mx-auto flex max-w-2xl items-center justify-between">
							<button
								onClick={prevStep}
								disabled={isAnimating}
								className="flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-white disabled:opacity-40"
							>
								<Icon name="chevronLeft" size="xs" />
								Retour
							</button>
							<Button variant="primary" size="md" onClick={nextStep} disabled={isAnimating} className="group gap-2">
								{currentStep === 6 ? "Valider" : currentStep === 7 ? "Terminer" : "Continuer"}
								<Icon name="chevronRight" size="sm" className="transition-transform group-hover:translate-x-1" />
							</Button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
