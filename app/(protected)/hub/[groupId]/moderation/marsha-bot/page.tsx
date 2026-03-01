"use client";

// Features & Components
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


// Constants & types
interface ModerationCommand {
	syntax: string;
	description: string;
}

interface UtilityCommand {
	syntax: string;
	description: string;
}

// Data
const MODERATION_COMMANDS: ModerationCommand[] = [
	{ syntax: "!note <@/ID> [Raison]", description: "Ajouter une note (non visible par le membre)" },
	{ syntax: "!warn <@/ID> [Raison]", description: "Avertir un membre" },
	{ syntax: "!tempmute <@/ID> <Durée> [Raison]", description: "Mute temporaire" },
	{ syntax: "!kick <@/ID> [Raison]", description: "Expulser" },
	{ syntax: "!tempban <@/ID> <Durée> [Raison]", description: "Ban temporaire" },
	{ syntax: "!ban <@/ID> [Raison]", description: "Bannir" },
	{ syntax: "!inf user <@/ID>", description: "Historique des sanctions" },
	{ syntax: "!notes <@/ID>", description: "Historique des notes" },
	{ syntax: "!auto-moderation <@/ID>", description: "Historique auto-modération" },
];

const UTILITY_COMMANDS: UtilityCommand[] = [
	{ syntax: "!user <@/ID>", description: "Infos Discord d'un utilisateur" },
	{ syntax: "!nicknames <@/ID>", description: "Historique des surnoms" },
	{ syntax: "!usernames <@/ID>", description: "Historique des pseudos" },
	{ syntax: "!clear <@/ID>", description: "Supprime 100 derniers messages" },
	{ syntax: "!clear <@/ID> <N>", description: "Supprime N derniers messages de l'utilisateur" },
	{ syntax: "!clear <N>", description: "Supprime N derniers messages du salon" },
	{ syntax: "!slowmode <Durée>", description: "Active le mode lent" },
	{ syntax: "!remind <Durée> <Raison>", description: "Crée un rappel" },
	{ syntax: "!unmute <@/ID> [Raison]", description: "Unmute" },
	{ syntax: "!unban <@/ID> [Raison]", description: "Unban" },
];

/**
 * Inline code display component for command syntax.
 * @param props - Component props
 * @param props.children - The code content
 * @param props.className - Additional CSS classes
 * @returns A styled inline code element
 */
function Code({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<code
			className={cn(
				"rounded-md bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800",
				"dark:bg-gray-700 dark:text-gray-200",
				className,
			)}
		>
			{children}
		</code>
	);
}

/**
 * Marsha Bot documentation page listing moderation and utility commands.
 * @returns The bot commands reference page
 */
export default function MarshaBotPage() {
	return (
		<PageContainer title="Marsha Bot" description="Documentation des commandes de modération">
			<div className="space-y-6">
				{/* About */}
				<Card padding="lg">
					<div className="flex items-start gap-3">
						<div className="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
							<span className="text-primary-600 dark:text-primary-400 text-lg font-bold">M</span>
						</div>
						<div>
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white">A propos</h2>
							<p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
								Documentation des principales commandes de Marsha pour la modération. Arguments&nbsp;:{" "}
								<Code>&lt; &gt;</Code> = requis, <Code>[ ]</Code> = optionnel.
							</p>
						</div>
					</div>
				</Card>

				{/* Moderation Commands */}
				<div>
					<div className="mb-3 flex items-center gap-2">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Commandes de modération</h2>
						<Badge variant="error" showDot>
							Modération
						</Badge>
					</div>

					{/* Warning banner */}
					<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 mb-4 flex items-start gap-3 rounded-lg border p-4">
						<span className="text-warning-500 mt-0.5 shrink-0">&#9888;</span>
						<p className="text-warning-700 dark:text-warning-400 text-sm">
							Meme si raison et pieces jointes sont optionnelles, on doit systematiquement en fournir.
						</p>
					</div>

					<Card padding="sm">
						<div className="divide-y divide-gray-100 dark:divide-gray-700">
							{MODERATION_COMMANDS.map((cmd) => (
								<div
									key={cmd.syntax}
									className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
								>
									<Code className="w-fit shrink-0">{cmd.syntax}</Code>
									<span className="text-sm text-gray-600 dark:text-gray-400">{cmd.description}</span>
								</div>
							))}
						</div>
					</Card>
				</div>

				{/* Utility Commands */}
				<div>
					<div className="mb-3 flex items-center gap-2">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Utilitaires</h2>
						<Badge variant="info" showDot>
							Utilitaire
						</Badge>
					</div>

					<Card padding="sm">
						{/* Table header */}
						<div className="hidden border-b border-gray-200 px-4 py-2 sm:grid sm:grid-cols-[minmax(280px,1fr)_2fr] sm:gap-4 dark:border-gray-700">
							<span className="text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
								Commande
							</span>
							<span className="text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
								Descriptif
							</span>
						</div>

						{/* Table rows */}
						<div className="divide-y divide-gray-100 dark:divide-gray-700">
							{UTILITY_COMMANDS.map((cmd) => (
								<div
									key={cmd.syntax}
									className="flex flex-col gap-1 px-4 py-3 sm:grid sm:grid-cols-[minmax(280px,1fr)_2fr] sm:items-center sm:gap-4"
								>
									<Code className="w-fit">{cmd.syntax}</Code>
									<span className="text-sm text-gray-600 dark:text-gray-400">{cmd.description}</span>
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>
		</PageContainer>
	);
}
