"use client";

// React
import { useState, useMemo, useCallback } from "react";
import type {

	PimSession,
	Junior,
	PimStatus,
	Dispositif,
	ModerationFunction,
	SessionStatus,
	LaunchSessionFormData,
	CompetencyLevel,
	MomentumNote,
	Remark,
	BilanRRJ,
	Formation,
} from "./types";
import { sessions as initialSessions, formations as initialFormations } from "./data";


/**
 * Manages PIM sessions with search and status filtering
 * @returns Sessions state, filters, and filtered results
 */
export function useSessions() {
	// State
	const [sessions, setSessions] = useState<PimSession[]>(initialSessions);
	const [isLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<SessionStatus | "">("");

	// Computed
	const filteredSessions = useMemo(() => {
		return sessions.filter((session) => {
			const matchesSearch =
				!search ||
				session.entity.toLowerCase().includes(search.toLowerCase()) ||
				session.juniors.some((j) => j.name.toLowerCase().includes(search.toLowerCase()));
			const matchesStatus = !statusFilter || session.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [sessions, search, statusFilter]);

	return {
		sessions,
		setSessions,
		isLoading,
		search,
		setSearch,
		statusFilter,
		setStatusFilter,
		filteredSessions,
	};
}

/**
 * Provides session-level CRUD operations (launch, close)
 * @param sessions - Current sessions state
 * @param setSessions - Sessions state setter
 * @returns Launch and close operations with loading state
 */
export function useSessionActions(
	sessions: PimSession[],
	setSessions: React.Dispatch<React.SetStateAction<PimSession[]>>,
) {
	// State
	const [isLoading, setIsLoading] = useState(false);

	// Handlers
	/**
	 * Launches a new PIM session
	 * @param data - Form data for the new session
	 * @returns The newly created session
	 */
	const launchSession = useCallback(
		async (data: LaunchSessionFormData) => {
			setIsLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 500));

			const newSession: PimSession = {
				id: `session-${Date.now()}`,
				entity: data.entity,
				startDate: data.startDate,
				status: "Active",
				juniors: [],
				createdBy: "Marsha Teams",
				createdAt: new Date().toISOString().split("T")[0],
			};

			setSessions((prev) => [newSession, ...prev]);
			setIsLoading(false);
			return newSession;
		},
		[setSessions],
	);

	/**
	 * Closes a session by setting its status to Terminee
	 * @param sessionId - ID of the session to close
	 */
	const closeSession = useCallback(
		async (sessionId: string) => {
			setIsLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 300));
			setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, status: "Terminée" as const } : s)));
			setIsLoading(false);
		},
		[setSessions],
	);

	return { launchSession, closeSession, isLoading };
}

/**
 * Manages a single PIM session detail with junior filtering and FSI mutations
 * @param sessionId - ID of the session to manage
 * @returns Session data, filtered juniors, and FSI mutation operations
 */
