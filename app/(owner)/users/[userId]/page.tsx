"use client";

// React
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Card, Badge, Icon, Button, Tag } from "@/components/ui";
import { getUserById } from "@/features/users/data";
import { DIVISION_ICONS, DIVISION_LABELS } from "@/features/users/types";
import { TEAM_TEXT_COLORS, TEAM_DESCRIPTIONS, type Team } from "@/core/config/teams";
import type { UserProfile } from "@/features/users/types";
import type { BadgeVariant } from "@/core/design/states";
import type { IconName } from "@/core/design/icons";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showInfo } from "@/lib/utils/toast";
import { useUserRelations } from "@/hooks/use-data-store";
import { UserArchives } from "@/features/users/components/user-archives";


type ProfileTab = "profil" | "acces" | "infos" | "activite";

interface TabDef {
	id: ProfileTab;
	label: string;
	icon: IconName;
}

const TABS: TabDef[] = [
	{ id: "profil", label: "Profil", icon: "profile" },
	{ id: "acces", label: "Accès", icon: "shield" },
	{ id: "infos", label: "Informations", icon: "edit" },
	{ id: "activite", label: "Activité", icon: "clock" },
];

const roleVariant: Record<string, BadgeVariant> = {
	Owner: "primary",
	Executive: "error",
	"Marsha Team": "info",
	Legacy: "warning",
	Talent: "success",
	Momentum: "info",
	Squad: "neutral",
};

// Entity → banner image mapping (portrait photos used as atmospheric blurred bg)
const ENTITY_BANNERS: Record<string, string> = {
	Bazalthe: "/banners/anthony-banner.png",
	Inoxtag: "/banners/inoxtag-banner.png",
	Doigby: "/banners/doigby-banner.png",
	Michou: "/banners/michou/michou-banner.png",
	Anthony: "/banners/anthony-banner.png",
};

// Mock current user team (simulates logged-in user)
const CURRENT_USER_TEAM: Team = "Owner";

// Fields that Legacy cannot edit
const LEGACY_READONLY_FIELDS = ["division", "team", "entity", "roleSecondary"];

function canEditField(field: string): boolean {
	if (CURRENT_USER_TEAM === "Owner" || CURRENT_USER_TEAM === "Executive") return true;
	if (CURRENT_USER_TEAM === "Legacy" && LEGACY_READONLY_FIELDS.includes(field)) return false;
	if (CURRENT_USER_TEAM === "Marsha Team") return true;
	if (CURRENT_USER_TEAM === "Legacy") return true;
	return false;
}

function canEdit(): boolean {
	return (
		CURRENT_USER_TEAM === "Owner" ||
		CURRENT_USER_TEAM === "Executive" ||
		CURRENT_USER_TEAM === "Marsha Team" ||
		CURRENT_USER_TEAM === "Legacy"
	);
}

/**
 * User detail page displaying profile, access, info and activity tabs.
 * @returns The user profile detail page
 */
