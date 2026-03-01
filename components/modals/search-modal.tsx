"use client";

// React
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";

interface SearchResult {
	id: string;
	title: string;
	description?: string;
	icon: IconName;
	href: string;
	category: string;
}

const searchData: SearchResult[] = [
	{
		id: "p1",
		title: "Dashboard",
		description: "Vue d'ensemble",
		icon: "home",
		href: "/hub/default",
		category: "Pages",
	},
	{
		id: "p2",
		title: "Projets",
		description: "Gestion des projets",
		icon: "folder",
		href: "/hub/default/projects",
		category: "Pages",
	},
	{
		id: "p3",
		title: "Taches",
		description: "Suivi des taches",
		icon: "tasks",
		href: "/hub/default/tasks",
		category: "Pages",
	},
	{
		id: "p4",
		title: "Reunions",
		description: "Calendrier des reunions",
		icon: "calendar",
		href: "/hub/default/meetings",
		category: "Pages",
	},
	{
		id: "pe1",
		title: "Absences",
		description: "Gerer mes absences",
		icon: "absence",
		href: "/hub/default/personnel/absences",
		category: "Personnel",
	},
	{
		id: "pe2",
		title: "Planning",
		description: "Mon planning personnel",
		icon: "calendar",
		href: "/hub/default/personnel/planning",
		category: "Personnel",
	},
	{
		id: "pe3",
		title: "Mes projets",
		description: "Projets assignes",
		icon: "folder",
		href: "/hub/default/personnel/projects",
		category: "Personnel",
	},
	{
		id: "pe4",
		title: "Mes taches",
		description: "Taches assignees",
		icon: "tasks",
		href: "/hub/default/personnel/tasks",
		category: "Personnel",
	},
	{
		id: "m1",
		title: "Lancement PIM",
		description: "Lancer une session PIM",
		icon: "sparkles",
		href: "/hub/default/momentum/launch",
		category: "Momentum",
	},
	{
		id: "m2",
		title: "Sessions PIM",
		description: "Suivi des sessions PIM",
		icon: "training",
		href: "/hub/default/momentum/sessions",
		category: "Momentum",
	},
	{
		id: "m3",
		title: "Espace Momentum",
		description: "Referentiel interne Momentum",
		icon: "document",
		href: "/hub/default/momentum/space",
		category: "Momentum",
	},
	{
		id: "m4",
		title: "Management",
		description: "Espace Marsha & Legacy",
		icon: "shield",
		href: "/hub/default/momentum/management",
		category: "Momentum",
	},
	{
		id: "t1",
		title: "Sessions Talent",
		description: "Sessions de recrutement",
		icon: "recruitment",
		href: "/hub/default/recruitment",
		category: "Talent",
	},
	{
		id: "t2",
		title: "Mon espace",
		description: "Dashboard recruteur",
		icon: "profile",
		href: "/hub/default/recruitment/espace",
		category: "Talent",
	},
	{
		id: "t3",
		title: "Consignes",
		description: "Directives des Responsables",
		icon: "document",
		href: "/hub/default/recruitment/consignes",
		category: "Talent",
	},
	{
		id: "t4",
		title: "Candidats",
		description: "Listing des candidats",
		icon: "users",
		href: "/hub/default/recruitment/candidates",
		category: "Talent",
	},
	{
		id: "t5",
		title: "Resultats",
		description: "Kanban des decisions",
		icon: "stats",
		href: "/hub/default/recruitment/results",
		category: "Talent",
	},
	{
		id: "t6",
		title: "Calendrier",
		description: "Planning des entretiens",
		icon: "calendar",
		href: "/hub/default/recruitment/calendar",
		category: "Talent",
	},
	{
		id: "t7",
		title: "Admin Talent",
		description: "Vue d'ensemble recrutement",
		icon: "shield",
		href: "/hub/default/recruitment/admin",
		category: "Talent",
	},
	{
		id: "a1",
		title: "Utilisateurs",
		description: "Gestion des membres",
		icon: "users",
		href: "/users",
		category: "Pages",
	},
	{
		id: "a2",
		title: "Entites",
		description: "Gestion des organisations",
		icon: "group",
		href: "/admin/access",
		category: "Pages",
	},
	{
		id: "a3",
		title: "Statistiques",
		description: "Metriques de la plateforme",
		icon: "stats",
		href: "/stats",
		category: "Pages",
	},
	{
		id: "a4",
		title: "Mon profil",
		description: "Informations personnelles",
		icon: "profile",
		href: "/profile",
		category: "Pages",
	},
	{
		id: "a5",
		title: "Parametres",
		description: "Configuration du compte",
		icon: "settings",
		href: "/settings/account",
		category: "Pages",
	},
	{
		id: "proj1",
		title: "Refonte Site Web",
		description: "Projet en cours",
		icon: "folder",
		href: "/hub/default/projects",
		category: "Projets",
	},
	{
		id: "proj2",
		title: "App Mobile V2",
		description: "Projet en cours",
		icon: "folder",
		href: "/hub/default/projects",
		category: "Projets",
	},
	{
		id: "proj3",
		title: "API Partenaires",
		description: "Projet en cours",
		icon: "folder",
		href: "/hub/default/projects",
		category: "Projets",
	},
	{
		id: "adm1",
		title: "Admin Dashboard",
		description: "Interface d'administration",
		icon: "shield",
		href: "/admin",
		category: "Admin",
	},
	{
		id: "adm2",
		title: "Gestion des acces",
		description: "Permissions et acces",
		icon: "shield",
		href: "/admin/access",
		category: "Admin",
	},
	{
		id: "adm3",
		title: "Generation de liens",
		description: "Creer des liens d'invitation",
		icon: "globe",
		href: "/admin/links",
		category: "Admin",
	},
	{
		id: "adm4",
		title: "Statistiques avancees",
		description: "Metriques detaillees",
		icon: "stats",
		href: "/admin/stats",
		category: "Admin",
	},
	{
		id: "adm5",
		title: "Outils developpeur",
		description: "Debug et outils dev",
		icon: "tools",
		href: "/admin/dev",
		category: "Admin",
	},
	{
		id: "adm6",
		title: "Corbeille",
		description: "Membres supprimes",
		icon: "close",
		href: "/admin/trash",
		category: "Admin",
	},
	{
		id: "u1",
		title: "Luzrod",
		description: "Marsha Team -- Doigby",
		icon: "profile",
		href: "/users/u1",
		category: "Utilisateurs",
	},
	{
		id: "u2",
		title: "Procy",
		description: "Legacy -- Bazalthe",
		icon: "profile",
		href: "/users/u2",
		category: "Utilisateurs",
	},
	{
		id: "u3",
		title: "Andrew",
		description: "Legacy -- Bazalthe",
		icon: "profile",
		href: "/users/u3",
		category: "Utilisateurs",
	},
	{
		id: "u4",
		title: "Witt",
		description: "Marsha Team -- Bazalthe",
		icon: "profile",
		href: "/users/u4",
		category: "Utilisateurs",
	},
];

