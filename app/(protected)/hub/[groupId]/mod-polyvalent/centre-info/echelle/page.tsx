"use client";

// Features & Components
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { headingClasses, textClasses } from "@/core/design/typography";


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
		title: "Direction",
		badgeVariant: "error",
		borderColor: "border-l-error-500",
		iconBgColor: "bg-error-100 dark:bg-error-900/20",
		iconColor: "text-error-500",
		members: [{ name: "Jeremy", role: "Responsable Moderation Polyvalente" }],
	},
	{
		title: "Responsables",
		subtitle: "Superviseurs cross-plateforme Discord & Twitch",
		badgeVariant: "warning",
		borderColor: "border-l-warning-500",
		iconBgColor: "bg-warning-100 dark:bg-warning-900/20",
		iconColor: "text-warning-500",
		members: [
			{ name: "Procy", role: "Responsable Discord & Twitch" },
			{ name: "Andrew", role: "Responsable Discord & Twitch" },
		],
	},
	{
		title: "Coordinateurs",
		subtitle: "Moderateurs experimentes coordonnant les deux plateformes",
		badgeVariant: "info",
		borderColor: "border-l-info-500",
		iconBgColor: "bg-info-100 dark:bg-info-900/20",
		iconColor: "text-info-500",
		members: [
			{ name: "Reouven", role: "Coordinateur Polyvalent" },
			{ name: "Kayzee", role: "Coordinatrice Polyvalente" },
			{ name: "Tacitusk7056", role: "Coordinateur Polyvalent" },
			{ name: "Miabehly", role: "Coordinatrice Polyvalente" },
			{ name: "Polaruce", role: "Coordinateur Polyvalent" },
		],
	},
	{
		title: "Referents & Tuteurs",
		subtitle: "Premiers a contacter en cas de besoin sur Discord ou Twitch",
		badgeVariant: "primary",
		borderColor: "border-l-primary-500",
		iconBgColor: "bg-primary-100 dark:bg-primary-900/20",
		iconColor: "text-primary-500",
		members: [
			{ name: "Anaelle", role: "Referente Discord & Twitch" },
			{ name: "Tacitusk7056", role: "Referent Discord & Twitch" },
			{ name: "Miabehly", role: "Referente Discord & Twitch" },
			{ name: "Emeline", role: "Referente Discord & Twitch" },
			{ name: "Reouven", role: "Referent Discord & Twitch" },
		],
	},
];

// Page

/**
 * Cross-platform priority scale page displaying the moderation chain of command.
 * @returns The polyvalent hierarchy and priority levels view
 */
export default function EchellePolyvalentPage() {
	return (
		<PageContainer
			title="Echelle de priorite"
			description="Chaine de commandement pour la moderation polyvalente Twitch & Discord"
		>
			{/* Platform indicator */}
			<div className="mb-6 flex items-center gap-2">
				<Badge variant="info" showDot={false}>
					Discord
				</Badge>
				<Badge variant="primary" showDot={false}>
					Twitch
				</Badge>
			</div>

			{/* Intro banner */}
			<div className="border-info-200 bg-info-50 dark:border-info-800 dark:bg-info-900/10 mb-8 flex items-start gap-3 rounded-lg border p-4">
				<Icon name="info" size="md" className="text-info-500 mt-0.5 shrink-0" />
				<p className="text-info-700 dark:text-info-400 text-sm">
					En cas de doute sur une action de moderation sur Discord ou Twitch, remontez toujours au niveau
					superieur. La chaine de commandement est identique pour les deux plateformes.
				</p>
			</div>

			{/* Hierarchy timeline */}
			<div className="relative space-y-6">
				{/* Vertical connector line */}
				<div className="absolute top-0 bottom-0 left-6 hidden w-px bg-gray-200 md:block dark:bg-gray-700" />

				{HIERARCHY.map((level, idx) => (
					<div key={level.title} className="relative flex gap-0 md:gap-6">
						{/* Timeline dot -- visible on md+ */}
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
