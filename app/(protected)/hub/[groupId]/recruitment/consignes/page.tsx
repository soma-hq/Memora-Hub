"use client";

// React
import { useState } from "react";
import { useConsignes } from "@/features/recruitment/hooks";
import { avisRoleVariantMap, CONSIGNE_PROFILE_TYPES } from "@/features/recruitment/types";
import { PageContainer } from "@/components/layout/page-container";
import { Modal, Button, Icon, Badge, Card } from "@/components/ui";
import { showSuccess, showError } from "@/lib/utils/toast";
import type { ConsigneProfileType } from "@/features/recruitment/types";


/**
 * Recruitment consignes page for managing interview guidelines per profile type.
 * @returns The consignes management page
 */
export default function ConsignesPage() {
	const { consignes, addConsigne, isLoading } = useConsignes();

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [formContent, setFormContent] = useState("");
	const [formProfileType, setFormProfileType] = useState<ConsigneProfileType>("Tous");

	const handleAddConsigne = async () => {
		if (!formContent.trim()) {
			showError("Le contenu de la consigne est obligatoire");
			return;
		}
		try {
			await addConsigne({
				content: formContent,
				profileType: formProfileType,
				author: "Resp. Legacy",
				authorRole: "Legacy",
			});
			showSuccess("Consigne ajoutee avec succes");
			setFormModalOpen(false);
			setFormContent("");
			setFormProfileType("Tous");
		} catch {
			showError("Erreur lors de l'ajout de la consigne");
		}
	};

	return (
		<PageContainer
			title="Consignes"
			description="Directives et consignes de recrutement"
			actions={
				<Button variant="primary" onClick={() => setFormModalOpen(true)}>
					<Icon name="plus" size="sm" />
					Nouvelle consigne
				</Button>
			}
		>
			{/* Info banner */}
			<div className="border-info-200 bg-info-50 dark:border-info-800 dark:bg-info-900/10 mb-6 flex items-start gap-3 rounded-lg border p-4">
				<Icon name="info" size="md" className="text-info-500 mt-0.5 shrink-0" />
				<div>
					<p className="text-info-700 dark:text-info-400 text-sm font-medium">
						Les consignes sont emises par les Responsables (Legacy)
					</p>
					<p className="text-info-600 dark:text-info-500 mt-1 text-xs">
						Elles servent de directives pour tous les recruteurs lors des sessions d&apos;entretien.
						Consultez-les attentivement avant chaque session.
					</p>
				</div>
			</div>

			{/* Consignes list */}
			<div className="space-y-4">
				{consignes.map((consigne) => (
					<Card key={consigne.id} padding="lg">
						{/* Header */}
						<div className="mb-3 flex flex-wrap items-center gap-2">
							<div className="flex items-center gap-2">
								<div className="bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
									{consigne.author
										.split(" ")
										.map((n) => n[0])
										.join("")
										.slice(0, 2)}
								</div>
								<span className="text-sm font-medium text-gray-900 dark:text-white">
									{consigne.author}
								</span>
								<Badge variant={avisRoleVariantMap[consigne.authorRole]} showDot={false}>
									{consigne.authorRole}
								</Badge>
							</div>
							<div className="ml-auto flex items-center gap-2">
								<Badge variant="neutral" showDot={false}>
									{consigne.profileType}
								</Badge>
								<span className="text-xs text-gray-400 dark:text-gray-500">{consigne.createdAt}</span>
							</div>
						</div>

						{/* Content */}
						<p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{consigne.content}</p>
					</Card>
				))}

				{consignes.length === 0 && (
					<div className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
						Aucune consigne pour le moment.
					</div>
				)}
			</div>

			{/* New consigne modal */}
			<Modal
				isOpen={formModalOpen}
				onClose={() => setFormModalOpen(false)}
				title="Nouvelle consigne"
				description="Ajoutez une directive pour les recruteurs"
				size="md"
			>
				<div className="space-y-4">
					{/* Profile type */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Type de profil concerne
						</label>
						<select
							value={formProfileType}
							onChange={(e) => setFormProfileType(e.target.value as ConsigneProfileType)}
							className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						>
							{CONSIGNE_PROFILE_TYPES.map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</select>
					</div>

					{/* Content */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Contenu
						</label>
						<textarea
							value={formContent}
							onChange={(e) => setFormContent(e.target.value)}
							className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							rows={5}
							placeholder="Redigez votre consigne..."
						/>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 pt-2">
						<Button variant="cancel" size="sm" onClick={() => setFormModalOpen(false)}>
							Annuler
						</Button>
						<Button variant="primary" size="sm" onClick={handleAddConsigne} isLoading={isLoading}>
							Ajouter
						</Button>
					</div>
				</div>
			</Modal>
		</PageContainer>
	);
}
