"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { useDataStore } from "@/store/data.store";
import { useHubStore } from "@/store/hub.store";

interface HubEntity {
	id: string;
	name: string;
	avatar: string;
	color: string;
}

/**
 * Group logo or fallback icon.
 * @param {{ group: HubEntity }} props - Component props
 * @param {HubEntity} props.group - Entity used for visual marker
 * @returns {JSX.Element} Entity marker icon
 */
function GroupLogo({ group }: { group: HubEntity }) {
	return (
		<div
			className="flex h-5 w-5 items-center justify-center rounded-sm text-[11px] font-bold text-white"
			style={{ backgroundColor: group.color }}
		>
			{group.name.charAt(0).toUpperCase()}
		</div>
	);
}

/**
 * Hub/group dropdown switcher.
 * @returns {JSX.Element} Hub switcher dropdown
 */

export function HubSwitcher() {
	const pathname = usePathname();
	const router = useRouter();
	const setActiveGroup = useHubStore((s) => s.setActiveGroup);
	const activeGroupId = useHubStore((s) => s.activeGroupId);
	const getEntitiesForCurrentUser = useDataStore((s) => s.getEntitiesForCurrentUser);
	const entities = getEntitiesForCurrentUser() as HubEntity[];

	// State
	const [isOpen, setIsOpen] = useState(false);

	/**
	 * Resolve selected entity from current context.
	 * @returns Active entity object
	 */
	const activeGroup = useMemo(() => {
		return entities.find((entity) => entity.id === activeGroupId) ?? entities[0] ?? null;
	}, [activeGroupId, entities]);

	if (!activeGroup) {
		return null;
	}

	/**
	 * Build a route path that preserves current section.
	 * @param entityId - Selected entity ID
	 * @returns New route path
	 */
	const resolveEntityPath = (entityId: string): string => {
		if (pathname.startsWith("/hub/")) {
			const segments = pathname.split("/");
			if (segments.length >= 3) {
				segments[2] = entityId;
				return segments.join("/");
			}
		}

		return `/hub/${entityId}`;
	};

	// Render
	return (
		<div className="relative">
			{/* Trigger */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
			>
				<GroupLogo group={activeGroup} />
				<span>{activeGroup.name}</span>
				<Icon name="chevronDown" size="xs" className="text-gray-500 dark:text-gray-400" />
			</button>

			{/* Dropdown */}
			{isOpen && (
				<div className="animate-slide-in absolute top-full left-0 z-50 mt-1 w-56 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
					<div className="p-2">
						<p className="px-3 py-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
							Entites
						</p>
						{entities.map((group) => (
							<button
								key={group.id}
								onClick={() => {
									setActiveGroup(group.id, group.name);
									router.push(resolveEntityPath(group.id));
									setIsOpen(false);
								}}
								className={cn(
									"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
									activeGroup.id === group.id
										? "bg-primary-50 text-primary-700 dark:bg-primary-900/20"
										: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
								)}
							>
								<GroupLogo group={group} />
								<span>{group.name}</span>
								{activeGroup.id === group.id && (
									<Icon name="check" size="sm" className="text-primary-500 ml-auto" />
								)}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
