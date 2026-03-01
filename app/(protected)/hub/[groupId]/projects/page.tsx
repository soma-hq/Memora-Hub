"use client";

// React
import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Button, Icon } from "@/components/ui";
import { ProjectList } from "@/features/projects/components/project-list";
import { ProjectCreationWizard } from "@/features/projects/components/project-creation-wizard";
import { showSuccess, showError } from "@/lib/utils/toast";
import { useProjectActions } from "@/features/projects/hooks";
import type { ProjectFormData } from "@/features/projects/types";


/**
 * Projects page with list view and multi-step creation wizard.
 * @returns {JSX.Element} Projects management page
 */
export default function ProjectsPage() {
	// State
	const params = useParams();
	const groupId = (params.groupId as string) ?? "default";
	const [wizardOpen, setWizardOpen] = useState(false);
	const { createProject } = useProjectActions();

	// Handlers

	/**
	 * Creates a project from wizard form data and shows a success toast.
	 * @param {ProjectFormData} data - Form data from the creation wizard
	 * @returns {void}
	 */
	const handleCreate = useCallback(
		async (data: ProjectFormData) => {
			try {
				await createProject(data);
				showSuccess("Projet cree avec succes !");
			} catch {
				showError("Erreur lors de la creation du projet.");
			}
		},
		[createProject],
	);

	// Render
	return (
		<PageContainer
			title="Projets"
			description="Gerez et suivez l'avancement de vos projets"
			actions={
				<Button variant="primary" onClick={() => setWizardOpen(true)}>
					<Icon name="plus" size="sm" />
					Nouveau projet
				</Button>
			}
		>
			<ProjectList groupId={groupId} onCreateClick={() => setWizardOpen(true)} />

			<ProjectCreationWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} onSubmit={handleCreate} />
		</PageContainer>
	);
}
