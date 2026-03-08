"use client";

import Image from "next/image";
import { Card, Badge, Icon } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { Formation } from "../types";


/** Props for the FormationCard component */
interface FormationCardProps {
	formation: Formation;
	onClick?: () => void;
}

/**
 * Training formation card with banner
 * @param props.formation - Formation data
 * @param props.onClick - Optional click handler
 * @returns Formation card with image and metadata
 */

export function FormationCard({ formation, onClick }: FormationCardProps) {
	// Render
	return (
		<Card hover={!!onClick} onClick={onClick} padding="sm" className="overflow-hidden p-0">
			{/* Banner image */}
			<div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
				<Image
					src={formation.banner}
					alt={formation.title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</div>

			<div className="space-y-3 p-4">
				<h3 className="text-base font-semibold text-gray-900 dark:text-white">{formation.title}</h3>

				<p className="line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
					{formation.description}
				</p>

				{/* Category and dispositif badges */}
				<div className="flex flex-wrap items-center gap-2 pt-1">
					<Badge variant="neutral" showDot={false}>
						{formation.category}
					</Badge>
					<Badge
						variant={
							formation.dispositif === "ATRIA"
								? "primary"
								: formation.dispositif === "PULSE"
									? "info"
									: "neutral"
						}
						showDot={false}
					>
						{formation.dispositif}
					</Badge>
				</div>

				{/* Duration and module count */}
				<div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
					<div className="flex items-center gap-1">
						<Icon name="clock" size="xs" className="text-gray-400" />
						<span>{formation.duration}</span>
					</div>
					<div className="flex items-center gap-1">
						<Icon name="folder" size="xs" className="text-gray-400" />
						<span>
							{formation.modules.length} module{formation.modules.length !== 1 ? "s" : ""}
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
