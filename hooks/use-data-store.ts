"use client";

import { useMemo } from "react";
import { useDataStore } from "@/store/data.store";


/**
 * Convenience hook that returns all user-scoped relations from the data store.
 * @param userId - The user identifier to query
 * @returns User profile, projects (active/archived), tasks (active/archived),
 *          meetings (upcoming/past), and absences for the given user
 */
export function useUserRelations(userId: string) {
	const getUserById = useDataStore((s) => s.getUserById);
	const getUserProjects = useDataStore((s) => s.getUserProjects);
	const getUserTasks = useDataStore((s) => s.getUserTasks);
	const getUserMeetings = useDataStore((s) => s.getUserMeetings);
	const getUserAbsences = useDataStore((s) => s.getUserAbsences);

	return useMemo(
		() => ({
			user: getUserById(userId),
			projects: getUserProjects(userId),
			tasks: getUserTasks(userId),
			meetings: getUserMeetings(userId),
			absences: getUserAbsences(userId),
		}),
		[userId, getUserById, getUserProjects, getUserTasks, getUserMeetings, getUserAbsences],
	);
}
