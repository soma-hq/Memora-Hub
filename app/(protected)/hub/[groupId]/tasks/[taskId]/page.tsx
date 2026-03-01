"use client";

// React
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Icon, Badge, Button, Timeline, Modal, ModalFooter } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showWarning, showInfo } from "@/lib/utils/toast";
import type { IconName } from "@/core/design/icons";
import type { BadgeVariant } from "@/core/design/states";


// ─── Mock data ──────────────────────────────────────────────────────────────

const mockTask = {
	id: "t-export-pdf",
	title: "Implémenter l'export PDF",
	status: "in_progress" as const,
	priority: "haute" as const,
	description:
		"Implémenter le système d'export PDF avec les données filtrées par utilisateur et groupe. Supporter les formats A4 et lettre.",
	assignee: "Lucas Foxtrot",
	deadline: "15 Mars 2026",
	daysRemaining: 16,
	project: { name: "Refonte Site Web", id: "p1" },
	createdBy: "Jeremy Alpha",
	createdAt: "10 Fév 2026",
};

const STATUS_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
	todo: { label: "À faire", variant: "neutral" },
	in_progress: { label: "En cours", variant: "info" },
	in_review: { label: "En revue", variant: "warning" },
	done: { label: "Terminé", variant: "success" },
};

const PRIORITY_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
	haute: { label: "Haute", variant: "error" },
	moyenne: { label: "Moyenne", variant: "warning" },
	basse: { label: "Basse", variant: "info" },
};

const mockTimelineItems = [
	{
		id: "log-1",
		icon: "plus" as IconName,
		title: (
			<>
				<span className="font-medium">Jeremy Alpha</span> a créé la tâche
			</>
		),
		time: "10 Fév 2026 — 09:00",
	},
	{
		id: "log-2",
		icon: "users" as IconName,
		title: (
			<>
				<span className="font-medium">Jeremy Alpha</span> a assigné{" "}
				<span className="font-medium">Lucas Foxtrot</span>
			</>
		),
		time: "10 Fév 2026 — 09:05",
	},
	{
		id: "log-3",
		icon: "edit" as IconName,
		title: (
			<>
				<span className="font-medium">Lucas Foxtrot</span> a changé le statut en &ldquo;En cours&rdquo;
			</>
		),
		time: "12 Fév 2026 — 14:30",
	},
	{
		id: "log-4",
		icon: "document" as IconName,
		title: (
			<>
				<span className="font-medium">Lucas Foxtrot</span> a ajouté une description
			</>
		),
		time: "12 Fév 2026 — 14:35",
	},
	{
		id: "log-5",
		icon: "flag" as IconName,
		title: (
			<>
				<span className="font-medium">Jeremy Alpha</span> a changé la priorité en &ldquo;Haute&rdquo;
			</>
		),
		time: "15 Fév 2026 — 10:00",
	},
];

interface Comment {
	id: string;
	author: string;
	content: string;
	time: string;
}

const mockComments: Comment[] = [
	{
		id: "c1",
		author: "Jeremy Alpha",
		content: "On doit absolument finir ça avant la demo de vendredi.",
		time: "Il y a 2h",
	},
	{
		id: "c2",
		author: "Lucas Foxtrot",
		content: "C'est en bonne voie, j'ai terminé la partie filtrage. Reste le formatage PDF.",
		time: "Il y a 1h",
	},
	{
		id: "c3",
		author: "Marie Delta",
		content: "Je peux aider sur la partie design du PDF si besoin.",
		time: "Il y a 30min",
	},
];

// ─── Helper ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("");
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Task detail page showing metadata, logs, and comments for a single task.
 * @returns The task detail page
 */
