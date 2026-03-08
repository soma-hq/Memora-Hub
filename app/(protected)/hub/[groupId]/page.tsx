"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BriefingSection } from "@/features/system/dashboard/components/briefing-section";
import { TodaySchedule } from "@/features/system/dashboard/components/today-schedule";
import { PendingActions } from "@/features/system/dashboard/components/pending-actions";
import { useDashboardBriefing } from "@/features/system/dashboard/hooks";
import { PatchnoteWidget } from "@/features/admin/patchnotes/components/patchnote-widget";
import { PageContainer } from "@/components/layout/page-container";
import { Button, Badge, Icon, Tag, SectionHeaderBanner, StyledEmptyState } from "@/components/ui";
import { useDataStore } from "@/store/data.store";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/core/structures";
import { pimStatusVariantMap, dispositifVariantMap, periodVariantMap } from "@/features/academy/momentum/types";
import type { ModerationFunction, PimStatus, PimPeriod, Dispositif } from "@/features/academy/momentum/types";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]",
	section: "protected",
	description: "Dashboard principal du groupe.",
	entityScoped: true,
});

// ─── Mock Momentum data — remplacer par des appels API ───────────────────────

interface MomentumWidgetJunior {
	id: string;
	name: string;
	function: ModerationFunction;
	dispositif: Dispositif;
	currentPeriod: PimPeriod;
	pimStatus: PimStatus;
	nextVocalDate?: string;
}

const MOCK_MOMENTUM_JUNIORS: MomentumWidgetJunior[] = [
	{
		id: "j1",
		name: "Amine C.",
		function: "Modération Discord",
		dispositif: "ATRIA",
		currentPeriod: "Période 1",
		pimStatus: "En cours",
		nextVocalDate: "14 mars",
	},
	{
		id: "j2",
		name: "Léa M.",
		function: "Modération Twitch",
		dispositif: "PULSE",
		currentPeriod: "Période 2",
		pimStatus: "En cours",
		nextVocalDate: "10 mars",
	},
];

// Events system types & data

type EventTemplateKey = "live" | "exchange" | "date" | "info";

interface EventTemplate {
	key: EventTemplateKey;
	emoji: string;
	label: string;
	description: string;
	defaultTitle: string;
	tagColor: "error" | "primary" | "info" | "warning";
}

interface SharedEvent {
	id: string;
	templateKey: EventTemplateKey;
	title: string;
	description: string;
	datetime: string;
	creator: string;
	participants: number;
	declines: number;
	audience: string[];
	userResponse: "participating" | "declined" | null;
}

const EVENT_TEMPLATES: EventTemplate[] = [
	{
		key: "live",
		emoji: "\u{1F534}",
		label: "Live",
		description: "Annonce de live prévu",
		defaultTitle: "Live \u2014 ",
		tagColor: "error",
	},
	{
		key: "exchange",
		emoji: "\u{1F4AC}",
		label: "Moment d'échange",
		description: "Discussion ou réunion d'équipe",
		defaultTitle: "Réunion \u2014 ",
		tagColor: "primary",
	},
	{
		key: "date",
		emoji: "\u{1F4C5}",
		label: "Date",
		description: "Date importante à retenir",
		defaultTitle: "Date \u2014 ",
		tagColor: "info",
	},
	{
		key: "info",
		emoji: "\u{2139}\u{FE0F}",
		label: "Informations importantes",
		description: "Communication officielle",
		defaultTitle: "Info \u2014 ",
		tagColor: "warning",
	},
];

/**
 * Resolves an event template by its key.
 * @param {EventTemplateKey} key - Template key
 * @returns {EventTemplate} Matching template
 */

function getTemplate(key: EventTemplateKey): EventTemplate {
	return EVENT_TEMPLATES.find((t) => t.key === key)!;
}

/**
 * Group dashboard page with personal briefing, schedule, actions, and shared events.
 * @returns {JSX.Element} The group hub dashboard
 */

