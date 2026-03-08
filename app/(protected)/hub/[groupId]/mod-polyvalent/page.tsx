import { redirect } from "next/navigation";

export default async function ModPolyvalentPanelRedirect({ params }: { params: Promise<{ groupId: string }> }) {
	const { groupId } = await params;
	redirect(`/hub/${groupId}/mod-polyvalent/sanctions`);
}
