"use client";

// Features & Components
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


// Constants & types

interface BotCommand {
	name: string;
	description: string;
	usage: string;
	example: string;
}

// Data

const MODERATION_COMMANDS: BotCommand[] = [
	{
		name: "/warn",
		description:
			"Avertir un membre pour un comportement inapproprie. L'avertissement est enregistre dans l'historique.",
		usage: "/warn <@utilisateur> [raison]",
		example: "/warn @Jean Insultes repetees dans le chat",
	},
	{
		name: "/mute",
		description: "Rendre muet un membre de facon permanente jusqu'a unmute manuel.",
		usage: "/mute <@utilisateur> [raison]",
		example: "/mute @Jean Spam excessif dans les salons textuels",
	},
	{
		name: "/tempmute",
		description: "Rendre muet un membre pour une duree determinee. Le mute est automatiquement leve a expiration.",
		usage: "/tempmute <@utilisateur> <duree> [raison]",
		example: "/tempmute @Jean 2h Provocation en vocal",
	},
	{
		name: "/unmute",
		description: "Retirer le mute d'un membre, qu'il soit permanent ou temporaire.",
		usage: "/unmute <@utilisateur> [raison]",
		example: "/unmute @Jean Mute expire, comportement corrige",
	},
	{
		name: "/ban",
		description:
			"Bannir definitivement un membre du serveur Discord. Action irreversible sans intervention manuelle.",
		usage: "/ban <@utilisateur> [raison]",
		example: "/ban @Jean Harcelement grave et repete",
	},
	{
		name: "/tempban",
		description:
			"Bannir temporairement un membre pour une duree determinee. Le ban est automatiquement leve a expiration.",
		usage: "/tempban <@utilisateur> <duree> [raison]",
		example: "/tempban @Jean 7d Contenu NSFW en recidive",
	},
	{
		name: "/unban",
		description: "Retirer le bannissement d'un membre, qu'il soit permanent ou temporaire.",
		usage: "/unban <ID utilisateur> [raison]",
		example: "/unban 123456789 Demande de debannissement approuvee",
	},
	{
		name: "/kick",
		description: "Expulser un membre du serveur Discord. Le membre peut rejoindre a nouveau avec une invitation.",
		usage: "/kick <@utilisateur> [raison]",
		example: "/kick @Jean Compte suspect, verification necessaire",
	},
	{
		name: "/clear",
		description: "Supprimer un nombre donne de messages dans le salon actuel. Maximum 100 messages par commande.",
		usage: "/clear <nombre> [@utilisateur]",
		example: "/clear 50 @Jean",
	},
];

const UTILITY_COMMANDS: BotCommand[] = [
	{
		name: "/userinfo",
		description: "Afficher les informations detaillees d'un utilisateur : date de creation, date d'arrivee, roles.",
		usage: "/userinfo <@utilisateur>",
		example: "/userinfo @Jean",
	},
	{
		name: "/serverinfo",
		description: "Afficher les informations du serveur : nombre de membres, salons, roles, date de creation.",
		usage: "/serverinfo",
		example: "/serverinfo",
	},
	{
		name: "/roles",
		description: "Lister tous les roles du serveur avec leur nombre de membres respectif.",
		usage: "/roles",
		example: "/roles",
	},
	{
		name: "/avatar",
		description: "Afficher l'avatar d'un utilisateur en haute resolution.",
		usage: "/avatar <@utilisateur>",
		example: "/avatar @Jean",
	},
	{
		name: "/ping",
		description: "Verifier la latence du bot et le temps de reponse de l'API Discord.",
		usage: "/ping",
		example: "/ping",
	},
	{
		name: "/help",
		description: "Afficher la liste de toutes les commandes disponibles et leur description.",
		usage: "/help [commande]",
		example: "/help warn",
	},
	{
		name: "/logs",
		description: "Consulter les logs de moderation recents : sanctions, actions automatiques, evenements.",
		usage: "/logs [nombre] [@utilisateur]",
		example: "/logs 20 @Jean",
	},
	{
		name: "/slowmode",
		description: "Activer ou modifier le mode lent d'un salon. Definir a 0 pour desactiver.",
		usage: "/slowmode <duree>",
		example: "/slowmode 10s",
	},
	{
		name: "/lock",
		description: "Verrouiller un salon pour empecher les membres d'envoyer des messages.",
		usage: "/lock [salon] [raison]",
		example: "/lock #general Raid en cours",
	},
	{
		name: "/unlock",
		description: "Deverrouiller un salon precedemment verrouille, restaurer les permissions d'envoi de messages.",
		usage: "/unlock [salon]",
		example: "/unlock #general",
	},
	{
		name: "/announce",
		description: "Envoyer une annonce formatee dans un salon specifique avec un embed personnalise.",
		usage: "/announce <salon> <message>",
		example: "/announce #annonces Maintenance prevue demain a 14h",
	},
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
				"rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-800",
				"dark:bg-gray-700 dark:text-gray-200",
				className,
			)}
		>
			{children}
		</code>
	);
}

