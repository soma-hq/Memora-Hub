import type { IconName } from "@/core/design/icons";
import { EmptyState } from "./empty-state";

interface StyledEmptyStateProps {
	icon: IconName;
	title: string;
	description: string;
	className?: string;
}

/** @deprecated Use EmptyState with variant="outlined" instead */
export function StyledEmptyState({ icon, title, description, className }: StyledEmptyStateProps) {
	return <EmptyState variant="outlined" icon={icon} title={title} description={description} className={className} />;
}