export default function DashboardPage() {
	const params = useParams();
	const groupId = (params.groupId as string) || "default";
	const currentUser = useDataStore((s) => s.currentUser);

	// Resolve user ID from auth state, fallback for dev
	const userId = currentUser?.id ?? "u0";
	const briefing = useDashboardBriefing(userId);

	// Events state
	const [events, setEvents] = useState<SharedEvent[]>([]);

	const unansweredCount = events.filter((e) => e.userResponse === null).length;

	/**
	 * Handles user response to an event (participate or decline toggle).
	 * @param {string} eventId - Event ID
	 * @param {"participating" | "declined"} response - User response
	 */

	const handleEventResponse = (eventId: string, response: "participating" | "declined") => {
		setEvents((prev) =>
			prev.map((evt) => {
				if (evt.id !== eventId) return evt;
				const wasParticipating = evt.userResponse === "participating";
				const wasDeclined = evt.userResponse === "declined";
				const isSameResponse = evt.userResponse === response;

				if (isSameResponse) {
					return {
						...evt,
						userResponse: null,
						participants: wasParticipating ? evt.participants - 1 : evt.participants,
						declines: wasDeclined ? evt.declines - 1 : evt.declines,
					};
				}

				return {
					...evt,
					userResponse: response,
					participants:
						response === "participating"
							? evt.participants + 1
							: wasParticipating
								? evt.participants - 1
								: evt.participants,
					declines:
						response === "declined" ? evt.declines + 1 : wasDeclined ? evt.declines - 1 : evt.declines,
				};
			}),
		);
	};

	// Render
	return (
		<PageContainer title="Dashboard" description="Vue d'ensemble de votre entité">
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Personal briefing */}
				<BriefingSection greeting={briefing.greeting} subtitle={briefing.subtitle} items={briefing.items} />

				{/* Schedule + Actions side by side */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<TodaySchedule items={briefing.todaySchedule} />
					<PendingActions items={briefing.pendingActions} />
				</div>

				{/* Latest update */}
				<PatchnoteWidget />

				{/* Momentum widget */}
				{MOCK_MOMENTUM_JUNIORS.length > 0 && (
					<div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
						<SectionHeaderBanner
							icon="training"
							title="Momentum — Marsha Academy"
							description="Juniors en PIM actifs sur cette entité"
							accentColor="primary"
							className="rounded-none"
						>
							<Link href={`/hub/${groupId}/training`}>
								<Button variant="outline-neutral" size="sm">
									Voir tout
								</Button>
							</Link>
						</SectionHeaderBanner>

						<div className="divide-y divide-gray-100 dark:divide-gray-700/50">
							{MOCK_MOMENTUM_JUNIORS.map((junior) => (
								<Link
									key={junior.id}
									href={`/hub/${groupId}/training/pim/${junior.id}`}
									className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
								>
									<div className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
										{junior.name.charAt(0)}
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{junior.name}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">{junior.function}</p>
									</div>
									<div className="flex shrink-0 flex-wrap items-center gap-1.5">
										<Badge variant={dispositifVariantMap[junior.dispositif]} showDot={false}>
											{junior.dispositif}
										</Badge>
										<Badge variant={periodVariantMap[junior.currentPeriod]} showDot={false}>
											{junior.currentPeriod}
										</Badge>
										{junior.nextVocalDate && (
											<Tag color="gray">
												<Icon name="calendar" size="xs" className="mr-1 inline-block" />
												{junior.nextVocalDate}
											</Tag>
										)}
									</div>
									<Icon
										name="chevronRight"
										size="sm"
										className="shrink-0 text-gray-400 dark:text-gray-500"
									/>
								</Link>
							))}
						</div>
					</div>
				)}

				{/* Shared Events Section */}
				<div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
					<SectionHeaderBanner
						icon="calendar"
						title="Événements à venir"
						accentColor="gray"
						className="rounded-none"
					>
						{unansweredCount > 0 && (
							<Badge variant="warning" showDot={false}>
								{unansweredCount}
							</Badge>
						)}
					</SectionHeaderBanner>
					{/* Event cards */}
					<div className="space-y-3 p-4">
						{events.length === 0 && (
							<StyledEmptyState
								icon="calendar"
								title="Aucun événement à venir"
								description="Les prochains événements de votre groupe apparaîtront ici."
							/>
						)}

						{events.map((evt) => {
							const tpl = getTemplate(evt.templateKey);
							const responseText: string[] = [];
							if (evt.participants > 0) {
								responseText.push(`${evt.participants} participant${evt.participants > 1 ? "s" : ""}`);
							}
							if (evt.declines > 0) {
								responseText.push(`${evt.declines} déclin${evt.declines > 1 ? "s" : ""}`);
							}

							return (
								<div
									key={evt.id}
									className="group rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:hover:border-gray-600 dark:hover:shadow-lg"
								>
									<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
										{/* Left content */}
										<div className="flex-1 space-y-2">
											<div className="flex flex-wrap items-center gap-2">
												<Tag color={tpl.tagColor}>
													{tpl.emoji} {tpl.label}
												</Tag>
												<h4 className="text-sm font-semibold text-gray-900 dark:text-white">
													{evt.title}
												</h4>
											</div>

											{evt.description && (
												<p className="text-sm text-gray-500 dark:text-gray-400">
													{evt.description}
												</p>
											)}

											<div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
												<span className="flex items-center gap-1">
													<Icon name="clock" size="xs" />
													{evt.datetime}
												</span>
												<span className="flex items-center gap-1">
													<Icon name="profile" size="xs" />
													{evt.creator}
												</span>
												{evt.audience.length > 0 && (
													<span className="flex items-center gap-1">
														<Icon name="users" size="xs" />
														{evt.audience.join(", ")}
													</span>
												)}
											</div>

											{/* Response count */}
											{responseText.length > 0 && (
												<p className="text-xs font-medium text-gray-500 dark:text-gray-400">
													{responseText.join(" \u2022 ")}
												</p>
											)}
											{responseText.length === 0 && (
												<StyledEmptyState
													icon="chat"
													title="Aucune réponse pour le moment"
													description="Les réponses apparaîtront ici."
												/>
											)}
										</div>

										{/* Response buttons */}
										<div className="flex gap-2 sm:flex-shrink-0">
											<Button
												variant={
													evt.userResponse === "participating" ? "primary" : "outline-neutral"
												}
												size="sm"
												onClick={() => handleEventResponse(evt.id, "participating")}
											>
												<Icon name="check" size="xs" />
												<span className="ml-1">Je participe</span>
											</Button>
											<Button
												variant={
													evt.userResponse === "declined"
														? "outline-danger"
														: "outline-neutral"
												}
												size="sm"
												onClick={() => handleEventResponse(evt.id, "declined")}
											>
												<Icon name="close" size="xs" />
												<span className="ml-1">Je d{"é"}cline</span>
											</Button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
