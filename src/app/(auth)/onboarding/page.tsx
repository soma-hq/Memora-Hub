"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Icon, Input, Checkbox, Toggle } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/core/structures";
import { submitOnboardingAction } from "@/features/system/auth/actions";

const PAGE_CONFIG = definePageConfig({
	name: "onboarding",
	section: "auth",
	description: "Processus d'accueil des nouveaux utilisateurs.",
});

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
	pseudo: string;
	prenom: string;
	nom: string;
	email: string;
	password: string;
	confirmPassword: string;
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
	password?: string;
	confirmPassword?: string;
	discordId?: string;
	global?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 9;

const LANGUES_OPTIONS = ["Français", "Anglais", "Espagnol", "Arabe", "Portugais", "Autre"] as const;

const DIVISION_LEVELS = [
	{ src: "/icons/marsha/marshaSquad0.png", label: "Division 0 — Academy", delay: "0ms" },
	{ src: "/icons/marsha/marshaSquad1.png", label: "Division 1 — Agent", delay: "150ms" },
	{ src: "/icons/marsha/marshaSquad2.png", label: "Division 2 — Veteran", delay: "300ms" },
	{ src: "/icons/marsha/marshaSquad3.png", label: "Division 3 — Elite", delay: "450ms" },
];

const HUB_FEATURES = [
	{ icon: "shield" as const, label: "Modération", desc: "Sanctions, consignes, tickets" },
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
	{ icon: "shield" as const, label: "Nos méthodes d'intervention" },
	{ icon: "users" as const, label: "Notre façon de travailler" },
];

const PIM_PHASE2_ITEMS = [
	{ icon: "profile" as const, label: "La posture", desc: "Savoir se positionner face aux situations" },
	{ icon: "chat" as const, label: "La communication", desc: "Être clair, précis et bienveillant" },
	{ icon: "sparkles" as const, label: "La prise de décision", desc: "Réagir avec discernement" },
	{ icon: "shield" as const, label: "La rigueur", desc: "Être fiable et constant" },
];

const HIERARCHY_LEVELS = [
	{ label: "Owner", color: "from-amber-400 to-yellow-600" },
	{ label: "Manager", color: "from-purple-400 to-purple-600" },
	{ label: "Senior", color: "from-blue-400 to-blue-600" },
	{ label: "Agent", color: "from-teal-400 to-teal-600" },
	{ label: "Junior", color: "from-rose-400 to-rose-600", highlight: true },
];

const TEAM_STATS = [
	{ value: "50+", label: "Membres actifs", icon: "users" as const },
	{ value: "4", label: "Plateformes", icon: "globe" as const },
	{ value: "24/7", label: "Couverture", icon: "clock" as const },
];

const TRUST_BADGES = [
	{ icon: "lock" as const, label: "Chiffré" },
	{ icon: "shield" as const, label: "Protégé" },
	{ icon: "check" as const, label: "Conforme" },
];

const PHASE_MILESTONES = ["Onboarding", "Phase 1", "Phase 2", "Agent"];

// ─── 4-phase breadcrumb config ────────────────────────────────────────────────
const PHASES = [
	{ label: "Accueil", steps: [0], icon: "sparkles" as const },
	{ label: "Découverte", steps: [1, 2, 3, 4, 5], icon: "shield" as const },
	{ label: "Ton profil", steps: [6], icon: "profile" as const },
	{ label: "Confirmation", steps: [7, 8], icon: "check" as const },
];

void PAGE_CONFIG;

/**
 * Build deterministic random.
 * @param seed - Numeric seed value
 * @returns Stable random value in [0, 1)
 */
function seededRandom(seed: number): number {
	const value = Math.sin(seed * 12.9898) * 43758.5453;
	return value - Math.floor(value);
}

function getPhaseIndex(step: number): number {
	return PHASES.findIndex((p) => p.steps.includes(step));
}

// ─── Particles ────────────────────────────────────────────────────────────────

