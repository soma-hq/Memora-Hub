"use client";

// React
import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Icon, Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showInfo } from "@/lib/utils/toast";


type TaskState = "todo" | "in_progress" | "in_review" | "done" | "archived";
type TaskPriority = "haute" | "moyenne" | "basse";

interface Task {
	id: string;
	title: string;
	state: TaskState;
	priority: TaskPriority;
	assignee: string;
	project?: string;
	createdAt: string;
	overdue?: boolean;
}

interface LogEntry {
	id: string;
	icon: "check" | "edit" | "plus" | "clock" | "flag";
	text: string;
	time: string;
}

type TabId = "mine" | "all" | "overdue" | "archived";

const TABS: { id: TabId; label: string; icon: "profile" | "tasks" | "clock" | "folder" }[] = [
	{ id: "mine", label: "Mes tâches", icon: "profile" },
	{ id: "all", label: "Toutes les tâches", icon: "tasks" },
	{ id: "overdue", label: "Tâches en retard", icon: "clock" },
	{ id: "archived", label: "Tâches archivées", icon: "folder" },
];

interface ColumnConfig {
	state: TaskState;
	label: string;
	borderColor: string;
	bgHeader: string;
	badgeVariant: "neutral" | "info" | "warning" | "success";
}

const COLUMNS: ColumnConfig[] = [
	{
		state: "todo",
		label: "À faire",
		borderColor: "border-t-gray-400",
		bgHeader: "bg-gray-50 dark:bg-gray-800/50",
		badgeVariant: "neutral",
	},
	{
		state: "in_progress",
		label: "En cours",
		borderColor: "border-t-blue-500",
		bgHeader: "bg-blue-50/50 dark:bg-blue-900/10",
		badgeVariant: "info",
	},
	{
		state: "in_review",
		label: "En revue",
		borderColor: "border-t-amber-500",
		bgHeader: "bg-amber-50/50 dark:bg-amber-900/10",
		badgeVariant: "warning",
	},
	{
		state: "done",
		label: "Terminé",
		borderColor: "border-t-emerald-500",
		bgHeader: "bg-emerald-50/50 dark:bg-emerald-900/10",
		badgeVariant: "success",
	},
];

const ARCHIVED_COLUMN: ColumnConfig = {
	state: "archived",
	label: "Archivé",
	borderColor: "border-t-gray-400",
	bgHeader: "bg-gray-50 dark:bg-gray-800/50",
	badgeVariant: "neutral",
};

const PRIORITY_DOT: Record<TaskPriority, string> = {
	haute: "bg-red-500",
	moyenne: "bg-amber-500",
	basse: "bg-emerald-500",
};

function InlineAddTask({ onAdd, onCancel }: { onAdd: (title: string) => void; onCancel: () => void }) {
	const [value, setValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" && value.trim()) {
			onAdd(value.trim());
		}
		if (e.key === "Escape") {
			onCancel();
		}
	}

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
			<input
				ref={inputRef}
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={onCancel}
				placeholder="Titre de la tâche..."
				className={cn(
					"w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm",
					"text-gray-900 placeholder-gray-400",
					"transition-all duration-200 outline-none",
					"focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
					"dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500",
					"dark:focus:border-blue-400 dark:focus:ring-blue-900/30",
				)}
			/>
			<p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
				Entrée pour créer &middot; Échap pour annuler
			</p>
		</div>
	);
}

function TaskCard({ task }: { task: Task }) {
	return (
		<div
			onClick={() => showInfo(`Ouverture de : ${task.title}`)}
			className={cn(
				"group cursor-pointer rounded-lg border bg-white p-3",
				"border-gray-200 dark:border-gray-700 dark:bg-gray-800",
				"transition-all duration-200",
				"hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:hover:border-gray-600",
			)}
		>
			<div className="flex items-start gap-2.5">
				{/* Priority dot */}
				<span className={cn("mt-1.5 h-2 w-2 flex-shrink-0 rounded-full", PRIORITY_DOT[task.priority])} />
				<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</span>
			</div>
		</div>
	);
}

function KanbanColumn({
	config,
	tasks,
	onAddTask,
	showAdd,
}: {
	config: ColumnConfig;
	tasks: Task[];
	onAddTask?: (title: string, state: TaskState) => void;
	showAdd: boolean;
}) {
	const [adding, setAdding] = useState(false);

	const count = tasks.length;

	function handleAdd(title: string) {
		onAddTask?.(title, config.state);
		setAdding(false);
	}

	return (
		<div
			className={cn(
				"flex min-w-[260px] flex-1 flex-col rounded-xl border border-gray-200 dark:border-gray-700",
				"bg-gray-50/50 dark:bg-gray-900/30",
				"border-t-4",
				config.borderColor,
			)}
		>
			{/* Column header */}
			<div className={cn("flex items-center justify-between px-4 py-3", config.bgHeader, "rounded-t-lg")}>
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{config.label}</span>
					<Badge variant={config.badgeVariant} showDot={false} className="text-[11px]">
						{count}
					</Badge>
				</div>
				{showAdd && (
					<button
						onClick={() => setAdding(true)}
						className={cn(
							"flex h-6 w-6 items-center justify-center rounded-md",
							"text-gray-400 hover:bg-gray-200 hover:text-gray-600",
							"dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300",
							"transition-all duration-200",
						)}
					>
						<Icon name="plus" size="xs" />
					</button>
				)}
			</div>

			{/* Cards list */}
			<div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} />
				))}

				{/* Empty state */}
				{tasks.length === 0 && !adding && (
					<div className="flex flex-1 items-center justify-center py-8">
						<p className="text-xs text-gray-400 dark:text-gray-500">Aucune tâche</p>
					</div>
				)}

				{/* Inline add form */}
				{adding && <InlineAddTask onAdd={handleAdd} onCancel={() => setAdding(false)} />}
			</div>

			{/* Bottom add button */}
			{showAdd && !adding && (
				<button
					onClick={() => setAdding(true)}
					className={cn(
						"mx-3 mb-3 flex items-center justify-center gap-1.5 rounded-lg border border-dashed",
						"border-gray-300 py-2 text-xs font-medium text-gray-400",
						"hover:border-gray-400 hover:bg-gray-100 hover:text-gray-600",
						"dark:border-gray-600 dark:text-gray-500",
						"dark:hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300",
						"transition-all duration-200",
					)}
				>
					<Icon name="plus" size="xs" />
					Ajouter
				</button>
			)}
		</div>
	);
}

