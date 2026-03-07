"use client";

// React
import { useMemo } from "react";
import {
	FolderIcon,
	CheckCircleIcon,
	CalendarDaysIcon,
	UsersIcon,
	ClockIcon,
	ExclamationTriangleIcon,
	ClipboardDocumentListIcon,
	ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useModePalette } from "@/hooks/useModePalette";

// Utils & hooks
import { cn } from "@/lib/utils/cn";
import type { BriefingItem } from "../utils/briefing-engine";
import type { ComponentType, SVGProps } from "react";

// ─── Icon mapping ───────────────────────────────────────────────────────────

const ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
	FolderIcon,
	CheckCircleIcon,
	CalendarDaysIcon,
	UsersIcon,
	ClockIcon,
	ExclamationTriangleIcon,
	ClipboardDocumentListIcon,
};

// ─── Category configuration ─────────────────────────────────────────────────

interface CategoryConfig {
	label: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	iconColorByMode: {
		owner: string;
		legacy: string;
		default: string;
	};
}

const CATEGORY_CONFIG: Record<BriefingItem["category"], CategoryConfig> = {
	deadlines: {
		label: "Échéances",
		icon: ExclamationTriangleIcon,
		iconColorByMode: {
			owner: "text-red-500 dark:text-red-300",
			legacy: "text-orange-500 dark:text-orange-300",
			default: "text-slate-500 dark:text-slate-300",
		},
	},
	projects: {
		label: "Projets",
		icon: FolderIcon,
		iconColorByMode: {
			owner: "text-red-500 dark:text-red-300",
			legacy: "text-amber-500 dark:text-amber-300",
			default: "text-slate-500 dark:text-slate-300",
		},
	},
	tasks: {
		label: "Tâches",
		icon: CheckCircleIcon,
		iconColorByMode: {
			owner: "text-red-500 dark:text-red-300",
			legacy: "text-orange-500 dark:text-orange-300",
			default: "text-slate-500 dark:text-slate-300",
		},
	},
	schedule: {
		label: "Agenda",
		icon: CalendarDaysIcon,
		iconColorByMode: {
			owner: "text-red-500 dark:text-red-300",
			legacy: "text-amber-500 dark:text-amber-300",
			default: "text-slate-500 dark:text-slate-300",
		},
	},
	team: {
		label: "Équipe",
		icon: UsersIcon,
		iconColorByMode: {
			owner: "text-red-500 dark:text-red-300",
			legacy: "text-orange-500 dark:text-orange-300",
			default: "text-slate-500 dark:text-slate-300",
		},
	},
};

// ─── Category order for display ─────────────────────────────────────────────

const CATEGORY_ORDER: BriefingItem["category"][] = ["deadlines", "schedule", "projects", "tasks", "team"];

// ─── Props ──────────────────────────────────────────────────────────────────

/** Props for the BriefingSection component */
interface BriefingSectionProps {
	greeting: string;
	subtitle: string;
	items: BriefingItem[];
}

// ─── Briefing card ──────────────────────────────────────────────────────────

/** Single briefing item card */
function BriefingCard({ item }: { item: BriefingItem }) {
	const IconComponent = ICON_MAP[item.icon] || FolderIcon;

	const priorityBorder =
		item.priority === "high"
			? "border-l-red-400 dark:border-l-red-500"
			: item.priority === "medium"
				? "border-l-amber-400 dark:border-l-amber-500"
				: "border-l-gray-300 dark:border-l-gray-600";

	return (
		<div
			className={cn(
				"group flex items-start gap-3 rounded-xl border border-l-4 bg-white p-4 transition-all duration-200",
				"hover:-translate-y-0.5 hover:shadow-md",
				"dark:border-gray-700 dark:bg-gray-800",
				priorityBorder,
			)}
		>
			{/* Icon */}
			<div className="mt-0.5 flex-shrink-0">
				<IconComponent className="h-5 w-5 text-gray-400 dark:text-gray-500" />
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
				{item.description && (
					<p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{item.description}</p>
				)}
			</div>

			{/* Link arrow */}
			{item.link && (
				<div className="flex-shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
					<ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
				</div>
			)}
		</div>
	);
}

// ─── Main component ─────────────────────────────────────────────────────────

/**
 * Displays the personal briefing with a greeting banner and categorized items.
 * Groups items by category and renders them in a prioritized order.
 */
export function BriefingSection({ greeting, subtitle, items }: BriefingSectionProps) {
	const palette = useModePalette();

	// Group items by category
	const groupedItems = useMemo(() => {
		const groups: Partial<Record<BriefingItem["category"], BriefingItem[]>> = {};
		for (const item of items) {
			if (!groups[item.category]) groups[item.category] = [];
			groups[item.category]!.push(item);
		}
		return groups;
	}, [items]);

	// Get ordered categories that have items
	const activeCategories = useMemo(() => CATEGORY_ORDER.filter((cat) => groupedItems[cat]?.length), [groupedItems]);

	return (
		<div className="space-y-6">
			{/* Greeting banner */}
			<div
				className={cn(
					"rounded-2xl p-6",
					palette.mode === "owner" &&
						"bg-gradient-to-r from-red-100/80 to-rose-100/80 dark:from-red-900/20 dark:to-rose-900/20",
					palette.mode === "legacy" &&
						"bg-gradient-to-r from-orange-100/80 to-amber-100/80 dark:from-orange-900/20 dark:to-amber-900/20",
					palette.mode === "default" &&
						"bg-gradient-to-r from-rose-50/80 to-slate-100/85 dark:from-rose-950/25 dark:to-slate-800/70",
				)}
			>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">{greeting}</h1>
				<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
			</div>

			{/* Grouped items by category */}
			{activeCategories.map((category) => {
				const config = CATEGORY_CONFIG[category];
				const CategoryIcon = config.icon;
				const categoryItems = groupedItems[category] || [];

				return (
					<div key={category}>
						{/* Category header */}
						<div className="mb-3 flex items-center gap-2">
							<CategoryIcon className={cn("h-5 w-5", config.iconColorByMode[palette.mode])} />
							<h2 className="text-base font-semibold text-gray-900 dark:text-white">{config.label}</h2>
							<span className="text-xs text-gray-400 dark:text-gray-500">({categoryItems.length})</span>
						</div>

						{/* Item cards */}
						<div className="space-y-2">
							{categoryItems.map((item) => (
								<BriefingCard key={item.id} item={item} />
							))}
						</div>
					</div>
				);
			})}

			{/* Empty state */}
			{activeCategories.length === 0 && (
				<div className="py-12 text-center">
					<CheckCircleIcon className="mx-auto h-10 w-10 text-green-400" />
					<p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
						Tout est en ordre ! Rien de nouveau à signaler.
					</p>
				</div>
			)}
		</div>
	);
}
