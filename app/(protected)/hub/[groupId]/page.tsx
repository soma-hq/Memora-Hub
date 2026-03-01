"use client";

// React
import { useState } from "react";
import { useParams } from "next/navigation";
import { BriefingSection } from "@/features/dashboard/components/briefing-section";
import { TodaySchedule } from "@/features/dashboard/components/today-schedule";
import { PendingActions } from "@/features/dashboard/components/pending-actions";
import { useDashboardBriefing } from "@/features/dashboard/hooks";
import { PageContainer } from "@/components/layout/page-container";
import { RoleGuard } from "@/components/navigation/role-guard";
import { Card, Button, Badge, Icon, Tag } from "@/components/ui";
import { useHubStore } from "@/store/hub.store";
import { showSuccess } from "@/lib/utils/toast";
import { cn } from "@/lib/utils/cn";


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
		description: "Annonce de live pr\u00e9vu",
		defaultTitle: "Live \u2014 ",
		tagColor: "error",
	},
	{
		key: "exchange",
		emoji: "\u{1F4AC}",
		label: "Moment d'\u00e9change",
		description: "Discussion ou r\u00e9union d'\u00e9quipe",
		defaultTitle: "R\u00e9union \u2014 ",
		tagColor: "primary",
	},
	{
		key: "date",
		emoji: "\u{1F4C5}",
		label: "Date",
		description: "Date importante \u00e0 retenir",
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

const AUDIENCE_OPTIONS = [
	"Tous",
	"Division 0",
	"Division 1",
	"Division 2",
	"Division 3",
	"Legacy",
	"Marsha Team",
] as const;

// Page component

/**
 * Group dashboard page with personal briefing, schedule, actions, and shared events.
 * @returns The group hub dashboard
 */
export default function DashboardPage() {
	const params = useParams();
	const groupId = (params.groupId as string) || "default";
	const { activeGroupName } = useHubStore();

	// Current user ID (from auth context in the future, hardcoded for now)
	const userId = "u0";
	const briefing = useDashboardBriefing(userId);
	const userName = activeGroupName ?? "Utilisateur";

	// Events state
	const [events, setEvents] = useState<SharedEvent[]>([]);
	const [showEventForm, setShowEventForm] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState<EventTemplateKey | null>(null);
	const [eventTitle, setEventTitle] = useState("");
	const [eventDescription, setEventDescription] = useState("");
	const [eventDatetime, setEventDatetime] = useState("");
	const [eventAudience, setEventAudience] = useState<string[]>([]);

	const unansweredCount = events.filter((e) => e.userResponse === null).length;

	const getTemplate = (key: EventTemplateKey): EventTemplate => EVENT_TEMPLATES.find((t) => t.key === key)!;

	const handleSelectTemplate = (key: EventTemplateKey) => {
		const tpl = getTemplate(key);
		setSelectedTemplate(key);
		setEventTitle(tpl.defaultTitle);
		setEventDescription("");
		setEventDatetime("");
		setEventAudience([]);
	};

	const handleToggleAudience = (option: string) => {
		setEventAudience((prev) => (prev.includes(option) ? prev.filter((a) => a !== option) : [...prev, option]));
	};

	const handleCreateEvent = () => {
		if (!selectedTemplate || !eventTitle.trim() || !eventDatetime.trim()) return;
		const newEvent: SharedEvent = {
			id: `evt-${Date.now()}`,
			templateKey: selectedTemplate,
			title: eventTitle.trim(),
			description: eventDescription.trim(),
			datetime: eventDatetime.trim(),
			creator: userName,
			participants: 0,
			declines: 0,
			audience: eventAudience.length > 0 ? eventAudience : ["Tous"],
			userResponse: null,
		};
		setEvents((prev) => [newEvent, ...prev]);
		setShowEventForm(false);
		setSelectedTemplate(null);
		setEventTitle("");
		setEventDescription("");
		setEventDatetime("");
		setEventAudience([]);
		showSuccess(`\u00c9v\u00e9nement "${newEvent.title}" cr\u00e9\u00e9 avec succ\u00e8s`);
	};

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

	return (
		<PageContainer title="Dashboard" description="Vue d'ensemble de votre entit\u00e9">
			<div className="mx-auto max-w-5xl space-y-8">
				{/* Personal briefing */}
				<BriefingSection greeting={briefing.greeting} subtitle={briefing.subtitle} items={briefing.items} />

				{/* Schedule + Actions side by side */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<TodaySchedule items={briefing.todaySchedule} />
					<PendingActions items={briefing.pendingActions} />
				</div>

				{/* Shared Events Section */}
				<Card padding="lg">
					{/* Section header */}
					<div className="mb-5 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Icon name="calendar" size="lg" className="text-primary-500" />
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								{"\u00c9"}v{"\u00e9"}nements {"\u00e0"} venir
							</h3>
							{unansweredCount > 0 && (
								<span className="relative flex items-center gap-1">
									<Icon name="bell" size="sm" className="text-warning-500" />
									<Badge variant="warning" showDot={false}>
										{unansweredCount}
									</Badge>
								</span>
							)}
						</div>

						<RoleGuard minRole="Collaborator">
							<Button variant="primary" size="sm" onClick={() => setShowEventForm((prev) => !prev)}>
								<Icon name="calendar" size="sm" />
								<span className="ml-1.5">
									{showEventForm ? "Annuler" : "Cr\u00e9er un \u00e9v\u00e9nement"}
								</span>
							</Button>
						</RoleGuard>
					</div>

					{/* Inline event creation form */}
					{showEventForm && (
						<div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
							<h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
								Nouveau {"\u00e9"}v{"\u00e9"}nement
							</h4>

							{/* Template selector */}
							<div className="mb-4">
								<label className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
									Mod{"\u00e8"}le
								</label>
								<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
									{EVENT_TEMPLATES.map((tpl) => (
										<button
											key={tpl.key}
											type="button"
											onClick={() => handleSelectTemplate(tpl.key)}
											className={cn(
												"flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-center transition-all duration-150",
												selectedTemplate === tpl.key
													? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
													: "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-700",
											)}
										>
											<span className="text-lg">{tpl.emoji}</span>
											<span className="text-xs font-semibold">{tpl.label}</span>
											<span className="text-[10px] text-gray-400 dark:text-gray-500">
												{tpl.description}
											</span>
										</button>
									))}
								</div>
							</div>

							{selectedTemplate && (
								<div className="space-y-3">
									{/* Title */}
									<div>
										<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
											Titre
										</label>
										<input
											type="text"
											value={eventTitle}
											onChange={(e) => setEventTitle(e.target.value)}
											placeholder="Titre de l'événement"
											className="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none focus:ring-1 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
										/>
									</div>

									{/* Description */}
									<div>
										<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
											Description
										</label>
										<textarea
											value={eventDescription}
											onChange={(e) => setEventDescription(e.target.value)}
											placeholder="Décrivez l'événement..."
											rows={3}
											className="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none focus:ring-1 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
										/>
									</div>

									{/* Date & time */}
									<div>
										<label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
											Date et heure
										</label>
										<input
											type="datetime-local"
											value={eventDatetime}
											onChange={(e) => setEventDatetime(e.target.value)}
											className="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors outline-none focus:ring-1 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
										/>
									</div>

									{/* Audience multiselect */}
									<div>
										<label className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
											Audience
										</label>
										<div className="flex flex-wrap gap-2">
											{AUDIENCE_OPTIONS.map((option) => (
												<button
													key={option}
													type="button"
													onClick={() => handleToggleAudience(option)}
													className={cn(
														"rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
														eventAudience.includes(option)
															? "border-primary-500 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
															: "border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500",
													)}
												>
													{option}
												</button>
											))}
										</div>
									</div>

									{/* Submit */}
									<div className="flex justify-end pt-2">
										<Button
											variant="primary"
											size="sm"
											onClick={handleCreateEvent}
											disabled={!eventTitle.trim() || !eventDatetime.trim()}
										>
											<Icon name="check" size="sm" />
											<span className="ml-1.5">Cr&apos;er l&apos;événement</span>
										</Button>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Event cards */}
					<div className="space-y-3">
						{events.length === 0 && (
							<p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
								Aucun {"\u00e9"}v{"\u00e9"}nement {"\u00e0"} venir.
							</p>
						)}

						{events.map((evt) => {
							const tpl = getTemplate(evt.templateKey);
							const responseText: string[] = [];
							if (evt.participants > 0) {
								responseText.push(`${evt.participants} participant${evt.participants > 1 ? "s" : ""}`);
							}
							if (evt.declines > 0) {
								responseText.push(`${evt.declines} d\u00e9clin${evt.declines > 1 ? "s" : ""}`);
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
												<p className="text-xs text-gray-400 italic dark:text-gray-500">
													Aucune r{"\u00e9"}ponse pour le moment
												</p>
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
												<span className="ml-1">Je d{"\u00e9"}cline</span>
											</Button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</Card>
			</div>
		</PageContainer>
	);
}
