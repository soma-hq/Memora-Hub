"use client";

// Components
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type {

	MessageAttachment,
	MessageAttachmentList,
	MessageAttachmentCard,
	MessageAttachmentStats,
	MessageAttachmentNavigation,
	MessageAttachmentConfirm,
} from "@/features/assistant/types";
import type { IconName } from "@/core/design/icons";


interface AssistantActionCardProps {
	attachment: MessageAttachment;
}

/** Badge variant color map */
const BADGE_VARIANTS: Record<string, string> = {
	success: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
	error: "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400",
	warning: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
	info: "bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400",
	neutral: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
	primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
};

/** Trend arrow colors */
const TREND_COLORS: Record<string, { color: string; arrow: string }> = {
	up: { color: "text-success-500", arrow: "↑" },
	down: { color: "text-error-500", arrow: "↓" },
	neutral: { color: "text-gray-400", arrow: "→" },
};

/**
 * Renders a list attachment with items
 * @param {MessageAttachmentList} attachment List attachment data
 * @returns {JSX.Element} Rendered list
 */

function ListCard({ attachment }: { attachment: MessageAttachmentList }) {
	if (attachment.items.length === 0) {
		return <div className="py-3 text-center text-xs text-gray-400">{attachment.emptyText || "Aucun element."}</div>;
	}

	return (
		<div className="space-y-1.5">
			{attachment.items.map((item) => (
				<div
					key={item.id}
					className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-white/60 px-3 py-2 transition-all duration-200 hover:border-gray-200 hover:shadow-sm dark:border-gray-700/50 dark:bg-gray-800/30 dark:hover:border-gray-600"
				>
					{/* Icon */}
					{item.icon && (
						<div className="bg-primary-50 dark:bg-primary-900/20 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
							<Icon name={item.icon as IconName} size="xs" className="text-primary-500" />
						</div>
					)}

					{/* Content */}
					<div className="min-w-0 flex-1">
						<div className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">
							{item.label}
						</div>
						{item.description && (
							<div className="truncate text-[10px] text-gray-400">{item.description}</div>
						)}
					</div>

					{/* Badge */}
					{item.badge && (
						<span
							className={cn(
								"shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
								BADGE_VARIANTS[item.badgeVariant || "neutral"],
							)}
						>
							{item.badge}
						</span>
					)}
				</div>
			))}
		</div>
	);
}

/**
 * Renders a card attachment with key-value fields
 * @param {MessageAttachmentCard} attachment Card attachment data
 * @returns {JSX.Element} Rendered card
 */

function InfoCard({ attachment }: { attachment: MessageAttachmentCard }) {
	return (
		<div className="space-y-2 rounded-lg border border-gray-100 bg-white/60 p-3 dark:border-gray-700/50 dark:bg-gray-800/30">
			<div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{attachment.title}</div>
			<div className="space-y-1">
				{attachment.fields.map((field, i) => (
					<div key={i} className="flex items-center justify-between">
						<span className="text-[11px] text-gray-400">{field.label}</span>
						<span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{field.value}</span>
					</div>
				))}
			</div>
			{attachment.actions && attachment.actions.length > 0 && (
				<div className="flex gap-2 pt-1">
					{attachment.actions.map((action, i) => (
						<button
							key={i}
							className={cn(
								"flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
								action.variant === "primary" && "bg-primary-500 hover:bg-primary-600 text-white",
								action.variant === "cancel" &&
									"bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400",
								action.variant === "outline-danger" &&
									"border-error-300 text-error-600 hover:bg-error-50 dark:border-error-700 dark:text-error-400 border",
								!action.variant &&
									"bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400",
							)}
						>
							{action.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

/**
 * Renders a stats attachment with metric cards
 * @param {MessageAttachmentStats} attachment Stats attachment data
 * @returns {JSX.Element} Stats grid
 */

function StatsCard({ attachment }: { attachment: MessageAttachmentStats }) {
	return (
		<div className="space-y-2">
			<div className="grid grid-cols-2 gap-2">
				{attachment.stats.map((stat, i) => (
					<div
						key={i}
						className="rounded-lg border border-gray-100 bg-white/60 p-2.5 dark:border-gray-700/50 dark:bg-gray-800/30"
					>
						<div className="text-[10px] text-gray-400">{stat.label}</div>
						<div className="mt-0.5 flex items-center gap-1.5">
							<span className="text-lg font-bold text-gray-800 dark:text-white">{stat.value}</span>
							{stat.trend && (
								<span className={cn("text-xs font-medium", TREND_COLORS[stat.trend].color)}>
									{TREND_COLORS[stat.trend].arrow}
								</span>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Renders a navigation attachment with clickable links
 * @param {MessageAttachmentNavigation} attachment Navigation attachment data
 * @returns {JSX.Element} Navigation links grid
 */

function NavigationCard({ attachment }: { attachment: MessageAttachmentNavigation }) {
	return (
		<div className="grid grid-cols-2 gap-1.5">
			{attachment.links.map((link, i) => (
				<a
					key={i}
					href={link.href}
					className="hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 dark:hover:border-primary-700 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 flex items-center gap-2 rounded-lg border border-gray-100 bg-white/60 px-3 py-2 text-xs font-medium text-gray-700 transition-all duration-200 dark:border-gray-700/50 dark:bg-gray-800/30 dark:text-gray-300"
				>
					{link.icon && <Icon name={link.icon as IconName} size="xs" className="text-primary-400" />}
					<span className="truncate">{link.label}</span>
				</a>
			))}
		</div>
	);
}

/**
 * Renders a confirmation prompt card
 * @param {MessageAttachmentConfirm} attachment Confirm attachment data
 * @returns {JSX.Element} Confirmation card
 */

function ConfirmCard({ attachment }: { attachment: MessageAttachmentConfirm }) {
	return (
		<div className="border-warning-200 bg-warning-50/50 dark:border-warning-800/50 dark:bg-warning-900/10 space-y-2 rounded-lg border p-3">
			<div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{attachment.title}</div>
			<div className="text-[11px] text-gray-500 dark:text-gray-400">{attachment.description}</div>
			<div className="flex gap-2 pt-1">
				<button className="bg-primary-500 hover:bg-primary-600 flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all duration-200">
					{attachment.confirmLabel}
				</button>
				<button className="flex-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
					{attachment.cancelLabel}
				</button>
			</div>
		</div>
	);
}

/**
 * Rich action card that renders different attachment types.
 * @param {AssistantActionCardProps} props Component props
 * @param {MessageAttachment} props.attachment The attachment data to render
 * @returns {JSX.Element} The rendered attachment card
 */

export function AssistantActionCard({ attachment }: AssistantActionCardProps) {
	switch (attachment.type) {
		case "list":
			return <ListCard attachment={attachment} />;

		case "card":
			return <InfoCard attachment={attachment} />;

		case "stats":
			return <StatsCard attachment={attachment} />;

		case "navigation":
			return <NavigationCard attachment={attachment} />;

		case "confirm":
			return <ConfirmCard attachment={attachment} />;

		case "form":
			// Forms are handled inline by the flow system
			return null;

		default:
			return null;
	}
}
