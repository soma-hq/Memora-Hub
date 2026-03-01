"use client";

// React
import { useState } from "react";
import { useParams } from "next/navigation";
import { useSessionDetail } from "@/features/recruitment/hooks";
import { CandidateCard } from "@/features/recruitment/components/candidate-card";
import { CandidateDetail } from "@/features/recruitment/components/candidate-detail";
import { QuestionnaireCarousel } from "@/features/recruitment/components/questionnaire-carousel";
import { TimelineRecruitment } from "@/features/recruitment/components/timeline-recruitment";
import { sessionStatusVariantMap, sessionTypeVariantMap, CANDIDATE_DECISIONS } from "@/features/recruitment/types";
import { PageContainer } from "@/components/layout/page-container";
import { Modal, Badge, Icon, Tabs, EmptyState } from "@/components/ui";
import type { Candidate } from "@/features/recruitment/types";


/**
 * Recruitment session detail with candidate list, questionnaire and timeline.
 * @returns The session detail page with tabs
 */
export default function SessionDetailPage() {
	const params = useParams();
	const sessionId = params.sessionId as string;

	const { session, filteredCandidates, search, setSearch, decisionFilter, setDecisionFilter, addAvis } =
		useSessionDetail(sessionId);

	const [activeTab, setActiveTab] = useState("candidats");
	const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
	const [detailModalOpen, setDetailModalOpen] = useState(false);

	const tabs = [
		{ id: "candidats", label: "Candidats", count: session?.candidates.length },
		{ id: "questionnaire", label: "Questionnaire" },
		{ id: "planning", label: "Planning" },
	];

	if (!session) {
		return (
			<PageContainer title="Session introuvable">
				<EmptyState
					icon="folder"
					title="Session introuvable"
					description="Cette session de recrutement n'existe pas ou a ete supprimee."
				/>
			</PageContainer>
		);
	}

	const handleCandidateClick = (candidate: Candidate) => {
		setSelectedCandidate(candidate);
		setDetailModalOpen(true);
	};

	const sessionName = `${session.type} — ${session.entity}`;

	return (
		<PageContainer title={sessionName}>
			{/* Session header */}
			<div className="mb-6 flex flex-wrap items-center gap-3">
				<Badge variant={sessionTypeVariantMap[session.type]} showDot={false}>
					{session.type}
				</Badge>
				<Badge variant={sessionStatusVariantMap[session.status]}>{session.status}</Badge>
				<span className="ml-2 inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
					<Icon name="calendar" size="xs" className="text-gray-400" />
					{session.startDate}
					{session.endDate && ` — ${session.endDate}`}
				</span>
				<span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
					<Icon name="users" size="xs" className="text-gray-400" />
					{session.candidates.length} candidat{session.candidates.length !== 1 ? "s" : ""}
				</span>
			</div>

			{/* Timeline */}
			<div className="mb-8">
				<TimelineRecruitment />
			</div>

			{/* Tabs */}
			<Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="mb-6" />

			{/* Candidats tab */}
			{activeTab === "candidats" && (
				<div>
					{/* Filters */}
					<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="relative flex-1">
							<Icon
								name="search"
								size="sm"
								className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
							/>
							<input
								type="text"
								placeholder="Rechercher un candidat..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="focus:border-primary-500 focus:ring-primary-100 dark:focus:border-primary-500 w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-9 text-sm text-gray-900 focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							/>
						</div>
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
							description="Aucun candidat ne correspond à vos criteres de recherche."
						/>
					)}
				</div>
			)}

			{/* Questionnaire tab */}
			{activeTab === "questionnaire" && <QuestionnaireCarousel />}

			{/* Planning tab */}
			{activeTab === "planning" && (
				<div className="space-y-3">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Entretiens planifies</h3>
					{session.candidates
						.filter((c) => c.interviewDate)
						.sort((a, b) => (a.interviewDate || "").localeCompare(b.interviewDate || ""))
						.map((candidate) => (
							<div
								key={candidate.id}
								className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
										{candidate.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</div>
									<div>
										<p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											Recruteur : {candidate.recruiter}
											{candidate.spectators.length > 0 &&
												` | Spectateurs : ${candidate.spectators.join(", ")}`}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										{candidate.interviewDate}
									</p>
									{candidate.interviewTime && (
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{candidate.interviewTime}
										</p>
									)}
								</div>
							</div>
						))}
					{session.candidates.filter((c) => c.interviewDate).length === 0 && (
						<EmptyState
							icon="calendar"
							title="Aucun entretien planifie"
							description="Aucun entretien n'a ete planifie pour cette session."
						/>
					)}
				</div>
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
					<CandidateDetail candidate={selectedCandidate} sessionName={sessionName} onAddAvis={addAvis} />
				)}
			</Modal>
		</PageContainer>
	);
}
