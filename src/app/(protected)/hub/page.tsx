"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/store/data.store";
import { useHubStore } from "@/store/hub.store";

/**
 * Canonical hub entry point.
 * Redirects to the active entity hub, or the first accessible one.
 */
export default function HubRootPage() {
	const router = useRouter();
	const activeGroupId = useHubStore((s) => s.activeGroupId);
	const getEntitiesForCurrentUser = useDataStore((s) => s.getEntitiesForCurrentUser);

	useEffect(() => {
		const fallbackEntityId = getEntitiesForCurrentUser()[0]?.id ?? "default";
		router.replace(`/hub/${activeGroupId ?? fallbackEntityId}`);
	}, [activeGroupId, getEntitiesForCurrentUser, router]);

	return null;
}
