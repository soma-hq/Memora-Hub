import { redirect } from "next/navigation";

export default async function ModPolyvalentConsignesRedirect({ params }: { params: Promise<{ groupId: string }> }) {
	const { groupId } = await params;
	redirect(`/hub/${groupId}/mod-polyvalent/centre-info`);
}
