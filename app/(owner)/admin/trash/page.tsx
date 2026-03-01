"use client";

// React
import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, Badge, Icon, Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showWarning } from "@/lib/utils/toast";


interface TrashedMember {
	id: string;
	pseudo: string;
	team: string;
	reason: "archived" | "restricted" | "deleted";
	deletedAt: string;
	deletedBy: string;
	expiresAt: string;
	restrictionDuration?: string;
}

const TRASHED_MEMBERS: TrashedMember[] = [
	{
		id: "t1",
		pseudo: "Kaze",
		team: "Squad",
		reason: "archived",
		deletedAt: "12 fév 2026",
		deletedBy: "Jeremy Alpha",
		expiresAt: "1 mar 2026",
	},
	{
		id: "t2",
		pseudo: "Nova",
		team: "Squad",
		reason: "deleted",
		deletedAt: "20 fév 2026",
		deletedBy: "Witt",
		expiresAt: "1 mar 2026",
	},
];

const REASON_CONFIG = {
	archived: { label: "Archivé", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" },
	restricted: {
		label: "Restreint",
		color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
	},
	deleted: { label: "Supprimé", color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
};

function getDaysUntilPurge(): number {
	const now = new Date();
	const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
	return Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Trash management page for archived, restricted and deleted members.
 * @returns The admin trash page with restore and delete actions
 */
export default function AdminTrashPage() {
	const [members, setMembers] = useState(TRASHED_MEMBERS);
	const daysUntilPurge = getDaysUntilPurge();

	const handleRestore = (id: string) => {
		setMembers((prev) => prev.filter((m) => m.id !== id));
		showSuccess("Membre restauré avec succès.");
	};

	const handlePermanentDelete = (id: string) => {
		const member = members.find((m) => m.id === id);
		if (!member) return;
		showWarning(`${member.pseudo} supprimé définitivement.`);
		setMembers((prev) => prev.filter((m) => m.id !== id));
	};

	return (
		<PageContainer
			title="Corbeille"
			description="Membres supprimés, archivés ou restreints. Vidage automatique le 1er de chaque mois."
		>
			{/* Purge countdown */}
			<Card className="border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/5">
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
							<Icon name="clock" size="md" className="text-red-500" />
						</div>
						<div>
							<p className="text-sm font-medium text-red-700 dark:text-red-400">
								Prochain vidage automatique
							</p>
							<p className="text-xs text-red-500/70 dark:text-red-400/60">
								Les éléments de plus de 30 jours seront supprimés définitivement
							</p>
						</div>
					</div>
					<div className="text-right">
						<p className="text-2xl font-bold text-red-600 dark:text-red-400">{daysUntilPurge}j</p>
						<p className="text-xs text-red-500/70">avant le 1er du mois</p>
					</div>
				</div>
			</Card>

			{/* Members list */}
			<div className="mt-6 space-y-3">
				{members.length === 0 ? (
					<Card>
						<div className="flex flex-col items-center justify-center px-6 py-12 text-center">
							<Icon name="check" size="lg" className="mb-3 text-gray-300 dark:text-gray-600" />
							<p className="text-sm text-gray-500 dark:text-gray-400">La corbeille est vide</p>
						</div>
					</Card>
				) : (
					members.map((member) => {
						const reasonConfig = REASON_CONFIG[member.reason];
						return (
							<Card key={member.id} className="transition-all duration-200 hover:shadow-md">
								<div className="flex items-center justify-between p-4">
									<div className="flex items-center gap-4">
										{/* Avatar placeholder */}
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
											{member.pseudo[0]}
										</div>

										<div>
											<div className="flex items-center gap-2">
												<span className="font-medium text-gray-900 dark:text-white">
													{member.pseudo}
												</span>
												<span
													className={cn(
														"rounded-full px-2 py-0.5 text-xs font-medium",
														reasonConfig.color,
													)}
												>
													{reasonConfig.label}
												</span>
												<Badge variant="neutral">{member.team}</Badge>
											</div>
											<div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
												<span>Supprimé le {member.deletedAt}</span>
												<span>•</span>
												<span>Par {member.deletedBy}</span>
												{member.restrictionDuration && (
													<>
														<span>•</span>
														<span>Durée : {member.restrictionDuration}</span>
													</>
												)}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Button variant="primary" size="sm" onClick={() => handleRestore(member.id)}>
											<Icon name="check" size="sm" />
											Restaurer
										</Button>
										<Button
											variant="outline-danger"
											size="sm"
											onClick={() => handlePermanentDelete(member.id)}
										>
											<Icon name="close" size="sm" />
											Supprimer
										</Button>
									</div>
								</div>
							</Card>
						);
					})
				)}
			</div>

			{/* Info */}
			{members.length > 0 && (
				<div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
					<div className="flex items-start gap-2">
						<Icon name="info" size="sm" className="mt-0.5 text-gray-400" />
						<div className="text-xs text-gray-500 dark:text-gray-400">
							<p className="font-medium text-gray-700 dark:text-gray-300">Politique de rétention</p>
							<p className="mt-1">
								Les membres supprimés sont conservés pendant 30 jours. Passé ce délai, la suppression
								est irréversible. Le vidage automatique s&apos;effectue le 1er de chaque mois. Vous
								pouvez restaurer un membre à tout moment avant l&apos;expiration.
							</p>
						</div>
					</div>
				</div>
			)}
		</PageContainer>
	);
}
