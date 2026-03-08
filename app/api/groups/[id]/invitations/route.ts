import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GroupService } from "@/services/GroupService";
import { AuthService } from "@/services/AuthService";
import { resolveAuthorizedGroupId } from "@/lib/server/entity-scope";

const MODERATION_FUNCTIONS_ENUM = [
	"Modération Discord",
	"Modération Twitch",
	"Modération YouTube",
	"Modération Polyvalente",
] as const;

const DISPOSITIFS_ENUM = ["ATRIA", "PULSE"] as const;

const createInvitationSchema = z.object({
	email: z.string().email("Email invalide"),
	roleKey: z.string().min(2, "Role invalide"),
	requireA2F: z.boolean().optional(),
	firstConnection: z.boolean().optional(),
	expiresInDays: z.number().int().positive().max(365).optional(),
	/** Active la Période d'Intégration de Modération (Marsha Academy) pour ce membre */
	pimEnabled: z.boolean().optional(),
	/** Fonction de modération du Junior — requis si pimEnabled */
	pimFunction: z.enum(MODERATION_FUNCTIONS_ENUM).optional(),
	/** Dispositif de formation (ATRIA = débutant, PULSE = expérimenté) — requis si pimEnabled */
	pimDispositif: z.enum(DISPOSITIFS_ENUM).optional(),
	/** ID du référent assigné au Junior */
	pimReferentId: z.string().optional(),
});

/**
 * GET /api/groups/[id]/invitations
 * List invitations for a given entity.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	}

	const { id } = await params;
	const authorizedGroupId = resolveAuthorizedGroupId(currentUser, id);
	if (!authorizedGroupId) {
		return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
	}

	const invitations = await GroupService.listInvitations(authorizedGroupId);
	const blueprint = await GroupService.getBlueprint(authorizedGroupId);

	return NextResponse.json({ invitations, blueprint });
}

/**
 * POST /api/groups/[id]/invitations
 * Create an invitation and resolve permissions from the selected role template.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const currentUser = await AuthService.getCurrentUser();
	if (!currentUser) {
		return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
	}

	const { id } = await params;
	const authorizedGroupId = resolveAuthorizedGroupId(currentUser, id);
	if (!authorizedGroupId) {
		return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
	}

	const parsed = createInvitationSchema.safeParse(await request.json());
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Donnees invalides" }, { status: 400 });
	}

	const invitation = await GroupService.createInvitation(authorizedGroupId, {
		...parsed.data,
		invitedById: currentUser.id,
	});

	return NextResponse.json(invitation, { status: 201 });
}
