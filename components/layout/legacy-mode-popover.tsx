"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/ui.store";
import { useHubStore } from "@/store/hub.store";
import { ModePopover } from "./mode-popover";
import type { ModePopoverConfig } from "./mode-popover";

const LEGACY_CONFIG: ModePopoverConfig = {
	icon: "folder",
	color: "orange",
	activateLabel: "Mode Legacy",
	deactivateLabel: "Retour au Hub",
	activateSubtitle: "Supervision activée",
	deactivateSubtitle: "Mode standard",
	tooltip: "Double-cliquez pour basculer le mode Legacy",
};

export function LegacyModePopover() {
	const legacyMode = useUIStore((s) => s.legacyMode);
	const toggleLegacyMode = useUIStore((s) => s.toggleLegacyMode);
	const { activeGroupId } = useHubStore();
	const router = useRouter();

	const handleToggle = useCallback(() => {
		toggleLegacyMode();
		router.push(!legacyMode ? "/legacy" : `/hub/${activeGroupId ?? "default"}`);
	}, [legacyMode, toggleLegacyMode, router, activeGroupId]);

	return <ModePopover config={LEGACY_CONFIG} isActive={legacyMode} onToggle={handleToggle} />;
}
