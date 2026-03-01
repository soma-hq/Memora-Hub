"use client";

// React
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Button, Modal, EmptyState, Icon } from "@/components/ui";
import { LaunchForm } from "@/features/momentum/components/launch-form";
import { useSessions, useSessionActions } from "@/features/momentum/hooks";
import { sessionStatusVariantMap } from "@/features/momentum/types";
import { showSuccess, showError } from "@/lib/utils/toast";
import type { LaunchSessionFormData } from "@/features/momentum/types";


/**
 * Momentum launch page for creating and managing PIM sessions.
 * @returns The session launch page with form and session list
 */
export default function MomentumLaunchPage() {
	const params = useParams();
	const groupId = params.groupId as string;
	const router = useRouter();

	const { sessions, setSessions } = useSessions();
	const { launchSession, isLoading } = useSessionActions(sessions, setSessions);
	const [modalOpen, setModalOpen] = useState(false);

	const handleLaunch = async (data: LaunchSessionFormData) => {
		try {
			const newSession = await launchSession(data);
			showSuccess("Session PIM lancée avec succès.", "Momentum");
			setModalOpen(false);
			router.push(`/hub/${groupId}/momentum/sessions/${newSession.id}`);
		} catch {
			showError("Erreur lors du lancement de la session.", "Momentum");
		}
	};

	const formatDate = (dateStr: string) =>
		new Date(dateStr).toLocaleDateString("fr-FR", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});

	return (
		<PageContainer
			title="Lancement"
			description="Créez et gérez les sessions PIM pour intégrer les Juniors au sein de Marsha Academy."
			actions={
				<Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
					<Icon name="plus" size="sm" />
					Nouvelle session PIM
				</Button>
			}
		>
			<div className="mt-2">
				<h3 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Sessions récentes</h3>

				{sessions.length === 0 ? (
					<EmptyState
						icon="folder"
						title="Aucune session"
						description="Lancez votre première session PIM pour commencer."
						actionLabel="Nouvelle session"
						onAction={() => setModalOpen(true)}
					/>
				) : (
					<div className="flex flex-col gap-2">
						{sessions.slice(0, 10).map((session) => (
							<Card
								key={session.id}
								hover
								padding="md"
								onClick={() => router.push(`/hub/${groupId}/momentum/sessions/${session.id}`)}
							>
								<div className="flex items-center justify-between gap-4">
									<div className="flex min-w-0 items-center gap-3">
										<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
											<Icon
												name="folder"
												size="sm"
												className="text-gray-500 dark:text-gray-400"
											/>
										</div>
										<div className="min-w-0">
											<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
												{session.entity}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{formatDate(session.startDate)} · {session.createdBy}
											</p>
										</div>
									</div>

									<div className="flex shrink-0 items-center gap-3">
										<span className="hidden text-xs text-gray-400 sm:inline">
											{session.juniors.length} junior{session.juniors.length !== 1 ? "s" : ""}
										</span>
										<Badge variant={sessionStatusVariantMap[session.status]}>
											{session.status}
										</Badge>
										<Icon
											name="chevronRight"
											size="sm"
											className="text-gray-300 dark:text-gray-600"
										/>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>

			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Nouvelle session PIM"
				description="Sélectionnez l'entité et la date de début pour lancer une nouvelle session."
				size="md"
			>
				<LaunchForm onSubmit={handleLaunch} onCancel={() => setModalOpen(false)} isLoading={isLoading} />
			</Modal>
		</PageContainer>
	);
}
