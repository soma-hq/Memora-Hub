/** Maps known entity IDs to themed media assets. */
const ENTITY_ASSETS: Record<
	string,
	{
		alertBanner: string;
		sidebarBanner: string;
		dashboardTexture: string;
	}
> = {
	anthony: {
		alertBanner: "/banners/anthony/anthony-banner.png",
		sidebarBanner: "/banners/anthony/anthony-banner.png",
		dashboardTexture: "/banners/boxes/banner-circle.png",
	},
	doigby: {
		alertBanner: "/banners/doigby/doigby-banner.png",
		sidebarBanner: "/banners/doigby/doigby-banner.png",
		dashboardTexture: "/banners/boxes/banner-cloud2.png",
	},
	inoxtag: {
		alertBanner: "/banners/inoxtag/inoxtag-banner.png",
		sidebarBanner: "/banners/inoxtag/inoxtag-banner.png",
		dashboardTexture: "/banners/boxes/banner-cloud.png",
	},
	michou: {
		alertBanner: "/banners/michou/michou-banner.png",
		sidebarBanner: "/banners/michou/michou-banner.png",
		dashboardTexture: "/banners/boxes/banner-cloud.png",
	},
	bazalthe: {
		alertBanner: "/banners/memora-banner.png",
		sidebarBanner: "/banners/memora-banner.png",
		dashboardTexture: "/banners/boxes/memora-banner.png",
	},
};

const OWNER_SIDEBAR_BANNER = "/banners/boxes/banner-rectangle.png";

/** Banner options available when creating a new entity/group. */
export const GROUP_BANNER_OPTIONS: Array<{ value: string; label: string }> = [
	{ value: "/banners/doigby/doigby-banner.png", label: "Doigby" },
	{ value: "/banners/michou/michou-banner.png", label: "Michou" },
	{ value: "/banners/inoxtag/inoxtag-banner.png", label: "Inoxtag" },
	{ value: "/banners/anthony/anthony-banner.png", label: "Anthony" },
	{ value: "/banners/memora-banner.png", label: "Memora" },
	{ value: "/banners/boxes/banner-rectangle.png", label: "Rectangle" },
	{ value: "/banners/boxes/banner-cloud.png", label: "Cloud" },
	{ value: "/banners/boxes/banner-cloud2.png", label: "Cloud 2" },
	{ value: "/banners/boxes/banner-circle.png", label: "Circle" },
	{ value: "/banners/boxes/memora-banner.png", label: "Memora Pattern" },
];

function normalizeEntityId(entityId?: string | null): string {
	return (entityId ?? "").trim().toLowerCase();
}

/** Returns the alert banner image path for an entity when available. */
export function getEntityAlertBanner(entityId?: string | null): string | null {
	const key = normalizeEntityId(entityId);
	return ENTITY_ASSETS[key]?.alertBanner ?? ENTITY_ASSETS.bazalthe.alertBanner;
}

/** Returns the banner image path for colored section headers. */
export function getEntityHeaderBanner(entityId?: string | null): string {
	return getEntityAlertBanner(entityId) ?? ENTITY_ASSETS.bazalthe.alertBanner;
}

/** Returns a lightweight dashboard texture for an entity. */
export function getEntityDashboardTexture(entityId?: string | null): string {
	const key = normalizeEntityId(entityId);
	return ENTITY_ASSETS[key]?.dashboardTexture ?? ENTITY_ASSETS.bazalthe.dashboardTexture;
}

/** Returns the sidebar background image for the selected entity. */
export function getEntitySidebarBanner(entityId?: string | null, ownerMode = false): string | null {
	if (ownerMode) return OWNER_SIDEBAR_BANNER;
	const key = normalizeEntityId(entityId);
	return ENTITY_ASSETS[key]?.sidebarBanner ?? ENTITY_ASSETS.bazalthe.sidebarBanner;
}
