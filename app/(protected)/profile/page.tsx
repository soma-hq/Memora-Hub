"use client";

// React
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Button, Timeline, Tag } from "@/components/ui";
import { UserArchives } from "@/features/users/components/user-archives";
import { cn } from "@/lib/utils/cn";
import type { BadgeVariant } from "@/core/design/states";
import type { IconName } from "@/core/design/icons";


type ProfileTab = "profil" | "acces" | "infos" | "activite";

interface TabDef {
	id: ProfileTab;
	label: string;
	icon: IconName;
}

const TABS: TabDef[] = [
	{ id: "profil", label: "Profil", icon: "profile" },
	{ id: "acces", label: "Accès", icon: "shield" },
	{ id: "infos", label: "Informations personnelles", icon: "edit" },
	{ id: "activite", label: "Activité récente", icon: "clock" },
];

const roleVariant: Record<string, BadgeVariant> = {
	Owner: "primary",
	Admin: "info",
	Manager: "warning",
	Collaborateur: "success",
	Invité: "neutral",
};

const teamColors: Record<string, string> = {
	Owner: "text-primary-500",
	Executive: "text-red-500",
	"Marsha Team": "text-purple-500",
	Legacy: "text-amber-500",
	Talent: "text-emerald-500",
	Momentum: "text-blue-500",
	Squad: "text-gray-400",
};

const mockProfile = {
	firstName: "Jeremy",
	lastName: "Alpha",
	displayName: "Jeremy Alpha",
	email: "jeremy@memora.hub",
	phone: "+33 6 12 34 56 78",
	birthdate: "14 mars 1998",
	birthdayWish: true,
	languages: ["Français", "Anglais"],
	avatar: "/avatar/Alpha.jpeg",
	discordUsername: "jeremy_alpha",
	discordId: "376284910038261761",
	social: {
		twitter: "jeremy_alpha",
		twitch: "jeremyalpha",
		youtube: "@jeremyalpha",
		instagram: "jeremy.alpha",
		discord: "jeremy_alpha",
		reddit: "jeremyalpha",
	},
	roleMain: "Owner",
	roleSecondary: "Directeur technique",
	team: "Owner",
	entity: "Bazalthe",
	division: "Technologie",
	arrivalDate: "Janvier 2024",
};

const entityAccessData = [
	{
		entityId: "bazalthe",
		entityName: "Bazalthe",
		logo: "/logos/memora-logo.png",
		team: "Owner",
		joinedAt: "Janvier 2024",
		permissions: [
			"Gestion complète",
			"Utilisateurs",
			"Projets",
			"Tâches",
			"Réunions",
			"Recrutement",
			"Formation",
			"Absences",
			"Statistiques",
			"Développeur",
		],
	},
	{
		entityId: "inoxtag",
		entityName: "Inoxtag",
		logo: "/logos/inoxtag-logo.png",
		team: "Executive",
		joinedAt: "Mars 2024",
		permissions: ["Utilisateurs", "Projets", "Tâches", "Réunions", "Recrutement", "Formation"],
	},
];

const activityItems = [
	{
		id: "1",
		icon: "check" as const,
		title: (
			<>
				<span className="font-medium">A terminé</span> Implémenter la page de login
			</>
		),
		time: "Il y a 2h",
	},
	{
		id: "2",
		icon: "edit" as const,
		title: (
			<>
				<span className="font-medium">A commenté</span> sur Design composants UI
			</>
		),
		time: "Il y a 5h",
	},
	{
		id: "3",
		icon: "folder" as const,
		title: (
			<>
				<span className="font-medium">A créé</span> le projet API Partenaires
			</>
		),
		time: "Hier",
	},
	{
		id: "4",
		icon: "calendar" as const,
		title: (
			<>
				<span className="font-medium">A planifié</span> la réunion Revue de sprint #14
			</>
		),
		time: "Il y a 2j",
	},
	{
		id: "5",
		icon: "check" as const,
		title: (
			<>
				<span className="font-medium">A approuvé</span> l&apos;absence de Lucas Foxtrot
			</>
		),
		time: "Il y a 3j",
	},
	{
		id: "6",
		icon: "profile" as const,
		title: (
			<>
				<span className="font-medium">A mis à jour</span> son profil
			</>
		),
		time: "Il y a 5j",
	},
	{
		id: "7",
		icon: "tasks" as const,
		title: (
			<>
				<span className="font-medium">A assigné</span> 3 tâches à Marie Delta
			</>
		),
		time: "Il y a 1 semaine",
	},
];

