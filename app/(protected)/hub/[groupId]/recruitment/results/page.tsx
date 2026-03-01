"use client";

// React
import { useState } from "react";
import { useCandidates } from "@/features/recruitment/hooks";
import { KanbanBoard } from "@/features/recruitment/components/kanban-board";
import { CandidateDetail } from "@/features/recruitment/components/candidate-detail";
import { PageContainer } from "@/components/layout/page-container";
import { Modal } from "@/components/ui";
import type { Candidate } from "@/features/recruitment/types";


/**
 * Recruitment results page with kanban board for decision tracking.
 * @returns The results kanban view
 */
export default function ResultsPage() {
	const { allCandidates, sessions, addAvis } = useCandidates();

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
		<PageContainer title="Resultats" description="Vue d'ensemble des decisions de recrutement">
			<KanbanBoard candidates={allCandidates} onCandidateClick={handleCandidateClick} />

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