/**
 * Tasks board page with kanban columns, drag and drop and task details.
 * @returns The tasks kanban board page
 */
export default function TasksPage() {
	const params = useParams();
	const _groupId = params.groupId as string;

	// State
	const [tasks, setTasks] = useState<Task[]>([]);
	const [logs] = useState<LogEntry[]>([]);
	const [activeTab, setActiveTab] = useState<TabId>("all");
	const [logsOpen, setLogsOpen] = useState(false);

	// Counter for new task IDs
	const nextIdRef = useRef(100);

	// Add task handler
	const handleAddTask = useCallback((title: string, state: TaskState) => {
		const newTask: Task = {
			id: `t${nextIdRef.current++}`,
			title,
			state,
			priority: "moyenne",
			assignee: "Jeremy Alpha",
			createdAt: new Date().toISOString().slice(0, 10),
		};
		setTasks((prev) => [...prev, newTask]);
		showSuccess("Tâche créée avec succès");
	}, []);

	// Filter tasks by tab

	const filteredTasks = tasks.filter((task) => {
		switch (activeTab) {
			case "mine":
				return task.assignee === "Jeremy Alpha" && task.state !== "archived";
			case "overdue":
				return task.overdue && task.state !== "archived";
			case "archived":
				return task.state === "archived";
			case "all":
			default:
				return task.state !== "archived";
		}
	});

	// Determine which columns to show

	const columnsToShow: ColumnConfig[] = activeTab === "archived" ? [ARCHIVED_COLUMN] : COLUMNS;

	// Group tasks by state

	function getTasksForColumn(state: TaskState): Task[] {
		return filteredTasks.filter((t) => t.state === state);
	}

	// Render

	return (
		<PageContainer title="Tâches" description="Gérez et suivez les tâches de votre équipe">
			{/* Tab navigation */}
			<div className="mb-6 flex items-center gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-100/80 p-1 dark:border-gray-700 dark:bg-gray-800/80">
				{TABS.map((tab) => {
					const isActive = activeTab === tab.id;
					// Count for badge
					let count = 0;
					if (tab.id === "mine") {
						count = tasks.filter((t) => t.assignee === "Jeremy Alpha" && t.state !== "archived").length;
					} else if (tab.id === "overdue") {
						count = tasks.filter((t) => t.overdue && t.state !== "archived").length;
					} else if (tab.id === "archived") {
						count = tasks.filter((t) => t.state === "archived").length;
					} else {
						count = tasks.filter((t) => t.state !== "archived").length;
					}

					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap",
								"transition-all duration-200",
								isActive
									? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
									: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
							)}
						>
							<Icon name={tab.icon} size="sm" />
							{tab.label}
							<span
								className={cn(
									"ml-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
									isActive
										? "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
										: "bg-gray-200/60 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
								)}
							>
								{count}
							</span>
						</button>
					);
				})}
			</div>

			{/* Kanban board */}
			<div className="flex gap-4 overflow-x-auto pb-4">
				{columnsToShow.map((col) => (
					<KanbanColumn
						key={col.state}
						config={col}
						tasks={getTasksForColumn(col.state)}
						onAddTask={handleAddTask}
						showAdd={activeTab !== "archived" && col.state !== "archived"}
					/>
				))}
			</div>

			{/* Logs section */}
			<div className="mt-8">
				<Card className="overflow-hidden">
					<button
						onClick={() => setLogsOpen((prev) => !prev)}
						className={cn(
							"flex w-full items-center justify-between px-4 py-3",
							"transition-all duration-200",
							"hover:bg-gray-50 dark:hover:bg-gray-700/50",
						)}
					>
						<div className="flex items-center gap-2">
							<Icon name="clock" size="sm" className="text-gray-400 dark:text-gray-500" />
							<span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
								Activité récente
							</span>
							<Badge variant="neutral" showDot={false} className="text-[11px]">
								{logs.length}
							</Badge>
						</div>
						<Icon
							name={logsOpen ? "chevronUp" : "chevronDown"}
							size="sm"
							className="text-gray-400 dark:text-gray-500"
						/>
					</button>

					{logsOpen && (
						<div className="border-t border-gray-200 dark:border-gray-700">
							{logs.length === 0 ? (
								<div className="flex items-center justify-center py-8">
									<p className="text-sm text-gray-400 dark:text-gray-500">Aucune activité récente.</p>
								</div>
							) : (
								<ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
									{logs.map((log) => (
										<li
											key={log.id}
											className="flex items-start gap-3 px-4 py-3 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/30"
										>
											<div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
												<Icon
													name={log.icon}
													size="xs"
													className="text-gray-500 dark:text-gray-400"
												/>
											</div>
											<div className="min-w-0 flex-1">
												<p className="text-sm text-gray-700 dark:text-gray-200">{log.text}</p>
											</div>
											<span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
												{log.time}
											</span>
										</li>
									))}
								</ul>
							)}
						</div>
					)}
				</Card>
			</div>
		</PageContainer>
	);
}
