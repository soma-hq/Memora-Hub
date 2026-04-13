"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui";
import { useModePalette } from "@/hooks/useModePalette";
import { useHubStore } from "@/store/hub.store";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";

interface MobileNavItem {
	label: string;
	href: string;
	icon: IconName;
}

/**
 * Mobile bottom nav bar.
 * @returns {JSX.Element} Bottom tab bar
 */

export function MobileNav() {
	// State
	const pathname = usePathname();
	const activeGroupId = useHubStore((s) => s.activeGroupId) ?? "default";
	const palette = useModePalette();
	const activeClass =
		palette.mode === "owner"
			? "text-red-500"
			: palette.mode === "legacy"
				? "text-orange-500"
				: "text-slate-700 dark:text-slate-200";

	const mobileItems: MobileNavItem[] = [
		{ label: "Dashboard", href: `/hub/${activeGroupId}`, icon: "home" },
		{ label: "Projets", href: `/hub/${activeGroupId}/projects`, icon: "folder" },
		{ label: "Tâches", href: `/hub/${activeGroupId}/tasks`, icon: "tasks" },
		{ label: "Réunions", href: `/hub/${activeGroupId}/meetings`, icon: "calendar" },
		{ label: "Plus", href: "/settings/account", icon: "more" },
	];

	// Render
	return (
		<nav className="fixed right-0 bottom-0 left-0 z-40 border-t border-gray-200 bg-white lg:hidden dark:border-gray-700 dark:bg-gray-800">
			<div className="flex items-center justify-around py-2">
				{mobileItems.map((item) => {
					const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex flex-col items-center gap-1 px-3 py-1 transition-colors",
								isActive ? activeClass : "text-gray-500 dark:text-gray-400",
							)}
						>
							<Icon name={item.icon} style={isActive ? "solid" : "outline"} size="md" />
							<span className="text-xs">{item.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
