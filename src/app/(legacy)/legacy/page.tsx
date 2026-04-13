"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHubStore } from "@/store/hub.store";
import { useDataStore } from "@/store/data.store";

/**
 * Backward-compatibility route.
 * Legacy mode now lives under /{groupId}/legacy.
 */
export default function LegacyDashboardRedirectPage() {
	const router = useRouter();
	const activeGroupId = useHubStore((s) => s.activeGroupId);
	const getEntitiesForCurrentUser = useDataStore((s) => s.getEntitiesForCurrentUser);

	useEffect(() => {
		const fallbackEntity = getEntitiesForCurrentUser()[0]?.id ?? "default";
		router.replace(`/${activeGroupId ?? fallbackEntity}/legacy`);
	}, [activeGroupId, getEntitiesForCurrentUser, router]);

	return null;
}
