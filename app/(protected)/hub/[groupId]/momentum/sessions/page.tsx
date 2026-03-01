"use client";

// Next.js
import { useRouter, useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState, Icon } from "@/components/ui";
import { PimSessionCard } from "@/features/momentum/components/pim-session-card";
import { useSessions } from "@/features/momentum/hooks";
import { cn } from "@/lib/utils/cn";
import type { SessionStatus } from "@/features/momentum/types";


const SESSION_STATUSES: { value: SessionStatus | ""; label: string }[] = [
	{ value: "", label: "Tous les statuts" },
	{ value: "Active", label: "Active" },
	{ value: "Terminée", label: "Terminee" },
	{ value: "Annulée", label: "Annulee" },
];

const selectClasses = cn(
	"rounded-lg border px-3 py-2 text-sm transition-colors duration-200 appearance-none",
	"border-gray-200 bg-white text-gray-700",
	"focus:border-primary-300 focus:ring-1 focus:ring-primary-300 focus:outline-none",
	"dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
	"dark:focus:border-primary-600 dark:focus:ring-primary-600",
);

/**
 * Momentum sessions list page with status filtering and navigation.
 * @returns The sessions listing page
 */
export default function MomentumSessionsPage() {
	const params = useParams();
	const groupId = params.groupId as string;
	const router = useRouter();

	// --- Hooks ---
	const { search, setSearch, statusFilter, setStatusFilter, filteredSessions } = useSessions();

	// --- Navigation vers le detail ---
	const handleSessionClick = (sessionId: string) => {
		router.push(`/hub/${groupId}/momentum/sessions/${sessionId}`);
	};

	return (
		<PageContainer title="Sessions PIM" description="Retrouvez l'ensemble des sessions PIM en cours et passees.">
			{/* Filter bar */}
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
				{/* Search */}
				<div className="relative flex-1">
					<Icon name="search" size="sm" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher une session ou un Junior..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={cn(
							"w-full rounded-lg border py-2 pr-4 pl-9 text-sm transition-colors",
							"border-gray-200 bg-white text-gray-900 placeholder-gray-400",
							"focus:border-primary-300 focus:ring-primary-300 focus:ring-1 focus:outline-none",
							"dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
							"dark:focus:border-primary-600 dark:focus:ring-primary-600",
						)}
					/>
				</div>

				{/* Status filter */}
				<div className="relative">
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value as SessionStatus | "")}
						className={selectClasses}
					>
						{SESSION_STATUSES.map((s) => (
							<option key={s.value} value={s.value}>
								{s.label}
							</option>
						))}
					</select>
					<Icon
						name="chevronDown"
						size="xs"
						className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
					/>
				</div>
			</div>

			{/* Sessions grid */}
			{filteredSessions.length === 0 ? (
				<EmptyState
					icon="folder"
					title="Aucune session trouvee"
					description="Aucune session PIM ne correspond a vos criteres de recherche."
				/>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{filteredSessions.map((session) => (
						<PimSessionCard
							key={session.id}
							session={session}
							onClick={() => handleSessionClick(session.id)}
						/>
					))}
				</div>
			)}
		</PageContainer>
	);
}
