"use client";

// Next.js
import Image from "next/image";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { useDataStore } from "@/store/data.store";
import { usePermission } from "@/hooks/usePermission";

interface EntityModalProps {
	isOpen: boolean;
	onClose: () => void;
	activeEntityId?: string;
	onSelect?: (entityId: string) => void;
}

/**
 * Modal for switching between available entities.
 * Filters entities based on the current user's entityAccess permissions.
 * @param {EntityModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Callback to close the modal
 * @param {string} [props.activeEntityId] - Currently selected entity ID
 * @param {(entityId: string) => void} [props.onSelect] - Callback when an entity is selected
 * @returns {JSX.Element | null} Entity selector modal or null when closed
 */
export function EntityModal({ isOpen, onClose, activeEntityId, onSelect }: EntityModalProps) {
	const getEntitiesForCurrentUser = useDataStore((s) => s.getEntitiesForCurrentUser);
	const { isAdmin } = usePermission();

	if (!isOpen) return null;

	// Get entities the current user can access (respects entityAccess + wildcard)
	const accessibleEntities = getEntitiesForCurrentUser();

	// Render
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="animate-fade-in fixed inset-0 z-0 bg-black/40 backdrop-blur-sm dark:bg-black/70"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="animate-scale-in relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
					<div className="flex items-center gap-2.5">
						<Icon name="group" size="md" className="text-primary-500" />
						<div>
							<h2 className="text-base font-semibold text-gray-900 dark:text-white">Entites</h2>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{isAdmin ? "Toutes les entites" : `${accessibleEntities.length} entite(s) accessible(s)`}
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
					>
						<Icon name="close" size="sm" />
					</button>
				</div>

				{/* Entity list */}
				<div className="p-3">
					{accessibleEntities.length === 0 ? (
						<p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">Aucune entite accessible</p>
					) : (
						accessibleEntities.map((entity, idx) => (
							<div key={entity.id}>
								<button
									onClick={() => {
										onSelect?.(entity.id);
										onClose();
									}}
									className={cn(
										"flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
										activeEntityId === entity.id
											? "bg-primary-50 dark:bg-primary-900/20"
											: "hover:bg-gray-50 dark:hover:bg-gray-700/50",
									)}
								>
									{/* Entity color indicator + avatar */}
									<div
										className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
										style={{ backgroundColor: entity.color }}
									>
										{entity.name.charAt(0).toUpperCase()}
									</div>

									<div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />

									<span
										className={cn(
											"text-sm font-medium",
											activeEntityId === entity.id
												? "text-primary-700 dark:text-primary-400"
												: "text-gray-700 dark:text-gray-200",
										)}
									>
										{entity.name}
									</span>

									{activeEntityId === entity.id && (
										<Icon name="check" size="sm" className="text-primary-500 ml-auto" />
									)}
								</button>

								{idx < accessibleEntities.length - 1 && (
									<div className="mx-4 my-1">
										<div className="h-px bg-gray-100 dark:bg-gray-700/50" />
									</div>
								)}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
