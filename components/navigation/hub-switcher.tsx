"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


const mockGroups = [
	{ id: "default", name: "Bazalthe", logo: "/logos/memora.png" },
	{ id: "inoxtag", name: "Inoxtag", logo: "/logos/inoxtag-logo.png" },
];

type Group = (typeof mockGroups)[number];

/**
 * Group logo or fallback icon.
 * @param {{ group: Group; size?: number }} props - Component props
 * @param {Group} props.group - Group with optional logo
 * @param {number} [props.size=20] - Image size in px
 * @returns {JSX.Element} Group logo or fallback icon
 */

function GroupLogo({ group, size = 20 }: { group: Group; size?: number }) {
	if (group.logo) {
		return (
			<Image src={group.logo} alt={group.name} width={size} height={size} className="rounded-sm object-contain" />
		);
	}
	return <Icon name="group" size="sm" className="text-gray-500 dark:text-gray-400" />;
}

/**
 * Hub/group dropdown switcher.
 * @returns {JSX.Element} Hub switcher dropdown
 */

export function HubSwitcher() {
	// State
	const [isOpen, setIsOpen] = useState(false);
	const [activeGroup, setActiveGroup] = useState(mockGroups[0]);

	// Render
	return (
		<div className="relative">
			{/* Trigger */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
			>
				<GroupLogo group={activeGroup} size={18} />
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
						{mockGroups.map((group) => (
							<button
								key={group.id}
								onClick={() => {
									setActiveGroup(group);
									setIsOpen(false);
								}}
								className={cn(
									"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
									activeGroup.id === group.id
										? "bg-primary-50 text-primary-700 dark:bg-primary-900/20"
										: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
								)}
							>
								<GroupLogo group={group} size={20} />
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
