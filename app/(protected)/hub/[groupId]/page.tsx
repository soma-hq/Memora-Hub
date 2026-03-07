"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BriefingSection } from "@/features/dashboard/components/briefing-section";
import { TodaySchedule } from "@/features/dashboard/components/today-schedule";
import { PendingActions } from "@/features/dashboard/components/pending-actions";
import { useDashboardBriefing } from "@/features/dashboard/hooks";
import { PatchnoteWidget } from "@/features/patchnotes/components/patchnote-widget";
import { PageContainer } from "@/components/layout/page-container";
import { Button, Badge, Icon, Tag, SectionHeaderBanner, StyledEmptyState } from "@/components/ui";
import { useHubStore } from "@/store/hub.store";
import { useDataStore } from "@/store/data.store";
import { cn } from "@/lib/utils/cn";
import { definePageConfig } from "@/structures";

const PAGE_CONFIG = definePageConfig({
	name: "hub/[groupId]",
	section: "protected",
	description: "Dashboard principal du groupe.",
	entityScoped: true,
});

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
	const { activeGroupName } = useHubStore();
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

				{/* Shared Events Section */}
				<div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
					<SectionHeaderBanner icon="calendar" title="Événements à venir" accentColor="gray" className="rounded-none">
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