export default function UserDetailPage() {
	const router = useRouter();
	const params = useParams();
	const userId = params.userId as string;

	const user = getUserById(userId);
	const [activeTab, setActiveTab] = useState<ProfileTab>("profil");

	if (!user) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center p-8">
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-12 py-20 dark:border-gray-600">
					<Icon name="users" size="xl" className="mb-3 text-gray-300 dark:text-gray-600" />
					<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
						Aucun utilisateur trouvé avec cet identifiant.
					</p>
					<Button variant="outline-primary" size="sm" onClick={() => router.push("/users")}>
						<Icon name="back" size="xs" />
						Retour aux utilisateurs
					</Button>
				</div>
			</div>
		);
	}

	const bannerSrc = ENTITY_BANNERS[user.entity];

	return (
		<div className="flex flex-1 flex-col overflow-y-auto">
			{/* ── Hero header ── */}
			<div className="relative h-52 w-full overflow-hidden sm:h-60">
				{/* Bannière de l'entité — fortement floutée, très sombre */}
				{bannerSrc ? (
					<Image
						src={bannerSrc}
						alt=""
						fill
						className="scale-105 object-cover object-top blur-sm brightness-[0.28] saturate-[0.6]"
						priority
						sizes="100vw"
					/>
				) : (
					<div className="absolute inset-0 bg-gray-900" />
				)}

				{/* Gradient fade bottom → rien (le fond de la page reprend) */}
				<div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent dark:from-gray-900" />
				{/* Subtle vignette sides */}
				<div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

				{/* Back button — top-left */}
				<div className="absolute top-4 left-4 sm:left-6">
					<button
						onClick={() => router.push("/users")}
						className={cn(
							"flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
							"bg-white/10 text-white/80 backdrop-blur-sm",
							"border border-white/20 transition-all hover:bg-white/20 hover:text-white",
						)}
					>
						<Icon name="back" size="xs" />
						Utilisateurs
					</button>
				</div>

				{/* Avatar + identity — overlapping the hero bottom */}
				<div className="absolute right-0 bottom-0 left-0 translate-y-1/2 px-4 sm:px-6 lg:px-8">
					<div className="flex items-end gap-4">
						{/* Avatar */}
						<div className="shrink-0">
							{user.avatar ? (
								<Image
									src={user.avatar}
									alt={user.pseudo}
									width={80}
									height={80}
									className={cn(
										"h-20 w-20 rounded-2xl object-cover",
										"ring-4 ring-white dark:ring-gray-900",
										"shadow-xl",
									)}
								/>
							) : (
								<div
									className={cn(
										"flex h-20 w-20 items-center justify-center rounded-2xl",
										"text-2xl font-black text-white",
										"shadow-xl ring-4 ring-white dark:ring-gray-900",
										"bg-gradient-to-br from-gray-700 to-gray-900",
									)}
								>
									{user.pseudo.charAt(0).toUpperCase()}
								</div>
							)}
						</div>

						{/* Name + badges — pushed into the light zone, invisible until after translate */}
						<div className="mb-1 hidden sm:block">
							{/* These are in the overlap zone, visible after translate */}
						</div>
					</div>
				</div>
			</div>

			{/* ── Identity bar (just below hero overlap) ── */}
			<div className="bg-gray-50 pt-12 pb-0 dark:bg-gray-900">
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="flex flex-wrap items-start justify-between gap-3">
						{/* Left: name + meta */}
						<div>
							<div className="flex items-center gap-2.5">
								<h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
									{user.pseudo}
								</h1>
								{/* Division icon inline */}
								<Image
									src={DIVISION_ICONS[user.division]}
									alt={`Division ${user.division}`}
									width={26}
									height={26}
									className="opacity-90"
								/>
							</div>
							<p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
								{user.firstName} {user.lastName} · {user.roleSecondary}
							</p>
							<div className="mt-2 flex flex-wrap items-center gap-2">
								<Badge variant={roleVariant[user.team] || "neutral"} showDot={false}>
									{user.team}
								</Badge>
								<span className="text-gray-300 dark:text-gray-600">·</span>
								<span className="text-sm text-gray-500 dark:text-gray-400">{user.entity}</span>
								<span className="text-gray-300 dark:text-gray-600">·</span>
								<span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
									<span
										className={cn(
											"h-1.5 w-1.5 rounded-full",
											user.status === "active" ? "bg-emerald-500" : "bg-gray-400",
										)}
									/>
									{user.status === "active" ? "Actif" : "Inactif"}
								</span>
							</div>
						</div>

						{/* Right: entity banner hint — discrete label */}
						<div className="flex items-center gap-2 opacity-40">
							<Icon name="group" size="xs" className="text-gray-400" />
							<span className="text-xs text-gray-400">{user.entity}</span>
						</div>
					</div>

					{/* ── Tabs ── */}
					<div className="mt-5 border-b border-gray-200 dark:border-gray-700/60">
						<nav className="-mb-px flex gap-0 overflow-x-auto">
							{TABS.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={cn(
										"flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-150",
										activeTab === tab.id
											? "border-primary-500 text-primary-600 dark:text-primary-400"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
									)}
								>
									<Icon
										name={tab.icon}
										size="sm"
										className={cn(
											activeTab === tab.id
												? "text-primary-500"
												: "text-gray-400 dark:text-gray-500",
										)}
									/>
									{tab.label}
								</button>
							))}
						</nav>
					</div>
				</div>
			</div>

			{/* ── Tab content ── */}
			<div className="flex-1 bg-gray-50 dark:bg-gray-900">
				<div className="px-4 py-6 sm:px-6 lg:px-8">
					{activeTab === "profil" && <ProfilView user={user} />}
					{activeTab === "acces" && <AccesView user={user} />}
					{activeTab === "infos" && <InfosView user={user} />}
					{activeTab === "activite" && <ActiviteView user={user} />}
				</div>
			</div>
		</div>
	);
}

