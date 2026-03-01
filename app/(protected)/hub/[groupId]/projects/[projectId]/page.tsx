"use client";

// React
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Icon, Badge, Tag, Button, Timeline, Modal, ModalFooter } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showWarning, showInfo, showError } from "@/lib/utils/toast";
import type { IconName } from "@/core/design/icons";
import type { BadgeVariant } from "@/core/design/states";


// ─── Types ──────────────────────────────────────────────────────────────────────

type ProjectTab = "communication" | "contenu" | "squad" | "taches";

interface TabDef {
	id: ProjectTab;
	label: string;
	icon: IconName;
}

// ─── Constants ──────────────────────────────────────────────────────────────────

const TABS: TabDef[] = [
	{ id: "communication", label: "Communication", icon: "chat" },
	{ id: "contenu", label: "Contenu", icon: "document" },
	{ id: "squad", label: "Squad", icon: "users" },
	{ id: "taches", label: "Tâches", icon: "tasks" },
];

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const mockParticipants = [
	{ name: "Jeremy Alpha", role: "Owner", avatar: "/avatar/Alpha.jpeg", initials: "JA" },
	{ name: "Marie Delta", role: "Designer", initials: "MD" },
	{ name: "Lucas Foxtrot", role: "Développeur", initials: "LF" },
	{ name: "Sophie Mike", role: "Développeuse", initials: "SM" },
	{ name: "Thomas Upsilon", role: "QA", initials: "TU" },
	{ name: "Clara Novak", role: "Product Owner", initials: "CN" },
];

const participantRoleVariant: Record<string, BadgeVariant> = {
	Owner: "primary",
	Designer: "warning",
	Développeur: "info",
	Développeuse: "info",
	QA: "success",
	"Product Owner": "error",
};

const mockAnnouncements = [
	{
		id: "a1",
		author: "Jeremy Alpha",
		date: "25 Fév 2024 — 14:32",
		content:
			"La nouvelle maquette du header a été validée par le client. On passe en phase d'intégration dès lundi. Merci à Marie pour le travail sur les composants !",
	},
	{
		id: "a2",
		author: "Marie Delta",
		date: "23 Fév 2024 — 09:15",
		content:
			"J'ai poussé les fichiers Figma mis à jour dans le drive partagé. Les tokens de couleur et les espacements sont finalisés. Pensez à pull la dernière version du design system avant de commencer l'intégration.",
	},
	{
		id: "a3",
		author: "Lucas Foxtrot",
		date: "20 Fév 2024 — 17:48",
		content:
			"Le setup Next.js 14 est prêt avec le App Router, Tailwind CSS et les tests Vitest configurés. Le repo est accessible sur GitHub, branch `develop`. N'oubliez pas de créer vos branches feature à partir de develop.",
	},
];

const mockContentBoxes = [
	{
		id: "cb1",
		title: "Refonte de la navigation principale",
		description:
			"Repenser le menu de navigation pour une meilleure UX mobile-first. Inclure un mega-menu pour les catégories produits et un accès rapide aux favoris.",
		author: "Marie Delta",
		createdAt: "18 Fév 2024",
	},
	{
		id: "cb2",
		title: "Système de notifications en temps réel",
		description:
			"Mettre en place un système de notifications push via WebSockets. Les utilisateurs doivent pouvoir recevoir des alertes pour les mises à jour de tâches et les mentions.",
		author: "Lucas Foxtrot",
		createdAt: "20 Fév 2024",
	},
	{
		id: "cb3",
		title: "Onboarding flow interactif",
		description:
			"Créer un parcours d'onboarding guidé avec des tooltips et des overlays pour aider les nouveaux utilisateurs à découvrir les fonctionnalités clés du dashboard.",
		author: "Sophie Mike",
		createdAt: "22 Fév 2024",
	},
	{
		id: "cb4",
		title: "Mode sombre automatique",
		description:
			"Détecter les préférences système de l'utilisateur et basculer automatiquement entre thème clair et sombre. Inclure un toggle manuel dans les paramètres.",
		author: "Jeremy Alpha",
		createdAt: "24 Fév 2024",
	},
	{
		id: "cb5",
		title: "Dashboard analytics intégré",
		description:
			"Intégrer Plausible ou un outil similaire directement dans le back-office pour suivre les métriques d'utilisation en temps réel sans dépendance externe.",
		author: "Thomas Upsilon",
		createdAt: "25 Fév 2024",
	},
];

