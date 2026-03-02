// Groups Management Page

"use client";

import { useState } from "react";
import Image from "next/image";
import { PageContainer } from "@/components/layout/page-container";
import { Button, Card, Badge, Icon, Input, Modal, ModalFooter } from "@/components/ui";
import { showSuccess } from "@/lib/utils/toast";
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

// Mock data
const mockGroups = [
	{
		id: "bazalthe",
		name: "Bazalthe",
		description: "Groupement principal",
		members: 18,
		projects: 8,
		logo: "/logos/memora.png",
		status: "active" as const,
	},
	{
		id: "inoxtag",
		name: "Inoxtag",
		description: "Équipe créateurs de contenu",
		members: 6,
		projects: 4,
		logo: "/logos/inoxtag.png",
		status: "active" as const,
	},
];

export default function GroupsPage() {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<PageContainer
			title="Groupements"
			description="Gérez vos groupements et organisations"
			actions={
				<Button onClick={() => setModalOpen(true)}>
					<Icon name="plus" size="sm" />
					Nouveau groupement
				</Button>
			}
		>
			{/* Groups grid */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{mockGroups.map((group) => (
					<Card key={group.id} hover padding="lg">
						<div className="flex items-start gap-4">
							<Image
								src={group.logo}
								alt={group.name}
								width={48}
								height={48}
								className="rounded-xl object-cover"
							/>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
									<Badge variant="success" showDot>
										Actif
									</Badge>
								</div>
								<p className="mt-1 text-sm text-gray-400">{group.description}</p>
							</div>
						</div>

						<div className="mt-4 flex items-center gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
							<div className="flex items-center gap-1.5 text-sm text-gray-500">
								<Icon name="users" size="sm" className="text-gray-400" />
								<span>{group.members} membres</span>
							</div>
							<div className="flex items-center gap-1.5 text-sm text-gray-500">
								<Icon name="folder" size="sm" className="text-gray-400" />
								<span>{group.projects} projets</span>
							</div>
						</div>

						<div className="mt-4 flex gap-2">
							<Button variant="soft-primary" size="sm" className="flex-1">
								<Icon name="eye" size="xs" />
								Voir
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

				{/* Add group card */}
				<button
					onClick={() => setModalOpen(true)}
					className="hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:border-primary-400 dark:hover:bg-primary-900/10 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 p-8 text-gray-400 transition-all duration-200 dark:border-gray-600"
				>
					<div className="rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
						<Icon name="plus" size="lg" />
					</div>
					<span className="text-sm font-medium">Ajouter un groupement</span>
				</button>
			</div>

			{/* Create modal */}
			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Nouveau groupement"
				description="Créez un nouveau groupement pour organiser vos équipes."
			>
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						showSuccess("Groupement créé");
						setModalOpen(false);
					}}
				>
					<Input label="Nom du groupement" placeholder="Mon groupement" required />
					<Input label="Description" placeholder="Description du groupement" />
					<ModalFooter>
						<Button variant="cancel" type="button" onClick={() => setModalOpen(false)}>
							Annuler
						</Button>
						<Button type="submit">Créer</Button>
					</ModalFooter>
				</form>
			</Modal>
		</PageContainer>
	);
}
