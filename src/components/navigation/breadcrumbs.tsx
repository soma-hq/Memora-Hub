"use client";

import Link from "next/link";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";


interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
	className?: string;
}

/**
 * Breadcrumb navigation trail.
 * @param {BreadcrumbsProps} props - Component props
 * @param {BreadcrumbItem[]} props.items - Breadcrumb segments
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Breadcrumb navigation
 */

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
	return (
		<nav className={cn("flex items-center gap-1.5 text-sm", className)}>
			{items.map((item, idx) => {
				const isLast = idx === items.length - 1;
				return (
					<div key={idx} className="flex items-center gap-1.5">
						{idx > 0 && <Icon name="chevronRight" size="xs" className="text-gray-400 dark:text-gray-600" />}
						{item.href && !isLast ? (
							<Link
								href={item.href}
								className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
							>
								{item.label}
							</Link>
						) : (
							<span
								className={cn(
									isLast
										? "font-medium text-gray-900 dark:text-gray-100"
										: "text-gray-500 dark:text-gray-400",
								)}
							>
								{item.label}
							</span>
						)}
					</div>
				);
			})}
		</nav>
	);
}
