"use client";

// Components
import { Card, Button, Icon } from "@/components/ui";
import { useDashboardStats } from "@/features/dashboard/hooks";


/** Props for the WelcomeBanner component */
interface WelcomeBannerProps {
	userName: string;
	className?: string;
	onNewTask?: () => void;
	onPlan?: () => void;
}

/**
 * Returns a time-based greeting in French
 * @returns Greeting string based on the current hour
 */
function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Bonjour";
	if (hour < 18) return "Bon apres-midi";
	return "Bonsoir";
}

/**
 * Returns today's date formatted in French locale
 * @returns Formatted date string with weekday, month, day, and year
 */
function getFormattedDate(): string {
	return new Date().toLocaleDateString("fr-FR", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/**
 * Dashboard welcome banner with greeting, quick stats, and action buttons
 * @param props - Component props
 * @param props.userName - Display name for the user
 * @param props.className - Additional CSS classes
 * @param props.onNewTask - Callback to create a new task
 * @param props.onPlan - Callback to open the planner
 * @returns Welcome banner card
 */
export function WelcomeBanner({ userName, className, onNewTask, onPlan }: WelcomeBannerProps) {
	// State
	const { stats } = useDashboardStats();

	// Computed
	const quickStats = [
		{ label: "Projets", value: stats.projects.value, icon: stats.projects.icon },
		{ label: "Taches", value: stats.tasks.value, icon: stats.tasks.icon },
		{ label: "Reunions", value: stats.meetings.value, icon: stats.meetings.icon },
	] as const;

	// Render
	return (
		<Card padding="lg" className={className}>
			<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						{getGreeting()}, {userName}
					</h1>
					<p className="mt-1 text-sm text-gray-500 capitalize dark:text-gray-400">{getFormattedDate()}</p>

					<div className="mt-4 flex items-center gap-4">
						{quickStats.map((qs) => (
							<div
								key={qs.label}
								className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300"
							>
								<Icon name={qs.icon} size="sm" className="text-gray-500 dark:text-gray-400" />
								<span className="font-semibold text-gray-900 dark:text-white">{qs.value}</span>
								<span>{qs.label}</span>
							</div>
						))}
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-2">
					<Button variant="primary" size="sm" onClick={onNewTask}>
						<Icon name="plus" size="sm" />
						Nouvelle tache
					</Button>
					<Button variant="outline-neutral" size="sm" onClick={onPlan}>
						<Icon name="calendar" size="sm" />
						Planifier
					</Button>
				</div>
			</div>
		</Card>
	);
}