export function useSessionDetail(sessionId: string) {
	// State
	const [sessions, setSessions] = useState<PimSession[]>(initialSessions);
	const session = useMemo(() => sessions.find((s) => s.id === sessionId), [sessions, sessionId]);

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<PimStatus | "">("");
	const [dispositifFilter, setDispositifFilter] = useState<Dispositif | "">("");
	const [functionFilter, setFunctionFilter] = useState<ModerationFunction | "">("");

	// Computed
	const filteredJuniors = useMemo(() => {
		if (!session) return [];
		return session.juniors.filter((junior) => {
			const matchesSearch =
				!search ||
				junior.name.toLowerCase().includes(search.toLowerCase()) ||
				junior.referent.toLowerCase().includes(search.toLowerCase());
			const matchesStatus = !statusFilter || junior.pimStatus === statusFilter;
			const matchesDispositif = !dispositifFilter || junior.dispositif === dispositifFilter;
			const matchesFunction = !functionFilter || junior.function === functionFilter;
			return matchesSearch && matchesStatus && matchesDispositif && matchesFunction;
		});
	}, [session, search, statusFilter, dispositifFilter, functionFilter]);

	// Handlers
	/**
	 * Updates a competency level for a specific junior
	 * @param juniorId - ID of the junior
	 * @param competencyId - ID of the competency to update
	 * @param level - New competency level
	 */
	const updateCompetencyLevel = useCallback(
		(juniorId: string, competencyId: string, level: CompetencyLevel) => {
			setSessions((prev) =>
				prev.map((s) => {
					if (s.id !== sessionId) return s;
					return {
						...s,
						juniors: s.juniors.map((j) => {
							if (j.id !== juniorId) return j;
							return {
								...j,
								fsi: {
									...j.fsi,
									competencies: j.fsi.competencies.map((c) =>
										c.id === competencyId
											? { ...c, level, evaluatedAt: new Date().toISOString().split("T")[0] }
											: c,
									),
									lastUpdated: new Date().toISOString().split("T")[0],
								},
							};
						}),
					};
				}),
			);
		},
		[sessionId],
	);

	/**
	 * Adds a note to a junior FSI
	 * @param juniorId - ID of the junior
	 * @param note - Note data without the auto-generated ID
	 */
	const addNote = useCallback(
		(juniorId: string, note: Omit<MomentumNote, "id">) => {
			setSessions((prev) =>
				prev.map((s) => {
					if (s.id !== sessionId) return s;
					return {
						...s,
						juniors: s.juniors.map((j) => {
							if (j.id !== juniorId) return j;
							return {
								...j,
								fsi: {
									...j.fsi,
									notes: [{ ...note, id: `note-${Date.now()}` }, ...j.fsi.notes],
									lastUpdated: new Date().toISOString().split("T")[0],
								},
							};
						}),
					};
				}),
			);
		},
		[sessionId],
	);

	/**
	 * Adds a remark to a junior FSI
	 * @param juniorId - ID of the junior
	 * @param remark - Remark data without the auto-generated ID
	 */
	const addRemark = useCallback(
		(juniorId: string, remark: Omit<Remark, "id">) => {
			setSessions((prev) =>
				prev.map((s) => {
					if (s.id !== sessionId) return s;
					return {
						...s,
						juniors: s.juniors.map((j) => {
							if (j.id !== juniorId) return j;
							return {
								...j,
								fsi: {
									...j.fsi,
									remarks: [{ ...remark, id: `rmk-${Date.now()}` }, ...j.fsi.remarks],
									lastUpdated: new Date().toISOString().split("T")[0],
								},
							};
						}),
					};
				}),
			);
		},
		[sessionId],
	);

	/**
	 * Adds a bilan to a junior FSI
	 * @param juniorId - ID of the junior
	 * @param bilan - Bilan data without the auto-generated ID
	 */
	const addBilan = useCallback(
		(juniorId: string, bilan: Omit<BilanRRJ, "id">) => {
			setSessions((prev) =>
				prev.map((s) => {
					if (s.id !== sessionId) return s;
					return {
						...s,
						juniors: s.juniors.map((j) => {
							if (j.id !== juniorId) return j;
							return {
								...j,
								fsi: {
									...j.fsi,
									bilans: [{ ...bilan, id: `bilan-${Date.now()}` }, ...j.fsi.bilans],
									lastUpdated: new Date().toISOString().split("T")[0],
								},
							};
						}),
					};
				}),
			);
		},
		[sessionId],
	);

	/**
	 * Updates the PIM status of a junior
	 * @param juniorId - ID of the junior
	 * @param status - New PIM status
	 */
	const updatePimStatus = useCallback(
		(juniorId: string, status: PimStatus) => {
			setSessions((prev) =>
				prev.map((s) => {
					if (s.id !== sessionId) return s;
					return {
						...s,
						juniors: s.juniors.map((j) => (j.id === juniorId ? { ...j, pimStatus: status } : j)),
					};
				}),
			);
		},
		[sessionId],
	);

	return {
		session,
		filteredJuniors,
		search,
		setSearch,
		statusFilter,
		setStatusFilter,
		dispositifFilter,
		setDispositifFilter,
		functionFilter,
		setFunctionFilter,
		updateCompetencyLevel,
		addNote,
		addRemark,
		addBilan,
		updatePimStatus,
	};
}

/**
 * Provides the list of available training formations
 * @returns Array of formations
 */
export function useFormations() {
	// State
	const [formations] = useState<Formation[]>(initialFormations);

	return { formations };
}

/** Bilan entry for management overview */
export interface ManagementBilan {
	id: string;
	juniorName: string;
	sessionId: string;
	period: string;
	decision: string;
	summary: string;
	date: string;
}

/** Junior item with session context for management views */
export interface ManagementJuniorItem {
	junior: Junior;
	sessionId: string;
	sessionEntity: string;
}

/**
 * Provides management-level operations across all sessions
 * @param sessions - All PIM sessions
 * @returns Flattened juniors, bilans, and management operations
 */
export function useManagement(sessions: PimSession[]) {
	// State
	const [bilans, setBilans] = useState<ManagementBilan[]>([]);

	// Computed
	const allJuniors = useMemo<ManagementJuniorItem[]>(() => {
		return sessions.flatMap((session) =>
			session.juniors.map((junior) => ({
				junior,
				sessionId: session.id,
				sessionEntity: session.entity,
			})),
		);
	}, [sessions]);

	const allBilans = useMemo(() => bilans, [bilans]);

	// Handlers
	/**
	 * Adds a management-level bilan
	 * @param bilan - Bilan data without the auto-generated ID
	 */
	const addBilan = useCallback((bilan: Omit<ManagementBilan, "id">) => {
		setBilans((prev) => [{ ...bilan, id: `mgmt-bilan-${Date.now()}` }, ...prev]);
	}, []);

	/**
	 * Performs a management action on a junior (stub)
	 * @param _actionType - Type of action to perform
	 * @param _sessionId - Session containing the junior
	 * @param _juniorId - ID of the target junior
	 */
	const performAction = useCallback((_actionType: string, _sessionId: string, _juniorId: string) => {
		// In a real app this would call an API
	}, []);

	/**
	 * Adds a management remark to a junior (stub)
	 * @param _juniorId - ID of the target junior
	 * @param _remark - Remark data without the auto-generated ID
	 */
	const addManagementRemark = useCallback((_juniorId: string, _remark: Omit<Remark, "id">) => {
		// In a real app this would call an API to add the remark to the junior's FSI
	}, []);

	return {
		allJuniors,
		allBilans,
		addBilan,
		performAction,
		addManagementRemark,
	};
}
