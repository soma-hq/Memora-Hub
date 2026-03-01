"use client";

// React
import { useState, useCallback } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Button, Tag } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { showSuccess } from "@/lib/utils/toast";


interface GeneratedLink {
	id: string;
	url: string;
	type: "invitation" | "partage" | "temporaire";
	entity: string;
	generatedBy: string;
	created: string;
	expiration: string;
	status: "active" | "expired";
	firstConnection: boolean;
}

const initialLinks: GeneratedLink[] = [
	{
		id: "lnk-001",
		url: "https://memora.bzl.sh/invite/a8f2e1d4",
		type: "invitation",
		entity: "Bazalthe",
		generatedBy: "Jeremy Alpha",
		created: "2026-02-24",
		expiration: "2026-03-24",
		status: "active",
		firstConnection: true,
	},
	{
		id: "lnk-002",
		url: "https://memora.bzl.sh/share/c3b9f7a2",
		type: "partage",
		entity: "Inoxtag",
		generatedBy: "Jeremy Alpha",
		created: "2026-02-20",
		expiration: "2026-02-27",
		status: "active",
		firstConnection: false,
	},
	{
		id: "lnk-003",
		url: "https://memora.bzl.sh/tmp/f1e8d6c0",
		type: "temporaire",
		entity: "Michou",
		generatedBy: "Jeremy Alpha",
		created: "2026-02-10",
		expiration: "2026-02-11",
		status: "expired",
		firstConnection: false,
	},
	{
		id: "lnk-004",
		url: "https://memora.bzl.sh/invite/b7d4a9e3",
		type: "invitation",
		entity: "Doigby",
		generatedBy: "Jeremy Alpha",
		created: "2026-02-18",
		expiration: "Permanent",
		status: "active",
		firstConnection: false,
	},
	{
		id: "lnk-005",
		url: "https://memora.bzl.sh/share/e4c1a7f9",
		type: "partage",
		entity: "Anthony",
		generatedBy: "Jeremy Alpha",
		created: "2026-02-25",
		expiration: "2026-03-04",
		status: "active",
		firstConnection: false,
	},
];

const linkTypeOptions = [
	{ value: "invitation", label: "Invitation" },
	{ value: "partage", label: "Partage" },
	{ value: "temporaire", label: "Accès temporaire" },
];

const entityOptions = [
	{ value: "bazalthe", label: "Bazalthe" },
	{ value: "inoxtag", label: "Inoxtag" },
	{ value: "michou", label: "Michou" },
	{ value: "doigby", label: "Doigby" },
	{ value: "anthony", label: "Anthony" },
];

const expirationOptions = [
	{ value: "24h", label: "24 heures" },
	{ value: "7j", label: "7 jours" },
	{ value: "30j", label: "30 jours" },
	{ value: "permanent", label: "Permanent" },
];

const typeColors: Record<string, { color: "info" | "success" | "warning"; label: string }> = {
	invitation: { color: "info", label: "Invitation" },
	partage: { color: "success", label: "Partage" },
	temporaire: { color: "warning", label: "Temporaire" },
};

type FilterTab = "tous" | "invitation" | "partage" | "temporaire";

const filterTabs: { value: FilterTab; label: string }[] = [
	{ value: "tous", label: "Tous" },
	{ value: "invitation", label: "Invitation" },
	{ value: "partage", label: "Partage" },
	{ value: "temporaire", label: "Temporaire" },
];

const generatorNames = ["Jeremy Alpha", "Admin", "Bazalthe", "System"];

const selectClasses = cn(
	"w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
	"text-gray-700 shadow-sm transition-all duration-200",
	"focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500",
	"dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
);

/**
 * Generates a random alphanumeric hash for link URLs.
 * @returns An 8-character random hash string
 */
function generateMockHash(): string {
	return Math.random().toString(36).substring(2, 10);
}

/**
 * Computes the expiration date from a preset duration string.
 * @param exp - Expiration preset (24h, 7j, 30j, permanent)
 * @returns Formatted expiration date or Permanent
 */
function getExpirationDate(exp: string): string {
	if (exp === "permanent") return "Permanent";
	const now = new Date();
	if (exp === "24h") now.setDate(now.getDate() + 1);
	if (exp === "7j") now.setDate(now.getDate() + 7);
	if (exp === "30j") now.setDate(now.getDate() + 30);
	return now.toISOString().split("T")[0];
}

/** @returns Today's date as YYYY-MM-DD */
function getTodayString(): string {
	return new Date().toISOString().split("T")[0];
}

/**
 * @param url - Full URL string
 * @param maxLength - Maximum display length before truncation
 * @returns Truncated URL with ellipsis
 */
function truncateUrl(url: string, maxLength: number = 38): string {
	if (url.length <= maxLength) return url;
	return url.substring(0, maxLength) + "...";
}