/**
 * Displays a bot command card with name, description, usage and example.
 * @param props - Component props
 * @param props.command - The bot command data to display
 * @returns A styled command reference card
 */
function CommandCard({ command }: { command: BotCommand }) {
	return (
		<Card padding="md" className="transition-all duration-200">
			<div className="space-y-3">
				{/* Command name */}
				<div className="flex items-center gap-2">
					<Code className="text-sm font-semibold">{command.name}</Code>
				</div>

				{/* Description */}
				<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{command.description}</p>

				{/* Usage */}
				<div>
					<span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Syntaxe</span>
					<div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
						<Code>{command.usage}</Code>
					</div>
				</div>

				{/* Example */}
				<div>
					<span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Exemple</span>
					<div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
						<Code>{command.example}</Code>
					</div>
				</div>
			</div>
		</Card>
	);
}

/**
 * Marsha Bot documentation page listing moderation and utility commands.
 * @returns The bot commands reference page for polyvalent moderation
 */
export default function MarshaBotPolyvalentPage() {
	return (
		<PageContainer title="Marsha Bot" description="Documentation des commandes de moderation — Twitch & Discord">
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
								Documentation des commandes de Marsha pour la moderation polyvalente. Ces commandes
								s&apos;appliquent principalement cote Discord mais les sanctions peuvent etre
								synchronisees avec Twitch. Arguments&nbsp;: <Code>&lt; &gt;</Code> = requis,{" "}
								<Code>[ ]</Code> = optionnel.
							</p>
							<div className="mt-3 flex items-center gap-2">
								<Badge variant="info" showDot={false}>
									Discord
								</Badge>
								<Badge variant="primary" showDot={false}>
									Twitch
								</Badge>
							</div>
						</div>
					</div>
				</Card>

				{/* Moderation Commands */}
				<div>
					<div className="mb-3 flex items-center gap-2">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Commandes de moderation</h2>
						<Badge variant="error" showDot>
							Moderation
						</Badge>
						<Badge variant="neutral" showDot={false}>
							{MODERATION_COMMANDS.length} commandes
						</Badge>
					</div>

					{/* Warning banner */}
					<div className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10 mb-4 flex items-start gap-3 rounded-lg border p-4">
						<span className="text-warning-500 mt-0.5 shrink-0">&#9888;</span>
						<p className="text-warning-700 dark:text-warning-400 text-sm">
							Meme si raison et pieces jointes sont optionnelles, on doit systematiquement en fournir.
							Toute sanction appliquee via le bot doit etre documentee.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{MODERATION_COMMANDS.map((cmd) => (
							<CommandCard key={cmd.name} command={cmd} />
						))}
					</div>
				</div>

				{/* Utility Commands */}
				<div>
					<div className="mb-3 flex items-center gap-2">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Commandes utilitaires</h2>
						<Badge variant="info" showDot>
							Utilitaire
						</Badge>
						<Badge variant="neutral" showDot={false}>
							{UTILITY_COMMANDS.length} commandes
						</Badge>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{UTILITY_COMMANDS.map((cmd) => (
							<CommandCard key={cmd.name} command={cmd} />
						))}
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
