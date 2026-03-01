"use client";

// React
import { useState } from "react";
import { useRecruitmentSessions } from "@/features/recruitment/hooks";
import { RecruitmentSessionCard } from "@/features/recruitment/components/recruitment-session-card";
import { RECRUITMENT_SESSION_TYPES, RECRUITMENT_SESSION_STATUSES } from "@/features/recruitment/types";
import { PageContainer } from "@/components/layout/page-container";
import { Modal, Button, Icon, EmptyState } from "@/components/ui";
import { showSuccess, showError } from "@/lib/utils/toast";
import type { RecruitmentSessionFormData, RecruitmentSessionType } from "@/features/recruitment/types";


/**
 * Recruitment sessions overview with creation, filtering and session cards.
 * @returns The recruitment home page
 */
export default function RecruitmentPage() {
	const { filteredSessions, search, setSearch, statusFilter, setStatusFilter, createSession, isLoading } =
		useRecruitmentSessions();

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [formType, setFormType] = useState<RecruitmentSessionType>("Modération Discord");
	const [formEntity, setFormEntity] = useState("");
	const [formStartDate, setFormStartDate] = useState("");

	const handleCreateSession = async () => {
		if (!formEntity.trim() || !formStartDate) {
			showError("Veuillez remplir tous les champs obligatoires");
			return;
		}
		try {
			const data: RecruitmentSessionFormData = {
				type: formType,
				entity: formEntity,
				startDate: formStartDate,
			};
			await createSession(data);
			showSuccess("Session de recrutement creee avec succes");
			setFormModalOpen(false);
			setFormType("Modération Discord");
			setFormEntity("");
			setFormStartDate("");
		} catch {
			showError("Erreur lors de la creation de la session");
		}
	};

	return (
		<PageContainer
			title="Sessions"
			description="Gerez les sessions de recrutement"
			actions={
				<Button variant="primary" onClick={() => setFormModalOpen(true)}>
					<Icon name="plus" size="sm" />
					Nouvelle session
				</Button>
			}
		>
			{/* Filters */}
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<Icon name="search" size="sm" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher une session..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="focus:border-primary-500 focus:ring-primary-100 dark:focus:border-primary-500 w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-9 text-sm text-gray-900 focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
					/>
				</div>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
					className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
				>
					<option value="">Tous les statuts</option>
					{RECRUITMENT_SESSION_STATUSES.map((s) => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</select>
			</div>

			{/* Sessions grid */}
			{filteredSessions.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{filteredSessions.map((session) => (
						<RecruitmentSessionCard
							key={session.id}
							session={session}
							onClick={() => {
								window.location.href = `${window.location.pathname}/sessions/${session.id}`;
							}}
						/>
					))}
				</div>
			) : (
				<EmptyState
					icon="recruitment"
					title="Aucune session"
					description="Aucune session de recrutement trouvee. Creez-en une pour commencer."
					actionLabel="Nouvelle session"
					onAction={() => setFormModalOpen(true)}
				/>
			)}

			{/* Create session modal */}
			<Modal
				isOpen={formModalOpen}
				onClose={() => setFormModalOpen(false)}
				title="Nouvelle session de recrutement"
				description="Creez une nouvelle session de recrutement"
				size="md"
			>
				<div className="space-y-4">
					{/* Type select */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Type de session
						</label>
						<select
							value={formType}
							onChange={(e) => setFormType(e.target.value as RecruitmentSessionType)}
							className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						>
							{RECRUITMENT_SESSION_TYPES.map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</select>
					</div>

					{/* Entity */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Entite
						</label>
						<input
							type="text"
							value={formEntity}
							onChange={(e) => setFormEntity(e.target.value)}
							placeholder="Ex: Michou, Inoxtag..."
							className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						/>
					</div>

					{/* Start date */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Date de debut
						</label>
						<input
							type="date"
							value={formStartDate}
							onChange={(e) => setFormStartDate(e.target.value)}
							className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						/>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 pt-2">
						<Button variant="cancel" size="sm" onClick={() => setFormModalOpen(false)}>
							Annuler
						</Button>
						<Button variant="primary" size="sm" onClick={handleCreateSession} isLoading={isLoading}>
							Creer la session
						</Button>
					</div>
				</div>
			</Modal>
		</PageContainer>
	);
}