export default function TaskDetailPage() {
	const params = useParams();
	const router = useRouter();
	const groupId = params.groupId as string;
	const _taskId = params.taskId as string;

	// State
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState<Comment[]>(mockComments);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	// Derived
	const statusConfig = STATUS_CONFIG[mockTask.status];
	const priorityConfig = PRIORITY_CONFIG[mockTask.priority];

	// Handlers
	function handleAddComment() {
		if (!newComment.trim()) {
			showWarning("Veuillez écrire un commentaire avant de publier.");
			return;
		}

		const comment: Comment = {
			id: `c-${Date.now()}`,
			author: "Jeremy Alpha",
			content: newComment.trim(),
			time: "À l'instant",
		};

		setComments((prev) => [...prev, comment]);
		setNewComment("");
		showSuccess("Commentaire ajouté.");
	}

	function handleDelete() {
		setDeleteModalOpen(false);
		showSuccess("Tâche supprimée avec succès.");
		router.push(`/hub/${groupId}/tasks`);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleAddComment();
		}
	}

	// ─── Render ───────────────────────────────────────────────────────────

	return (
		<PageContainer>
			{/* ── Task Header ──────────────────────────────────────────── */}
			<div className="mb-8">
				{/* Back button */}
				<button
					onClick={() => router.push(`/hub/${groupId}/tasks`)}
					className={cn(
						"mb-4 flex items-center gap-2 text-sm font-medium transition-all duration-200",
						"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
					)}
				>
					<Icon name="back" size="sm" />
					Retour aux tâches
				</button>

				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<div className="flex flex-wrap items-center gap-3">
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">{mockTask.title}</h1>
							<Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
							<Badge variant={priorityConfig.variant}>{priorityConfig.label}</Badge>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline-primary"
							size="sm"
							onClick={() => showInfo("Modification de la tâche bientôt disponible.")}
						>
							<Icon name="edit" size="xs" />
							Modifier
						</Button>
						<Button variant="outline-danger" size="sm" onClick={() => setDeleteModalOpen(true)}>
							<Icon name="delete" size="xs" />
							Supprimer
						</Button>
					</div>
				</div>
			</div>

			{/* ── Metadata Section ─────────────────────────────────────── */}
			<Card padding="lg" className="mb-8">
				<div className="mb-4 flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
						<Icon name="document" size="sm" className="text-gray-500 dark:text-gray-400" />
					</div>
					<h2 className="text-base font-semibold text-gray-900 dark:text-white">Détails de la tâche</h2>
				</div>

				{/* Description */}
				<div className="mb-6">
					<p className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
						Description
					</p>
					<p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{mockTask.description}</p>
				</div>

				{/* Metadata grid */}
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					{/* Responsable */}
					<div>
						<p className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Responsable
						</p>
						<div className="flex items-center gap-2.5">
							<div className="bg-primary-100 dark:bg-primary-900/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
								<span className="text-primary-600 dark:text-primary-400 text-xs font-bold">
									{getInitials(mockTask.assignee)}
								</span>
							</div>
							<span className="text-sm font-medium text-gray-900 dark:text-white">
								{mockTask.assignee}
							</span>
						</div>
					</div>

					{/* Deadline */}
					<div>
						<p className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Deadline
						</p>
						<div className="flex items-center gap-2.5">
							<Icon name="calendar" size="sm" className="text-gray-400 dark:text-gray-500" />
							<span className="text-sm font-medium text-gray-900 dark:text-white">
								{mockTask.deadline}
							</span>
							<Badge variant="warning" showDot={false} className="text-[11px]">
								{mockTask.daysRemaining}j restants
							</Badge>
						</div>
					</div>

					{/* État */}
					<div>
						<p className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							État
						</p>
						<Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
					</div>

					{/* Priorité */}
					<div>
						<p className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Priorité
						</p>
						<Badge variant={priorityConfig.variant}>{priorityConfig.label}</Badge>
					</div>

					{/* Affilié à un projet */}
					<div>
						<p className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Affilié à un projet
						</p>
						{mockTask.project ? (
							<button
								onClick={() => router.push(`/hub/${groupId}/projects/${mockTask.project.id}`)}
								className={cn(
									"flex items-center gap-2 text-sm font-medium transition-all duration-200",
									"text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300",
								)}
							>
								<Icon name="link" size="sm" />
								{mockTask.project.name}
							</button>
						) : (
							<span className="text-sm text-gray-400 dark:text-gray-500">Aucun projet</span>
						)}
					</div>

					{/* Créé par */}
					<div>
						<p className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Créé par
						</p>
						<div className="flex items-center gap-2.5">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
								<span className="text-xs font-bold text-gray-600 dark:text-gray-300">
									{getInitials(mockTask.createdBy)}
								</span>
							</div>
							<span className="text-sm font-medium text-gray-900 dark:text-white">
								{mockTask.createdBy}
							</span>
						</div>
					</div>

					{/* Créé le */}
					<div className="sm:col-span-2">
						<p className="mb-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Créé le
						</p>
						<div className="flex items-center gap-2.5">
							<Icon name="clock" size="sm" className="text-gray-400 dark:text-gray-500" />
							<span className="text-sm text-gray-700 dark:text-gray-300">{mockTask.createdAt}</span>
						</div>
					</div>
				</div>
			</Card>

			{/* ── Logs Section ─────────────────────────────────────────── */}
			<Card padding="lg" className="mb-8">
				<div className="mb-5 flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
						<Icon name="clock" size="sm" className="text-amber-500" />
					</div>
					<div>
						<h2 className="text-base font-semibold text-gray-900 dark:text-white">
							Historique d&apos;activité
						</h2>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Chronologie des actions sur cette tâche
						</p>
					</div>
				</div>
				<Timeline items={mockTimelineItems} />
			</Card>

			{/* ── Comments Section ─────────────────────────────────────── */}
			<Card padding="lg">
				<div className="mb-5 flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
						<Icon name="chat" size="sm" className="text-primary-500" />
					</div>
					<div>
						<h2 className="text-base font-semibold text-gray-900 dark:text-white">Commentaires</h2>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{comments.length} commentaire{comments.length > 1 ? "s" : ""}
						</p>
					</div>
				</div>

				{/* Comment list */}
				<div className="space-y-4">
					{comments.map((comment) => (
						<div
							key={comment.id}
							className={cn(
								"flex items-start gap-3 rounded-lg p-3 transition-all duration-200",
								"bg-gray-50 dark:bg-gray-800/50",
							)}
						>
							{/* Avatar */}
							<div className="bg-primary-100 dark:bg-primary-900/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
								<span className="text-primary-600 dark:text-primary-400 text-xs font-bold">
									{getInitials(comment.author)}
								</span>
							</div>

							{/* Content */}
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold text-gray-900 dark:text-white">
										{comment.author}
									</span>
									<span className="text-xs text-gray-400 dark:text-gray-500">{comment.time}</span>
								</div>
								<p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
									{comment.content}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* New comment input */}
				<div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700">
					<div className="flex items-start gap-3">
						{/* Current user avatar */}
						<div className="bg-primary-100 dark:bg-primary-900/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
							<span className="text-primary-600 dark:text-primary-400 text-xs font-bold">JA</span>
						</div>

						<div className="min-w-0 flex-1">
							<textarea
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Ajouter un commentaire..."
								rows={3}
								className={cn(
									"w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200",
									"text-gray-900 placeholder-gray-400",
									"focus:border-primary-400 focus:ring-primary-100 focus:ring-2 focus:outline-none",
									"dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
									"dark:focus:border-primary-500 dark:focus:ring-primary-900/30",
								)}
							/>
							<div className="mt-2 flex items-center justify-between">
								<p className="text-[11px] text-gray-400 dark:text-gray-500">
									Entrée pour envoyer &middot; Maj+Entrée pour un retour à la ligne
								</p>
								<Button size="sm" onClick={handleAddComment}>
									<Icon name="chat" size="xs" />
									Commenter
								</Button>
							</div>
						</div>
					</div>
				</div>
			</Card>

			{/* ── Delete Confirmation Modal ─────────────────────────────── */}
			<Modal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				title="Supprimer la tâche"
				description="Cette action est irréversible. La tâche et tous ses commentaires seront définitivement supprimés."
				size="sm"
			>
				<div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-900/20">
					<Icon name="delete" size="sm" className="shrink-0 text-red-500" />
					<p className="text-sm text-red-700 dark:text-red-400">
						Vous êtes sur le point de supprimer &ldquo;{mockTask.title}&rdquo;.
					</p>
				</div>

				<ModalFooter>
					<Button variant="cancel" size="sm" onClick={() => setDeleteModalOpen(false)}>
						Annuler
					</Button>
					<Button variant="outline-danger" size="sm" onClick={handleDelete}>
						<Icon name="delete" size="xs" />
						Supprimer définitivement
					</Button>
				</ModalFooter>
			</Modal>
		</PageContainer>
	);
}
