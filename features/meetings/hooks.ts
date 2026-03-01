"use client";

// React
import { useState, useMemo, useCallback } from "react";
import { useDataStore } from "@/store/data.store";
import type { Meeting, MeetingTypeValue, MeetingFormData } from "./types";


/**
 * Checks if a meeting is upcoming based on its end time
 * @param meeting - Meeting to check
 * @returns True if the meeting end time is in the future
 */
function isUpcoming(meeting: Meeting): boolean {
	const now = new Date();
	const meetingDate = new Date(`${meeting.date}T${meeting.endTime}`);
	return meetingDate >= now;
}

/**
 * Manages meeting list state with search, type filtering, and time grouping
 * @returns Meetings state, filters, and sorted upcoming/past results
 */
export function useMeetings() {
	// State
	const storeMeetings = useDataStore((s) => s.meetings);
	const [meetings, setMeetings] = useState<Meeting[]>(storeMeetings);
	const [isLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState<MeetingTypeValue | "">("");

	// Computed
	const filteredMeetings = useMemo(() => {
		let result = [...meetings];

		if (search.trim()) {
			const query = search.toLowerCase();
			result = result.filter(
				(m) =>
					m.title.toLowerCase().includes(query) ||
					m.location.toLowerCase().includes(query) ||
					m.participants.some((p) => p.name.toLowerCase().includes(query)),
			);
		}

		if (typeFilter) {
			result = result.filter((m) => m.type === typeFilter);
		}

		result.sort((a, b) => {
			const dateA = new Date(`${a.date}T${a.startTime}`);
			const dateB = new Date(`${b.date}T${b.startTime}`);
			return dateA.getTime() - dateB.getTime();
		});

		return result;
	}, [meetings, search, typeFilter]);

	const upcomingMeetings = useMemo(() => filteredMeetings.filter(isUpcoming), [filteredMeetings]);

	const pastMeetings = useMemo(() => filteredMeetings.filter((m) => !isUpcoming(m)), [filteredMeetings]);

	return {
		meetings,
		isLoading,
		search,
		setSearch,
		typeFilter,
		setTypeFilter,
		filteredMeetings,
		upcomingMeetings,
		pastMeetings,
	};
}

/**
 * Provides CRUD actions for meeting management
 * @returns Create, update, and delete meeting functions with loading state
 */
export function useMeetingActions() {
	// State
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Creates a new meeting from form data
	 * @param data - Meeting form data
	 * @returns Newly created meeting with generated ID
	 */
	const createMeeting = useCallback(async (data: MeetingFormData): Promise<Meeting> => {
		setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 500));
		const newMeeting: Meeting = {
			...data,
			id: `mtg-${Date.now()}`,
		};
		setIsLoading(false);
		return newMeeting;
	}, []);

	/**
	 * Updates an existing meeting by ID
	 * @param id - Meeting ID to update
	 * @param data - Partial meeting form data to merge
	 * @returns Updated meeting object
	 */
	const updateMeeting = useCallback(async (id: string, data: Partial<MeetingFormData>): Promise<Meeting> => {
		setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 500));
		const updated: Meeting = {
			id,
			title: data.title ?? "",
			date: data.date ?? "",
			startTime: data.startTime ?? "",
			endTime: data.endTime ?? "",
			location: data.location ?? "",
			type: data.type ?? "reunion",
			participants: data.participants ?? [],
			notes: data.notes,
			isOnline: data.isOnline ?? false,
			link: data.link,
		};
		setIsLoading(false);
		return updated;
	}, []);

	/**
	 * Deletes a meeting by ID
	 * @param id - Meeting ID to delete
	 * @returns Nothing
	 */
	const deleteMeeting = useCallback(async (id: string): Promise<void> => {
		setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 500));
		setIsLoading(false);
	}, []);

	return {
		createMeeting,
		updateMeeting,
		deleteMeeting,
		isLoading,
	};
}
