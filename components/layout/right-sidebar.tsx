"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui";
import { useTheme } from "@/components/providers/theme-provider";
import { EntityModal } from "@/components/modals/entity-modal";
import { NotificationBell } from "@/features/communication/notifications/components/notification-bell";
import { useHubStore } from "@/store/hub.store";
import { useDataStore } from "@/store/data.store";
import { useAssistantStore } from "@/store/assistant.store";

interface RightSidebarProps {
	onSearchOpen?: () => void;
}

/**
 * Compact right sidebar replacing the top header on desktop.
 * Holds global actions and dashboard mode controls.
 */
export function RightSidebar({ onSearchOpen }: RightSidebarProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const currentUser = useDataStore((s) => s.currentUser);
	const entities = useDataStore((s) => s.entities);
	const getEntitiesForCurrentUser = useDataStore((s) => s.getEntitiesForCurrentUser);
	const { activeGroupId, setActiveGroup } = useHubStore();
	const toggleAssistant = useAssistantStore((s) => s.toggle);

	const [entityModalOpen, setEntityModalOpen] = useState(false);

	const accessibleEntities = getEntitiesForCurrentUser();
	const fallbackEntityId = activeGroupId ?? accessibleEntities[0]?.id ?? entities[0]?.id ?? "default";

	const cycleTheme = () => {
		if (theme === "light") setTheme("dark");
		else if (theme === "dark") setTheme("system");
		else setTheme("light");
	};

	const resolveEntityRoutePath = (entityId: string): string => {
		if (/^\/[^/]+\/legacy(?:\/|$)/.test(pathname)) {
			const segments = pathname.split("/");
			if (segments.length >= 2) {
				segments[1] = entityId;
				return segments.join("/");
			}
		}

		if (pathname.startsWith("/hub/")) {
			const segments = pathname.split("/");
			if (segments.length >= 3) {
				segments[2] = entityId;
				return segments.join("/");
			}
		}

		return `/hub/${entityId}`;
	};

	const handleEntitySelect = (entityId: string): void => {
		const selectedEntity = entities.find((entity) => entity.id === entityId);
		setActiveGroup(entityId, selectedEntity?.name ?? entityId);
		router.push(resolveEntityRoutePath(entityId));
	};

	return (
		<>
			<aside
				className="fixed top-1/2 right-2 z-40 hidden w-24 -translate-y-1/2 lg:flex"
				style={{ maxHeight: "calc(100vh - 10px)" }}
			>
				<div className="flex h-full w-full flex-col items-center gap-2">
					<button
						onClick={() => router.push("/settings/account")}
						title="Profil"
						className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full transition-all hover:scale-[1.03]"
					>
						{currentUser?.avatar ? (
							<Image
								src={currentUser.avatar}
								alt={currentUser.pseudo ?? "Profil"}
								width={48}
								height={48}
								className="h-full w-full object-cover"
							/>
						) : (
							<Icon name="profile" size="md" className="text-gray-500 dark:text-gray-300" />
						)}
					</button>

					<div className="w-full pt-1">
						<p className="mb-1.5 px-1 text-center text-[9px] font-bold tracking-[0.16em] text-gray-500 uppercase dark:text-gray-400">
							Actions
						</p>

						<div className="w-full rounded-2xl border border-gray-200/80 bg-white/90 px-1.5 py-2 dark:border-gray-700/70 dark:bg-gray-900/85">
							<div className="flex w-full flex-col items-center gap-1.5">
								<button
									onClick={cycleTheme}
									title="Theme"
									className="flex w-full flex-col items-center rounded-lg px-1.5 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
								>
									<Icon name="moon" size="sm" />
									<span className="mt-0.5 text-[9px] font-medium">Theme</span>
								</button>

								<button
									onClick={() => router.push("/settings/account")}
									title="Paramètres"
									className="flex w-full flex-col items-center rounded-lg px-1.5 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
								>
									<Icon name="settings" size="sm" />
									<span className="mt-0.5 text-[9px] font-medium">Settings</span>
								</button>

								<Link
									href={`/hub/${fallbackEntityId}/patchnotes`}
									title="Patchnotes"
									className="flex w-full flex-col items-center rounded-lg px-1.5 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
								>
									<Icon name="news" size="sm" />
									<span className="mt-0.5 text-[9px] font-medium">Patchnotes</span>
								</Link>

								<div className="flex w-full justify-center rounded-lg px-1.5 py-1">
									<NotificationBell />
								</div>

								<button
									onClick={onSearchOpen}
									title="Recherche"
									className="flex w-full flex-col items-center rounded-lg px-1.5 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
								>
									<Icon name="search" size="sm" />
									<span className="mt-0.5 text-[9px] font-medium">Search</span>
								</button>
							</div>
						</div>
					</div>

					<div className="w-full pt-1">
						<p className="mb-1.5 px-1 text-center text-[9px] font-bold tracking-[0.16em] text-gray-500 uppercase dark:text-gray-400">
							Memora
						</p>

						<div className="w-full rounded-2xl border border-gray-200/80 bg-white/90 px-1.5 py-2 dark:border-gray-700/70 dark:bg-gray-900/85">
							<div className="flex w-full flex-col items-center gap-1.5">
								<button
									onClick={toggleAssistant}
									title="Memora AI"
									className="flex w-full flex-col items-center rounded-lg px-1.5 py-1.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
								>
									<span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
										<Image
											src="/icons/memora-ai.svg"
											alt="Memora AI"
											width={24}
											height={24}
											className="h-6 w-6"
										/>
									</span>
									<span className="mt-0.5 text-[9px] font-medium">Memora AI</span>
								</button>

								<Link
									href={`/hub/${fallbackEntityId}/chat`}
									title="Chat"
									className="flex w-full flex-col items-center rounded-lg px-1.5 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
								>
									<Icon name="chat" size="sm" />
									<span className="mt-0.5 text-[9px] font-medium">Chat</span>
								</Link>

								<button
									onClick={() => setEntityModalOpen(true)}
									title="Squads"
									className="flex w-full flex-col items-center rounded-lg px-1.5 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
								>
									<Icon name="group" size="sm" />
									<span className="mt-0.5 text-[9px] font-medium">Squads</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</aside>

			<EntityModal
				isOpen={entityModalOpen}
				onClose={() => setEntityModalOpen(false)}
				activeEntityId={fallbackEntityId}
				onSelect={handleEntitySelect}
			/>
		</>
	);
}
