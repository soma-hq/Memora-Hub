"use client";

// Components
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { ActiveFlow, AssistantStatus } from "@/features/assistant/types";
import { ASSISTANT_NAME } from "@/features/assistant/constants";


interface AssistantHeaderProps {
	status: AssistantStatus;
	isMinimized: boolean;
	activeFlow: ActiveFlow | null;
	onClose: () => void;
	onMinimize: () => void;
	onNewConversation: () => void;
	onCancelFlow: () => void;
}

/** Status indicator dot colors */
const STATUS_COLORS: Record<AssistantStatus, string> = {
	idle: "bg-emerald-400",
	thinking: "bg-amber-400 animate-pulse",
	processing: "bg-sky-400 animate-pulse",
	confirming: "bg-rose-300 animate-pulse",
	error: "bg-red-500",
};

/** Status label text - casual tone */
const STATUS_LABELS: Record<AssistantStatus, string> = {
	idle: "Disponible",
	thinking: "Je reflechis...",
	processing: "Je m'en occupe...",
	confirming: "J'attends ta reponse",
	error: "Oups, un souci",
};

/**
 * Header bar for the assistant modal with status and controls.
 * @param {AssistantHeaderProps} props Component props
 * @returns {JSX.Element} Assistant header
 */

export function AssistantHeader({
	status,
	isMinimized,
	activeFlow,
	onClose,
	onMinimize,
	onNewConversation,
	onCancelFlow,
}: AssistantHeaderProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between border-b px-4 py-3",
				"border-gray-100 dark:border-gray-800",
				"bg-gray-50/80 dark:bg-gray-800/50",
			)}
		>
			{/* Left: Bot info */}
			<div className="flex items-center gap-3">
				{/* Avatar */}
				<div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
					<Icon name="sparkles" size="sm" className="text-rose-300" />
					{/* Status dot */}
					<span
						className={cn(
							"absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-900",
							STATUS_COLORS[status],
						)}
					/>
				</div>

				{/* Name and status */}
				<div className="flex flex-col">
					<span className="text-sm font-semibold text-gray-900 dark:text-white">{ASSISTANT_NAME}</span>
					<span className="text-[11px] text-gray-400">{STATUS_LABELS[status]}</span>
				</div>
			</div>

			{/* Right: Action buttons */}
			<div className="flex items-center gap-0.5">
				{/* New conversation */}
				{!isMinimized && (
					<button
						onClick={onNewConversation}
						title="Nouvelle conversation"
						className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
					>
						<Icon name="refresh" size="xs" />
					</button>
				)}

				{/* Minimize */}
				<button
					onClick={onMinimize}
					title={isMinimized ? "Agrandir" : "Reduire"}
					className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
				>
					<Icon name={isMinimized ? "chevronUp" : "chevronDown"} size="xs" />
				</button>

				{/* Close */}
				<button
					onClick={onClose}
					title="Fermer (Echap)"
					className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
				>
					<Icon name="close" size="xs" />
				</button>
			</div>
		</div>
	);
}
