import { redirect } from "next/navigation";

export default async function ModerationConsignesRedirect({ params }: { params: Promise<{ groupId: string }> }) {
	const { groupId } = await params;
	redirect(`/hub/${groupId}/moderation/centre-info`);
}
