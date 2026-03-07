"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/ui.store";
import { useHubStore } from "@/store/hub.store";
import { ModePopover } from "./mode-popover";
import type { ModePopoverConfig } from "./mode-popover";

const ADMIN_CONFIG: ModePopoverConfig = {
	icon: "shield",
	color: "red",
	activateLabel: "Mode Admin",
	deactivateLabel: "Retour au Hub",
	activateSubtitle: "Administration activée",
	deactivateSubtitle: "Mode standard",
	tooltip: "Double-cliquez pour basculer le mode Admin",
};

export function AdminModePopover() {
	const adminMode = useUIStore((s) => s.adminMode);
	const toggleAdminMode = useUIStore((s) => s.toggleAdminMode);
	const { activeGroupId } = useHubStore();
	const router = useRouter();

	const handleToggle = useCallback(() => {
		toggleAdminMode();
		router.push(!adminMode ? "/admin" : `/hub/${activeGroupId ?? "default"}`);
	}, [adminMode, toggleAdminMode, router, activeGroupId]);

	return <ModePopover config={ADMIN_CONFIG} isActive={adminMode} onToggle={handleToggle} />;
}
