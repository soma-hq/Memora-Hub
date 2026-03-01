"use client";

import { useState, useMemo, useCallback } from "react";
import type {

	RecruitmentSession,
	RecruitmentSessionStatus,
	RecruitmentSessionFormData,
	Candidate,
	CandidateDecision,
	CandidateAvis,
	QuestionnaireStage,
	Consigne,
	RecruiterStats,
	ConsigneProfileType,
	AvisAuthorRole,
} from "./types";
import {

	sessions as initialSessions,
	questionnaireStages as initialStages,
	consignes as initialConsignes,
	recruiterStats as initialRecruiterStats,
} from "./data";

/**
 * Manages recruitment sessions with filtering
 * @returns Sessions state, filters, and CRUD operations
 */

export function useRecruitmentSessions() {
	// State
	const [sessions, setSessions] = useState<RecruitmentSession[]>(initialSessions);
	const [isLoading, setIsLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<RecruitmentSessionStatus | "">("");

	// Computed
	const filteredSessions = useMemo(() => {
		return sessions.filter((session) => {
			const matchesSearch =
				!search ||
				session.entity.toLowerCase().includes(search.toLowerCase()) ||
				session.type.toLowerCase().includes(search.toLowerCase()) ||
				session.candidates.some((c) => c.name.toLowerCase().includes(search.toLowerCase()));
			const matchesStatus = !statusFilter || session.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [sessions, search, statusFilter]);

	// Handlers
	/**
	 * Creates a new recruitment session
	 * @param data - New session form data
	 * @returns Newly created session
	 */

	const createSession = useCallback(async (data: RecruitmentSessionFormData) => {
		setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 500));

		const newSession: RecruitmentSession = {
			id: `session-rec-${Date.now()}`,
			type: data.type,
			entity: data.entity,
			startDate: data.startDate,
			status: "Active",
			candidates: [],
			createdBy: "Utilisateur courant",
		};

		setSessions((prev) => [newSession, ...prev]);
		setIsLoading(false);
		return newSession;
	}, []);

	return {
		sessions,
		setSessions,
		isLoading,
		search,
		setSearch,
		statusFilter,
		setStatusFilter,
		filteredSessions,
		createSession,
	};
}

/**
 * Manages single session with candidate filtering
 * @param sessionId - Session ID to manage
 * @returns Session data, filtered candidates, mutations
 */

export function useSessionDetail(sessionId: string) {
	// State
	const [sessions, setSessions] = useState<RecruitmentSession[]>(initialSessions);
	const session = useMemo(() => sessions.find((s) => s.id === sessionId), [sessions, sessionId]);

	const [search, setSearch] = useState("");
	const [decisionFilter, setDecisionFilter] = useState<CandidateDecision | "">("");

	// Computed
	const filteredCandidates = useMemo(() => {
		if (!session) return [];
		return session.candidates.filter((candidate) => {
			const matchesSearch =
				!search ||
				candidate.name.toLowerCase().includes(search.toLowerCase()) ||
				candidate.formId.toLowerCase().includes(search.toLowerCase()) ||
				candidate.recruiter.toLowerCase().includes(search.toLowerCase());
			const matchesDecision = !decisionFilter || candidate.finalDecision === decisionFilter;
			return matchesSearch && matchesDecision;
		});
	}, [session, search, decisionFilter]);

	// Handlers
	/**
	 * Adds an avis to a candidate
	 * @param candidateId - Target candidate ID
	 * @param avis - Avis data without ID
	 */

	const addAvis = useCallback(
		(candidateId: string, avis: Omit<CandidateAvis, "id">) => {
			setSessions((prev) =>
				prev.map((s) => {
					if (s.id !== sessionId) return s;
					return {
						...s,
						candidates: s.candidates.map((c) => {
							if (c.id !== candidateId) return c;
							return {
								...c,
								avis: [...c.avis, { ...avis, id: `avis-${Date.now()}` }],
							};
						}),
					};
				}),
			);
		},
		[sessionId],
	);

	/**
	 * Updates a candidate's final decision
	 * @param candidateId - Target candidate ID
	 * @param decision - New decision value
	 */

	const updateDecision = useCallback(
		(candidateId: string, decision: CandidateDecision) => {
			setSessions((prev) =>
				prev.map((s) => {
					if (s.id !== sessionId) return s;
					return {
						...s,
						candidates: s.candidates.map((c) =>
							c.id === candidateId ? { ...c, finalDecision: decision } : c,
						),
					};
				}),
			);
		},
		[sessionId],
	);

	return {
		session,
		filteredCandidates,
		search,
		setSearch,
		decisionFilter,
		setDecisionFilter,
		addAvis,
		updateDecision,
	};
}

/**
 * Manages questionnaire navigation across stages
 * @returns Stages, current stage, and navigation controls
 */

export function useQuestionnaire() {
	// State
	const [stages] = useState<QuestionnaireStage[]>(initialStages);
	const [currentStage, setCurrentStage] = useState(0);

	// Computed
	const stage = stages[currentStage];
	const totalStages = stages.length;

	// Handlers
	/**
	 * Advances to the next stage
	 */

	const goNext = useCallback(() => {
		setCurrentStage((prev) => Math.min(prev + 1, totalStages - 1));
	}, [totalStages]);

	/**
	 * Returns to the previous stage
	 */

	const goPrev = useCallback(() => {
		setCurrentStage((prev) => Math.max(prev - 1, 0));
	}, []);

	/**
	 * Navigates to a specific stage
	 * @param index - Zero-based stage index
	 */

	const goToStage = useCallback(
		(index: number) => {
			if (index >= 0 && index < totalStages) {
				setCurrentStage(index);
			}
		},
		[totalStages],
	);

	return {
		stages,
		stage,
		currentStage,
		totalStages,
		goNext,
		goPrev,
		goToStage,
		isFirst: currentStage === 0,
		isLast: currentStage === totalStages - 1,
	};
}

/**
 * Provides recruiter workspace data and stats
 * @returns Recruiter stats, today's interviews, candidates
 */

export function useRecruiterEspace() {
	// State
	const [stats] = useState<RecruiterStats>(initialRecruiterStats);
	const [sessions] = useState<RecruitmentSession[]>(initialSessions);

	// Computed
	const today = new Date().toISOString().split("T")[0];
	const todayInterviews = useMemo(() => {
		const allCandidates = sessions.flatMap((s) => s.candidates);
		return allCandidates.filter((c) => c.interviewDate === today);
	}, [sessions, today]);

	const myCandidates = useMemo(() => {
		const allCandidates = sessions.flatMap((s) => s.candidates);
		return allCandidates.filter((c) => c.recruiter === "Alexandre D.");
	}, [sessions]);

	return {
		stats,
		todayInterviews,
		myCandidates,
	};
}

/**
 * Manages all candidates with filtering and avis submission
 * @returns Candidates, filters, and avis operations
 */

export function useCandidates() {
	// State
	const [sessions, setSessions] = useState<RecruitmentSession[]>(initialSessions);
	const [search, setSearch] = useState("");
	const [sessionFilter, setSessionFilter] = useState<string>("");
	const [decisionFilter, setDecisionFilter] = useState<CandidateDecision | "">("");

	// Computed
	const allCandidates = useMemo(() => {
		return sessions.flatMap((s) => s.candidates);
	}, [sessions]);

	const filteredCandidates = useMemo(() => {
		return allCandidates.filter((candidate) => {
			const matchesSearch =
				!search ||
				candidate.name.toLowerCase().includes(search.toLowerCase()) ||
				candidate.formId.toLowerCase().includes(search.toLowerCase()) ||
				candidate.recruiter.toLowerCase().includes(search.toLowerCase());
			const matchesSession = !sessionFilter || candidate.sessionId === sessionFilter;
			const matchesDecision = !decisionFilter || candidate.finalDecision === decisionFilter;
			return matchesSearch && matchesSession && matchesDecision;
		});
	}, [allCandidates, search, sessionFilter, decisionFilter]);

	// Handlers
	/**
	 * Adds an avis across all sessions
	 * @param candidateId - Target candidate ID
	 * @param avis - Avis data without ID
	 */

	const addAvis = useCallback((candidateId: string, avis: Omit<CandidateAvis, "id">) => {
		setSessions((prev) =>
			prev.map((s) => ({
				...s,
				candidates: s.candidates.map((c) => {
					if (c.id !== candidateId) return c;
					return {
						...c,
						avis: [...c.avis, { ...avis, id: `avis-${Date.now()}` }],
					};
				}),
			})),
		);
	}, []);

	return {
		sessions,
		allCandidates,
		filteredCandidates,
		search,
		setSearch,
		sessionFilter,
		setSessionFilter,
		decisionFilter,
		setDecisionFilter,
		addAvis,
	};
}

/**
 * Manages recruitment consignes with creation
 * @returns Consignes, loading state, add operation
 */

export function useConsignes() {
	// State
	const [consignes, setConsignes] = useState<Consigne[]>(initialConsignes);
	const [isLoading, setIsLoading] = useState(false);

	// Handlers
	/**
	 * Adds a new consigne
	 * @param data - Consigne content and metadata
	 * @returns Newly created consigne
	 */

	const addConsigne = useCallback(
		async (data: {
			content: string;
			profileType: ConsigneProfileType;
			author: string;
			authorRole: AvisAuthorRole;
		}) => {
			setIsLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 400));

			const newConsigne: Consigne = {
				id: `consigne-${Date.now()}`,
				author: data.author,
				authorRole: data.authorRole,
				content: data.content,
				profileType: data.profileType,
				createdAt: new Date().toISOString().split("T")[0],
			};

			setConsignes((prev) => [newConsigne, ...prev]);
			setIsLoading(false);
			return newConsigne;
		},
		[],
	);

	return {
		consignes,
		isLoading,
		addConsigne,
	};
}
