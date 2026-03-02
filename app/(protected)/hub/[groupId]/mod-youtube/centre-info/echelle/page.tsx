"use client";

// Features & Components
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { headingClasses, textClasses } from "@/core/design/typography";
import { definePageConfig } from "@/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]/mod-youtube/centre-info/echelle",
	section: "protected",
	module: "moderation_youtube",
	description: "Échelle de priorité de la modération YouTube.",
	requiredPermissions: [{ module: "moderation_youtube", action: "view" }],
	entityScoped: true,
});

// Data
interface Member {
	name: string;
	role: string;
}

interface HierarchyLevel {
	title: string;
	subtitle?: string;
	badgeVariant: "error" | "warning" | "info" | "primary" | "success";
	borderColor: string;
	iconBgColor: string;
	iconColor: string;
	members: Member[];
}

const HIERARCHY: HierarchyLevel[] = [
	{
		title: "Inoxtag Corp",
		badgeVariant: "error",
		borderColor: "border-l-error-500",
		iconBgColor: "bg-error-100 dark:bg-error-900/20",
		iconColor: "text-error-500",
		members: [{ name: "Jeremy", role: "Gérant des Lives" }],
	},
	{
		title: "Responsables",
		badgeVariant: "warning",
		borderColor: "border-l-warning-500",
		iconBgColor: "bg-warning-100 dark:bg-warning-900/20",
		iconColor: "text-warning-500",
		members: [
			{ name: "Procy", role: "Responsable YouTube" },
			{ name: "Andrew", role: "Responsable YouTube" },
		],
	},
	{
		title: "Coordinateurs",
		subtitle: "Modérateur expérimenté désigné avant chaque Live",
		badgeVariant: "info",
		borderColor: "border-l-info-500",
		iconBgColor: "bg-info-100 dark:bg-info-900/20",
		iconColor: "text-info-500",
		members: [
			{ name: "Reouven", role: "Coordinateur" },
			{ name: "Kayzee", role: "Coordinatrice" },
			{ name: "Tacitusk7056", role: "Coordinateur" },
			{ name: "Miabehly", role: "Coordinatrice" },
			{ name: "Polaruce", role: "Coordinateur" },
		],
	},
	{
		title: "Référents & Tuteurs",
		subtitle: "Premiers à contacter en cas de besoin",
		badgeVariant: "primary",
		borderColor: "border-l-primary-500",
		iconBgColor: "bg-primary-100 dark:bg-primary-900/20",
		iconColor: "text-primary-500",
		members: [
			{ name: "Anaelle", role: "Référente" },
			{ name: "Tacitusk7056", role: "Référent" },
			{ name: "Miabehly", role: "Référente" },
			{ name: "Emeline", role: "Référente" },
			{ name: "Reouven", role: "Référent" },
		],
	},
];

// Page

/**
 * YouTube priority scale page displaying the moderation chain of command.
 * @returns The YouTube hierarchy and priority levels view
 */
export default function EchelleYouTubePage() {
	return (
		<PageContainer title="Échelle de priorité" description="Chaîne de commandement pour la modération YouTube">
			{/* Intro banner */}
			<div className="border-info-200 bg-info-50 dark:border-info-800 dark:bg-info-900/10 mb-8 flex items-start gap-3 rounded-lg border p-4">
				<Icon name="info" size="md" className="text-info-500 mt-0.5 shrink-0" />
				<p className="text-info-700 dark:text-info-400 text-sm">
					En cas de doute sur une action de modération YouTube, remontez toujours au niveau supérieur.
					Respectez la chaîne de commandement.
				</p>
			</div>

			{/* Hierarchy timeline */}
			<div className="relative space-y-6">
				{/* Vertical connector line */}
				<div className="absolute top-0 bottom-0 left-6 hidden w-px bg-gray-200 md:block dark:bg-gray-700" />

				{HIERARCHY.map((level, idx) => (
					<div key={level.title} className="relative flex gap-0 md:gap-6">
						{/* Timeline dot — visible on md+ */}
						<div className="relative z-10 hidden md:flex">
							<div
								className={cn(
									"flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
									level.iconBgColor,
								)}
							>
								<Icon
									name={idx === 0 ? "shield" : idx === 1 ? "star" : idx === 2 ? "flag" : "users"}
									style="solid"
									size="md"
									className={level.iconColor}
								/>
							</div>
						</div>

						{/* Card */}
						<Card className={cn("flex-1 border-l-4", level.borderColor)} padding="lg">
							{/* Level header */}
							<div className="mb-4 flex flex-wrap items-center gap-3">
								{/* Mobile icon */}
								<div
									className={cn(
										"flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:hidden",
										level.iconBgColor,
									)}
								>
									<Icon
										name={idx === 0 ? "shield" : idx === 1 ? "star" : idx === 2 ? "flag" : "users"}
										style="solid"
										size="sm"
										className={level.iconColor}
									/>
								</div>

								<div>
									<h3 className={headingClasses.h5}>{level.title}</h3>
									{level.subtitle && (
										<p className={cn(textClasses.caption, "mt-0.5")}>{level.subtitle}</p>
									)}
								</div>

								<Badge variant={level.badgeVariant} showDot={false} className="ml-auto">
									Niveau {idx + 1}
								</Badge>
							</div>

							{/* Members list */}
							<div className="space-y-2">
								{level.members.map((member) => (
									<div
										key={`${member.name}-${member.role}`}
										className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-700/40"
									>
										<div
											className={cn(
												"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
												level.iconBgColor,
												level.iconColor,
											)}
										>
											{member.name.charAt(0).toUpperCase()}
										</div>
										<div className="min-w-0 flex-1">
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{member.name}
											</p>
											<p className="text-xs text-gray-400 dark:text-gray-500">{member.role}</p>
										</div>
									</div>
								))}
							</div>
						</Card>
					</div>
				))}
			</div>
		</PageContainer>
	);
}