const mockTeams = [
	{ name: "Executive", memberCount: 3, color: "bg-purple-100 dark:bg-purple-900/20", iconColor: "text-purple-500" },
	{ name: "Legacy", memberCount: 5, color: "bg-indigo-100 dark:bg-indigo-900/20", iconColor: "text-indigo-500" },
	{ name: "Momentum", memberCount: 4, color: "bg-teal-100 dark:bg-teal-900/20", iconColor: "text-teal-500" },
];

const mockTasks = [
	{
		id: "t1",
		title: "Design system — Tokens couleurs",
		assignee: "Marie Delta",
		state: "Terminé" as const,
		affiliated: true,
	},
	{
		id: "t2",
		title: "Implémenter le header responsive",
		assignee: "Lucas Foxtrot",
		state: "Terminé" as const,
		affiliated: true,
	},
	{
		id: "t3",
		title: "Intégration page d'accueil",
		assignee: "Sophie Mike",
		state: "En cours" as const,
		affiliated: true,
	},
	{
		id: "t4",
		title: "Tests unitaires composants UI",
		assignee: "Thomas Upsilon",
		state: "En cours" as const,
		affiliated: true,
	},
	{
		id: "t5",
		title: "Optimiser les Core Web Vitals",
		assignee: "Jeremy Alpha",
		state: "À faire" as const,
		affiliated: true,
	},
];

const taskStateConfig: Record<string, { dot: string; variant: BadgeVariant }> = {
	"À faire": { dot: "bg-gray-400 dark:bg-gray-500", variant: "neutral" },
	"En cours": { dot: "bg-blue-500 dark:bg-blue-400", variant: "info" },
	Terminé: { dot: "bg-emerald-500 dark:bg-emerald-400", variant: "success" },
};

const mockTaskLogs = [
	{
		id: "tl1",
		icon: "plus" as const,
		title: (
			<>
				<span className="font-medium">Jeremy</span> a créé la tâche &ldquo;Optimiser les Core Web Vitals&rdquo;
			</>
		),
		time: "Il y a 1h",
	},
	{
		id: "tl2",
		icon: "check" as const,
		title: (
			<>
				<span className="font-medium">Lucas</span> a terminé &ldquo;Implémenter le header responsive&rdquo;
			</>
		),
		time: "Il y a 3h",
	},
	{
		id: "tl3",
		icon: "edit" as const,
		title: (
			<>
				<span className="font-medium">Thomas</span> a changé le statut de &ldquo;Tests unitaires composants
				UI&rdquo; en &ldquo;En cours&rdquo;
			</>
		),
		time: "Hier",
	},
];

const mockLogs = [
	{
		id: "l1",
		icon: "plus" as const,
		title: (
			<>
				<span className="font-medium">Jeremy Alpha</span> a créé le projet
			</>
		),
		time: "15 Jan 2024 — 09:00",
	},
	{
		id: "l2",
		icon: "users" as const,
		title: (
			<>
				<span className="font-medium">Jeremy Alpha</span> a ajouté Marie Delta au projet
			</>
		),
		time: "15 Jan 2024 — 09:05",
	},
	{
		id: "l3",
		icon: "users" as const,
		title: (
			<>
				<span className="font-medium">Jeremy Alpha</span> a ajouté Lucas Foxtrot et Sophie Mike
			</>
		),
		time: "16 Jan 2024 — 10:30",
	},
	{
		id: "l4",
		icon: "tasks" as const,
		title: (
			<>
				<span className="font-medium">Jeremy Alpha</span> a créé 5 tâches initiales
			</>
		),
		time: "17 Jan 2024 — 14:00",
	},
	{
		id: "l5",
		icon: "calendar" as const,
		title: (
			<>
				<span className="font-medium">Marie Delta</span> a planifié la réunion &ldquo;Kick-off technique&rdquo;
			</>
		),
		time: "18 Fév 2024 — 08:00",
	},
	{
		id: "l6",
		icon: "check" as const,
		title: (
			<>
				<span className="font-medium">Marie Delta</span> a terminé &ldquo;Design system — Tokens couleurs&rdquo;
			</>
		),
		time: "20 Fév 2024 — 16:45",
	},
	{
		id: "l7",
		icon: "edit" as const,
		title: (
			<>
				<span className="font-medium">Lucas Foxtrot</span> a publié une annonce dans Communication
			</>
		),
		time: "20 Fév 2024 — 17:48",
	},
	{
		id: "l8",
		icon: "star" as const,
		title: (
			<>
				<span className="font-medium">Sophie Mike</span> a proposé l&apos;idée &ldquo;Mode sombre
				automatique&rdquo;
			</>
		),
		time: "22 Fév 2024 — 11:20",
	},
	{
		id: "l9",
		icon: "flag" as const,
		title: (
			<>
				<span className="font-medium">Jeremy Alpha</span> a changé la priorité en &ldquo;Haute&rdquo;
			</>
		),
		time: "23 Fév 2024 — 09:00",
	},
	{
		id: "l10",
		icon: "chat" as const,
		title: (
			<>
				<span className="font-medium">Clara Novak</span> a rejoint le projet
			</>
		),
		time: "24 Fév 2024 — 10:15",
	},
];

