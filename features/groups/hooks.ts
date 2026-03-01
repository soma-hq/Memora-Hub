"use client";

// React
import { useState, useMemo, useCallback } from "react";
import type { Group, GroupFormData, GroupMember } from "@/features/groups/types";


/** Mock members per group for development */
const mockMembers: Record<string, GroupMember[]> = {
	g1: [
		{ id: "m1", name: "Sophie Martin", email: "sophie.martin@memora.fr", role: "owner" },
		{ id: "m2", name: "Lucas Dupont", email: "lucas.dupont@memora.fr", role: "admin" },
		{ id: "m3", name: "Emma Bernard", email: "emma.bernard@memora.fr", role: "collaborator" },
		{ id: "m4", name: "Hugo Leroy", email: "hugo.leroy@memora.fr", role: "manager" },
		{ id: "m5", name: "Lea Moreau", email: "lea.moreau@memora.fr", role: "guest" },
	],
	g2: [
		{ id: "m6", name: "Nathan Petit", email: "nathan.petit@memora.fr", role: "owner" },
		{ id: "m7", name: "Chloe Robert", email: "chloe.robert@memora.fr", role: "admin" },
		{ id: "m8", name: "Thomas Richard", email: "thomas.richard@memora.fr", role: "collaborator" },
	],
	g3: [
		{ id: "m9", name: "Manon Durand", email: "manon.durand@memora.fr", role: "owner" },
		{ id: "m10", name: "Jules Simon", email: "jules.simon@memora.fr", role: "manager" },
		{ id: "m11", name: "Camille Laurent", email: "camille.laurent@memora.fr", role: "collaborator" },
		{ id: "m12", name: "Enzo Michel", email: "enzo.michel@memora.fr", role: "collaborator" },
		{ id: "m13", name: "Ines Lefevre", email: "ines.lefevre@memora.fr", role: "guest" },
		{ id: "m14", name: "Gabriel Roux", email: "gabriel.roux@memora.fr", role: "admin" },
	],
	g4: [
		{ id: "m15", name: "Jade Fournier", email: "jade.fournier@memora.fr", role: "owner" },
		{ id: "m16", name: "Louis Girard", email: "louis.girard@memora.fr", role: "collaborator" },
		{ id: "m17", name: "Alice Bonnet", email: "alice.bonnet@memora.fr", role: "manager" },
		{ id: "m18", name: "Arthur Dupuis", email: "arthur.dupuis@memora.fr", role: "guest" },
	],
};

/** Initial groups dataset */
const initialGroups: Group[] = [
	{
		id: "g1",
		name: "Equipe Produit",
		description: "Equipe responsable de la conception et du developpement des produits numeriques.",
		members: mockMembers.g1,
		projects: 8,
		status: "active",
		createdAt: "2024-09-15",
	},
	{
		id: "g2",
		name: "Marketing Digital",
		description: "Groupe en charge des campagnes marketing et de la communication en ligne.",
		members: mockMembers.g2,
		projects: 4,
		status: "active",
		createdAt: "2024-11-02",
	},
	{
		id: "g3",
		name: "Recherche & Innovation",
		description: "Cellule dediee a la veille technologique et aux projets innovants.",
		members: mockMembers.g3,
		projects: 12,
		status: "active",
		createdAt: "2024-06-20",
	},
	{
		id: "g4",
		name: "Support Client",
		description: "Equipe de support technique et de relation client. Actuellement en pause.",
		members: mockMembers.g4,
		projects: 2,
		status: "inactive",
		createdAt: "2025-01-10",
	},
];

/**
 * Manages groups list state with search filtering
 * @returns Groups state, search filter, and filtered results
 */
export function useGroups() {
	// State
	const [groups, setGroups] = useState<Group[]>(initialGroups);
	const [isLoading, setIsLoading] = useState(false);
	const [search, setSearch] = useState("");

	// Computed
	const filteredGroups = useMemo(() => {
		if (!search.trim()) return groups;
		const query = search.toLowerCase();
		return groups.filter(
			(group) => group.name.toLowerCase().includes(query) || group.description.toLowerCase().includes(query),
		);
	}, [groups, search]);

	return { groups, setGroups, isLoading, setIsLoading, search, setSearch, filteredGroups };
}

/**
 * Provides CRUD actions for group and member management
 * @param groups - Current groups array
 * @param setGroups - State setter for groups
 * @returns Group and member CRUD functions with loading state
 */
export function useGroupActions(groups: Group[], setGroups: React.Dispatch<React.SetStateAction<Group[]>>) {
	// State
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Creates a new group from form data
	 * @param data - Group form data
	 * @returns Newly created group
	 */
	const createGroup = useCallback(
		(data: GroupFormData) => {
			setIsLoading(true);
			const newGroup: Group = {
				id: `g${Date.now()}`,
				name: data.name,
				description: data.description,
				status: data.status,
				members: [],
				projects: 0,
				createdAt: new Date().toISOString().split("T")[0],
			};
			setGroups((prev) => [...prev, newGroup]);
			setIsLoading(false);
			return newGroup;
		},
		[setGroups],
	);

	/**
	 * Updates an existing group by ID
	 * @param id - Group ID to update
	 * @param data - Partial group form data to merge
	 * @returns Nothing
	 */
	const updateGroup = useCallback(
		(id: string, data: Partial<GroupFormData>) => {
			setIsLoading(true);
			setGroups((prev) => prev.map((group) => (group.id === id ? { ...group, ...data } : group)));
			setIsLoading(false);
		},
		[setGroups],
	);

	/**
	 * Deletes a group by ID
	 * @param id - Group ID to delete
	 * @returns Nothing
	 */
	const deleteGroup = useCallback(
		(id: string) => {
			setIsLoading(true);
			setGroups((prev) => prev.filter((group) => group.id !== id));
			setIsLoading(false);
		},
		[setGroups],
	);

	/**
	 * Adds a member to a group
	 * @param groupId - Target group ID
	 * @param member - Member to add
	 * @returns Nothing
	 */
	const addMember = useCallback(
		(groupId: string, member: GroupMember) => {
			setGroups((prev) =>
				prev.map((group) => (group.id === groupId ? { ...group, members: [...group.members, member] } : group)),
			);
		},
		[setGroups],
	);

	/**
	 * Removes a member from a group
	 * @param groupId - Target group ID
	 * @param memberId - Member ID to remove
	 * @returns Nothing
	 */
	const removeMember = useCallback(
		(groupId: string, memberId: string) => {
			setGroups((prev) =>
				prev.map((group) =>
					group.id === groupId
						? { ...group, members: group.members.filter((m) => m.id !== memberId) }
						: group,
				),
			);
		},
		[setGroups],
	);

	return { createGroup, updateGroup, deleteGroup, addMember, removeMember, isLoading };
}