interface StatItem {
	id: string;
	title: string;
	subtitle: string;
	icon: "folder" | "check" | "calendar" | "clock";
}

const STAT_DETAILS: Record<string, StatItem[]> = {
	"Projets actifs": [
		{ id: "s1", title: "Refonte Site Web", subtitle: "En cours · 12 tâches", icon: "folder" },
		{ id: "s2", title: "App Mobile V2", subtitle: "En cours · 8 tâches", icon: "folder" },
		{ id: "s3", title: "API Partenaires", subtitle: "En cours · 5 tâches", icon: "folder" },
		{ id: "s4", title: "Dashboard Analytics", subtitle: "En cours · 3 tâches", icon: "folder" },
		{ id: "s5", title: "Migration Cloud", subtitle: "En cours · 7 tâches", icon: "folder" },
		{ id: "s6", title: "Redesign Branding", subtitle: "En cours · 4 tâches", icon: "folder" },
		{ id: "s7", title: "Système de Paiement", subtitle: "En cours · 6 tâches", icon: "folder" },
		{ id: "s8", title: "Formation Platform", subtitle: "En cours · 2 tâches", icon: "folder" },
	],
	"Tâches complétées": [
		{ id: "t1", title: "Implémenter la page login", subtitle: "Terminé · Il y a 2h", icon: "check" },
		{ id: "t2", title: "Design composants UI", subtitle: "Terminé · Il y a 5h", icon: "check" },
		{ id: "t3", title: "Intégration API Auth", subtitle: "Terminé · Hier", icon: "check" },
		{ id: "t4", title: "Tests end-to-end", subtitle: "Terminé · Il y a 2j", icon: "check" },
		{ id: "t5", title: "Migration base de données", subtitle: "Terminé · Il y a 3j", icon: "check" },
		{ id: "t6", title: "Documentation API", subtitle: "Terminé · Il y a 4j", icon: "check" },
	],
	"Réunions ce mois": [
		{ id: "m1", title: "Sprint Planning #15", subtitle: "Lundi 10h · Bazalthe", icon: "calendar" },
		{ id: "m2", title: "Revue de sprint #14", subtitle: "Vendredi 14h · Bazalthe", icon: "calendar" },
		{ id: "m3", title: "Point Design", subtitle: "Mercredi 11h · Inoxtag", icon: "calendar" },
		{ id: "m4", title: "Sync Partenaires", subtitle: "Jeudi 15h · Bazalthe", icon: "calendar" },
		{ id: "m5", title: "1:1 Technique", subtitle: "Mardi 9h · Bazalthe", icon: "calendar" },
		{ id: "m6", title: "Rétrospective", subtitle: "Vendredi 16h · Bazalthe", icon: "calendar" },
	],
	"Jours d'absence": [
		{ id: "a1", title: "Congés payés", subtitle: "15-17 Jan · 3 jours", icon: "clock" },
		{ id: "a2", title: "RTT", subtitle: "28 Fév · 1 jour", icon: "clock" },
		{ id: "a3", title: "Congé maladie", subtitle: "5 Mar · 1 jour", icon: "clock" },
	],
};

const ITEMS_PER_PAGE = 4;

// Hardcoded current user ID (replace with auth context when available)
const CURRENT_USER_ID = "u0";

function InfoRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
	return (
		<div className="flex items-start justify-between gap-4 py-3">
			<span className="min-w-[160px] shrink-0 text-sm text-gray-500 dark:text-gray-400">{label}</span>
			<span
				className={cn(
					"text-right text-sm font-medium text-gray-900 dark:text-white",
					mono && "font-mono text-xs",
				)}
			>
				{value}
			</span>
		</div>
	);
}

function SocialRow({
	icon,
	label,
	handle,
	url,
}: {
	icon: React.ReactNode;
	label: string;
	handle: string;
	url: string;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-3">
			<div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-gray-400">
				{icon}
				<span>{label}</span>
			</div>
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary-600 dark:text-primary-400 flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
			>
				{handle}
				<Icon name="link" size="xs" className="opacity-60" />
			</a>
		</div>
	);
}

function ProfilView({ onEditProfile }: { onEditProfile: () => void }) {
	const [activeStat, setActiveStat] = useState<string | null>(null);
	const [statPage, setStatPage] = useState(0);

	const activeItems = activeStat ? STAT_DETAILS[activeStat] || [] : [];
	const totalPages = Math.ceil(activeItems.length / ITEMS_PER_PAGE);
	const pagedItems = activeItems.slice(statPage * ITEMS_PER_PAGE, (statPage + 1) * ITEMS_PER_PAGE);

	const openStat = (label: string) => {
		setActiveStat(label);
		setStatPage(0);
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Main profile card */}
				<div className="lg:col-span-2">
					<Card padding="lg">
						<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
							<Image
								src={mockProfile.avatar}
								alt={mockProfile.displayName}
								width={112}
								height={112}
								className="rounded-2xl object-cover ring-4 ring-gray-100 dark:ring-gray-700"
							/>
							<div className="flex-1 text-center sm:text-left">
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
									{mockProfile.displayName}
								</h2>
								<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{mockProfile.email}</p>
								<div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
									<Badge variant="primary">{mockProfile.roleMain}</Badge>
									<Badge variant={roleVariant[mockProfile.team] || "neutral"} showDot={false}>
										Team {mockProfile.team}
									</Badge>
									<Badge variant="success">Actif</Badge>
								</div>
								<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
									{mockProfile.roleSecondary} · {mockProfile.entity} · {mockProfile.division}
								</p>

								<div className="mt-4 flex flex-wrap gap-3">
									<Button variant="outline-primary" size="sm" onClick={onEditProfile}>
										<Icon name="edit" size="xs" />
										Modifier le profil
									</Button>
								</div>
							</div>
						</div>

						{/* Quick info rows */}
						<div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-200 pt-6 sm:grid-cols-2 dark:border-gray-700">
							{[
								{ icon: "calendar" as const, label: "Membre depuis", value: mockProfile.arrivalDate },
								{ icon: "shield" as const, label: "Sécurité", value: "A2F activée" },
								{ icon: "group" as const, label: "Entité principale", value: mockProfile.entity },
								{ icon: "profile" as const, label: "Division", value: mockProfile.division },
							].map((item) => (
								<div key={item.label} className="flex items-center gap-3">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
										<Icon name={item.icon} size="sm" className="text-gray-500 dark:text-gray-400" />
									</div>
									<div>
										<p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{item.value}
										</p>
									</div>
								</div>
							))}
						</div>
					</Card>
				</div>

				{/* Stats sidebar */}
				<div className="space-y-4">
					<Card padding="md">
						<p className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Statistiques
						</p>
						<div className="space-y-1">
							{[
								{
									label: "Projets actifs",
									value: "8",
									color: "text-primary-500",
									bg: "hover:bg-primary-50 dark:hover:bg-primary-900/10",
								},
								{
									label: "Tâches complétées",
									value: "47",
									color: "text-emerald-500",
									bg: "hover:bg-emerald-50 dark:hover:bg-emerald-900/10",
								},
								{
									label: "Réunions ce mois",
									value: "12",
									color: "text-blue-500",
									bg: "hover:bg-blue-50 dark:hover:bg-blue-900/10",
								},
								{
									label: "Jours d'absence",
									value: "3",
									color: "text-amber-500",
									bg: "hover:bg-amber-50 dark:hover:bg-amber-900/10",
								},
							].map((stat) => (
								<button
									key={stat.label}
									onClick={() => openStat(activeStat === stat.label ? "" : stat.label)}
									className={cn(
										"flex w-full items-center justify-between rounded-lg px-3 py-2 transition-all duration-200",
										stat.bg,
										activeStat === stat.label && "ring-1 ring-gray-200 dark:ring-gray-600",
									)}
								>
									<span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
									<span className={cn("text-lg font-bold", stat.color)}>{stat.value}</span>
								</button>
							))}
						</div>
					</Card>

					{/* Stat detail panel */}
					{activeStat && activeItems.length > 0 && (
						<Card padding="md">
							<div className="mb-3 flex items-center justify-between">
								<p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
									{activeStat}
								</p>
								<button
									onClick={() => setActiveStat(null)}
									className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
								>
									<Icon name="close" size="xs" />
								</button>
							</div>

							<div className="space-y-2">
								{pagedItems.map((item) => (
									<div
										key={item.id}
										className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50"
									>
										<Icon name={item.icon} size="sm" className="shrink-0 text-gray-400" />
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
												{item.title}
											</p>
											<p className="truncate text-xs text-gray-500 dark:text-gray-400">
												{item.subtitle}
											</p>
										</div>
									</div>
								))}
							</div>

							{/* Pagination arrows */}
							{totalPages > 1 && (
								<div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-700/50">
									<button
										onClick={() => setStatPage((p) => Math.max(0, p - 1))}
										disabled={statPage === 0}
										className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
									>
										<Icon name="chevronLeft" size="sm" />
									</button>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{statPage + 1} / {totalPages}
									</span>
									<button
										onClick={() => setStatPage((p) => Math.min(totalPages - 1, p + 1))}
										disabled={statPage === totalPages - 1}
										className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
									>
										<Icon name="chevronRight" size="sm" />
									</button>
								</div>
							)}
						</Card>
					)}

					<Card padding="md">
						<p className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Langues
						</p>
						<div className="flex flex-wrap gap-2">
							{mockProfile.languages.map((lang) => (
								<Tag key={lang} color="gray">
									{lang}
								</Tag>
							))}
						</div>
					</Card>

					<Card padding="md">
						<p className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Discord
						</p>
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-500 dark:text-gray-400">Username</span>
								<span className="font-medium text-gray-900 dark:text-white">
									{mockProfile.discordUsername}
								</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-500 dark:text-gray-400">ID</span>
								<span className="font-mono text-xs text-gray-900 dark:text-white">
									{mockProfile.discordId}
								</span>
							</div>
						</div>
					</Card>
				</div>
			</div>

			{/* User archives — full width below the profile grid */}
			<UserArchives userId={CURRENT_USER_ID} />
		</div>
	);
}

