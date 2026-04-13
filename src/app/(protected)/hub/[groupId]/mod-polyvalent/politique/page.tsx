import { redirect } from "next/navigation";

export default async function ModPolyvalentPolitiqueRedirect({ params }: { params: Promise<{ groupId: string }> }) {
	const { groupId } = await params;
	redirect(`/hub/${groupId}/mod-polyvalent/sanctions`);
}
