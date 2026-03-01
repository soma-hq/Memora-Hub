"use client";

// React
import { useState } from "react";
import { useCandidates } from "@/features/recruitment/hooks";
import { CandidateCard } from "@/features/recruitment/components/candidate-card";
import { CandidateDetail } from "@/features/recruitment/components/candidate-detail";
import { CANDIDATE_DECISIONS } from "@/features/recruitment/types";
import { PageContainer } from "@/components/layout/page-container";
import { Modal, Icon, EmptyState } from "@/components/ui";
import type { Candidate } from "@/features/recruitment/types";


/**
 * Candidates list page with search, session and decision filtering.
 * @returns The candidates management page
 */
export default function CandidatesPage() {
	const {
		sessions,
		filteredCandidates,
		search,
		setSearch,
		sessionFilter,
		setSessionFilter,
		decisionFilter,
		setDecisionFilter,
		addAvis,
	} = useCandidates();

	const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
	const [detailModalOpen, setDetailModalOpen] = useState(false);

	const handleCandidateClick = (candidate: Candidate) => {
		setSelectedCandidate(candidate);
		setDetailModalOpen(true);
	};

	const getSessionName = (sessionId: string) => {
		const session = sessions.find((s) => s.id === sessionId);
		return session ? `${session.type} — ${session.entity}` : "";
	};

	return (
		<PageContainer title="Candidats" description="Liste de tous les candidats toutes sessions confondues">
			{/* Filters */}
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<Icon name="search" size="sm" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher un candidat..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="focus:border-primary-500 focus:ring-primary-100 dark:focus:border-primary-500 w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-9 text-sm text-gray-900 focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
					/>
				</div>
				<select
					value={sessionFilter}
					onChange={(e) => setSessionFilter(e.target.value)}
					className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
				>
					<option value="">Toutes les sessions</option>
					{sessions.map((s) => (
						<option key={s.id} value={s.id}>
							{s.type} — {s.entity}
						</option>
					))}
				</select>
				<select
					value={decisionFilter}
					onChange={(e) => setDecisionFilter(e.target.value as typeof decisionFilter)}
					className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
				>
					<option value="">Toutes les decisions</option>
					{CANDIDATE_DECISIONS.map((d) => (
						<option key={d} value={d}>
							{d}
						</option>
					))}
				</select>
			</div>

			{/* Candidates grid */}
			{filteredCandidates.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{filteredCandidates.map((candidate) => (
						<CandidateCard
							key={candidate.id}
							candidate={candidate}
							onClick={() => handleCandidateClick(candidate)}
						/>
					))}
				</div>
			) : (
				<EmptyState
					icon="users"
					title="Aucun candidat"
					description="Aucun candidat ne correspond a vos criteres de recherche."
				/>
			)}

			{/* Candidate detail modal */}
			<Modal
				isOpen={detailModalOpen}
				onClose={() => {
					setDetailModalOpen(false);
					setSelectedCandidate(null);
				}}
				size="xl"
			>
				{selectedCandidate && (
					<CandidateDetail
						candidate={selectedCandidate}
						sessionName={getSessionName(selectedCandidate.sessionId)}
						onAddAvis={addAvis}
					/>
				)}
			</Modal>
		</PageContainer>
	);
}