const mockComments = [
	{
		id: "c1",
		author: "Marie Delta",
		initials: "MD",
		date: "25 Fév 2024 — 15:10",
		content:
			"Super avancement cette semaine ! Les maquettes sont prêtes pour validation finale. Je propose qu'on fasse un point rapide lundi matin pour s'aligner sur les priorités d'intégration.",
	},
	{
		id: "c2",
		author: "Lucas Foxtrot",
		initials: "LF",
		date: "25 Fév 2024 — 16:23",
		content:
			"D'accord pour le point lundi. J'ai quelques questions techniques sur l'architecture des composants partagés entre les pages. On pourrait en discuter à ce moment-là.",
	},
	{
		id: "c3",
		author: "Thomas Upsilon",
		initials: "TU",
		date: "26 Fév 2024 — 09:45",
		content:
			"Les tests unitaires des composants de base sont à 87% de couverture. Il manque encore les tests pour le formulaire de contact et le composant de pagination. Je devrais finir d'ici mercredi.",
	},
	{
		id: "c4",
		author: "Jeremy Alpha",
		initials: "JA",
		date: "26 Fév 2024 — 11:30",
		content:
			"Excellent travail à tous. N'oubliez pas de mettre à jour le board Kanban avec vos avancements. Le client a prévu un check-in jeudi prochain, on doit être prêts pour la démo.",
	},
];

// ─── Markdown Toolbar Buttons ───────────────────────────────────────────────────

const TOOLBAR_BUTTONS = [
	{ label: "B", title: "Gras", style: "font-bold" },
	{ label: "I", title: "Italique", style: "italic" },
	{ label: "S", title: "Barré", style: "line-through" },
	{ label: "</>", title: "Code", style: "" },
	{ label: "Link", title: "Lien", style: "" },
	{ label: "List", title: "Liste", style: "" },
	{ label: "Quote", title: "Citation", style: "" },
	{ label: "H1", title: "Titre 1", style: "font-bold text-[10px]" },
	{ label: "H2", title: "Titre 2", style: "font-bold text-[9px]" },
	{ label: "H3", title: "Titre 3", style: "font-semibold text-[9px]" },
];

// ─── Avatar Component ───────────────────────────────────────────────────────────

function Avatar({
	initials,
	src,
	size = "md",
	className,
}: {
	initials: string;
	src?: string;
	size?: "sm" | "md" | "lg";
	className?: string;
}) {
	const sizeClasses = {
		sm: "h-7 w-7 text-[10px]",
		md: "h-9 w-9 text-xs",
		lg: "h-11 w-11 text-sm",
	};

	if (src) {
		return (
			<img
				src={src}
				alt={initials}
				className={cn("shrink-0 rounded-full object-cover", sizeClasses[size], className)}
			/>
		);
	}

	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300",
				sizeClasses[size],
				className,
			)}
		>
			{initials}
		</div>
	);
}

// ─── Avatar Group ───────────────────────────────────────────────────────────────