function AccesView() {
	return (
		<div className="space-y-5">
			{/* Team overview */}
			<Card padding="lg">
				<div className="mb-5 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
						<Icon name="shield" size="md" className="text-primary-500" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Votre team</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Rôle et niveau d&apos;accès sur la plateforme
						</p>
					</div>
				</div>

				<div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/60">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<span className={cn("text-2xl font-bold", teamColors[mockProfile.team] || "text-gray-500")}>
								{mockProfile.team}
							</span>
						</div>
						<Badge variant="primary" showDot={false}>
							Accès total
						</Badge>
					</div>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Maîtrise totale du Hub. Tous les accès, compte développeur, sans aucune exception.
					</p>
				</div>
			</Card>

			{/* Per-entity access */}
			<Card padding="lg">
				<div className="mb-5 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
						<Icon name="group" size="md" className="text-indigo-500" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Accès par entité</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Vos rôles et permissions dans chaque entité
						</p>
					</div>
				</div>

				<div className="space-y-4">
					{entityAccessData.map((access) => (
						<div
							key={access.entityId}
							className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800/40"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Image
										src={access.logo}
										alt={access.entityName}
										width={40}
										height={40}
										className="rounded-lg object-contain"
									/>
									<div>
										<h4 className="font-semibold text-gray-900 dark:text-white">
											{access.entityName}
										</h4>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											Membre depuis {access.joinedAt}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<span
										className={cn(
											"text-sm font-semibold",
											teamColors[access.team] || "text-gray-500",
										)}
									>
										{access.team}
									</span>
								</div>
							</div>

							<div>
								<p className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
									Permissions
								</p>
								<div className="flex flex-wrap gap-1.5">
									{access.permissions.map((perm) => (
										<Tag key={perm} color={access.team === "Owner" ? "primary" : "info"}>
											{perm}
										</Tag>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}

function InfosView() {
	const [birthdayWish, setBirthdayWish] = useState(mockProfile.birthdayWish);
	const router = useRouter();

	return (
		<div className="space-y-5">
			{/* Identité */}
			<Card padding="lg">
				<div className="mb-5 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
						<Icon name="profile" size="md" className="text-indigo-500" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Identité</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">Coordonnées et informations de base</p>
					</div>
				</div>

				<div className="divide-y divide-gray-100 dark:divide-gray-700/60">
					<InfoRow label="Prénom" value={mockProfile.firstName} />
					<InfoRow label="Nom" value={mockProfile.lastName} />
					<InfoRow label="Email" value={mockProfile.email} />
					<InfoRow label="Téléphone" value={mockProfile.phone} />
					<InfoRow label="Date de naissance" value={mockProfile.birthdate} />
					<InfoRow
						label="Langues"
						value={
							<div className="flex flex-wrap justify-end gap-1.5">
								{mockProfile.languages.map((lang) => (
									<Tag key={lang} color="gray">
										{lang}
									</Tag>
								))}
							</div>
						}
					/>
				</div>

				{/* Birthday wish toggle */}
				<div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2.5">
							<Icon name="heart" size="sm" className="text-rose-400" />
							<div>
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									Souhait d&apos;anniversaire
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Recevoir un message le jour de votre anniversaire
								</p>
							</div>
						</div>
						<button
							onClick={() => setBirthdayWish(!birthdayWish)}
							className={cn(
								"relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
								birthdayWish ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600",
							)}
							role="switch"
							aria-checked={birthdayWish}
						>
							<span
								className={cn(
									"pointer-events-none h-5 w-5 translate-x-0 rounded-full bg-white shadow ring-0 transition-transform duration-200",
									birthdayWish ? "translate-x-5" : "translate-x-0",
								)}
							/>
						</button>
					</div>
				</div>
			</Card>

			{/* Organisation */}
			<Card padding="lg">
				<div className="mb-5 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
						<Icon name="group" size="md" className="text-amber-500" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organisation</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">Rôles, entité et division</p>
					</div>
				</div>

				<div className="divide-y divide-gray-100 dark:divide-gray-700/60">
					<InfoRow
						label="Rôle principal"
						value={
							<Badge variant="primary" showDot={false}>
								{mockProfile.roleMain}
							</Badge>
						}
					/>
					<InfoRow label="Rôle secondaire" value={mockProfile.roleSecondary} />
					<InfoRow
						label="Team"
						value={
							<span className={cn("font-semibold", teamColors[mockProfile.team])}>
								{mockProfile.team}
							</span>
						}
					/>
					<InfoRow label="Entité" value={mockProfile.entity} />
					<InfoRow label="Division" value={mockProfile.division} />
					<InfoRow label="Date d'arrivée" value={mockProfile.arrivalDate} />
					<div className="flex items-center justify-between gap-4 py-3">
						<span className="min-w-[160px] shrink-0 text-sm text-gray-500 dark:text-gray-400">
							Suivi PIM
						</span>
						<button
							onClick={() => router.push("/hub/default/momentum/sessions")}
							className="text-primary-600 dark:text-primary-400 flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
						>
							Voir les sessions
							<Icon name="chevronRight" size="xs" />
						</button>
					</div>
				</div>
			</Card>

			{/* Discord */}
			<Card padding="lg">
				<div className="mb-5 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
						<Icon name="globe" size="md" className="text-indigo-400" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discord</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">Identifiants Discord</p>
					</div>
				</div>

				<div className="divide-y divide-gray-100 dark:divide-gray-700/60">
					<InfoRow label="Nom d'utilisateur" value={mockProfile.discordUsername} />
					<InfoRow label="ID Discord" value={mockProfile.discordId} mono />
				</div>
			</Card>

			{/* Réseaux sociaux */}
			<Card padding="lg">
				<div className="mb-5 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
						<Icon name="link" size="md" className="text-sky-500" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Réseaux sociaux</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">Liens vers vos profils publics</p>
					</div>
				</div>

				<div className="divide-y divide-gray-100 dark:divide-gray-700/60">
					{mockProfile.social.twitter && (
						<SocialRow
							icon={<Icon name="globe" size="sm" />}
							label="Twitter / X"
							handle={`@${mockProfile.social.twitter}`}
							url={`https://twitter.com/${mockProfile.social.twitter}`}
						/>
					)}
					{mockProfile.social.twitch && (
						<SocialRow
							icon={<Icon name="video" size="sm" />}
							label="Twitch"
							handle={mockProfile.social.twitch}
							url={`https://twitch.tv/${mockProfile.social.twitch}`}
						/>
					)}
					{mockProfile.social.youtube && (
						<SocialRow
							icon={<Icon name="video" size="sm" />}
							label="YouTube"
							handle={mockProfile.social.youtube}
							url={`https://youtube.com/${mockProfile.social.youtube}`}
						/>
					)}
					{mockProfile.social.instagram && (
						<SocialRow
							icon={<Icon name="globe" size="sm" />}
							label="Instagram"
							handle={`@${mockProfile.social.instagram}`}
							url={`https://instagram.com/${mockProfile.social.instagram}`}
						/>
					)}
					{mockProfile.social.reddit && (
						<SocialRow
							icon={<Icon name="globe" size="sm" />}
							label="Reddit"
							handle={`u/${mockProfile.social.reddit}`}
							url={`https://reddit.com/u/${mockProfile.social.reddit}`}
						/>
					)}
				</div>
			</Card>
		</div>
	);
}

function ActiviteView() {
	return (
		<Card padding="lg">
			<div className="mb-5 flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
					<Icon name="clock" size="md" className="text-amber-500" />
				</div>
				<div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activité récente</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Dernières actions effectuées sur la plateforme
					</p>
				</div>
			</div>

			<Timeline items={activityItems} />
		</Card>
	);
}

/**
 * User profile page with tabs for profile details, access, info and activity.
 * @returns The profile page with tabbed navigation
 */
export default function ProfilePage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<ProfileTab>("profil");

	return (
		<PageContainer title="Mon profil" description="Consultez vos informations, accès et activité récente">
			{/* Tab navigation */}
			<div className="mb-6 border-b border-gray-200 dark:border-gray-700">
				<nav className="-mb-px flex gap-1 overflow-x-auto">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200",
								activeTab === tab.id
									? "border-primary-500 text-primary-600 dark:text-primary-400"
									: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
							)}
						>
							<Icon
								name={tab.icon}
								size="sm"
								className={cn(
									activeTab === tab.id ? "text-primary-500" : "text-gray-400 dark:text-gray-500",
								)}
							/>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			{/* Tab content */}
			{activeTab === "profil" && <ProfilView onEditProfile={() => router.push("/settings/account")} />}
			{activeTab === "acces" && <AccesView />}
			{activeTab === "infos" && <InfosView />}
			{activeTab === "activite" && <ActiviteView />}
		</PageContainer>
	);
}
