"use client";

// Components
import { Icon } from "../display/icon";
import { cn } from "@/lib/utils/cn";
import type { IconName } from "@/core/design/icons";


interface Tab {
	id: string;
	label: string;
	icon?: IconName;
	count?: number;
}

interface TabsProps {
	tabs: Tab[];
	activeTab: string;
	onTabChange: (id: string) => void;
	variant?: "underline" | "pills";
	className?: string;
}

/**
 * Tab navigation supporting underline and pill visual variants.
 * @param {TabsProps} props - Component props
 * @param {Tab[]} props.tabs - Array of tab definitions
 * @param {string} props.activeTab - Currently selected tab ID
 * @param {(id: string) => void} props.onTabChange - Callback when a tab is selected
 * @param {"underline" | "pills"} [props.variant="underline"] - Visual style
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Tab bar
 */
export function Tabs({ tabs, activeTab, onTabChange, variant = "underline", className }: TabsProps) {
	return (
		<div
			className={cn(
				"flex gap-1 overflow-x-auto",
				variant === "underline" && "border-b border-gray-200 dark:border-gray-700",
				className,
			)}
		>
			{tabs.map((tab) => {
				const isActive = tab.id === activeTab;
				return (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={cn(
							"flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
							variant === "underline" && [
								"border-b-2 px-4 py-3",
								isActive
									? "border-primary-500 text-primary-600 dark:text-primary-400"
									: "border-transparent text-gray-600 hover:border-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200",
							],
							variant === "pills" && [
								"rounded-lg px-4 py-2",
								isActive
									? "bg-primary-500 text-white shadow-sm"
									: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
							],
						)}
					>
						{tab.icon && <Icon name={tab.icon} size="sm" />}
						{tab.label}
						{tab.count !== undefined && (
							<span
								className={cn(
									"rounded-full px-1.5 py-0.5 text-xs",
									isActive
										? variant === "pills"
											? "bg-white/20 text-white"
											: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
										: "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
								)}
							>
								{tab.count}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}
