"use client";

// Next.js
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


interface SettingsTab {
	label: string;
	href: string;
	icon: IconName;
}

const tabs: SettingsTab[] = [
	{ label: "Compte", href: "/settings/account", icon: "profile" },
	{ label: "Préférences", href: "/settings/preferences", icon: "settings" },
	{ label: "Notifications", href: "/settings/notifications", icon: "bell" },
];

/**
 * Settings layout with horizontal tab navigation for account preferences.
 * @param props - Component props
 * @param props.children - Active settings page content
 * @returns The settings page shell with tab bar
 */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	// Render
	return (
		<PageContainer title="Paramètres" description="Gérez votre compte et vos préférences">
			{/* Tabs */}
			<div className="mb-6 flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
				{tabs.map((tab) => {
					const isActive = pathname === tab.href;
					return (
						<Link
							key={tab.href}
							href={tab.href}
							className={cn(
								"flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200",
								isActive
									? "border-primary-500 text-primary-600 dark:text-primary-400"
									: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200",
							)}
						>
							<Icon name={tab.icon} size="sm" />
							{tab.label}
						</Link>
					);
				})}
			</div>

			{/* Page content */}
			{children}
		</PageContainer>
	);
}