/**
 * Generated links management page for invitations, shares and temporary URLs.
 * @returns The links management page
 */
export default function AdminLinksPage() {
	const [links, setLinks] = useState<GeneratedLink[]>(initialLinks);
	const [linkType, setLinkType] = useState("invitation");
	const [entity, setEntity] = useState("bazalthe");
	const [expiration, setExpiration] = useState("7j");
	const [firstConnection, setFirstConnection] = useState(false);
	const [activeFilter, setActiveFilter] = useState<FilterTab>("tous");

	/** @param value - New link type, resets firstConnection if not invitation */
	const handleTypeChange = useCallback((value: string) => {
		setLinkType(value);
		if (value !== "invitation") {
			setFirstConnection(false);
		}
	}, []);

	/** Generates a new mock link and prepends it to the list */
	const handleGenerate = useCallback(() => {
		const hash = generateMockHash();
		const prefixMap: Record<string, string> = {
			invitation: "invite",
			partage: "share",
			temporaire: "tmp",
		};
		const entityLabel = entityOptions.find((e) => e.value === entity)?.label ?? entity;
		const randomGenerator = generatorNames[Math.floor(Math.random() * generatorNames.length)];

		const newLink: GeneratedLink = {
			id: `lnk-${Date.now()}`,
			url: `https://memora.bzl.sh/${prefixMap[linkType]}/${hash}`,
			type: linkType as GeneratedLink["type"],
			entity: entityLabel,
			generatedBy: randomGenerator,
			created: getTodayString(),
			expiration: getExpirationDate(expiration),
			status: "active",
			firstConnection: linkType === "invitation" ? firstConnection : false,
		};

		setLinks((prev) => [newLink, ...prev]);
		showSuccess(`Lien ${typeColors[linkType].label.toLowerCase()} généré pour ${entityLabel}`);
	}, [linkType, entity, expiration, firstConnection]);

	/** @param url - URL to copy to clipboard */
	const handleCopy = useCallback((url: string) => {
		navigator.clipboard
			.writeText(url)
			.then(() => {
				showSuccess("Lien copié dans le presse-papiers");
			})
			.catch(() => {
				showSuccess("Lien copié dans le presse-papiers");
			});
	}, []);

	/** @param id - Link ID to remove from the list */
	const handleDelete = useCallback((id: string) => {
		setLinks((prev) => prev.filter((link) => link.id !== id));
		showSuccess("Lien supprimé");
	}, []);

	const filteredLinks = activeFilter === "tous" ? links : links.filter((link) => link.type === activeFilter);

	return (
		<PageContainer title="Générateur de liens" description="Créer et gérer les liens d'invitation et de partage">
			{/* Generator form */}
			<Card padding="lg" className="mb-8 border-l-4 border-l-red-500">
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
					<Icon name="globe" size="sm" className="mr-2 inline-block text-red-500" />
					Nouveau lien
				</h2>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					{/* Link type */}
					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type de lien</label>
						<select
							value={linkType}
							onChange={(e) => handleTypeChange(e.target.value)}
							className={selectClasses}
						>
							{linkTypeOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					{/* Entity */}
					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-gray-700 dark:text-gray-300">Entité</label>
						<select value={entity} onChange={(e) => setEntity(e.target.value)} className={selectClasses}>
							{entityOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					{/* Expiration */}
					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiration</label>
						<select
							value={expiration}
							onChange={(e) => setExpiration(e.target.value)}
							className={selectClasses}
						>
							{expirationOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* First connection toggle — only for invitation type */}
				{linkType === "invitation" && (
					<div className="mt-4 flex items-center gap-3">
						<button
							type="button"
							role="switch"
							aria-checked={firstConnection}
							onClick={() => setFirstConnection((prev) => !prev)}
							className={cn(
								"relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
								firstConnection ? "bg-red-500" : "bg-gray-300 dark:bg-gray-600",
							)}
						>
							<span
								className={cn(
									"pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
									firstConnection ? "translate-x-4" : "translate-x-0",
								)}
							/>
						</button>
						<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Activer la première connexion
						</label>
						<span className="text-xs text-gray-500 dark:text-gray-400">
							Le lien déclenchera le parcours d&apos;onboarding
						</span>
					</div>
				)}

				<div className="mt-6">
					<Button variant="outline-danger" onClick={handleGenerate}>
						<Icon name="globe" size="sm" className="mr-2" />
						Générer
					</Button>
				</div>
			</Card>

			{/* Filter tabs — profile-style underline in red */}
			<div className="mb-6 border-b border-gray-200 dark:border-gray-700">
				<nav className="-mb-px flex gap-1 overflow-x-auto">
					{filterTabs.map((tab) => {
						const isActive = activeFilter === tab.value;
						const count =
							tab.value === "tous" ? links.length : links.filter((l) => l.type === tab.value).length;

						return (
							<button
								key={tab.value}
								onClick={() => setActiveFilter(tab.value)}
								className={cn(
									"flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200",
									isActive
										? "border-red-500 text-red-600 dark:text-red-400"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
								)}
							>
								{tab.label}
								<span
									className={cn(
										"rounded-full px-1.5 py-0.5 text-xs",
										isActive
											? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
											: "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
									)}
								>
									{count}
								</span>
							</button>
						);
					})}
				</nav>
			</div>

			{/* Generated links table */}
			<div>
				<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
					Liens générés
					<Badge variant="neutral" showDot={false} className="ml-2">
						{filteredLinks.length}
					</Badge>
				</h2>

				{/* Table header */}
				<div
					className={cn(
						"mb-2 hidden items-center gap-4 rounded-lg bg-gray-50 px-4 py-2.5 text-xs font-semibold tracking-wider text-gray-500 uppercase md:flex",
						"dark:bg-gray-800/50 dark:text-gray-400",
					)}
				>
					<span className="min-w-0 flex-1">Lien</span>
					<span className="w-24">Type</span>
					<span className="w-24">Entité</span>
					<span className="w-24">Généré par</span>
					<span className="w-24">Créé le</span>
					<span className="w-24">Expiration</span>
					<span className="w-20 text-center">1ère co.</span>
					<span className="w-24 text-right">Actions</span>
				</div>

				{/* Empty state */}
				{filteredLinks.length === 0 && (
					<Card padding="lg" className="text-center">
						<Icon name="globe" size="lg" className="mx-auto mb-2 text-gray-400" />
						<p className="text-sm text-gray-500 dark:text-gray-400">Aucun lien pour ce filtre.</p>
					</Card>
				)}

				{/* Rows */}
				<div className="space-y-2">
					{filteredLinks.map((link) => {
						const typeInfo = typeColors[link.type];
						return (
							<Card
								key={link.id}
								padding="md"
								className={cn(
									"border-l-2 transition-all duration-150",
									link.status === "active"
										? "border-l-red-400 dark:border-l-red-500"
										: "border-l-gray-300 dark:border-l-gray-600",
								)}
							>
								<div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
									{/* URL with inline copy */}
									<div className="flex min-w-0 flex-1 items-center gap-2">
										<code className="block truncate rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
											{truncateUrl(link.url)}
										</code>
										<button
											onClick={() => handleCopy(link.url)}
											className={cn(
												"shrink-0 rounded-md p-1 transition-colors",
												"text-gray-400 hover:bg-red-50 hover:text-red-500",
												"dark:hover:bg-red-900/20 dark:hover:text-red-400",
											)}
											title="Copier le lien"
										>
											<Icon name="document" size="sm" />
										</button>
									</div>

									{/* Type */}
									<div className="w-24 shrink-0">
										<Tag color={typeInfo.color}>{typeInfo.label}</Tag>
									</div>

									{/* Entity */}
									<span className="w-24 shrink-0 text-sm text-gray-600 dark:text-gray-400">
										{link.entity}
									</span>

									{/* Generated by */}
									<span className="w-24 shrink-0 text-sm text-gray-600 dark:text-gray-400">
										{link.generatedBy}
									</span>

									{/* Created */}
									<span className="w-24 shrink-0 text-sm text-gray-500 dark:text-gray-400">
										{link.created}
									</span>

									{/* Expiration */}
									<span
										className={cn(
											"w-24 shrink-0 text-sm",
											link.status === "expired"
												? "font-medium text-red-500 dark:text-red-400"
												: "text-gray-500 dark:text-gray-400",
										)}
									>
										{link.expiration}
									</span>

									{/* First connection */}
									<div className="flex w-20 shrink-0 items-center justify-center">
										{link.firstConnection ? (
											<span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
												<Icon
													name="check"
													size="sm"
													className="text-red-600 dark:text-red-400"
												/>
											</span>
										) : (
											<span className="text-xs text-gray-400">&mdash;</span>
										)}
									</div>

									{/* Actions */}
									<div className="flex w-24 shrink-0 items-center justify-end gap-1">
										<button
											onClick={() => handleCopy(link.url)}
											className={cn(
												"inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium",
												"text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600",
												"dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400",
											)}
											title="Copier le lien"
										>
											<Icon name="document" size="sm" />
										</button>
										<button
											onClick={() => handleDelete(link.id)}
											className={cn(
												"inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium",
												"text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600",
												"dark:text-gray-500 dark:hover:bg-red-900/20 dark:hover:text-red-400",
											)}
											title="Supprimer le lien"
										>
											<Icon name="close" size="sm" />
										</button>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			</div>
		</PageContainer>
	);
}
