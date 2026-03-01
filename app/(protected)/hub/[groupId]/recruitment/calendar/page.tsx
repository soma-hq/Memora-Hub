"use client";

// React
import { useState, useMemo } from "react";
import { useCandidates } from "@/features/recruitment/hooks";
import { decisionVariantMap } from "@/features/recruitment/types";
import { PageContainer } from "@/components/layout/page-container";
import { Button, Badge, Icon, Card } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { showSuccess } from "@/lib/utils/toast";


const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTH_NAMES = [
	"Janvier",
	"Fevrier",
	"Mars",
	"Avril",
	"Mai",
	"Juin",
	"Juillet",
	"Aout",
	"Septembre",
	"Octobre",
	"Novembre",
	"Decembre",
];

/**
 * Recruitment calendar page with month view, slot creation and interview scheduling.
 * @returns The recruitment calendar view
 */
export default function CalendarPage() {
	const { allCandidates, sessions } = useCandidates();
	const [publicView, setPublicView] = useState(false);
	const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // Feb 2026

	// Interviews with dates
	const interviews = useMemo(() => {
		return allCandidates
			.filter((c) => c.interviewDate)
			.map((c) => {
				const session = sessions.find((s) => s.id === c.sessionId);
				return {
					...c,
					sessionName: session ? `${session.type} — ${session.entity}` : "",
				};
			})
			.sort((a, b) => (a.interviewDate || "").localeCompare(b.interviewDate || ""));
	}, [allCandidates, sessions]);

	// Calendar grid
	const calendarDays = useMemo(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);

		// Adjust to start on Monday (0 = Mon in our grid)
		let startOffset = firstDay.getDay() - 1;
		if (startOffset < 0) startOffset = 6;

		const days: { date: Date | null; interviews: typeof interviews }[] = [];

		// Empty cells before first day
		for (let i = 0; i < startOffset; i++) {
			days.push({ date: null, interviews: [] });
		}

		// Days of month
		for (let d = 1; d <= lastDay.getDate(); d++) {
			const date = new Date(year, month, d);
			const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
			const dayInterviews = interviews.filter((i) => i.interviewDate === dateStr);
			days.push({ date, interviews: dayInterviews });
		}

		return days;
	}, [currentMonth, interviews]);

	const handlePrevMonth = () => {
		setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
	};

	const handleNextMonth = () => {
		setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
	};

	const handleTogglePublicView = () => {
		setPublicView(!publicView);
		if (!publicView) {
			showSuccess("Mode vue publique active");
		}
	};

	// Public view
	if (publicView) {
		return (
			<div className="min-h-screen bg-white p-8 dark:bg-gray-900">
				<div className="mx-auto max-w-4xl">
					{/* Public header */}
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Planning des entretiens</h1>
						<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
							{MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
						</p>
					</div>

					{/* Interview list (public) */}
					<div className="space-y-3">
						{interviews.map((interview) => (
							<div
								key={interview.id}
								className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
							>
								<div className="flex items-center gap-4">
									<div className="text-center">
										<p className="text-lg font-bold text-gray-900 dark:text-white">
											{interview.interviewDate?.split("-")[2]}
										</p>
										<p className="text-xs text-gray-400">
											{MONTH_NAMES[
												parseInt(interview.interviewDate?.split("-")[1] || "1") - 1
											]?.slice(0, 3)}
										</p>
									</div>
									<div>
										<p className="font-medium text-gray-900 dark:text-white">{interview.name}</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{interview.sessionName} — {interview.interviewTime || "Heure non definie"}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Recruteur : {interview.recruiter}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Exit button */}
					<div className="mt-8 text-center">
						<Button variant="ghost" size="sm" onClick={handleTogglePublicView}>
							<Icon name="close" size="xs" />
							Quitter la vue publique
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<PageContainer
			title="Calendrier"
			description="Planning des entretiens de recrutement"
			actions={
				<Button variant="outline-primary" size="sm" onClick={handleTogglePublicView}>
					<Icon name="eye" size="sm" />
					Vue publique
				</Button>
			}
		>
			{/* Month navigation */}
			<div className="mb-6 flex items-center justify-between">
				<Button variant="ghost" size="sm" onClick={handlePrevMonth}>
					<Icon name="chevronLeft" size="xs" />
				</Button>
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
					{MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
				</h2>
				<Button variant="ghost" size="sm" onClick={handleNextMonth}>
					<Icon name="chevronRight" size="xs" />
				</Button>
			</div>

			{/* Calendar grid */}
			<Card padding="sm" className="mb-8">
				{/* Day headers */}
				<div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
					{DAYS_OF_WEEK.map((day) => (
						<div
							key={day}
							className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400"
						>
							{day}
						</div>
					))}
				</div>

				{/* Days grid */}
				<div className="grid grid-cols-7">
					{calendarDays.map((day, index) => (
						<div
							key={index}
							className={cn(
								"min-h-[80px] border-r border-b border-gray-100 p-1.5 dark:border-gray-800",
								!day.date && "bg-gray-50/50 dark:bg-gray-900/30",
								day.interviews.length > 0 && "bg-primary-50/30 dark:bg-primary-900/5",
							)}
						>
							{day.date && (
								<>
									<span
										className={cn(
											"mb-1 inline-block text-xs font-medium",
											day.interviews.length > 0
												? "text-primary-600 dark:text-primary-400 font-bold"
												: "text-gray-500 dark:text-gray-400",
										)}
									>
										{day.date.getDate()}
									</span>
									{day.interviews.map((interview) => (
										<div
											key={interview.id}
											className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 mb-0.5 truncate rounded px-1 py-0.5 text-[10px] font-medium"
											title={`${interview.name} — ${interview.interviewTime || ""}`}
										>
											{interview.interviewTime && `${interview.interviewTime} `}
											{interview.name.split(" ")[0]}
										</div>
									))}
								</>
							)}
						</div>
					))}
				</div>
			</Card>

			{/* Upcoming interviews list */}
			<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Entretiens a venir</h3>
			<div className="space-y-3">
				{interviews.map((interview) => (
					<div
						key={interview.id}
						className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
					>
						<div className="flex items-center gap-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
								{interview.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</div>
							<div>
								<p className="font-medium text-gray-900 dark:text-white">{interview.name}</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">{interview.sessionName}</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="text-right">
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									{interview.interviewDate}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{interview.interviewTime || "Heure non definie"}
								</p>
							</div>
							<div className="text-right">
								<p className="text-xs text-gray-500 dark:text-gray-400">{interview.recruiter}</p>
								{interview.spectators.length > 0 && (
									<p className="text-[10px] text-gray-400 dark:text-gray-500">
										+{interview.spectators.length} spectateur
										{interview.spectators.length > 1 ? "s" : ""}
									</p>
								)}
							</div>
							{interview.finalDecision && (
								<Badge variant={decisionVariantMap[interview.finalDecision]}>
									{interview.finalDecision}
								</Badge>
							)}
						</div>
					</div>
				))}
				{interviews.length === 0 && (
					<div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
						Aucun entretien planifie.
					</div>
				)}
			</div>
		</PageContainer>
	);
}
