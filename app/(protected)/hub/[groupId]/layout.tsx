"use client";

// React
import { useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useHubStore } from "@/store/hub.store";
import { useDataStore } from "@/store/data.store";

/**
 * Hub group layout that sets the active group context from URL params.
 * @param props - Component props
 * @param props.children - Nested hub page content
 * @returns The children wrapped with group context
 */
export default function HubLayout({ children }: { children: React.ReactNode }) {
	const params = useParams();
	const pathname = usePathname();
	const router = useRouter();
	const routeGroupId = params.groupId as string;
	const { setActiveGroup } = useHubStore();
	const currentUser = useDataStore((s) => s.currentUser);
	const entities = useDataStore((s) => s.entities);

	useEffect(() => {
		if (!routeGroupId) return;

		const hasFullAccess = currentUser?.entityAccess?.includes("*") ?? false;
		const hasEntityAccess = hasFullAccess || (currentUser?.entityAccess ?? []).includes(routeGroupId);

		if (!hasEntityAccess) {
			const fallbackEntityId = currentUser?.entityAccess?.[0] ?? entities[0]?.id;
			if (!fallbackEntityId) return;

			const nextPath = pathname.replace(`/hub/${routeGroupId}`, `/hub/${fallbackEntityId}`);
			router.replace(nextPath);
			return;
		}

		const activeEntity = entities.find((entity) => entity.id === routeGroupId);
		setActiveGroup(routeGroupId, activeEntity?.name ?? routeGroupId);
	}, [currentUser?.entityAccess, entities, pathname, routeGroupId, router, setActiveGroup]);

	return <>{children}</>;
}
