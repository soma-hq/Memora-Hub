import { redirect } from "next/navigation";

export default async function ModYouTubePanelRedirect({ params }: { params: Promise<{ groupId: string }> }) {
	const { groupId } = await params;
	redirect(`/hub/${groupId}/mod-youtube/sanctions`);
}
