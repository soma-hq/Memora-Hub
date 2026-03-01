"use client";

import { useState, useMemo, useCallback } from "react";
import type { User } from "@/features/users/types";


/** Mock users dataset for development */
const mockUsers: User[] = [
	{
		id: "usr-001",
		name: "Jeremy Music",
		email: "jeremy@bazalthe.com",
		role: "Owner",
		avatar: "",
		group: "Bazalthe",
		status: "active",
		groupAccess: [
			{ groupId: "bazalthe", groupName: "Bazalthe", role: "Owner" },
			{ groupId: "memora-hub", groupName: "Memora Hub", role: "Admin" },
		],
	},
	{
		id: "usr-002",
		name: "Sophie Martin",
		email: "sophie.martin@bazalthe.com",
		role: "Admin",
		avatar: "",
		group: "Bazalthe",
		status: "active",
		groupAccess: [{ groupId: "bazalthe", groupName: "Bazalthe", role: "Admin" }],
	},
	{
		id: "usr-003",
		name: "Lucas Dupont",
		email: "lucas.dupont@inoxtag.com",
		role: "Manager",
		avatar: "",
		group: "Inoxtag",
		status: "active",
		groupAccess: [
			{ groupId: "inoxtag", groupName: "Inoxtag", role: "Manager" },
			{ groupId: "bazalthe", groupName: "Bazalthe", role: "Collaborator" },
		],
	},
	{
		id: "usr-004",
		name: "Emma Leroy",
		email: "emma.leroy@bazalthe.com",
		role: "Collaborator",
		avatar: "",
		group: "Bazalthe",
		status: "active",
		groupAccess: [{ groupId: "bazalthe", groupName: "Bazalthe", role: "Collaborator" }],
	},
	{
		id: "usr-005",
		name: "Thomas Bernard",
		email: "thomas.bernard@inoxtag.com",
		role: "Collaborator",
		avatar: "",
		group: "Inoxtag",
		status: "inactive",
		groupAccess: [{ groupId: "inoxtag", groupName: "Inoxtag", role: "Collaborator" }],
	},
	{
		id: "usr-006",
		name: "Camille Roux",
		email: "camille.roux@memora-hub.com",
		role: "Admin",
		avatar: "",
		group: "Memora Hub",
		status: "active",
		groupAccess: [
			{ groupId: "memora-hub", groupName: "Memora Hub", role: "Admin" },
			{ groupId: "bazalthe", groupName: "Bazalthe", role: "Manager" },
		],
	},
	{
		id: "usr-007",
		name: "Antoine Moreau",
		email: "antoine.moreau@bazalthe.com",
		role: "Guest",
		avatar: "",
		group: "Bazalthe",
		status: "active",
		groupAccess: [{ groupId: "bazalthe", groupName: "Bazalthe", role: "Guest" }],
	},
	{
		id: "usr-008",
		name: "Marie Lambert",
		email: "marie.lambert@studio-creatif.com",
		role: "Manager",
		avatar: "",
		group: "Studio Creatif",
		status: "active",
		groupAccess: [
			{ groupId: "studio-creatif", groupName: "Studio Creatif", role: "Manager" },
			{ groupId: "inoxtag", groupName: "Inoxtag", role: "Collaborator" },
		],
	},
	{
		id: "usr-009",
		name: "Hugo Petit",
		email: "hugo.petit@inoxtag.com",
		role: "Collaborator",
		avatar: "",
		group: "Inoxtag",
		status: "inactive",
		groupAccess: [{ groupPtr: "inoxtag", groupName: "Inoxtag", role: "Collaborator" }] as any,
	},
	{
		id: "usr-010",
		name: "Julie Fontaine",
		email: "julie.fontaine@memora-hub.com",
		role: "Owner",
		avatar: "",
		group: "Memora Hub",
		status: "active",
		groupAccess: [
			{ groupId: "memora-hub", groupName: "Memora Hub", role: "Owner" },
			{ groupId: "studio-creatif", groupName: "Studio Creatif", role: "Admin" },
		],
	},
];

/**
 * Users list state with search and role filtering
 * @returns Users state, filters, and filtered results
 */
export function useUsers() {
	// State
	const [users, setUsers] = useState<User[]>(mockUsers);
	const [isLoading, setIsLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("");

	// Computed
	const filteredUsers = useMemo(() => {
		let result = users;

		if (search.trim()) {
			const query = search.toLowerCase().trim();
			result = result.filter(
				(user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
			);
		}

		if (roleFilter) {
			result = result.filter((user) => user.role === roleFilter);
		}

		return result;
	}, [users, search, roleFilter]);

	return {
		users,
		setUsers,
		isLoading,
		setIsLoading,
		search,
		setSearch,
		roleFilter,
		setRoleFilter,
		filteredUsers,
	};
}

/**
 * User CRUD actions hook
 * @returns Create, update, and delete user functions with loading state
 */
export function useUserActions() {
	// State
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Creates a new user with generated ID
	 * @param data - User data without ID
	 * @returns Newly created user with generated ID
	 */
	const createUser = useCallback(async (data: Omit<User, "id">) => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 800));
			const newUser: User = {
				...data,
				id: `usr-${Date.now()}`,
			};
			return newUser;
		} finally {
			setIsLoading(false);
		}
	}, []);

	/**
	 * Updates an existing user by ID
	 * @param id - User ID to update
	 * @param data - Partial user data to merge
	 * @returns Updated user object
	 */
	const updateUser = useCallback(async (id: string, data: Partial<User>) => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 800));
			return { id, ...data } as User;
		} finally {
			setIsLoading(false);
		}
	}, []);

	/**
	 * Deletes a user by ID
	 * @param id - User ID to delete
	 * @returns Deleted user ID
	 */
	const deleteUser = useCallback(async (id: string) => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 600));
			return id;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		createUser,
		updateUser,
		deleteUser,
		isLoading,
	};
}