function AvatarGroup({ members, max = 4 }: { members: typeof mockParticipants; max?: number }) {
	const displayed = members.slice(0, max);
	const remaining = members.length - max;

	return (
		<div className="flex items-center -space-x-2">
			{displayed.map((member) => (
				<div key={member.name} className="rounded-full ring-2 ring-white dark:ring-gray-900">
					<Avatar initials={member.initials} src={member.avatar} size="sm" />
				</div>
			))}
			{remaining > 0 && (
				<div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-white dark:ring-gray-900">
					+{remaining}
				</div>
			)}
		</div>
	);
}

// ─── Communication Tab ──────────────────────────────────────────────────────────

function CommunicationView() {
	const [message, setMessage] = useState("");

	return (
		<div className="space-y-6">
			{/* Compose area */}
			<Card padding="lg">
				<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Nouvelle annonce</h3>

				{/* Markdown toolbar */}
				<div className="mb-0 flex flex-wrap gap-0.5 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-2 py-1.5 dark:border-gray-700 dark:bg-gray-800/60">
					{TOOLBAR_BUTTONS.map((btn) => (
						<button
							key={btn.label}
							title={btn.title}
							onClick={() => showInfo(`Formatage "${btn.title}" bientôt disponible.`)}
							className={cn(
								"rounded px-2 py-1 text-xs font-medium transition-all duration-200",
								"text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700",
								btn.style,
							)}
						>
							{btn.label}
						</button>
					))}
				</div>

				{/* Textarea */}
				<textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Rédiger une annonce en Markdown pour le projet..."
					rows={5}
					className={cn(
						"w-full resize-none rounded-b-lg border border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200",
						"text-gray-900 placeholder-gray-400",
						"focus:border-primary-400 focus:ring-primary-100 focus:ring-2 focus:outline-none",
						"dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
						"dark:focus:border-primary-500 dark:focus:ring-primary-900/30",
					)}
				/>

				<div className="mt-3 flex justify-end">
					<Button
						size="sm"
						onClick={() => {
							if (message.trim()) {
								showSuccess("Annonce publiée avec succès.");
								setMessage("");
							} else {
								showWarning("Veuillez rédiger un message avant de publier.");
							}
						}}
					>
						<Icon name="edit" size="xs" />
						Publier
					</Button>
				</div>
			</Card>

			{/* Existing announcements */}
			<div className="space-y-4">
				<h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
					Annonces récentes
				</h3>
				{mockAnnouncements.map((ann) => (
					<Card key={ann.id} padding="lg">
						<div className="flex items-start gap-3">
							<Avatar
								initials={ann.author
									.split(" ")
									.map((n) => n[0])
									.join("")}
								size="md"
							/>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold text-gray-900 dark:text-white">
										{ann.author}
									</span>
									<span className="text-xs text-gray-400 dark:text-gray-500">{ann.date}</span>
								</div>
								<p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
									{ann.content}
								</p>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}

// ─── Contenu Tab ────────────────────────────────────────────────────────────────

function ContenuView() {
	const [showForm, setShowForm] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const [newDesc, setNewDesc] = useState("");

	const handleSubmit = () => {
		if (newTitle.trim() && newDesc.trim()) {
			showSuccess(`Contenu "${newTitle}" ajouté avec succès.`);
			setNewTitle("");
			setNewDesc("");
			setShowForm(false);
		} else {
			showWarning("Veuillez remplir le titre et la description.");
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
					Boîtes de contenu
				</h3>
				<Button size="sm" variant={showForm ? "cancel" : "primary"} onClick={() => setShowForm(!showForm)}>
					<Icon name={showForm ? "close" : "plus"} size="xs" />
					{showForm ? "Annuler" : "Ajouter un contenu"}
				</Button>
			</div>

			{/* Inline form */}
			{showForm && (
				<Card padding="lg" className="border-primary-300 dark:border-primary-700 border-2 border-dashed">
					<div className="space-y-3">
						<input
							type="text"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							placeholder="Titre du contenu"
							className={cn(
								"w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all duration-200",
								"text-gray-900 placeholder-gray-400",
								"focus:border-primary-400 focus:ring-primary-100 focus:ring-2 focus:outline-none",
								"dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
								"dark:focus:border-primary-500 dark:focus:ring-primary-900/30",
							)}
						/>
						<textarea
							value={newDesc}
							onChange={(e) => setNewDesc(e.target.value)}
							placeholder="Décrivez le contenu..."
							rows={3}
							className={cn(
								"w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all duration-200",
								"text-gray-900 placeholder-gray-400",
								"focus:border-primary-400 focus:ring-primary-100 focus:ring-2 focus:outline-none",
								"dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
								"dark:focus:border-primary-500 dark:focus:ring-primary-900/30",
							)}
						/>
						<div className="flex justify-end">
							<Button size="sm" onClick={handleSubmit}>
								<Icon name="check" size="xs" />
								Ajouter
							</Button>
						</div>
					</div>
				</Card>
			)}

			{/* Content grid */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{mockContentBoxes.map((box) => (
					<Card key={box.id} padding="lg" hover>
						<div className="flex flex-col gap-3">
							<div className="flex items-start justify-between gap-2">
								<h4 className="text-sm font-semibold text-gray-900 dark:text-white">{box.title}</h4>
								<button
									onClick={() => showInfo("Options du contenu bientôt disponibles.")}
									className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
								>
									<Icon name="more" size="sm" />
								</button>
							</div>
							<p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
								{box.description}
							</p>
							<div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
								<div className="flex items-center gap-2">
									<Avatar
										initials={box.author
											.split(" ")
											.map((n) => n[0])
											.join("")}
										size="sm"
									/>
									<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
										{box.author}
									</span>
								</div>
								<span className="text-xs text-gray-400 dark:text-gray-500">{box.createdAt}</span>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}

// ─── Squad Tab ──────────────────────────────────────────────────────────────────

function SquadView() {
	return (
		<div className="space-y-8">
			{/* Header with add button */}
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
					Membres du projet
				</h3>
				<Button size="sm" onClick={() => showInfo("Ajout de participant bientôt disponible.")}>
					<Icon name="plus" size="xs" />
					Ajouter un participant
				</Button>
			</div>

			{/* Teams section */}
			<div>
				<div className="mb-4 flex items-center gap-2">
					<Icon name="users" size="sm" className="text-gray-500 dark:text-gray-400" />
					<h4 className="text-base font-semibold text-gray-900 dark:text-white">Teams</h4>
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{mockTeams.map((team) => (
						<Card key={team.name} padding="md" hover>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div
										className={cn(
											"flex h-10 w-10 items-center justify-center rounded-xl",
											team.color,
										)}
									>
										<Icon name="users" size="sm" className={team.iconColor} />
									</div>
									<div>
										<p className="text-sm font-semibold text-gray-900 dark:text-white">
											{team.name}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{team.memberCount} membres
										</p>
									</div>
								</div>
								<Icon name="chevronRight" size="sm" className="text-gray-400 dark:text-gray-500" />
							</div>
						</Card>
					))}
				</div>
			</div>

			{/* Individual members */}
			<div>
				<div className="mb-4 flex items-center gap-2">
					<Icon name="profile" size="sm" className="text-gray-500 dark:text-gray-400" />
					<h4 className="text-base font-semibold text-gray-900 dark:text-white">Individuels</h4>
				</div>
				<div className="space-y-2">
					{mockParticipants.map((user) => (
						<Card key={user.name} padding="md">
							<div className="flex items-center gap-4">
								<Avatar initials={user.initials} src={user.avatar} size="md" />
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
								</div>
								<Badge variant={participantRoleVariant[user.role] || "neutral"} showDot={false}>
									{user.role}
								</Badge>
							</div>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}

// ─── Tâches Tab ─────────────────────────────────────────────────────────────────

function TachesView() {
	const [affiliations, setAffiliations] = useState<Record<string, boolean>>(
		Object.fromEntries(mockTasks.map((t) => [t.id, t.affiliated])),
	);

	const toggleAffiliation = (taskId: string, taskTitle: string) => {
		const current = affiliations[taskId];
		setAffiliations((prev) => ({ ...prev, [taskId]: !current }));
		if (current) {
			showWarning(`Tâche "${taskTitle}" retirée du projet.`);
		} else {
			showSuccess(`Tâche "${taskTitle}" affiliée au projet.`);
		}
	};

	return (
		<div className="space-y-8">
			{/* Action buttons */}
			<div className="flex flex-wrap items-center gap-3">
				<Button size="sm" onClick={() => showInfo("Création de tâche bientôt disponible.")}>
					<Icon name="plus" size="xs" />
					Créer une tâche
				</Button>
				<Button
					size="sm"
					variant="outline-primary"
					onClick={() => showInfo("Liaison de tâche bientôt disponible.")}
				>
					<Icon name="link" size="xs" />
					Relier une tâche
				</Button>
			</div>

			{/* Task timeline */}
			<div className="space-y-0">
				{mockTasks.map((task, idx) => {
					const config = taskStateConfig[task.state];
					const isAffiliated = affiliations[task.id];

					return (
						<div key={task.id} className="relative flex gap-4 pb-8 last:pb-0">
							{/* Vertical connector line */}
							{idx < mockTasks.length - 1 && (
								<div className="absolute top-8 bottom-0 left-[11px] w-px bg-gray-200 dark:bg-gray-700" />
							)}

							{/* State dot */}
							<div className="relative z-10 mt-1.5 flex shrink-0">
								<div
									className={cn(
										"h-6 w-6 rounded-full border-4 border-white transition-all duration-200 dark:border-gray-900",
										config.dot,
									)}
								/>
							</div>

							{/* Task card */}
							<Card padding="md" className="flex-1">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div className="min-w-0 flex-1">
										<p
											className={cn(
												"text-sm font-medium transition-all duration-200",
												task.state === "Terminé"
													? "text-gray-400 line-through dark:text-gray-500"
													: "text-gray-900 dark:text-white",
											)}
										>
											{task.title}
										</p>
										<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
											Assigné à {task.assignee}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant={config.variant}>{task.state}</Badge>
										<button
											onClick={() => toggleAffiliation(task.id, task.title)}
											className={cn(
												"rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200",
												isAffiliated
													? "bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30"
													: "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600",
											)}
										>
											{isAffiliated ? "Affiliée" : "Non affiliée"}
										</button>
									</div>
								</div>
							</Card>
						</div>
					);
				})}
			</div>

			{/* Task logs timeline */}
			<Card padding="lg">
				<div className="mb-4 flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
						<Icon name="clock" size="sm" className="text-gray-500 dark:text-gray-400" />
					</div>
					<h3 className="text-base font-semibold text-gray-900 dark:text-white">Historique des tâches</h3>
				</div>
				<Timeline items={mockTaskLogs} />
			</Card>
		</div>
	);
}

// ─── Logs Panel ─────────────────────────────────────────────────────────────────

function LogsPanel({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
	return (
		<div
			className={cn(
				"shrink-0 transition-all duration-300 ease-in-out",
				isOpen ? "w-full xl:w-[340px]" : "w-0 overflow-hidden xl:w-0",
			)}
		>
			{isOpen && (
				<Card padding="lg" className="sticky top-6 h-fit">
					<div className="mb-5 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/20">
								<Icon name="clock" size="sm" className="text-amber-500" />
							</div>
							<div>
								<h3 className="text-sm font-semibold text-gray-900 dark:text-white">
									Journal du projet
								</h3>
								<p className="text-xs text-gray-500 dark:text-gray-400">Historique chronologique</p>
							</div>
						</div>
						<button
							onClick={onToggle}
							className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
						>
							<Icon name="close" size="sm" />
						</button>
					</div>

					{/* Access notice */}
					<div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-900/20">
						<Icon name="shield" size="xs" className="shrink-0 text-amber-500" />
						<p className="text-[11px] text-amber-700 dark:text-amber-400">
							Visible par les membres Legacy et au-dessus.
						</p>
					</div>

					<div className="max-h-[60vh] overflow-y-auto pr-1">
						<Timeline items={mockLogs} />
					</div>
				</Card>
			)}
		</div>
	);
}

// ─── Comments Section ───────────────────────────────────────────────────────────

function CommentsSection() {
	const [newComment, setNewComment] = useState("");

	const handleSubmit = () => {
		if (newComment.trim()) {
			showSuccess("Commentaire publié avec succès.");
			setNewComment("");
		} else {
			showWarning("Veuillez écrire un commentaire avant de publier.");
		}
	};

	return (
		<div className="space-y-5">
			<div className="flex items-center gap-3">
				<Icon name="chat" size="md" className="text-gray-500 dark:text-gray-400" />
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Commentaires</h2>
				<span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
					{mockComments.length}
				</span>
			</div>

			{/* Comment input */}
			<Card padding="md">
				<div className="flex gap-3">
					<Avatar initials="JA" src="/avatar/Alpha.jpeg" size="md" />
					<div className="min-w-0 flex-1">
						<textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Écrire un commentaire..."
							rows={3}
							className={cn(
								"w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all duration-200",
								"text-gray-900 placeholder-gray-400",
								"focus:border-primary-400 focus:ring-primary-100 focus:ring-2 focus:outline-none",
								"dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
								"dark:focus:border-primary-500 dark:focus:ring-primary-900/30",
							)}
						/>
						<div className="mt-2 flex items-center justify-between">
							<div className="flex gap-1">
								<button
									onClick={() => showInfo("Pièce jointe bientôt disponible.")}
									className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
								>
									<Icon name="attach" size="sm" />
								</button>
								<button
									onClick={() => showInfo("Mention bientôt disponible.")}
									className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
								>
									<Icon name="sparkles" size="sm" />
								</button>
							</div>
							<Button size="sm" onClick={handleSubmit}>
								<Icon name="chat" size="xs" />
								Commenter
							</Button>
						</div>
					</div>
				</div>
			</Card>

			{/* Comments list */}
			<div className="space-y-3">
				{mockComments.map((comment) => (
					<Card key={comment.id} padding="md">
						<div className="flex gap-3">
							<Avatar initials={comment.initials} size="md" />
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold text-gray-900 dark:text-white">
										{comment.author}
									</span>
									<span className="text-xs text-gray-400 dark:text-gray-500">{comment.date}</span>
								</div>
								<p className="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
									{comment.content}
								</p>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}

// ─── Metadata Row Helper ────────────────────────────────────────────────────────

function MetaRow({ icon, label, children }: { icon: IconName; label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-3 py-2">
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
				<Icon name={icon} size="sm" className="text-gray-500 dark:text-gray-400" />
			</div>
			<span className="w-32 shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	);
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

/**
 * Project detail page with rich header, tabbed content, logs panel and comments section.
 * @returns The fully featured project detail page
 */
export default function ProjectDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<ProjectTab>("communication");
	const [showLogs, setShowLogs] = useState(true);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const project = {
		id: params.projectId as string,
		name: "Refonte Site Web",
		description:
			"Refonte complète du site corporate avec nouveau design system, migration vers Next.js 14 et optimisation des performances. Le projet inclut la refonte de l'identité visuelle, la mise en place d'un design system modulaire et l'amélioration de l'accessibilité.",
		status: "En cours",
		priority: "Haute",
		startDate: "15 Jan 2024",
		deadline: "30 Avr 2024",
		daysRemaining: 64,
		owner: "Jeremy Alpha",
		entity: "Legacy",
	};

	return (
		<PageContainer>
			{/* ── Project Header Card ──────────────────────────────────── */}
			<Card padding="lg" className="mb-6">
				<div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
					{/* Left: Title + Description */}
					<div className="min-w-0 flex-1">
						<div className="flex flex-wrap items-center gap-3">
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
							<Badge variant="info">{project.status}</Badge>
						</div>
						<p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
							{project.description}
						</p>

						{/* Metadata grid */}
						<div className="mt-5 divide-y divide-gray-100 dark:divide-gray-800">
							<MetaRow icon="profile" label="Responsable">
								<div className="flex items-center gap-2">
									<Avatar initials="JA" src="/avatar/Alpha.jpeg" size="sm" />
									<span className="text-sm font-medium text-gray-900 dark:text-white">
										{project.owner}
									</span>
								</div>
							</MetaRow>

							<MetaRow icon="users" label="Participants">
								<div className="flex items-center gap-3">
									<AvatarGroup members={mockParticipants} max={5} />
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{mockParticipants.length} membres
									</span>
								</div>
							</MetaRow>

							<MetaRow icon="calendar" label="Deadline">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-gray-900 dark:text-white">
										{project.deadline}
									</span>
									<Tag color="warning">{project.daysRemaining} jours restants</Tag>
								</div>
							</MetaRow>

							<MetaRow icon="flag" label="Priorité">
								<Badge variant="error">{project.priority}</Badge>
							</MetaRow>

							<MetaRow icon="sparkles" label="État du projet">
								<Badge variant="info">{project.status}</Badge>
							</MetaRow>

							<MetaRow icon="folder" label="Entité concernée">
								<Tag color="primary">{project.entity}</Tag>
							</MetaRow>
						</div>
					</div>

					{/* Right: Quick stats + Actions */}
					<div className="flex shrink-0 flex-col gap-4 lg:w-56">
						{/* Quick stats */}
						<div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
							<div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
								<p className="text-xs text-gray-500 dark:text-gray-400">Tâches terminées</p>
								<p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
									2<span className="text-sm font-normal text-gray-400">/{mockTasks.length}</span>
								</p>
							</div>
							<div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
								<p className="text-xs text-gray-500 dark:text-gray-400">Annonces</p>
								<p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
									{mockAnnouncements.length}
								</p>
							</div>
							<div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
								<p className="text-xs text-gray-500 dark:text-gray-400">Contenus</p>
								<p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
									{mockContentBoxes.length}
								</p>
							</div>
							<div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
								<p className="text-xs text-gray-500 dark:text-gray-400">Début</p>
								<p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
									{project.startDate}
								</p>
							</div>
						</div>

						{/* Danger zone */}
						<div className="mt-auto pt-2">
							<Button
								variant="outline-danger"
								size="sm"
								className="w-full"
								onClick={() => setShowDeleteModal(true)}
							>
								<Icon name="delete" size="xs" />
								Supprimer le projet
							</Button>
						</div>
					</div>
				</div>
			</Card>

			{/* ── Tab Navigation ───────────────────────────────────────── */}
			<div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
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
									"transition-all duration-200",
									activeTab === tab.id ? "text-primary-500" : "text-gray-400 dark:text-gray-500",
								)}
							/>
							{tab.label}
						</button>
					))}
				</nav>

				{/* Logs toggle button */}
				<button
					onClick={() => setShowLogs(!showLogs)}
					className={cn(
						"mb-1 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
						showLogs
							? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
					)}
				>
					<Icon name="clock" size="xs" />
					Logs
				</button>
			</div>

			{/* ── Main Content Area (tab content + logs panel) ─────────── */}
			<div className="flex flex-col gap-6 xl:flex-row">
				{/* Tab content */}
				<div className="min-w-0 flex-1">
					{activeTab === "communication" && <CommunicationView />}
					{activeTab === "contenu" && <ContenuView />}
					{activeTab === "squad" && <SquadView />}
					{activeTab === "taches" && <TachesView />}
				</div>

				{/* Logs panel (right side, collapsible) */}
				<LogsPanel isOpen={showLogs} onToggle={() => setShowLogs(false)} />
			</div>

			{/* ── Comments Section ─────────────────────────────────────── */}
			<div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-700">
				<CommentsSection />
			</div>

			{/* ── Delete Confirmation Modal ─────────────────────────────── */}
			<Modal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				title="Supprimer le projet"
				description="Cette action est irréversible. Toutes les données associées seront définitivement supprimées."
				size="sm"
			>
				<div className="space-y-4">
					<div className="border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-900/20 flex items-center gap-3 rounded-lg border px-4 py-3">
						<Icon name="shield" size="sm" className="text-error-500 shrink-0" />
						<div>
							<p className="text-error-700 dark:text-error-400 text-sm font-medium">
								Vous êtes sur le point de supprimer &ldquo;{project.name}&rdquo;
							</p>
							<p className="text-error-600 dark:text-error-400/80 mt-0.5 text-xs">
								{mockTasks.length} tâches, {mockAnnouncements.length} annonces et{" "}
								{mockParticipants.length} participants seront affectés.
							</p>
						</div>
					</div>
				</div>

				<ModalFooter>
					<Button variant="cancel" size="sm" onClick={() => setShowDeleteModal(false)}>
						Annuler
					</Button>
					<Button
						variant="outline-danger"
						size="sm"
						onClick={() => {
							setShowDeleteModal(false);
							showError("Suppression du projet non disponible pour le moment.");
						}}
					>
						<Icon name="delete" size="xs" />
						Confirmer la suppression
					</Button>
				</ModalFooter>
			</Modal>
		</PageContainer>
	);
}
