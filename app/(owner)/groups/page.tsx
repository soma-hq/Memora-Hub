"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button, Card, Badge, Icon, Input, Modal, ModalFooter } from "@/components/ui";
import { showError, showSuccess } from "@/lib/utils/toast";
import { definePageConfig } from "@/structures";

const PAGE_CONFIG = definePageConfig({
	name: "groups",
	section: "owner",
	module: "admin",
	description: "Gestion des groupes et entités.",
	requiredRole: "owner",
	requiredPermissions: [{ module: "admin", action: "manage" }],
	ownerOnly: true,
});
void PAGE_CONFIG;

interface OwnerGroupEntry {
	id: string;
	name: string;
	description: string | null;
	_count: {
		members: number;
		projects: number;
	};
}

interface GroupsApiResponse {
	groups: OwnerGroupEntry[];
	total: number;
	page: number;
	pageSize: number;
}

/**
 * Resolve deterministic visual color from a name.
 * @param name - Group display name
 * @returns HSL color string
 */
function resolveColorFromName(name: string): string {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = (hash << 5) - hash + name.charCodeAt(i);
		hash |= 0;
	}
	const hue = Math.abs(hash % 360);
	return `hsl(${hue} 70% 45%)`;
}

/**
 * Owner entities management page.
 * @returns Entities list and creation flow
 */
export default function GroupsPage() {
	const [modalOpen, setModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [groups, setGroups] = useState<OwnerGroupEntry[]>([]);
	const [groupName, setGroupName] = useState("");
	const [groupDescription, setGroupDescription] = useState("");

	/**
	 * Fetch groups from API.
	 * @returns Promise resolved after state update
	 */
	const loadGroups = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/groups?page=1&pageSize=100", { cache: "no-store" });
			if (!response.ok) {
				showError("Impossible de charger les entités.");
				return;
			}
			const payload = (await response.json()) as GroupsApiResponse;
			setGroups(payload.groups ?? []);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadGroups();
	}, [loadGroups]);

	/**
	 * Reset modal fields.
	 * @returns void
	 */
	const resetForm = useCallback(() => {
		setGroupName("");
		setGroupDescription("");
	}, []);

	/**
	 * Handle group creation submit.
	 * @param e - Form event
	 * @returns Promise resolved after submit
	 */
	const handleCreateGroup = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!groupName.trim()) {
				showError("Le nom de l'entité est requis.");
				return;
			}

			setIsCreating(true);
			try {
				const response = await fetch("/api/groups", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: groupName.trim(),
						description: groupDescription.trim() || undefined,
					}),
				});

				if (!response.ok) {
					showError("Creation de l'entité impossible.");
					return;
				}

				showSuccess("Entité créée avec succès.");
				setModalOpen(false);
				resetForm();
				await loadGroups();
			} finally {
				setIsCreating(false);
			}
		},
		[groupDescription, groupName, loadGroups, resetForm],
	);

	/**
	 * Resolve page counter label.
	 * @returns Label text
	 */
	const groupCounterLabel = useMemo(() => {
		if (groups.length <= 1) return `${groups.length} entité`;
		return `${groups.length} entités`;
	}, [groups.length]);

	return (
		<PageContainer
			title="Entités"
			description="Pilotez les écosystèmes entité depuis un point unique"
			actions={
				<Button onClick={() => setModalOpen(true)}>
					<Icon name="plus" size="sm" />
					Nouvelle entité
				</Button>
			}
		>
			<div className="mb-4 flex items-center justify-between">
				<p className="text-sm text-gray-500 dark:text-gray-400">{groupCounterLabel}</p>
				{isLoading && (
					<div className="flex items-center gap-2 text-xs text-gray-400">
						<Icon name="clock" size="xs" />
						Chargement...
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{groups.map((group) => (
					<Card key={group.id} hover padding="lg">
						<div className="flex items-start gap-4">
							<div
								className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold text-white"
								style={{ backgroundColor: resolveColorFromName(group.name) }}
							>
								{group.name.charAt(0).toUpperCase()}
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
									<Badge variant="success" showDot>
										Actif
									</Badge>
								</div>
								<p className="mt-1 text-sm text-gray-400">{group.description || "Sans description"}</p>
							</div>
						</div>

						<div className="mt-4 flex items-center gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
							<div className="flex items-center gap-1.5 text-sm text-gray-500">
								<Icon name="users" size="sm" className="text-gray-400" />
								<span>{group._count.members} membres</span>
							</div>
							<div className="flex items-center gap-1.5 text-sm text-gray-500">
								<Icon name="folder" size="sm" className="text-gray-400" />
								<span>{group._count.projects} projets</span>
							</div>
						</div>

						<div className="mt-4 flex gap-2">
							<Button variant="soft-primary" size="sm" className="flex-1">
								<Icon name="eye" size="xs" />
								Explorer
							</Button>
							<Button variant="outline-neutral" size="sm">
								<Icon name="edit" size="xs" />
							</Button>
							<Button variant="outline-danger" size="sm">
								<Icon name="delete" size="xs" />
							</Button>
						</div>
					</Card>
				))}

				{/* Add entity card */}
				<button
					onClick={() => setModalOpen(true)}
					className="hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:border-primary-400 dark:hover:bg-primary-900/10 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 p-8 text-gray-400 transition-all duration-200 dark:border-gray-600"
				>
					<div className="rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
						<Icon name="plus" size="lg" />
					</div>
					<span className="text-sm font-medium">Ajouter une entité</span>
				</button>
			</div>

			{/* Create modal */}
			<Modal
				isOpen={modalOpen}
				onClose={() => {
					setModalOpen(false);
					resetForm();
				}}
				title="Nouvelle entité"
				description="Créez une entité indépendante dans l'écosystème Memora."
			>
				<form className="space-y-4" onSubmit={handleCreateGroup}>
					<Input
						label="Nom de l'entité"
						placeholder="Nouvelle entité"
						required
						value={groupName}
						onChange={(e) => setGroupName(e.target.value)}
					/>
					<Input
						label="Description"
						placeholder="Description de l'entité"
						value={groupDescription}
						onChange={(e) => setGroupDescription(e.target.value)}
					/>
					<ModalFooter>
						<Button
							variant="cancel"
							type="button"
							onClick={() => {
								setModalOpen(false);
								resetForm();
							}}
						>
							Annuler
						</Button>
						<Button type="submit" isLoading={isCreating}>
							Créer
						</Button>
					</ModalFooter>
				</form>
			</Modal>
		</PageContainer>
	);
}