function ConfettiParticle({ index }: { index: number }) {
	const style = useMemo(() => {
		const colors = [
			"#ec4899",
			"#f472b6",
			"#db2777",
			"#f59e0b",
			"#22c55e",
			"#3b82f6",
			"#8b5cf6",
			"#ef4444",
			"#14b8a6",
			"#f97316",
		];
		const shapes = ["50%", "2px", "0"];
		const color = colors[index % colors.length];
		const left = seededRandom(index + 1) * 100;
		const animDuration = 2.5 + seededRandom(index + 2) * 2;
		const animDelay = seededRandom(index + 3) * 1.5;
		const size = 6 + seededRandom(index + 4) * 8;
		const rotation = seededRandom(index + 5) * 360;
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

function FloatingParticle({ index, color = "rgba(236, 72, 153, 0.4)" }: { index: number; color?: string }) {
	const style = useMemo(() => {
		const left = 10 + seededRandom(index + 10) * 80;
		const duration = 4 + seededRandom(index + 11) * 6;
		const delay = seededRandom(index + 12) * 5;
		const size = 2 + seededRandom(index + 13) * 4;
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

// ─── Stepper ──────────────────────────────────────────────────────────────────

function OnboardingStepper({ currentStep }: { currentStep: number }) {
	const activePhase = getPhaseIndex(currentStep);

	return (
		<div className="flex items-center justify-center gap-1 sm:gap-2">
			{PHASES.map((phase, i) => {
				const isDone = i < activePhase;
				const isCurrent = i === activePhase;
				return (
					<div key={phase.label} className="flex items-center gap-1 sm:gap-2">
						{/* Node */}
						<div
							className={cn(
								"flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-500",
								isCurrent
									? "bg-primary-500 shadow-primary-500/30 text-white shadow-lg"
									: isDone
										? "bg-primary-500/20 text-primary-400"
										: "bg-gray-800 text-gray-600",
							)}
						>
							{isDone ? (
								<Icon name="check" size="xs" />
							) : (
								<span
									className={cn(
										"flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold",
										isCurrent ? "bg-white/20" : "bg-gray-700",
									)}
								>
									{i + 1}
								</span>
							)}
							<span className="hidden sm:inline">{phase.label}</span>
						</div>

						{/* Connector */}
						{i < PHASES.length - 1 && (
							<div
								className={cn(
									"h-px w-4 rounded-full transition-all duration-500 sm:w-6",
									i < activePhase ? "bg-primary-500/50" : "bg-gray-700",
								)}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

// ─── Password visibility toggle input ────────────────────────────────────────

function PasswordInput({
	label,
	placeholder,
	value,
	onChange,
	error,
}: {
	label: string;
	placeholder?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
}) {
	const [visible, setVisible] = useState(false);
	return (
		<div>
			<label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>
			<div className="relative">
				<div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
					<Icon name="lock" size="sm" className="text-gray-500" />
				</div>
				<input
					type={visible ? "text" : "password"}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className={cn(
						"focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border bg-gray-800/60 py-2.5 pr-10 pl-10 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:outline-none",
						error ? "border-red-500/60" : "border-gray-700/60",
					)}
				/>
				<button
					type="button"
					onClick={() => setVisible((v) => !v)}
					className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
				>
					<Icon name={visible ? "eyeSlash" : "eye"} size="sm" />
				</button>
			</div>
			{error && <p className="mt-1 text-xs text-red-400">{error}</p>}
		</div>
	);
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingPage() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);
	const [direction, setDirection] = useState<"forward" | "backward">("forward");
	const [isAnimating, setIsAnimating] = useState(false);
	const [stepKey, setStepKey] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Form state
	const [formData, setFormData] = useState<FormData>({
		pseudo: "",
		prenom: "",
		nom: "",
		email: "",
		password: "",
		confirmPassword: "",
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

	// Welcome animation state
	const [logoVisible, setLogoVisible] = useState(false);
	const [titleVisible, setTitleVisible] = useState(false);
	const [subtitleVisible, setSubtitleVisible] = useState(false);
	const [bodyVisible, setBodyVisible] = useState(false);
	const [buttonVisible, setButtonVisible] = useState(false);
	const [statsVisible, setStatsVisible] = useState(false);

	useEffect(() => {
		if (currentStep === 0) {
			const t1 = setTimeout(() => setLogoVisible(true), 200);
			const t2 = setTimeout(() => setTitleVisible(true), 700);
			const t3 = setTimeout(() => setSubtitleVisible(true), 1100);
			const t4 = setTimeout(() => setBodyVisible(true), 1500);
			const t5 = setTimeout(() => setButtonVisible(true), 2000);
			return () => {
				clearTimeout(t1);
				clearTimeout(t2);
				clearTimeout(t3);
				clearTimeout(t4);
				clearTimeout(t5);
			};
		}
	}, [currentStep]);

	useEffect(() => {
		if (currentStep === 1) {
			const t = setTimeout(() => setStatsVisible(true), 1200);
			return () => clearTimeout(t);
		}
		const t = setTimeout(() => setStatsVisible(false), 0);
		return () => clearTimeout(t);
	}, [currentStep]);

	// Form progress
	const formProgress = useMemo(() => {
		const required: (keyof FormData)[] = ["pseudo", "prenom", "nom", "email", "password", "discordId"];
		const filled = required.filter((f) => {
			const val = formData[f];
			return typeof val === "string" && val.trim().length > 0;
		}).length;
		return Math.round((filled / required.length) * 100);
	}, [formData]);

	// Navigation
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

	const nextStep = useCallback(async () => {
		// Form validation on step 6
		if (currentStep === 6) {
			const errors: FormErrors = {};
			if (!formData.pseudo.trim()) errors.pseudo = "Le pseudo est requis";
			if (!formData.prenom.trim()) errors.prenom = "Le prénom est requis";
			if (!formData.nom.trim()) errors.nom = "Le nom est requis";
			if (!formData.email.trim()) errors.email = "L'email est requis";
			else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Email invalide";
			if (!formData.password.trim()) errors.password = "Le mot de passe est requis";
			else if (formData.password.length < 8) errors.password = "Minimum 8 caractères";
			if (!formData.confirmPassword.trim()) errors.confirmPassword = "Confirmez le mot de passe";
			else if (formData.password !== formData.confirmPassword)
				errors.confirmPassword = "Les mots de passe ne correspondent pas";

			if (Object.keys(errors).length > 0) {
				setFormErrors(errors);
				return;
			}
			setFormErrors({});

			// Submit to DB
			setIsSubmitting(true);
			setSubmitError(null);
			try {
				const result = await submitOnboardingAction({
					pseudo: formData.pseudo,
					prenom: formData.prenom,
					nom: formData.nom,
					email: formData.email,
					password: formData.password,
					telephone: formData.telephone || undefined,
					dateNaissance: formData.dateNaissance || undefined,
					langues: formData.langues,
					anniversaire: formData.anniversaire,
					discordId: formData.discordId || undefined,
					discordUsername: formData.pseudo || undefined,
					twitter: formData.twitter || undefined,
					instagram: formData.instagram || undefined,
					twitch: formData.twitch || undefined,
					youtube: formData.youtube || undefined,
				});

				if (!result.success) {
					setSubmitError(result.error || "Une erreur est survenue");
					setIsSubmitting(false);
					return;
				}
			} catch {
				setSubmitError("Erreur réseau, veuillez réessayer");
				setIsSubmitting(false);
				return;
			}
			setIsSubmitting(false);
		}

		goToStep(currentStep + 1);
	}, [currentStep, formData, goToStep]);

	const prevStep = useCallback(() => {
		goToStep(currentStep - 1);
	}, [goToStep, currentStep]);

	const handleComplete = useCallback(() => {
		localStorage.setItem("memora-onboarding-completed", "true");
		localStorage.removeItem("memora-tutorial-completed");
		router.push("/hub");
	}, [router]);

	// Form helpers
	const updateField = useCallback((field: keyof FormData, value: string | boolean | string[]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setFormErrors((prev) => ({ ...prev, [field]: undefined, global: undefined }));
		setSubmitError(null);
	}, []);

	const toggleLangue = useCallback((langue: string) => {
		setFormData((prev) => ({
			...prev,
			langues: prev.langues.includes(langue)
				? prev.langues.filter((l) => l !== langue)
				: [...prev.langues, langue],
		}));
	}, []);

	const slideClass =
		direction === "forward"
			? "animate-[onboardSlideInRight_500ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
			: "animate-[onboardSlideInLeft_500ms_cubic-bezier(0.16,1,0.3,1)_forwards]";

	// ─── Step renderers ────────────────────────────────────────────────────────

	const renderIntroduction = () => (
		<div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-6 py-20">
			{/* Floating particles */}
			<div className="absolute inset-0 overflow-hidden">
				{Array.from({ length: 20 }).map((_, i) => (
					<FloatingParticle
						key={`p-${i}`}
						index={i}
						color={i % 2 === 0 ? "rgba(236,72,153,0.3)" : "rgba(139,92,246,0.3)"}
					/>
				))}
			</div>

			{/* Pulsing rings */}
			<div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<div className="border-primary-500/10 absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-[pulseRing_3s_ease-out_infinite] rounded-full border" />
				<div className="border-primary-500/10 absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-[pulseRing_3s_ease-out_1s_infinite] rounded-full border" />
				<div className="border-primary-500/10 absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-[pulseRing_3s_ease-out_2s_infinite] rounded-full border" />
			</div>

			<div className="relative z-10 flex max-w-xl flex-col items-center gap-6 text-center">
				{/* Logo */}
				<div
					className={cn(
						"transition-all duration-1000 ease-out",
						logoVisible ? "scale-100 opacity-100" : "scale-50 opacity-0",
					)}
				>
					<div className="relative animate-[onboardPulse_3s_ease-in-out_infinite]">
						<div className="from-primary-500/30 absolute inset-0 rounded-full bg-gradient-to-br to-transparent blur-3xl" />
						<Image
							src="/logos/memora-logo.png"
							alt="Memora"
							width={120}
							height={120}
							className="relative drop-shadow-2xl"
							priority
						/>
					</div>
				</div>

				{/* MEMORA letters */}
				<div
					className={cn(
						"flex items-center gap-1 transition-all duration-700 ease-out",
						logoVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
					)}
				>
					{"MEMORA".split("").map((char, i) => (
						<span
							key={i}
							className="text-primary-400/60 animate-[letterGlow_2s_ease-in-out_infinite] text-xs font-bold tracking-[0.3em]"
							style={{ animationDelay: `${i * 200}ms` }}
						>
							{char}
						</span>
					))}
				</div>

				<h1
					className={cn(
						"font-serif text-4xl font-bold text-white transition-all duration-700 ease-out sm:text-5xl",
						titleVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
					)}
				>
					Bienvenue dans ton espace <span className="text-primary-400">Marsha</span>
				</h1>

				<p
					className={cn(
						"text-lg leading-relaxed text-gray-300 transition-all duration-700 ease-out",
						subtitleVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
					)}
				>
					Si tu es ici, c&apos;est que tu as déjà franchi une première étape importante. Tes échanges avec
					nous ont montré ton potentiel — nous sommes ravis de t&apos;accueillir parmi nous !
				</p>

				<div
					className={cn(
						"max-w-md transition-all duration-700 ease-out",
						bodyVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
					)}
				>
					<p className="text-base text-gray-400">
						À partir d&apos;ici, ton intégration commence pour de vrai. Pas de panique, tu ne seras jamais
						seul·e.
					</p>
				</div>

				<div
					className={cn(
						"transition-all duration-700 ease-out",
						buttonVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
					)}
				>
					<Button variant="primary" size="lg" onClick={nextStep} className="group mt-4 gap-2 px-8">
						Commencer mon intégration
						<Icon
							name="chevronRight"
							size="sm"
							className="transition-transform group-hover:translate-x-1"
						/>
					</Button>
				</div>

				<p
					className={cn(
						"text-xs text-gray-600 transition-all duration-700 ease-out",
						buttonVisible ? "opacity-100" : "opacity-0",
					)}
				>
					4 étapes · ~5 minutes
				</p>
			</div>
		</div>
	);

	const renderMarshaConcrètement = () => (
		<div className="flex min-h-full flex-col items-center justify-center px-6 py-24">
			<div className="flex max-w-3xl flex-col items-center gap-10">
				<div className="flex animate-[onboardFadeUp_600ms_ease-out_200ms_both] flex-col items-center gap-4 text-center">
					<div className="from-primary-500 to-primary-700 relative rounded-2xl bg-gradient-to-br p-3">
						<Icon name="shield" size="lg" className="text-white" />
						<div className="from-primary-500/30 to-primary-700/30 absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br blur-lg" />
					</div>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Marsha, concrètement</h2>
					<p className="max-w-lg text-lg leading-relaxed text-gray-300">
						Marsha intervient sur plusieurs plateformes — là où se trouvent des communautés actives qui ont
						besoin d&apos;un cadre sain.
					</p>
				</div>

				<div className="grid w-full max-w-lg animate-[onboardFadeUp_600ms_ease-out_400ms_both] grid-cols-2 gap-3">
					{PLATFORMS.map((platform, i) => (
						<div
							key={platform.name}
							className="group flex animate-[onboardScaleIn_400ms_ease-out_both] items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-800/60 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-gray-600/60 hover:bg-gray-800/80"
							style={{ animationDelay: `${500 + i * 100}ms` }}
						>
							<div
								className={cn(
									"flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
									platform.color,
								)}
							>
								<Icon name={platform.icon} size="sm" className="text-white" />
							</div>
							<span className="text-sm font-semibold text-white">{platform.name}</span>
						</div>
					))}
				</div>

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
							<Icon name={stat.icon} size="sm" className="text-primary-400 mb-1" />
							<span className="text-xl font-bold text-white">{stat.value}</span>
							<span className="text-[10px] text-gray-500">{stat.label}</span>
						</div>
					))}
				</div>

				<div className="flex max-w-lg animate-[onboardFadeUp_600ms_ease-out_700ms_both] flex-col gap-4">
					<p className="text-center text-base text-gray-400">Derrière ce travail, il y a :</p>
					{[
						"Des équipes organisées et chill",
						"Des responsables pour t'accompagner",
						"Des méthodes internes pour faciliter ton quotidien",
					].map((item, i) => (
						<div
							key={i}
							className="flex items-center gap-3 rounded-lg border border-gray-700/30 bg-gray-800/40 px-4 py-3"
						>
							<div className="bg-primary-500/20 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
								<Icon name="check" size="xs" className="text-primary-400" />
							</div>
							<span className="text-sm text-gray-300">{item}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	const renderPosition = () => (
		<div className="flex min-h-full flex-col items-center justify-center px-6 py-24 lg:flex-row lg:gap-16 lg:px-20">
			<div className="flex max-w-lg flex-1 animate-[onboardFadeUp_600ms_ease-out_200ms_both] flex-col gap-6">
				<div className="flex items-center gap-3">
					<div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-2.5">
						<Icon name="training" size="lg" className="text-white" />
					</div>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Ta position actuelle</h2>
				</div>
				<p className="text-lg leading-relaxed text-gray-300">
					Dès maintenant, tu entres dans la <span className="font-bold text-amber-400">Marsha Academy</span>,
					notre programme d&apos;intégration.
				</p>
				<p className="text-lg leading-relaxed text-gray-400">
					Pendant cette période, tu es considéré·e comme{" "}
					<span className="font-semibold text-white">Junior.</span>
				</p>
				<div className="rounded-xl border border-gray-700/50 bg-gray-800/60 p-5 backdrop-blur-sm">
					<p className="text-sm leading-relaxed text-gray-300">
						Concrètement, ça veut dire que tu es en phase d&apos;apprentissage, tu es encadré·e et tu peux
						poser toutes tes questions. Tu n&apos;es{" "}
						<span className="font-bold text-amber-400">pas encore</span> modérateur officiel.
					</p>
				</div>
				<p className="text-base text-gray-400">
					L&apos;objectif est simple :{" "}
					<span className="text-white">
						te former, t&apos;évaluer et t&apos;aider à atteindre le niveau attendu
					</span>
					, à ton rythme.
				</p>
				<div className="mt-4 flex animate-[onboardFadeUp_600ms_ease-out_800ms_both] flex-col items-center gap-1.5">
					<p className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Hiérarchie</p>
					{HIERARCHY_LEVELS.map((level, i) => (
						<div
							key={level.label}
							className={cn(
								"relative z-10 flex animate-[onboardScaleIn_400ms_ease-out_both] items-center justify-center rounded-lg py-1.5 text-xs font-bold text-white/90",
								`bg-gradient-to-r ${level.color}`,
								level.highlight ? "ring-2 ring-white/30 ring-offset-2 ring-offset-transparent" : "",
							)}
							style={{ width: `${100 + i * 30}px`, animationDelay: `${900 + i * 100}ms` }}
						>
							{level.label}
							{level.highlight && (
								<span className="ml-1.5 rounded bg-white/20 px-1.5 py-0.5 text-[10px]">Toi</span>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="mt-10 flex flex-1 flex-col items-center gap-4 lg:mt-0">
				<div className="mb-4 animate-[onboardScaleIn_600ms_ease-out_400ms_both]">
					<div className="relative">
						<div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/20 to-transparent blur-2xl" />
						<Image
							src="/icons/marsha/marshaSquad.png"
							alt="Marsha Squad"
							width={100}
							height={100}
							className="relative drop-shadow-xl"
						/>
					</div>
				</div>
				<div className="relative flex flex-col items-center gap-3">
					<div className="from-primary-500/40 via-primary-500/20 absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 animate-[onboardLineGrow_800ms_ease-out_600ms_both] bg-gradient-to-b to-transparent" />
					{DIVISION_LEVELS.map((div, i) => (
						<div
							key={div.label}
							className={cn(
								"relative z-10 flex animate-[onboardFadeUp_500ms_ease-out_both] items-center gap-4 rounded-2xl border px-5 py-3 shadow-xl backdrop-blur-sm",
								i === 0 ? "border-amber-500/40 bg-amber-900/20" : "border-gray-700/50 bg-gray-800/80",
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

	const renderPIMPhase1 = () => (
		<div className="flex min-h-full flex-col items-center justify-center px-6 py-24">
			<div className="flex max-w-2xl flex-col items-center gap-8">
				<div className="flex animate-[onboardFadeUp_600ms_ease-out_200ms_both] flex-col items-center gap-4 text-center">
					<span className="bg-primary-500/20 text-primary-400 rounded-full px-3 py-1 text-xs font-bold">
						PHASE 1
					</span>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
						La PIM : l&apos;apprentissage
					</h2>
					<p className="max-w-md text-base text-gray-400">
						Ta période d&apos;intégration de modération commence ici. Dans cette première phase, tu vas
						découvrir :
					</p>
				</div>

				<div className="w-full max-w-md animate-[onboardFadeUp_600ms_ease-out_400ms_both]">
					<div className="relative flex items-center justify-between">
						<div className="absolute top-4 right-6 left-6 h-0.5 bg-gray-700">
							<div className="from-primary-500 to-primary-400 h-full w-1/3 animate-[progressGrow_1s_ease-out_800ms_both] bg-gradient-to-r" />
						</div>
						{PHASE_MILESTONES.map((milestone, i) => (
							<div key={milestone} className="relative z-10 flex flex-col items-center gap-2">
								<div
									className={cn(
										"flex h-8 w-8 animate-[onboardScaleIn_400ms_ease-out_both] items-center justify-center rounded-full text-xs font-bold",
										i === 0
											? "bg-primary-500 text-white"
											: i === 1
												? "border-primary-500/50 text-primary-400 border-2 bg-gray-800"
												: "border border-gray-700 bg-gray-800 text-gray-500",
									)}
									style={{ animationDelay: `${600 + i * 150}ms` }}
								>
									{i === 0 ? <Icon name="check" size="xs" /> : i + 1}
								</div>
								<span
									className={cn(
										"text-[10px] font-medium",
										i <= 1 ? "text-primary-400" : "text-gray-600",
									)}
								>
									{milestone}
								</span>
							</div>
						))}
					</div>
				</div>

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
								className="bg-primary-500/10 flex h-6 w-6 animate-[checkPop_400ms_ease-out_both] items-center justify-center rounded-full"
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
						<span className="text-sm font-bold text-indigo-300">Ton Référent</span>
					</div>
					<p className="text-sm leading-relaxed text-gray-400">
						Tu seras accompagné·e par un <span className="text-white">Référent</span>. Son rôle : te guider,
						répondre à tes questions, te donner des retours constructifs et t&apos;aider à progresser tout
						au long de ton apprentissage.
					</p>
				</div>
			</div>
		</div>
	);

	const renderPIMPhase2 = () => (
		<div className="flex min-h-full flex-col items-center justify-center px-6 py-24">
			<div className="flex max-w-2xl flex-col items-center gap-8">
				<div className="flex animate-[onboardFadeUp_600ms_ease-out_200ms_both] flex-col items-center gap-4 text-center">
					<span className="bg-success-500/20 text-success-400 rounded-full px-3 py-1 text-xs font-bold">
						PHASE 2
					</span>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Le perfectionnement</h2>
					<p className="max-w-md text-base text-gray-400">
						Si la première phase est validée, tu passes au perfectionnement ! On va alors travailler sur tes
						axes d&apos;amélioration :
					</p>
				</div>

				<div className="grid w-full max-w-lg animate-[onboardFadeUp_600ms_ease-out_500ms_both] grid-cols-1 gap-3 sm:grid-cols-2">
					{PIM_PHASE2_ITEMS.map((item, i) => (
						<div
							key={item.label}
							className="animate-[flipIn_600ms_ease-out_both]"
							style={{ animationDelay: `${600 + i * 120}ms` }}
						>
							<div className="group hover:border-success-500/30 relative flex flex-col gap-2 rounded-xl border border-gray-700/50 bg-gray-800/60 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/80">
								<div className="absolute top-0 right-0 h-12 w-12 overflow-hidden rounded-tr-xl">
									<div className="from-success-500/10 absolute -top-6 -right-6 h-12 w-12 rotate-45 bg-gradient-to-br to-transparent" />
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
						Il ne s&apos;agit pas d&apos;être parfait. Le but est d&apos;être{" "}
						<span className="font-semibold text-white">fiable et à l&apos;aise</span> dans ton rôle. La
						validation dépendra de ton niveau réel, pas du temps passé.
					</p>
				</div>
			</div>
		</div>
	);

	const renderAvantDeCommencer = () => (
		<div className="flex min-h-full flex-col items-center justify-center px-6 py-24">
			<div className="flex max-w-2xl flex-col items-center gap-8">
				<div className="flex animate-[onboardFadeUp_600ms_ease-out_200ms_both] flex-col items-center gap-4 text-center">
					<div className="relative">
						<div className="rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-3">
							<Icon name="shield" size="lg" className="text-white" />
						</div>
						<div className="absolute -inset-3 animate-[shieldPulse_2s_ease-in-out_infinite] rounded-3xl border border-teal-500/20" />
						<div className="absolute -inset-6 animate-[shieldPulse_2s_ease-in-out_0.5s_infinite] rounded-3xl border border-teal-500/10" />
					</div>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Avant de commencer</h2>
					<p className="max-w-md text-base text-gray-400">
						Avant d&apos;entrer officiellement dans ta PIM, tu vas créer ton profil Memora Hub. C&apos;est
						simple et rapide.
					</p>
				</div>

				<div className="w-full max-w-lg animate-[onboardFadeUp_600ms_ease-out_500ms_both]">
					<p className="mb-4 text-center text-sm font-semibold text-gray-300">Pourquoi ça ?</p>
					<div className="flex flex-col gap-3">
						{[
							{ icon: "profile" as const, text: "Identifier chaque membre correctement" },
							{ icon: "lock" as const, text: "Attribuer les bons accès" },
							{ icon: "stats" as const, text: "Assurer un suivi fiable" },
							{ icon: "shield" as const, text: "Respecter nos obligations légales" },
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

				<div className="flex w-full max-w-lg animate-[onboardFadeUp_600ms_ease-out_800ms_both] items-center justify-center gap-6">
					{TRUST_BADGES.map((trust, i) => (
						<div key={trust.label} className="flex flex-col items-center gap-1.5">
							<div
								className="flex h-10 w-10 animate-[trustFadeIn_500ms_ease-out_both] items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/10"
								style={{ animationDelay: `${900 + i * 150}ms` }}
							>
								<Icon name={trust.icon} size="sm" className="text-teal-400" />
							</div>
							<span className="text-[10px] font-medium text-teal-400/70">{trust.label}</span>
						</div>
					))}
				</div>

				<div className="flex animate-[onboardFadeUp_600ms_ease-out_1100ms_both] items-center gap-2 rounded-full border border-gray-700/30 bg-gray-800/30 px-4 py-2">
					<Icon name="lock" size="xs" className="text-primary-400" />
					<span className="text-xs text-gray-400">
						Tes données restent strictement internes, elles ne seront ni revendues ni partagées.
					</span>
				</div>
			</div>
		</div>
	);

	const renderForm = () => (
		<div className="flex min-h-full flex-col items-center justify-start px-4 py-20 sm:px-6 lg:justify-center">
			<div className="w-full max-w-2xl animate-[onboardFadeUp_500ms_ease-out_both]">
				{/* Header */}
				<div className="mb-8 flex flex-col items-center gap-2 text-center">
					<div className="mb-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5">
						<Icon name="profile" size="lg" className="text-white" />
					</div>
					<h2 className="font-serif text-3xl font-bold text-white">Crée ton profil</h2>
					<p className="text-gray-400">
						Prends le temps de bien renseigner tes informations — elles seront utilisées par toute
						l&apos;équipe.
					</p>
					{/* Progress bar */}
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

				{/* Global error */}
				{submitError && (
					<div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-900/15 px-4 py-3">
						<Icon name="warning" size="sm" className="mt-0.5 shrink-0 text-red-400" />
						<p className="text-sm text-red-300">{submitError}</p>
					</div>
				)}

				<div className="flex flex-col gap-6 rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 shadow-xl backdrop-blur-sm sm:p-8">
					{/* ── Section 1 : Identité ── */}
					<div className="flex flex-col gap-5">
						<h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
							<Icon name="profile" size="xs" />
							Identité
						</h3>
						<div className="grid gap-4 sm:grid-cols-2">
							<Input
								label="Pseudo *"
								placeholder="TonPseudo"
								value={formData.pseudo}
								onChange={(e) => updateField("pseudo", e.target.value)}
								error={formErrors.pseudo}
								icon="chat"
							/>
							<Input
								label="Discord ID *"
								placeholder="123456789012345678"
								value={formData.discordId}
								onChange={(e) => updateField("discordId", e.target.value)}
								error={formErrors.discordId}
								icon="lock"
							/>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<Input
								label="Prénom *"
								placeholder="Ton prénom"
								value={formData.prenom}
								onChange={(e) => updateField("prenom", e.target.value)}
								error={formErrors.prenom}
							/>
							<Input
								label="Nom *"
								placeholder="Ton nom"
								value={formData.nom}
								onChange={(e) => updateField("nom", e.target.value)}
								error={formErrors.nom}
							/>
						</div>
					</div>

					<div className="h-px bg-gray-700/50" />

					{/* ── Section 2 : Connexion ── */}
					<div className="flex flex-col gap-5">
						<div>
							<h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
								<Icon name="lock" size="xs" />
								Connexion au Hub
							</h3>
							<p className="mt-1 text-xs text-gray-500">
								Ces identifiants te permettront de te connecter à Memora Hub.
							</p>
						</div>
						<Input
							label="Email *"
							type="email"
							placeholder="ton@email.com"
							value={formData.email}
							onChange={(e) => updateField("email", e.target.value)}
							error={formErrors.email}
							icon="globe"
						/>
						<div className="grid gap-4 sm:grid-cols-2">
							<PasswordInput
								label="Mot de passe * (8 car. min)"
								placeholder="••••••••"
								value={formData.password}
								onChange={(e) => updateField("password", e.target.value)}
								error={formErrors.password}
							/>
							<PasswordInput
								label="Confirmer le mot de passe *"
								placeholder="••••••••"
								value={formData.confirmPassword}
								onChange={(e) => updateField("confirmPassword", e.target.value)}
								error={formErrors.confirmPassword}
							/>
						</div>
					</div>

					<div className="h-px bg-gray-700/50" />

					{/* ── Section 3 : Contact ── */}
					<div className="flex flex-col gap-4">
						<h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
							<Icon name="phone" size="xs" />
							Contact <span className="text-xs font-normal text-gray-500 normal-case">(optionnel)</span>
						</h3>
						<div className="grid gap-4 sm:grid-cols-2">
							<Input
								label="Téléphone"
								type="tel"
								placeholder="+33 6 12 34 56 78"
								value={formData.telephone}
								onChange={(e) => updateField("telephone", e.target.value)}
							/>
							<Input
								label="Date de naissance"
								type="date"
								value={formData.dateNaissance}
								onChange={(e) => updateField("dateNaissance", e.target.value)}
							/>
						</div>
					</div>

					<div className="h-px bg-gray-700/50" />

					{/* ── Section 4 : Langues ── */}
					<div className="flex flex-col gap-4">
						<h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
							<Icon name="globe" size="xs" />
							Langues parlées
						</h3>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{LANGUES_OPTIONS.map((langue) => (
								<Checkbox
									key={langue}
									label={langue}
									checked={formData.langues.includes(langue)}
									onChange={() => toggleLangue(langue)}
								/>
							))}
						</div>
					</div>

					<div className="h-px bg-gray-700/50" />

					{/* ── Section 5 : Préférences ── */}
					<div className="flex flex-col gap-4">
						<h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
							<Icon name="bell" size="xs" />
							Préférences
						</h3>
						<Toggle
							checked={formData.anniversaire}
							onChange={(checked) => updateField("anniversaire", checked)}
							label="Souhait d'anniversaire"
							description="Recevoir un message de l'équipe le jour de ton anniversaire"
						/>
					</div>

					<div className="h-px bg-gray-700/50" />

					{/* ── Section 6 : Réseaux sociaux ── */}
					<div className="flex flex-col gap-4">
						<h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
							<Icon name="globe" size="xs" />
							Réseaux sociaux{" "}
							<span className="text-xs font-normal text-gray-500 normal-case">(optionnel)</span>
						</h3>
						<div className="grid gap-4 sm:grid-cols-2">
							<Input
								label="Twitter / X"
								placeholder="@tonpseudo"
								value={formData.twitter}
								onChange={(e) => updateField("twitter", e.target.value)}
							/>
							<Input
								label="Instagram"
								placeholder="@tonpseudo"
								value={formData.instagram}
								onChange={(e) => updateField("instagram", e.target.value)}
							/>
							<Input
								label="Twitch"
								placeholder="tonpseudo"
								value={formData.twitch}
								onChange={(e) => updateField("twitch", e.target.value)}
							/>
							<Input
								label="YouTube"
								placeholder="Lien de ta chaîne"
								value={formData.youtube}
								onChange={(e) => updateField("youtube", e.target.value)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderApresFormulaire = () => (
		<div className="flex min-h-full flex-col items-center justify-center overflow-hidden px-6 py-24">
			<div className="relative z-10 flex max-w-2xl flex-col items-center gap-8 text-center">
				<div className="flex animate-[onboardScaleIn_600ms_ease-out_200ms_both] flex-col items-center gap-4">
					<div className="animate-[celebrateBounce_1s_ease-out_both] text-4xl">🎉</div>
					<h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Profil créé !</h2>
					<p className="text-lg leading-relaxed text-gray-300">
						Tu entres officiellement dans ta PIM. Tu as maintenant accès à{" "}
						<span className="text-primary-400 font-bold">Memora Hub</span>, qui regroupe tout ce dont tu
						auras besoin :
					</p>
				</div>

				<div className="flex w-full max-w-md flex-col gap-3">
					{HUB_FEATURES.map((feature, i) => (
						<div
							key={feature.label}
							className="group flex animate-[onboardSlideCardIn_500ms_cubic-bezier(0.16,1,0.3,1)_both] items-center gap-4 rounded-2xl border border-gray-700/50 bg-gray-800/60 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-600/50 hover:bg-gray-800/80"
							style={{ animationDelay: `${400 + i * 150}ms` }}
						>
							<div
								className={cn(
									"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
									i === 0 && "bg-primary-500/15 text-primary-400",
									i === 1 && "bg-info-500/15 text-info-400",
									i === 2 && "bg-success-500/15 text-success-400",
									i === 3 && "bg-warning-500/15 text-warning-400",
								)}
							>
								<Icon name={feature.icon} size="md" />
							</div>
							<div className="flex flex-col text-left">
								<span className="text-sm font-semibold text-white">{feature.label}</span>
								<span className="text-xs text-gray-400">{feature.desc}</span>
							</div>
							<Icon
								name="chevronRight"
								size="xs"
								className="ml-auto text-gray-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-400"
							/>
						</div>
					))}
				</div>

				<div className="max-w-md animate-[onboardFadeUp_600ms_ease-out_1000ms_both] rounded-xl border border-gray-700/30 bg-gray-800/40 p-5">
					<p className="text-sm text-gray-400">
						Mais pour l&apos;instant, ton objectif est simple :{" "}
						<span className="font-semibold text-white">
							apprendre, progresser et trouver ta place dans l&apos;équipe.
						</span>
					</p>
					<p className="mt-3 text-sm text-gray-500">On est heureux de t&apos;avoir avec nous 🙌</p>
				</div>
			</div>
		</div>
	);

	const renderCelebration = () => (
		<div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-6 py-24">
			{/* Confetti */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				{Array.from({ length: 80 }).map((_, i) => (
					<ConfettiParticle key={i} index={i} />
				))}
			</div>

			{/* Floating sparkles */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				{Array.from({ length: 12 }).map((_, i) => (
					<FloatingParticle
						key={`sp-${i}`}
						index={i}
						color={
							i % 3 === 0
								? "rgba(236,72,153,0.4)"
								: i % 3 === 1
									? "rgba(139,92,246,0.4)"
									: "rgba(59,130,246,0.4)"
						}
					/>
				))}
			</div>

			<div className="relative z-10 flex flex-col items-center gap-6 text-center">
				{/* Logo avec rings */}
				<div className="animate-[onboardScaleIn_600ms_ease-out_300ms_both]">
					<div className="relative">
						<div className="from-primary-500/30 absolute inset-0 rounded-full bg-gradient-to-br to-transparent blur-2xl" />
						<Image
							src="/icons/marsha/marshaSquad0.png"
							alt="Marsha Academy"
							width={100}
							height={100}
							className="relative drop-shadow-xl"
						/>
						<div className="border-primary-500/20 absolute -inset-4 animate-[pulseRing_2s_ease-out_infinite] rounded-full border" />
						<div className="border-primary-500/10 absolute -inset-8 animate-[pulseRing_2s_ease-out_0.6s_infinite] rounded-full border" />
					</div>
				</div>

				{/* Titre lettre par lettre */}
				<div className="animate-[onboardFadeUp_600ms_ease-out_500ms_both]">
					<h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">
						{"Bienvenue, ".split("").map((char, i) => (
							<span
								key={i}
								className="inline-block animate-[letterReveal_400ms_ease-out_both]"
								style={{ animationDelay: `${600 + i * 40}ms` }}
							>
								{char === " " ? "\u00a0" : char}
							</span>
						))}
						<span className="text-primary-400 animate-[onboardFadeUp_500ms_ease-out_1100ms_both]">
							{formData.pseudo || "Recrue"}
						</span>
						<span className="animate-[onboardFadeUp_500ms_ease-out_1200ms_both]"> !</span>
					</h1>
				</div>

				<div className="flex animate-[onboardFadeUp_600ms_ease-out_700ms_both] flex-col gap-3">
					<p className="text-lg text-gray-300">Tu es désormais membre de la Marsha Squad.</p>
					<div className="mx-auto mt-2 inline-flex items-center gap-2 rounded-full border border-gray-700/50 bg-gray-800/60 px-5 py-2 backdrop-blur-sm">
						<Image src="/icons/marsha/marshaSquad0.png" alt="" width={24} height={24} />
						<span className="text-sm font-semibold text-white">
							Ta division : Marsha Academy (Division 0)
						</span>
					</div>
					<p className="mt-4 text-lg font-medium text-gray-400">Ton aventure commence maintenant.</p>
				</div>

				{/* Carte squad */}
				<div className="holoCard mt-2 w-full max-w-sm animate-[onboardFadeUp_600ms_ease-out_900ms_both] rounded-2xl border border-gray-700/50 p-5 backdrop-blur-sm">
					<div className="mb-3 flex items-center gap-2">
						<Icon name="users" size="sm" className="text-primary-400" />
						<span className="text-primary-400 text-xs font-bold tracking-wider uppercase">Carte Squad</span>
					</div>
					<div className="flex items-center gap-3">
						<div className="from-primary-500 to-primary-700 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white">
							{formData.pseudo ? formData.pseudo[0].toUpperCase() : "R"}
						</div>
						<div className="text-left">
							<p className="text-sm font-semibold text-white">{formData.pseudo || "Recrue"}</p>
							<p className="text-xs text-gray-400">
								{formData.prenom || "Nouveau"} {formData.nom || "Membre"}
							</p>
							<p className="text-[10px] text-gray-500">Junior — Marsha Academy · Squad Bazalthe</p>
						</div>
					</div>
				</div>

				<div className="mt-4 animate-[onboardFadeUp_600ms_ease-out_1100ms_both]">
					<Button
						variant="primary"
						size="lg"
						onClick={handleComplete}
						className="group shadow-primary-500/20 gap-2 px-10 shadow-lg"
					>
						Accéder au Hub
						<Icon
							name="chevronRight"
							size="sm"
							className="transition-transform group-hover:translate-x-1"
						/>
					</Button>
				</div>

				<div className="mt-3 flex animate-[onboardFadeUp_600ms_ease-out_1300ms_both] items-center gap-2 text-gray-500">
					<Icon name="sparkles" size="xs" />
					<span className="text-xs">Bonne chance !</span>
					<Icon name="sparkles" size="xs" />
				</div>
			</div>
		</div>
	);

	const steps = [
		renderIntroduction,
		renderMarshaConcrètement,
		renderPosition,
		renderPIMPhase1,
		renderPIMPhase2,
		renderAvantDeCommencer,
		renderForm,
		renderApresFormulaire,
		renderCelebration,
	];

	const isFormStep = currentStep === 6;
	const showNav = currentStep > 0 && currentStep < 8;

	return (
		<>
			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes onboardSlideInRight { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
				@keyframes onboardSlideInLeft { from { transform: translateX(-60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
				@keyframes onboardFadeUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
				@keyframes onboardScaleIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
				@keyframes onboardPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
				@keyframes onboardLineGrow { from { transform: translateX(-50%) scaleY(0); transform-origin: top; } to { transform: translateX(-50%) scaleY(1); transform-origin: top; } }
				@keyframes onboardSlideCardIn { from { transform: translateX(40px) translateY(10px); opacity: 0; } to { transform: translateX(0) translateY(0); opacity: 1; } }
				@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
				@keyframes floatUp { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translateY(-100vh) translateX(30px); opacity: 0; } }
				@keyframes pulseRing { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2.5); opacity: 0; } }
				@keyframes letterGlow { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; text-shadow: 0 0 8px rgba(236,72,153,0.5); } }
				@keyframes flipIn { from { transform: perspective(800px) rotateY(90deg); opacity: 0; } to { transform: perspective(800px) rotateY(0deg); opacity: 1; } }
				@keyframes shieldPulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.1; } }
				@keyframes trustFadeIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
				@keyframes progressGrow { from { width: 0; } to { width: 33.3%; } }
				@keyframes checkPop { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
				@keyframes letterReveal { from { transform: translateY(20px) rotateX(90deg); opacity: 0; } to { transform: translateY(0) rotateX(0deg); opacity: 1; } }
				@keyframes celebrateBounce { 0% { transform: scale(0); } 50% { transform: scale(1.3); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }
				@keyframes driftSlow { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(20px, -20px); } }
				.holoCard { background: linear-gradient(135deg, rgba(31,41,55,.6) 0%, rgba(31,41,55,.8) 50%, rgba(31,41,55,.6) 100%); position: relative; overflow: hidden; }
				.holoCard::before { content:''; position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:linear-gradient(45deg,transparent 30%,rgba(139,92,246,.05) 40%,rgba(236,72,153,.08) 50%,rgba(59,130,246,.05) 60%,transparent 70%); animation:holoSheen 4s ease-in-out infinite; }
				@keyframes holoSheen { 0% { transform: translateX(-30%) translateY(-30%); } 100% { transform: translateX(30%) translateY(30%); } }
			`,
				}}
			/>

			<div
				className="fixed inset-0 z-50 flex flex-col"
				style={{
					background:
						"radial-gradient(ellipse 80% 60% at 0% 0%, rgba(236,72,153,0.12), transparent), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(99,102,241,0.10), transparent), radial-gradient(ellipse 50% 50% at 50% 50%, rgba(139,92,246,0.06), transparent), #030712",
				}}
			>
				{/* Fixed background blobs */}
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="bg-primary-500/8 absolute top-1/4 left-1/4 h-[300px] w-[300px] animate-[driftSlow_8s_ease-in-out_infinite] rounded-full blur-[120px]" />
					<div className="absolute right-1/4 bottom-1/4 h-[250px] w-[250px] animate-[driftSlow_8s_ease-in-out_2s_infinite] rounded-full bg-indigo-500/8 blur-[100px]" />
					<div className="absolute top-2/3 left-1/2 h-[200px] w-[200px] animate-[driftSlow_10s_ease-in-out_4s_infinite] rounded-full bg-purple-500/6 blur-[80px]" />
					{/* Dot grid */}
					<div
						className="absolute inset-0 opacity-[0.025]"
						style={{
							backgroundImage: "radial-gradient(rgba(255,255,255,.4) 1px, transparent 1px)",
							backgroundSize: "28px 28px",
						}}
					/>
				</div>

				{/* ── Top navigation bar ── */}
				<div className="relative z-10 flex shrink-0 items-center justify-between border-b border-gray-800/60 bg-gray-950/70 px-4 py-3 backdrop-blur-md sm:px-6">
					{/* Logo */}
					<div className="flex items-center gap-2">
						<Image
							src="/logos/memora-logo.png"
							alt="Memora"
							width={28}
							height={28}
							className="rounded-lg"
						/>
						<span className="hidden font-serif text-sm font-bold text-white sm:inline">Memora Hub</span>
					</div>

					{/* Stepper */}
					<OnboardingStepper currentStep={currentStep} />

					{/* Step counter */}
					<div className="text-right">
						<p className="text-xs font-medium text-gray-500">
							<span className="text-white">{currentStep + 1}</span>
							<span className="text-gray-600"> / {TOTAL_STEPS}</span>
						</p>
					</div>
				</div>

				{/* ── Step content ── */}
				<div key={stepKey} className={cn("flex-1 overflow-y-auto", currentStep > 0 ? slideClass : "")}>
					{steps[currentStep]()}
				</div>

				{/* ── Bottom navigation ── */}
				{showNav && (
					<div className="relative z-10 shrink-0 border-t border-gray-800/60 bg-gray-950/70 px-4 py-3 backdrop-blur-md sm:px-6">
						<div className="mx-auto flex max-w-2xl items-center justify-between">
							<button
								onClick={prevStep}
								disabled={isAnimating || isSubmitting}
								className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800/60 hover:text-white disabled:opacity-40"
							>
								<Icon name="chevronLeft" size="xs" />
								Retour
							</button>

							<div className="flex items-center gap-3">
								{isFormStep && submitError && (
									<p className="max-w-[200px] truncate text-xs text-red-400">{submitError}</p>
								)}
								<Button
									variant="primary"
									size="md"
									onClick={nextStep}
									disabled={isAnimating}
									isLoading={isSubmitting}
									className="group gap-2"
								>
									{isFormStep ? "Créer mon profil" : currentStep === 7 ? "Terminer" : "Continuer"}
									{!isSubmitting && (
										<Icon
											name="chevronRight"
											size="sm"
											className="transition-transform group-hover:translate-x-1"
										/>
									)}
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
