"use client";

import { useEffect, useRef } from "react";
import { useUIStore } from "@/store/ui.store";
import { ModePopover } from "./mode-popover";
import type { ModePopoverConfig } from "./mode-popover";

const STREAMER_CONFIG: ModePopoverConfig = {
	icon: "eye",
	color: "teal",
	activateLabel: "Mode Streamer activé",
	deactivateLabel: "Mode Streamer désactivé",
	activateSubtitle: "Confidentialité renforcée pendant le stream",
	deactivateSubtitle: "Affichage standard rétabli",
	tooltip: "Double-cliquez pour basculer le mode Streamer",
	rings: 3,
};

export function StreamerModePopover() {
	const streamerMode = useUIStore((s) => s.streamerMode);
	const toggleStreamerMode = useUIStore((s) => s.toggleStreamerMode);
	const setStreamerMode = useUIStore((s) => s.setStreamerMode);
	const streamRef = useRef<MediaStream | null>(null);

	// Auto-detect screen share via Display Media API
	useEffect(() => {
		const original = navigator.mediaDevices?.getDisplayMedia?.bind(navigator.mediaDevices);
		if (!original) return;

		const patched = async function (constraints?: DisplayMediaStreamOptions) {
			const stream = await original(constraints);
			streamRef.current = stream;
			setStreamerMode(true);

			stream.getTracks().forEach((track) => {
				track.addEventListener("ended", () => {
					streamRef.current = null;
					setStreamerMode(false);
				});
			});

			return stream;
		};

		navigator.mediaDevices.getDisplayMedia = patched;

		return () => {
			navigator.mediaDevices.getDisplayMedia = original;
		};
	}, [setStreamerMode]);

	return (
		<ModePopover config={STREAMER_CONFIG} isActive={streamerMode} onToggle={toggleStreamerMode} toggleDelay={200} />
	);
}
