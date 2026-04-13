import { redirect } from "next/navigation";

export default async function ModerationPanelRedirect({ params }: { params: Promise<{ groupId: string }> }) {
	const { groupId } = await params;
	redirect(`/hub/${groupId}/moderation/sanctions`);
}