// Info row component
function InfoRow({
	label,
	value,
	mono = false,
	editable = false,
	field,
	onEdit,
}: {
	label: string;
	value: React.ReactNode;
	mono?: boolean;
	editable?: boolean;
	field?: string;
	onEdit?: (field: string) => void;
}) {
	const isEditable = editable && field && canEditField(field);

	return (
		<div
			className={cn(
				"flex items-start justify-between gap-4 py-3",
				isEditable &&
					"-mx-2 cursor-pointer rounded-lg px-2 transition-colors hover:bg-gray-100/70 dark:hover:bg-gray-800/50",
			)}
			onClick={() => isEditable && onEdit?.(field)}
		>
			<span className="min-w-[140px] shrink-0 text-sm text-gray-500 dark:text-gray-400">{label}</span>
			<div className="flex items-center gap-2">
				<span
					className={cn(
						"text-right text-sm font-medium text-gray-900 dark:text-white",
						mono && "font-mono text-xs",
					)}
				>
					{value}
				</span>
				{isEditable && <Icon name="edit" size="xs" className="shrink-0 text-gray-300 dark:text-gray-600" />}
			</div>
		</div>
	);
}

// Edit modal for fields
function EditFieldModal({
	field,
	label,
	currentValue,
	onClose,
	onSave,
	type = "text",
	options,
}: {
	field: string;
	label: string;
	currentValue: string;
	onClose: () => void;
	onSave: (value: string) => void;
	type?: "text" | "select";
	options?: { label: string; value: string }[];
}) {
	const [value, setValue] = useState(currentValue);

	const handleSave = () => {
		onSave(value);
		onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-base font-semibold text-gray-900 dark:text-white">Modifier {label}</h3>
					<button
						onClick={onClose}
						className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<Icon name="close" size="sm" />
					</button>
				</div>

				{type === "select" && options ? (
					<select
						value={value}
						onChange={(e) => setValue(e.target.value)}
						className={cn(
							"w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
							"text-gray-700 transition-all duration-200",
							"focus:border-primary-500 focus:ring-primary-500 focus:ring-1 focus:outline-none",
							"dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200",
						)}
					>
						{options.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				) : (
					<input
						type="text"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						className={cn(
							"w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
							"text-gray-700 transition-all duration-200",
							"focus:border-primary-500 focus:ring-primary-500 focus:ring-1 focus:outline-none",
							"dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200",
						)}
						autoFocus
					/>
				)}

				{!canEditField(field) && (
					<p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
						<Icon name="lock" size="xs" />
						Vous n&apos;avez pas la permission de modifier ce champ.
					</p>
				)}

				<div className="mt-4 flex justify-end gap-2">
					<Button variant="cancel" size="sm" onClick={onClose}>
						Annuler
					</Button>
					<Button variant="primary" size="sm" onClick={handleSave}>
						Enregistrer
					</Button>
				</div>
			</div>
		</div>
	);
}

// ── Profile tab ──────────────────────────────────────────────────────────────
function ProfilView({ user }: { user: UserProfile }) {
	const teamColor = TEAM_TEXT_COLORS[user.team] ?? "text-gray-500";
	const divisionIcon = DIVISION_ICONS[user.division];

	// Real computed stats from the data store
	const { projects, tasks, meetings, absences } = useUserRelations(user.id);
	const stats = [
		{ label: "Projets", value: String(projects.active.length), icon: "folder" as const },
		{
			label: "Tâches faites",
			value: String(tasks.archived.filter((t) => t.status === "done").length),
			icon: "tasks" as const,
		},
		{ label: "Réunions", value: String(meetings.upcoming.length), icon: "calendar" as const },
		{ label: "Absences", value: String(absences.length), icon: "absence" as const },
	];

	return (
		<div className="space-y-5">
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
				{/* Main info card */}
				<div className="space-y-5 lg:col-span-2">
					{/* Quick stats */}
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{stats.map((stat) => (
							<Card key={stat.label} padding="sm">
								<div className="flex items-center gap-2.5">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
										<Icon name={stat.icon} size="sm" className="text-gray-500 dark:text-gray-400" />
									</div>
									<div>
										<p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
									</div>
								</div>
							</Card>
						))}
					</div>

					{/* Info rows */}
					<Card padding="lg">
						<p className="mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
							Informations générales
						</p>
						<div className="divide-y divide-gray-100 dark:divide-gray-700/60">
							<InfoRow label="Email" value={user.email} />
							<InfoRow label="Téléphone" value={user.phone} />
							<InfoRow label="Date de naissance" value={user.birthdate} />
							<InfoRow
								label="Membre depuis"
								value={
									<span className="flex items-center gap-1.5">
										<Icon name="calendar" size="xs" className="text-gray-400" />
										{user.arrivalDate}
									</span>
								}
							/>
							<InfoRow label="Entité" value={user.entity} />
							<InfoRow
								label="Team"
								value={<span className={cn("font-semibold", teamColor)}>{user.team}</span>}
							/>
							<InfoRow
								label="Division"
								value={
									<div className="flex items-center gap-2">
										<Image src={divisionIcon} alt="" width={20} height={20} />
										<span>{DIVISION_LABELS[user.division]}</span>
									</div>
								}
							/>
						</div>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-4">
					{/* Discord */}
					<Card padding="md">
						<p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
							Discord
						</p>
						<div className="space-y-2.5">
							<div className="flex items-center justify-between gap-3 text-sm">
								<span className="text-gray-500 dark:text-gray-400">Pseudo</span>
								<span className="font-medium text-gray-900 dark:text-white">
									{user.discordUsername}
								</span>
							</div>
							<div className="flex items-center justify-between gap-3 text-sm">
								<span className="shrink-0 text-gray-500 dark:text-gray-400">ID</span>
								<span className="min-w-0 truncate font-mono text-xs text-gray-700 dark:text-gray-300">
									{user.discordId}
								</span>
							</div>
						</div>
					</Card>

					{/* Languages */}
					<Card padding="md">
						<p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
							Langues
						</p>
						<div className="flex flex-wrap gap-1.5">
							{user.languages.map((lang) => (
								<Tag key={lang} color="gray">
									{lang}
								</Tag>
							))}
						</div>
					</Card>

					{/* Division card with large icon */}
					<Card padding="md">
						<p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
							Division
						</p>
						<div className="flex items-center gap-4">
							<Image src={divisionIcon} alt={`Division ${user.division}`} width={48} height={48} />
							<div>
								<p className="text-xl font-black text-gray-900 dark:text-white">
									{DIVISION_LABELS[user.division] || "Recrue"}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Niveau {user.division} · {user.team}
								</p>
							</div>
						</div>
					</Card>

					{/* Socials */}
					{Object.values(user.social).some(Boolean) && (
						<Card padding="md">
							<p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
								Réseaux
							</p>
							<div className="space-y-2">
								{user.social.twitter && (
									<SocialRow
										label="Twitter"
										handle={`@${user.social.twitter}`}
										url={`https://twitter.com/${user.social.twitter}`}
									/>
								)}
								{user.social.twitch && (
									<SocialRow
										label="Twitch"
										handle={user.social.twitch}
										url={`https://twitch.tv/${user.social.twitch}`}
									/>
								)}
								{user.social.youtube && (
									<SocialRow
										label="YouTube"
										handle={user.social.youtube}
										url={`https://youtube.com/${user.social.youtube}`}
									/>
								)}
								{user.social.instagram && (
									<SocialRow
										label="Instagram"
										handle={`@${user.social.instagram}`}
										url={`https://instagram.com/${user.social.instagram}`}
									/>
								)}
							</div>
						</Card>
					)}
				</div>
			</div>

			{/* User archives — full width below the grid */}
			<UserArchives userId={user.id} />
		</div>
	);
}

// Social link row
function SocialRow({ label, handle, url }: { label: string; handle: string; url: string }) {
	return (
		<div className="flex items-center justify-between gap-2 text-sm">
			<span className="text-gray-500 dark:text-gray-400">{label}</span>
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary-600 dark:text-primary-400 flex items-center gap-1 font-medium transition-colors hover:underline"
			>
				{handle}
				<Icon name="link" size="xs" className="opacity-50" />
			</a>
		</div>
	);
}

// ── Access tab ───────────────────────────────────────────────────────────────
function AccesView({ user }: { user: UserProfile }) {
	const teamColor = TEAM_TEXT_COLORS[user.team] ?? "text-gray-500";

	return (
		<div className="space-y-5">
			{/* Team overview */}
			<Card padding="lg">
				<div className="mb-4 flex items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
						<Icon name="shield" size="md" className="text-primary-500" />
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white">Team globale</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Niveau d&apos;accès sur la plateforme
						</p>
					</div>
				</div>

				<div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
					<div className="flex items-center justify-between">
						<span className={cn("text-xl font-bold", teamColor)}>{user.team}</span>
						<Badge variant={roleVariant[user.team] || "neutral"} showDot={false}>
							{user.team}
						</Badge>
					</div>
					<p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{TEAM_DESCRIPTIONS[user.team]}</p>
				</div>
			</Card>

			{/* Per-entity access */}
			<Card padding="lg">
				<div className="mb-4 flex items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
						<Icon name="group" size="md" className="text-indigo-500" />
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white">Accès par entité</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Rôles et permissions dans chaque entité
						</p>
					</div>
				</div>

				<div className="space-y-3">
					{user.entityAccess.map((access) => (
						<div
							key={access.entityId}
							className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/40"
						>
							<div className="mb-3 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
										<Icon name="group" size="sm" className="text-gray-400" />
									</div>
									<div>
										<h4 className="text-sm font-semibold text-gray-900 dark:text-white">
											{access.entityName}
										</h4>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											Depuis {access.joinedAt}
										</p>
									</div>
								</div>
								<span
									className={cn(
										"text-sm font-semibold",
										TEAM_TEXT_COLORS[access.team] || "text-gray-500",
									)}
								>
									{access.team}
								</span>
							</div>

							<div className="flex flex-wrap gap-1.5">
								{access.permissions.map((perm) => (
									<span
										key={perm}
										className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
									>
										{perm}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}

// ── Infos tab ────────────────────────────────────────────────────────────────
function InfosView({ user }: { user: UserProfile }) {
	const [editingField, setEditingField] = useState<string | null>(null);
	const [userData, setUserData] = useState<UserProfile>(user);

	const handleEdit = (field: string) => {
		if (!canEdit()) {
			showInfo("Vous n'avez pas les permissions pour modifier ce profil.");
			return;
		}
		if (!canEditField(field)) {
			showInfo("Vous n'avez pas la permission de modifier ce champ.");
			return;
		}
		setEditingField(field);
	};

	const handleSave = (value: string) => {
		if (!editingField) return;
		setUserData((prev) => ({
			...prev,
			[editingField]: editingField === "division" ? parseInt(value) : value,
		}));
		showSuccess("Modification enregistrée");
		setEditingField(null);
	};

	const getEditConfig = (
		field: string,
	): { label: string; value: string; type: "text" | "select"; options?: { label: string; value: string }[] } => {
		switch (field) {
			case "division":
				return {
					label: "la division",
					value: String(userData.division),
					type: "select",
					options: [
						{ label: "Recrue (0)", value: "0" },
						{ label: "❱ (1)", value: "1" },
						{ label: "❱❱ (2)", value: "2" },
						{ label: "❱❱❱ (3)", value: "3" },
					],
				};
			case "team":
				return {
					label: "la team",
					value: userData.team,
					type: "select",
					options: [
						{ label: "Owner", value: "Owner" },
						{ label: "Executive", value: "Executive" },
						{ label: "Marsha Team", value: "Marsha Team" },
						{ label: "Legacy", value: "Legacy" },
						{ label: "Talent", value: "Talent" },
						{ label: "Momentum", value: "Momentum" },
						{ label: "Squad", value: "Squad" },
					],
				};
			case "firstName":
				return { label: "le prénom", value: userData.firstName, type: "text" };
			case "lastName":
				return { label: "le nom", value: userData.lastName, type: "text" };
			case "email":
				return { label: "l'email", value: userData.email, type: "text" };
			case "phone":
				return { label: "le téléphone", value: userData.phone, type: "text" };
			case "pseudo":
				return { label: "le pseudo", value: userData.pseudo, type: "text" };
			case "roleSecondary":
				return { label: "le rôle secondaire", value: userData.roleSecondary, type: "text" };
			case "discordUsername":
				return { label: "le pseudo Discord", value: userData.discordUsername, type: "text" };
			case "discordId":
				return { label: "l'ID Discord", value: userData.discordId, type: "text" };
			default:
				return { label: field, value: "", type: "text" };
		}
	};

	const divisionIcon = DIVISION_ICONS[userData.division];

	return (
		<div className="space-y-5">
			{!canEdit() && (
				<div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-900/20">
					<Icon name="lock" size="sm" className="text-amber-500" />
					<p className="text-sm text-amber-700 dark:text-amber-400">
						Vous n&apos;avez pas les permissions pour modifier ce profil.
					</p>
				</div>
			)}

			{/* Identité */}
			<Card padding="lg">
				<p className="mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
					Identité
				</p>
				<div className="divide-y divide-gray-100 dark:divide-gray-700/60">
					<InfoRow label="Pseudo" value={userData.pseudo} editable field="pseudo" onEdit={handleEdit} />
					<InfoRow label="Prénom" value={userData.firstName} editable field="firstName" onEdit={handleEdit} />
					<InfoRow label="Nom" value={userData.lastName} editable field="lastName" onEdit={handleEdit} />
					<InfoRow label="Email" value={userData.email} editable field="email" onEdit={handleEdit} />
					<InfoRow label="Téléphone" value={userData.phone} editable field="phone" onEdit={handleEdit} />
					<InfoRow label="Date de naissance" value={userData.birthdate} />
					<InfoRow
						label="Langues"
						value={
							<div className="flex flex-wrap justify-end gap-1.5">
								{userData.languages.map((lang) => (
									<Tag key={lang} color="gray">
										{lang}
									</Tag>
								))}
							</div>
						}
					/>
				</div>
			</Card>

			{/* Organisation */}
			<Card padding="lg">
				<p className="mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
					Organisation
				</p>
				<div className="divide-y divide-gray-100 dark:divide-gray-700/60">
					<InfoRow
						label="Team"
						value={
							<span className={cn("font-semibold", TEAM_TEXT_COLORS[userData.team as Team])}>
								{userData.team}
							</span>
						}
						editable
						field="team"
						onEdit={handleEdit}
					/>
					<InfoRow
						label="Rôle secondaire"
						value={userData.roleSecondary}
						editable
						field="roleSecondary"
						onEdit={handleEdit}
					/>
					<InfoRow label="Entité" value={userData.entity} editable field="entity" onEdit={handleEdit} />
					<InfoRow
						label="Division"
						value={
							<div className="flex items-center gap-2">
								<Image src={divisionIcon} alt="" width={20} height={20} />
								<span>{DIVISION_LABELS[userData.division]}</span>
							</div>
						}
						editable
						field="division"
						onEdit={handleEdit}
					/>
					<InfoRow label="Arrivée" value={userData.arrivalDate} />
				</div>
			</Card>

			{/* Discord */}
			<Card padding="lg">
				<p className="mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
					Discord
				</p>
				<div className="divide-y divide-gray-100 dark:divide-gray-700/60">
					<InfoRow
						label="Pseudo"
						value={userData.discordUsername}
						editable
						field="discordUsername"
						onEdit={handleEdit}
					/>
					<InfoRow
						label="ID"
						value={userData.discordId}
						mono
						editable
						field="discordId"
						onEdit={handleEdit}
					/>
				</div>
			</Card>

			{/* Réseaux sociaux */}
			{Object.values(userData.social).some(Boolean) && (
				<Card padding="lg">
					<p className="mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
						Réseaux sociaux
					</p>
					<div className="divide-y divide-gray-100 dark:divide-gray-700/60">
						{userData.social.twitter && (
							<div className="flex items-center justify-between py-3 text-sm">
								<span className="text-gray-500">Twitter / X</span>
								<a
									href={`https://twitter.com/${userData.social.twitter}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
								>
									@{userData.social.twitter}
								</a>
							</div>
						)}
						{userData.social.twitch && (
							<div className="flex items-center justify-between py-3 text-sm">
								<span className="text-gray-500">Twitch</span>
								<a
									href={`https://twitch.tv/${userData.social.twitch}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
								>
									{userData.social.twitch}
								</a>
							</div>
						)}
						{userData.social.youtube && (
							<div className="flex items-center justify-between py-3 text-sm">
								<span className="text-gray-500">YouTube</span>
								<a
									href={`https://youtube.com/${userData.social.youtube}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
								>
									{userData.social.youtube}
								</a>
							</div>
						)}
						{userData.social.instagram && (
							<div className="flex items-center justify-between py-3 text-sm">
								<span className="text-gray-500">Instagram</span>
								<a
									href={`https://instagram.com/${userData.social.instagram}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
								>
									@{userData.social.instagram}
								</a>
							</div>
						)}
					</div>
				</Card>
			)}

			{/* Edit modal */}
			{editingField &&
				(() => {
					const config = getEditConfig(editingField);
					return (
						<EditFieldModal
							field={editingField}
							label={config.label}
							currentValue={config.value}
							onClose={() => setEditingField(null)}
							onSave={handleSave}
							type={config.type}
							options={config.options}
						/>
					);
				})()}
		</div>
	);
}

// ── Activity tab ─────────────────────────────────────────────────────────────
function ActiviteView({ user }: { user: UserProfile }) {
	const activityItems = [
		{ id: "1", time: "Il y a 2h", text: "A terminé une tâche sur le projet Refonte" },
		{ id: "2", time: "Il y a 5h", text: "A commenté sur le Design system" },
		{ id: "3", time: "Hier", text: "A rejoint la réunion Sprint Planning" },
		{ id: "4", time: "Il y a 2j", text: "A créé un nouveau projet" },
		{ id: "5", time: "Il y a 3j", text: "A mis à jour son profil" },
	];

	return (
		<Card padding="lg">
			<div className="mb-5 flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
					<Icon name="clock" size="md" className="text-amber-500" />
				</div>
				<div>
					<h3 className="font-semibold text-gray-900 dark:text-white">Activité récente</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">Dernières actions de {user.pseudo}</p>
				</div>
			</div>

			<div className="space-y-1">
				{activityItems.map((item) => (
					<div
						key={item.id}
						className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
					>
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
							<Icon name="clock" size="xs" className="text-gray-400" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-sm text-gray-900 dark:text-white">{item.text}</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}
