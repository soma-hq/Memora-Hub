"use client";

// React
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useHubStore } from "@/store/hub.store";


/**
 * Hub group layout that sets the active group context from URL params.
 * @param props - Component props
 * @param props.children - Nested hub page content
 * @returns The children wrapped with group context
 */
export default function HubLayout({ children }: { children: React.ReactNode }) {
	const params = useParams();
	const groupId = params.groupId as string;
	const { setActiveGroup } = useHubStore();

	useEffect(() => {
		if (groupId) {
			setActiveGroup(groupId, groupId);
		}
	}, [groupId, setActiveGroup]);

	return <>{children}</>;
}
