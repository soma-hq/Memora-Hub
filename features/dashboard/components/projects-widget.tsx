"use client";

// React
import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody, Badge, ProgressBar } from "@/components/ui";
import type { BadgeVariant } from "@/core/design/states";


/** Project item for the dashboard widget */
interface ProjectItem {
	id: string;
	name: string;
	status: string;
	progress: number;
}

/** Props for the ProjectsWidget component */
interface ProjectsWidgetProps {
	className?: string;
}

/** Badge variant mapping for project statuses */
const statusVariantMap: Record<string, BadgeVariant> = {
	"A faire": "neutral",
	"En cours": "info",
	"En pause": "warning",
	Termine: "success",
};

/** Progress bar variant mapping for project statuses */
const progressVariantMap: Record<string, "primary" | "success" | "warning" | "error" | "info"> = {
	"A faire": "primary",
	"En cours": "info",
	"En pause": "warning",
	Termine: "success",
};

/**
 * Dashboard widget showing active projects with progress bars
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @returns Project list card with progress indicators
 */
export function ProjectsWidget({ className }: ProjectsWidgetProps) {
	// State
	const [projects] = useState<ProjectItem[]>([]);

	// Render
	return (
		<Card padding="sm" className={className}>
			<CardHeader>
				<h3 className="text-base font-semibold text-gray-900 dark:text-white">Projets</h3>
				<Link
					href="/projects"
					className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors"
				>
					Voir tout
				</Link>
			</CardHeader>

			<CardBody className="divide-y divide-gray-100 py-0 dark:divide-gray-700">
				{projects.length === 0 && (
					<div className="flex items-center justify-center py-8">
						<p className="text-sm text-gray-400 dark:text-gray-500">Aucun projet en cours.</p>
					</div>
				)}

				{projects.map((project) => (
					<div key={project.id} className="py-3 first:pt-3">
						<div className="mb-2 flex items-center justify-between">
							<p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
								{project.name}
							</p>
							<Badge
								variant={statusVariantMap[project.status] || "neutral"}
								showDot
								className="ml-2 shrink-0"
							>
								{project.status}
							</Badge>
						</div>

						<ProgressBar
							value={project.progress}
							showValue
							size="sm"
							variant={progressVariantMap[project.status] || "primary"}
						/>
					</div>
				))}
			</CardBody>
		</Card>
	);
}
