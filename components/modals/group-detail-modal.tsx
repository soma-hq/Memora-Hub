"use client";

// React
import { useState } from "react";
import { Modal, ModalFooter, Button, Badge, Icon, Avatar, Tabs, Divider } from "@/components/ui";
import type { BadgeVariant } from "@/core/design/states";


interface GroupMember {
	id: string;
	name: string;
	avatar?: string;
	role: string;
	email: string;
}

interface GroupData {
	id: string;
	name: string;
	description: string;
	members: GroupMember[];
	projects: number;
	status: "active" | "inactive";
}

interface GroupDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	group: GroupData | null;
}

const roleVariant: Record<string, BadgeVariant> = {
	Owner: "primary",
	Admin: "info",
	Manager: "warning",
	Collaborator: "success",
	Guest: "neutral",
};

/**
 * Detail modal for a group showing stats, members, and permissions.
 * @param {GroupDetailModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Callback to close the modal
 * @param {GroupData | null} props.group - Group data to display
 * @returns {JSX.Element | null} Group detail modal or null when no group
 */
export function GroupDetailModal({ isOpen, onClose, group }: GroupDetailModalProps) {
	// State
	const [activeTab, setActiveTab] = useState("members");

	if (!group) return null;

	// Render
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={group.name} description={group.description} size="lg">
			<div className="space-y-6">
				{/* Stats */}
				<div className="grid grid-cols-3 gap-4">
					<div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
						<p className="text-2xl font-bold text-gray-900 dark:text-white">{group.members.length}</p>
						<p className="text-xs text-gray-400">Membres</p>
					</div>
					<div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
						<p className="text-2xl font-bold text-gray-900 dark:text-white">{group.projects}</p>
						<p className="text-xs text-gray-400">Projets</p>
					</div>
					<div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
						<Badge variant={group.status === "active" ? "success" : "neutral"} className="mx-auto">
							{group.status === "active" ? "Actif" : "Inactif"}
						</Badge>
						<p className="mt-1 text-xs text-gray-400">Statut</p>
					</div>
				</div>

				{/* Tabs */}
				<Tabs
					tabs={[
						{ id: "members", label: "Membres", icon: "users", count: group.members.length },
						{ id: "permissions", label: "Permissions", icon: "shield" },
					]}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>

				{activeTab === "members" && (
					<div className="space-y-2">
						{group.members.map((member) => (
							<div
								key={member.id}
								className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
							>
								<Avatar src={member.avatar} name={member.name} size="sm" />
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
										{member.name}
									</p>
									<p className="text-xs text-gray-400">{member.email}</p>
								</div>
								<Badge variant={roleVariant[member.role] || "neutral"} showDot={false}>
									{member.role}
								</Badge>
								<button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
									<Icon name="more" size="sm" />
								</button>
							</div>
						))}
					</div>
				)}

				{activeTab === "permissions" && (
					<div className="space-y-4">
						<p className="text-sm text-gray-400">Permissions par role pour ce groupement.</p>
						{["Owner", "Admin", "Manager", "Collaborator", "Guest"].map((role) => (
							<div key={role} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
								<div className="mb-2 flex items-center gap-2">
									<Badge variant={roleVariant[role] || "neutral"} showDot={false}>
										{role}
									</Badge>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{role === "Owner" &&
										["Tout", "Gestion complete"].map((p) => (
											<span
												key={p}
												className="bg-primary-50 text-primary-700 dark:bg-primary-900/20 rounded px-2 py-0.5 text-xs"
											>
												{p}
											</span>
										))}
									{role === "Admin" &&
										[
											"Utilisateurs",
											"Projets",
											"Taches",
											"Reunions",
											"Recrutement",
											"Formation",
										].map((p) => (
											<span
												key={p}
												className="bg-info-50 text-info-700 dark:bg-info-900/20 rounded px-2 py-0.5 text-xs"
											>
												{p}
											</span>
										))}
									{role === "Manager" &&
										["Projets", "Taches", "Reunions"].map((p) => (
											<span
												key={p}
												className="bg-warning-50 text-warning-700 dark:bg-warning-900/20 rounded px-2 py-0.5 text-xs"
											>
												{p}
											</span>
										))}
									{role === "Collaborator" &&
										["Taches (lecture/ecriture)", "Reunions (lecture)"].map((p) => (
											<span
												key={p}
												className="bg-success-50 text-success-700 dark:bg-success-900/20 rounded px-2 py-0.5 text-xs"
											>
												{p}
											</span>
										))}
									{role === "Guest" &&
										["Taches (lecture seule)"].map((p) => (
											<span
												key={p}
												className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
											>
												{p}
											</span>
										))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<ModalFooter>
				<Button variant="cancel" onClick={onClose}>
					Fermer
				</Button>
				<Button variant="outline-primary">
					<Icon name="edit" size="xs" />
					Modifier
				</Button>
			</ModalFooter>
		</Modal>
	);
}
