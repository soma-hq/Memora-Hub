"use client";

// Components
import { Modal, ModalFooter, Button, Badge, Icon, Avatar, Tag, Divider, ProgressBar, Timeline } from "@/components/ui";
import type { BadgeVariant } from "@/core/design/states";


interface TaskData {
	id: string;
	title: string;
	description?: string;
	project: string;
	assignee: string;
	assigneeAvatar?: string;
	status: string;
	priority: string;
	dueDate: string;
	tags?: string[];
	subtasks?: { id: string; title: string; done: boolean }[];
}

interface TaskDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: TaskData | null;
}

const statusVariant: Record<string, BadgeVariant> = {
	"A faire": "neutral",
	"En cours": "info",
	"En revision": "warning",
	Termine: "success",
};

const priorityVariant: Record<string, BadgeVariant> = {
	Haute: "error",
	Moyenne: "warning",
	Basse: "neutral",
};

const mockActivity = [
	{
		id: "1",
		icon: "edit" as const,
		title: (
			<>
				<span className="font-medium">Jeremy</span> a modifie la description
			</>
		),
		time: "Il y a 2h",
	},
	{
		id: "2",
		icon: "check" as const,
		title: (
			<>
				<span className="font-medium">Marie</span> a termine la sous-tache &ldquo;Maquettes&rdquo;
			</>
		),
		time: "Il y a 5h",
	},
	{
		id: "3",
		icon: "profile" as const,
		title: (
			<>
				Assignee a <span className="font-medium">Marie Delta</span>
			</>
		),
		time: "Hier",
	},
	{
		id: "4",
		icon: "plus" as const,
		title: (
			<>
				Tache creee par <span className="font-medium">Jeremy Alpha</span>
			</>
		),
		time: "Il y a 3j",
	},
];

/**
 * Detail modal for a task with status, subtasks, and activity timeline.
 * @param {TaskDetailModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Callback to close the modal
 * @param {TaskData | null} props.task - Task data to display
 * @returns {JSX.Element | null} Task detail modal or null when no task
 */
export function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
	if (!task) return null;

	// Computed
	const subtasks = task.subtasks || [
		{ id: "1", title: "Creer les maquettes", done: true },
		{ id: "2", title: "Developper le front", done: false },
		{ id: "3", title: "Tests unitaires", done: false },
	];

	const subtaskProgress = Math.round((subtasks.filter((s) => s.done).length / subtasks.length) * 100);

	// Render
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={task.title} size="lg">
			<div className="space-y-6">
				{/* Status row */}
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant={statusVariant[task.status] || "neutral"}>{task.status}</Badge>
					<Badge variant={priorityVariant[task.priority] || "neutral"} showDot={false}>
						Priorite: {task.priority}
					</Badge>
					{task.tags?.map((tag) => (
						<Tag key={tag} color="primary">
							{tag}
						</Tag>
					))}
				</div>

				{/* Meta info */}
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="flex items-center gap-3">
						<Icon name="folder" size="sm" className="text-gray-400" />
						<div>
							<p className="text-xs text-gray-400">Projet</p>
							<p className="font-medium text-gray-700 dark:text-gray-300">{task.project}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Avatar src={task.assigneeAvatar} name={task.assignee} size="sm" />
						<div>
							<p className="text-xs text-gray-400">Assigne a</p>
							<p className="font-medium text-gray-700 dark:text-gray-300">{task.assignee}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Icon name="calendar" size="sm" className="text-gray-400" />
						<div>
							<p className="text-xs text-gray-400">Echeance</p>
							<p className="font-medium text-gray-700 dark:text-gray-300">{task.dueDate}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Icon name="clock" size="sm" className="text-gray-400" />
						<div>
							<p className="text-xs text-gray-400">Creee</p>
							<p className="font-medium text-gray-700 dark:text-gray-300">Il y a 3 jours</p>
						</div>
					</div>
				</div>

				{/* Description */}
				{task.description && (
					<>
						<Divider />
						<div>
							<h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Description</h4>
							<p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
						</div>
					</>
				)}

				{/* Subtasks */}
				<Divider />
				<div>
					<div className="mb-3 flex items-center justify-between">
						<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sous-taches</h4>
						<span className="text-xs text-gray-400">
							{subtasks.filter((s) => s.done).length}/{subtasks.length}
						</span>
					</div>
					<ProgressBar value={subtaskProgress} size="sm" className="mb-3" />
					<div className="space-y-2">
						{subtasks.map((st) => (
							<label
								key={st.id}
								className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-2.5 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
							>
								<input
									type="checkbox"
									defaultChecked={st.done}
									className="text-primary-500 focus:ring-primary-100 h-4 w-4 rounded border-gray-300"
								/>
								<span
									className={`text-sm ${st.done ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-300"}`}
								>
									{st.title}
								</span>
							</label>
						))}
					</div>
				</div>

				{/* Activity */}
				<Divider />
				<div>
					<h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Activite</h4>
					<Timeline items={mockActivity} />
				</div>
			</div>

			<ModalFooter>
				<Button variant="cancel" onClick={onClose}>
					Fermer
				</Button>
				<Button variant="outline-primary">
					<Icon name="edit" size="xs" />
					Modifier
				</Button>
			</ModalFooter>
		</Modal>
	);
}
