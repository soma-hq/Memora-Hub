import { redirect } from "next/navigation";

export default async function ModTwitchPanelRedirect({ params }: { params: Promise<{ groupId: string }> }) {
	const { groupId } = await params;
	redirect(`/hub/${groupId}/mod-twitch/sanctions`);
}
