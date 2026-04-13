import { redirect } from "next/navigation";

export default async function ModYouTubeConsignesRedirect({ params }: { params: Promise<{ groupId: string }> }) {
	const { groupId } = await params;
	redirect(`/hub/${groupId}/mod-youtube/centre-info`);
}
