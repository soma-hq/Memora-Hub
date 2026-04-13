import { redirect } from "next/navigation";

export default async function ModTwitchConsignesRedirect({ params }: { params: Promise<{ groupId: string }> }) {
	const { groupId } = await params;
	redirect(`/hub/${groupId}/mod-twitch/centre-info`);
}