const recentVisits: SearchResult[] = [
	{
		id: "rv1",
		title: "Dashboard",
		description: "Derniere visite il y a 5 min",
		icon: "home",
		href: "/hub/default",
		category: "Dernieres visites",
	},
	{
		id: "rv2",
		title: "Projets",
		description: "Derniere visite il y a 15 min",
		icon: "folder",
		href: "/hub/default/projects",
		category: "Dernieres visites",
	},
	{
		id: "rv3",
		title: "Reunions",
		description: "Derniere visite il y a 1h",
		icon: "calendar",
		href: "/hub/default/meetings",
		category: "Dernieres visites",
	},
	{
		id: "rv4",
		title: "Utilisateurs",
		description: "Derniere visite il y a 2h",
		icon: "users",
		href: "/users",
		category: "Dernieres visites",
	},
	{
		id: "rv5",
		title: "Mon profil",
		description: "Derniere visite hier",
		icon: "profile",
		href: "/profile",
		category: "Dernieres visites",
	},
];

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

/**
 * Command palette modal with keyboard navigation and category-grouped results.
 * @param {SearchModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Callback to close the modal
 * @returns {JSX.Element | null} Search modal or null when closed
 */
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
	// State
	const [query, setQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;
	const router = useRouter();

	// Computed
	const displayItems =
		query.length > 0
			? searchData.filter(
					(item) =>
						item.title.toLowerCase().includes(query.toLowerCase()) ||
						item.description?.toLowerCase().includes(query.toLowerCase()),
				)
			: recentVisits;

	const grouped = displayItems.reduce<Record<string, SearchResult[]>>((acc, item) => {
		if (!acc[item.category]) acc[item.category] = [];
		acc[item.category].push(item);
		return acc;
	}, {});

	// Reset state when modal opens
	useEffect(() => {
		if (!isOpen) return;
		setQuery("");
		setSelectedIndex(0);
		setTimeout(() => inputRef.current?.focus(), 50);
	}, [isOpen]);

	// Handlers
	/**
	 * Handles arrow key and enter navigation within results.
	 * @param {React.KeyboardEvent} e - Keyboard event
	 * @returns {void}
	 */
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev + 1) % displayItems.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
		} else if (e.key === "Enter" && displayItems[selectedIndex]) {
			router.push(displayItems[selectedIndex].href);
			onClose();
		}
	};

	// Global Ctrl+K shortcut to close
	useEffect(() => {
		/**
		 * Closes the modal on Ctrl+K when already open.
		 * @param {KeyboardEvent} e - Native keyboard event
		 * @returns {void}
		 */
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				if (isOpen) onCloseRef.current();
			}
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [isOpen]);

	if (!isOpen) return null;

	// Render
	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
			{/* Blurred overlay */}
			<div
				className="animate-fade-in fixed inset-0 z-0 bg-black/40 backdrop-blur-sm dark:bg-black/70"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="animate-scale-in relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
				{/* Search input */}
				<div className="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-700">
					<Icon name="search" size="md" className="shrink-0 text-gray-500 dark:text-gray-400" />
					<input
						ref={inputRef}
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setSelectedIndex(0);
						}}
						onKeyDown={handleKeyDown}
						placeholder="Rechercher pages, projets, utilisateurs..."
						className="flex-1 bg-transparent py-4 text-base text-gray-900 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-500"
					/>
					<kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500">
						Esc
					</kbd>
				</div>

				{/* Results */}
				<div className="max-h-80 overflow-y-auto p-2">
					{Object.entries(grouped).map(([category, items]) => (
						<div key={category}>
							<p
								className={cn(
									"px-3 py-1.5 text-xs font-semibold tracking-wider uppercase",
									category === "Admin"
										? "text-red-500 dark:text-red-400"
										: "text-gray-500 dark:text-gray-400",
								)}
							>
								{category}
							</p>
							{items.map((item) => {
								const idx = displayItems.indexOf(item);
								return (
									<button
										key={item.id}
										onClick={() => {
											router.push(item.href);
											onClose();
										}}
										onMouseEnter={() => setSelectedIndex(idx)}
										className={cn(
											"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
											idx === selectedIndex
												? item.category === "Admin"
													? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
													: "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
												: "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50",
										)}
									>
										<Icon
											name={item.icon}
											size="md"
											className={
												idx === selectedIndex
													? item.category === "Admin"
														? "text-red-500"
														: "text-primary-500"
													: "text-gray-500 dark:text-gray-400"
											}
										/>
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium">{item.title}</p>
											{item.description && (
												<p className="truncate text-xs text-gray-500 dark:text-gray-400">
													{item.description}
												</p>
											)}
										</div>
										{idx === selectedIndex && (
											<span className="text-xs text-gray-500 dark:text-gray-400">Entree</span>
										)}
									</button>
								);
							})}
						</div>
					))}

					{displayItems.length === 0 && (
						<div className="flex flex-col items-center py-8 text-gray-500 dark:text-gray-400">
							<Icon name="search" size="xl" className="mb-2 text-gray-400 dark:text-gray-500" />
							<p className="text-sm">Aucun resultat pour &ldquo;{query}&rdquo;</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex items-center gap-4 border-t border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
					<span className="flex items-center gap-1">
						<kbd className="rounded border border-gray-300 px-1 dark:border-gray-600">&#8593;&#8595;</kbd>{" "}
						Naviguer
					</span>
					<span className="flex items-center gap-1">
						<kbd className="rounded border border-gray-300 px-1 dark:border-gray-600">&#8629;</kbd> Ouvrir
					</span>
					<span className="flex items-center gap-1">
						<kbd className="rounded border border-gray-300 px-1 dark:border-gray-600">esc</kbd> Fermer
					</span>
				</div>
			</div>
		</div>
	);
}
