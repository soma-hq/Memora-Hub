"use client";

// React
import { useState } from "react";
import { Input, SelectMenu, Tabs, Icon, EmptyState } from "@/components/ui";
import type { SelectMenuOption } from "@/components/ui";
import { MeetingCard } from "./meeting-card";
import { cn } from "@/lib/utils/cn";
import { useMeetings } from "../hooks";
import { MeetingTypeLabel } from "../types";
import type { Meeting } from "../types";


/** Type filter options including a "show all" entry */
const TYPE_OPTIONS: SelectMenuOption[] = [
	{ label: "Tous les types", value: "", icon: "filter" },
	...Object.entries(MeetingTypeLabel).map(
		([value, label]) => ({ label, value, icon: "calendar" }) as SelectMenuOption,
	),
];

/** Props for the MeetingList component */
interface MeetingListProps {
	onMeetingClick?: (meeting: Meeting) => void;
	className?: string;
}

/**
 * Filterable meeting list with tabs for upcoming and past meetings
 * @param props - Component props
 * @param props.onMeetingClick - Callback when a meeting card is clicked
 * @param props.className - Additional CSS classes
 * @returns Meeting list with search, type filter, and time tabs
 */
export function MeetingList({ onMeetingClick, className }: MeetingListProps) {
	// State
	const { isLoading, search, setSearch, typeFilter, setTypeFilter, upcomingMeetings, pastMeetings } = useMeetings();
	const [activeTab, setActiveTab] = useState<string>("upcoming");

	// Computed
	const displayedMeetings = activeTab === "upcoming" ? upcomingMeetings : pastMeetings;

	// Render
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
				<div className="flex-1">
					<Input
						placeholder="Rechercher une reunion..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						icon={<Icon name="search" size="sm" />}
					/>
				</div>
				<div className="w-full sm:w-48">
					<SelectMenu
						options={TYPE_OPTIONS}
						value={typeFilter}
						onChange={(val) => setTypeFilter(val as typeof typeFilter)}
						placeholder="Type de reunion"
					/>
				</div>
			</div>

			<Tabs
				tabs={[
					{ id: "upcoming", label: "A venir", count: upcomingMeetings.length },
					{ id: "past", label: "Passees", count: pastMeetings.length },
				]}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<div className="border-primary-200 border-t-primary-500 h-8 w-8 animate-spin rounded-full border-4" />
				</div>
			) : displayedMeetings.length === 0 ? (
				<EmptyState
					icon="calendar"
					title={activeTab === "upcoming" ? "Aucune reunion a venir" : "Aucune reunion passee"}
					description={
						search || typeFilter
							? "Essayez de modifier vos filtres de recherche."
							: activeTab === "upcoming"
								? "Planifiez votre prochaine reunion pour la voir ici."
								: "Les reunions passees apparaitront ici."
					}
				/>
			) : (
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{displayedMeetings.map((meeting) => (
						<MeetingCard key={meeting.id} meeting={meeting} onClick={onMeetingClick} />
					))}
				</div>
			)}
		</div>
	);
}
