import { redirect } from "next/navigation";

export default async function ModYoutubePolitiqueRedirect({ params }: { params: Promise<{ groupId: string }> }) {
	const { groupId } = await params;
	redirect(`/hub/${groupId}/mod-youtube/sanctions`);
}
