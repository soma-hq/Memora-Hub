"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { StyledEmptyState } from "@/components/ui/display/styled-empty-state";
import { SectionHeaderBanner } from "@/components/ui/display/section-header-banner";
import { Badge, Card, Icon } from "@/components/ui";
import { definePageConfig } from "@/structures";
import { cn } from "@/lib/utils/cn";
import {
	PROGRAM_STATUS_LABELS,
	PROGRAM_PHASE_LABELS,
	PROGRAM_FUNCTION_LABELS,
	programStatusVariantMap,
	programPhaseVariantMap,
} from "@/features/programs/types";
import type { ProgramEnrollment, ProgramDefinition, ProgramTrack } from "@/features/programs/types";
import programsData from "@/core/data/programs.json";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/programs",
	section: "protected",
	module: "training",
	description: "Programmes de formation — Marsha Academy. Parcours, inscriptions et espaces de formation.",
	requiredPermissions: [{ module: "training", action: "view" }],
	entityScoped: true,
});

/**
 * Programs overview page.
 * Shows available programs, active enrollments, and training space access.
 */
export default function ProgramsPage() {
	const params = useParams();
	const groupId = params.groupId as string;

	// Static data (will be replaced with server actions)
	const programs = programsData.programs as unknown as ProgramDefinition[];
	const enrollments = programsData.enrollments as unknown as ProgramEnrollment[];
	const activeEnrollments = enrollments.filter((e) => e.status === "active" || e.status === "pending");
	const completedEnrollments = enrollments.filter((e) => e.status === "completed");

	return (
		<PageContainer>
			{/* Header */}
			<SectionHeaderBanner
				icon="book-open"
				title="Programmes de Formation"
				description="Marsha Academy — Parcours d'integration et de formation"
				accentColor="primary"
			/>

			{/* Overview stats */}
			<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
				<StatBox label="Programmes" value={programs.length} icon="BookOpen" />
				<StatBox label="Inscriptions actives" value={activeEnrollments.length} icon="Users" />
				<StatBox label="Terminees" value={completedEnrollments.length} icon="CheckCircle" />
				<StatBox
					label="Tracks disponibles"
					value={programs.reduce((acc, p) => acc + p.availableTracks.length, 0)}
					icon="Layers"
				/>
			</div>

			{/* Programs listing */}
			<section className="mt-8">
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Programmes Disponibles</h2>
				{programs.length === 0 ? (
					<StyledEmptyState
						title="Aucun programme"
						description="Aucun programme de formation n'est disponible pour le moment."
						icon="BookOpen"
					/>
				) : (
					<div className="space-y-4">
						{programs.map((program) => (
							<ProgramCard key={program.id} program={program} />
						))}
					</div>
				)}
			</section>

			{/* Active Enrollments */}
			<section className="mt-8">
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Inscriptions en cours</h2>
				{activeEnrollments.length === 0 ? (
					<StyledEmptyState
						title="Aucune inscription active"
						description="Aucun collaborateur n'est actuellement inscrit a un programme."
						icon="UserPlus"
					/>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{activeEnrollments.map((enrollment) => (
							<EnrollmentCard key={enrollment.id} enrollment={enrollment} />
						))}
					</div>
				)}
			</section>

			{/* Training Spaces (placeholder) */}
			<section className="mt-8">
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Espaces de Formation</h2>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{(programsData.trainingSpaces ?? []).map((space) => (
						<Card key={space.id} className="cursor-pointer p-4 transition-shadow hover:shadow-md">
							<div className="flex items-center gap-3">
								<div className="bg-primary-50 dark:bg-primary-900/20 flex h-10 w-10 items-center justify-center rounded-lg">
									<Icon
										name="BookOpen"
										size={20}
										className="text-primary-600 dark:text-primary-400"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
										{space.name}
									</p>
									<p className="truncate text-xs text-gray-500 dark:text-gray-400">
										{space.modules.length} module{space.modules.length > 1 ? "s" : ""}
									</p>
								</div>
								{space.isLocked && <Icon name="Lock" size={16} className="text-gray-400" />}
							</div>
						</Card>
					))}
				</div>
			</section>
		</PageContainer>
	);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatBox({ label, value, icon }: { label: string; value: number; icon: string }) {
	return (
		<Card className="p-4">
			<div className="flex items-center gap-3">
				<div className="bg-primary-50 dark:bg-primary-900/20 flex h-10 w-10 items-center justify-center rounded-lg">
					<Icon name={icon} size={20} className="text-primary-600 dark:text-primary-400" />
				</div>
				<div>
					<p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
					<p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
				</div>
			</div>
		</Card>
	);
}

function ProgramCard({ program }: { program: ProgramDefinition }) {
	return (
		<Card className="p-5">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="flex items-center gap-2">
						<h3 className="text-base font-semibold text-gray-900 dark:text-white">{program.name}</h3>
						{program.isOpen ? (
							<Badge variant="success" size="sm">
								Ouvert
							</Badge>
						) : (
							<Badge variant="neutral" size="sm">
								Ferme
							</Badge>
						)}
					</div>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{program.description}</p>
					<div className="mt-3 flex flex-wrap gap-2">
						{program.availableTracks.map((track: ProgramTrack) => (
							<Badge key={track.id} variant="info" size="sm">
								{PROGRAM_FUNCTION_LABELS[track.function] ?? track.function}
							</Badge>
						))}
					</div>
				</div>
				<div className="ml-4 text-right text-sm text-gray-500 dark:text-gray-400">
					<p>{program.defaultDurationDays} jours</p>
					<p className="text-xs">{program.availableTracks.length} parcours</p>
				</div>
			</div>
		</Card>
	);
}

function EnrollmentCard({ enrollment }: { enrollment: ProgramEnrollment }) {
	return (
		<Card className="p-4">
			<div className="mb-3 flex items-center gap-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
					{enrollment.userName.charAt(0)}
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium text-gray-900 dark:text-white">{enrollment.userName}</p>
					<p className="text-xs text-gray-500 dark:text-gray-400">{enrollment.entityId}</p>
				</div>
			</div>
			<div className="mb-2 flex items-center justify-between">
				<Badge variant={programStatusVariantMap[enrollment.status]} size="sm">
					{PROGRAM_STATUS_LABELS[enrollment.status]}
				</Badge>
				<Badge variant={programPhaseVariantMap[enrollment.currentPhase]} size="sm">
					{PROGRAM_PHASE_LABELS[enrollment.currentPhase]}
				</Badge>
			</div>
			{/* Progress bar */}
			<div className="mt-2">
				<div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
					<span>Progression</span>
					<span>{enrollment.progressPercent}%</span>
				</div>
				<div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
					<div
						className="bg-primary-500 h-full rounded-full transition-all duration-300"
						style={{ width: `${enrollment.progressPercent}%` }}
					/>
				</div>
			</div>
			<div className="mt-2 text-xs text-gray-400 dark:text-gray-500">Mentor: {enrollment.mentorName}</div>
		</Card>
	);
}
