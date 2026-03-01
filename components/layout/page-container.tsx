"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { cn } from "@/lib/utils/cn";
import { headingClasses, textClasses } from "@/core/design/typography";


interface PageContainerProps {
	title?: string;
	description?: string;
	actions?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	hideBreadcrumbs?: boolean;
}

const ROUTE_LABELS: Record<string, string> = {
	hub: "Hub",
	projects: "Projets",
	tasks: "Tâches",
	meetings: "Réunions",
	personnel: "Personnel",
	absences: "Absences",
	planning: "Planning",
	momentum: "Momentum",
	launch: "Lancement",
	sessions: "Sessions PIM",
	space: "Espace Momentum",
	management: "Management",
	recruitment: "Talent",
	questionnaire: "Questionnaire",
	espace: "Mon espace",
	consignes: "Consignes",
	candidates: "Candidats",
	results: "Résultats",
	calendar: "Calendrier",
	admin: "Admin",
	moderation: "Modération",
	"centre-info": "Centre d'infos",
	echelle: "Échelle",
	tickets: "Tickets",
	tips: "Tips",
	sanctions: "Sanctions",
	politique: "Politique",
	"marsha-bot": "Marsha Bot",
	"mod-youtube": "Mod. YouTube",
	users: "Utilisateurs",
	groups: "Entités",
	stats: "Statistiques",
	settings: "Paramètres",
	account: "Compte",
	security: "Sécurité",
	preferences: "Préférences",
	notifications: "Notifications",
	data: "Données",
	profile: "Mon profil",
	chat: "Chat",
	alerts: "Alertes",
};

/**
 * Page layout container.
 * @param {PageContainerProps} props - Component props
 * @param {string} [props.title] - Page heading
 * @param {string} [props.description] - Page subtitle
 * @param {React.ReactNode} [props.actions] - Right-side action buttons
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.hideBreadcrumbs] - Hides auto breadcrumbs
 * @returns {JSX.Element} Page container
 */

export function PageContainer({
	title,
	description,
	actions,
	children,
	className,
	hideBreadcrumbs,
}: PageContainerProps) {
	// State
	const pathname = usePathname();

	// Computed
	const breadcrumbItems = useMemo(() => {
		const segments = pathname.split("/").filter(Boolean);
		if (segments.length <= 1) return [];

		const items: { label: string; href: string }[] = [];
		let currentPath = "";

		for (const segment of segments) {
			currentPath += `/${segment}`;

			// Skip groupId segments (dynamic route params)
			if (segments[0] === "hub" && segments.indexOf(segment) === 1) {
				continue;
			}

			const label = ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
			items.push({ label, href: currentPath });
		}

		return items;
	}, [pathname]);

	// Render
	return (
		<div className={cn("flex-1 overflow-y-auto p-4 md:p-6 lg:p-8", className)}>
			{/* Breadcrumbs */}
			{!hideBreadcrumbs && breadcrumbItems.length > 1 && (
				<div className="mb-4">
					<Breadcrumbs items={breadcrumbItems} />
				</div>
			)}

			{/* Page header */}
			{(title || actions) && (
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						{title && <h1 className={headingClasses.h3}>{title}</h1>}
						{description && <p className={cn(textClasses.description, "mt-1")}>{description}</p>}
					</div>
					{actions && <div className="flex items-center gap-3">{actions}</div>}
				</div>
			)}

			{/* Content */}
			{children}
		</div>
	);
}
