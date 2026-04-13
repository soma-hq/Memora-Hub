import { redirect } from "next/navigation";

interface LegacyEntitySubpageProps {
	params: Promise<{
		groupId: string;
		page: string[];
	}>;
}

/**
 * Legacy entity-first routes are aliases for existing hub pages.
 * Keeps URLs in the form /{groupId}/legacy/<page> while reusing hub screens.
 */
export default async function LegacyEntitySubpage({ params }: LegacyEntitySubpageProps) {
	const resolvedParams = await params;
	const nextPath = (resolvedParams.page ?? []).join("/");
	redirect(`/hub/${resolvedParams.groupId}/${nextPath}`);
}
